import {
    deleteUsedThreeWheeler,
    getUsedThreeWheelerById,
    updateUsedThreeWheeler,
} from '@/lib/db/three-wheelers'
import { createUsedVehicleDetailRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'

const handlers = createUsedVehicleDetailRouteHandlers({
    vehicleType: 'three-wheeler',
    getVehicleById: getUsedThreeWheelerById,
    updateVehicle: updateUsedThreeWheeler,
    deleteVehicle: deleteUsedThreeWheeler,
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
