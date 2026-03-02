/**
 * GET /api/two-wheelers/bookings  — Dealer: list payment bookings
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { getTwoWheelerBookings } from '@/lib/db/two-wheelers'

export async function GET(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page     = searchParams.get('page')     ? Number(searchParams.get('page'))     : 1
    const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20

    const result = await getTwoWheelerBookings(dealer.id, page, pageSize)
    return NextResponse.json(result)
}
