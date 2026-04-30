import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/services/payment-service'
import { createAdminClient, createRouteClient, requireAuth } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { logger } from '@/lib/utils/logger'
import type { Json } from '@/lib/database.types'

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

function cachedPaymentResponse(response: unknown): PaymentVerifyResponse | null {
    if (!response || typeof response !== 'object' || Array.isArray(response)) {
        return null
    }

    const cached = response as Record<string, unknown>

    if (cached.success === true) {
        return {
            success: true,
            message: typeof cached.message === 'string' && cached.message.length > 0
                ? cached.message
                : 'Payment already verified',
        }
    }

    if (cached.success === false) {
        const error = typeof cached.error === 'string' && cached.error.length > 0
            ? cached.error
            : 'Payment verification failed'

        return {
            success: false,
            error: error === 'Invalid signature' ? 'Invalid payment signature' : error,
        }
    }

    return null
}

function paymentResponseJson(response: PaymentVerifyResponse): Json {
    const json: { [key: string]: Json | undefined } = {
        success: response.success,
    }

    if (response.message) json.message = response.message
    if (response.error) json.error = response.error

    return json
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
        const paymentLogDb = createAdminClient()

        // ── IDEMPOTENCY CHECK ────────────────────────────────────
        // Check if we've already processed this payment verification
        const { data: existingRecord, error: existingRecordError } = await paymentLogDb
            .from('payment_idempotency_log')
            .select('response')
            .eq('idempotency_key', idempotencyKey)
            .eq('payment_id', paymentId)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle()

        if (existingRecordError) {
            logger.error('Failed to check payment idempotency:', existingRecordError)
            return NextResponse.json(
                { success: false, error: 'Failed to verify payment status' },
                { status: 500 }
            )
        }

        if (existingRecord) {
            const response = cachedPaymentResponse(existingRecord.response)
            if (!response) {
                logger.error('[IDEMPOTENT] Payment verification record has no usable response:', paymentId)
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Payment verification result unavailable',
                        idempotent: true,
                    },
                    { status: 409 }
                )
            }

            // Already processed — return cached result
            logger.log('[IDEMPOTENT] Payment verification already processed:', paymentId)
            return NextResponse.json(
                {
                    ...response,
                    idempotent: true,
                },
                { status: response.success ? 200 : 400 }
            )
        }

        // ── SIGNATURE VERIFICATION ───────────────────────────────
        // Verify signature — Razorpay signs subscriptions as payment_id|subscription_id
        const isValid = verifyPaymentSignature(paymentId, subscriptionId ?? orderId, signature)

        if (!isValid) {
            const failureResponse: PaymentVerifyResponse = {
                success: false,
                error: 'Invalid payment signature',
            }

            // Log failed verification so duplicate retries return the same failure.
            const { error: logError } = await paymentLogDb.from('payment_idempotency_log').insert({
                idempotency_key: idempotencyKey,
                payment_id: paymentId,
                response: paymentResponseJson(failureResponse),
                created_at: new Date().toISOString(),
            })
            if (logError) logger.error('Failed to log verification error:', logError)

            return NextResponse.json(
                failureResponse,
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
        const successResponse: PaymentVerifyResponse = {
            success: true,
            message: 'Payment verified and subscription activated',
        }

        const { error: logError } = await paymentLogDb
            .from('payment_idempotency_log')
            .insert({
                idempotency_key: idempotencyKey,
                payment_id: paymentId,
                subscription_id: subscriptionId,
                response: paymentResponseJson(successResponse),
                created_at: new Date().toISOString(),
            })
        if (logError) logger.error('Failed to log payment verification:', logError)

        return NextResponse.json(
            successResponse,
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
