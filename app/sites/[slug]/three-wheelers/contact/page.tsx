import { notFound } from 'next/navigation'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { LegalShell, ContactContent } from '@/components/legal'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return {}
    return { title: `Contact Us | ${dealer.dealership_name}` }
}

export default async function ThreeWheelerContactPage({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    return (
        <LegalShell dealerName={dealer.dealership_name} logoUrl={dealer.logo_url} siteHref={`/sites/${slug}/three-wheelers`}>
            <ContactContent
                dealerName={dealer.dealership_name}
                location={dealer.location}
                fullAddress={dealer.full_address}
                phone={dealer.phone}
                email={dealer.email}
                workingHours={dealer.working_hours}
            />
        </LegalShell>
    )
}
