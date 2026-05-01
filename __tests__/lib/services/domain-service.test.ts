import { describe, expect, it, vi } from 'vitest'
import { getDealerDomains, isSlugAvailable } from '@/lib/services/domain-service'

type TableRows = Record<string, Array<Record<string, unknown>>>

function createSupabaseMock(tables: TableRows) {
    return {
        from: vi.fn((table: string) => {
            const filters: Array<{ field: string; value: unknown }> = []
            const builder = {
                select: vi.fn(() => builder),
                order: vi.fn(() => builder),
                eq: vi.fn((field: string, value: unknown) => {
                    filters.push({ field, value })
                    return builder
                }),
                single: vi.fn(async () => {
                    const rows = applyFilters(tables[table] ?? [], filters)
                    return { data: rows[0] ?? null, error: rows[0] ? null : { code: 'PGRST116' } }
                }),
                then(resolve: (value: { data: Array<Record<string, unknown>>; error: null }) => void) {
                    resolve({ data: applyFilters(tables[table] ?? [], filters), error: null })
                },
            }
            return builder
        }),
    }
}

function applyFilters(rows: Array<Record<string, unknown>>, filters: Array<{ field: string; value: unknown }>) {
    return rows.filter(row => filters.every(filter => row[filter.field] === filter.value))
}

describe('domain-service model compatibility', () => {
    it('returns current dealer_domains rows ahead of legacy domains and de-duplicates by domain name', async () => {
        const supabase = createSupabaseMock({
            dealer_domains: [
                {
                    id: 'dealer-domain-1',
                    dealer_id: 'dealer-1',
                    custom_domain: 'bharat-hyundai.com',
                    subdomain: null,
                    subdomain_url: null,
                    domain_type: 'custom',
                    status: 'active',
                    ssl_status: 'active',
                    is_primary: false,
                    dns_verified_at: '2026-05-01T00:00:00.000Z',
                    ssl_provisioned_at: null,
                    ssl_expires_at: null,
                    last_checked_at: null,
                    registrar: null,
                    registration_expires_at: null,
                    auto_renew: true,
                    site_slug: 'bharat-hyundai',
                    created_at: '2026-05-01T00:00:00.000Z',
                    updated_at: '2026-05-01T00:00:00.000Z',
                },
            ],
            domains: [
                {
                    id: 'legacy-duplicate',
                    dealer_id: 'dealer-1',
                    domain: 'bharat-hyundai.com',
                    slug: 'legacy-bharat',
                    type: 'custom',
                    status: 'pending',
                    ssl_status: 'pending',
                    is_primary: false,
                    auto_renew: true,
                    created_at: '2026-04-01T00:00:00.000Z',
                    updated_at: '2026-04-01T00:00:00.000Z',
                },
                {
                    id: 'legacy-subdomain',
                    dealer_id: 'dealer-1',
                    domain: 'bharat.dealersitepro.com',
                    slug: 'bharat',
                    type: 'subdomain',
                    status: 'active',
                    ssl_status: 'active',
                    is_primary: true,
                    auto_renew: true,
                    created_at: '2026-03-01T00:00:00.000Z',
                    updated_at: '2026-03-01T00:00:00.000Z',
                },
            ],
        })

        const domains = await getDealerDomains('dealer-1', supabase as never)

        expect(domains.map(domain => domain.id)).toEqual(['legacy-subdomain', 'dealer-domain-1'])
        expect(domains.find(domain => domain.id === 'dealer-domain-1')).toMatchObject({
            domain: 'bharat-hyundai.com',
            slug: 'bharat-hyundai',
            type: 'custom',
            status: 'active',
        })
    })

    it('treats slugs reserved in dealer_domains as unavailable', async () => {
        const supabase = createSupabaseMock({
            dealer_domains: [
                {
                    subdomain: 'reserved-site',
                    site_slug: null,
                },
            ],
            domains: [],
        })

        await expect(isSlugAvailable('reserved-site', supabase as never)).resolves.toBe(false)
    })
})
