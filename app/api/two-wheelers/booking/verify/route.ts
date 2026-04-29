/**
 * POST /api/two-wheelers/booking/verify
 * Verifies Razorpay payment for a 2W vehicle booking.
 */

import { NextRequest } from 'next/server'
import { updateTwoWheelerBookingPayment } from '@/lib/db/two-wheelers'
import { verifyVehicleBookingPayment } from '@/lib/services/vehicle-booking-payment-service'

export async function POST(request: NextRequest) {
    return verifyVehicleBookingPayment(request, {
        rateLimitKey: 'tw_booking_verify',
        logPrefix: 'tw_booking',
        bookingTable: 'tw_bookings',
        updatePayment: updateTwoWheelerBookingPayment,
    })
}
