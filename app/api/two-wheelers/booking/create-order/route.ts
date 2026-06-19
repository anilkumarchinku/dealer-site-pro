/**
 * POST /api/two-wheelers/booking/create-order
 * Creates a Razorpay order for a 2W vehicle booking.
 */

import { NextRequest } from 'next/server'
import { createTwoWheelerBooking } from '@/lib/db/two-wheelers'
import { createVehicleBookingOrder } from '@/lib/services/vehicle-booking-payment-service'

export async function POST(request: NextRequest) {
    return createVehicleBookingOrder(request, {
        rateLimitKey: 'tw_booking_create',
        logPrefix: 'tw_booking',
        vehicleCategory: '2w',
        createBooking: createTwoWheelerBooking,
    })
}
