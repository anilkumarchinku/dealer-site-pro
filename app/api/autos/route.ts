/**
 * Autos API Route
 * GET /api/autos - List three-wheelers from local JSON files with filtering, sorting, and pagination
 */

import { createStaticVehicleListHandler } from '@/lib/services/static-vehicle-catalog-service'
import { loadThreeWheelerCatalogVehicles } from '@/lib/services/three-wheeler-static-catalog'

export const GET = createStaticVehicleListHandler({
    loadVehicles: loadThreeWheelerCatalogVehicles,
    typeValues: ['electric', 'passenger', 'cargo'],
    makeFilterMode: 'exact',
    errorLabel: 'autos',
})
