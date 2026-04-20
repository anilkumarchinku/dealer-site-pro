import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
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

    const hdrs = await headers()
    const host = hdrs.get('host') ?? ''
    const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'dealersitepro.com'
    const isMainDomain = host === BASE_DOMAIN || host === `www.${BASE_DOMAIN}` || host.startsWith('localhost') || host.endsWith('.vercel.app')
    const siteHref = isMainDomain ? `/sites/${slug}` : '/'

    return (
        <LegalShell dealerName={dealer.dealership_name} logoUrl={dealer.logo_url} siteHref={siteHref}>
            <PrivacyContent
                dealerName={dealer.dealership_name}
                location={dealer.location}
                email={dealer.email}
                phone={dealer.phone}
            />
        </LegalShell>
    )
}
