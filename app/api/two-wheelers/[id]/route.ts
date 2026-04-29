/**
 * GET    /api/two-wheelers/[id]  — Public: get single vehicle
 * PUT    /api/two-wheelers/[id]  — Dealer: update vehicle
 * DELETE /api/two-wheelers/[id]  — Dealer: soft-delete vehicle
 */

import {
    deleteTwoWheelerVehicle,
    getTwoWheelerVehicleById,
    getTwoWheelerVehicles,
    incrementTwoWheelerViews,
    updateTwoWheelerVehicle,
} from '@/lib/db/two-wheelers'
import { getTwoWheelerCatalog } from '@/lib/data/two-wheelers'
import { getTwoWheelerCatalogFromDB } from '@/lib/data/catalog-db'
import { hydrateTwoWheelerDetail } from '@/lib/data/two-wheeler-detail'
import { createVehicleDetailRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'

const handlers = createVehicleDetailRouteHandlers({
    vehicleType: 'two-wheeler',
    catalogPrefix: 'cat-2w',
    dbPrefix: 'tw-',
    getVehicleById: getTwoWheelerVehicleById,
    getVehicles: getTwoWheelerVehicles,
    getCatalogFromDB: getTwoWheelerCatalogFromDB,
    getFallbackCatalog: getTwoWheelerCatalog,
    hydrateVehicle: hydrateTwoWheelerDetail,
    incrementViews: incrementTwoWheelerViews,
    updateVehicle: updateTwoWheelerVehicle,
    deleteVehicle: deleteTwoWheelerVehicle,
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
