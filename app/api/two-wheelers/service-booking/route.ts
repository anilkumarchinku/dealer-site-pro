/**
 * POST /api/two-wheelers/service-booking  — Public (anon): book a service
 * GET  /api/two-wheelers/service-booking  — Dealer: list service bookings
 * PATCH                                   — Dealer: update booking status
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import {
    createServiceBooking,
    getServiceBookings,
    updateServiceBookingStatus,
} from '@/lib/db/two-wheelers'
import type { ServiceBookingFilters, TwoWheelerServiceStatus } from '@/lib/types/two-wheeler'

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('tw_service_booking', request, 5, 10 * 60 * 1000)
    if (rateLimit) return rateLimit

    const body = await request.json()
    const { dealer_id, customer_name, phone, service_type, preferred_date, preferred_slot } = body

    if (!dealer_id || !customer_name || !phone || !service_type || !preferred_date || !preferred_slot) {
        return NextResponse.json(
            { error: 'dealer_id, customer_name, phone, service_type, preferred_date, and preferred_slot are required' },
            { status: 400 }
        )
    }

    const result = await createServiceBooking({
        dealer_id,
        customer_name,
        phone,
        vehicle_make:   body.vehicle_make  ?? null,
        vehicle_model:  body.vehicle_model ?? null,
        vehicle_year:   body.vehicle_year  ?? null,
        km_reading:     body.km_reading    ?? null,
        service_type,
        preferred_date,
        preferred_slot,
    })

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
    }
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}

export async function GET(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const filters: ServiceBookingFilters = {
        status:   searchParams.get('status')   as TwoWheelerServiceStatus ?? undefined,
        page:     searchParams.get('page')     ? Number(searchParams.get('page'))   : 1,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }

    const result = await getServiceBookings(dealer.id, filters)
    return NextResponse.json(result)
}

export async function PATCH(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

    const { id, status } = await request.json()
    if (!id || !status) {
        return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const result = await updateServiceBookingStatus(id, dealer.id, status)
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
}
