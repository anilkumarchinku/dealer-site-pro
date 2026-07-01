import type { Metadata } from 'next'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getUsedTwoWheelers } from '@/lib/db/two-wheelers'
import { TWO_WHEELER_BRANDS } from '@/lib/data/two-wheelers'
import { fetchAllCyeproInventoryAsCars } from '@/lib/services/cyepro-service'
import { db } from '@/lib/db/query-helpers'
import { notFound } from 'next/navigation'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import type { Car } from '@/lib/types/car'
import type { TwoWheelerUsedVehicle } from '@/lib/types/two-wheeler'
import type { Service } from '@/lib/types'
import { brandLogoUrl as getBrandLogoUrl, firstVehicleHeroImage, resolveDealerHeroImage, resolveDealerLogoImage } from '@/lib/utils/site-assets'
import { dealerSiteHref } from '@/lib/utils/domain'
import { brandNameToId, getVehicleImageUrls, isUsableVehicleImageUrl } from '@/lib/utils/brand-model-images'

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

type GenericUsedTwoWheelerRow = {
    id: string
    make: string | null
    model: string | null
    variant: string | null
    year: number | null
    price_paise: number | null
    image_url: string | null
    image_urls: string[] | null
    fuel_type: string | null
    body_type: string | null
    transmission: string | null
    mileage_km: number | null
    condition: 'used' | 'certified_pre_owned' | 'new' | null
}

function isTwoWheelerGenericRow(row: GenericUsedTwoWheelerRow) {
    const text = `${row.make ?? ''} ${row.model ?? ''} ${row.body_type ?? ''}`.toLowerCase()
    return (
        text.includes('motorcycle') ||
        text.includes('scooter') ||
        text.includes('moped') ||
        text.includes('two-wheeler') ||
        text.includes('two wheeler') ||
        /\b(hero|motocorp|tvs|bajaj|yamaha|royal enfield|ather|ola electric|okinawa|revolt|jawa|yezdi)\b/.test(text)
    )
}

function genericUsedTwoWheelersToCars(rows: GenericUsedTwoWheelerRow[]): Car[] {
    return rows.filter(isTwoWheelerGenericRow).map(row => {
        const make = String(row.make ?? '').trim()
        const model = String(row.model ?? '').trim()
        const price = Math.round((row.price_paise ?? 0) / 100)
        const uploadedImages = [
            row.image_url,
            ...(Array.isArray(row.image_urls) ? row.image_urls : []),
        ].filter(isUsableVehicleImageUrl)
        const resolvedImages = getVehicleImageUrls('2w', brandNameToId(make, '2w'), model)
        const imageUrls = Array.from(new Set([...resolvedImages, ...uploadedImages].filter(isUsableVehicleImageUrl)))

        return {
            id: row.id,
            make,
            model,
            variant: row.variant ?? (row.mileage_km != null && row.mileage_km > 0 ? `${row.mileage_km.toLocaleString('en-IN')} km` : ''),
            year: row.year ?? new Date().getFullYear(),
            bodyType: row.body_type?.includes('Scooter') ? 'Scooter' : 'Bike',
            segment: 'B' as Car['segment'],
            pricing: {
                exShowroom: {
                    min: price > 0 ? price : null,
                    max: price > 0 ? price : null,
                    currency: 'INR' as const,
                },
            },
            engine: {
                type: row.fuel_type === 'Electric' ? 'Electric' : 'Petrol',
                displacement: null,
                power: '—',
                torque: '—',
            },
            transmission: { type: row.transmission || 'Manual' },
            performance: {},
            dimensions: { seatingCapacity: 2 },
            features: { keyFeatures: [] },
            images: {
                hero: imageUrls[0] ?? '',
                exterior: imageUrls,
                interior: [],
                _fallbackUrls: imageUrls,
            } as Car['images'],
            meta: { viewCount: 0, sourceVehicleId: row.id },
            price: price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Price on request',
            condition: row.condition === 'certified_pre_owned' ? 'certified_pre_owned' as const : 'used' as const,
            vehicleCategory: '2w' as const,
        }
    })
}

async function getGenericUsedTwoWheelersForDealer(dealerId: string): Promise<Car[]> {
    const baseQuery = (condition: 'used' | 'certified_pre_owned') => db()
            .from('vehicles')
            .select('id, make, model, variant, year, price_paise, image_url, image_urls, fuel_type, body_type, transmission, mileage_km, condition')
            .eq('dealer_id', dealerId)
            .eq('status', 'available')
            .eq('condition', condition)
            .order('created_at', { ascending: false })
            .range(0, 119)

    const [usedResult, certifiedResult] = await Promise.all([
        baseQuery('used'),
        baseQuery('certified_pre_owned'),
    ])

    const error = usedResult.error ?? certifiedResult.error
    const data = [...(usedResult.data ?? []), ...(certifiedResult.data ?? [])]

    if (error) {
        console.error('Failed to load generic used two-wheeler inventory', error)
        return []
    }

    return genericUsedTwoWheelersToCars((data ?? []) as GenericUsedTwoWheelerRow[])
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

    const genericUsedCars = await getGenericUsedTwoWheelersForDealer(dealer.id)
    const cars = Array.from(
        new Map([...usedTwoWheelersToCars(usedVehicles), ...genericUsedCars, ...cyeproCars].map(car => [car.id, car])).values()
    )

    const brands2w = dealer.brands.filter(b => TWO_WHEELER_BRANDS.includes(b))
    const primaryBrand = brands2w[0] ?? dealer.brands[0] ?? null
    const logoUrl = resolveDealerLogoImage({
        uploadedLogo: dealer.logo_url,
        fallbackLogo: primaryBrand ? getBrandLogoUrl(primaryBrand, '2w') : undefined,
        preferFallbackLogo: true,
    })
    const heroImageUrl = resolveDealerHeroImage({
        uploadedHeroImage: dealer.hero_image_url,
        inventoryHeroImage: firstVehicleHeroImage(cars),
    })

    const contactInfo = {
        phone: dealer.phone,
        email: dealer.email ?? '',
        city: dealer.location,
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
        logoUrl:      logoUrl ?? undefined,
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
