/**
 * dealers.ts — Server-side dealer data fetching
 * Used by public site pages (app/sites/[slug]/page.tsx)
 * NO "use client" — this runs only on the server
 */

import { createServerClient } from '@supabase/ssr'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { DBVehicle } from './vehicles'
import { getOptionalEnv, isPlaceholderEnvValue } from '@/lib/env'

// ── Known brand slug patterns (longest first for correct suffix matching) ───
// Maps URL slug suffix → canonical brand name used in getCarsByMake()
const KNOWN_BRAND_SLUGS: { slug: string; name: string }[] = [
    { slug: 'maruti-suzuki',  name: 'Maruti Suzuki'  },
    { slug: 'tata-motors',    name: 'Tata Motors'    },
    { slug: 'mercedes-benz',  name: 'Mercedes-Benz'  },
    { slug: 'land-rover',     name: 'Land Rover'     },
    { slug: 'force-motors',   name: 'Force Motors'   },
    { slug: 'lamborghini',    name: 'Lamborghini'    },
    { slug: 'volkswagen',     name: 'Volkswagen'     },
    { slug: 'mahindra',       name: 'Mahindra'       },
    { slug: 'hyundai',        name: 'Hyundai'        },
    { slug: 'citroen',        name: 'Citroen'        },
    { slug: 'bentley',        name: 'Bentley'        },
    { slug: 'porsche',        name: 'Porsche'        },
    { slug: 'renault',        name: 'Renault'        },
    { slug: 'nissan',         name: 'Nissan'         },
    { slug: 'toyota',         name: 'Toyota'         },
    { slug: 'jaguar',         name: 'Jaguar'         },
    { slug: 'isuzu',          name: 'Isuzu'          },
    { slug: 'honda',          name: 'Honda'          },
    { slug: 'skoda',          name: 'Skoda'          },
    { slug: 'volvo',          name: 'Volvo'          },
    { slug: 'lexus',          name: 'Lexus'          },
    { slug: 'maruti',         name: 'Maruti Suzuki'  },
    { slug: 'tata',           name: 'Tata Motors'    },
    { slug: 'tesla',          name: 'Tesla'          },
    { slug: 'jeep',           name: 'Jeep'           },
    { slug: 'audi',           name: 'Audi'           },
    { slug: 'bmw',            name: 'BMW'            },
    { slug: 'kia',            name: 'Kia'            },
    { slug: 'byd',            name: 'BYD'            },
    { slug: 'mg',             name: 'MG'             },
].sort((a, b) => b.slug.length - a.slug.length) // longest first — prevents "tata" matching before "tata-motors"

// ── Exported: convert a brand name to a URL-safe slug ───────────────────────
// "Tata Motors" → "tata-motors",  "Mahindra" → "mahindra"
export function brandToUrlSlug(brandName: string): string {
    const known = KNOWN_BRAND_SLUGS.find(
        b => b.name.toLowerCase() === brandName.toLowerCase()
    )
    if (known) return known.slug
    return brandName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

function titleCaseBrandSlug(brandSlug: string): string {
    return brandSlug
        .split('-')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
}

export function findBrandNameByUrlSlug(brands: string[], brandSlug: string): string | null {
    const normalized = brandSlug.trim().toLowerCase()
    if (!normalized) return null

    return brands.find(brand => brandToUrlSlug(brand) === normalized) ?? null
}

// ── Offer types ──────────────────────────────────────────────────────────────
export interface DealerOfferPublic {
    id: string
    title: string
    description: string | null
    tag: string | null
    valid_until: string | null
    image_url: string | null
    promotion_type: string | null
    brand_id: string | null
    branch_city: string | null
    outlet_name: string | null
}

// ── Outlet types ──────────────────────────────────────────────────────────────
export interface OutletPublicData {
    brandName: string
    vehicleType: string | null
    isPrimary: boolean
    outletName: string | null
    phone: string | null
    whatsapp: string | null
    email: string | null
    fullAddress: string | null
    city: string | null
    state: string | null
    googleMapsUrl: string | null
    branches: Array<{ city: string; state?: string; address: string; phone?: string; whatsapp?: string }> | null
}

// ── Types ────────────────────────────────────────────────────────────────────
export interface DealerPublicData {
    id: string
    dealership_name: string
    tagline: string | null
    phone: string
    email: string
    location: string
    full_address: string | null
    slug: string
    style_template: string
    sells_new_cars: boolean
    sells_used_cars: boolean
    sells_two_wheelers: boolean
    sells_three_wheelers: boolean
    brands: string[]
    vehicles: DBVehicle[]
    branches?: Array<{ city: string; address: string; phone?: string }> | null
    service_centers?: Array<{ id: string; name: string; address?: string; city?: string; phone?: string }> | null
    hero_title: string | null
    hero_subtitle: string | null
    hero_cta_text: string | null
    working_hours: string | null
    /** Social profile URLs (from dealer_template_configs); null when not set. */
    social: {
        facebook: string | null
        instagram: string | null
        youtube: string | null
        twitter: string | null
        linkedin: string | null
    }
    services: string[] | null
    /** All outlets (brand-level contact/location data) for this dealer */
    outlets: OutletPublicData[]
    /** Resolved outlet when viewing a brand-specific URL */
    activeOutlet: OutletPublicData | null
    /** Dealer-level WhatsApp number */
    whatsapp: string | null
    /** Set when the URL was a brand-specific slug, e.g. "abhi-motors-tata" */
    brandFilter: string | null
    /** True when the URL had the "-used" suffix — render the used-car site with Bentley colours */
    usedCarSite: boolean
    /** Cyepro inventory API key — server-side only, never sent to browser */
    cyepro_api_key: string | null
    logo_url: string | null
    hero_image_url: string | null
    /** Primary vehicle category: car | two-wheeler | three-wheeler */
    vehicle_type: string | null
    /** Active promotions/offers for this dealer */
    offers: DealerOfferPublic[]
}

export type FetchDealerBySlugOptions = {
    /**
     * Include server-only private fields such as cyepro_api_key.
     * Keep false for ordinary public pages; enable only where the server must
     * call dealer-scoped providers and will not pass the secret to client props.
     */
    includePrivate?: boolean
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

async function getAuthenticatedServerSupabase() {
    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()
    if (!url || !key) return null

    const cookieStore = await cookies()

    return createServerClient(url, key, {
        cookies: {
            getAll() {
                return cookieStore.getAll()
            },
            setAll() {
                // Public site rendering only needs to read any existing owner
                // session. Cookie writes are not available from all server contexts.
            },
        },
    })
}

function getPrivateServerSupabase() {
    const url = getSupabaseUrl()
    const key = getOptionalEnv('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !key || isPlaceholderEnvValue(key)) return null

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

function normalizePrivateApiKey(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value.trim() : null
}

async function fetchDealerCyeproApiKeyForAuthenticatedOwner(dealerId: string): Promise<string | null> {
    try {
        const supabase = await getAuthenticatedServerSupabase()
        if (!supabase) return null

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data, error } = await supabase
            .from('dealers')
            .select('cyepro_api_key')
            .eq('id', dealerId)
            .eq('user_id', user.id)
            .maybeSingle()

        if (error) return null
        return normalizePrivateApiKey(data?.cyepro_api_key)
    } catch {
        return null
    }
}

async function fetchDealerCyeproApiKeyWithServerSecret(dealerId: string): Promise<string | null> {
    try {
        const supabase = getPrivateServerSupabase()
        if (!supabase) return null

        const { data, error } = await supabase
            .from('dealers')
            .select('cyepro_api_key')
            .eq('id', dealerId)
            .maybeSingle()

        if (error) return null
        return normalizePrivateApiKey(data?.cyepro_api_key)
    } catch {
        return null
    }
}

async function fetchDealerCyeproApiKey(dealerId: string): Promise<string | null> {
    return await fetchDealerCyeproApiKeyForAuthenticatedOwner(dealerId)
        ?? await fetchDealerCyeproApiKeyWithServerSecret(dealerId)
}

/** Try to resolve a dealer row directly by its main slug */
async function findDealerByExactSlug(supabase: SupabaseClient, slug: string) {
    const { data, error } = await supabase
        .from('public_dealer_site_profiles')
        .select('id, dealership_name, tagline, phone, whatsapp, email, location, full_address, slug, style_template, onboarding_complete, sells_new_cars, sells_used_cars, sells_two_wheelers, sells_three_wheelers, vehicle_type, logo_url, hero_image_url, branches')
        .eq('slug', slug)
        .single()
    if (error || !data) return null
    return data
}

async function resolveDealerBrandFilterBySlug(
    supabase: SupabaseClient,
    dealerId: string,
    brandSlug: string,
): Promise<string | null> {
    const { data, error } = await supabase
        .from('public_dealer_site_brands')
        .select('brand_name')
        .eq('dealer_id', dealerId)

    if (error || !data) return null
    return findBrandNameByUrlSlug(data.map(row => row.brand_name), brandSlug)
}

/**
 * Fetch all public dealer data by slug.
 *
 * Supports two slug forms:
 *   1. `{dealer-slug}`              → dealer's main site (all brands or used stock)
 *   2. `{dealer-slug}-{brand-slug}` → brand-specific site for multi-brand dealers
 *
 * Returns null if the dealer doesn't exist or hasn't completed onboarding.
 */
export async function fetchDealerBySlug(
    slug: string,
    options: FetchDealerBySlugOptions = {},
): Promise<DealerPublicData | null> {
    const supabase = getServerSupabase()
    if (!supabase) return null

    // ── 1. Try exact match first ──────────────────────────────────────────
    let dealer = await findDealerByExactSlug(supabase, slug)
    let brandFilter: string | null = null
    let usedCarSite = false

    // ── 2. Detect "-used" suffix (hybrid dealer's used-car site) ──────────
    if (!dealer && slug.endsWith('-used')) {
        const parentSlug = slug.slice(0, -'-used'.length)
        const parentDealer = await findDealerByExactSlug(supabase, parentSlug)
        if (parentDealer) {
            dealer = parentDealer
            usedCarSite = true
        }
    }

    // ── 3. If not found, detect brand suffix and try parent slug ──────────
    if (!dealer) {
        for (const { slug: brandSlug, name: brandName } of KNOWN_BRAND_SLUGS) {
            const suffix = `-${brandSlug}`
            if (slug.endsWith(suffix) && slug.length > suffix.length) {
                const parentSlug = slug.slice(0, -suffix.length)
                const parentDealer = await findDealerByExactSlug(supabase, parentSlug)
                if (parentDealer) {
                    dealer = parentDealer
                    brandFilter = await resolveDealerBrandFilterBySlug(supabase, parentDealer.id, brandSlug) ?? brandName
                    break
                }
            }
        }
    }

    // ── 4. Dynamic fallback for saved brand-suffix URLs ──────────────────
    // e.g. "3wv2-lohia-auto" → parent "3wv2" + exact saved brand "Lohia Auto"
    // Tries shortest possible suffix first so it finds the longest valid parent.
    if (!dealer) {
        const segments = slug.split('-')
        for (let i = segments.length - 1; i >= 1; i--) {
            const parentSlug = segments.slice(0, i).join('-')
            const parentDealer = await findDealerByExactSlug(supabase, parentSlug)
            if (parentDealer) {
                const vtype = parentDealer.vehicle_type
                const brandSuffix = segments.slice(i).join('-')
                const savedBrand = await resolveDealerBrandFilterBySlug(supabase, parentDealer.id, brandSuffix)
                if (savedBrand) {
                    dealer = parentDealer
                    brandFilter = savedBrand
                    break
                }

                if (vtype === 'two-wheeler' || vtype === 'three-wheeler') {
                    dealer = parentDealer
                    brandFilter = titleCaseBrandSlug(brandSuffix)
                    break
                }
            }
        }
    }

    if (!dealer) return null

    // ── 3. Fetch brands, template config, vehicles, and services in parallel
    // For brand-specific sites, also try dealer_site_configs for per-brand overrides
    const brandSlugForConfig = brandFilter ? brandToUrlSlug(brandFilter) : null

    const [brandsResult, mainConfigResult, siteConfigResult, vehiclesResult, servicesResult, serviceCentersResult, offersResult, cyeproApiKey] = await Promise.all([
        supabase
            .from('public_dealer_site_brands')
            .select('brand_name, vehicle_type, is_primary, outlet_name, phone, whatsapp, email, full_address, city, state, google_maps_url, branches')
            .eq('dealer_id', dealer.id),
        supabase
            .from('public_dealer_site_template_configs')
            .select('hero_title, hero_subtitle, hero_cta_text, working_hours, facebook_url, instagram_url, youtube_url, twitter_url, linkedin_url')
            .eq('dealer_id', dealer.id)
            .single(),
        // Only query dealer_site_configs when rendering a brand-specific page
        brandSlugForConfig
            ? supabase
                .from('public_dealer_site_configs')
                .select('style_template, hero_title, hero_subtitle, hero_cta_text, working_hours, tagline')
                .eq('dealer_id', dealer.id)
                .eq('brand_slug', brandSlugForConfig)
                .maybeSingle()
            : Promise.resolve({ data: null }),
        supabase
            .from('vehicles')
            .select('*')
            .eq('dealer_id', dealer.id)
            .eq('status', 'available')
            .order('created_at', { ascending: false }),
        supabase
            .from('public_dealer_site_services')
            .select('service_name')
            .eq('dealer_id', dealer.id),
        supabase
            .from('public_dealer_site_service_centers')
            .select('id, name, address, city, phone')
            .eq('dealer_id', dealer.id)
            .order('display_order', { ascending: true }),
        supabase
            .from('public_dealer_site_offers')
            .select('id, title, description, tag, valid_until, image_url, promotion_type, brand_id, branch_city, outlet_name, created_at')
            .eq('dealer_id', dealer.id)
            .order('created_at', { ascending: false })
            .limit(20),
        options.includePrivate ? fetchDealerCyeproApiKey(dealer.id) : Promise.resolve(null),
    ])

    // Brand-specific config takes priority over the shared main config
    const cfg = siteConfigResult.data ?? mainConfigResult.data
    // Social links live only on the main template config (not per-brand site configs).
    const mainConfig = mainConfigResult.data

    // ── Build outlets from brand rows ───────────────────────────────────
    const outlets: OutletPublicData[] = (brandsResult.data ?? []).map(b => ({
        brandName:   b.brand_name,
        vehicleType: b.vehicle_type,
        isPrimary:   b.is_primary ?? false,
        outletName:  b.outlet_name ?? null,
        phone:       b.phone ?? null,
        whatsapp:    b.whatsapp ?? null,
        email:       b.email ?? null,
        fullAddress: b.full_address ?? null,
        city:        b.city ?? null,
        state:       b.state ?? null,
        googleMapsUrl: b.google_maps_url ?? null,
        branches:    Array.isArray(b.branches) ? b.branches as OutletPublicData['branches'] : null,
    }))

    // Resolve activeOutlet when on a brand-specific URL
    const activeOutlet = brandFilter
        ? outlets.find(o => o.brandName === brandFilter) ?? null
        : null

    // ── Build offers, filtered for brand-specific pages ──────────────────
    const allOffers: DealerOfferPublic[] = (offersResult.data ?? []).map(o => ({
        id:             o.id,
        title:          o.title,
        description:    o.description ?? null,
        tag:            o.tag ?? null,
        valid_until:    o.valid_until ?? null,
        image_url:      o.image_url ?? null,
        promotion_type: o.promotion_type ?? null,
        brand_id:       o.brand_id ?? null,
        branch_city:    o.branch_city ?? null,
        outlet_name:    o.outlet_name ?? null,
    }))

    // On brand-specific URLs, show only offers for that outlet + dealer-wide offers
    const filteredOffers = brandFilter
        ? allOffers.filter(o => !o.brand_id || o.outlet_name === brandFilter)
        : allOffers

    // Outlet-level contact overrides (fall back to dealer-level)
    const effectivePhone      = activeOutlet?.phone      || dealer.phone
    const effectiveEmail      = activeOutlet?.email       || dealer.email
    const effectiveAddress    = activeOutlet?.fullAddress  || dealer.full_address
    const effectiveWhatsapp   = activeOutlet?.whatsapp    || dealer.whatsapp

    return {
        id:              dealer.id,
        dealership_name: dealer.dealership_name,
        tagline:         (siteConfigResult.data?.tagline ?? dealer.tagline) ?? null,
        phone:           effectivePhone,
        email:           effectiveEmail,
        location:        dealer.location,
        full_address:    effectiveAddress ?? null,
        slug:            dealer.slug,
        style_template:  siteConfigResult.data?.style_template ?? dealer.style_template ?? 'family',
        sells_new_cars:       dealer.sells_new_cars       ?? false,
        sells_used_cars:      dealer.sells_used_cars      ?? false,
        sells_two_wheelers:   dealer.sells_two_wheelers   ?? false,
        sells_three_wheelers: dealer.sells_three_wheelers ?? false,
        brands:          brandsResult.data
            ?.filter(b => b.vehicle_type === 'cars' || b.vehicle_type == null)
            .map(b => b.brand_name) ?? [],
        vehicles:        (vehiclesResult.data ?? []) as DBVehicle[],
        branches:        dealer.branches ?? null,
        service_centers: serviceCentersResult.data ?? null,
        hero_title:      cfg?.hero_title ?? null,
        hero_subtitle:   cfg?.hero_subtitle ?? null,
        hero_cta_text:   cfg?.hero_cta_text ?? null,
        working_hours:   cfg?.working_hours ?? null,
        social: {
            facebook:  mainConfig?.facebook_url  ?? null,
            instagram: mainConfig?.instagram_url ?? null,
            youtube:   mainConfig?.youtube_url   ?? null,
            twitter:   mainConfig?.twitter_url   ?? null,
            linkedin:  mainConfig?.linkedin_url  ?? null,
        },
        services:        servicesResult.data?.map(s => s.service_name) ?? null,
        outlets,
        activeOutlet,
        whatsapp:        effectiveWhatsapp ?? null,
        brandFilter,
        usedCarSite,
        cyepro_api_key:  cyeproApiKey,
        logo_url:        dealer.logo_url       ?? null,
        hero_image_url:  dealer.hero_image_url ?? null,
        vehicle_type:    dealer.vehicle_type    ?? null,
        offers:          filteredOffers,
    }
}
