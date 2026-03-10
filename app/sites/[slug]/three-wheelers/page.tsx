import { fetchDealerBySlug } from "@/lib/db/dealers"
import { getThreeWheelerVehicles, getUsedThreeWheelers } from "@/lib/db/three-wheelers"
import { getThreeWheelerCatalog, THREE_WHEELER_BRANDS } from "@/lib/data/three-wheelers"
import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { brandNameToId } from "@/lib/utils/brand-model-images"
import { ModernTemplate } from "@/components/templates/ModernTemplate"
import { LuxuryTemplate } from "@/components/templates/LuxuryTemplate"
import { SportyTemplate } from "@/components/templates/SportyTemplate"
import { FamilyTemplate } from "@/components/templates/FamilyTemplate"
import type { Car } from "@/lib/types/car"
import type { ThreeWheelerVehicle, ThreeWheelerUsedVehicle } from "@/lib/types/three-wheeler"
import type { Service } from "@/lib/types"

interface Props {
  params: Promise<{ slug: string }>
}

// All 3W brands shown when dealer hasn't picked a brand yet —
// there are only 10 so we show all of them as a complete catalog
const ALL_3W_BRANDS = THREE_WHEELER_BRANDS

function threeWheelersToCars(vehicles: ThreeWheelerVehicle[]): Car[] {
  return vehicles.map(v => ({
    id: v.id,
    make: v.brand,
    model: v.model,
    variant: v.variant ?? '',
    year: v.year,
    bodyType: v.body_type ?? 'Auto',
    segment: 'B' as Car['segment'],
    pricing: {
      exShowroom: {
        min: v.ex_showroom_price_paise > 0 ? Math.round(v.ex_showroom_price_paise / 100) : null,
        max: v.ex_showroom_price_paise > 0 ? Math.round(v.ex_showroom_price_paise / 100) : null,
        currency: 'INR' as const,
      },
    },
    engine: {
      type: v.fuel_type === 'electric' ? 'Electric' : v.fuel_type === 'cng' ? 'CNG' : 'Petrol',
      power: '—',
      torque: '—',
    },
    transmission: { type: 'Manual' },
    performance: {
      fuelEfficiency: v.mileage_kmpl ?? undefined,
      topSpeed: v.max_speed_kmph ?? undefined,
      range: v.range_km ?? undefined,
    },
    dimensions: { seatingCapacity: v.passenger_capacity ?? null, bootSpace: v.payload_kg ?? undefined },
    vehicleCategory: '3w' as const,
    features: { keyFeatures: v.features ?? [] },
    images: {
      hero: v.images?.[0] ?? '/placeholder-car.jpg',
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

export default async function ThreeWheelersPage({ params }: Props) {
  const { slug } = await params
  const dealer = await fetchDealerBySlug(slug)
  if (!dealer) notFound()

  // Fetch new + used inventory in parallel
  const [{ vehicles: dbVehicles }, { vehicles: usedVehicles }] = await Promise.all([
    getThreeWheelerVehicles(dealer.id, { pageSize: 100, sortBy: 'views' }),
    getUsedThreeWheelers(dealer.id, { pageSize: 100, sortBy: 'newest' }),
  ])

  // Fetch 3W brands directly — scoped by vehicle_type so 2W brands never bleed in
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
    // Fallback to name-based filter if column not yet migrated
    dealer3wBrands = dealer.brands.filter(b => THREE_WHEELER_BRANDS.includes(b))
  }

  const brandsToShow = dealer3wBrands.length > 0
    ? dealer3wBrands
    : ALL_3W_BRANDS

  const primaryBrand = dealer3wBrands[0] ?? brandsToShow[0] ?? null

  // Build catalog for every brand, give each entry a unique stable id
  const catalogVehicles = brandsToShow.flatMap((brand, bi) =>
    getThreeWheelerCatalog(brand, dealer.id).map(v => ({ ...v, id: `cat-3w-${bi}-${v.id}` }))
  )

  // DB vehicles take priority — deduplicate catalog entries already in DB
  const dbKeys = new Set(dbVehicles.map(v => `${v.brand}__${v.model}`))
  const catalogExtra = catalogVehicles.filter(v => !dbKeys.has(`${v.brand}__${v.model}`))
  const vehicles = [...dbVehicles, ...catalogExtra]

  // Map to Car shape — mode depends on URL suffix, matching 4W hybrid flow:
  //   normal URL  → merge new + used (template shows All/New/Used tabs)
  //   -used URL   → used-only (sellsNewCars: false)
  const newCars  = threeWheelersToCars(vehicles)
  const usedCars = usedThreeWheelersToCars(usedVehicles)

  const isUsedSite = dealer.usedCarSite === true
  const cars  = isUsedSite ? usedCars : [...newCars, ...usedCars]
  const hasNew  = !isUsedSite && newCars.length > 0
  const hasUsed = usedCars.length > 0

  // Brand logo: use dealer's uploaded logo first, then fall back to brand logo
  const brandId = primaryBrand ? brandNameToId(primaryBrand, '3w') : null
  const brandLogoUrl = dealer.logo_url ?? (brandId ? `/data/brand-logos/${brandId}.png` : undefined)

  const contactInfo = {
    phone: dealer.phone,
    email: dealer.email ?? '',
    address: dealer.full_address ?? dealer.location,
  }

  // Hero text defaults per template style
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
    sellsNewCars:  hasNew,
    sellsUsedCars: hasUsed,
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
