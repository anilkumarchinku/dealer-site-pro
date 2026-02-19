/**
 * code-generator.ts
 * Generates a `dealer.config.ts` file from dealer DB data.
 * This config is pushed to the dealer's GitHub repo and used by
 * the standalone Next.js site template to render their site.
 */

export interface DealerConfigInput {
    dealershipName: string
    tagline: string | null
    phone: string
    whatsapp?: string | null
    email: string
    location: string
    fullAddress?: string | null
    mapLink?: string | null
    slug: string
    styleTemplate: 'family' | 'luxury' | 'modern' | 'sporty'
    sellsNewCars: boolean
    sellsUsedCars: boolean
    brands: string[]
    services: string[]
    heroTitle?: string | null
    heroSubtitle?: string | null
    heroCtaText?: string | null
    workingHours?: string | null
    facebook?: string | null
    instagram?: string | null
    youtube?: string | null
    gstin?: string | null
}

/**
 * Produces the full content of `dealer.config.ts` as a string.
 * This file is committed to the dealer's GitHub repo.
 */
export function generateDealerConfig(dealer: DealerConfigInput): string {
    const heroTitle    = dealer.heroTitle    ?? `Welcome to ${dealer.dealershipName}`
    const heroSubtitle = dealer.heroSubtitle ?? (dealer.tagline ?? `Your trusted car dealership in ${dealer.location}`)
    const heroCtaText  = dealer.heroCtaText  ?? 'Explore Inventory'

    const brandsArray   = jsonArray(dealer.brands)
    const servicesArray = jsonArray(dealer.services)

    const social = {
        facebook:  dealer.facebook  ?? null,
        instagram: dealer.instagram ?? null,
        youtube:   dealer.youtube   ?? null,
    }

    return `// AUTO-GENERATED — do not edit manually.
// Regenerated on every settings change via dealer-site-pro dashboard.

import type { DealerConfig } from '@/lib/types/dealer-config'

const config: DealerConfig = {
    // ── Identity ──────────────────────────────────────────────────────────
    dealershipName: ${str(dealer.dealershipName)},
    tagline:        ${str(dealer.tagline)},
    slug:           ${str(dealer.slug)},

    // ── Contact ───────────────────────────────────────────────────────────
    phone:       ${str(dealer.phone)},
    whatsapp:    ${str(dealer.whatsapp ?? dealer.phone)},
    email:       ${str(dealer.email)},
    location:    ${str(dealer.location)},
    fullAddress: ${str(dealer.fullAddress)},
    mapLink:     ${str(dealer.mapLink)},
    gstin:       ${str(dealer.gstin)},
    workingHours:${str(dealer.workingHours)},

    // ── Inventory type ────────────────────────────────────────────────────
    sellsNewCars:  ${dealer.sellsNewCars},
    sellsUsedCars: ${dealer.sellsUsedCars},
    brands:   ${brandsArray},
    services: ${servicesArray},

    // ── Template ──────────────────────────────────────────────────────────
    styleTemplate: ${str(dealer.styleTemplate)},
    hero: {
        title:   ${str(heroTitle)},
        subtitle:${str(heroSubtitle)},
        ctaText: ${str(heroCtaText)},
    },

    // ── Social ────────────────────────────────────────────────────────────
    social: {
        facebook:  ${str(social.facebook)},
        instagram: ${str(social.instagram)},
        youtube:   ${str(social.youtube)},
    },
}

export default config
`
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Serialise a string value safely for embedding in TS source. */
function str(value: string | null | undefined): string {
    if (value == null || value === '') return 'null'
    return `'${value.replace(/'/g, "\\'")}'`
}

/** Serialise a string array for embedding in TS source. */
function jsonArray(arr: string[]): string {
    if (!arr || arr.length === 0) return '[]'
    const items = arr.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')
    return `[${items}]`
}
