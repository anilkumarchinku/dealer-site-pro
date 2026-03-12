import { notFound } from 'next/navigation'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { LegalShell, AboutContent, getVehicleWord, getVehicleEmoji } from '@/components/legal'
import { createClient } from '@supabase/supabase-js'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return {}
    return { title: `About Us | ${dealer.dealership_name}` }
}

export default async function ThreeWheelerAboutPage({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const seg = '3w'

    // Fetch 3W-specific brands
    let brands = dealer.brands
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
        if (data && data.length > 0) brands = data.map((r: { brand_name: string }) => r.brand_name)
    } catch { /* use dealer.brands fallback */ }

    return (
        <LegalShell dealerName={dealer.dealership_name} logoUrl={dealer.logo_url} siteHref={`/sites/${slug}/three-wheelers`}>
            <AboutContent
                dealerName={dealer.dealership_name}
                tagline={dealer.tagline}
                location={dealer.location}
                fullAddress={dealer.full_address}
                phone={dealer.phone}
                email={dealer.email}
                brands={brands}
                services={dealer.services}
                vehicleWord={getVehicleWord(seg) + 's'}
                vehicleEmoji={getVehicleEmoji(seg)}
            />
        </LegalShell>
    )
}
