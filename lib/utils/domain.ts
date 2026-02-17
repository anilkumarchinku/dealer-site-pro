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
