import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getOptionalEnv } from '@/lib/env'
import { createAdminClient, requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

const broadcastSchema = z.object({
    dealer_id: z.string().uuid(),
    title: z.string().min(3).max(80),
    body: z.string().min(3).max(220),
    category: z.enum(['new_listings', 'price_drops', 'announcements']).default('announcements'),
    target_url: z.string().url().optional().or(z.literal('')),
})

type PushSubscriptionRow = {
    id: string
    endpoint: string
    subscription: unknown
}

function getWebPush() {
    const publicKey = getOptionalEnv('NEXT_PUBLIC_VAPID_PUBLIC_KEY')
    const privateKey = getOptionalEnv('VAPID_PRIVATE_KEY')
    const subject = getOptionalEnv('VAPID_SUBJECT') ?? 'mailto:support@dealersitepro.com'
    if (!publicKey || !privateKey) {
        return { webpush: null, error: 'VAPID keys are not configured' }
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const webpush = require('web-push')
        webpush.setVapidDetails(subject, publicKey, privateKey)
        return { webpush, error: null }
    } catch {
        return { webpush: null, error: 'web-push package is not installed' }
    }
}

export async function GET() {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const { data: dealer } = await supabase
        .from('dealers')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!dealer) return NextResponse.json({ broadcasts: [] })

    const admin = createAdminClient() as any
    const { data, error } = await admin
        .from('web_push_broadcasts')
        .select('*')
        .eq('dealer_id', dealer.id)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        console.error('[push-broadcasts:GET]', error.message)
        return NextResponse.json({ error: 'Failed to load broadcasts' }, { status: 500 })
    }

    return NextResponse.json({ broadcasts: data ?? [] })
}

export async function POST(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const body = await request.json().catch(() => null)
    const parsed = broadcastSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid broadcast payload' }, { status: 400 })
    }

    const ownership = await requireDealerOwnership(supabase, user.id, parsed.data.dealer_id)
    if (ownership.errorResponse) return ownership.errorResponse

    const admin = createAdminClient() as any
    const { webpush, error: configError } = getWebPush()

    const { data: inserted, error: insertError } = await admin
        .from('web_push_broadcasts')
        .insert({
            dealer_id: parsed.data.dealer_id,
            title: parsed.data.title,
            body: parsed.data.body,
            category: parsed.data.category,
            target_url: parsed.data.target_url || null,
            status: configError ? 'failed' : 'queued',
            error_message: configError,
        })
        .select('id')
        .single()

    if (insertError) {
        console.error('[push-broadcasts:insert]', insertError.message)
        return NextResponse.json({ error: 'Failed to create broadcast' }, { status: 500 })
    }

    if (!webpush) {
        return NextResponse.json({ error: configError, broadcast_id: inserted.id }, { status: 503 })
    }

    const { data: subscriptions, error: subError } = await admin
        .from('web_push_subscriptions')
        .select('id, endpoint, subscription')
        .eq('dealer_id', parsed.data.dealer_id)
        .eq('status', 'active')
        .contains('categories', [parsed.data.category])

    if (subError) {
        console.error('[push-broadcasts:subscriptions]', subError.message)
        return NextResponse.json({ error: 'Failed to load push subscribers' }, { status: 500 })
    }

    const payload = JSON.stringify({
        title: parsed.data.title,
        body: parsed.data.body,
        url: parsed.data.target_url || '/cars',
        category: parsed.data.category,
    })

    let sent = 0
    let failed = 0

    await Promise.all((subscriptions as PushSubscriptionRow[] ?? []).map(async subscription => {
        try {
            await webpush.sendNotification(subscription.subscription, payload)
            sent += 1
        } catch {
            failed += 1
            await admin
                .from('web_push_subscriptions')
                .update({ status: 'failed' })
                .eq('id', subscription.id)
        }
    }))

    const status = failed > 0 && sent > 0 ? 'partial' : failed > 0 ? 'failed' : 'sent'
    await admin
        .from('web_push_broadcasts')
        .update({
            sent_count: sent,
            failed_count: failed,
            status,
            error_message: failed > 0 ? `${failed} subscription(s) failed` : null,
        })
        .eq('id', inserted.id)

    return NextResponse.json({ success: true, broadcast_id: inserted.id, sent, failed })
}
