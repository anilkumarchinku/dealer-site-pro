import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/database.types'

export type AnalyticsEventType =
    | 'page_view'
    | 'lead'
    | 'test_drive'
    | 'call'
    | 'whatsapp'
    | 'vehicle_view'

type AnalyticsClient = SupabaseClient<Database>

interface RecordAnalyticsEventInput {
    supabase: AnalyticsClient
    dealerId: string
    eventType: AnalyticsEventType
    page?: string | null
    source?: string | null
    device?: 'mobile' | 'desktop' | 'tablet' | null
}

function todayISO() {
    return new Date().toISOString().slice(0, 10)
}

function sourceColumn(source?: string | null) {
    const value = source?.toLowerCase() ?? ''
    if (/google|bing|yahoo|duckduckgo|organic|search/.test(value)) return 'organic_traffic'
    if (/facebook|instagram|linkedin|twitter|x\.com|youtube|social/.test(value)) return 'social_traffic'
    if (/referral|http/.test(value)) return 'referral_traffic'
    return 'direct_traffic'
}

function devicePatch(device?: 'mobile' | 'desktop' | 'tablet' | null) {
    if (device === 'mobile') return { mobile_pct: 100, desktop_pct: 0, tablet_pct: 0 }
    if (device === 'tablet') return { mobile_pct: 0, desktop_pct: 0, tablet_pct: 100 }
    if (device === 'desktop') return { mobile_pct: 0, desktop_pct: 100, tablet_pct: 0 }
    return {}
}

function updateTopPages(topPages: unknown, page?: string | null) {
    if (!page) return Array.isArray(topPages) ? topPages : []
    const rows = Array.isArray(topPages) ? topPages : []
    const cleanRows = rows
        .map((row) => {
            if (!row || typeof row !== 'object') return null
            const record = row as { page?: unknown; views?: unknown }
            return {
                page: typeof record.page === 'string' ? record.page : '',
                views: typeof record.views === 'number' ? record.views : 0,
            }
        })
        .filter((row): row is { page: string; views: number } => Boolean(row?.page))

    const existing = cleanRows.find((row) => row.page === page)
    if (existing) existing.views += 1
    else cleanRows.push({ page, views: 1 })

    return cleanRows.sort((a, b) => b.views - a.views).slice(0, 12)
}

export async function recordAnalyticsEvent({
    supabase,
    dealerId,
    eventType,
    page,
    source,
    device,
}: RecordAnalyticsEventInput) {
    if (!dealerId) return { success: false, error: 'dealerId is required' }

    const date = todayISO()
    const { data: existing, error: existingError } = await supabase
        .from('analytics_daily')
        .select('*')
        .eq('dealer_id', dealerId)
        .eq('date', date)
        .maybeSingle()

    if (existingError) return { success: false, error: existingError.message }

    const sourceKey = sourceColumn(source)
    const base = existing ?? {
        dealer_id: dealerId,
        date,
        page_views: 0,
        unique_visitors: 0,
        leads_count: 0,
        test_drives_count: 0,
        calls_count: 0,
        whatsapp_count: 0,
        organic_traffic: 0,
        social_traffic: 0,
        direct_traffic: 0,
        referral_traffic: 0,
        top_pages: [],
    }

    const patch = {
        dealer_id: dealerId,
        date,
        page_views: base.page_views + (eventType === 'page_view' || eventType === 'vehicle_view' ? 1 : 0),
        unique_visitors: base.unique_visitors + (eventType === 'page_view' ? 1 : 0),
        leads_count: base.leads_count + (eventType === 'lead' ? 1 : 0),
        test_drives_count: base.test_drives_count + (eventType === 'test_drive' ? 1 : 0),
        calls_count: base.calls_count + (eventType === 'call' ? 1 : 0),
        whatsapp_count: base.whatsapp_count + (eventType === 'whatsapp' ? 1 : 0),
        organic_traffic: base.organic_traffic + (sourceKey === 'organic_traffic' ? 1 : 0),
        social_traffic: base.social_traffic + (sourceKey === 'social_traffic' ? 1 : 0),
        direct_traffic: base.direct_traffic + (sourceKey === 'direct_traffic' ? 1 : 0),
        referral_traffic: base.referral_traffic + (sourceKey === 'referral_traffic' ? 1 : 0),
        top_pages: updateTopPages(base.top_pages, page),
        ...devicePatch(device),
    }

    const { error } = await supabase
        .from('analytics_daily')
        .upsert(patch, { onConflict: 'dealer_id,date' })

    return error ? { success: false, error: error.message } : { success: true }
}
