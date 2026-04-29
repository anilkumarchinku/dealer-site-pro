/**
 * GET    /api/two-wheelers/used/[id]  — Public: get single used vehicle
 * PUT    /api/two-wheelers/used/[id]  — Dealer: update used vehicle
 * DELETE /api/two-wheelers/used/[id]  — Dealer: mark vehicle as sold
 */

import {
    deleteUsedTwoWheeler,
    getUsedTwoWheelerById,
    updateUsedTwoWheeler,
} from '@/lib/db/two-wheelers'
import { createUsedVehicleDetailRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'

const handlers = createUsedVehicleDetailRouteHandlers({
    getVehicleById: getUsedTwoWheelerById,
    updateVehicle: updateUsedTwoWheeler,
    deleteVehicle: deleteUsedTwoWheeler,
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
