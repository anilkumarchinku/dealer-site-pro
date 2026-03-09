import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getTwoWheelerVehicles } from '@/lib/db/two-wheelers'
import { getTwoWheelerCatalog, TWO_WHEELER_BRANDS } from '@/lib/data/two-wheelers'
import { notFound } from 'next/navigation'
import { TwoWheelerTemplate } from '@/components/two-wheelers/TwoWheelerTemplate'

interface Props {
    params: Promise<{ slug: string }>
}

// Popular 2W brands shown when dealer hasn't picked a brand yet
const POPULAR_2W_BRANDS = [
    'Hero MotoCorp',
    'Honda Motorcycle & Scooter India',
    'TVS Motor Company',
    'Bajaj Auto',
    'Royal Enfield',
    'Yamaha India',
    'Suzuki Motorcycle India',
    'KTM India',
    'Ather Energy',
    'Ola Electric',
]

export default async function TwoWheelersPage({ params }: Props) {
    const { slug } = await params

    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    // Fetch DB inventory (empty array if table doesn't exist yet)
    const { vehicles: dbVehicles } = await getTwoWheelerVehicles(dealer.id, { pageSize: 100, sortBy: 'newest' })

    // Resolve which brands to show catalog for:
    //  1. dealer.brands filtered to only 2W catalog brands (dealer_brands table is shared with 3W)
    //  2. Popular defaults — shown until dealer sets up 2W brands (never leaves page blank)
    const dealer2wBrands = dealer.brands.filter(b => TWO_WHEELER_BRANDS.includes(b))
    const brandsToShow = dealer2wBrands.length > 0
        ? dealer2wBrands
        : POPULAR_2W_BRANDS.filter(b => TWO_WHEELER_BRANDS.includes(b))

    const primaryBrand = dealer2wBrands[0] ?? brandsToShow[0] ?? null

    // Build catalog for every brand, give each entry a unique stable id
    const catalogVehicles = brandsToShow.flatMap((brand, bi) =>
        getTwoWheelerCatalog(brand, dealer.id).map(v => ({ ...v, id: `cat-2w-${bi}-${v.id}` }))
    )

    // DB vehicles take priority — deduplicate catalog entries already in DB
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
