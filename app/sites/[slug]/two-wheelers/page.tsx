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

    const { vehicles: dbVehicles } = await getTwoWheelerVehicles(dealer.id, { pageSize: 24, sortBy: 'newest' })

    // If no inventory in DB yet, fall back to static brand catalog
    const primaryBrand = dealer.brands[0] ?? null
    const vehicles = dbVehicles.length > 0
        ? dbVehicles
        : (primaryBrand ? getTwoWheelerCatalog(primaryBrand, dealer.id) : [])

    return (
        <TwoWheelerTemplate
            dealerId={dealer.id}
            dealerName={dealer.dealership_name}
            phone={dealer.phone}
            email={dealer.email}
            location={dealer.location}
            fullAddress={dealer.full_address}
            primaryBrand={primaryBrand}
            vehicles={vehicles}
            slug={slug}
        />
    )
}
