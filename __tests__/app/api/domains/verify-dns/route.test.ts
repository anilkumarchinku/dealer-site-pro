import { POST } from '@/app/api/domains/verify-dns/route'
import { verifyCustomDomain } from '@/lib/services/dns-verification-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

vi.mock('@/lib/services/dns-verification-service', () => ({
    verifyCustomDomain: vi.fn(),
}))

vi.mock('@/lib/supabase-server', () => ({
    requireAuth: vi.fn(),
    requireDealerOwnership: vi.fn(),
}))

function dnsRequest(body: unknown) {
    return new Request('https://example.com/api/domains/verify-dns', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

function supabaseWithStoredDomain(customDomain: string) {
    const builder = {
        select: vi.fn(() => builder),
        eq: vi.fn(() => builder),
        single: vi.fn(async () => ({
            data: {
                id: 'domain_1',
                dealer_id: 'dealer_1',
                custom_domain: customDomain,
                subdomain_url: null,
                subdomain: null,
            },
            error: null,
        })),
    }
    return {
        from: vi.fn(() => builder),
    }
}

describe('POST /api/domains/verify-dns', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(requireDealerOwnership).mockResolvedValue({
            dealer: { id: 'dealer_1', slug: 'dealer' },
            errorResponse: null,
        } as never)
    })

    it('rejects verification when the requested domain does not match the stored domain row', async () => {
        const supabase = supabaseWithStoredDomain('victim.example')
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase,
            errorResponse: null,
        } as never)

        const response = await POST(dnsRequest({
            domainId: 'domain_1',
            dealerId: 'dealer_1',
            domain: 'controlled.example',
        }))

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'Domain name does not match the stored domain record',
        })
        expect(verifyCustomDomain).not.toHaveBeenCalled()
    })
})
