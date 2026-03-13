/**
 * POST /api/two-wheelers/booking/create-order
 * Creates a Razorpay order for a 2W vehicle booking.
 * Requires idempotency-key header to prevent duplicate orders.
 *
 * Body: { dealer_id, vehicle_id?, used_vehicle_id?, customer_name, phone, email?, booking_amount_paise }
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { createTwoWheelerBooking } from '@/lib/db/two-wheelers'

function razorpayAuth(): string {
    const keyId     = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    return Buffer.from(`${keyId}:${keySecret}`).toString('base64')
}

function isConfigured(): boolean {
    const keyId     = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    return !!(keyId && !keyId.includes('xxx') && keySecret && keySecret !== 'your_razorpay_secret_key_here')
}

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('tw_booking_create', request, 10, 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey) {
        return NextResponse.json({ error: 'Missing idempotency-key header' }, { status: 400 })
    }

    const body = await request.json()
    const { dealer_id, vehicle_id, used_vehicle_id, customer_name, phone, email, booking_amount_paise } = body

    if (!dealer_id || !customer_name || !phone || !booking_amount_paise) {
        return NextResponse.json(
            { error: 'dealer_id, customer_name, phone, and booking_amount_paise are required' },
            { status: 400 }
        )
    }

    if (booking_amount_paise < 100) {
        return NextResponse.json({ error: 'Minimum booking amount is ₹1' }, { status: 400 })
    }

    // Create booking record (idempotent — unique constraint on idempotency_key)
    const bookingResult = await createTwoWheelerBooking({
        dealer_id,
        vehicle_id:           vehicle_id      ?? null,
        used_vehicle_id:      used_vehicle_id ?? null,
        customer_name,
        phone,
        email:                email           ?? null,
        booking_amount_paise,
        idempotency_key:      idempotencyKey,
    })

    if (!bookingResult.success) {
        return NextResponse.json({ error: bookingResult.error }, { status: 500 })
    }

    // Reject in production if Razorpay is not configured
    if (!isConfigured()) {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
        }
        // Development only: return a mock order so UI can be tested without real credentials
        const mockOrderId = `mock_order_${Date.now()}`
        console.warn('[MOCK] Razorpay not configured — returning mock order:', mockOrderId)
        return NextResponse.json({
            success:       true,
            orderId:       mockOrderId,
            bookingId:     bookingResult.id,
            amount:        booking_amount_paise,
            currency:      'INR',
            keyId:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? 'mock_key',
            mock:          true,
        })
    }

    try {
        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method:  'POST',
            headers: {
                'Authorization':  `Basic ${razorpayAuth()}`,
                'Content-Type':   'application/json',
            },
            body: JSON.stringify({
                amount:   booking_amount_paise,   // already in paise
                currency: 'INR',
                receipt:  bookingResult.id,
                notes: {
                    dealer_id,
                    booking_id:    bookingResult.id,
                    customer_name,
                    phone,
                },
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            const msg = data?.error?.description ?? 'Failed to create Razorpay order'
            console.error('[tw_booking] Razorpay order error:', data)
            return NextResponse.json({ error: msg }, { status: 502 })
        }

        return NextResponse.json({
            success:   true,
            orderId:   data.id,
            bookingId: bookingResult.id,
            amount:    data.amount,
            currency:  data.currency,
            keyId:     process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        })
    } catch (error) {
        console.error('[tw_booking] Razorpay fetch error:', error)
        return NextResponse.json({ error: 'Payment service unavailable' }, { status: 502 })
    }
}
