import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getTwoWheelerVehicles } from '@/lib/db/two-wheelers'
import { notFound } from 'next/navigation'
import { TwoWheelerTemplate } from '@/components/two-wheelers/TwoWheelerTemplate'

interface Props {
    params: Promise<{ slug: string }>
}

export default async function TwoWheelersPage({ params }: Props) {
    const { slug } = await params

    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const { vehicles } = await getTwoWheelerVehicles(dealer.id, { pageSize: 24, sortBy: 'newest' })

    return (
        <TwoWheelerTemplate
            dealerId={dealer.id}
            dealerName={dealer.dealership_name}
            phone={dealer.phone}
            email={dealer.email}
            location={dealer.location}
            fullAddress={dealer.full_address}
            primaryBrand={dealer.brands[0] ?? null}
            vehicles={vehicles}
            slug={slug}
        />
    )
}
