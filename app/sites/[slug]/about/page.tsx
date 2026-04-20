import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
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
    const hdrs = await headers()
    const host = hdrs.get('host') ?? ''
    const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'dealersitepro.com'
    const isMainDomain = host === BASE_DOMAIN || host === `www.${BASE_DOMAIN}` || host.startsWith('localhost') || host.endsWith('.vercel.app')
    const siteHref = isMainDomain ? `/sites/${slug}` : '/'

    return (
        <LegalShell dealerName={dealer.dealership_name} logoUrl={dealer.logo_url} siteHref={siteHref}>
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
