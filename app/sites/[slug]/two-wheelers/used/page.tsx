import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getUsedTwoWheelers } from '@/lib/db/two-wheelers'
import { TWO_WHEELER_BRANDS } from '@/lib/data/two-wheelers'
import { notFound } from 'next/navigation'
import { brandNameToId } from '@/lib/utils/brand-model-images'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import type { Car } from '@/lib/types/car'
import type { TwoWheelerUsedVehicle } from '@/lib/types/two-wheeler'
import type { Service } from '@/lib/types'

interface Props {
    params: Promise<{ slug: string }>
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
            hero: v.images?.[0] ?? '/placeholder-car.jpg',
            exterior: v.images ?? [],
            interior: [],
        },
        meta: { viewCount: 0 },
        price: `₹${(v.price_paise / 100).toLocaleString('en-IN')}`,
        condition: v.certified_pre_owned ? 'certified_pre_owned' as const : 'used' as const,
        vehicleCategory: '2w' as const,
    }))
}

export default async function UsedTwoWheelersPage({ params }: Props) {
    const { slug } = await params

    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const { vehicles: usedVehicles } = await getUsedTwoWheelers(dealer.id, { pageSize: 100, sortBy: 'newest' })
    const cars = usedTwoWheelersToCars(usedVehicles)

    // Filter to 2W brands only — dealer.brands contains all vehicle types unfiltered
    const brands2w = dealer.brands.filter(b => TWO_WHEELER_BRANDS.includes(b))
    const primaryBrand = brands2w[0] ?? dealer.brands[0] ?? null
    const brandId = primaryBrand ? brandNameToId(primaryBrand, '2w') : null
    const brandLogoUrl = dealer.logo_url ?? (brandId ? `/data/brand-logos/${brandId}.png` : undefined)

    const contactInfo = {
        phone: dealer.phone,
        email: dealer.email,
        address: dealer.full_address ?? dealer.location,
    }

    const heroDefaults: Record<string, { title: string; subtitle: string }> = {
        luxury: { title: 'PRE-OWNED RIDES, PREMIUM QUALITY',    subtitle: 'Certified used two-wheelers — inspected and guaranteed' },
        sporty: { title: 'USED BIKES, PURE PERFORMANCE',        subtitle: 'Hand-picked pre-owned bikes ready to ride' },
        family: { title: 'Quality Used Two-Wheelers',           subtitle: 'Affordable second-hand bikes and scooters, all verified' },
        modern: { title: 'Explore Pre-Owned Two-Wheelers',      subtitle: 'Browse our certified used bikes and scooters' },
    }
    const defaults = heroDefaults[dealer.style_template] ?? heroDefaults.modern
    const heroTitle    = dealer.hero_title    || defaults.title
    const heroSubtitle = dealer.hero_subtitle || defaults.subtitle

    const taglines: Record<string, string> = {
        luxury: 'Quality You Can Trust',
        sporty: 'Ride More, Pay Less',
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
        vehicleType:   '2w' as const,
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
