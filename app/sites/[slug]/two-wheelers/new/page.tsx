import type { Metadata } from 'next'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getTwoWheelerVehicles } from '@/lib/db/two-wheelers'
import { getTwoWheelerCatalog, TWO_WHEELER_BRANDS } from '@/lib/data/two-wheelers'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { brandNameToId } from '@/lib/utils/brand-model-images'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import type { Car } from '@/lib/types/car'
import type { TwoWheelerVehicle } from '@/lib/types/two-wheeler'
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return { title: 'New Bikes & Scooters | DealerSite Pro' }

    const title = `New Bikes & Scooters — ${dealer.dealership_name} | ${dealer.location}`
    const description = `Browse brand new bikes and scooters at ${dealer.dealership_name} in ${dealer.location}. Latest models, best prices.`

    return {
        title,
        description,
        openGraph: { title, description, type: 'website', siteName: dealer.dealership_name, locale: 'en_IN' },
        robots: { index: true, follow: true },
    }
}

export default async function NewTwoWheelersPage({ params }: Props) {
    const { slug } = await params

    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const { vehicles: dbVehicles } = await getTwoWheelerVehicles(dealer.id, { pageSize: 100, sortBy: 'newest' })

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

    const allBrands = dealer2wBrands.length > 0
        ? dealer2wBrands
        : POPULAR_2W_BRANDS.filter(b => TWO_WHEELER_BRANDS.includes(b))

    // If accessed via a brand-specific slug (e.g. varun-group-royal-enfield),
    // restrict to that brand only; otherwise show all dealer brands.
    const brandsToShow = dealer.brandFilter
        ? allBrands.filter(b => b.toLowerCase() === dealer.brandFilter!.toLowerCase())
            .concat(
                // fallback: if brandFilter doesn't match any stored brand exactly, use it directly
                allBrands.filter(b => b.toLowerCase() === dealer.brandFilter!.toLowerCase()).length === 0
                    ? [dealer.brandFilter]
                    : []
            )
        : allBrands

    const primaryBrand = brandsToShow[0] ?? null

    const catalogVehicles = brandsToShow.flatMap((brand, bi) =>
        getTwoWheelerCatalog(brand, dealer.id).map(v => ({ ...v, id: `cat-2w-${bi}-${v.id}` }))
    )

    const filteredDbVehicles = dealer.brandFilter
        ? dbVehicles.filter(v => v.brand.toLowerCase() === dealer.brandFilter!.toLowerCase())
        : dbVehicles

    const dbKeys = new Set(filteredDbVehicles.map(v => `${v.brand}__${v.model}`))
    const catalogExtra = catalogVehicles.filter(v => !dbKeys.has(`${v.brand}__${v.model}`))
    const vehicles = [...filteredDbVehicles, ...catalogExtra]

    const cars = twoWheelersToCars(vehicles)

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
        sellsNewCars:  true,
        sellsUsedCars: false,
        isVerified:    false,
        vehicleType:   '2w' as const,
    }

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        name: dealer.dealership_name,
        description: `${dealer.dealership_name} — new two-wheeler dealer in ${dealer.location}`,
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
