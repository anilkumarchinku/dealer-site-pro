/**
 * GET  /api/three-wheelers/used  — Public
 * POST /api/three-wheelers/used  — Dealer
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { getUsedThreeWheelers, addUsedThreeWheeler } from '@/lib/db/three-wheelers'
import type { ThreeWheelerUsedFilters } from '@/lib/types/three-wheeler'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const dealerId = searchParams.get('dealerId')
    if (!dealerId) return NextResponse.json({ error: 'dealerId is required' }, { status: 400 })

    const filters: ThreeWheelerUsedFilters = {
        type:           searchParams.get('type')           as ThreeWheelerUsedFilters['type']           ?? undefined,
        brand:          searchParams.get('brand')           ?? undefined,
        fuelType:       searchParams.get('fuelType')        as ThreeWheelerUsedFilters['fuelType']       ?? undefined,
        conditionGrade: searchParams.get('conditionGrade')  as ThreeWheelerUsedFilters['conditionGrade'] ?? undefined,
        sortBy:         searchParams.get('sortBy')          as ThreeWheelerUsedFilters['sortBy']         ?? 'newest',
        maxKm:          searchParams.get('maxKm')    ? Number(searchParams.get('maxKm'))    : undefined,
        minPrice:       searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice:       searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        page:           searchParams.get('page')     ? Number(searchParams.get('page'))     : 1,
        pageSize:       searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }

    const result = await getUsedThreeWheelers(dealerId, filters)
    return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
    const rateLimit = rateLimitOrNull('thw_used_create', request, 30, 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

    const body = await request.json()
    const result = await addUsedThreeWheeler(dealer.id, body)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}
