import { NextResponse } from 'next/server'
import { getDealerForUser, requireAuth } from '@/lib/supabase-server'
import { requireDealerForRoute } from '@/lib/services/dealer-route-auth-service'

vi.mock('@/lib/supabase-server', () => ({
    getDealerForUser: vi.fn(),
    requireAuth: vi.fn(),
}))

describe('requireDealerForRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns the existing auth error response unchanged', async () => {
        const errorResponse = NextResponse.json({ error: 'Unauthorized — please sign in' }, { status: 401 })
        vi.mocked(requireAuth).mockResolvedValue({
            user: null,
            supabase: null,
            errorResponse,
        })

        const result = await requireDealerForRoute({ body: { error: 'Dealer not found' } })

        expect(result.errorResponse).toBe(errorResponse)
        expect(getDealerForUser).not.toHaveBeenCalled()
    })

    it('returns the configured not-found response when the user has no dealer', async () => {
        const supabase = { from: vi.fn() } as never
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase,
            errorResponse: null,
        })
        vi.mocked(getDealerForUser).mockResolvedValue(null)

        const result = await requireDealerForRoute({
            body: { error: 'No dealer profile found' },
            status: 404,
        })

        expect(result.errorResponse?.status).toBe(404)
        await expect(result.errorResponse?.json()).resolves.toEqual({ error: 'No dealer profile found' })
    })

    it('returns a full authenticated dealer context on success', async () => {
        const supabase = { from: vi.fn() } as never
        const dealer = { id: 'dealer_1', slug: 'dealer-one' }
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1', email: 'owner@example.com' },
            supabase,
            errorResponse: null,
        })
        vi.mocked(getDealerForUser).mockResolvedValue(dealer)

        const result = await requireDealerForRoute({ body: { error: 'Dealer not found' } })

        expect(result).toMatchObject({
            user: { id: 'user_1', email: 'owner@example.com' },
            supabase,
            dealer,
        })
    })
})
