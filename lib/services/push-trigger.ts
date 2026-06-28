/**
 * Automated push notification triggers for inventory events.
 * Fire-and-forget — callers should not await these.
 */

import { getOptionalEnv } from '@/lib/env'
import { createAdminClient } from '@/lib/supabase-server'
import { logger } from '@/lib/utils/logger'

type PushSubscriptionRow = {
    id: string
    endpoint: string
    subscription: unknown
}

function getWebPush() {
    const publicKey = getOptionalEnv('NEXT_PUBLIC_VAPID_PUBLIC_KEY')
    const privateKey = getOptionalEnv('VAPID_PRIVATE_KEY')
    const subject = getOptionalEnv('VAPID_SUBJECT') ?? 'mailto:support@dealersitepro.com'
    if (!publicKey || !privateKey) return null

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const webpush = require('web-push')
        webpush.setVapidDetails(subject, publicKey, privateKey)
        return webpush
    } catch {
        return null
    }
}

async function sendToSubscribers(
    dealerId: string,
    category: 'new_listings' | 'price_drops',
    title: string,
    body: string,
    targetUrl?: string,
) {
    const webpush = getWebPush()
    if (!webpush) return

    const admin = createAdminClient() as ReturnType<typeof createAdminClient> & { from: (...args: unknown[]) => unknown }

    // Record the broadcast for audit
    const { data: broadcast } = await (admin as any)
        .from('web_push_broadcasts')
        .insert({
            dealer_id: dealerId,
            title,
            body,
            category,
            target_url: targetUrl || null,
            status: 'queued',
        })
        .select('id')
        .single()

    const broadcastId = broadcast?.id

    // Fetch active subscribers for this dealer + category
    const { data: subscriptions, error } = await (admin as any)
        .from('web_push_subscriptions')
        .select('id, endpoint, subscription')
        .eq('dealer_id', dealerId)
        .eq('status', 'active')
        .contains('categories', [category])

    if (error || !subscriptions?.length) {
        if (broadcastId) {
            await (admin as any)
                .from('web_push_broadcasts')
                .update({ status: error ? 'failed' : 'sent', sent_count: 0, failed_count: 0, error_message: error?.message || null })
                .eq('id', broadcastId)
        }
        return
    }

    const payload = JSON.stringify({ title, body, url: targetUrl || '/cars', category })

    let sent = 0
    let failed = 0

    await Promise.all((subscriptions as PushSubscriptionRow[]).map(async (sub) => {
        try {
            await webpush.sendNotification(sub.subscription, payload)
            sent += 1
        } catch {
            failed += 1
            await (admin as any)
                .from('web_push_subscriptions')
                .update({ status: 'failed' })
                .eq('id', sub.id)
        }
    }))

    if (broadcastId) {
        const status = failed > 0 && sent > 0 ? 'partial' : failed > 0 ? 'failed' : 'sent'
        await (admin as any)
            .from('web_push_broadcasts')
            .update({
                sent_count: sent,
                failed_count: failed,
                status,
                error_message: failed > 0 ? `${failed} subscription(s) failed` : null,
            })
            .eq('id', broadcastId)
    }

    logger.log(`[push-trigger] ${category}: sent=${sent} failed=${failed} dealer=${dealerId}`)
}

/**
 * Auto-push when a new vehicle is listed.
 * Call fire-and-forget after vehicle INSERT.
 */
export function triggerNewListingPush(
    dealerId: string,
    vehicle: { make: string; model: string; year: number; price_paise?: number | null },
    siteUrl?: string,
) {
    const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    const price = vehicle.price_paise
        ? ` at ₹${Math.round(vehicle.price_paise / 100).toLocaleString('en-IN')}`
        : ''

    sendToSubscribers(
        dealerId,
        'new_listings',
        'New Arrival',
        `${name}${price} just listed!`,
        siteUrl,
    ).catch(err => logger.error('[push-trigger] new listing error:', err))
}

/**
 * Auto-push when a vehicle's price drops.
 * Call fire-and-forget after vehicle UPDATE where price_paise decreased.
 */
export function triggerPriceDropPush(
    dealerId: string,
    vehicle: { make: string; model: string; year: number },
    oldPricePaise: number,
    newPricePaise: number,
    siteUrl?: string,
) {
    const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    const oldPrice = `₹${Math.round(oldPricePaise / 100).toLocaleString('en-IN')}`
    const newPrice = `₹${Math.round(newPricePaise / 100).toLocaleString('en-IN')}`

    sendToSubscribers(
        dealerId,
        'price_drops',
        'Price Drop',
        `${name} reduced from ${oldPrice} to ${newPrice}!`,
        siteUrl,
    ).catch(err => logger.error('[push-trigger] price drop error:', err))
}
