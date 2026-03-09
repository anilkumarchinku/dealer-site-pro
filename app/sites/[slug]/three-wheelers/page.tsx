import { fetchDealerBySlug } from "@/lib/db/dealers"
import { getThreeWheelerVehicles } from "@/lib/db/three-wheelers"
import { getThreeWheelerCatalog, THREE_WHEELER_BRANDS } from "@/lib/data/three-wheelers"
import { notFound } from "next/navigation"
import { ThreeWheelerTemplate } from "@/components/three-wheelers/ThreeWheelerTemplate"

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

  // Resolve which brands to show catalog for:
  //  1. dealer.brands filtered to only 3W catalog brands (dealer_brands table is shared with 2W)
  //  2. All 3W brands  — shown until dealer sets up 3W brands (never leaves page blank)
  const dealer3wBrands = dealer.brands.filter(b => THREE_WHEELER_BRANDS.includes(b))
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
      logoUrl={dealer.logo_url ?? null}
      vehicles={vehicles}
      slug={slug}
      workingHours={dealer.working_hours ?? null}
      services={dealer.services ?? null}
    />
  )
}
