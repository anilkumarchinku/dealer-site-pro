import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getTwoWheelerVehicles } from '@/lib/db/two-wheelers'
import { getTwoWheelerCatalog, TWO_WHEELER_BRANDS } from '@/lib/data/two-wheelers'
import { notFound } from 'next/navigation'
import { TwoWheelerTemplate } from '@/components/two-wheelers/TwoWheelerTemplate'
import { createClient } from '@supabase/supabase-js'
import { brandNameToId } from '@/lib/utils/brand-model-images'

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

    // Fetch 2W brands directly — scoped by vehicle_type so 3W brands never bleed in
    let dealer2wBrands: string[] = []
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data } = await supabase
            .from('dealer_brands')
            .select('brand_name')
            .eq('dealer_id', dealer.id)
            .eq('vehicle_type', '2w')
            .order('is_primary', { ascending: false })
        dealer2wBrands = data?.map((r: { brand_name: string }) => r.brand_name) ?? []
    } catch {
        // Fallback to name-based filter if column not yet migrated
        dealer2wBrands = dealer.brands.filter(b => TWO_WHEELER_BRANDS.includes(b))
    }

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

    // Brand logo: use dealer's uploaded logo first, then fall back to brand logo from catalog
    const brandId = primaryBrand ? brandNameToId(primaryBrand, '2w') : null
    const brandLogoUrl = dealer.logo_url
        ?? (brandId ? `/data/brand-logos/${brandId}.png` : null)

    return (
        <TwoWheelerTemplate
            dealerId={dealer.id}
            dealerName={dealer.dealership_name}
            phone={dealer.phone}
            email={dealer.email}
            location={dealer.location}
            fullAddress={dealer.full_address}
            primaryBrand={primaryBrand}
            logoUrl={brandLogoUrl}
            vehicles={vehicles}
            slug={slug}
        />
    )
}
