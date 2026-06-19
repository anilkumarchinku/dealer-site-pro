import { NextRequest } from 'next/server'
import { POST } from '@/app/api/vehicles/rc-lookup/route'
import { externalApiFetch } from '@/lib/services/external-api-fetch'
import { createAdminClient, requireAuth } from '@/lib/supabase-server'

vi.mock('@/lib/services/external-api-fetch', () => ({
    externalApiFetch: vi.fn(),
}))

vi.mock('@/lib/supabase-server', () => ({
    createAdminClient: vi.fn(),
    requireAuth: vi.fn(),
}))

function rcRequest(rc: string) {
    return new NextRequest('https://example.com/api/vehicles/rc-lookup', {
        method: 'POST',
        body: JSON.stringify({ rc }),
        headers: { 'Content-Type': 'application/json' },
    })
}

describe('POST /api/vehicles/rc-lookup', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const dealerBuilder = {
            select: vi.fn(() => dealerBuilder),
            eq: vi.fn(() => dealerBuilder),
            single: vi.fn(async () => ({ data: null, error: null })),
        }
        vi.mocked(createAdminClient).mockReturnValue({
            from: vi.fn(() => dealerBuilder),
        } as never)
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase: { functions: { invoke: vi.fn() } },
            errorResponse: null,
        } as never)
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    it('does not return demo RC data in production when the provider is not configured', async () => {
        vi.stubEnv('NODE_ENV', 'production')
        vi.stubEnv('RC_LOOKUP_PROVIDER', 'mock')
        vi.stubEnv('RAPIDOR_API_KEY', '')

        const response = await POST(rcRequest('MH01AB1234'))

        expect(response.status).toBe(503)
        await expect(response.json()).resolves.toEqual({
            error: 'RC lookup provider is not configured',
        })
        expect(externalApiFetch).not.toHaveBeenCalled()
    })

    it('calls the Supabase Surepass Edge Function for a configured provider', async () => {
        vi.stubEnv('NODE_ENV', 'production')
        vi.stubEnv('RC_LOOKUP_PROVIDER', 'surepass')

        const invoke = vi.fn().mockResolvedValue({
            error: null,
            data: {
                success: true,
                data: {
                    rc_number: 'TS08EB9049',
                    owner_name: 'Test Owner',
                    chassis_number: 'MA3JMTB1SPB851591',
                    engine_number: 'K10CNC265773',
                    make_model: 'MARUTI SUZUKI INDIA LTD SWIFT',
                    challan_count: 1,
                    challan_status: '1 pending challan(s) found',
                },
            },
        })
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase: { functions: { invoke } },
            errorResponse: null,
        } as never)

        const response = await POST(rcRequest('TS08 EB 9049'))
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.success).toBe(true)
        expect(body.cached).toBe(false)
        expect(body.data).toMatchObject({
            rc_number: 'TS08EB9049',
            owner_name: 'Test Owner',
            chassis_number: 'MA3JMTB1SPB851591',
            engine_number: 'K10CNC265773',
            make_model: 'MARUTI SUZUKI INDIA LTD SWIFT',
            challan_count: 1,
            challan_status: '1 pending challan(s) found',
        })

        expect(invoke).toHaveBeenCalledTimes(1)
        expect(invoke).toHaveBeenCalledWith('surepass-rc-lookup', {
            body: { rc: 'TS08EB9049' },
        })
        expect(externalApiFetch).not.toHaveBeenCalled()
    })
})
