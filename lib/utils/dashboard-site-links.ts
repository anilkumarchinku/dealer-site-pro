import { BASE_DOMAIN, USE_SUBDOMAIN, dealerSiteHref, dealerSitePath, dealerSiteUrl } from '@/lib/utils/domain'

export interface DashboardSiteOrigin {
    origin: string
    host: string
}

function normalizeSiteSlug(slug: string): string {
    const trimmed = slug.trim().replace(/^\/+/, '')
    if (/^https?:\/\//i.test(trimmed)) {
        try {
            const url = new URL(trimmed)
            const baseHost = BASE_DOMAIN.toLowerCase().replace(/:\d+$/, '')
            const urlHost = url.hostname.toLowerCase().replace(/:\d+$/, '')
            if (urlHost.endsWith(`.${baseHost}`)) {
                const subdomain = urlHost.slice(0, -(baseHost.length + 1))
                const path = url.pathname === '/' ? '' : url.pathname
                return `${subdomain}${path}`
            }
            const pathSlug = url.pathname.replace(/^\/+/, '')
            return pathSlug.startsWith('sites/') ? pathSlug.slice('sites/'.length) : pathSlug
        } catch {
            return trimmed
        }
    }
    return trimmed.startsWith('sites/') ? trimmed.slice('sites/'.length) : trimmed
}

export function dashboardSitePath(slug: string): string {
    return dealerSitePath(normalizeSiteSlug(slug))
}

export function dashboardSiteHref(slug: string, siteOrigin?: DashboardSiteOrigin | string | null): string {
    const normalized = normalizeSiteSlug(slug)
    if (USE_SUBDOMAIN && normalized) return dealerSiteHref(normalized)

    const path = dashboardSitePath(normalized)
    if (typeof siteOrigin === 'string') return new URL(path, siteOrigin).toString()
    if (siteOrigin?.origin) return new URL(path, siteOrigin.origin).toString()
    if (typeof window !== 'undefined') return new URL(path, window.location.origin).toString()
    return path
}

export function dashboardSiteDisplayUrl(slug: string, siteOrigin?: DashboardSiteOrigin | string | null): string {
    const normalized = normalizeSiteSlug(slug)
    if (USE_SUBDOMAIN && normalized) return dealerSiteUrl(normalized)

    const path = dashboardSitePath(normalized)
    if (typeof siteOrigin === 'string') return `${new URL(siteOrigin).host}${path}`
    if (siteOrigin?.host) return `${siteOrigin.host}${path}`
    if (typeof window !== 'undefined') return `${window.location.host}${path}`
    return path
}
