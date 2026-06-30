import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import { PushPreferenceCenter } from '@/components/PushPreferenceCenter'
import { getCarsByMake } from '@/lib/data/cars'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { fetchAllCyeproInventoryAsCars } from '@/lib/services/cyepro-service'
import { applyUsedVehiclePriceOffersToCars, fetchActiveUsedVehiclePriceOffers } from '@/lib/services/used-vehicle-price-offers'
import type { Car } from '@/lib/types/car'
import type { DBVehicle } from '@/lib/db/vehicles'
import type { Service } from '@/lib/types'
import { dedupeByMakeModel, dedupeCaseInsensitiveStrings, dedupeInventoryCars } from '@/lib/utils/listing-dedupe'
import { isMainDealerHost, publicDealerSitePath, publicVehicleHubPath, type VehicleHubSegment } from '@/lib/utils/public-site-routing'
import { brandLogoUrl, firstVehicleHeroImage, resolveDealerHeroImage, resolveDealerLogoImage } from '@/lib/utils/site-assets'
import { BASE_DOMAIN, dealerSiteHref } from '@/lib/utils/domain'


// Always render fresh — ensures DB changes (e.g. image URLs) take effect immediately.
export const dynamic = 'force-dynamic'

interface SitePageProps {
    params: Promise<{ slug: string }>
}

// ── Convert DB vehicles → Car shape the templates expect ─────────────────────
function dbVehiclesToCars(vehicles: DBVehicle[]): Car[] {
    return vehicles.map(v => {
        const imageUrls = [v.image_url, ...(v.image_urls ?? [])]
            .filter((url, index, urls): url is string => Boolean(url) && urls.indexOf(url) === index)
        const keyFeatures = [
            ...(v.features ?? []),
            v.mileage_km ? `${v.mileage_km.toLocaleString('en-IN')} km driven` : null,
            v.color ? `Colour: ${v.color}` : null,
        ].filter((item): item is string => Boolean(item))

        return {
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
        performance: {
            range: v.mileage_km,
        },
        dimensions: { seatingCapacity: 5 },
        features: { keyFeatures },
        images: { hero: imageUrls[0] ?? '/placeholder-car.jpg', exterior: imageUrls, interior: [] },
        meta: {
            viewCount: v.views,
            dataSource: 'manual',
            sourceVehicleId: v.id,
            registrationNumber: v.registration_number,
            insurance: {
                status: v.insurance_status ?? 'unknown',
                provider: v.insurance_provider,
                validUntil: v.insurance_valid_until,
                quoteUrl: v.insurance_quote_url,
                lastCheckedAt: v.insurance_last_checked_at,
            },
        },
        price: `₹${(v.price_paise / 100).toLocaleString('en-IN')}`,
        condition: v.condition,
        video_url: v.video_url,
        vehicleCategory: '4w',
        }
    })
}

// ── Coming Soon page ──────────────────────────────────────────────────────────
function ComingSoon({ slug }: { slug: string }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center px-6">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                    <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Coming Soon</h1>
                <p className="text-gray-600 text-lg mb-2">
                    <span className="text-blue-600 font-semibold">{slug}</span> is setting up their dealership website.
                </p>
                <p className="text-gray-500 text-sm">Check back soon — it will be ready shortly!</p>
                <div className="mt-8 text-xs text-gray-400">
                    Powered by <span className="text-blue-600 font-semibold">DealerSite Pro</span>
                </div>
            </div>
        </div>
    )
}

// ── Multi-Site Portal — shown for hybrid & multi-brand dealers on their main URL
function MultiSitePortal({
    dealerName, location, phone, email, tagline, slug, brands, isHybrid,
    sellsTwoWheelers, sellsThreeWheelers, siteHrefForSlug, vehicleHubHref,
    outlets,
}: {
    dealerName: string; location: string; phone: string; email: string;
    tagline?: string | null; slug: string; brands: string[]; isHybrid: boolean;
    sellsTwoWheelers: boolean; sellsThreeWheelers: boolean;
    siteHrefForSlug: (siteSlug: string) => string;
    vehicleHubHref: (segment: VehicleHubSegment) => string;
    outlets?: Array<{ brandName: string; outletName?: string | null; city?: string | null }>;
}) {
    // Build a map of brand → city for outlet location display
    const outletCityMap = new Map(
        (outlets ?? []).filter(o => o.city).map(o => [o.brandName, o.city!])
    )
    const attractiveLine = tagline ?? `Your Trusted Automobile Partner in ${location}`

    // Build site cards
    const siteCards: { label: string; sublabel: string; href: string; color: string; emoji: string }[] = []

    if (isHybrid) {
        // Hybrid: one card per brand (new) + one pre-owned card
        if (brands.length > 1) {
            // Multi-brand hybrid: separate card per brand
            brands.forEach(brand => {
                const brandSlug = brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                const city = outletCityMap.get(brand)
                siteCards.push({
                    label: brand,
                    sublabel: city ? `${city} · Authorised Dealer` : 'New Cars · Authorised Dealer',
                    href: siteHrefForSlug(`${slug}-${brandSlug}`),
                    color: 'blue',
                    emoji: '🚗',
                })
            })
        } else {
            // Single-brand hybrid: one "New Cars" card
            const brandSlug = brands[0]?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') ?? 'new'
            siteCards.push({
                label: 'New Cars',
                sublabel: brands.length > 0 ? brands[0] : 'Brand New Vehicles',
                href: siteHrefForSlug(`${slug}-${brandSlug}`),
                color: 'blue',
                emoji: '🚗',
            })
        }
        siteCards.push({
            label: 'Pre-Owned Cars',
            sublabel: 'Certified Used Vehicles',
            href: siteHrefForSlug(`${slug}-used`),
            color: 'amber',
            emoji: '🛡️',
        })
    } else {
        // Multi-brand new-car only: one card per brand
        brands.forEach(brand => {
            const brandSlug = brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            const city = outletCityMap.get(brand)
            siteCards.push({
                label: brand,
                sublabel: city ? `${city} · Authorised Dealer` : 'New Cars · Authorised Dealer',
                href: siteHrefForSlug(`${slug}-${brandSlug}`),
                color: 'blue',
                emoji: '✨',
            })
        })
    }

    if (sellsTwoWheelers) {
        siteCards.push({
            label: '2-Wheelers',
            sublabel: 'Bikes · Scooters · Electric',
            href: vehicleHubHref('two-wheelers'),
            color: 'green',
            emoji: '🏍️',
        })
    }
    if (sellsThreeWheelers) {
        siteCards.push({
            label: '3-Wheelers',
            sublabel: 'Passenger · Cargo · Electric',
            href: vehicleHubHref('three-wheelers'),
            color: 'purple',
            emoji: '🛺',
        })
    }

    const colorMap: Record<string, { border: string; bg: string; text: string; btn: string }> = {
        blue:   { border: 'border-blue-200',   bg: 'bg-blue-50',   text: 'text-blue-600',   btn: 'bg-blue-500 hover:bg-blue-600'   },
        amber:  { border: 'border-amber-200',  bg: 'bg-amber-50',  text: 'text-amber-600',  btn: 'bg-amber-500 hover:bg-amber-600'  },
        green:  { border: 'border-green-200',  bg: 'bg-green-50',  text: 'text-green-600',  btn: 'bg-green-500 hover:bg-green-600'  },
        purple: { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-600', btn: 'bg-purple-500 hover:bg-purple-600' },
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">

                {/* ── Hero section ── */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-semibold mb-4 uppercase tracking-wide">
                        Authorised Dealership
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        {dealerName}
                    </h1>
                    <p className="text-gray-500 text-base mb-4">{location}</p>
                    <p className="text-lg text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
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
                                        <p className="text-gray-900 font-bold text-base">{card.label}</p>
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
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-gray-600 text-sm mb-4 font-medium">Need help choosing? Talk to our sales team</p>
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
                            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {email}
                        </a>
                    </div>
                </div>

                <p className="text-center mt-8 text-xs text-gray-400">
                    Powered by <span className="text-blue-600 font-semibold">DealerSite Pro</span>
                </p>
            </div>
        </div>
    )
}

// ── No Stock page — for used-only dealers with no inventory yet ───────────────
function NoStockPage({ dealerName, phone, email }: { dealerName: string; phone: string; email: string }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center px-6 max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                    <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{dealerName}</h1>
                <p className="text-amber-600 font-semibold mb-3">Inventory Coming Soon</p>
                <p className="text-gray-600 text-sm mb-6">
                    Our inventory is being updated. Contact us directly for available vehicles.
                </p>
                <div className="space-y-2">
                    <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                        📞 {phone}
                    </a>
                    <a href={`mailto:${email}`} className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                        ✉️ {email}
                    </a>
                </div>
                <div className="mt-10 text-xs text-gray-400">
                    Powered by <span className="text-blue-600 font-semibold">DealerSite Pro</span>
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

    const title = `${dealer.dealership_name} | ${dealer.location}`
    const description = dealer.tagline
        ?? `${dealer.dealership_name} — your trusted car dealership in ${dealer.location}. Browse our inventory of ${dealer.brands.join(', ')} vehicles.`

    const brandKeywords = dealer.brands.join(', ')
    const serviceKeywords = (dealer.services ?? [])
        .map(s => s.replace(/_/g, ' '))
        .join(', ')

    const faviconUrl = resolveDealerLogoImage({
        uploadedLogo: dealer.logo_url,
        fallbackLogo: '/dealersite-pro-shield.png',
    }) ?? '/dealersite-pro-shield.png'

    return {
        title,
        description,
        keywords: `${dealer.dealership_name}, car dealership, ${brandKeywords}, ${dealer.location}, ${serviceKeywords}`,
        icons: {
            icon: faviconUrl,
            shortcut: faviconUrl,
            apple: faviconUrl,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            siteName: dealer.dealership_name,
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: dealerSiteHref(dealer.slug),
        },
    }
}

// ── 2W / 3W discovery banner — appended below any car template ───────────────
function VehicleSegmentsBanner({ sellsTwoWheelers, sellsThreeWheelers, twoWheelerHref, threeWheelerHref }: {
    sellsTwoWheelers: boolean; sellsThreeWheelers: boolean; twoWheelerHref: string; threeWheelerHref: string
}) {
    if (!sellsTwoWheelers && !sellsThreeWheelers) return null
    return (
        <div className="bg-gray-50 border-t border-gray-200 py-10 px-4">
            <div className="max-w-4xl mx-auto text-center mb-6">
                <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold">Also Available At Our Dealership</p>
            </div>
            <div className={`max-w-2xl mx-auto grid gap-4 ${sellsTwoWheelers && sellsThreeWheelers ? 'sm:grid-cols-2' : 'grid-cols-1 max-w-sm'}`}>
                {sellsTwoWheelers && (
                    <a href={twoWheelerHref} className="group flex items-center gap-4 p-5 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition-all">
                        <span className="text-4xl">🏍️</span>
                        <div className="text-left">
                            <p className="text-gray-900 font-bold">2-Wheelers</p>
                            <p className="text-green-600 text-xs mt-0.5">Bikes · Scooters · Electric</p>
                            <p className="text-green-600 text-xs group-hover:underline mt-1">Browse →</p>
                        </div>
                    </a>
                )}
                {sellsThreeWheelers && (
                    <a href={threeWheelerHref} className="group flex items-center gap-4 p-5 rounded-2xl border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-all">
                        <span className="text-4xl">🛺</span>
                        <div className="text-left">
                            <p className="text-gray-900 font-bold">3-Wheelers</p>
                            <p className="text-purple-600 text-xs mt-0.5">Passenger · Cargo · Electric</p>
                            <p className="text-purple-600 text-xs group-hover:underline mt-1">Browse →</p>
                        </div>
                    </a>
                )}
            </div>
        </div>
    )
}

// ── JSON-LD schema helpers ─────────────────────────────────────────────────────
function buildAutoDealerSchema(dealer: NonNullable<Awaited<ReturnType<typeof fetchDealerBySlug>>>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        name: dealer.dealership_name,
        description: dealer.tagline ?? `${dealer.dealership_name} — trusted car dealership in ${dealer.location}`,
        url: dealerSiteHref(dealer.slug),
        telephone: dealer.phone,
        email: dealer.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: dealer.full_address ?? dealer.location,
            addressLocality: dealer.location,
            addressCountry: 'IN',
        },
        brand: dealer.brands.map(b => ({ '@type': 'Brand', name: b })),
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${dealer.dealership_name} Vehicle Inventory`,
        },
    }
}

function buildCarListingSchema(cars: import('@/lib/types/car').Car[], dealerName: string, dealerSlug: string) {
    if (cars.length === 0) return null
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${dealerName} — Available Vehicles`,
        itemListElement: cars.slice(0, 20).map((car, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
                '@type': 'Car',
                name: `${car.make} ${car.model}${car.variant ? ' ' + car.variant : ''}`,
                brand: { '@type': 'Brand', name: car.make },
                model: car.model,
                modelDate: car.year?.toString(),
                fuelType: car.engine?.type,
                vehicleTransmission: car.transmission?.type,
                numberOfForwardGears: car.transmission?.gears,
                url: dealerSiteHref(dealerSlug),
                offers: car.pricing?.exShowroom?.min ? {
                    '@type': 'Offer',
                    priceCurrency: 'INR',
                    price: Math.round(car.pricing.exShowroom.min),
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'AutoDealer', name: dealerName },
                } : undefined,
            },
        })),
    }
}

export default async function SitePage({ params }: SitePageProps) {
    const { slug } = await params

    if (!slug) return <ComingSoon slug="this-site" />

    // ── Fetch real dealer data ────────────────────────────────────────────────
    const dealer = await fetchDealerBySlug(slug, { includePrivate: true })
    if (!dealer) return <ComingSoon slug={slug} />

    // ── Pure 2W/3W dealers → redirect to their vehicle hub ───────────────────
    // Keep direct main-domain access under /sites/{slug}; custom/subdomain
    // hosts stay root-relative because middleware maps them back to /sites/{slug}.
    const requestHeaders = await headers()
    const host = requestHeaders.get('host') ?? ''
    const baseDomain = BASE_DOMAIN
    const siteHrefForSlug = (siteSlug: string) => publicDealerSitePath({
        siteSlug,
        host,
        baseDomain,
    })
    const vehicleHubHref = (segment: VehicleHubSegment) => publicVehicleHubPath({
        dealerSlug: dealer.slug,
        segment,
        host,
        baseDomain,
    })

    if (dealer.vehicle_type === 'two-wheeler') {
        redirect(vehicleHubHref('two-wheelers'))
    }
    if (dealer.vehicle_type === 'three-wheeler') {
        redirect(vehicleHubHref('three-wheelers'))
    }

    const { sells_new_cars, sells_used_cars, sells_two_wheelers, sells_three_wheelers, brandFilter, brands, vehicles, usedCarSite, cyepro_api_key, logo_url, hero_image_url } = dealer

    const isHybridDealer = sells_new_cars && sells_used_cars
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
                sellsTwoWheelers={sells_two_wheelers}
                sellsThreeWheelers={sells_three_wheelers}
                siteHrefForSlug={siteHrefForSlug}
                vehicleHubHref={vehicleHubHref}
                outlets={dealer.outlets}
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
    let templateSellsNew = sells_new_cars
    let templateSellsUsed = sells_used_cars

    if (brandFilter || (sells_new_cars && !sells_used_cars)) {
        // NEW-CAR site — brand-specific URL OR new-only dealer
        const uniqueBrands = dedupeCaseInsensitiveStrings(brands)
        const catalog = brandFilter
            ? await getCarsByMake(brandFilter)
            : (await Promise.all(uniqueBrands.map(b => getCarsByMake(b)))).flat()
        // No sample/placeholder fallback — an empty catalog means this dealer
        // genuinely has no listings, which we surface via NoStockPage below.
        cars = dedupeByMakeModel(catalog.map(c => ({ ...c, condition: 'new' as const })))
        templateSellsNew = true
        templateSellsUsed = false

    } else {
        // USED-CAR site — used-only dealer OR hybrid "-used" sub-site
        const cyeproCars = cyepro_api_key
            ? await fetchAllCyeproInventoryAsCars(cyepro_api_key, {}, undefined, '4w')
            : []

        cars = dedupeInventoryCars([
            ...dbVehiclesToCars(vehicles),
            ...cyeproCars,
        ])
        cars = applyUsedVehiclePriceOffersToCars(
            cars,
            await fetchActiveUsedVehiclePriceOffers(dealer.id)
        )
        templateSellsNew = false
        templateSellsUsed = true
    }

    // ── Brand name & logo ─────────────────────────────────────────────────────
    // Dealer's uploaded logo always takes priority.
    // Fallback: brand logo from /data/brand-logos/<brand-id>.png
    const isUsedSite = templateSellsUsed && !templateSellsNew
    const brandName = isUsedSite ? (brands[0] ?? dealer.dealership_name) : (brandFilter ?? brands[0] ?? dealer.dealership_name)
    const logoUrl = resolveDealerLogoImage({
        uploadedLogo: logo_url,
        fallbackLogo: brandLogoUrl(brandName, '4w'),
        preferFallbackLogo: true,
    })
    const inventoryHeroImage = firstVehicleHeroImage(cars)
    const heroImageUrl = resolveDealerHeroImage({
        uploadedHeroImage: hero_image_url,
        inventoryHeroImage,
    })

    const contactInfo = {
        phone: dealer.phone,
        email: dealer.email,
        city: dealer.location,
        address: dealer.full_address ?? dealer.location,
    }
    const sellVehicleHref = isUsedSite
        ? isMainDealerHost(host, baseDomain)
            ? `${siteHrefForSlug(slug).replace(/\/$/, '')}/sell`
            : '/sell'
        : undefined

    // ── Genuine empty inventory ───────────────────────────────────────────────
    // No catalog/listings for this dealer → show an honest "coming soon" state
    // with their contact CTA, instead of seeding sample cars they don't sell.
    if (cars.length === 0) {
        return (
            <NoStockPage
                dealerName={dealer.dealership_name}
                phone={dealer.phone}
                email={dealer.email}
            />
        )
    }

    // ── Hero text ─────────────────────────────────────────────────────────────
    const heroDefaults: Record<string, { title: string; subtitle: string }> = {
        luxury: { title: 'THE ART OF PERFORMANCE', subtitle: 'Experience automotive excellence with our curated collection' },
        sporty: { title: 'UNLEASH THE BEAST', subtitle: 'Where raw power meets cutting-edge performance' },
        family: { title: "Your Family's Perfect Car Awaits", subtitle: 'Safe, reliable, and affordable vehicles for every family' },
        professional: { title: 'Drive Your Dreams', subtitle: 'Discover your perfect vehicle from our premium collection' },
        modern: { title: 'Drive Your Dreams', subtitle: 'Discover your perfect vehicle from our premium collection' },
    }
    const defaults = heroDefaults[dealer.style_template] ?? heroDefaults.modern
    const heroTitle = dealer.hero_title || defaults.title
    const heroSubtitle = dealer.hero_subtitle || defaults.subtitle

    const taglines: Record<string, string> = {
        luxury: 'Excellence in Motion', sporty: 'Built for Speed',
        family: 'Trusted by Families', professional: 'Your Trusted Dealer',
    }

    const sharedProps = {
        brandName,
        dealerName: dealer.dealership_name,
        dealerId: dealer.id,
        cars,
        contactInfo,
        branches: dealer.branches ?? undefined,
        serviceCenters: dealer.service_centers ?? undefined,
        outlets: dealer.outlets,
        services: (dealer.services ?? []) as Service[],
        workingHours: dealer.working_hours ?? null,
        logoUrl,
        heroImageUrl,
        sellsNewCars: templateSellsNew,
        sellsUsedCars: templateSellsUsed,
        socialLinks: dealer.social,
        isVerified: false,
        sellVehicleHref,
    }

    // ── JSON-LD structured data ───────────────────────────────────────────────
    const autoDealerSchema = buildAutoDealerSchema(dealer)
    const carListingSchema = buildCarListingSchema(cars, dealer.dealership_name, dealer.slug)

    const jsonLdScripts = (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerSchema) }}
            />
            {carListingSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(carListingSchema) }}
                />
            )}
        </>
    )

    const segmentsBanner = (
        <VehicleSegmentsBanner
            sellsTwoWheelers={sells_two_wheelers}
            sellsThreeWheelers={sells_three_wheelers}
            twoWheelerHref={vehicleHubHref('two-wheelers')}
            threeWheelerHref={vehicleHubHref('three-wheelers')}
        />
    )
    const customerPanelLink = (
        <section className="border-t border-slate-200 bg-slate-50 px-4 py-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Customer Panel</h2>
                    <p className="mt-1 text-sm text-slate-600">View your test drives, sell requests, showroom details, arrivals, and current offers.</p>
                </div>
                <a
                    href={`${siteHrefForSlug(slug).replace(/\/$/, '')}/user`}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                    Open My Panel
                </a>
            </div>
        </section>
    )
    const pushPreferenceCenter = <PushPreferenceCenter dealerId={dealer.id} />

    // ── Render the chosen template ────────────────────────────────────────────
    switch (dealer.style_template) {
        case 'luxury':
            return <>{jsonLdScripts}<LuxuryTemplate  {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.luxury }} />{customerPanelLink}{pushPreferenceCenter}{segmentsBanner}</>
        case 'sporty':
            return <>{jsonLdScripts}<SportyTemplate  {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.sporty }} />{customerPanelLink}{pushPreferenceCenter}{segmentsBanner}</>
        case 'family':
            return <>{jsonLdScripts}<FamilyTemplate  {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.family }} />{customerPanelLink}{pushPreferenceCenter}{segmentsBanner}</>
        case 'modern':
        case 'professional':
        default:
            return <>{jsonLdScripts}<ModernTemplate  {...sharedProps} config={{ heroTitle, heroSubtitle }} />{customerPanelLink}{pushPreferenceCenter}{segmentsBanner}</>
    }
}
