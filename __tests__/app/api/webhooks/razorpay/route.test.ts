import { createHmac } from 'crypto'
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { POST } from '@/app/api/webhooks/razorpay/route'

vi.mock('@/lib/supabase-server', () => ({
    createAdminClient: vi.fn(),
}))

type SupabaseOptions = {
    duplicate?: boolean
    existingStatus?: 'processing' | 'processed' | 'failed'
    subscriptionDomainId?: string | null
}

function createSupabaseMock(options: SupabaseOptions = {}) {
    const inserts: { table: string; payload: unknown }[] = []
    const updates: { table: string; payload: Record<string, unknown> }[] = []

    const client = {
        from: vi.fn((table: string) => {
            const builder = {
                operation: '',
                insert: vi.fn(async (payload: unknown) => {
                    inserts.push({ table, payload })
                    if (table === 'webhook_events' && options.duplicate) {
                        return { error: { code: '23505', message: 'duplicate key value violates unique constraint' } }
                    }
                    return { error: null }
                }),
                update: vi.fn((payload: Record<string, unknown>) => {
                    updates.push({ table, payload })
                    builder.operation = 'update'
                    return builder
                }),
                select: vi.fn(() => builder),
                eq: vi.fn(() => builder),
                single: vi.fn(async () => {
                    if (table === 'webhook_events') {
                        return { data: { status: options.existingStatus ?? 'processed' }, error: null }
                    }
                    if (table === 'domain_subscriptions' && builder.operation === 'update') {
                        return { data: { domain_id: options.subscriptionDomainId ?? 'domain_1' }, error: null }
                    }
                    return { data: null, error: null }
                }),
            }
            return builder
        }),
    }

    return { client, inserts, updates }
}

function signedRequest(event: unknown, eventId = 'evt_1', signatureSecret = 'whsec_test') {
    const body = JSON.stringify(event)
    const signature = createHmac('sha256', signatureSecret)
        .update(body)
        .digest('hex')

    return new NextRequest('https://example.com/api/webhooks/razorpay', {
        method: 'POST',
        body,
        headers: {
            'x-razorpay-event-id': eventId,
            'x-razorpay-signature': signature,
        },
    })
}

describe('POST /api/webhooks/razorpay', () => {
    beforeEach(() => {
        process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_test'
        vi.clearAllMocks()
    })

    afterEach(() => {
        delete process.env.RAZORPAY_WEBHOOK_SECRET
    })

    it('rejects invalid signatures before opening the admin client', async () => {
        const response = await POST(new NextRequest('https://example.com/api/webhooks/razorpay', {
            method: 'POST',
            body: JSON.stringify({ event: 'subscription.activated', payload: {} }),
            headers: {
                'x-razorpay-event-id': 'evt_bad',
                'x-razorpay-signature': 'bad_signature',
            },
        }))

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: 'Invalid signature' })
        expect(createAdminClient).not.toHaveBeenCalled()
    })

    it('skips duplicate events using DB-backed idempotency', async () => {
        const supabase = createSupabaseMock({ duplicate: true, existingStatus: 'processed' })
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)

        const response = await POST(signedRequest({
            event: 'subscription.activated',
            payload: { subscription: { entity: { id: 'sub_1' } } },
        }, 'evt_duplicate'))

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ received: true, duplicate: true })
        expect(supabase.updates.some(update => update.table === 'domain_subscriptions')).toBe(false)
    })

    it('activates subscriptions and leaves domains pending DNS', async () => {
        const supabase = createSupabaseMock({ subscriptionDomainId: 'domain_1' })
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)

        const response = await POST(signedRequest({
            event: 'subscription.activated',
            payload: {
                subscription: {
                    entity: {
                        id: 'sub_1',
                        current_start: '2026-04-01T00:00:00.000Z',
                        current_end: '2026-05-01T00:00:00.000Z',
                    },
                },
            },
        }, 'evt_activate'))

        expect(response.status).toBe(200)
        expect(supabase.updates).toEqual(expect.arrayContaining([
            expect.objectContaining({
                table: 'domain_subscriptions',
                payload: expect.objectContaining({ status: 'active' }),
            }),
            expect.objectContaining({
                table: 'dealer_domains',
                payload: expect.objectContaining({
                    status: 'pending',
                    ssl_status: 'pending',
                }),
            }),
            expect.objectContaining({
                table: 'webhook_events',
                payload: expect.objectContaining({ status: 'processed' }),
            }),
        ]))
    })

    it('cancels subscriptions and suspends domains', async () => {
        const supabase = createSupabaseMock({ subscriptionDomainId: 'domain_1' })
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)

        const response = await POST(signedRequest({
            event: 'subscription.cancelled',
            payload: { subscription: { entity: { id: 'sub_1' } } },
        }, 'evt_cancel'))

        expect(response.status).toBe(200)
        expect(supabase.updates).toEqual(expect.arrayContaining([
            expect.objectContaining({
                table: 'domain_subscriptions',
                payload: expect.objectContaining({ status: 'cancelled' }),
            }),
            expect.objectContaining({
                table: 'dealer_domains',
                payload: { status: 'suspended' },
            }),
        ]))
    })

    it('marks subscription as past_due on payment failure', async () => {
        const supabase = createSupabaseMock()
        vi.mocked(createAdminClient).mockReturnValue(supabase.client as never)

        const response = await POST(signedRequest({
            event: 'payment.failed',
            payload: { payment: { entity: { subscription_id: 'sub_1' } } },
        }, 'evt_failed_payment'))

        expect(response.status).toBe(200)
        expect(supabase.updates).toEqual(expect.arrayContaining([
            expect.objectContaining({
                table: 'domain_subscriptions',
                payload: { status: 'past_due' },
            }),
        ]))
    })
})
