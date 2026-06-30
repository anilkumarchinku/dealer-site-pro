import { createClient } from '@supabase/supabase-js'
import { getOptionalEnv } from '@/lib/env'

export interface PublicDealerOffer {
    id: string
    title: string
    description: string | null
    tag: string | null
    valid_until: string | null
    site_slug: string | null
    image_url: string | null
    show_popup: boolean
    created_at: string
}

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

export async function fetchActiveDealerOffers(
    dealerId: string,
    siteSlug?: string | null,
): Promise<PublicDealerOffer[]> {
    const supabase = getServerSupabase()
    if (!supabase) return []
    const today = new Date().toISOString().slice(0, 10)

    let query = supabase
        .from('dealer_offers')
        .select('id, title, description, tag, valid_until, site_slug, image_url, show_popup, created_at')
        .eq('dealer_id', dealerId)
        .eq('is_active', true)
        .or(`valid_until.is.null,valid_until.gte.${today}`)

    if (siteSlug) {
        query = query.or(`site_slug.is.null,site_slug.eq.${siteSlug}`)
    }

    const { data, error } = await query
        .order('created_at', { ascending: false })

    if (error) return []
    return (data ?? []) as PublicDealerOffer[]
}

export async function fetchDealerOfferPopup(
    dealerId: string,
    siteSlug: string,
): Promise<PublicDealerOffer | null> {
    const offers = await fetchActiveDealerOffers(dealerId, siteSlug)

    return offers.find(offer =>
        offer.show_popup
        && Boolean(offer.image_url)
        && (offer.site_slug === siteSlug || offer.site_slug === null)
    ) ?? null
}
