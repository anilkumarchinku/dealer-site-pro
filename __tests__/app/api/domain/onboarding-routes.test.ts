import { POST as startVerification } from '@/app/api/domain/verify-ownership/route'
import { GET as getVerificationStatus } from '@/app/api/domain/verification-status/[id]/route'
import { GET as getPropagationStatus } from '@/app/api/domain/propagation-status/[id]/route'
import { DomainVerificationService } from '@/lib/services/domain-verification'
import { requireAuth } from '@/lib/supabase-server'
import { NextRequest } from 'next/server'

const dnsMocks = vi.hoisted(() => ({
    resolve4: vi.fn(),
    resolveCname: vi.fn(),
}))

vi.mock('dns/promises', () => ({
    default: dnsMocks,
}))

vi.mock('@/lib/services/domain-verification', () => ({
    DomainVerificationService: {
        verifyDNSTXT: vi.fn(),
        verifyHTMLFile: vi.fn(),
    },
}))

vi.mock('@/lib/supabase-server', () => ({
    requireAuth: vi.fn(),
}))

const ONBOARDING_ID = '33333333-3333-4333-8333-333333333333'

function jsonRequest(body: unknown) {
    return new NextRequest('https://example.com/api/domain/verify-ownership', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

function createSupabaseMock(row: Record<string, unknown>) {
    const updates: unknown[] = []
    const supabase = {
        from: vi.fn(() => {
            const builder = {
                select: vi.fn(() => builder),
                eq: vi.fn(() => builder),
                update: vi.fn((payload: unknown) => {
                    updates.push(payload)
                    return builder
                }),
                single: vi.fn(async () => ({ data: row, error: null })),
                then(resolve: (value: { data: null; error: null }) => void) {
                    resolve({ data: null, error: null })
                },
            }
            return builder
        }),
        updates,
    }
    return supabase
}

function mockAuth(supabase: unknown) {
    vi.mocked(requireAuth).mockResolvedValue({
        user: { id: 'user-1' },
        supabase,
        errorResponse: null,
    } as never)
}

describe('domain onboarding routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        dnsMocks.resolve4.mockReset()
        dnsMocks.resolveCname.mockReset()
    })

    it('starts ownership verification and returns DNS TXT instructions', async () => {
        const supabase = createSupabaseMock({
            id: ONBOARDING_ID,
            domain_name: 'dealer.example.com',
            verification: {
                status: 'pending',
                token: 'dealersite-verify-token',
                attempts: 0,
            },
        })
        mockAuth(supabase)

        const response = await startVerification(jsonRequest({
            onboarding_id: ONBOARDING_ID,
            method: 'dns_txt',
        }))
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body).toMatchObject({
            success: true,
            onboarding_id: ONBOARDING_ID,
            method: 'dns_txt',
            instructions: {
                record_type: 'TXT',
                value: 'dealersite-verify-token',
            },
            current_state: 'verification_pending',
        })
        expect(supabase.updates[0]).toMatchObject({
            current_state: 'verification_pending',
            verification: {
                method: 'dns_txt',
                status: 'pending',
            },
        })
    })

    it('polls verification status and marks the onboarding verified', async () => {
        const supabase = createSupabaseMock({
            id: ONBOARDING_ID,
            domain_name: 'dealer.example.com',
            current_state: 'verification_pending',
            verification: {
                status: 'pending',
                method: 'dns_txt',
                token: 'dealersite-verify-token',
                attempts: 1,
                expires_at: new Date(Date.now() + 60_000).toISOString(),
            },
        })
        mockAuth(supabase)
        vi.mocked(DomainVerificationService.verifyDNSTXT).mockResolvedValue({
            verified: true,
            found_records: ['dealersite-verify-token'],
        })

        const response = await getVerificationStatus(
            new NextRequest(`https://example.com/api/domain/verification-status/${ONBOARDING_ID}`),
            { params: Promise.resolve({ id: ONBOARDING_ID }) }
        )
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body).toMatchObject({
            success: true,
            verified: true,
            attempts: 2,
            current_state: 'verification_complete',
        })
        expect(supabase.updates[0]).toMatchObject({
            current_state: 'verification_complete',
            verification: {
                status: 'verified',
                attempts: 2,
            },
        })
    })

    it('returns propagation status with record-level progress', async () => {
        const supabase = createSupabaseMock({
            id: ONBOARDING_ID,
            domain_name: 'dealer.example.com',
            verification: {
                token: 'dealersite-verify-token',
                method: 'dns_txt',
            },
            configuration: {
                deployment_route: 'full_domain',
            },
        })
        mockAuth(supabase)
        dnsMocks.resolve4.mockResolvedValue(['76.76.21.21'])
        dnsMocks.resolveCname.mockResolvedValue(['cname.vercel-dns.com'])
        vi.mocked(DomainVerificationService.verifyDNSTXT).mockResolvedValue({
            verified: true,
            found_records: ['dealersite-verify-token'],
        })

        const response = await getPropagationStatus(
            new NextRequest(`https://example.com/api/domain/propagation-status/${ONBOARDING_ID}`),
            { params: Promise.resolve({ id: ONBOARDING_ID }) }
        )
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body).toMatchObject({
            success: true,
            target_domain: 'dealer.example.com',
            propagation_status: {
                overall: {
                    fully_propagated: true,
                    checks_passed: 3,
                    total_checks: 3,
                    percentage: 100,
                },
                records: {
                    a_record: { propagated: true },
                    www_record: { propagated: true },
                    txt_record: { propagated: true },
                },
            },
        })
    })
})
