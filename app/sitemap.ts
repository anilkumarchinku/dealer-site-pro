import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { dealerSiteHref } from '@/lib/utils/domain'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://indrav.in'

async function getAllDealerSlugs(): Promise<string[]> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!url || !key || url.includes('placeholder')) return []

    const supabase = createClient(url, key)
    const { data } = await supabase
        .from('dealers')
        .select('slug')
        .eq('onboarding_complete', true)

    return (data ?? [])
        .map((d: { slug: string | null }) => d.slug?.trim())
        .filter((slug): slug is string => Boolean(slug))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const slugs = await getAllDealerSlugs()

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${BASE_URL}/cars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/brands`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/tools/emi-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/tools/car-valuation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/tools/on-road-price`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/tools/insurance-estimator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ]

    const dealerRoutes: MetadataRoute.Sitemap = slugs.map(slug => ({
        url: dealerSiteHref(slug),
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    return [...staticRoutes, ...dealerRoutes]
}
