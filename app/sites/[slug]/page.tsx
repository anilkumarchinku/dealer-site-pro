import type { Metadata } from 'next'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import { allCars, getCarsByMake } from '@/lib/data/cars'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { fetchCyeproInventoryAsCars } from '@/lib/services/cyepro-service'
import type { Car } from '@/lib/types/car'
import type { DBVehicle } from '@/lib/db/vehicles'
import type { Service } from '@/lib/types'

export const runtime = 'edge'

interface SitePageProps {
    params: Promise<{ slug: string }>
}

// ── Convert DB vehicles → Car shape the templates expect ─────────────────────
function dbVehiclesToCars(vehicles: DBVehicle[]): Car[] {
    return vehicles.map(v => ({
        id: v.id,
        make: v.make,
        model: v.model,
        variant: v.variant ?? '',
        year: v.year,
        bodyType: (v.body_type ?? 'SUV') as Car['bodyType'],
        segment: 'B' as Car['segment'],
        pricing: {
            exShowroom: {
                min: Math.round(v.price_paise / 100),
                max: Math.round(v.price_paise / 100),
                currency: 'INR' as const,
            },
        },
        engine: {
            type: (v.fuel_type ?? 'Petrol') as Car['engine']['type'],
            power: '—',
            torque: '—',
        },
        transmission: {
            type: (v.transmission ?? 'Manual') as Car['transmission']['type'],
        },
        performance: {},
        dimensions: { seatingCapacity: 5 },
        features: { keyFeatures: v.features ?? [] },
        images: { hero: '/placeholder-car.jpg', exterior: [], interior: [] },
        meta: { viewCount: v.view_count },
        price: `₹${(v.price_paise / 100).toLocaleString('en-IN')}`,
        condition: v.condition,
    }))
}

// ── Coming Soon page ──────────────────────────────────────────────────────────
function ComingSoon({ slug }: { slug: string }) {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center px-6">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                    <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Coming Soon</h1>
                <p className="text-gray-400 text-lg mb-2">
                    <span className="text-blue-400 font-semibold">{slug}</span> is setting up their dealership website.
                </p>
                <p className="text-gray-500 text-sm">Check back soon — it will be ready shortly!</p>
                <div className="mt-8 text-xs text-gray-600">
                    Powered by <span className="text-blue-500 font-semibold">DealerSite Pro</span>
                </div>
            </div>
        </div>
    )
}

// ── Multi-Site Portal — shown for hybrid & multi-brand dealers on their main URL
function MultiSitePortal({
    dealerName, location, phone, email, tagline, slug, brands, isHybrid,
}: {
    dealerName: string; location: string; phone: string; email: string;
    tagline?: string | null; slug: string; brands: string[]; isHybrid: boolean;
}) {
    const attractiveLine = tagline ?? `Your Trusted Automobile Partner in ${location}`

    // Build site cards
    const siteCards: { label: string; sublabel: string; href: string; color: string; emoji: string }[] = []

    if (isHybrid) {
        // Hybrid: brand new + pre-owned
        const brandSlug = brands[0]?.toLowerCase().replace(/\s+/g, '-') ?? 'new'
        siteCards.push({
            label:    'New Cars',
            sublabel: brands.length > 0 ? brands.join(' · ') : 'Brand New Vehicles',
            href:     `/${slug}-${brandSlug}`,
            color:    'blue',
            emoji:    '🚗',
        })
        siteCards.push({
            label:    'Pre-Owned Cars',
            sublabel: 'Certified Used Vehicles',
            href:     `/${slug}-used`,
            color:    'amber',
            emoji:    '🛡️',
        })
    } else {
        // Multi-brand new-car only: one card per brand
        brands.forEach(brand => {
            const brandSlug = brand.toLowerCase().replace(/\s+/g, '-')
            siteCards.push({
                label:    brand,
                sublabel: 'New Cars · Authorised Dealer',
                href:     `/${slug}-${brandSlug}`,
                color:    'blue',
                emoji:    '✨',
            })
        })
    }

    const colorMap: Record<string, { border: string; bg: string; text: string; btn: string }> = {
        blue:  { border: 'border-blue-500/30',  bg: 'bg-blue-500/5',  text: 'text-blue-400',  btn: 'bg-blue-500 hover:bg-blue-600'  },
        amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400', btn: 'bg-amber-500 hover:bg-amber-600' },
    }

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">

                {/* ── Hero section ── */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4 uppercase tracking-wide">
                        Authorised Dealership
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        {dealerName}
                    </h1>
                    <p className="text-gray-400 text-base mb-4">{location}</p>
                    <p className="text-lg text-gray-300 font-medium max-w-md mx-auto leading-relaxed">
                        {attractiveLine}
                    </p>
                </div>

                {/* ── Site cards ── */}
                <div className={`grid gap-4 mb-10 ${siteCards.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                    {siteCards.map((card, i) => {
                        const c = colorMap[card.color] ?? colorMap.blue
                        return (
                            <a
                                key={i}
                                href={card.href}
                                className={`group flex flex-col gap-4 p-6 rounded-2xl border-2 ${c.border} ${c.bg} hover:scale-[1.02] transition-all duration-200`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{card.emoji}</span>
                                    <div>
                                        <p className="text-white font-bold text-base">{card.label}</p>
                                        <p className={`text-xs mt-0.5 ${c.text}`}>{card.sublabel}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold ${c.text} group-hover:underline`}>
                                    Explore {card.label} →
                                </span>
                            </a>
                        )
                    })}
                </div>

                {/* ── Contact Sales section ── */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-gray-400 text-sm mb-4 font-medium">Need help choosing? Talk to our sales team</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href={`tel:${phone}`}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Sales — {phone}
                        </a>
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-gray-300 text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {email}
                        </a>
                    </div>
                </div>

                <p className="text-center mt-8 text-xs text-gray-700">
                    Powered by <span className="text-blue-500 font-semibold">DealerSite Pro</span>
                </p>
            </div>
        </div>
    )
}

// ── No Stock page — for used-only dealers with no inventory yet ───────────────
function NoStockPage({ dealerName, phone, email }: { dealerName: string; phone: string; email: string }) {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center px-6 max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                    <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{dealerName}</h1>
                <p className="text-amber-400 font-semibold mb-3">Stock Update Coming Soon</p>
                <p className="text-gray-400 text-sm mb-6">
                    Our inventory is being updated. Contact us directly for available vehicles.
                </p>
                <div className="space-y-2">
                    <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                        📞 {phone}
                    </a>
                    <a href={`mailto:${email}`} className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                        ✉️ {email}
                    </a>
                </div>
                <div className="mt-10 text-xs text-gray-600">
                    Powered by <span className="text-blue-500 font-semibold">DealerSite Pro</span>
                </div>
            </div>
        </div>
    )
}

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)

    if (!dealer) {
        return {
            title: 'Dealership | DealerSite Pro',
            description: 'Car dealership website powered by DealerSite Pro',
        }
    }

    const title       = `${dealer.dealership_name} | ${dealer.location}`
    const description = dealer.tagline
        ?? `${dealer.dealership_name} — your trusted car dealership in ${dealer.location}. Browse our inventory of ${dealer.brands.join(', ')} vehicles.`

    const brandKeywords = dealer.brands.join(', ')
    const serviceKeywords = (dealer.services ?? [])
        .map(s => s.replace(/_/g, ' '))
        .join(', ')

    return {
        title,
        description,
        keywords: `${dealer.dealership_name}, car dealership, ${brandKeywords}, ${dealer.location}, ${serviceKeywords}`,
        openGraph: {
            title,
            description,
            type:      'website',
            siteName:  dealer.dealership_name,
            locale:    'en_IN',
        },
        twitter: {
            card:        'summary',
            title,
            description,
        },
        robots: {
            index:  true,
            follow: true,
        },
        alternates: {
            canonical: `https://${dealer.slug}.dealersitepro.com`,
        },
    }
}

export default async function SitePage({ params }: SitePageProps) {
    const { slug } = await params

    if (!slug) return <ComingSoon slug="this-site" />

    // ── Fetch real dealer data ────────────────────────────────────────────────
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return <ComingSoon slug={slug} />

    const { sells_new_cars, sells_used_cars, brandFilter, brands, vehicles, usedCarSite, cyepro_api_key, logo_url, hero_image_url } = dealer

    const isHybridDealer    = sells_new_cars && sells_used_cars
    const isMultiBrandNewOnly = sells_new_cars && !sells_used_cars && brands.length > 1

    // ── Portal landing page for dealers with multiple sites ───────────────────
    // Triggered for: hybrid dealers OR multi-brand new-car-only dealers
    // on their MAIN URL (no brand/used suffix in slug).
    if (!brandFilter && !usedCarSite && (isHybridDealer || isMultiBrandNewOnly)) {
        return (
            <MultiSitePortal
                dealerName={dealer.dealership_name}
                location={dealer.location}
                phone={dealer.phone}
                email={dealer.email}
                tagline={dealer.tagline}
                slug={dealer.slug}
                brands={brands}
                isHybrid={isHybridDealer}
            />
        )
    }

    // ── Determine site mode ───────────────────────────────────────────────────
    //   brandFilter  → pure new-car page for that brand (works for both new-only & hybrid)
    //   usedCarSite  → pure used-car page (hybrid "-used" or used-only dealer)
    //   new-only     → all brand catalogs combined
    //
    // NOTE: templateSellsNew / templateSellsUsed are what we pass to the template.
    // For hybrid sub-sites these are ALWAYS single-mode so the tab switcher never shows.
    let cars: Car[]
    let templateSellsNew  = sells_new_cars
    let templateSellsUsed = sells_used_cars

    if (brandFilter || (sells_new_cars && !sells_used_cars)) {
        // NEW-CAR site — brand-specific URL OR new-only dealer
        const catalog = brandFilter
            ? await getCarsByMake(brandFilter)
            : (await Promise.all(brands.map(b => getCarsByMake(b)))).flat()
        cars = (catalog.length > 0 ? catalog : allCars.slice(0, 16))
            .map(c => ({ ...c, condition: 'new' as const }))
        templateSellsNew  = true
        templateSellsUsed = false

    } else {
        // USED-CAR site — used-only dealer OR hybrid "-used" sub-site
        console.log('[SitePage] Used-car site detected', {
            slug,
            hasCyeproKey: !!cyepro_api_key,
            dbVehicleCount: vehicles.length,
        })

        const cyeproCars = cyepro_api_key
            ? await fetchCyeproInventoryAsCars(cyepro_api_key, { size: 30 })
            : []

        console.log('[SitePage] Cyepro fetch result:', {
            cyeproCarsCount: cyeproCars.length,
            fallbackDbVehicleCount: vehicles.length,
        })

        if (cyeproCars.length > 0) {
            cars = cyeproCars
            console.log('[SitePage] ✅ Using Cyepro inventory')
        } else if (vehicles.length > 0) {
            cars = dbVehiclesToCars(vehicles)
            console.log('[SitePage] ✅ Using local database vehicles')
        } else {
            cars = []
            console.log('[SitePage] ⚠️ No cars found from either source')
        }
        templateSellsNew  = false
        templateSellsUsed = true
    }

    // ── Brand name & logo ─────────────────────────────────────────────────────
    // New-car sites use OEM brand name + brand logo (no uploaded logo)
    // Used-car sites use Bentley colour palette + uploaded dealer logo
    const isUsedSite = templateSellsUsed && !templateSellsNew
    const brandName  = isUsedSite ? 'Bentley' : (brandFilter ?? brands[0] ?? dealer.dealership_name)
    const logoUrl    = isUsedSite ? (logo_url ?? undefined) : undefined

    const contactInfo = {
        phone:   dealer.phone,
        email:   dealer.email,
        address: dealer.full_address ?? dealer.location,
    }

    // ── Hero text ─────────────────────────────────────────────────────────────
    const heroDefaults: Record<string, { title: string; subtitle: string }> = {
        luxury:       { title: 'THE ART OF PERFORMANCE',          subtitle: 'Experience automotive excellence with our curated collection' },
        sporty:       { title: 'UNLEASH THE BEAST',               subtitle: 'Where raw power meets cutting-edge performance'               },
        family:       { title: "Your Family's Perfect Car Awaits", subtitle: 'Safe, reliable, and affordable vehicles for every family'    },
        professional: { title: 'Drive Your Dreams',               subtitle: 'Discover your perfect vehicle from our premium collection'    },
        modern:       { title: 'Drive Your Dreams',               subtitle: 'Discover your perfect vehicle from our premium collection'    },
    }
    const defaults     = heroDefaults[dealer.style_template] ?? heroDefaults.modern
    const heroTitle    = dealer.hero_title    || defaults.title
    const heroSubtitle = dealer.hero_subtitle || defaults.subtitle

    const taglines: Record<string, string> = {
        luxury: 'Excellence in Motion', sporty: 'Built for Speed',
        family: 'Trusted by Families',  professional: 'Your Trusted Dealer',
    }

    const sharedProps = {
        brandName,
        dealerName:   dealer.dealership_name,
        dealerId:     dealer.id,
        cars,
        contactInfo,
        services:     (dealer.services ?? []) as Service[],
        workingHours: dealer.working_hours ?? null,
        logoUrl,
        heroImageUrl: hero_image_url ?? undefined,
        sellsNewCars:  templateSellsNew,
        sellsUsedCars: templateSellsUsed,
    }

    // ── Render the chosen template ────────────────────────────────────────────
    switch (dealer.style_template) {
        case 'luxury':
            return <LuxuryTemplate  {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.luxury }} />
        case 'sporty':
            return <SportyTemplate  {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.sporty }} />
        case 'family':
            return <FamilyTemplate  {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.family }} />
        case 'modern':
        case 'professional':
        default:
            return <ModernTemplate  {...sharedProps} config={{ heroTitle, heroSubtitle }} />
    }
}
