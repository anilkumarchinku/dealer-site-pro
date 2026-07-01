import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase-server'
import { recordAnalyticsEvent, type AnalyticsEventType } from '@/lib/services/analytics-tracking-service'

const EVENTS: AnalyticsEventType[] = ['page_view', 'lead', 'test_drive', 'call', 'whatsapp', 'vehicle_view']

function detectDevice(userAgent: string | null): 'mobile' | 'desktop' | 'tablet' {
    const ua = userAgent ?? ''
    if (/ipad|tablet/i.test(ua)) return 'tablet'
    if (/mobile|android|iphone/i.test(ua)) return 'mobile'
    return 'desktop'
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null) as {
        dealerId?: string
        eventType?: AnalyticsEventType
        page?: string
        source?: string
    } | null

    if (!body?.dealerId || !body.eventType || !EVENTS.includes(body.eventType)) {
        return NextResponse.json({ error: 'dealerId and valid eventType are required' }, { status: 400 })
    }

    const result = await recordAnalyticsEvent({
        supabase: createAdminClient(),
        dealerId: body.dealerId,
        eventType: body.eventType,
        page: body.page,
        source: body.source || request.headers.get('referer'),
        device: detectDevice(request.headers.get('user-agent')),
    })

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
}
