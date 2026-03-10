import type { Metadata } from 'next'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getUsedThreeWheelers } from '@/lib/db/three-wheelers'
import { THREE_WHEELER_BRANDS } from '@/lib/data/three-wheelers'
import { fetchCyeproInventoryAsCars } from '@/lib/services/cyepro-service'
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
            hero: v.images?.[0] ?? '',
            exterior: v.images ?? [],
            interior: [],
        },
        meta: { viewCount: 0 },
        price: `₹${(v.price_paise / 100).toLocaleString('en-IN')}`,
        condition: v.certified_pre_owned ? 'certified_pre_owned' as const : 'used' as const,
        vehicleCategory: '3w' as const,
    }))
}

// ── No Stock page ─────────────────────────────────────────────────────────────
function NoStockPage({ dealerName, phone, email }: { dealerName: string; phone: string; email: string }) {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center px-6 max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                    <span className="text-4xl">🛺</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{dealerName}</h1>
                <p className="text-amber-400 font-semibold mb-3">Pre-Owned Stock Coming Soon</p>
                <p className="text-gray-400 text-sm mb-6">
                    Our used three-wheeler inventory is being updated. Contact us directly for available autos and cargo vehicles.
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
        alternates: { canonical: `https://${dealer.slug}.dealersitepro.com/three-wheelers/used` },
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
        ? (await fetchCyeproInventoryAsCars(dealer.cyepro_api_key)).map(c => ({ ...c, vehicleCategory: '3w' as const }))
        : []

    const cars = [...usedThreeWheelersToCars(usedVehicles), ...cyeproCars]

    // ── No stock yet ──────────────────────────────────────────────────────────
    if (cars.length === 0) {
        return (
            <NoStockPage
                dealerName={dealer.dealership_name}
                phone={dealer.phone}
                email={dealer.email ?? ''}
            />
        )
    }

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
