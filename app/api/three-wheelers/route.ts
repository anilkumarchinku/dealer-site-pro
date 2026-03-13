/**
 * GET  /api/three-wheelers  — Public: list 3W vehicles
 * POST /api/three-wheelers  — Dealer: add new vehicle
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { getThreeWheelerVehicles, addThreeWheelerVehicle } from '@/lib/db/three-wheelers'
import type { ThreeWheelerFilters } from '@/lib/types/three-wheeler'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const dealerId = searchParams.get('dealerId')
    if (!dealerId) return NextResponse.json({ error: 'dealerId is required' }, { status: 400 })

    const filters: ThreeWheelerFilters = {
        type:        searchParams.get('type')        as ThreeWheelerFilters['type']     ?? undefined,
        brand:       searchParams.get('brand')        ?? undefined,
        fuelType:    searchParams.get('fuelType')     as ThreeWheelerFilters['fuelType'] ?? undefined,
        bodyType:    searchParams.get('bodyType')     as ThreeWheelerFilters['bodyType'] ?? undefined,
        stockStatus: searchParams.get('stockStatus')  as ThreeWheelerFilters['stockStatus'] ?? undefined,
        sortBy:      searchParams.get('sortBy')       as ThreeWheelerFilters['sortBy']   ?? 'newest',
        minPrice:    searchParams.get('minPrice')  ? Number(searchParams.get('minPrice'))  : undefined,
        maxPrice:    searchParams.get('maxPrice')  ? Number(searchParams.get('maxPrice'))  : undefined,
        page:        searchParams.get('page')      ? Number(searchParams.get('page'))      : 1,
        pageSize:    searchParams.get('pageSize')  ? Number(searchParams.get('pageSize'))  : 20,
    }

    const result = await getThreeWheelerVehicles(dealerId, filters)
    return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('thw_vehicle_create', request, 30, 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

    const body = await request.json()
    const result = await addThreeWheelerVehicle(dealer.id, body)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}
