import { NextRequest, NextResponse } from 'next/server'
import { PLAN_PRICES_PAISE, verifyPaymentSignature } from '@/lib/services/payment-service'
import { fetchRazorpayPayment } from '@/lib/services/razorpay-service'
import { createAdminClient, createRouteClient, requireAuth, requireDealerOwnership } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { logger } from '@/lib/utils/logger'
import type { Json } from '@/lib/database.types'

/** Razorpay payment statuses that mean the money was actually collected. */
const CAPTURED_STATUSES = new Set(['captured', 'paid'])

/** Resolves the priced tier for a subscription row, or null if it isn't a paid tier. */
function resolvePaidTier(
    subscription: { tier: string | null; plan: string | null }
): 'pro' | 'premium' | null {
    const candidate = subscription.tier ?? subscription.plan
    if (candidate === 'pro' || candidate === 'premium') return candidate
    return null
}

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
    const { user, errorResponse: authError } = await requireAuth()
    if (authError) return authError as NextResponse<PaymentVerifyResponse>

    // Rate limit: max 10 payment verifications per IP per hour
    const rateLimit = await rateLimitOrNull('payment_verify', request, 10, 60 * 60 * 1000)
    if (rateLimit) return rateLimit as NextResponse<PaymentVerifyResponse>

    try {
        const body = (await request.json()) as PaymentVerifyRequest
        const { orderId, paymentId, signature, subscriptionId } = body

        // Validate required fields. subscriptionId is required: it is part of the
        // signed message (payment_id|subscription_id) and identifies the row we
        // activate. An empty/missing id must never fall back to a blank match.
        if (!orderId || !paymentId || !signature) {
            return NextResponse.json(
                { success: false, error: 'Missing payment verification details' },
                { status: 400 }
            )
        }

        const trimmedSubscriptionId = typeof subscriptionId === 'string' ? subscriptionId.trim() : ''
        if (!trimmedSubscriptionId) {
            return NextResponse.json(
                { success: false, error: 'Missing subscription identifier' },
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
        const isValid = verifyPaymentSignature(paymentId, trimmedSubscriptionId, signature)

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

        // ── OWNERSHIP CHECK ──────────────────────────────────────
        // A valid signature only proves Razorpay signed THIS payment for THIS
        // subscription id. It does NOT prove the caller owns the subscription,
        // nor that the captured amount matches the plan price. Load the row and
        // verify both before activating anything. Failures here are not cached as
        // idempotent outcomes — they are caller/environment errors, not a final
        // verdict on the payment.
        const { data: subscriptionRow, error: subscriptionLookupError } = await supabase
            .from('domain_subscriptions')
            .select('id, dealer_id, domain_id, plan, tier, razorpay_subscription_id')
            .eq('razorpay_subscription_id', trimmedSubscriptionId)
            .single()

        if (subscriptionLookupError || !subscriptionRow) {
            logger.error('Subscription not found for verification:', subscriptionLookupError)
            return NextResponse.json(
                { success: false, error: 'Subscription not found' },
                { status: 404 }
            )
        }

        // Confirm the authenticated user owns the dealer that the subscription
        // belongs to. requireDealerOwnership returns a 403 NextResponse otherwise.
        const { errorResponse: ownershipError } = await requireDealerOwnership(
            supabase,
            user.id,
            subscriptionRow.dealer_id
        )
        if (ownershipError) {
            logger.error('Payment verify ownership check failed', {
                userId: user.id,
                dealerId: subscriptionRow.dealer_id,
                subscriptionId: trimmedSubscriptionId,
            })
            return ownershipError as NextResponse<PaymentVerifyResponse>
        }

        // ── AMOUNT / CAPTURE CHECK ───────────────────────────────
        // Independently fetch the payment from Razorpay and assert it was
        // actually captured for the exact plan price. This blocks tampering where
        // a real-but-cheaper/uncaptured payment is replayed against a paid plan.
        //
        // The explicit ALLOW_FAKE_PAYMENTS=1 dev/mock path (mock_sub_* ids, no
        // live Razorpay) is the only case that skips the live amount check.
        const isMockSubscription =
            process.env.ALLOW_FAKE_PAYMENTS === '1' && trimmedSubscriptionId.startsWith('mock_sub_')

        if (!isMockSubscription) {
            const plan = resolvePaidTier(subscriptionRow)
            if (!plan) {
                logger.error('Subscription has no priced tier during verification:', {
                    subscriptionId: trimmedSubscriptionId,
                    plan: subscriptionRow.plan,
                    tier: subscriptionRow.tier,
                })
                return NextResponse.json(
                    { success: false, error: 'Subscription plan is not eligible for verification' },
                    { status: 400 }
                )
            }

            const expectedAmount = PLAN_PRICES_PAISE[plan]

            try {
                const payment = await fetchRazorpayPayment(paymentId)

                if (!CAPTURED_STATUSES.has((payment.status ?? '').toLowerCase())) {
                    logger.error('Razorpay payment not captured during verification:', {
                        paymentId,
                        status: payment.status,
                    })
                    return NextResponse.json(
                        { success: false, error: 'Payment has not been captured' },
                        { status: 400 }
                    )
                }

                if (payment.amount !== expectedAmount) {
                    logger.error('Razorpay payment amount mismatch during verification:', {
                        paymentId,
                        plan,
                        expectedAmount,
                        actualAmount: payment.amount,
                    })
                    return NextResponse.json(
                        { success: false, error: 'Payment amount does not match the plan price' },
                        { status: 400 }
                    )
                }
            } catch (paymentFetchError) {
                logger.error('Failed to fetch Razorpay payment during verification:', paymentFetchError)
                return NextResponse.json(
                    { success: false, error: 'Could not confirm payment with provider' },
                    { status: 502 }
                )
            }
        }

        // ── UPDATE SUBSCRIPTION ──────────────────────────────────
        const { data: subscription, error: updateError } = await supabase
            .from('domain_subscriptions')
            .update({ status: 'active' })
            .eq('razorpay_subscription_id', trimmedSubscriptionId)
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
