import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { LegalShell, ContactContent } from '@/components/legal'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return {}
    return { title: `Contact Us | ${dealer.dealership_name}` }
}

export default async function ContactPage({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const hdrs = await headers()
    const host = hdrs.get('host') ?? ''
    const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'dealersitepro.com'
    const isMainDomain = host === BASE_DOMAIN || host === `www.${BASE_DOMAIN}` || host.startsWith('localhost') || host.endsWith('.vercel.app')
    const siteHref = isMainDomain ? `/sites/${slug}` : '/'

    return (
        <LegalShell dealerName={dealer.dealership_name} logoUrl={dealer.logo_url} siteHref={siteHref}>
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
