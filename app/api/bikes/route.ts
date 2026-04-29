/**
 * Bikes API Route
 * GET /api/bikes - List two-wheelers from local JSON files with filtering, sorting, and pagination
 */

import { createStaticVehicleListHandler } from '@/lib/services/static-vehicle-catalog-service'
import { loadTwoWheelerCatalogVehicles } from '@/lib/services/two-wheeler-static-catalog'

export const GET = createStaticVehicleListHandler({
    loadVehicles: loadTwoWheelerCatalogVehicles,
    typeValues: ['electric', 'scooter', 'bike'],
    makeFilterMode: 'csv',
    includePriceFilters: true,
    errorLabel: 'bikes',
})
