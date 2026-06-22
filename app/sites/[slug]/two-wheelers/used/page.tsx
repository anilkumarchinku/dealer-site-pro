import type { Metadata } from 'next'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getUsedTwoWheelers } from '@/lib/db/two-wheelers'
import { TWO_WHEELER_BRANDS } from '@/lib/data/two-wheelers'
import { fetchAllCyeproInventoryAsCars } from '@/lib/services/cyepro-service'
import { notFound } from 'next/navigation'
import { brandNameToId } from '@/lib/utils/brand-model-images'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import type { Car } from '@/lib/types/car'
import type { TwoWheelerUsedVehicle } from '@/lib/types/two-wheeler'
import type { Service } from '@/lib/types'
import { firstVehicleHeroImage, resolveDealerHeroImage } from '@/lib/utils/site-assets'
import { dealerSiteHref } from '@/lib/utils/domain'

interface Props {
    params: Promise<{ slug: string }>
}

function usedTwoWheelersToCars(vehicles: TwoWheelerUsedVehicle[]): Car[] {
    return vehicles.map(v => {
        const basePrice = Math.round(v.price_paise / 100)
        const offerPrice = typeof v.offer_price_paise === 'number' && v.offer_price_paise > 0 && v.offer_price_paise < v.price_paise
            ? Math.round(v.offer_price_paise / 100)
            : null

        return {
            id: v.id,
            make: v.brand,
            model: v.model,
            variant: `${v.km_driven.toLocaleString('en-IN')} km · ${v.no_of_owners} owner${v.no_of_owners > 1 ? 's' : ''}`,
            year: v.year,
            bodyType: v.type === 'scooter' ? 'Scooter' : v.type === 'electric' ? 'Electric' : 'Bike',
            segment: 'B' as Car['segment'],
            pricing: {
                exShowroom: {
                    min: basePrice,
                    max: basePrice,
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
            meta: { viewCount: 0, sourceVehicleId: v.id },
            price: `₹${(offerPrice ?? basePrice).toLocaleString('en-IN')}`,
            offer: offerPrice
                ? {
                    price: offerPrice,
                    originalPrice: basePrice,
                    label: v.offer_label ?? 'Offer price',
                    validUntil: v.offer_valid_until ?? undefined,
                }
                : undefined,
            condition: v.certified_pre_owned ? 'certified_pre_owned' as const : 'used' as const,
            vehicleCategory: '2w' as const,
        }
    })
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return { title: 'Used Bikes & Scooters | DealerSite Pro' }

    const title = `Used Bikes & Scooters — ${dealer.dealership_name} | ${dealer.location}`
    const description = `Browse certified pre-owned bikes and scooters at ${dealer.dealership_name} in ${dealer.location}. Best prices, all verified.`

    return {
        title,
        description,
        openGraph: { title, description, type: 'website', siteName: dealer.dealership_name, locale: 'en_IN' },
        robots: { index: true, follow: true },
        alternates: { canonical: dealerSiteHref(`${dealer.slug}/two-wheelers/used`) },
    }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function UsedTwoWheelersPage({ params }: Props) {
    const { slug } = await params

    const dealer = await fetchDealerBySlug(slug, { includePrivate: true })
    if (!dealer) notFound()

    const { vehicles: usedVehicles } = await getUsedTwoWheelers(dealer.id, { pageSize: 100, sortBy: 'newest' })

    // Merge Cyepro used inventory if dealer has API key
    const cyeproCars = dealer.cyepro_api_key
        ? await fetchAllCyeproInventoryAsCars(dealer.cyepro_api_key, {}, undefined, '2w')
        : []

    const cars = [...usedTwoWheelersToCars(usedVehicles), ...cyeproCars]

    const brands2w = dealer.brands.filter(b => TWO_WHEELER_BRANDS.includes(b))
    const primaryBrand = brands2w[0] ?? dealer.brands[0] ?? null
    const brandId = primaryBrand ? brandNameToId(primaryBrand, '2w') : null
    const brandLogoUrl = dealer.logo_url ?? (brandId ? `/data/brand-logos/${brandId}.png` : undefined)
    const heroImageUrl = resolveDealerHeroImage({
        uploadedHeroImage: dealer.hero_image_url,
        inventoryHeroImage: firstVehicleHeroImage(cars),
    })

    const contactInfo = {
        phone: dealer.phone,
        email: dealer.email ?? '',
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
        heroImageUrl,
        sellsNewCars:  false,
        sellsUsedCars: true,
        isVerified:    false,
        vehicleType:   '2w' as const,
    }

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        name: dealer.dealership_name,
        description: `${dealer.dealership_name} — certified pre-owned two-wheelers in ${dealer.location}`,
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
