import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import {
    createThreeWheelerServiceBooking,
    getThreeWheelerServiceBookings,
    updateThreeWheelerServiceBookingStatus,
} from '@/lib/db/three-wheelers'
import type { ThreeWheelerServiceStatus } from '@/lib/types/three-wheeler'

export async function POST(request: NextRequest) {
    const rateLimit = rateLimitOrNull('thw_svc_create', request, 5, 10 * 60 * 1000)
    if (rateLimit) return rateLimit

    const body = await request.json().catch(() => null)
    if (!body || !body.dealer_id || !body.customer_name || !body.phone || !body.service_type || !body.preferred_date || !body.preferred_slot) {
        return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const result = await createThreeWheelerServiceBooking({ status: 'pending', ...body })
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}

export async function GET(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const status   = searchParams.get('status') as ThreeWheelerServiceStatus | null
    const page     = Number(searchParams.get('page') ?? 1)
    const pageSize = Number(searchParams.get('pageSize') ?? 50)

    const result = await getThreeWheelerServiceBookings(dealer.id, { status: status ?? undefined, page, pageSize })
    return NextResponse.json(result)
}

export async function PATCH(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

    const { id, status } = await request.json()
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })

    const result = await updateThreeWheelerServiceBookingStatus(id, dealer.id, status)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
}
