import { createClient } from '@supabase/supabase-js'
import { getOptionalEnv } from '@/lib/env'
import type { SiteBanner } from '@/lib/types/site-banner'

function getSupabaseUrl(): string | undefined {
    const url = getOptionalEnv('NEXT_PUBLIC_SUPABASE_URL')
    return url && !url.includes('placeholder') ? url : undefined
}

function getSupabaseAnonKey(): string | undefined {
    return getOptionalEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        ?? getOptionalEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
}

function getServerSupabase() {
    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()
    if (!url || !key) return null

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

export async function fetchActiveDealerBanners(
    dealerId: string,
    siteSlug?: string | null,
): Promise<SiteBanner[]> {
    const supabase = getServerSupabase()
    if (!supabase) return []

    let query = supabase
        .from('dealer_site_banners')
        .select('id, title, site_slug, desktop_image_url, mobile_image_url, sort_order, created_at')
        .eq('dealer_id', dealerId)
        .eq('is_active', true)

    if (siteSlug) {
        query = query.or(`site_slug.is.null,site_slug.eq.${siteSlug}`)
    }

    const { data, error } = await query
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

    if (error) return []
    return (data ?? []) as SiteBanner[]
}
