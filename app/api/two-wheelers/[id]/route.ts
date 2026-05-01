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
import { getTwoWheelerCatalog, TWO_WHEELER_BRANDS } from '@/lib/data/two-wheelers'
import { getTwoWheelerCatalogFromDB, getTwoWheelerCatalogVehicleById } from '@/lib/data/catalog-db'
import { hydrateTwoWheelerDetail } from '@/lib/data/two-wheeler-detail'
import { createVehicleDetailRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'

function sourceCatalogId(id: string): string | null {
    return id.match(/^cat-2w-\d+-(.+)$/)?.[1] ?? null
}

async function getTwoWheelerDetailVehicleById(id: string, dealerId?: string) {
    const inventoryVehicle = await getTwoWheelerVehicleById(id, dealerId)
    if (inventoryVehicle || !dealerId) return inventoryVehicle

    const catalogId = sourceCatalogId(id)
    if (!catalogId) return null

    const dbCatalogVehicle = await getTwoWheelerCatalogVehicleById(catalogId, dealerId)
    if (dbCatalogVehicle) return { ...dbCatalogVehicle, id }

    const fallbackCatalogVehicle = TWO_WHEELER_BRANDS
        .flatMap((brand) => getTwoWheelerCatalog(brand, dealerId))
        .find((vehicle) => vehicle.id === catalogId)

    return fallbackCatalogVehicle ? { ...fallbackCatalogVehicle, id } : null
}

const handlers = createVehicleDetailRouteHandlers({
    vehicleType: 'two-wheeler',
    catalogPrefix: 'cat-2w',
    dbPrefix: 'tw-',
    getVehicleById: getTwoWheelerDetailVehicleById,
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
