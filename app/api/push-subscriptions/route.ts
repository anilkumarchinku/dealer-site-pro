import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

const pushSubscriptionSchema = z.object({
    dealer_id: z.string().uuid(),
    subscription: z.object({
        endpoint: z.string().url(),
        keys: z.object({
            p256dh: z.string().min(1),
            auth: z.string().min(1),
        }),
    }).passthrough(),
    categories: z.array(z.enum(['new_listings', 'price_drops', 'announcements'])).default(['new_listings', 'price_drops', 'announcements']),
    filters: z.record(z.string(), z.unknown()).default({}),
})

const unsubscribeSchema = z.object({
    endpoint: z.string().url(),
})

export async function POST(request: NextRequest) {
    const limited = await rateLimitOrNull('push_subscribe', request, 20, 60_000); if (limited) return limited;
    const body = await request.json().catch(() => null)
    const parsed = pushSubscriptionSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid push subscription payload' }, { status: 400 })
    }

    const { dealer_id, subscription, categories, filters } = parsed.data
    const admin = createAdminClient() as any

    const { data: dealer } = await admin
        .from('dealers')
        .select('id')
        .eq('id', dealer_id)
        .maybeSingle()

    if (!dealer) {
        return NextResponse.json({ error: 'Invalid dealer' }, { status: 404 })
    }

    const { error } = await admin
        .from('web_push_subscriptions')
        .upsert({
            dealer_id,
            endpoint: subscription.endpoint,
            subscription,
            categories,
            filters,
            user_agent: request.headers.get('user-agent'),
            status: 'active',
            last_seen_at: new Date().toISOString(),
        }, { onConflict: 'endpoint' })

    if (error) {
        console.error('[push-subscriptions:POST]', error.message)
        return NextResponse.json({ error: 'Failed to save push subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
    const limited = await rateLimitOrNull('push_unsubscribe', request, 20, 60_000); if (limited) return limited;
    const body = await request.json().catch(() => null)
    const parsed = unsubscribeSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid unsubscribe payload' }, { status: 400 })
    }

    const admin = createAdminClient() as any
    const { error } = await admin
        .from('web_push_subscriptions')
        .update({ status: 'disabled' })
        .eq('endpoint', parsed.data.endpoint)

    if (error) {
        console.error('[push-subscriptions:DELETE]', error.message)
        return NextResponse.json({ error: 'Failed to unsubscribe device' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
