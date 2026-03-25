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
import { createClient } from '@supabase/supabase-js'
import { sendLeadSmsToDealer } from '@/lib/services/sms-service'
import { forwardLeadToCyepro } from '@/lib/services/cyepro-service'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { logger } from '@/lib/utils/logger'

// ── Supabase client with SERVICE ROLE key (server-side only — bypasses RLS) ──
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// Allowed lead_source values
const VALID_SOURCES = new Set(['contact_form', 'car_enquiry', 'test_drive', 'whatsapp', 'phone', 'price_alert'])

export async function POST(request: NextRequest) {
    try {
        // ── Rate limiting (3 leads per IP per hour) ───────────────────────────
        const rateLimitResponse = await rateLimitOrNull('leads', request, 3, 60 * 60 * 1000)
        if (rateLimitResponse) return rateLimitResponse

        const body = await request.json()
        const { dealer_id, name, phone, email, message, car_id, car_name, lead_source } = body

        // Extract referer to know which exact website this lead came from
        const referer = request.headers.get('referer') || 'Direct/Unknown'

        // ── Validate required fields ──────────────────────────────────────────
        if (!dealer_id || !name || !phone) {
            return NextResponse.json(
                { error: 'dealer_id, name and phone are required' },
                { status: 400 }
            )
        }

        // Basic type / length validation
        if (typeof dealer_id !== 'string' || typeof name !== 'string' || typeof phone !== 'string') {
            return NextResponse.json({ error: 'Invalid field types' }, { status: 400 })
        }
        if (name.length > 100 || phone.length > 20) {
            return NextResponse.json({ error: 'Invalid field length' }, { status: 400 })
        }
        if (email && (typeof email !== 'string' || email.length > 254)) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
        }
        if (message && (typeof message !== 'string' || message.length > 1000)) {
            return NextResponse.json({ error: 'Message too long' }, { status: 400 })
        }

        // Sanitise lead_source — never trust client values verbatim
        const safeSource = lead_source && VALID_SOURCES.has(lead_source) ? lead_source : 'contact_form'

        const supabase = getSupabase()

        // ── Verify dealer_id exists and is active (prevent phantom leads) ─────
        const { data: dealer, error: dealerErr } = await supabase
            .from('dealers')
            .select('id, dealership_name, phone, cyepro_api_key')
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

        // ── Insert lead ───────────────────────────────────────────────────────
        const { data, error } = await supabase
            .from('leads')
            .insert({
                dealer_id,
                customer_name: name.trim(),
                customer_phone: phone.trim(),
                customer_email: email?.trim() ?? null,
                message: message?.trim() ?? null,
                vehicle_id: car_id ?? null,
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
        if (dealer.cyepro_api_key) {
            forwardLeadToCyepro(dealer.cyepro_api_key, {
                customerName:  name.trim(),
                customerPhone: phone.trim(),
                customerEmail: email?.trim(),
                vehicleName:   car_name?.trim(),
                message:       message?.trim(),
                leadSource:    safeSource,
            }).catch(() => { /* already logged inside */ })
        }

        return NextResponse.json({ success: true, leadId: data.id })
    } catch (err) {
        logger.error('Lead API error:', err)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
