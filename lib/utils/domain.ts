/**
 * domain.ts — Central place for all dealer-site URL construction.
 *
 * Reads two env vars:
 *   NEXT_PUBLIC_BASE_DOMAIN   — base hostname, e.g. "your-project.vercel.app"
 *                               or "dealersitepro.com"
 *   NEXT_PUBLIC_USE_SUBDOMAIN — "true"  → {slug}.{BASE_DOMAIN}
 *                               "false" → {BASE_DOMAIN}/sites/{slug}  (default)
 */

const BASE_DOMAIN   = process.env.NEXT_PUBLIC_BASE_DOMAIN   ?? 'dealersitepro.com'
const USE_SUBDOMAIN = process.env.NEXT_PUBLIC_USE_SUBDOMAIN === 'true'

/**
 * Returns the full dealer site URL for a given slug.
 *
 * Examples (BASE_DOMAIN=your-project.vercel.app, USE_SUBDOMAIN=false):
 *   dealerSiteUrl("abc-motors")  →  "your-project.vercel.app/sites/abc-motors"
 *
 * Examples (BASE_DOMAIN=dealersitepro.com, USE_SUBDOMAIN=true):
 *   dealerSiteUrl("abc-motors")  →  "abc-motors.dealersitepro.com"
 */
export function dealerSiteUrl(slug: string): string {
    if (USE_SUBDOMAIN) {
        return `${slug}.${BASE_DOMAIN}`
    }
    return `${BASE_DOMAIN}/sites/${slug}`
}

/** Full https:// URL */
export function dealerSiteHref(slug: string): string {
    const base = BASE_DOMAIN.startsWith('localhost') ? 'http' : 'https'
    return `${base}://${dealerSiteUrl(slug)}`
}

export { BASE_DOMAIN, USE_SUBDOMAIN }
