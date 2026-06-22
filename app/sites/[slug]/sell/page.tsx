import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { SellCarFlow } from '@/components/tools/SellCarFlow'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { BASE_DOMAIN } from '@/lib/utils/domain'
import { isMainDealerHost } from '@/lib/utils/public-site-routing'

interface DealerSellPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DealerSellPageProps): Promise<Metadata> {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)

    return {
        title: dealer ? `Sell Your Car | ${dealer.dealership_name}` : 'Sell Your Car',
        description: dealer
            ? `Submit your vehicle details to ${dealer.dealership_name} for review and inspection.`
            : 'Submit your vehicle details for dealer review and inspection.',
    }
}

export default async function DealerSellPage({ params }: DealerSellPageProps) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const requestHeaders = await headers()
    const host = requestHeaders.get('host') ?? ''
    const onMainHost = isMainDealerHost(host, BASE_DOMAIN)
    const siteRoot = onMainHost ? `/sites/${slug}` : '/'
    const browseHref = onMainHost ? `${siteRoot}/cars` : '/cars'

    return (
        <Suspense fallback={null}>
            <SellCarFlow
                initialDealerId={dealer.id}
                dealerName={dealer.dealership_name}
                returnHref={siteRoot}
                browseHref={browseHref}
            />
        </Suspense>
    )
}
