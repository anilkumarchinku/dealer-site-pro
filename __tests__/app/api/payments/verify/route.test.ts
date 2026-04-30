import { NextRequest } from 'next/server'
import { POST } from '@/app/api/payments/verify/route'
import { verifyPaymentSignature } from '@/lib/services/payment-service'
import { createAdminClient, createRouteClient, requireAuth } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

vi.mock('@/lib/services/payment-service', () => ({
    verifyPaymentSignature: vi.fn(),
}))

vi.mock('@/lib/supabase-server', () => ({
    createAdminClient: vi.fn(),
    createRouteClient: vi.fn(),
    requireAuth: vi.fn(),
}))

vi.mock('@/lib/utils/rate-limiter', () => ({
    rateLimitOrNull: vi.fn(),
}))

type IdempotencyRecord = {
    response: unknown
} | null

type SupabaseOptions = {
    existingRecord?: IdempotencyRecord
    existingRecordError?: { message: string } | null
}

function paymentRequest(body: unknown, idempotencyKey = 'idem_1') {
    return new NextRequest('https://example.com/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'idempotency-key': idempotencyKey,
        },
    })
}

function validBody() {
    return {
        orderId: 'order_1',
        paymentId: 'pay_1',
        signature: 'sig_1',
        subscriptionId: 'sub_1',
    }
}

function createSupabaseMock(options: SupabaseOptions = {}) {
    const inserts: { table: string; payload: Record<string, unknown> }[] = []
    const updates: { table: string; payload: Record<string, unknown> }[] = []

    const client = {
        from: vi.fn((table: string) => {
            const builder = {
                operation: '',
                insert: vi.fn(async (payload: Record<string, unknown>) => {
                    inserts.push({ table, payload })
                    return { error: null }
                }),
                update: vi.fn((payload: Record<string, unknown>) => {
                    updates.push({ table, payload })
                    builder.operation = 'update'
                    return builder
                }),
                select: vi.fn(() => builder),
                eq: vi.fn(() => builder),
                order: vi.fn(() => builder),
                limit: vi.fn(() => builder),
                maybeSingle: vi.fn(async () => {
                    if (table === 'payment_idempotency_log') {
                        return {
                            data: options.existingRecord ?? null,
                            error: options.existingRecordError ?? null,
                        }
                    }
                    return { data: null, error: null }
                }),
                single: vi.fn(async () => {
                    if (table === 'domain_subscriptions' && builder.operation === 'update') {
                        return { data: { domain_id: 'domain_1' }, error: null }
                    }
                    return { data: null, error: null }
                }),
                then: vi.fn((resolve: (value: { data: null; error: null }) => unknown) =>
                    resolve({ data: null, error: null })
                ),
            }
            return builder
        }),
    }

    return { client, inserts, updates }
}

describe('POST /api/payments/verify', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase: null,
            errorResponse: null,
        } as never)
        vi.mocked(rateLimitOrNull).mockResolvedValue(null)
    })

    it('returns cached failure for duplicate invalid signature attempts', async () => {
        const supabase = createSupabaseMock({
            existingRecord: {
                response: { success: false, error: 'Invalid signature' },
            },
        })
        vi.mocked(createRouteClient).mockResolvedValue(supabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'Invalid payment signature',
            idempotent: true,
        })
        expect(verifyPaymentSignature).not.toHaveBeenCalled()
        expect(supabase.inserts).toEqual([])
        expect(supabase.updates).toEqual([])
    })

    it('returns cached success for duplicate verified payments', async () => {
        const supabase = createSupabaseMock({
            existingRecord: {
                response: {
                    success: true,
                    message: 'Payment verified and subscription activated',
                },
            },
        })
        vi.mocked(createRouteClient).mockResolvedValue(supabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({
            success: true,
            message: 'Payment verified and subscription activated',
            idempotent: true,
        })
        expect(verifyPaymentSignature).not.toHaveBeenCalled()
        expect(supabase.inserts).toEqual([])
        expect(supabase.updates).toEqual([])
    })

    it('fails closed when an idempotency row cannot provide a cached outcome', async () => {
        const supabase = createSupabaseMock({
            existingRecord: { response: null },
        })
        vi.mocked(createRouteClient).mockResolvedValue(supabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(409)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'Payment verification result unavailable',
            idempotent: true,
        })
        expect(verifyPaymentSignature).not.toHaveBeenCalled()
        expect(supabase.inserts).toEqual([])
        expect(supabase.updates).toEqual([])
    })

    it('logs invalid signatures with the same public response returned to the client', async () => {
        const supabase = createSupabaseMock()
        vi.mocked(createRouteClient).mockResolvedValue(supabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)
        vi.mocked(verifyPaymentSignature).mockReturnValue(false)

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'Invalid payment signature',
        })
        expect(supabase.inserts).toEqual([
            {
                table: 'payment_idempotency_log',
                payload: expect.objectContaining({
                    idempotency_key: 'idem_1',
                    payment_id: 'pay_1',
                    response: {
                        success: false,
                        error: 'Invalid payment signature',
                    },
                }),
            },
        ])
        expect(supabase.updates).toEqual([])
    })

    it('does not process payments when the idempotency check fails', async () => {
        const supabase = createSupabaseMock({
            existingRecordError: { message: 'database unavailable' },
        })
        vi.mocked(createRouteClient).mockResolvedValue(supabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(500)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'Failed to verify payment status',
        })
        expect(verifyPaymentSignature).not.toHaveBeenCalled()
        expect(supabase.inserts).toEqual([])
        expect(supabase.updates).toEqual([])
    })
})
