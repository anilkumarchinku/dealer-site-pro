/**
 * GET  /api/two-wheelers/used  — Public: list used 2W vehicles
 * POST /api/two-wheelers/used  — Dealer: add used vehicle
 */

import { addUsedTwoWheeler, getUsedTwoWheelers } from '@/lib/db/two-wheelers'
import type { TwoWheelerUsedFilters } from '@/lib/types/two-wheeler'
import { createUsedVehicleCollectionRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'

const handlers = createUsedVehicleCollectionRouteHandlers({
    rateLimitKey: 'tw_used_create',
    buildFilters: (searchParams: URLSearchParams): TwoWheelerUsedFilters => ({
        type: searchParams.get('type') as TwoWheelerUsedFilters['type'] ?? undefined,
        brand: searchParams.get('brand') ?? undefined,
        fuelType: searchParams.get('fuelType') as TwoWheelerUsedFilters['fuelType'] ?? undefined,
        conditionGrade: searchParams.get('conditionGrade') as TwoWheelerUsedFilters['conditionGrade'] ?? undefined,
        sortBy: searchParams.get('sortBy') as TwoWheelerUsedFilters['sortBy'] ?? 'newest',
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        maxKm: searchParams.get('maxKm') ? Number(searchParams.get('maxKm')) : undefined,
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }),
    getVehicles: getUsedTwoWheelers,
    addVehicle: addUsedTwoWheeler,
})

export const GET = handlers.GET
export const POST = handlers.POST
