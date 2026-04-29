/**
 * Bike Detail API Route
 * GET /api/bikes/[id] - Fetch a single two-wheeler by ID from local JSON files
 *
 * ID format: {brandId}-{modelSlug}-{index}
 */

import { createStaticVehicleDetailHandler } from '@/lib/services/static-vehicle-catalog-service'
import { findTwoWheelerCatalogVehicleById } from '@/lib/services/two-wheeler-static-catalog'

export const GET = createStaticVehicleDetailHandler({
    findVehicleById: findTwoWheelerCatalogVehicleById,
    errorLabel: 'bike detail',
})
