/**
 * GET    /api/three-wheelers/[id]  — Public
 * PUT    /api/three-wheelers/[id]  — Dealer
 * DELETE /api/three-wheelers/[id]  — Dealer (soft delete)
 */

import {
    deleteThreeWheelerVehicle,
    getThreeWheelerVehicleById,
    getThreeWheelerVehicles,
    incrementThreeWheelerViews,
    updateThreeWheelerVehicle,
} from '@/lib/db/three-wheelers'
import { getThreeWheelerCatalog } from '@/lib/data/three-wheelers'
import { getThreeWheelerCatalogFromDB } from '@/lib/data/catalog-db'
import { hydrateThreeWheelerWithJson } from '@/lib/data/three-wheeler-detail'
import { createVehicleDetailRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'

const handlers = createVehicleDetailRouteHandlers({
    vehicleType: 'three-wheeler',
    catalogPrefix: 'cat-3w',
    dbPrefix: 'thw-',
    getVehicleById: getThreeWheelerVehicleById,
    getVehicles: getThreeWheelerVehicles,
    getCatalogFromDB: getThreeWheelerCatalogFromDB,
    getFallbackCatalog: getThreeWheelerCatalog,
    hydrateVehicle: hydrateThreeWheelerWithJson,
    incrementViews: incrementThreeWheelerViews,
    updateVehicle: updateThreeWheelerVehicle,
    deleteVehicle: deleteThreeWheelerVehicle,
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
