import type { Metadata } from 'next'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getUsedThreeWheelers } from '@/lib/db/three-wheelers'
import { THREE_WHEELER_BRANDS } from '@/lib/data/three-wheelers'
import { fetchAllCyeproInventoryAsCars } from '@/lib/services/cyepro-service'
import { notFound } from 'next/navigation'
import { brandNameToId } from '@/lib/utils/brand-model-images'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import type { Car } from '@/lib/types/car'
import type { ThreeWheelerUsedVehicle } from '@/lib/types/three-wheeler'
import type { Service } from '@/lib/types'
import { firstVehicleHeroImage, resolveDealerHeroImage } from '@/lib/utils/site-assets'
import { dealerSiteHref } from '@/lib/utils/domain'

interface Props {
    params: Promise<{ slug: string }>
}

function usedThreeWheelersToCars(vehicles: ThreeWheelerUsedVehicle[]): Car[] {
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
            bodyType: v.body_type ?? 'Auto',
            segment: 'B' as Car['segment'],
            pricing: {
                exShowroom: {
                    min: basePrice,
                    max: basePrice,
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
            vehicleCategory: '3w' as const,
        }
    })
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return { title: 'Used Three-Wheelers | DealerSite Pro' }

    const title = `Used Autos & Cargo Vehicles — ${dealer.dealership_name} | ${dealer.location}`
    const description = `Browse certified pre-owned three-wheelers at ${dealer.dealership_name} in ${dealer.location}. Best prices, all verified.`

    return {
        title,
        description,
        openGraph: { title, description, type: 'website', siteName: dealer.dealership_name, locale: 'en_IN' },
        robots: { index: true, follow: true },
        alternates: { canonical: dealerSiteHref(`${dealer.slug}/three-wheelers/used`) },
    }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function UsedThreeWheelersPage({ params }: Props) {
    const { slug } = await params

    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const { vehicles: usedVehicles } = await getUsedThreeWheelers(dealer.id, { pageSize: 100, sortBy: 'newest' })

    // Merge Cyepro used inventory if dealer has API key
    const cyeproCars = dealer.cyepro_api_key
        ? await fetchAllCyeproInventoryAsCars(dealer.cyepro_api_key, {}, undefined, '3w')
        : []

    const cars = [...usedThreeWheelersToCars(usedVehicles), ...cyeproCars]

    const brands3w = dealer.brands.filter(b => THREE_WHEELER_BRANDS.includes(b))
    const primaryBrand = brands3w[0] ?? dealer.brands[0] ?? null
    const brandId = primaryBrand ? brandNameToId(primaryBrand, '3w') : null
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
        heroImageUrl,
        sellsNewCars:  false,
        sellsUsedCars: true,
        isVerified:    false,
        vehicleType:   '3w' as const,
    }

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        name: dealer.dealership_name,
        description: `${dealer.dealership_name} — certified pre-owned three-wheelers in ${dealer.location}`,
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
