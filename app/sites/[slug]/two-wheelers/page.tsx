import type { Metadata } from 'next'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getTwoWheelerVehicles, getUsedTwoWheelers } from '@/lib/db/two-wheelers'
import { getTwoWheelerCatalog, TWO_WHEELER_BRANDS } from '@/lib/data/two-wheelers'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { brandNameToId } from '@/lib/utils/brand-model-images'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import type { Car } from '@/lib/types/car'
import type { TwoWheelerVehicle, TwoWheelerUsedVehicle } from '@/lib/types/two-wheeler'
import type { Service } from '@/lib/types'

interface Props {
    params: Promise<{ slug: string }>
}

const POPULAR_2W_BRANDS = [
    'Hero MotoCorp',
    'Honda Motorcycle & Scooter India',
    'TVS Motor Company',
    'Bajaj Auto',
    'Royal Enfield',
    'Yamaha India',
    'Suzuki Motorcycle India',
    'KTM India',
    'Ather Energy',
    'Ola Electric',
]

// ── Converters ────────────────────────────────────────────────────────────────
function twoWheelersToCars(vehicles: TwoWheelerVehicle[]): Car[] {
    return vehicles.map(v => ({
        id: v.id,
        make: v.brand,
        model: v.model,
        variant: v.variant ?? '',
        year: v.year,
        bodyType: v.type === 'scooter' ? 'Scooter' : v.type === 'electric' ? 'Electric' : 'Bike',
        segment: 'B' as Car['segment'],
        pricing: {
            exShowroom: {
                min: v.ex_showroom_price_paise > 0 ? Math.round(v.ex_showroom_price_paise / 100) : null,
                max: v.ex_showroom_price_paise > 0 ? Math.round(v.ex_showroom_price_paise / 100) : null,
                currency: 'INR' as const,
            },
        },
        engine: {
            type: v.fuel_type === 'electric' ? 'Electric' : 'Petrol',
            displacement: v.engine_cc,
            batteryCapacity: v.battery_kwh,
            power: '—',
            torque: '—',
        },
        transmission: { type: 'Manual' },
        performance: {
            fuelEfficiency: v.mileage_kmpl ?? undefined,
            topSpeed: v.top_speed_kmph ?? undefined,
            range: v.range_km ?? undefined,
        },
        dimensions: { seatingCapacity: 2 },
        vehicleCategory: '2w' as const,
        features: { keyFeatures: v.features ?? [] },
        images: {
            hero: v.images?.[0] ?? '',
            exterior: v.images ?? [],
            interior: [],
        },
        meta: { viewCount: v.views ?? 0 },
        price: v.ex_showroom_price_paise > 0
            ? `₹${(v.ex_showroom_price_paise / 100).toLocaleString('en-IN')}`
            : 'Price on request',
        condition: 'new' as const,
    }))
}

function usedTwoWheelersToCars(vehicles: TwoWheelerUsedVehicle[]): Car[] {
    return vehicles.map(v => ({
        id: v.id,
        make: v.brand,
        model: v.model,
        variant: `${v.km_driven.toLocaleString('en-IN')} km · ${v.no_of_owners} owner${v.no_of_owners > 1 ? 's' : ''}`,
        year: v.year,
        bodyType: v.type === 'scooter' ? 'Scooter' : v.type === 'electric' ? 'Electric' : 'Bike',
        segment: 'B' as Car['segment'],
        pricing: {
            exShowroom: {
                min: Math.round(v.price_paise / 100),
                max: Math.round(v.price_paise / 100),
                currency: 'INR' as const,
            },
        },
        engine: {
            type: v.fuel_type === 'electric' ? 'Electric' : 'Petrol',
            displacement: null,
            power: '—',
            torque: '—',
        },
        transmission: { type: 'Manual' },
        performance: {},
        dimensions: { seatingCapacity: 2 },
        features: { keyFeatures: [] },
        images: {
            hero: v.images?.[0] ?? '',
            exterior: v.images ?? [],
            interior: [],
        },
        meta: { viewCount: 0 },
        price: `₹${(v.price_paise / 100).toLocaleString('en-IN')}`,
        condition: v.certified_pre_owned ? 'certified_pre_owned' as const : 'used' as const,
        vehicleCategory: '2w' as const,
    }))
}

// ── No Stock page ─────────────────────────────────────────────────────────────
function NoStockPage({ dealerName, phone, email }: { dealerName: string; phone: string; email: string }) {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center px-6 max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                    <span className="text-4xl">🏍️</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{dealerName}</h1>
                <p className="text-green-400 font-semibold mb-3">Stock Update Coming Soon</p>
                <p className="text-gray-400 text-sm mb-6">
                    Our two-wheeler inventory is being updated. Contact us directly for available bikes and scooters.
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

// ── Hybrid Portal — shown when dealer sells both new + used 2W ────────────────
function TwoWheelerPortal({
    dealerName, location, phone, email, slug, primaryBrand,
}: {
    dealerName: string; location: string; phone: string; email: string;
    slug: string; primaryBrand: string | null;
}) {
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-4 uppercase tracking-wide">
                        Two-Wheeler Dealership
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        {dealerName}
                    </h1>
                    <p className="text-gray-400 text-base mb-4">{location}</p>
                    <p className="text-lg text-gray-300 font-medium max-w-md mx-auto leading-relaxed">
                        {primaryBrand ? `Authorised ${primaryBrand} Dealer` : `Your Trusted Two-Wheeler Partner in ${location}`}
                    </p>
                </div>

                <div className="grid gap-4 mb-10 sm:grid-cols-2">
                    <a
                        href="/two-wheelers/new"
                        className="group flex flex-col gap-4 p-6 rounded-2xl border-2 border-green-500/30 bg-green-500/5 hover:scale-[1.02] transition-all duration-200"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">✨</span>
                            <div>
                                <p className="text-white font-bold text-base">New Bikes & Scooters</p>
                                <p className="text-green-400 text-xs mt-0.5">Latest models · Factory fresh</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-green-400 group-hover:underline">
                            Explore New Two-Wheelers →
                        </span>
                    </a>
                    <a
                        href="/two-wheelers/used"
                        className="group flex flex-col gap-4 p-6 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 hover:scale-[1.02] transition-all duration-200"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🛡️</span>
                            <div>
                                <p className="text-white font-bold text-base">Pre-Owned Bikes & Scooters</p>
                                <p className="text-amber-400 text-xs mt-0.5">Certified used · Best prices</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-amber-400 group-hover:underline">
                            Explore Used Two-Wheelers →
                        </span>
                    </a>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-gray-400 text-sm mb-4 font-medium">Need help choosing? Talk to our team</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href={`tel:${phone}`}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call — {phone}
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

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return { title: 'Two-Wheelers | DealerSite Pro' }

    const title = `${dealer.dealership_name} — Bikes & Scooters | ${dealer.location}`
    const description = `${dealer.dealership_name} — your trusted two-wheeler dealer in ${dealer.location}. Browse bikes, scooters, and electric two-wheelers.`

    return {
        title,
        description,
        openGraph: { title, description, type: 'website', siteName: dealer.dealership_name, locale: 'en_IN' },
        robots: { index: true, follow: true },
        alternates: { canonical: `https://${dealer.slug}.dealersitepro.com/two-wheelers` },
    }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function TwoWheelersPage({ params }: Props) {
    const { slug } = await params

    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    // Fetch new + used inventory in parallel
    const [{ vehicles: dbVehicles }, { vehicles: usedVehicles }] = await Promise.all([
        getTwoWheelerVehicles(dealer.id, { pageSize: 100, sortBy: 'newest' }),
        getUsedTwoWheelers(dealer.id, { pageSize: 100, sortBy: 'newest' }),
    ])

    // Fetch 2W brands scoped by vehicle_type
    let dealer2wBrands: string[] = []
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data } = await supabase
            .from('dealer_brands')
            .select('brand_name')
            .eq('dealer_id', dealer.id)
            .eq('vehicle_type', '2w')
            .order('is_primary', { ascending: false })
        dealer2wBrands = data?.map((r: { brand_name: string }) => r.brand_name) ?? []
    } catch {
        dealer2wBrands = dealer.brands.filter(b => TWO_WHEELER_BRANDS.includes(b))
    }

    const brandsToShow = dealer2wBrands.length > 0
        ? dealer2wBrands
        : POPULAR_2W_BRANDS.filter(b => TWO_WHEELER_BRANDS.includes(b))

    const primaryBrand = dealer2wBrands[0] ?? brandsToShow[0] ?? null

    const catalogVehicles = brandsToShow.flatMap((brand, bi) =>
        getTwoWheelerCatalog(brand, dealer.id).map(v => ({ ...v, id: `cat-2w-${bi}-${v.id}` }))
    )

    const dbKeys = new Set(dbVehicles.map(v => `${v.brand}__${v.model}`))
    const catalogExtra = catalogVehicles.filter(v => !dbKeys.has(`${v.brand}__${v.model}`))
    const vehicles = [...dbVehicles, ...catalogExtra]

    const newCars  = twoWheelersToCars(vehicles)
    const usedCars = usedTwoWheelersToCars(usedVehicles)

    const isUsedSite = dealer.usedCarSite === true
    const hasNew  = !isUsedSite && newCars.length > 0
    const hasUsed = usedCars.length > 0
    const isHybrid = hasNew && hasUsed

    // ── Hybrid dealers → show portal so user picks new vs used ────────────────
    if (isHybrid) {
        return (
            <TwoWheelerPortal
                dealerName={dealer.dealership_name}
                location={dealer.location}
                phone={dealer.phone}
                email={dealer.email ?? ''}
                slug={dealer.slug}
                primaryBrand={primaryBrand}
            />
        )
    }

    const cars = isUsedSite ? usedCars : hasNew ? newCars : usedCars

    // ── No inventory yet ──────────────────────────────────────────────────────
    if (cars.length === 0) {
        return (
            <NoStockPage
                dealerName={dealer.dealership_name}
                phone={dealer.phone}
                email={dealer.email ?? ''}
            />
        )
    }

    const brandId = primaryBrand ? brandNameToId(primaryBrand, '2w') : null
    const brandLogoUrl = dealer.logo_url ?? (brandId ? `/data/brand-logos/${brandId}.png` : undefined)

    const contactInfo = {
        phone: dealer.phone,
        email: dealer.email ?? '',
        address: dealer.full_address ?? dealer.location,
    }

    const heroDefaults: Record<string, { title: string; subtitle: string }> = {
        luxury:  { title: 'THE RIDE OF YOUR LIFE',            subtitle: 'Experience premium two-wheelers from top brands' },
        sporty:  { title: 'RIDE LIKE A LEGEND',               subtitle: 'Where performance meets passion on two wheels' },
        family:  { title: 'Your Perfect Two-Wheeler Awaits',   subtitle: 'Safe, reliable bikes and scooters for every rider' },
        modern:  { title: 'Discover Your Ride',               subtitle: 'Explore our bikes, scooters, and electric two-wheelers' },
    }
    const defaults = heroDefaults[dealer.style_template] ?? heroDefaults.modern
    const heroTitle    = dealer.hero_title    || defaults.title
    const heroSubtitle = dealer.hero_subtitle || defaults.subtitle

    const taglines: Record<string, string> = {
        luxury: 'Excellence in Motion',
        sporty: 'Built for Speed',
        family: 'Trusted by Families',
    }

    const sharedProps = {
        brandName:    primaryBrand ?? dealer.dealership_name,
        dealerName:   dealer.dealership_name,
        dealerId:     dealer.id,
        cars,
        contactInfo,
        branches:     dealer.branches ?? undefined,
        services:     (dealer.services ?? []) as Service[],
        workingHours: dealer.working_hours ?? null,
        logoUrl:      brandLogoUrl ?? undefined,
        heroImageUrl: undefined,
        sellsNewCars:  hasNew,
        sellsUsedCars: hasUsed,
        isVerified:    false,
        vehicleType:   '2w' as const,
    }

    // ── JSON-LD structured data ───────────────────────────────────────────────
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        name: dealer.dealership_name,
        description: `${dealer.dealership_name} — trusted two-wheeler dealer in ${dealer.location}`,
        telephone: dealer.phone,
        email: dealer.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: dealer.full_address ?? dealer.location,
            addressLocality: dealer.location,
            addressCountry: 'IN',
        },
    }
    const jsonLd = (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    )

    switch (dealer.style_template) {
        case 'luxury':
            return <>{jsonLd}<LuxuryTemplate {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.luxury }} /></>
        case 'sporty':
            return <>{jsonLd}<SportyTemplate {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.sporty }} /></>
        case 'family':
            return <>{jsonLd}<FamilyTemplate {...sharedProps} config={{ heroTitle, heroSubtitle, tagline: taglines.family }} /></>
        case 'modern':
        case 'professional':
        default:
            return <>{jsonLd}<ModernTemplate {...sharedProps} config={{ heroTitle, heroSubtitle }} /></>
    }
}
