import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

const lookupSchema = z.object({
    slug: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
}).refine(data => Boolean(data.phone?.trim() || data.email?.trim()), {
    message: 'Phone or email is required',
})

function normalizePhone(value?: string) {
    const digits = value?.replace(/\D/g, '') ?? ''
    return digits.length > 10 ? digits.slice(-10) : digits
}

function contactOrFilter(phone?: string, email?: string, phoneColumn = 'customer_phone', emailColumn = 'customer_email') {
    const clauses: string[] = []
    const digits = normalizePhone(phone)
    // Require a full 10-digit number — short inputs would scan/enumerate many customers
    if (digits.length === 10) clauses.push(`${phoneColumn}.ilike.%${digits}%`)
    if (email?.trim()) clauses.push(`${emailColumn}.ilike.${email.trim().toLowerCase()}`)
    return clauses.join(',')
}

export async function POST(request: NextRequest) {
    const limited = await rateLimitOrNull('customer_panel', request, 10, 60_000)
    if (limited) return limited

    const body = await request.json().catch(() => null)
    const parsed = lookupSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid lookup payload' }, { status: 400 })
    }

    const { slug, phone, email } = parsed.data
    const admin = createAdminClient() as any

    const { data: dealer, error: dealerError } = await admin
        .from('dealers')
        .select('id, slug, dealership_name, location, full_address, phone, whatsapp, email, branches, tagline')
        .eq('slug', slug)
        .maybeSingle()

    if (dealerError || !dealer) {
        return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })
    }

    const today = new Date().toISOString().slice(0, 10)
    const customerFilter = contactOrFilter(phone, email)
    const sellerFilter = contactOrFilter(phone, email, 'seller_phone', 'seller_email')

    const [leadsResult, testDrivesResult, sellRequestsResult, vehiclesResult, offersResult] = await Promise.all([
        admin
            .from('leads')
            .select('id, customer_name, customer_phone, customer_email, lead_type, status, vehicle_interest, message, created_at')
            .eq('dealer_id', dealer.id)
            .or(customerFilter)
            .order('created_at', { ascending: false })
            .limit(20),
        admin
            .from('test_drive_bookings')
            .select('id, customer_name, customer_phone, customer_email, vehicle_interest, preferred_date, preferred_time, status, created_at')
            .eq('dealer_id', dealer.id)
            .or(customerFilter)
            .order('preferred_date', { ascending: false })
            .limit(20),
        admin
            .from('sell_requests')
            .select('id, seller_name, seller_phone, seller_email, make, model, variant, year, expected_price, status, preferred_date, created_at')
            .or(`dealer_id.eq.${dealer.id},dealer_id.is.null`)
            .or(sellerFilter)
            .order('created_at', { ascending: false })
            .limit(20),
        admin
            .from('vehicles')
            .select('id, make, model, variant, year, price_paise, fuel_type, transmission, mileage_km, status, created_at')
            .eq('dealer_id', dealer.id)
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .limit(8),
        admin
            .from('dealer_offers')
            .select('id, title, description, tag, valid_until, created_at')
            .eq('dealer_id', dealer.id)
            .eq('is_active', true)
            .or(`valid_until.is.null,valid_until.gte.${today}`)
            .order('created_at', { ascending: false })
            .limit(8),
    ])

    if (leadsResult.error || testDrivesResult.error || sellRequestsResult.error) {
        return NextResponse.json({ error: 'Failed to load customer activity' }, { status: 500 })
    }

    return NextResponse.json({
        dealer,
        history: {
            inquiries: leadsResult.data ?? [],
            test_drives: testDrivesResult.data ?? [],
            sell_requests: sellRequestsResult.data ?? [],
        },
        new_arrivals: vehiclesResult.data ?? [],
        offers: offersResult.data ?? [],
    })
}
