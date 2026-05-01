import { POST } from '@/app/api/payments/create-subscription/route'
import { createDomainSubscription } from '@/lib/services/payment-service'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'
import { NextRequest } from 'next/server'

vi.mock('@/lib/services/payment-service', () => ({
    createDomainSubscription: vi.fn(),
}))

vi.mock('@/lib/utils/rate-limiter', () => ({
    rateLimitOrNull: vi.fn(),
}))

vi.mock('@/lib/supabase-server', () => ({
    requireAuth: vi.fn(),
    requireDealerOwnership: vi.fn(),
}))

const DEALER_ID = '11111111-1111-4111-8111-111111111111'
const DOMAIN_ID = '22222222-2222-4222-8222-222222222222'

function jsonRequest(body: unknown) {
    return new NextRequest('https://example.com/api/payments/create-subscription', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

function createSupabaseMock() {
    const calls: string[] = []
    const supabase = {
        from: vi.fn((table: string) => {
            calls.push(table)
            const builder = {
                insertPayload: null as unknown,
                select: vi.fn(() => builder),
                eq: vi.fn(() => builder),
                insert: vi.fn((payload: unknown) => {
                    builder.insertPayload = payload
                    return builder
                }),
                single: vi.fn(async () => {
                    if (table === 'dealer_domains') {
                        return { data: { id: DOMAIN_ID }, error: null }
                    }
                    if (table === 'domains') {
                        return { data: null, error: { code: 'PGRST116' } }
                    }
                    if (table === 'domain_subscriptions') {
                        return {
                            data: {
                                id: 'sub_db_1',
                                dealer_id: DEALER_ID,
                                domain_id: DOMAIN_ID,
                                plan: 'pro',
                                status: 'trialing',
                            },
                            error: null,
                        }
                    }
                    return { data: null, error: null }
                }),
            }
            return builder
        }),
        calls,
    }
    return supabase
}

describe('POST /api/payments/create-subscription', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(rateLimitOrNull).mockResolvedValue(null)
        vi.mocked(requireDealerOwnership).mockResolvedValue({
            dealer: { id: DEALER_ID, slug: 'dealer-one' },
            errorResponse: null,
        } as never)
        vi.mocked(createDomainSubscription).mockResolvedValue({
            success: true,
            subscriptionId: 'sub_razorpay_1',
            orderId: 'sub_razorpay_1',
        })
    })

    it('creates subscriptions for domains stored in dealer_domains', async () => {
        const supabase = createSupabaseMock()
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user-1' },
            supabase,
            errorResponse: null,
        } as never)

        const response = await POST(jsonRequest({
            dealerId: DEALER_ID,
            domainId: DOMAIN_ID,
            tier: 'pro',
        }))
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body).toMatchObject({
            success: true,
            subscriptionId: 'sub_razorpay_1',
            subscription: {
                domain_id: DOMAIN_ID,
                dealer_id: DEALER_ID,
            },
        })
        expect(createDomainSubscription).toHaveBeenCalledWith({
            dealerId: DEALER_ID,
            tier: 'pro',
            domainId: DOMAIN_ID,
        })
        expect(supabase.calls).not.toContain('domains')
    })
})
