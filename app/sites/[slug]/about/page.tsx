import { notFound } from 'next/navigation'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { LegalShell, AboutContent, getVehicleWord, getVehicleEmoji } from '@/components/legal'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return {}
    return { title: `About Us | ${dealer.dealership_name}` }
}

export default async function AboutPage({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const seg = '4w'

    return (
        <LegalShell dealerName={dealer.dealership_name} logoUrl={dealer.logo_url} siteHref={`/sites/${slug}`}>
            <AboutContent
                dealerName={dealer.dealership_name}
                tagline={dealer.tagline}
                location={dealer.location}
                fullAddress={dealer.full_address}
                phone={dealer.phone}
                email={dealer.email}
                brands={dealer.brands}
                services={dealer.services}
                vehicleWord={getVehicleWord(seg) + 's'}
                vehicleEmoji={getVehicleEmoji(seg)}
            />
        </LegalShell>
    )
}
