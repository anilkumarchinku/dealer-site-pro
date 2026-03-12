import { notFound } from 'next/navigation'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { LegalShell, PrivacyContent } from '@/components/legal'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return {}
    return { title: `Privacy Policy | ${dealer.dealership_name}` }
}

export default async function PrivacyPage({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    return (
        <LegalShell dealerName={dealer.dealership_name} logoUrl={dealer.logo_url} siteHref={`/sites/${slug}`}>
            <PrivacyContent
                dealerName={dealer.dealership_name}
                location={dealer.location}
                email={dealer.email}
                phone={dealer.phone}
            />
        </LegalShell>
    )
}
