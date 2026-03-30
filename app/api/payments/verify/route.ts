import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/services/payment-service'
import { createRouteClient, requireAuth } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { logger } from '@/lib/utils/logger'

interface PaymentVerifyRequest {
    orderId: string
    paymentId: string
    signature: string
    subscriptionId?: string
}

interface PaymentVerifyResponse {
    success: boolean
    message?: string
    error?: string
    idempotent?: boolean
}

/**
 * POST /api/payments/verify
 * Verifies Razorpay payment and activates subscription
 *
 * Idempotency: Use the "idempotency-key" header to prevent duplicate processing
 * This header should be a unique UUID for each payment verification
 */
export async function POST(request: NextRequest): Promise<NextResponse<PaymentVerifyResponse>> {
    // Auth: only authenticated users can verify payments
    const { errorResponse: authError } = await requireAuth()
    if (authError) return authError as NextResponse<PaymentVerifyResponse>

    // Rate limit: max 10 payment verifications per IP per hour
    const rateLimit = await rateLimitOrNull('payment_verify', request, 10, 60 * 60 * 1000)
    if (rateLimit) return rateLimit as NextResponse<PaymentVerifyResponse>

    try {
        const body = (await request.json()) as PaymentVerifyRequest
        const { orderId, paymentId, signature, subscriptionId } = body

        // Validate required fields
        if (!orderId || !paymentId || !signature) {
            return NextResponse.json(
                { success: false, error: 'Missing payment verification details' },
                { status: 400 }
            )
        }

        // Get idempotency key from headers
        const idempotencyKey = request.headers.get('idempotency-key')
        if (!idempotencyKey) {
            return NextResponse.json(
                { success: false, error: 'Missing idempotency-key header' },
                { status: 400 }
            )
        }

        const supabase = await createRouteClient()

        // ── IDEMPOTENCY CHECK ────────────────────────────────────
        // Check if we've already processed this payment verification
        const { data: existingRecord } = await supabase
            .from('payment_idempotency_log')
            .select('response')
            .eq('idempotency_key', idempotencyKey)
            .eq('payment_id', paymentId)
            .single()

        if (existingRecord) {
            // Already processed — return cached result
            logger.log('[IDEMPOTENT] Payment verification already processed:', paymentId)
            return NextResponse.json(
                {
                    success: true,
                    message: 'Payment already verified',
                    idempotent: true,
                },
                { status: 200 }
            )
        }

        // ── SIGNATURE VERIFICATION ───────────────────────────────
        // Verify signature — Razorpay signs subscriptions as payment_id|subscription_id
        const isValid = verifyPaymentSignature(paymentId, subscriptionId ?? orderId, signature)

        if (!isValid) {
            // Log failed verification (but don't prevent retries)
            const { error: logError } = await supabase.from('payment_idempotency_log').insert({
                idempotency_key: idempotencyKey,
                payment_id: paymentId,
                response: { success: false, error: 'Invalid signature' },
                created_at: new Date().toISOString(),
            })
            if (logError) logger.error('Failed to log verification error:', logError)

            return NextResponse.json(
                { success: false, error: 'Invalid payment signature' },
                { status: 400 }
            )
        }

        // ── UPDATE SUBSCRIPTION ──────────────────────────────────
        const { data: subscription, error: updateError } = await supabase
            .from('domain_subscriptions')
            .update({ status: 'active' })
            .eq('razorpay_subscription_id', subscriptionId ?? '')
            .select()
            .single()

        if (updateError) {
            logger.error('Error updating subscription:', updateError)
            return NextResponse.json(
                { success: false, error: 'Failed to activate subscription' },
                { status: 500 }
            )
        }

        // ── UPDATE DOMAIN STATUS ─────────────────────────────────
        if (subscription?.domain_id) {
            const { error: domainError } = await supabase
                .from('dealer_domains')
                .update({ status: 'active' })
                .eq('id', subscription.domain_id)
            if (domainError) logger.error('Failed to update domain status:', domainError)
        }

        // ── LOG SUCCESSFUL VERIFICATION ──────────────────────────
        const { error: logError } = await supabase
            .from('payment_idempotency_log')
            .insert({
                idempotency_key: idempotencyKey,
                payment_id: paymentId,
                subscription_id: subscriptionId,
                response: { success: true, message: 'Payment verified' },
                created_at: new Date().toISOString(),
            })
        if (logError) logger.error('Failed to log payment verification:', logError)

        return NextResponse.json(
            {
                success: true,
                message: 'Payment verified and subscription activated',
            },
            { status: 200 }
        )
    } catch (error) {
        logger.error('Error in POST /api/payments/verify:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
