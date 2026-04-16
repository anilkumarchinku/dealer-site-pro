import type { Metadata } from 'next'
import { fetchDealerBySlug } from "@/lib/db/dealers"
import { getThreeWheelerVehicles } from "@/lib/db/three-wheelers"
import { getThreeWheelerCatalog, THREE_WHEELER_BRANDS } from "@/lib/data/three-wheelers"
import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { brandNameToId } from "@/lib/utils/brand-model-images"
import { ModernTemplate } from "@/components/templates/ModernTemplate"
import { LuxuryTemplate } from "@/components/templates/LuxuryTemplate"
import { SportyTemplate } from "@/components/templates/SportyTemplate"
import { FamilyTemplate } from "@/components/templates/FamilyTemplate"
import type { Car } from "@/lib/types/car"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"
import type { Service } from "@/lib/types"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ brand?: string }>
}

const ALL_3W_BRANDS = THREE_WHEELER_BRANDS

function generate3WFeatures(v: ThreeWheelerVehicle): string[] {
  const f: string[] = []
  if (v.fuel_type === 'electric') {
    f.push('Electric Drive', 'Zero Emissions', 'Low Maintenance Cost')
    if (v.range_km) f.push(`${v.range_km} km Range`)
    if (v.battery_kwh) f.push(`${v.battery_kwh} kWh Battery`)
    if (v.fame_subsidy_eligible) f.push('FAME II Subsidy Eligible')
  } else if (v.fuel_type === 'cng') {
    f.push('CNG Powered', 'BS6 Compliant', 'Low Running Cost')
    if (v.cng_mileage_km_per_kg) f.push(`${v.cng_mileage_km_per_kg} km/kg Mileage`)
    else if (v.mileage_kmpl) f.push(`${v.mileage_kmpl} kmpl Mileage`)
  } else if (v.fuel_type === 'diesel') {
    f.push('Diesel Engine', 'High Torque', 'Heavy Duty')
    if (v.mileage_kmpl) f.push(`${v.mileage_kmpl} kmpl Mileage`)
  } else {
    f.push('BS6 Compliant')
    if (v.mileage_kmpl) f.push(`${v.mileage_kmpl} kmpl Mileage`)
  }
  if (v.engine_cc) f.push(`${v.engine_cc} cc Engine`)
  if (v.passenger_capacity) f.push(`${v.passenger_capacity}-Seater`, 'Comfortable Seating')
  if (v.payload_kg) f.push(`${v.payload_kg} kg Payload Capacity`)
  if (v.max_speed_kmph) f.push(`${v.max_speed_kmph} kmph Top Speed`)
  if (v.bs6_compliant && !f.includes('BS6 Compliant')) f.push('BS6 Compliant')
  return [...new Set(f)].slice(0, 8)
}

function threeWheelersToCars(vehicles: ThreeWheelerVehicle[]): Car[] {
  return vehicles.map(v => {
    const priceINR = v.ex_showroom_price_paise > 0 ? Math.round(v.ex_showroom_price_paise / 100) : null
    const fuelLabel = v.fuel_type === 'electric' ? 'Electric' : v.fuel_type === 'cng' ? 'CNG' : 'Diesel'
    return {
      id: v.id,
      make: v.brand,
      model: v.model,
      variant: v.variant ?? '',
      year: v.year,
      bodyType: v.body_type ?? 'Auto',
      segment: 'B' as Car['segment'],
      pricing: {
        exShowroom: { min: priceINR, max: priceINR, currency: 'INR' as const },
      },
      engine: {
        type: fuelLabel,
        displacement: v.engine_cc ?? null,
        power: v.max_power || '',
        torque: v.torque || '',
      },
      transmission: { type: v.transmission || 'Automatic' },
      performance: {
        fuelEfficiency: v.mileage_kmpl ?? undefined,
        topSpeed: v.max_speed_kmph ?? undefined,
        range: v.range_km ?? undefined,
      },
      dimensions: { seatingCapacity: v.passenger_capacity ?? null, bootSpace: v.payload_kg ?? undefined },
      vehicleCategory: '3w' as const,
      features: { keyFeatures: v.features?.length ? v.features : generate3WFeatures(v) },
      images: {
        hero: v.images?.[0] ?? '',
        exterior: v.images ?? [],
        interior: [],
      },
      variants: [{
        id: `${v.id}-v1`,
        name: v.variant || `${v.model} Standard`,
        price: priceINR ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transmission: (v.transmission || 'Automatic') as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fuelType: fuelLabel as any,
        keyFeatures: generate3WFeatures(v).slice(0, 3),
        isPopular: true,
      }],
      meta: { viewCount: v.views ?? 0 },
      price: priceINR
        ? `₹${priceINR.toLocaleString('en-IN')}`
        : 'Price on request',
      condition: 'new' as const,
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const dealer = await fetchDealerBySlug(slug)
  if (!dealer) return { title: 'New Three-Wheelers | DealerSite Pro' }

  const title = `New Autos & Cargo Vehicles — ${dealer.dealership_name} | ${dealer.location}`
  const description = `Browse brand new three-wheelers at ${dealer.dealership_name} in ${dealer.location}. Latest models, best prices.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', siteName: dealer.dealership_name, locale: 'en_IN' },
    robots: { index: true, follow: true },
  }
}

export default async function NewThreeWheelersPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { brand: brandParam } = await searchParams

  const dealer = await fetchDealerBySlug(slug)
  if (!dealer) notFound()

  const { vehicles: dbVehicles } = await getThreeWheelerVehicles(dealer.id, { pageSize: 100, sortBy: 'views' })

  let dealer3wBrands: string[] = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('dealer_brands')
      .select('brand_name')
      .eq('dealer_id', dealer.id)
      .eq('vehicle_type', '3w')
      .order('is_primary', { ascending: false })
    dealer3wBrands = data?.map((r: { brand_name: string }) => r.brand_name) ?? []
  } catch {
    dealer3wBrands = dealer.brands.filter(b => THREE_WHEELER_BRANDS.includes(b))
  }

  const allBrands = dealer3wBrands.length > 0 ? dealer3wBrands : ALL_3W_BRANDS

  // Resolve the active brand filter:
  // Priority: dealer.brandFilter (from slug suffix) > ?brand= query param > show all
  const activeBrandFilter: string | null = dealer.brandFilter
    ?? (brandParam
        ? allBrands.find(b =>
            b.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === brandParam
          ) ?? null
        : null)

  // Restrict to single brand if a filter is active; otherwise show all dealer brands.
  const brandsToShow = activeBrandFilter
    ? allBrands.filter(b => b.toLowerCase() === activeBrandFilter.toLowerCase())
        .concat(
          allBrands.filter(b => b.toLowerCase() === activeBrandFilter.toLowerCase()).length === 0
            ? [activeBrandFilter]
            : []
        )
    : allBrands

  const primaryBrand = brandsToShow[0] ?? null

  const catalogVehicles = brandsToShow.flatMap((brand, bi) =>
    getThreeWheelerCatalog(brand, dealer.id).map(v => ({ ...v, id: `cat-3w-${bi}-${v.id}` }))
  )

  const filteredDbVehicles = activeBrandFilter
    ? dbVehicles.filter(v => v.brand.toLowerCase() === activeBrandFilter.toLowerCase())
    : dbVehicles

  const dbKeys = new Set(filteredDbVehicles.map(v => `${v.brand}__${v.model}`))
  const catalogExtra = catalogVehicles.filter(v => !dbKeys.has(`${v.brand}__${v.model}`))
  const vehicles = [...filteredDbVehicles, ...catalogExtra]

  const cars = threeWheelersToCars(vehicles)

  const brandId = primaryBrand ? brandNameToId(primaryBrand, '3w') : null
  const brandLogoUrl = dealer.logo_url ?? (brandId ? `/data/brand-logos/${brandId}.png` : undefined)

  const contactInfo = {
    phone: dealer.phone,
    email: dealer.email ?? '',
    address: dealer.full_address ?? dealer.location,
  }

  const heroDefaults: Record<string, { title: string; subtitle: string }> = {
    luxury:  { title: 'THE POWER OF THREE WHEELS',          subtitle: 'Premium three-wheelers for every commercial need' },
    sporty:  { title: 'BUILT FOR THE ROAD',                 subtitle: 'Performance-ready 3W vehicles that get the job done' },
    family:  { title: 'Your Trusted 3-Wheeler Partner',     subtitle: 'Reliable passenger and cargo vehicles at great prices' },
    modern:  { title: 'Explore Our 3-Wheeler Range',        subtitle: 'Passenger autos, cargo carriers, and electric three-wheelers' },
  }
  const defaults = heroDefaults[dealer.style_template] ?? heroDefaults.modern
  const heroTitle    = dealer.hero_title    || defaults.title
  const heroSubtitle = dealer.hero_subtitle || defaults.subtitle

  const taglines: Record<string, string> = {
    luxury: 'Excellence in Motion',
    sporty: 'Built for Performance',
    family: 'Trusted by Operators',
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
    vehicleType:   '3w' as const,
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: dealer.dealership_name,
    description: `${dealer.dealership_name} — new three-wheeler dealer in ${dealer.location}`,
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
