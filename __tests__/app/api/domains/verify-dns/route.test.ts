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

function supabaseWithVerificationLogFailure() {
    const storedDomainBuilder = {
        select: vi.fn(() => storedDomainBuilder),
        eq: vi.fn(() => storedDomainBuilder),
        single: vi.fn(async () => ({
            data: {
                id: 'domain_1',
                dealer_id: 'dealer_1',
                custom_domain: 'dealer.example.com',
                subdomain_url: null,
                subdomain: null,
            },
            error: null,
        })),
    }
    const verificationBuilder = {
        insert: vi.fn(async () => ({
            error: { message: 'foreign key mismatch' },
        })),
    }
    const updateBuilder = {
        update: vi.fn(() => updateBuilder),
        eq: vi.fn(() => updateBuilder),
    }

    return {
        from: vi.fn((table: string) => {
            if (table === 'domain_verifications') return verificationBuilder
            if (table === 'dealer_domains' && storedDomainBuilder.single.mock.calls.length === 0) {
                return storedDomainBuilder
            }
            return updateBuilder
        }),
        verificationBuilder,
        updateBuilder,
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

    it('updates the domain status even when verification history logging fails', async () => {
        const supabase = supabaseWithVerificationLogFailure()
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase,
            errorResponse: null,
        } as never)
        vi.mocked(verifyCustomDomain).mockResolvedValue({
            success: true,
            allVerified: true,
            message: 'Domain verified successfully!',
            records: [
                {
                    type: 'A',
                    name: 'dealer.example.com',
                    expectedValue: '76.76.21.21',
                    actualValue: '76.76.21.21',
                    isVerified: true,
                },
                {
                    type: 'CNAME',
                    name: 'www.dealer.example.com',
                    expectedValue: 'cname.vercel-dns.com',
                    actualValue: 'cname.vercel-dns.com',
                    isVerified: true,
                },
            ],
        })

        const response = await POST(dnsRequest({
            domainId: 'domain_1',
            dealerId: 'dealer_1',
            domain: 'dealer.example.com',
        }))

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toMatchObject({
            success: true,
            verification: { allVerified: true },
        })
        expect(supabase.verificationBuilder.insert).toHaveBeenCalled()
        expect(supabase.updateBuilder.update).toHaveBeenCalledWith(expect.objectContaining({
            status: 'active',
            dns_verified: true,
        }))
    })
})
