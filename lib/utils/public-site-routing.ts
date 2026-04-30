export type VehicleHubSegment = 'two-wheelers' | 'three-wheelers'

function normalizeDomain(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
}

function normalizeHostname(value: string): string {
    return normalizeDomain(value).replace(/:\d+$/, '')
}

export function isMainDealerHost(host: string, baseDomain = 'dealersitepro.com'): boolean {
    const hostname = normalizeHostname(host)
    const baseHostname = normalizeHostname(baseDomain)

    return (
        hostname === baseHostname ||
        hostname === `www.${baseHostname}` ||
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.endsWith('.vercel.app')
    )
}

export function publicDealerSitePath({
    siteSlug,
    host,
    baseDomain = 'dealersitepro.com',
}: {
    siteSlug: string
    host: string
    baseDomain?: string
}): string {
    if (isMainDealerHost(host, baseDomain)) {
        return `/sites/${siteSlug}`
    }

    const baseHost = normalizeDomain(baseDomain)
    const protocol = baseHost.startsWith('localhost') || baseHost.startsWith('127.0.0.1')
        ? 'http'
        : 'https'

    return `${protocol}://${baseHost}/sites/${siteSlug}`
}

export function publicVehicleHubPath({
    dealerSlug,
    segment,
    host,
    baseDomain,
}: {
    dealerSlug: string
    segment: VehicleHubSegment
    host: string
    baseDomain?: string
}): string {
    if (isMainDealerHost(host, baseDomain)) {
        return `/sites/${dealerSlug}/${segment}`
    }

    return `/${segment}`
}
