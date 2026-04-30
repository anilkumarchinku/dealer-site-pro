export interface DashboardSiteOrigin {
    origin: string
    host: string
}

function normalizeSiteSlug(slug: string): string {
    const trimmed = slug.trim().replace(/^\/+/, '')
    return trimmed.startsWith('sites/') ? trimmed.slice('sites/'.length) : trimmed
}

export function dashboardSitePath(slug: string): string {
    const normalized = normalizeSiteSlug(slug)
    return normalized ? `/sites/${normalized}` : '/sites'
}

export function dashboardSiteHref(slug: string, siteOrigin?: DashboardSiteOrigin | string | null): string {
    const path = dashboardSitePath(slug)
    if (typeof siteOrigin === 'string') return new URL(path, siteOrigin).toString()
    if (siteOrigin?.origin) return new URL(path, siteOrigin.origin).toString()
    if (typeof window !== 'undefined') return new URL(path, window.location.origin).toString()
    return path
}

export function dashboardSiteDisplayUrl(slug: string, siteOrigin?: DashboardSiteOrigin | string | null): string {
    const path = dashboardSitePath(slug)
    if (typeof siteOrigin === 'string') return `${new URL(siteOrigin).host}${path}`
    if (siteOrigin?.host) return `${siteOrigin.host}${path}`
    if (typeof window !== 'undefined') return `${window.location.host}${path}`
    return path
}
