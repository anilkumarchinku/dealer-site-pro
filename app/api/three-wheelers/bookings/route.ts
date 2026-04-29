/**
 * GET /api/three-wheelers/bookings  — Dealer: list payment bookings
 */

import { NextRequest } from 'next/server'
import { getThreeWheelerBookings } from '@/lib/db/three-wheelers'
import { listVehiclePaymentBookings } from '@/lib/services/vehicle-service-booking-route-service'

export async function GET(request: NextRequest) {
    return listVehiclePaymentBookings(request, {
        getBookings: getThreeWheelerBookings,
    })
}
