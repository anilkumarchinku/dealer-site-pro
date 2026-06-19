/**
 * POST /api/leads
 * Anonymous — visitors from dealer sites submit enquiries.
 *
 * Body: {
 *   dealer_id: string  (required — validated against DB)
 *   name: string       (required)
 *   phone: string      (required)
 *   email?: string
 *   message?: string
 *   car_id?: string    (vehicle they're enquiring about)
 *   car_name?: string  (human-readable car name for display)
 *   lead_source?: string  e.g. 'contact_form' | 'car_enquiry' | 'test_drive'
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { sendLeadSmsToDealer } from '@/lib/services/sms-service'
import { forwardLeadToCyepro } from '@/lib/services/cyepro-service'
import { sendLeadConfirmationEmail, sendLeadNotificationEmail } from '@/lib/services/email-service'

import { logger } from '@/lib/utils/logger'
import { leadSchema, formatZodErrors } from '@/lib/validations/schemas'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// ── Supabase client with SERVICE ROLE key (server-side only — bypasses RLS) ──
function getSupabase() {
    return createAdminClient()
}

async function resolveVehicleId(
    supabase: ReturnType<typeof getSupabase>,
    rawCarId?: string | null
) {
    const trimmedCarId = rawCarId?.trim()
    if (!trimmedCarId || !UUID_PATTERN.test(trimmedCarId)) {
        return null
    }

    const { data, error } = await supabase
        .from('vehicles')
        .select('id')
        .eq('id', trimmedCarId)
        .maybeSingle()

    if (error) {
        logger.warn('Lead vehicle lookup failed:', error.message)
        return null
    }

    const vehicleRow = data as { id: string } | null
    return vehicleRow?.id ?? null
}

async function markCyeproSyncResult(
    leadId: string,
    dealerApiKey: string | null,
    payload: {
        customerName: string
        customerPhone: string
        customerEmail?: string
        vehicleName?: string
        message?: string
        leadSource?: string
    }
) {
    const supabase = getSupabase()

    if (!dealerApiKey) {
        const { error } = await supabase
            .from('leads')
            .update({
                cyepro_sync_status: 'skipped',
                cyepro_error: 'Dealer has no Cyepro API key configured',
            })
            .eq('id', leadId)

        if (error) logger.warn('Cyepro sync status update failed:', error.message)
        return
    }

    const result = await forwardLeadToCyepro(dealerApiKey, payload)
    const { error } = await supabase
        .from('leads')
        .update(result.success
            ? {
                cyepro_sync_status: 'synced',
                cyepro_synced_at: new Date().toISOString(),
                cyepro_error: null,
                cyepro_lead_id: result.cyeproLeadId ?? null,
            }
            : {
                cyepro_sync_status: 'failed',
                cyepro_error: result.error.slice(0, 1000),
            })
        .eq('id', leadId)

    if (error) logger.warn('Cyepro sync status update failed:', error.message)
}


export async function POST(request: NextRequest) {
    try {
        const limited = await rateLimitOrNull("lead_create", request, 5, 60000); if (limited) return limited;
        const body = await request.json()

        // Extract referer to know which exact website this lead came from
        const referer = request.headers.get('referer') || 'Direct/Unknown'

        // ── Validate with Zod ───────────────────────────────────────────────
        const parsed = leadSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: formatZodErrors(parsed.error) },
                { status: 400 }
            )
        }
        const { dealer_id, name, phone, email, message, car_id, car_name, lead_source } = parsed.data
        const safeSource = lead_source

        const supabase = getSupabase()

        // ── Idempotency: reject duplicate leads within a 5-minute window ──────
        // Prevents double-submission when a user taps the button twice or the
        // network retries the request on a timeout.
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { data: recentLead } = await supabase
            .from('leads')
            .select('id')
            .eq('dealer_id', dealer_id)
            .eq('customer_phone', phone.trim())
            .gte('created_at', fiveMinutesAgo)
            .limit(1)
            .maybeSingle()

        if (recentLead) {
            // Return the existing lead ID so the frontend behaves as if it succeeded
            return NextResponse.json({ success: true, leadId: recentLead.id, duplicate: true })
        }

        // ── Verify dealer_id exists and is active (prevent phantom leads) ─────
        const { data: dealer, error: dealerErr } = await supabase
            .from('dealers')
            .select('id, dealership_name, phone, email, cyepro_api_key')
            .eq('id', dealer_id)
            .single()

        if (dealerErr || !dealer) {
            return NextResponse.json(
                { error: 'Invalid dealer' },
                { status: 400 }
            )
        }

        // Map lead_source to lead_type
        const leadTypeMap: Record<string, string> = {
            'contact_form': 'inquiry',
            'car_enquiry': 'inquiry',
            'test_drive': 'test_drive',
            'whatsapp': 'inquiry',
            'phone': 'inquiry',
            'price_alert': 'inquiry',
        }

        const vehicleId = await resolveVehicleId(supabase, car_id)

        // ── Insert lead ───────────────────────────────────────────────────────
        const { data, error } = await supabase
            .from('leads')
            .insert({
                dealer_id,
                customer_name: name.trim(),
                customer_phone: phone.trim(),
                customer_email: email?.trim() ?? null,
                message: message?.trim() ?? null,
                vehicle_id: vehicleId,
                vehicle_interest: car_name?.trim() ?? null,
                lead_type: leadTypeMap[safeSource] ?? 'inquiry',
                source: 'website',
                utm_source: referer,
                status: 'new',
            })
            .select('id')
            .single()

        if (error) {
            logger.error('Lead insert error:', error.message, error.details, error.hint)
            return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 })
        }

        // ── SMS notification to dealer (fire-and-forget) ──────────────────────
        if (dealer.email) {
            sendLeadNotificationEmail({
                to: dealer.email,
                dealerName: dealer.dealership_name,
                customerName: name.trim(),
                customerPhone: phone.trim(),
                customerEmail: email?.trim(),
                vehicleName: car_name?.trim(),
                message: message?.trim(),
                leadSource: safeSource,
                replyTo: email?.trim() || undefined,
            }).catch(() => { /* already logged inside */ })
        }

        if (email?.trim()) {
            sendLeadConfirmationEmail({
                to: email.trim(),
                dealerName: dealer.dealership_name,
                customerName: name.trim(),
                vehicleName: car_name?.trim(),
            }).catch(() => { /* already logged inside */ })
        }

        if (dealer.phone) {
            sendLeadSmsToDealer({
                dealerPhone: dealer.phone,
                dealerName: dealer.dealership_name,
                customerName: name.trim(),
                customerPhone: phone.trim(),
                carName: car_name ?? undefined,
                leadSource: safeSource,
            }).catch(() => { /* already logged inside */ })
        }

        // ── Forward to Cyepro CRM if dealer has API key (fire-and-forget) ─────
        markCyeproSyncResult(
            data.id,
            dealer.cyepro_api_key,
            {
                customerName:  name.trim(),
                customerPhone: phone.trim(),
                customerEmail: email?.trim(),
                vehicleName:   car_name?.trim(),
                message:       message?.trim(),
                leadSource:    safeSource,
            }
        ).catch(() => { /* already logged inside */ })

        return NextResponse.json({ success: true, leadId: data.id })
    } catch (err) {
        logger.error('Lead API error:', err)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
