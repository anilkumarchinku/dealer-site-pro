import { NextRequest, NextResponse } from 'next/server'
import { GET, PATCH } from '@/app/api/leads/route'
import { createAdminClient, getDealerForUser, requireAuth } from '@/lib/supabase-server'

vi.mock('@/lib/supabase-server', () => ({
    createAdminClient: vi.fn(),
    getDealerForUser: vi.fn(),
    requireAuth: vi.fn(),
}))

vi.mock('@/lib/services/sms-service', () => ({
    sendLeadSmsToDealer: vi.fn(),
}))

vi.mock('@/lib/services/cyepro-service', () => ({
    forwardLeadToCyepro: vi.fn(),
}))

vi.mock('@/lib/services/email-service', () => ({
    sendLeadConfirmationEmail: vi.fn(),
    sendLeadNotificationEmail: vi.fn(),
}))

vi.mock('@/lib/utils/logger', () => ({
    logger: {
        error: vi.fn(),
        warn: vi.fn(),
    },
}))

const VALID_LEAD_ID = '11111111-1111-4111-8111-111111111111'

function patchRequest(body: unknown) {
    return new NextRequest('https://example.com/api/leads', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

function mockAuthenticatedDealer(routeSupabase: unknown = { from: vi.fn() }) {
    vi.mocked(requireAuth).mockResolvedValue({
        user: { id: 'user_1' },
        supabase: routeSupabase,
        errorResponse: null,
    } as never)
    vi.mocked(getDealerForUser).mockResolvedValue({ id: 'dealer_1', slug: 'dealer-one' } as never)
    return routeSupabase
}

type LeadAdminOptions = {
    leads?: unknown[]
    listError?: { message: string } | null
    updatedLead?: unknown | null
    updateError?: { message: string } | null
}

function createLeadAdminMock(options: LeadAdminOptions = {}) {
    const updates: unknown[] = []
    const eqCalls: Array<[string, unknown]> = []
    const selectCalls: string[] = []
    const builder = {
        select: vi.fn((columns?: string) => {
            if (columns) selectCalls.push(columns)
            return builder
        }),
        eq: vi.fn((column: string, value: unknown) => {
            eqCalls.push([column, value])
            return builder
        }),
        order: vi.fn(async () => ({
            data: options.leads ?? [],
            error: options.listError ?? null,
        })),
        update: vi.fn((payload: unknown) => {
            updates.push(payload)
            return builder
        }),
        maybeSingle: vi.fn(async () => ({
            data: options.updatedLead === undefined ? { id: VALID_LEAD_ID } : options.updatedLead,
            error: options.updateError ?? null,
        })),
    }

    return {
        client: {
            from: vi.fn(() => builder),
        },
        eqCalls,
        selectCalls,
        updates,
    }
}

describe('/api/leads admin access', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('lists only the signed-in dealer leads', async () => {
        const lead = {
            id: VALID_LEAD_ID,
            dealer_id: 'dealer_1',
            customer_name: 'Ravi',
            customer_email: null,
            customer_phone: '9876543210',
            lead_type: 'inquiry',
            vehicle_id: null,
            vehicle_interest: 'Used Swift',
            source: 'website',
            utm_source: 'https://dealer.example/cars/used-swift',
            message: null,
            status: 'new',
            cyepro_sync_status: 'pending',
            cyepro_error: null,
            created_at: '2026-06-22T10:00:00.000Z',
            updated_at: '2026-06-22T10:00:00.000Z',
        }
        const routeDb = createLeadAdminMock({ leads: [lead] })
        const routeSupabase = mockAuthenticatedDealer(routeDb.client)

        const response = await GET()

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ leads: [lead] })
        expect(getDealerForUser).toHaveBeenCalledWith(routeSupabase, 'user_1')
        expect(createAdminClient).not.toHaveBeenCalled()
        expect(routeDb.client.from).toHaveBeenCalledWith('leads')
        expect(routeDb.selectCalls[0]).not.toContain('cyepro_sync_status')
        expect(routeDb.selectCalls[0]).not.toContain('cyepro_error')
        expect(routeDb.eqCalls).toContainEqual(['dealer_id', 'dealer_1'])
    })

    it('uses the authenticated route client when no service-role key is configured', async () => {
        const originalServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        delete process.env.SUPABASE_SERVICE_ROLE_KEY

        try {
            const routeDb = createLeadAdminMock({ leads: [] })
            mockAuthenticatedDealer(routeDb.client)

            const response = await GET()

            expect(response.status).toBe(200)
            await expect(response.json()).resolves.toEqual({ leads: [] })
            expect(createAdminClient).not.toHaveBeenCalled()
            expect(routeDb.client.from).toHaveBeenCalledWith('leads')
            expect(routeDb.eqCalls).toContainEqual(['dealer_id', 'dealer_1'])
        } finally {
            if (originalServiceKey === undefined) {
                delete process.env.SUPABASE_SERVICE_ROLE_KEY
            } else {
                process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceKey
            }
        }
    })

    it('scopes status updates by lead id and signed-in dealer id', async () => {
        const routeDb = createLeadAdminMock()
        mockAuthenticatedDealer(routeDb.client)

        const response = await PATCH(patchRequest({
            id: VALID_LEAD_ID,
            status: 'contacted',
        }))

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ success: true })
        expect(createAdminClient).not.toHaveBeenCalled()
        expect(routeDb.updates).toEqual([expect.objectContaining({
            status: 'contacted',
            updated_at: expect.any(String),
        })])
        expect(routeDb.eqCalls).toContainEqual(['id', VALID_LEAD_ID])
        expect(routeDb.eqCalls).toContainEqual(['dealer_id', 'dealer_1'])
    })

    it('does not update a lead outside the signed-in dealer account', async () => {
        const routeDb = createLeadAdminMock({ updatedLead: null })
        mockAuthenticatedDealer(routeDb.client)

        const response = await PATCH(patchRequest({
            id: VALID_LEAD_ID,
            status: 'contacted',
        }))

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ error: 'Lead not found' })
        expect(createAdminClient).not.toHaveBeenCalled()
    })

    it('does not query with the service role when the user has no dealer account', async () => {
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase: { from: vi.fn() },
            errorResponse: null,
        } as never)
        vi.mocked(getDealerForUser).mockResolvedValue(null)

        const response = await GET()

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ error: 'Dealer account not found' })
        expect(createAdminClient).not.toHaveBeenCalled()
    })
})
