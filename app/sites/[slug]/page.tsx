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

// ── Hybrid Landing Portal — choose between new & used sites ──────────────────
function HybridLandingPage({
    dealerName, location, phone, email, slug, brands,
}: {
    dealerName: string; location: string; phone: string; email: string;
    slug: string; brands: string[];
}) {
    const brandLabel = brands.length > 0 ? brands.join(', ') : 'New Cars'
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-lg text-center">
                <h1 className="text-3xl font-bold text-white mb-1">{dealerName}</h1>
                <p className="text-gray-400 text-sm mb-10">{location}</p>

                <p className="text-gray-300 text-base mb-6 font-medium">What are you looking for?</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {/* New Cars */}
                    <a
                        href={`/${slug}-${brands[0]?.toLowerCase().replace(/\s+/g, '-') ?? 'new'}`}
                        className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 hover:border-blue-400/60 hover:bg-blue-500/10 transition-all duration-200"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M5 3l14 9-14 9V3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">New Cars</p>
                            <p className="text-blue-400 text-sm mt-1">{brandLabel}</p>
                            <p className="text-gray-500 text-xs mt-1">Brand new vehicles from the showroom</p>
                        </div>
                        <span className="text-xs font-semibold text-blue-400 group-hover:underline">Browse New Cars →</span>
                    </a>

                    {/* Pre-Owned Cars */}
                    <a
                        href={`/${slug}-used`}
                        className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 hover:border-amber-400/60 hover:bg-amber-500/10 transition-all duration-200"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">Pre-Owned Cars</p>
                            <p className="text-amber-400 text-sm mt-1">Certified Used Vehicles</p>
                            <p className="text-gray-500 text-xs mt-1">Quality pre-owned cars at great prices</p>
                        </div>
                        <span className="text-xs font-semibold text-amber-400 group-hover:underline">Browse Used Cars →</span>
                    </a>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <a href={`tel:${phone}`} className="hover:text-gray-300 transition-colors">📞 {phone}</a>
                    <a href={`mailto:${email}`} className="hover:text-gray-300 transition-colors">✉️ {email}</a>
                </div>
                <div className="mt-8 text-xs text-gray-700">
                    Powered by <span className="text-blue-500 font-semibold">DealerSite Pro</span>
                </div>
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

    const isHybridDealer = sells_new_cars && sells_used_cars

    // ── Hybrid dealer on their MAIN URL → show portal landing page ───────────
    // Each site is separate: brand URL = new cars, -used URL = used cars.
    // The main slug is just a portal to navigate to either site.
    if (isHybridDealer && !brandFilter && !usedCarSite) {
        return (
            <HybridLandingPage
                dealerName={dealer.dealership_name}
                location={dealer.location}
                phone={dealer.phone}
                email={dealer.email}
                slug={dealer.slug}
                brands={brands}
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
        const cyeproCars = cyepro_api_key
            ? await fetchCyeproInventoryAsCars(cyepro_api_key, { size: 30 })
            : []
        if (cyeproCars.length > 0) {
            cars = cyeproCars
        } else if (vehicles.length > 0) {
            cars = dbVehiclesToCars(vehicles)
        } else {
            cars = []
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
