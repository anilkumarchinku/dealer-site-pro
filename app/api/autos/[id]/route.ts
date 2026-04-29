/**
 * Auto Detail API Route
 * GET /api/autos/[id] - Fetch a single three-wheeler by ID from local JSON files
 *
 * ID format: {brandId}-{modelSlug}-{index}
 */

import { createStaticVehicleDetailHandler } from '@/lib/services/static-vehicle-catalog-service'
import { findThreeWheelerCatalogVehicleById } from '@/lib/services/three-wheeler-static-catalog'

export const GET = createStaticVehicleDetailHandler({
    findVehicleById: findThreeWheelerCatalogVehicleById,
    errorLabel: 'auto detail',
})
