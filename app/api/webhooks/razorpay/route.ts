/**
 * POST /api/webhooks/razorpay
 *
 * Handles async Razorpay webhook events for subscription lifecycle management.
 * This is the server-side counterpart to client-side payment verification —
 * it activates subscriptions even if the user closes the browser after paying.
 *
 * Configure this URL in Razorpay Dashboard → Settings → Webhooks:
 *   https://yourdomain.com/api/webhooks/razorpay
 *
 * Events handled:
 *   - subscription.activated  → activate dealer subscription
 *   - subscription.charged    → renew subscription period
 *   - subscription.cancelled  → deactivate subscription
 *   - payment.failed          → mark subscription as past_due
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase-server'

// Verify Razorpay webhook signature
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    if (!secret) return false
    const expected = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(request: NextRequest) {
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature') ?? ''
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!webhookSecret) {
        console.error('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured')
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    // Validate signature
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error('[Razorpay Webhook] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    let event: { event: string; payload: Record<string, { entity: Record<string, unknown> }> }
    try {
        event = JSON.parse(rawBody)
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const eventType = event.event

    console.log('[Razorpay Webhook] Received event:', eventType)

    try {
        switch (eventType) {
            case 'subscription.activated': {
                const sub = event.payload.subscription?.entity
                if (!sub?.id) break
                const { data: activatedSub } = await supabase
                    .from('domain_subscriptions')
                    .update({
                        status: 'active',
                        current_period_start: (sub.current_start as string | undefined) ?? new Date().toISOString(),
                        current_period_end:   (sub.current_end   as string | undefined) ?? null,
                    })
                    .eq('razorpay_subscription_id', sub.id as string)
                    .select('domain_id')
                    .single()

                // Also mark the domain as active
                if (activatedSub?.domain_id) {
                    await supabase
                        .from('dealer_domains')
                        .update({ status: 'active' })
                        .eq('id', activatedSub.domain_id)
                }
                console.log('[Razorpay Webhook] Subscription activated:', sub.id)
                break
            }

            case 'subscription.charged': {
                const sub = event.payload.subscription?.entity
                if (!sub?.id) break
                await supabase
                    .from('domain_subscriptions')
                    .update({
                        status: 'active',
                        current_period_start: (sub.current_start as string | undefined) ?? new Date().toISOString(),
                        current_period_end:   (sub.current_end   as string | undefined) ?? null,
                    })
                    .eq('razorpay_subscription_id', sub.id as string)
                console.log('[Razorpay Webhook] Subscription renewed:', sub.id)
                break
            }

            case 'subscription.cancelled': {
                const sub = event.payload.subscription?.entity
                if (!sub?.id) break
                const { data: dbSub } = await supabase
                    .from('domain_subscriptions')
                    .update({
                        status:       'cancelled',
                        cancelled_at: new Date().toISOString(),
                    })
                    .eq('razorpay_subscription_id', sub.id as string)
                    .select('domain_id')
                    .single()

                // Also mark the domain as inactive
                if (dbSub?.domain_id) {
                    await supabase
                        .from('dealer_domains')
                        .update({ status: 'suspended' })
                        .eq('id', dbSub.domain_id)
                }
                console.log('[Razorpay Webhook] Subscription cancelled:', sub.id)
                break
            }

            case 'payment.failed': {
                const payment = event.payload.payment?.entity
                if (!payment?.subscription_id) break
                await supabase
                    .from('domain_subscriptions')
                    .update({ status: 'past_due' })
                    .eq('razorpay_subscription_id', payment.subscription_id as string)
                console.log('[Razorpay Webhook] Payment failed for subscription:', payment.subscription_id)
                break
            }

            default:
                console.log('[Razorpay Webhook] Unhandled event type:', eventType)
        }
    } catch (err) {
        console.error('[Razorpay Webhook] Error processing event:', eventType, err)
        // Return 500 so Razorpay retries the event — prevents silent data loss
        return NextResponse.json({ received: true, error: 'Processing error' }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}
