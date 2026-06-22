/**
 * POST /api/three-wheelers/booking/create-order
 * Creates a Razorpay order for a 3W vehicle booking.
 */

import { NextRequest } from 'next/server'
import { createThreeWheelerBooking } from '@/lib/db/three-wheelers'
import { createVehicleBookingOrder } from '@/lib/services/vehicle-booking-payment-service'

export async function POST(request: NextRequest) {
    return createVehicleBookingOrder(request, {
        rateLimitKey: 'thw_booking_create',
        logPrefix: 'thw_booking',
        vehicleCategory: '3w',
        createBooking: (payload) => createThreeWheelerBooking({
            ...payload,
            status: 'pending',
            razorpay_order_id: null,
            razorpay_payment_id: null,
        }),
    })
}
