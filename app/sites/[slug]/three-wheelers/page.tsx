import { fetchDealerBySlug } from "@/lib/db/dealers"
import { getThreeWheelerVehicles } from "@/lib/db/three-wheelers"
import { getThreeWheelerCatalog } from "@/lib/data/three-wheelers"
import { notFound } from "next/navigation"
import { ThreeWheelerTemplate } from "@/components/three-wheelers/ThreeWheelerTemplate"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ThreeWheelersPage({ params }: Props) {
  const { slug } = await params
  const dealer = await fetchDealerBySlug(slug)
  if (!dealer) notFound()

  const { vehicles: dbVehicles } = await getThreeWheelerVehicles(dealer.id, {
    pageSize: 100,
    sortBy: "views",
  })

  // Always show full catalog for every selected brand, supplemented by DB inventory
  const primaryBrand = dealer.brands[0] ?? null
  const catalogVehicles = dealer.brands.flatMap((brand, bi) =>
    getThreeWheelerCatalog(brand, dealer.id).map(v => ({ ...v, id: `cat-3w-${bi}-${v.id}` }))
  )
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
