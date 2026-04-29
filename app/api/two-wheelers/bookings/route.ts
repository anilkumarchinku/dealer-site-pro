/**
 * GET /api/two-wheelers/bookings  — Dealer: list payment bookings
 */

import { NextRequest } from 'next/server'
import { getTwoWheelerBookings } from '@/lib/db/two-wheelers'
import { listVehiclePaymentBookings } from '@/lib/services/vehicle-service-booking-route-service'

export async function GET(request: NextRequest) {
    return listVehiclePaymentBookings(request, {
        getBookings: getTwoWheelerBookings,
    })
}
