/**
 * GET  /api/three-wheelers/used  — Public
 * POST /api/three-wheelers/used  — Dealer
 */

import { addUsedThreeWheeler, getUsedThreeWheelers } from '@/lib/db/three-wheelers'
import type { ThreeWheelerUsedFilters } from '@/lib/types/three-wheeler'
import { createUsedVehicleCollectionRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'

const handlers = createUsedVehicleCollectionRouteHandlers({
    rateLimitKey: 'thw_used_create',
    buildFilters: (searchParams: URLSearchParams): ThreeWheelerUsedFilters => ({
        type: searchParams.get('type') as ThreeWheelerUsedFilters['type'] ?? undefined,
        brand: searchParams.get('brand') ?? undefined,
        fuelType: searchParams.get('fuelType') as ThreeWheelerUsedFilters['fuelType'] ?? undefined,
        conditionGrade: searchParams.get('conditionGrade') as ThreeWheelerUsedFilters['conditionGrade'] ?? undefined,
        sortBy: searchParams.get('sortBy') as ThreeWheelerUsedFilters['sortBy'] ?? 'newest',
        maxKm: searchParams.get('maxKm') ? Number(searchParams.get('maxKm')) : undefined,
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }),
    getVehicles: getUsedThreeWheelers,
    addVehicle: addUsedThreeWheeler,
})

export const GET = handlers.GET
export const POST = handlers.POST
