import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import {
    getRazorpayErrorMessage,
    getRazorpayKeyId,
    isRazorpayConfigured,
    razorpayApiFetch,
    verifyBookingPaymentSignature,
} from '@/lib/services/razorpay-service'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

type BookingStatus = 'paid' | 'failed'
type BookingTable = 'tw_bookings' | 'thw_bookings'

type BookingCreateResult = {
    success: boolean
    id?: string
    booking?: { id?: string | null } | null
    error?: string
}

type BookingPayload = {
    dealer_id: string
    vehicle_id: string | null
    used_vehicle_id: string | null
    customer_name: string
    phone: string
    email: string | null
    booking_amount_paise: number
    idempotency_key: string
}

type CreateOrderOptions = {
    rateLimitKey: string
    logPrefix: string
    createBooking: (payload: BookingPayload) => Promise<BookingCreateResult>
}

type VerifyPaymentOptions = {
    rateLimitKey: string
    logPrefix: string
    bookingTable: BookingTable
    updatePayment: (
        idempotencyKey: string,
        razorpayOrderId: string,
        razorpayPaymentId: string,
        status: BookingStatus
    ) => Promise<{ success: boolean; error?: string }>
}

function bookingIdFrom(result: BookingCreateResult): string | undefined {
    return result.id ?? result.booking?.id ?? undefined
}

function readIdempotencyKey(request: NextRequest): string | NextResponse {
    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey) {
        return NextResponse.json({ error: 'Missing idempotency-key header' }, { status: 400 })
    }
    return idempotencyKey
}

async function prepareIdempotentRequest(request: NextRequest, rateLimitKey: string): Promise<string | NextResponse> {
    const rateLimit = await rateLimitOrNull(rateLimitKey, request, 10, 60 * 60 * 1000)
    if (rateLimit) return rateLimit
    return readIdempotencyKey(request)
}

export async function createVehicleBookingOrder(
    request: NextRequest,
    options: CreateOrderOptions
) {
    const idempotencyKey = await prepareIdempotentRequest(request, options.rateLimitKey)
    if (idempotencyKey instanceof NextResponse) return idempotencyKey

    const body = await request.json()
    const { dealer_id, vehicle_id, used_vehicle_id, customer_name, phone, email, booking_amount_paise } = body

    if (!dealer_id || !customer_name || !phone || !booking_amount_paise) {
        return NextResponse.json(
            { error: 'dealer_id, customer_name, phone, and booking_amount_paise are required' },
            { status: 400 }
        )
    }

    const MIN_BOOKING_PAISE = 50_000
    const MAX_BOOKING_PAISE = 10_00_000
    if (booking_amount_paise < MIN_BOOKING_PAISE || booking_amount_paise > MAX_BOOKING_PAISE) {
        return NextResponse.json(
            { error: `Booking amount must be between ₹500 and ₹10,000` },
            { status: 400 }
        )
    }

    const bookingPayload: BookingPayload = {
        dealer_id,
        vehicle_id: vehicle_id ?? null,
        used_vehicle_id: used_vehicle_id ?? null,
        customer_name,
        phone,
        email: email ?? null,
        booking_amount_paise,
        idempotency_key: idempotencyKey,
    }

    const bookingResult = await options.createBooking(bookingPayload)
    if (!bookingResult.success) {
        return NextResponse.json({ error: bookingResult.error }, { status: 500 })
    }

    const bookingId = bookingIdFrom(bookingResult)

    if (!isRazorpayConfigured()) {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
        }
        const mockOrderId = `mock_order_${Date.now()}`
        console.warn('[MOCK] Razorpay not configured — returning mock order:', mockOrderId)
        return NextResponse.json({
            success: true,
            orderId: mockOrderId,
            bookingId,
            amount: booking_amount_paise,
            currency: 'INR',
            keyId: getRazorpayKeyId() ?? 'mock_key',
            mock: true,
        })
    }

    try {
        const data = await razorpayApiFetch<{ id: string; amount: number; currency: string }>('/orders', {
            method: 'POST',
            body: JSON.stringify({
                amount: booking_amount_paise,
                currency: 'INR',
                receipt: bookingId,
                notes: {
                    dealer_id,
                    booking_id: bookingId,
                    customer_name,
                    phone,
                },
            }),
        })

        return NextResponse.json({
            success: true,
            orderId: data.id,
            bookingId,
            amount: data.amount,
            currency: data.currency,
            keyId: getRazorpayKeyId(),
        })
    } catch (error) {
        const msg = getRazorpayErrorMessage(error, 'Payment service unavailable')
        console.error(`[${options.logPrefix}] Razorpay fetch error:`, error)
        return NextResponse.json({ error: msg }, { status: 502 })
    }
}

export async function verifyVehicleBookingPayment(
    request: NextRequest,
    options: VerifyPaymentOptions
) {
    const idempotencyKey = await prepareIdempotentRequest(request, options.rateLimitKey)
    if (idempotencyKey instanceof NextResponse) return idempotencyKey

    const body = await request.json()
    const { orderId, paymentId, signature } = body

    if (!orderId || !paymentId || !signature) {
        return NextResponse.json({ error: 'orderId, paymentId, and signature are required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: existing } = await admin
        .from(options.bookingTable)
        .select('id, status')
        .eq('idempotency_key', idempotencyKey)
        .single()

    if (existing?.status === 'paid') {
        return NextResponse.json({ success: true, message: 'Payment already verified', idempotent: true })
    }

    const isValid = verifyBookingPaymentSignature(orderId, paymentId, signature, options.logPrefix)
    if (!isValid) {
        await options.updatePayment(idempotencyKey, orderId, paymentId, 'failed')
        return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })
    }

    const result = await options.updatePayment(idempotencyKey, orderId, paymentId, 'paid')
    if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Payment verified and booking confirmed' })
}
