/**
 * POST /api/three-wheelers/booking/verify
 * Verifies Razorpay payment for a 3W vehicle booking.
 */

import { NextRequest } from 'next/server'
import { updateThreeWheelerBookingPayment } from '@/lib/db/three-wheelers'
import { verifyVehicleBookingPayment } from '@/lib/services/vehicle-booking-payment-service'

export async function POST(request: NextRequest) {
    return verifyVehicleBookingPayment(request, {
        rateLimitKey: 'thw_booking_verify',
        logPrefix: 'thw_booking',
        bookingTable: 'thw_bookings',
        updatePayment: updateThreeWheelerBookingPayment,
    })
}
