/**
 * POST /api/two-wheelers/booking/verify
 * Verifies Razorpay payment for a 2W vehicle booking.
 * Idempotent — uses idempotency-key header to prevent duplicate processing.
 *
 * Body: { orderId, paymentId, signature }
 * Headers: idempotency-key
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { updateTwoWheelerBookingPayment } from '@/lib/db/two-wheelers'
import { createAdminClient } from '@/lib/supabase-server'

function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret || secret === 'your_razorpay_secret_key_here') {
        if (process.env.NODE_ENV === 'production') {
            console.error('[tw_booking/verify] RAZORPAY_KEY_SECRET not configured — rejecting')
            return false
        }
        console.warn('[tw_booking/verify] Skipping signature check in dev')
        return true
    }

    const generated = createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex')

    try {
        const a = Buffer.from(generated)
        const b = Buffer.from(signature)
        if (a.length !== b.length) return false
        return timingSafeEqual(a, b)
    } catch {
        return false
    }
}

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('tw_booking_verify', request, 10, 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey) {
        return NextResponse.json({ error: 'Missing idempotency-key header' }, { status: 400 })
    }

    const body = await request.json()
    const { orderId, paymentId, signature } = body

    if (!orderId || !paymentId || !signature) {
        return NextResponse.json({ error: 'orderId, paymentId, and signature are required' }, { status: 400 })
    }

    // ── Idempotency check ───────────────────────────────────────
    const admin = createAdminClient()
    const { data: existing } = await admin
        .from('tw_bookings')
        .select('id, status')
        .eq('idempotency_key', idempotencyKey)
        .single()

    if (existing?.status === 'paid') {
        return NextResponse.json({ success: true, message: 'Payment already verified', idempotent: true })
    }

    // ── Signature verification ──────────────────────────────────
    const isValid = verifyRazorpaySignature(orderId, paymentId, signature)
    if (!isValid) {
        await updateTwoWheelerBookingPayment(idempotencyKey, orderId, paymentId, 'failed')
        return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })
    }

    // ── Update booking to paid ──────────────────────────────────
    const result = await updateTwoWheelerBookingPayment(idempotencyKey, orderId, paymentId, 'paid')
    if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Payment verified and booking confirmed' })
}
