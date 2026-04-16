/**
 * POST /api/two-wheelers/leads  — Public (anon): submit a 2W lead
 * GET  /api/two-wheelers/leads  — Dealer: fetch their leads
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { createTwoWheelerLead, getTwoWheelerLeads, updateTwoWheelerLeadStatus } from '@/lib/db/two-wheelers'
import { forwardLeadToCyepro } from '@/lib/services/cyepro-service'
import { createClient } from '@supabase/supabase-js'
import type { TwoWheelerLeadFilters, TwoWheelerLeadStatus } from '@/lib/types/two-wheeler'
import { twLeadSchema, updateLeadStatusSchema, formatZodErrors } from '@/lib/validations/schemas'

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
}

// ── POST (public / anon) ──────────────────────────────────────

export async function POST(request: NextRequest) {
    // Rate limit: 5 leads per IP per 10 minutes
    const rateLimit = await rateLimitOrNull('tw_lead_submit', request, 5, 10 * 60 * 1000)
    if (rateLimit) return rateLimit

    const body = await request.json()

    // ── Validate with Zod ───────────────────────────────────────────────
    const parsed = twLeadSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: formatZodErrors(parsed.error) },
            { status: 400 }
        )
    }
    const { dealer_id, lead_type, name, phone, email, vehicle_id, vehicle_name, used_vehicle_id, preferred_date, message, offer_price_paise } = parsed.data

    // ── Idempotency: reject duplicate 2W leads within a 5-minute window ───────
    const supabaseCheck = getSupabase()
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: recentLead } = await supabaseCheck
        .from('two_wheeler_leads')
        .select('id')
        .eq('dealer_id', dealer_id)
        .eq('phone', phone.trim())
        .gte('created_at', fiveMinutesAgo)
        .limit(1)
        .maybeSingle()

    if (recentLead) {
        return NextResponse.json({ success: true, id: recentLead.id, duplicate: true }, { status: 200 })
    }

    const result = await createTwoWheelerLead({
        dealer_id,
        vehicle_id:        vehicle_id        ?? null,
        used_vehicle_id:   used_vehicle_id   ?? null,
        lead_type,
        name,
        phone,
        email:             email             ?? null,
        preferred_date:    preferred_date    ?? null,
        message:           message           ?? null,
        offer_price_paise: offer_price_paise ?? null,
    })

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // ── Forward to Cyepro CRM if dealer has API key (fire-and-forget) ─────────
    const supabase = getSupabase()
    const { data: dealer } = await supabase
        .from('dealers')
        .select('cyepro_api_key')
        .eq('id', dealer_id)
        .single()

    if (dealer?.cyepro_api_key) {
        forwardLeadToCyepro(dealer.cyepro_api_key, {
            customerName:  name,
            customerPhone: phone,
            customerEmail: email        ?? undefined,
            vehicleName:   vehicle_name ?? undefined,
            message:       message      ?? undefined,
            leadSource:    lead_type,
        }).catch(() => { /* already logged inside */ })
    }

    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}

// ── GET (dealer, authenticated) ───────────────────────────────

export async function GET(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const filters: TwoWheelerLeadFilters = {
        leadType: searchParams.get('leadType') as TwoWheelerLeadFilters['leadType'] ?? undefined,
        status:   searchParams.get('status')   as TwoWheelerLeadStatus              ?? undefined,
        page:     searchParams.get('page')     ? Number(searchParams.get('page'))   : 1,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }

    const result = await getTwoWheelerLeads(dealer.id, filters)
    return NextResponse.json(result)
}

// ── PATCH (dealer): update lead status ────────────────────────

export async function PATCH(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

    const patchBody = await request.json()
    const parsedPatch = updateLeadStatusSchema.safeParse(patchBody)
    if (!parsedPatch.success) {
        return NextResponse.json({ error: formatZodErrors(parsedPatch.error) }, { status: 400 })
    }
    const { id, status } = parsedPatch.data

    const result = await updateTwoWheelerLeadStatus(id, dealer.id, status)
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
}
