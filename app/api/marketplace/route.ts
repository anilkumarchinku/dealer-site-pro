/**
 * GET /api/marketplace
 * Cross-dealer inventory search — returns real vehicles for sale across all dealers.
 *
 * Query params:
 *   make         — comma-separated makes, e.g. "Maruti Suzuki,Hyundai"
 *   fuel_type    — comma-separated, e.g. "Petrol,Electric"
 *   exclude_fuel — comma-separated fuels to exclude, e.g. "Electric,CNG"
 *   condition    — "new" | "used" | "certified_pre_owned"
 *   category     — "four_wheeler" | "two_three_wheeler" | "fleet" | "bus"
 *   city         — partial match on dealer location, e.g. "Mumbai"
 *   minPrice     — INR, e.g. 300000
 *   maxPrice     — INR, e.g. 2000000
 *   sortBy       — "newest" | "price_low" | "price_high" (default: newest)
 *   page         — 1-indexed (default: 1)
 *   pageSize     — results per page (default: 12, max: 48)
 */

// Body type mapping per vehicle category
const CATEGORY_BODY_TYPES: Record<string, string[]> = {
    two_three_wheeler: ['Motorcycle', 'Scooter', 'Moped', 'Two-Wheeler', 'Three-Wheeler', 'Auto', 'E-Rickshaw'],
    fleet:             ['Truck', 'Tempo', 'Commercial', 'Van', 'Pickup', 'Mini Truck'],
    bus:               ['Bus', 'Coach', 'Mini Bus', 'School Bus'],
    four_wheeler:      [], // default — exclude 2/3 wheelers, bus, fleet
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl   = process.env.NEXT_PUBLIC_SUPABASE_URL   ?? ''
const supabaseAnon  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

function getSupabase() {
    if (!supabaseUrl || !supabaseAnon) return null
    return createClient(supabaseUrl, supabaseAnon)
}

export async function GET(req: NextRequest) {
    const supabase = getSupabase()
    if (!supabase) {
        return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 })
    }

    const sp       = req.nextUrl.searchParams
    const page     = Math.max(1, parseInt(sp.get('page') ?? '1'))
    const pageSize = Math.min(48, Math.max(1, parseInt(sp.get('pageSize') ?? '12')))
    const from     = (page - 1) * pageSize
    const to       = from + pageSize - 1

    // Build query — vehicles joined with dealers via dealer_id
    let query = supabase
        .from('vehicles')
        .select(`
            id, make, model, variant, year, price_paise, mileage_km,
            color, transmission, fuel_type, condition, features,
            description, views, created_at,
            dealers (
                id, dealership_name, slug, location, logo_url
            )
        `, { count: 'exact' })
        .eq('status', 'available')

    // Filters
    const makes = sp.get('make')?.split(',').map(m => m.trim()).filter(Boolean) ?? []
    if (makes.length === 1) {
        query = query.ilike('make', `%${makes[0]}%`)
    } else if (makes.length > 1) {
        query = query.in('make', makes)
    }

    const fuels = sp.get('fuel_type')?.split(',').map(f => f.trim()).filter(Boolean) ?? []
    if (fuels.length === 1) {
        query = query.eq('fuel_type', fuels[0])
    } else if (fuels.length > 1) {
        query = query.in('fuel_type', fuels)
    }

    // Exclude certain fuel types (used for "Non-EV" toggle)
    const excludeFuels = sp.get('exclude_fuel')?.split(',').map(f => f.trim()).filter(Boolean) ?? []
    for (const ef of excludeFuels) {
        query = query.neq('fuel_type', ef)
    }

    // Vehicle category filter (maps to body_type)
    const category = sp.get('category') ?? 'four_wheeler'
    const bodyTypes = CATEGORY_BODY_TYPES[category] ?? []
    if (bodyTypes.length > 0) {
        query = query.in('body_type', bodyTypes)
    } else if (category === 'four_wheeler') {
        // Exclude non-4-wheeler body types
        const exclude4w = [
            ...CATEGORY_BODY_TYPES.two_three_wheeler,
            ...CATEGORY_BODY_TYPES.fleet,
            ...CATEGORY_BODY_TYPES.bus,
        ]
        for (const bt of exclude4w) {
            query = query.neq('body_type', bt)
        }
    }

    const condition = sp.get('condition')
    if (condition) query = query.eq('condition', condition)

    const city = sp.get('city')?.trim()
    if (city) query = query.ilike('dealers.location', `%${city}%`)

    const minPrice = parseFloat(sp.get('minPrice') ?? '0')
    const maxPrice = parseFloat(sp.get('maxPrice') ?? '0')
    if (minPrice > 0) query = query.gte('price_paise', Math.round(minPrice * 100))
    if (maxPrice > 0) query = query.lte('price_paise', Math.round(maxPrice * 100))

    // Sort
    const sortBy = sp.get('sortBy') ?? 'newest'
    if (sortBy === 'price_low')  query = query.order('price_paise', { ascending: true })
    else if (sortBy === 'price_high') query = query.order('price_paise', { ascending: false })
    else query = query.order('created_at', { ascending: false })   // newest

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
        console.error('[Marketplace API]', error.message)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Aggregate filter options from the result set (for sidebar counts)
    const totalPages = Math.ceil((count ?? 0) / pageSize)

    return NextResponse.json({
        success: true,
        data: {
            vehicles: data ?? [],
            total:     count ?? 0,
            page,
            pageSize,
            totalPages,
        },
    })
}
