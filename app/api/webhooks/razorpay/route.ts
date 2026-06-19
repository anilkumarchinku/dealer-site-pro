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
import { getOptionalEnv } from '@/lib/env'
import { createAdminClient } from '@/lib/supabase-server'
import { verifyRazorpayWebhookSignature } from '@/lib/services/razorpay-service'
import { logger } from '@/lib/utils/logger'
import {
    claimWebhookEvent,
    markWebhookEventFailed,
    markWebhookEventProcessed,
} from '@/lib/services/webhook-event-service'

// Fallback dedupe for local/dev DBs that have not run the webhook_events
// migration yet. Production dedupe is DB-backed through claimWebhookEvent().
const processedEventIds = new Set<string>()
const MAX_EVENT_CACHE = 500

export async function POST(request: NextRequest) {
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature') ?? ''
    const webhookSecret = getOptionalEnv('RAZORPAY_WEBHOOK_SECRET')

    if (!webhookSecret) {
        logger.error('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured')
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    // Validate signature
    if (!verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)) {
        logger.error('[Razorpay Webhook] Invalid signature')
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
    const eventId   = request.headers.get('x-razorpay-event-id')

    logger.log('[Razorpay Webhook] Received event:', eventType, eventId ?? '(no event-id)')

    const eventClaim = await claimWebhookEvent(supabase, {
        provider: 'razorpay',
        eventId,
        eventType,
        payload: event,
    })

    if (eventClaim.duplicate) {
        logger.log('[Razorpay Webhook] Duplicate event, skipping:', eventId)
        return NextResponse.json({ received: true, duplicate: true })
    }

    // Fallback idempotency for local/dev DBs that have not run the migration yet.
    if (!eventClaim.storageAvailable && eventId) {
        if (processedEventIds.has(eventId)) {
            logger.log('[Razorpay Webhook] Duplicate event, skipping:', eventId)
            return NextResponse.json({ received: true, duplicate: true })
        }
        // Evict oldest entries when cache is full
        if (processedEventIds.size >= MAX_EVENT_CACHE) {
            const [first] = processedEventIds
            processedEventIds.delete(first)
        }
        processedEventIds.add(eventId)
    }

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
                logger.log('[Razorpay Webhook] Subscription activated:', sub.id)
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
                logger.log('[Razorpay Webhook] Subscription renewed:', sub.id)
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
                logger.log('[Razorpay Webhook] Subscription cancelled:', sub.id)
                break
            }

            case 'payment.failed': {
                const payment = event.payload.payment?.entity
                if (!payment?.subscription_id) break
                await supabase
                    .from('domain_subscriptions')
                    .update({ status: 'past_due' })
                    .eq('razorpay_subscription_id', payment.subscription_id as string)
                logger.log('[Razorpay Webhook] Payment failed for subscription:', payment.subscription_id)
                break
            }

            default:
                logger.log('[Razorpay Webhook] Unhandled event type:', eventType)
        }
    } catch (err) {
        if (eventClaim.storageAvailable) {
            await markWebhookEventFailed(supabase, 'razorpay', eventId, err)
        }
        logger.error('[Razorpay Webhook] Error processing event:', eventType, err)
        // Return 500 so Razorpay retries the event — prevents silent data loss
        return NextResponse.json({ received: true, error: 'Processing error' }, { status: 500 })
    }

    if (eventClaim.storageAvailable) {
        await markWebhookEventProcessed(supabase, 'razorpay', eventId)
    }
    return NextResponse.json({ received: true })
}
