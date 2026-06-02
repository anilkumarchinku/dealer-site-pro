import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, getDealerForUser, requireAuth } from '@/lib/supabase-server'
import {
    carServiceBookingSchema,
    formatZodErrors,
    updateCarServiceStatusSchema,
} from '@/lib/validations/schemas'
import { logger } from '@/lib/utils/logger'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

function getSupabase() {
    // car_service_bookings is added by this feature's migration; generated DB types may lag locally.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createAdminClient() as any
}

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('car_service_booking', request, 5, 10 * 60 * 1000)
    if (rateLimit) return rateLimit

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const parsed = carServiceBookingSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: formatZodErrors(parsed.error) }, { status: 400 })
    }

    const input = parsed.data
    const supabase = getSupabase()

    const { data: dealer, error: dealerError } = await supabase
        .from('dealers')
        .select('id')
        .eq('id', input.dealer_id)
        .maybeSingle()

    if (dealerError || !dealer) {
        return NextResponse.json({ error: 'Invalid dealer' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('car_service_bookings')
        .insert({
            ...input,
            email: input.email || null,
            vehicle_reg_no: input.vehicle_reg_no || null,
            vehicle_make: input.vehicle_make || null,
            vehicle_model: input.vehicle_model || null,
            service_location: input.service_location || null,
            notes: input.notes || null,
        })
        .select('id')
        .single()

    if (error) {
        logger.error('Car service booking insert error:', error)
        return NextResponse.json({ error: 'Failed to create service booking' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 })
}

export async function GET(request: NextRequest) {
    const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(routeSupabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 404 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const pageSize = Math.min(Number(searchParams.get('pageSize') ?? 50), 100)
    const supabase = getSupabase()

    let query = supabase
        .from('car_service_bookings')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealer.id)
        .order('created_at', { ascending: false })
        .limit(pageSize)

    if (status) query = query.eq('status', status)

    const { data, error, count } = await query
    if (error) {
        logger.error('Car service booking fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch service bookings' }, { status: 500 })
    }

    return NextResponse.json({ bookings: data ?? [], total: count ?? 0 })
}

export async function PATCH(request: NextRequest) {
    const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(routeSupabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 404 })

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const parsed = updateCarServiceStatusSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: formatZodErrors(parsed.error) }, { status: 400 })
    }

    const input = parsed.data
    const supabase = getSupabase()
    const { error } = await supabase
        .from('car_service_bookings')
        .update({
            status: input.status,
            assigned_partner: input.assigned_partner || null,
            referral_url: input.referral_url || null,
            admin_notes: input.admin_notes || null,
        })
        .eq('id', input.id)
        .eq('dealer_id', dealer.id)

    if (error) {
        logger.error('Car service booking update error:', error)
        return NextResponse.json({ error: 'Failed to update service booking' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
