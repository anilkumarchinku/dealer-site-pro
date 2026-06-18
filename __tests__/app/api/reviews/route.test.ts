import { NextRequest, NextResponse } from 'next/server'
import { PATCH } from '@/app/api/reviews/route'
import { createAdminClient, requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

vi.mock('@/lib/supabase-server', () => ({
    createAdminClient: vi.fn(),
    requireAuth: vi.fn(),
    requireDealerOwnership: vi.fn(),
}))

vi.mock('@/lib/utils/logger', () => ({
    logger: {
        error: vi.fn(),
    },
}))

function patchRequest(body: unknown) {
    return new NextRequest('https://example.com/api/reviews', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

type ReviewAdminOptions = {
    review?: { id: string; dealer_id: string } | null
    reviewError?: { message: string } | null
}

function createReviewAdminMock(options: ReviewAdminOptions = {}) {
    const updates: unknown[] = []
    const builder = {
        select: vi.fn(() => builder),
        eq: vi.fn(() => builder),
        single: vi.fn(async () => ({
            data: options.review === undefined
                ? { id: 'review_1', dealer_id: 'dealer_1' }
                : options.review,
            error: options.reviewError ?? null,
        })),
        update: vi.fn((payload: unknown) => {
            updates.push(payload)
            return builder
        }),
        then: vi.fn((resolve: (value: { error: null }) => unknown) => resolve({ error: null })),
    }

    return {
        client: {
            from: vi.fn(() => builder),
        },
        updates,
    }
}

describe('PATCH /api/reviews', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase: { from: vi.fn() },
            errorResponse: null,
        } as never)
    })

    it('blocks review approval when the signed-in user does not own the dealer', async () => {
        vi.mocked(requireDealerOwnership).mockResolvedValue({
            dealer: null,
            errorResponse: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
        } as never)

        const response = await PATCH(patchRequest({
            review_id: 'review_1',
            dealer_id: 'dealer_1',
            action: 'approve',
        }))

        expect(response.status).toBe(403)
        expect(requireDealerOwnership).toHaveBeenCalledWith(
            expect.anything(),
            'user_1',
            'dealer_1'
        )
        expect(createAdminClient).not.toHaveBeenCalled()
    })

    it('does not approve a review outside the owned dealer', async () => {
        const admin = createReviewAdminMock({ review: null })
        vi.mocked(createAdminClient).mockReturnValue(admin.client as never)
        vi.mocked(requireDealerOwnership).mockResolvedValue({
            dealer: { id: 'dealer_1', slug: 'dealer' },
            errorResponse: null,
        } as never)

        const response = await PATCH(patchRequest({
            review_id: 'review_2',
            dealer_id: 'dealer_1',
            action: 'approve',
        }))

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({
            error: 'Review not found or access denied',
        })
        expect(admin.updates).toEqual([])
    })

    it('allows the owning dealer to approve their own review', async () => {
        const admin = createReviewAdminMock()
        vi.mocked(createAdminClient).mockReturnValue(admin.client as never)
        vi.mocked(requireDealerOwnership).mockResolvedValue({
            dealer: { id: 'dealer_1', slug: 'dealer' },
            errorResponse: null,
        } as never)

        const response = await PATCH(patchRequest({
            review_id: 'review_1',
            dealer_id: 'dealer_1',
            action: 'approve',
        }))

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({
            success: true,
            review: { id: 'review_1', dealer_id: 'dealer_1' },
        })
        expect(requireDealerOwnership).toHaveBeenCalledWith(
            expect.anything(),
            'user_1',
            'dealer_1'
        )
        expect(admin.updates).toEqual([expect.objectContaining({
            is_approved: true,
            moderation_status: 'approved',
            show_on_homepage: true,
            updated_at: expect.any(String),
        })])
    })
})
