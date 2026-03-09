import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getTwoWheelerVehicles } from '@/lib/db/two-wheelers'
import { getTwoWheelerCatalog } from '@/lib/data/two-wheelers'
import { notFound } from 'next/navigation'
import { TwoWheelerTemplate } from '@/components/two-wheelers/TwoWheelerTemplate'

interface Props {
    params: Promise<{ slug: string }>
}

export default async function TwoWheelersPage({ params }: Props) {
    const { slug } = await params

    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const { vehicles: dbVehicles } = await getTwoWheelerVehicles(dealer.id, { pageSize: 100, sortBy: 'newest' })

    // Always show full catalog for every selected brand, supplemented by DB inventory
    const primaryBrand = dealer.brands[0] ?? null
    const catalogVehicles = dealer.brands.flatMap((brand, bi) =>
        getTwoWheelerCatalog(brand, dealer.id).map(v => ({ ...v, id: `cat-2w-${bi}-${v.id}` }))
    )
    const dbKeys = new Set(dbVehicles.map(v => `${v.brand}__${v.model}`))
    const catalogExtra = catalogVehicles.filter(v => !dbKeys.has(`${v.brand}__${v.model}`))
    const vehicles = [...dbVehicles, ...catalogExtra]

    return (
        <TwoWheelerTemplate
            dealerId={dealer.id}
            dealerName={dealer.dealership_name}
            phone={dealer.phone}
            email={dealer.email}
            location={dealer.location}
            fullAddress={dealer.full_address}
            primaryBrand={primaryBrand}
            logoUrl={dealer.logo_url ?? null}
            vehicles={vehicles}
            slug={slug}
        />
    )
}
