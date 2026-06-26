import { NextRequest, NextResponse } from 'next/server'
import { POST } from '@/app/api/payments/verify/route'
import { PLAN_PRICES_PAISE, verifyPaymentSignature } from '@/lib/services/payment-service'
import {
    createAdminClient,
    createRouteClient,
    requireAuth,
    requireDealerOwnership,
} from '@/lib/supabase-server'
import { fetchRazorpayPayment } from '@/lib/services/razorpay-service'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

vi.mock('@/lib/services/payment-service', async () => {
    const actual = await vi.importActual<typeof import('@/lib/services/payment-service')>(
        '@/lib/services/payment-service'
    )
    return {
        ...actual,
        verifyPaymentSignature: vi.fn(),
    }
})

vi.mock('@/lib/supabase-server', () => ({
    createAdminClient: vi.fn(),
    createRouteClient: vi.fn(),
    requireAuth: vi.fn(),
    requireDealerOwnership: vi.fn(),
}))

vi.mock('@/lib/services/razorpay-service', () => ({
    fetchRazorpayPayment: vi.fn(),
}))

vi.mock('@/lib/utils/rate-limiter', () => ({
    rateLimitOrNull: vi.fn(),
}))

type IdempotencyRecord = {
    response: unknown
} | null

type SubscriptionRow = {
    id: string
    dealer_id: string
    domain_id: string | null
    plan: string | null
    tier: string | null
    razorpay_subscription_id: string
} | null

type SupabaseOptions = {
    existingRecord?: IdempotencyRecord
    existingRecordError?: { message: string } | null
    // The row returned by the domain_subscriptions ownership/amount lookup (the
    // first `.single()` before any update). Defaults to a valid owned "pro" row.
    subscriptionRow?: SubscriptionRow
    subscriptionLookupError?: { message: string } | null
}

const DEFAULT_SUBSCRIPTION_ROW: SubscriptionRow = {
    id: 'dsub_1',
    dealer_id: 'dealer_1',
    domain_id: 'domain_1',
    plan: 'pro',
    tier: 'pro',
    razorpay_subscription_id: 'sub_1',
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

function capturedPayment(amount = PLAN_PRICES_PAISE.pro) {
    return {
        id: 'pay_1',
        status: 'captured',
        amount,
        currency: 'INR',
    }
}

function createSupabaseMock(options: SupabaseOptions = {}) {
    const inserts: { table: string; payload: Record<string, unknown> }[] = []
    const updates: { table: string; payload: Record<string, unknown> }[] = []

    const hasSubscriptionRowOption = 'subscriptionRow' in options
    const subscriptionRow = hasSubscriptionRowOption
        ? options.subscriptionRow ?? null
        : DEFAULT_SUBSCRIPTION_ROW

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
                    if (table === 'domain_subscriptions') {
                        // After an .update() the route re-selects the activated row.
                        if (builder.operation === 'update') {
                            return { data: { domain_id: 'domain_1' }, error: null }
                        }
                        // Otherwise this is the ownership/amount lookup.
                        return {
                            data: subscriptionRow,
                            error: options.subscriptionLookupError ?? null,
                        }
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
        // Default: caller owns the dealer behind the subscription.
        vi.mocked(requireDealerOwnership).mockResolvedValue({
            dealer: { id: 'dealer_1', slug: 'dealer-1' },
            errorResponse: null,
        } as never)
        // Default: provider confirms a captured payment for the pro plan price.
        vi.mocked(fetchRazorpayPayment).mockResolvedValue(capturedPayment() as never)
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
        // A bad signature must never reach ownership or provider checks.
        expect(requireDealerOwnership).not.toHaveBeenCalled()
        expect(fetchRazorpayPayment).not.toHaveBeenCalled()
    })

    it('returns 404 when the subscription row does not exist', async () => {
        const supabase = createSupabaseMock({ subscriptionRow: null })
        vi.mocked(createRouteClient).mockResolvedValue(supabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)
        vi.mocked(verifyPaymentSignature).mockReturnValue(true)

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'Subscription not found',
        })
        expect(requireDealerOwnership).not.toHaveBeenCalled()
        expect(fetchRazorpayPayment).not.toHaveBeenCalled()
        expect(supabase.updates).toEqual([])
    })

    it('returns 403 when the caller does not own the subscription dealer', async () => {
        const supabase = createSupabaseMock()
        vi.mocked(createRouteClient).mockResolvedValue(supabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)
        vi.mocked(verifyPaymentSignature).mockReturnValue(true)
        vi.mocked(requireDealerOwnership).mockResolvedValue({
            dealer: null,
            errorResponse: NextResponse.json(
                { error: 'Forbidden — you do not own this dealer account' },
                { status: 403 }
            ),
        } as never)

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(403)
        await expect(response.json()).resolves.toEqual({
            error: 'Forbidden — you do not own this dealer account',
        })
        expect(requireDealerOwnership).toHaveBeenCalledWith(
            supabase.client,
            'user_1',
            'dealer_1'
        )
        // Ownership failure happens before the provider amount check and any write.
        expect(fetchRazorpayPayment).not.toHaveBeenCalled()
        expect(supabase.updates).toEqual([])
        expect(supabase.inserts).toEqual([])
    })

    it('returns 400 when the captured amount does not match the plan price', async () => {
        const supabase = createSupabaseMock()
        vi.mocked(createRouteClient).mockResolvedValue(supabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)
        vi.mocked(verifyPaymentSignature).mockReturnValue(true)
        vi.mocked(fetchRazorpayPayment).mockResolvedValue(
            capturedPayment(PLAN_PRICES_PAISE.pro - 1) as never
        )

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'Payment amount does not match the plan price',
        })
        expect(fetchRazorpayPayment).toHaveBeenCalledWith('pay_1')
        // No activation when the amount is wrong.
        expect(supabase.updates).toEqual([])
    })

    it('returns 400 when the payment has not been captured', async () => {
        const supabase = createSupabaseMock()
        vi.mocked(createRouteClient).mockResolvedValue(supabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)
        vi.mocked(verifyPaymentSignature).mockReturnValue(true)
        vi.mocked(fetchRazorpayPayment).mockResolvedValue({
            ...capturedPayment(),
            status: 'authorized',
        } as never)

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'Payment has not been captured',
        })
        expect(supabase.updates).toEqual([])
    })

    it('uses the admin client for idempotency reads and writes', async () => {
        const routeSupabase = createSupabaseMock()
        const adminSupabase = createSupabaseMock()
        vi.mocked(createRouteClient).mockResolvedValue(routeSupabase.client as never)
        vi.mocked(createAdminClient).mockReturnValue(adminSupabase.client as never)
        vi.mocked(verifyPaymentSignature).mockReturnValue(true)

        const response = await POST(paymentRequest(validBody()))

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({
            success: true,
            message: 'Payment verified and PRO custom domain access activated',
        })
        // Ownership + captured-amount checks ran against the (priced) pro plan.
        expect(requireDealerOwnership).toHaveBeenCalledWith(
            routeSupabase.client,
            'user_1',
            'dealer_1'
        )
        expect(fetchRazorpayPayment).toHaveBeenCalledWith('pay_1')
        expect(adminSupabase.client.from).toHaveBeenCalledWith('payment_idempotency_log')
        expect(adminSupabase.client.from.mock.calls.filter(([table]) => table === 'payment_idempotency_log')).toHaveLength(2)
        expect(routeSupabase.client.from).not.toHaveBeenCalledWith('payment_idempotency_log')
        expect(routeSupabase.updates).toEqual([
            {
                table: 'domain_subscriptions',
                payload: { status: 'active' },
            },
            {
                table: 'dealer_domains',
                payload: expect.objectContaining({
                    status: 'pending',
                    ssl_status: 'pending',
                }),
            },
        ])
        expect(adminSupabase.inserts).toEqual([
            {
                table: 'payment_idempotency_log',
                payload: expect.objectContaining({
                    idempotency_key: 'idem_1',
                    payment_id: 'pay_1',
                    subscription_id: 'sub_1',
                    response: {
                        success: true,
                        message: 'Payment verified and PRO custom domain access activated',
                    },
                }),
            },
        ])
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
