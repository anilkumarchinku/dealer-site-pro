import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getUsedThreeWheelers } from '@/lib/db/three-wheelers'
import { THREE_WHEELER_BRANDS } from '@/lib/data/three-wheelers'
import { notFound } from 'next/navigation'
import { brandNameToId } from '@/lib/utils/brand-model-images'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import type { Car } from '@/lib/types/car'
import type { ThreeWheelerUsedVehicle } from '@/lib/types/three-wheeler'
import type { Service } from '@/lib/types'

interface Props {
    params: Promise<{ slug: string }>
}

function usedThreeWheelersToCars(vehicles: ThreeWheelerUsedVehicle[]): Car[] {
    return vehicles.map(v => ({
        id: v.id,
        make: v.brand,
        model: v.model,
        variant: `${v.km_driven.toLocaleString('en-IN')} km · ${v.no_of_owners} owner${v.no_of_owners > 1 ? 's' : ''}`,
        year: v.year,
        bodyType: v.body_type ?? 'Auto',
        segment: 'B' as Car['segment'],
        pricing: {
            exShowroom: {
                min: Math.round(v.price_paise / 100),
                max: Math.round(v.price_paise / 100),
                currency: 'INR' as const,
            },
        },
        engine: {
            type: v.fuel_type === 'electric' ? 'Electric' : v.fuel_type === 'cng' ? 'CNG' : 'Petrol',
            power: '—',
            torque: '—',
        },
        transmission: { type: 'Manual' },
        performance: {},
        dimensions: {
            seatingCapacity: v.passenger_capacity ?? null,
            bootSpace: v.payload_kg ?? undefined,
        },
        features: { keyFeatures: [] },
        images: {
            hero: v.images?.[0] ?? '/placeholder-car.jpg',
            exterior: v.images ?? [],
            interior: [],
        },
        meta: { viewCount: 0 },
        price: `₹${(v.price_paise / 100).toLocaleString('en-IN')}`,
        condition: v.certified_pre_owned ? 'certified_pre_owned' as const : 'used' as const,
        vehicleCategory: '3w' as const,
    }))
}

export default async function UsedThreeWheelersPage({ params }: Props) {
    const { slug } = await params

    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const { vehicles: usedVehicles } = await getUsedThreeWheelers(dealer.id, { pageSize: 100, sortBy: 'newest' })
    const cars = usedThreeWheelersToCars(usedVehicles)

    // Filter to 3W brands only — dealer.brands contains all vehicle types unfiltered
    const brands3w = dealer.brands.filter(b => THREE_WHEELER_BRANDS.includes(b))
    const primaryBrand = brands3w[0] ?? dealer.brands[0] ?? null
    const brandId = primaryBrand ? brandNameToId(primaryBrand, '3w') : null
    const brandLogoUrl = dealer.logo_url ?? (brandId ? `/data/brand-logos/${brandId}.png` : undefined)

    const contactInfo = {
        phone: dealer.phone,
        email: dealer.email ?? '',
        address: dealer.full_address ?? dealer.location,
    }

    const heroDefaults: Record<string, { title: string; subtitle: string }> = {
        luxury: { title: 'PRE-OWNED THREE-WHEELERS',        subtitle: 'Certified used autos and cargo vehicles — inspected and ready' },
        sporty: { title: 'USED 3W, READY TO WORK',          subtitle: 'Hand-picked pre-owned three-wheelers for every job' },
        family: { title: 'Trusted Used Three-Wheelers',     subtitle: 'Affordable second-hand autos and cargo carriers, all verified' },
        modern: { title: 'Browse Pre-Owned Three-Wheelers', subtitle: 'Explore our certified used passenger and cargo three-wheelers' },
    }
    const defaults = heroDefaults[dealer.style_template] ?? heroDefaults.modern
    const heroTitle    = dealer.hero_title    || defaults.title
    const heroSubtitle = dealer.hero_subtitle || defaults.subtitle

    const taglines: Record<string, string> = {
        luxury: 'Quality You Can Trust',
        sporty: 'Work More, Pay Less',
        family: 'Trusted Pre-Owned',
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
        sellsNewCars:  false,
        sellsUsedCars: true,
        isVerified:    false,
        vehicleType:   '3w' as const,
    }

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
