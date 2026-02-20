/**
 * dealers.ts — Server-side dealer data fetching
 * Used by public site pages (app/sites/[slug]/page.tsx)
 * NO "use client" — this runs only on the server
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { DBVehicle } from './vehicles'

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
    brands: string[]
    vehicles: DBVehicle[]
    hero_title: string | null
    hero_subtitle: string | null
    hero_cta_text: string | null
    working_hours: string | null
    services: string[] | null
    /** Set when the URL was a brand-specific slug, e.g. "abhi-motors-tata" */
    brandFilter: string | null
    /** True when the URL had the "-used" suffix — render the used-car site with Bentley colours */
    usedCarSite: boolean
}

function getServerSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key || url.includes('placeholder')) return null
    return createClient(url, key)
}

/** Try to resolve a dealer row directly by its main slug */
async function findDealerByExactSlug(supabase: SupabaseClient, slug: string) {
    const { data, error } = await supabase
        .from('dealers')
        .select('id, dealership_name, tagline, phone, email, location, full_address, slug, style_template, onboarding_complete, sells_new_cars, sells_used_cars')
        .eq('slug', slug)
        .eq('onboarding_complete', true)
        .single()
    if (error || !data) return null
    return data
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
export async function fetchDealerBySlug(slug: string): Promise<DealerPublicData | null> {
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
                    brandFilter = brandName
                    break
                }
            }
        }
    }

    if (!dealer) return null

    // ── 3. Fetch brands, template config, vehicles, and services in parallel
    // For brand-specific sites, also try dealer_site_configs for per-brand overrides
    const brandSlugForConfig = brandFilter ? brandToUrlSlug(brandFilter) : null

    const [brandsResult, mainConfigResult, siteConfigResult, vehiclesResult, servicesResult] = await Promise.all([
        supabase
            .from('dealer_brands')
            .select('brand_name')
            .eq('dealer_id', dealer.id),
        supabase
            .from('dealer_template_configs')
            .select('hero_title, hero_subtitle, hero_cta_text, working_hours')
            .eq('dealer_id', dealer.id)
            .single(),
        // Only query dealer_site_configs when rendering a brand-specific page
        brandSlugForConfig
            ? supabase
                .from('dealer_site_configs')
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
            .from('dealer_services')
            .select('service_name')
            .eq('dealer_id', dealer.id)
            .eq('is_active', true),
    ])

    // Brand-specific config takes priority over the shared main config
    const cfg = siteConfigResult.data ?? mainConfigResult.data

    return {
        id:              dealer.id,
        dealership_name: dealer.dealership_name,
        tagline:         (siteConfigResult.data?.tagline ?? dealer.tagline) ?? null,
        phone:           dealer.phone,
        email:           dealer.email,
        location:        dealer.location,
        full_address:    dealer.full_address ?? null,
        slug:            dealer.slug,
        style_template:  siteConfigResult.data?.style_template ?? dealer.style_template ?? 'family',
        sells_new_cars:  dealer.sells_new_cars ?? false,
        sells_used_cars: dealer.sells_used_cars ?? false,
        brands:          brandsResult.data?.map(b => b.brand_name) ?? [],
        vehicles:        (vehiclesResult.data ?? []) as DBVehicle[],
        hero_title:      cfg?.hero_title ?? null,
        hero_subtitle:   cfg?.hero_subtitle ?? null,
        hero_cta_text:   cfg?.hero_cta_text ?? null,
        working_hours:   cfg?.working_hours ?? null,
        services:        servicesResult.data?.map(s => s.service_name) ?? null,
        brandFilter,
        usedCarSite,
    }
}
