export type TemplateStyle = 'family' | 'luxury' | 'modern' | 'sporty';

export interface DealerConfig {
    // ── Identity ──────────────────────────────────────────────────────────
    dealershipName: string
    tagline: string | null
    slug: string

    // ── Contact ───────────────────────────────────────────────────────────
    phone: string
    whatsapp: string
    email: string
    location: string
    fullAddress: string | null
    mapLink: string | null
    gstin: string | null
    workingHours?: string | null

    // ── Inventory type ────────────────────────────────────────────────────
    sellsNewCars: boolean
    sellsUsedCars: boolean
    brands: string[]
    services: string[]

    // ── Template ──────────────────────────────────────────────────────────
    styleTemplate: TemplateStyle
    hero: {
        title: string | null
        subtitle: string | null
        ctaText: string | null
    }

    // ── Social ────────────────────────────────────────────────────────────
    social: {
        facebook: string | null
        instagram: string | null
        youtube: string | null
    }
}
