import { GET } from '@/app/api/dashboard/catalog/route'
import { getDealerForUser, requireAuth } from '@/lib/supabase-server'

vi.mock('@/lib/supabase-server', () => ({
    createAdminClient: vi.fn(),
    getDealerForUser: vi.fn(),
    requireAuth: vi.fn(),
}))

type QueryResult = { data: unknown; error: unknown }

function chain(result: QueryResult) {
    const builder = {
        select: vi.fn(() => builder),
        eq: vi.fn(() => builder),
        ilike: vi.fn(() => builder),
        order: vi.fn(() => builder),
        limit: vi.fn(() => builder),
        single: vi.fn(async () => result),
        maybeSingle: vi.fn(async () => result),
        then: (resolve: (value: QueryResult) => unknown) => resolve(result),
    }
    return builder
}

describe('GET /api/dashboard/catalog', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('loads selected OEMs from the public dealer brand read model when dealer_brands is not readable', async () => {
        const supabase = {
            from: vi.fn((table: string) => {
                if (table === 'dealers') {
                    return chain({ data: { id: 'dealer-1', brands: [] }, error: null })
                }
                if (table === 'dealer_brands') {
                    return chain({ data: null, error: { message: 'permission denied' } })
                }
                if (table === 'public_dealer_site_brands') {
                    return chain({
                        data: [
                            { brand_name: 'Jaguar', vehicle_type: 'cars', is_primary: true },
                            { brand_name: 'Bentley', vehicle_type: 'cars', is_primary: false },
                            { brand_name: 'Volkswagen', vehicle_type: 'cars', is_primary: false },
                        ],
                        error: null,
                    })
                }
                if (table === 'car_catalog') {
                    return chain({ data: [], error: null })
                }
                throw new Error(`Unexpected table ${table}`)
            }),
        }

        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user-1' },
            supabase,
            errorResponse: null,
        } as never)
        vi.mocked(getDealerForUser).mockResolvedValue({ id: 'dealer-1', slug: 'singh-auto-dealers' })

        const response = await GET()
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.brands).toEqual(expect.arrayContaining([
            expect.objectContaining({ brand: 'Jaguar', category: '4w' }),
            expect.objectContaining({ brand: 'Bentley', category: '4w' }),
            expect.objectContaining({ brand: 'Volkswagen', category: '4w' }),
        ]))
    })
})
