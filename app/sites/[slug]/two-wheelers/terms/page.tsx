import { notFound } from 'next/navigation'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { LegalShell, TermsContent, getVehicleWord } from '@/components/legal'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return {}
    return { title: `Terms & Conditions | ${dealer.dealership_name}` }
}

export default async function TwoWheelerTermsPage({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const seg = '2w'
    const siteHref = `/sites/${slug}/two-wheelers`

    return (
        <LegalShell dealerName={dealer.dealership_name} logoUrl={dealer.logo_url} siteHref={siteHref}>
            <TermsContent
                dealerName={dealer.dealership_name}
                location={dealer.location}
                email={dealer.email}
                phone={dealer.phone}
                vehicleWord={getVehicleWord(seg)}
            />
        </LegalShell>
    )
}
