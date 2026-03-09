import { fetchDealerBySlug } from "@/lib/db/dealers"
import { getThreeWheelerVehicles } from "@/lib/db/three-wheelers"
import { getThreeWheelerCatalog, THREE_WHEELER_BRANDS } from "@/lib/data/three-wheelers"
import { notFound } from "next/navigation"
import { ThreeWheelerTemplate } from "@/components/three-wheelers/ThreeWheelerTemplate"
import { createClient } from "@supabase/supabase-js"
import { brandNameToId } from "@/lib/utils/brand-model-images"

interface Props {
  params: Promise<{ slug: string }>
}

// All 3W brands shown when dealer hasn't picked a brand yet —
// there are only 10 so we show all of them as a complete catalog
const ALL_3W_BRANDS = THREE_WHEELER_BRANDS

export default async function ThreeWheelersPage({ params }: Props) {
  const { slug } = await params
  const dealer = await fetchDealerBySlug(slug)
  if (!dealer) notFound()

  // Fetch DB inventory (empty array if table doesn't exist yet)
  const { vehicles: dbVehicles } = await getThreeWheelerVehicles(dealer.id, {
    pageSize: 100,
    sortBy: "views",
  })

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

  // Brand logo: use dealer's uploaded logo first, then fall back to brand logo from catalog
  const brandId = primaryBrand ? brandNameToId(primaryBrand, '3w') : null
  const brandLogoUrl = dealer.logo_url
    ?? (brandId ? `/data/brand-logos/${brandId}.png` : null)

  return (
    <ThreeWheelerTemplate
      dealerId={dealer.id}
      dealerName={dealer.dealership_name}
      phone={dealer.phone}
      email={dealer.email ?? null}
      location={dealer.location}
      fullAddress={dealer.full_address ?? null}
      tagline={dealer.tagline ?? null}
      primaryBrand={primaryBrand}
      heroTitle={dealer.hero_title ?? null}
      heroSubtitle={dealer.hero_subtitle ?? null}
      logoUrl={brandLogoUrl}
      vehicles={vehicles}
      slug={slug}
      workingHours={dealer.working_hours ?? null}
      services={dealer.services ?? null}
    />
  )
}
