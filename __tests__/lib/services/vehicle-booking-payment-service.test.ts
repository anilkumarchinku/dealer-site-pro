import { createHmac } from 'crypto'
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import {
    createVehicleBookingOrder,
    verifyVehicleBookingPayment,
} from '@/lib/services/vehicle-booking-payment-service'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

vi.mock('@/lib/supabase-server', () => ({
    createAdminClient: vi.fn(),
}))

vi.mock('@/lib/utils/rate-limiter', () => ({
    rateLimitOrNull: vi.fn(),
}))

function request(body: unknown, idempotencyKey = 'idem_1') {
    return new NextRequest('https://example.com/api/booking', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'idempotency-key': idempotencyKey,
        },
    })
}

function adminWithExistingStatus(status: string | null) {
    return {
        from: vi.fn(() => {
            const builder = {
                select: vi.fn(() => builder),
                eq: vi.fn(() => builder),
                single: vi.fn(async () => ({ data: status ? { id: 'booking_1', status } : null })),
            }
            return builder
        }),
    }
}

describe('vehicle-booking-payment-service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(rateLimitOrNull).mockResolvedValue(null)
        delete process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        delete process.env.RAZORPAY_KEY_SECRET
    })

    it('creates a booking before returning a dev mock Razorpay order when credentials are absent', async () => {
        const createBooking = vi.fn(async () => ({ success: true, id: 'booking_1' }))

        const response = await createVehicleBookingOrder(request({
            dealer_id: 'dealer_1',
            vehicle_id: 'vehicle_1',
            customer_name: 'Asha',
            phone: '9999999999',
            booking_amount_paise: 50_000,
        }), {
            rateLimitKey: 'tw_booking_create',
            logPrefix: 'Booking',
            createBooking,
        })

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toMatchObject({
            success: true,
            orderId: expect.stringMatching(/^mock_order_/),
            bookingId: 'booking_1',
            mock: true,
        })
        expect(createBooking).toHaveBeenCalledWith(expect.objectContaining({
            dealer_id: 'dealer_1',
            idempotency_key: 'idem_1',
        }))
    })

    it('returns idempotent success when booking payment was already marked paid', async () => {
        vi.mocked(createAdminClient).mockReturnValue(adminWithExistingStatus('paid') as never)

        const response = await verifyVehicleBookingPayment(request({
            orderId: 'order_1',
            paymentId: 'pay_1',
            signature: 'ignored',
        }), {
            rateLimitKey: 'tw_booking_verify',
            logPrefix: 'Booking',
            bookingTable: 'tw_bookings',
            updatePayment: vi.fn(),
        })

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({
            success: true,
            message: 'Payment already verified',
            idempotent: true,
        })
    })

    it('marks booking payment failed when signature verification fails', async () => {
        process.env.RAZORPAY_KEY_SECRET = 'secret'
        vi.mocked(createAdminClient).mockReturnValue(adminWithExistingStatus('pending') as never)
        const updatePayment = vi.fn(async () => ({ success: true }))
        const validDifferentSignature = createHmac('sha256', 'secret')
            .update('order_2|pay_1')
            .digest('hex')

        const response = await verifyVehicleBookingPayment(request({
            orderId: 'order_1',
            paymentId: 'pay_1',
            signature: validDifferentSignature,
        }), {
            rateLimitKey: 'tw_booking_verify',
            logPrefix: 'Booking',
            bookingTable: 'tw_bookings',
            updatePayment,
        })

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'Invalid payment signature',
        })
        expect(updatePayment).toHaveBeenCalledWith('idem_1', 'order_1', 'pay_1', 'failed')
    })
})
