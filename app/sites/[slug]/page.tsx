import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import { allCars, getCarsByMake } from '@/lib/data/cars'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import type { Car } from '@/lib/types/car'
import type { DBVehicle } from '@/lib/db/vehicles'

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

export default async function SitePage({ params }: SitePageProps) {
    const { slug } = await params

    if (!slug) return <ComingSoon slug="this-site" />

    // ── Fetch real dealer data ────────────────────────────────────────────────
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return <ComingSoon slug={slug} />

    const { sells_new_cars, sells_used_cars, brandFilter, brands, vehicles } = dealer

    // ── Smart car selection ───────────────────────────────────────────────────
    //
    // PATH A — Used-only dealer
    //   → Show ONLY their manually-added DB stock
    //   → If nothing added yet → NoStockPage
    //
    // PATH B — New-car-only dealer
    //   → brandFilter set (brand-specific URL): show that brand's scraped catalog
    //   → brandFilter null (main URL, multi-brand): combine all brand catalogs
    //
    // PATH C — Hybrid dealer (sells both new + used)
    //   → If they have DB vehicles → show those (their unique used/mixed stock)
    //   → Otherwise fall back to brand catalog
    //
    let cars: Car[]

    if (sells_used_cars && !sells_new_cars) {
        // PATH A — Used only
        if (vehicles.length === 0) {
            return (
                <NoStockPage
                    dealerName={dealer.dealership_name}
                    phone={dealer.phone}
                    email={dealer.email}
                />
            )
        }
        cars = dbVehiclesToCars(vehicles)

    } else if (sells_new_cars && !sells_used_cars) {
        // PATH B — New cars only
        if (brandFilter) {
            // Brand-specific URL (e.g. abhi-motors-tata.dealersitepro.com)
            const filtered = getCarsByMake(brandFilter)
            cars = filtered.length > 0 ? filtered : allCars.slice(0, 16)
        } else {
            // Main site — show all their brands combined
            const combined = brands.flatMap(b => getCarsByMake(b))
            cars = combined.length > 0 ? combined : allCars.slice(0, 16)
        }

    } else {
        // PATH C — Hybrid (new + used) OR fallback
        if (vehicles.length > 0) {
            cars = dbVehiclesToCars(vehicles)
        } else {
            const targetBrand = brandFilter ?? brands[0] ?? ''
            const catalogCars = targetBrand ? getCarsByMake(targetBrand) : []
            cars = catalogCars.length > 0 ? catalogCars : allCars.slice(0, 16)
        }
    }

    // ── Brand name for template colour theming ────────────────────────────────
    const brandName = brandFilter ?? brands[0] ?? dealer.dealership_name

    const contactInfo = {
        phone:   dealer.phone,
        email:   dealer.email,
        address: dealer.full_address ?? dealer.location,
    }

    // ── Hero text ─────────────────────────────────────────────────────────────
    const heroDefaults: Record<string, { title: string; subtitle: string }> = {
        luxury:       { title: 'THE ART OF PERFORMANCE',         subtitle: 'Experience automotive excellence with our curated collection' },
        sporty:       { title: 'UNLEASH THE BEAST',              subtitle: 'Where raw power meets cutting-edge performance'                },
        family:       { title: "Your Family's Perfect Car Awaits", subtitle: 'Safe, reliable, and affordable vehicles for every family'    },
        professional: { title: 'Drive Your Dreams',              subtitle: 'Discover your perfect vehicle from our premium collection'     },
        modern:       { title: 'Drive Your Dreams',              subtitle: 'Discover your perfect vehicle from our premium collection'     },
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
        dealerName: dealer.dealership_name,
        cars,
        contactInfo,
    }

    // ── Render the chosen template ────────────────────────────────────────────
    switch (dealer.style_template) {
        case 'luxury':
            return <LuxuryTemplate {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.luxury }} />
        case 'sporty':
            return <SportyTemplate {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.sporty }} />
        case 'family':
            return <FamilyTemplate {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.family }} />
        case 'modern':
        case 'professional':
        default:
            return <ModernTemplate {...sharedProps} config={{ heroTitle, heroSubtitle }} />
    }
}
