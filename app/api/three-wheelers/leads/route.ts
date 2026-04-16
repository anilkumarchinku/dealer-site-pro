import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { createThreeWheelerLead, getThreeWheelerLeads, updateThreeWheelerLeadStatus } from '@/lib/db/three-wheelers'
import { forwardLeadToCyepro } from '@/lib/services/cyepro-service'
import { createClient } from '@supabase/supabase-js'
import type { ThreeWheelerLeadStatus } from '@/lib/types/three-wheeler'
import { thwLeadSchema, formatZodErrors } from '@/lib/validations/schemas'

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
}

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('thw_lead_create', request, 5, 10 * 60 * 1000)
    if (rateLimit) return rateLimit

    const body = await request.json().catch(() => null)
    if (!body) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // ── Validate with Zod ───────────────────────────────────────────────
    const parsed = thwLeadSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: formatZodErrors(parsed.error) },
            { status: 400 }
        )
    }
    const { dealer_id, lead_type, name, phone, email, vehicle_id, vehicle_name, used_vehicle_id, preferred_date, message, offer_price_paise } = parsed.data

    // ── Idempotency: reject duplicate 3W leads within a 5-minute window ───────
    const supabaseCheck = getSupabase()
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: recentLead } = await supabaseCheck
        .from('three_wheeler_leads')
        .select('id')
        .eq('dealer_id', dealer_id)
        .eq('phone', phone.trim())
        .gte('created_at', fiveMinutesAgo)
        .limit(1)
        .maybeSingle()

    if (recentLead) {
        return NextResponse.json({ success: true, id: recentLead.id, duplicate: true }, { status: 200 })
    }

    const result = await createThreeWheelerLead({
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
        fleet_size:        null,
        status:            'new',
    })
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })

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
            customerEmail: email           ?? undefined,
            vehicleName:   vehicle_name    ?? undefined,
            message:       message         ?? undefined,
            leadSource:    lead_type,
        }).catch(() => { /* already logged inside */ })
    }

    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}

export async function GET(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const status   = searchParams.get('status') as ThreeWheelerLeadStatus | null
    const page     = Number(searchParams.get('page') ?? 1)
    const pageSize = Number(searchParams.get('pageSize') ?? 50)

    const result = await getThreeWheelerLeads(dealer.id, { status: status ?? undefined, page, pageSize })
    return NextResponse.json(result)
}

export async function PATCH(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

    const { id, status } = await request.json()
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })

    const result = await updateThreeWheelerLeadStatus(id, dealer.id, status)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
}
