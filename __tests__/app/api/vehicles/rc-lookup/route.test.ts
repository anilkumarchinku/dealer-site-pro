import { NextRequest } from 'next/server'
import { POST } from '@/app/api/vehicles/rc-lookup/route'
import { externalApiFetch } from '@/lib/services/external-api-fetch'
import { requireAuth } from '@/lib/supabase-server'

vi.mock('@/lib/services/external-api-fetch', () => ({
    externalApiFetch: vi.fn(),
}))

vi.mock('@/lib/supabase-server', () => ({
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
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase: null,
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
})
