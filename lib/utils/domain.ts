/**
 * domain.ts — Central place for all dealer-site URL construction.
 *
 * Reads two env vars:
 *   NEXT_PUBLIC_BASE_DOMAIN   — base hostname, e.g. "your-project.vercel.app"
 *                               or "indrav.in"
 *   NEXT_PUBLIC_USE_SUBDOMAIN — "true"  → {slug}.{BASE_DOMAIN}
 *                               "false" → {BASE_DOMAIN}/sites/{slug}, except indrav.in
 *                               unset   → subdomain on public domains, path on localhost/Vercel preview
 *
 * indrav.in is the hosted public domain and always uses slug-first public URLs
 * so copied links match the live dealer-site domain pattern.
 */

import { getOptionalEnv } from '@/lib/env'

function normalizeBaseDomain(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
}

function resolvePublicBaseDomain(value: string | undefined): string {
    const normalized = normalizeBaseDomain(value ?? 'indrav.in')
    return normalized === 'dealersitepro.com' ? 'indrav.in' : normalized
}

const BASE_DOMAIN = resolvePublicBaseDomain(getOptionalEnv('NEXT_PUBLIC_BASE_DOMAIN'))
const configuredUseSubdomain = getOptionalEnv('NEXT_PUBLIC_USE_SUBDOMAIN')

function canUsePublicSubdomains(baseDomain: string): boolean {
    const host = normalizeBaseDomain(baseDomain)
    return !(
        host.startsWith('localhost') ||
        host.startsWith('127.0.0.1') ||
        host.endsWith('.vercel.app')
    )
}

function normalizeDealerSiteSlug(slug: string): string {
    const trimmed = slug.trim().replace(/^\/+/, '')
    return trimmed.startsWith('sites/') ? trimmed.slice('sites/'.length) : trimmed
}

const normalizedBaseDomain = normalizeBaseDomain(BASE_DOMAIN)
const USE_SUBDOMAIN =
    configuredUseSubdomain === 'true' ||
    normalizedBaseDomain === 'indrav.in' ||
    (configuredUseSubdomain !== 'false' && canUsePublicSubdomains(BASE_DOMAIN))

export type DealerVehicleSiteType = 'car' | 'two-wheeler' | 'three-wheeler'

export function dealerVehicleSiteSlug(slug: string, vehicleType: DealerVehicleSiteType): string {
    if (vehicleType === 'two-wheeler') return `${slug}/two-wheelers`
    if (vehicleType === 'three-wheeler') return `${slug}/three-wheelers`
    return slug
}

/**
 * Returns the full dealer site URL for a given slug.
 *
 * Examples (BASE_DOMAIN=your-project.vercel.app, USE_SUBDOMAIN=false):
 *   dealerSiteUrl("abc-motors")  →  "your-project.vercel.app/sites/abc-motors"
 *
 * Examples (BASE_DOMAIN=indrav.in, USE_SUBDOMAIN=true):
 *   dealerSiteUrl("abc-motors")  →  "abc-motors.indrav.in"
 */
export function dealerSiteUrl(slug: string): string {
    const normalizedSlug = normalizeDealerSiteSlug(slug)
    if (USE_SUBDOMAIN) {
        // Slug may contain a path suffix, e.g. "varun-motors/two-wheelers".
        // Split so the subdomain is just "varun-motors" and path is "/two-wheelers"
        const slashIdx = normalizedSlug.indexOf('/')
        if (slashIdx !== -1) {
            const subdomain = normalizedSlug.slice(0, slashIdx)
            const path      = normalizedSlug.slice(slashIdx) // already starts with /
            return `${subdomain}.${BASE_DOMAIN}${path}`
        }
        return `${normalizedSlug}.${BASE_DOMAIN}`
    }
    return `${BASE_DOMAIN}/sites/${normalizedSlug}`
}

/** Internal route used for same-origin previews and middleware rewrites. */
export function dealerSitePath(slug: string): string {
    const normalizedSlug = normalizeDealerSiteSlug(slug)
    return normalizedSlug ? `/sites/${normalizedSlug}` : '/sites'
}

/** Full https:// URL */
export function dealerSiteHref(slug: string): string {
    const base = BASE_DOMAIN.startsWith('localhost') ? 'http' : 'https'
    return `${base}://${dealerSiteUrl(slug)}`
}

export function dealerVehicleSiteUrl(slug: string, vehicleType: DealerVehicleSiteType): string {
    return dealerSiteUrl(dealerVehicleSiteSlug(slug, vehicleType))
}

export function dealerVehicleSiteHref(slug: string, vehicleType: DealerVehicleSiteType): string {
    return dealerSiteHref(dealerVehicleSiteSlug(slug, vehicleType))
}

export { BASE_DOMAIN, USE_SUBDOMAIN }

// ── Brand-name → URL slug ───────────────────────────────────────────────────
// Moved here from lib/db/dealers so it can be safely imported in client components.
// lib/db/dealers.ts also exports this (it re-uses the same map) for server code.

const KNOWN_BRAND_SLUGS: { slug: string; name: string }[] = [
    { slug: 'maruti-suzuki',  name: 'Maruti Suzuki'  },
    { slug: 'tata-motors',    name: 'Tata Motors'    },
    { slug: 'mercedes-benz',  name: 'Mercedes-Benz'  },
    { slug: 'land-rover',     name: 'Land Rover'     },
    { slug: 'force-motors',   name: 'Force Motors'   },
    { slug: 'lamborghini',    name: 'Lamborghini'    },
    { slug: 'volkswagen',     name: 'Volkswagen'     },
    { slug: 'mahindra',       name: 'Mahindra'       },
    { slug: 'hyundai',        name: 'Hyundai'        },
    { slug: 'citroen',        name: 'Citroen'        },
    { slug: 'bentley',        name: 'Bentley'        },
    { slug: 'porsche',        name: 'Porsche'        },
    { slug: 'renault',        name: 'Renault'        },
    { slug: 'nissan',         name: 'Nissan'         },
    { slug: 'toyota',         name: 'Toyota'         },
    { slug: 'jaguar',         name: 'Jaguar'         },
    { slug: 'isuzu',          name: 'Isuzu'          },
    { slug: 'honda',          name: 'Honda'          },
    { slug: 'skoda',          name: 'Skoda'          },
    { slug: 'volvo',          name: 'Volvo'          },
    { slug: 'lexus',          name: 'Lexus'          },
    { slug: 'maruti',         name: 'Maruti Suzuki'  },
    { slug: 'tata',           name: 'Tata Motors'    },
    { slug: 'tesla',          name: 'Tesla'          },
    { slug: 'jeep',           name: 'Jeep'           },
    { slug: 'audi',           name: 'Audi'           },
    { slug: 'bmw',            name: 'BMW'            },
    { slug: 'kia',            name: 'Kia'            },
    { slug: 'byd',            name: 'BYD'            },
    { slug: 'mg',             name: 'MG'             },
].sort((a, b) => b.slug.length - a.slug.length)

/** "Tata Motors" → "tata-motors", "Mahindra" → "mahindra" */
export function brandToUrlSlug(brandName: string): string {
    const known = KNOWN_BRAND_SLUGS.find(
        b => b.name.toLowerCase() === brandName.toLowerCase()
    )
    if (known) return known.slug
    return brandName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}
