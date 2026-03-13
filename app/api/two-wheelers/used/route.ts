/**
 * GET  /api/two-wheelers/used  — Public: list used 2W vehicles
 * POST /api/two-wheelers/used  — Dealer: add used vehicle
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { getUsedTwoWheelers, addUsedTwoWheeler } from '@/lib/db/two-wheelers'
import type { TwoWheelerUsedFilters } from '@/lib/types/two-wheeler'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const dealerId = searchParams.get('dealerId')
    if (!dealerId) {
        return NextResponse.json({ error: 'dealerId is required' }, { status: 400 })
    }

    const filters: TwoWheelerUsedFilters = {
        type:           searchParams.get('type')           as TwoWheelerUsedFilters['type'] ?? undefined,
        brand:          searchParams.get('brand')          ?? undefined,
        fuelType:       searchParams.get('fuelType')       as TwoWheelerUsedFilters['fuelType'] ?? undefined,
        conditionGrade: searchParams.get('conditionGrade') as TwoWheelerUsedFilters['conditionGrade'] ?? undefined,
        sortBy:         searchParams.get('sortBy')         as TwoWheelerUsedFilters['sortBy'] ?? 'newest',
        minPrice:       searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice:       searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        maxKm:          searchParams.get('maxKm')    ? Number(searchParams.get('maxKm'))    : undefined,
        page:           searchParams.get('page')     ? Number(searchParams.get('page'))     : 1,
        pageSize:       searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }

    const result = await getUsedTwoWheelers(dealerId, filters)
    return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('tw_used_create', request, 30, 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

    const body = await request.json()
    const result = await addUsedTwoWheeler(dealer.id, body)

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}
