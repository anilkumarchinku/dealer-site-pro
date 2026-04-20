/**
 * GET /api/two-wheelers     — Public: list new 2W vehicles for a dealer (by dealerId query param)
 * POST /api/two-wheelers    — Dealer: add new 2W vehicle (authenticated)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import {
    getTwoWheelerVehicles,
    addTwoWheelerVehicle,
} from '@/lib/db/two-wheelers'
import type { TwoWheelerFilters } from '@/lib/types/two-wheeler'
import { hydrateTwoWheelerWithJson } from '@/lib/data/two-wheeler-detail'
import { dedupeByBrandModel } from '@/lib/utils/listing-dedupe'

// ── GET (public) ───────────────────────────────────────────────

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const dealerId = searchParams.get('dealerId')
    if (!dealerId) {
        return NextResponse.json({ error: 'dealerId is required' }, { status: 400 })
    }

    const filters: TwoWheelerFilters = {
        type:        searchParams.get('type') as TwoWheelerFilters['type'] ?? undefined,
        brand:       searchParams.get('brand') ?? undefined,
        fuelType:    searchParams.get('fuelType') as TwoWheelerFilters['fuelType'] ?? undefined,
        stockStatus: searchParams.get('stockStatus') as TwoWheelerFilters['stockStatus'] ?? undefined,
        sortBy:      searchParams.get('sortBy') as TwoWheelerFilters['sortBy'] ?? 'newest',
        minPrice:    searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice:    searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        page:        searchParams.get('page')     ? Number(searchParams.get('page'))     : 1,
        pageSize:    searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }

    const result = await getTwoWheelerVehicles(dealerId, filters)
    const vehicles = dedupeByBrandModel(result.vehicles).map(hydrateTwoWheelerWithJson)
    return NextResponse.json({
        ...result,
        vehicles,
    })
}

// ── POST (dealer, authenticated) ──────────────────────────────

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('tw_vehicle_create', request, 30, 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

    const body = await request.json()
    const result = await addTwoWheelerVehicle(dealer.id, body)

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}
