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
import { getThreeWheelerCatalog, THREE_WHEELER_BRANDS } from '@/lib/data/three-wheelers'
import { getThreeWheelerCatalogFromDB, getThreeWheelerCatalogVehicleById } from '@/lib/data/catalog-db'
import { hydrateThreeWheelerWithJson } from '@/lib/data/three-wheeler-detail'
import { createVehicleDetailRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'

function sourceCatalogId(id: string): string | null {
    return id.match(/^cat-3w-\d+-(.+)$/)?.[1] ?? null
}

async function getThreeWheelerDetailVehicleById(id: string, dealerId?: string) {
    const inventoryVehicle = await getThreeWheelerVehicleById(id, dealerId)
    if (inventoryVehicle || !dealerId) return inventoryVehicle

    const catalogId = sourceCatalogId(id)
    if (!catalogId) return null

    const dbCatalogVehicle = await getThreeWheelerCatalogVehicleById(catalogId, dealerId)
    if (dbCatalogVehicle) return { ...dbCatalogVehicle, id }

    const fallbackCatalogVehicle = THREE_WHEELER_BRANDS
        .flatMap((brand) => getThreeWheelerCatalog(brand, dealerId))
        .find((vehicle) => vehicle.id === catalogId)

    return fallbackCatalogVehicle ? { ...fallbackCatalogVehicle, id } : null
}

const handlers = createVehicleDetailRouteHandlers({
    vehicleType: 'three-wheeler',
    catalogPrefix: 'cat-3w',
    dbPrefix: 'thw-',
    getVehicleById: getThreeWheelerDetailVehicleById,
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
