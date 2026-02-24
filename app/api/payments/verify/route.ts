import { NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/services/payment-service'
import { createRouteClient } from '@/lib/supabase-server'

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
export async function POST(request: Request): Promise<NextResponse<PaymentVerifyResponse>> {
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
            console.log('[IDEMPOTENT] Payment verification already processed:', paymentId)
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
            await supabase.from('payment_idempotency_log').insert({
                idempotency_key: idempotencyKey,
                payment_id: paymentId,
                response: { success: false, error: 'Invalid signature' },
                created_at: new Date().toISOString(),
            }).catch(err => console.error('Failed to log verification error:', err))

            return NextResponse.json(
                { success: false, error: 'Invalid payment signature' },
                { status: 400 }
            )
        }

        // ── UPDATE SUBSCRIPTION ──────────────────────────────────
        const { data: subscription, error: updateError } = await supabase
            .from('domain_subscriptions')
            .update({ status: 'active', verified_at: new Date().toISOString() })
            .eq('razorpay_subscription_id', subscriptionId)
            .select()
            .single()

        if (updateError) {
            console.error('Error updating subscription:', updateError)
            return NextResponse.json(
                { success: false, error: 'Failed to activate subscription' },
                { status: 500 }
            )
        }

        // ── UPDATE DOMAIN STATUS ─────────────────────────────────
        if (subscription?.domain_id) {
            await supabase
                .from('dealer_domains')
                .update({ status: 'active' })
                .eq('id', subscription.domain_id)
                .catch(err => console.error('Failed to update domain status:', err))
        }

        // ── LOG SUCCESSFUL VERIFICATION ──────────────────────────
        await supabase
            .from('payment_idempotency_log')
            .insert({
                idempotency_key: idempotencyKey,
                payment_id: paymentId,
                subscription_id: subscriptionId,
                response: { success: true, message: 'Payment verified' },
                created_at: new Date().toISOString(),
            })
            .catch(err => console.error('Failed to log payment verification:', err))

        return NextResponse.json(
            {
                success: true,
                message: 'Payment verified and subscription activated',
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error in POST /api/payments/verify:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
