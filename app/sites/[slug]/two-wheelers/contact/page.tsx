import { notFound } from 'next/navigation'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getBrandColors } from '@/lib/colors/automotive-brands'
import { LegalShell, ContactContent } from '@/components/legal'
import { ContactMessageForm } from '@/components/sites/ContactMessageForm'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return {}
    return { title: `Contact Us | ${dealer.dealership_name}` }
}

export default async function TwoWheelerContactPage({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const brandName = dealer.brandFilter ?? dealer.brands[0] ?? dealer.dealership_name
    const brandColor = getBrandColors(brandName).primary

    return (
        <LegalShell dealerName={dealer.dealership_name} logoUrl={dealer.logo_url} siteHref={`/sites/${slug}/two-wheelers`}>
            <ContactContent
                dealerName={dealer.dealership_name}
                location={dealer.location}
                fullAddress={dealer.full_address}
                phone={dealer.phone}
                email={dealer.email}
                workingHours={dealer.working_hours}
            />
            <div className="mt-8">
                <ContactMessageForm dealerId={dealer.id} brandColor={brandColor} />
            </div>
        </LegalShell>
    )
}
