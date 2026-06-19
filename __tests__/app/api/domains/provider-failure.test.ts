import { POST as connectCustomDomain } from '@/app/api/domains/connect-custom/route'
import { POST as removeCustomDomain } from '@/app/api/domains/remove-custom/route'
import { recordDomainDeploymentOperation } from '@/lib/services/domain-deployment-operation-service'
import { isValidDomain } from '@/lib/services/dns-verification-service'
import { addDomainToProject, registerDomainOnMainProject, removeDomainFromMainProject, removeDomainFromProject } from '@/lib/services/vercel-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

vi.mock('@/lib/supabase-server', () => ({
    requireAuth: vi.fn(),
    requireDealerOwnership: vi.fn(),
}))

vi.mock('@/lib/services/domain-deployment-operation-service', () => ({
    recordDomainDeploymentOperation: vi.fn(),
}))

vi.mock('@/lib/services/dns-verification-service', () => ({
    isValidDomain: vi.fn(),
    verifyCustomDomain: vi.fn(),
}))

vi.mock('@/lib/services/vercel-service', () => ({
    addDomainToProject: vi.fn(),
    registerDomainOnMainProject: vi.fn(),
    removeDomainFromMainProject: vi.fn(),
    removeDomainFromProject: vi.fn(),
}))

function jsonRequest(body: unknown) {
    return new Request('https://example.com/api/domains', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

function createConnectSupabaseMock() {
    const inserts: unknown[] = []
    return {
        from: vi.fn((table: string) => {
            const builder = {
                operation: '',
                insert: vi.fn((payload: unknown) => {
                    builder.operation = 'insert'
                    inserts.push(payload)
                    return builder
                }),
                update: vi.fn(() => builder),
                select: vi.fn(() => builder),
                eq: vi.fn(() => builder),
                single: vi.fn(async () => {
                    if (table === 'dealer_domains' && builder.operation === 'insert') {
                        return {
                            data: {
                                id: 'domain_1',
                                dealer_id: 'dealer_1',
                                custom_domain: 'dealer.example.com',
                                status: 'pending',
                            },
                            error: null,
                        }
                    }
                    if (table === 'dealer_domains') {
                        return { data: null, error: null }
                    }
                    if (table === 'dealers') {
                        return {
                            data: {
                                sells_new_cars: false,
                                sells_used_cars: true,
                                slug: 'dealer-one',
                            },
                            error: null,
                        }
                    }
                    return { data: null, error: null }
                }),
            }
            return builder
        }),
        inserts,
    }
}

function createRemoveSupabaseMock(dbError: { message: string } | null = null) {
    return {
        from: vi.fn((table: string) => {
            const builder = {
                error: dbError,
                select: vi.fn(() => builder),
                delete: vi.fn(() => builder),
                eq: vi.fn(() => builder),
                single: vi.fn(async () => {
                    if (table === 'dealers') {
                        return {
                            data: {
                                sells_new_cars: false,
                                sells_used_cars: true,
                                slug: 'dealer-one',
                            },
                            error: null,
                        }
                    }
                    return { data: null, error: null }
                }),
            }
            return builder
        }),
    }
}

describe('domain provider failure behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(requireDealerOwnership).mockResolvedValue({
            dealer: { id: 'dealer_1', slug: 'dealer-one' },
            errorResponse: null,
        })
        vi.mocked(recordDomainDeploymentOperation).mockResolvedValue(undefined)
        vi.mocked(isValidDomain).mockReturnValue({ valid: true })
    })

    it('keeps connect-custom successful when Vercel registration fails after DB save', async () => {
        const supabase = createConnectSupabaseMock()
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase: supabase as never,
            errorResponse: null,
        })
        vi.mocked(registerDomainOnMainProject).mockRejectedValue(new Error('Vercel unavailable'))

        const response = await connectCustomDomain(jsonRequest({
            dealerId: 'dealer_1',
            customDomain: 'HTTPS://WWW.Dealer.Example.com/path',
        }))

        await expect(response.json()).resolves.toMatchObject({
            success: true,
            vercelRegistered: false,
        })
        expect(response.status).toBe(200)
        expect(supabase.inserts[0]).toMatchObject({
            custom_domain: 'dealer.example.com',
        })
        expect(registerDomainOnMainProject).toHaveBeenCalledWith('dealer.example.com')
        expect(addDomainToProject).not.toHaveBeenCalled()
        expect(recordDomainDeploymentOperation).toHaveBeenCalledWith(expect.objectContaining({
            operation: 'custom_domain_connect',
            status: 'provider_failed',
            providerStep: 'vercel',
        }))
    })

    it('keeps remove-custom successful when Vercel removal fails after DB delete', async () => {
        const supabase = createRemoveSupabaseMock()
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase: supabase as never,
            errorResponse: null,
        })
        vi.mocked(removeDomainFromMainProject).mockRejectedValue(new Error('Vercel unavailable'))

        const response = await removeCustomDomain(jsonRequest({
            dealerId: 'dealer_1',
            domainId: 'domain_1',
            domain: 'dealer.example.com',
        }))

        await expect(response.json()).resolves.toEqual({ success: true })
        expect(response.status).toBe(200)
        expect(removeDomainFromMainProject).toHaveBeenCalledWith('dealer.example.com')
        expect(removeDomainFromProject).not.toHaveBeenCalled()
        expect(recordDomainDeploymentOperation).toHaveBeenCalledWith(expect.objectContaining({
            operation: 'custom_domain_remove',
            status: 'provider_failed',
            providerStep: 'vercel',
        }))
    })

    it('removes every dealer custom domain from the main Vercel project', async () => {
        const supabase = {
            from: vi.fn((table: string) => {
                const builder = {
                    select: vi.fn(() => builder),
                    delete: vi.fn(() => builder),
                    eq: vi.fn(() => builder),
                    single: vi.fn(async () => {
                        if (table === 'dealers') {
                            return {
                                data: {
                                    sells_new_cars: true,
                                    sells_used_cars: false,
                                    slug: 'dealer-one',
                                },
                                error: null,
                            }
                        }
                        return { data: null, error: null }
                    }),
                }
                return builder
            }),
        }
        vi.mocked(requireAuth).mockResolvedValue({
            user: { id: 'user_1' },
            supabase: supabase as never,
            errorResponse: null,
        })

        const response = await removeCustomDomain(jsonRequest({
            dealerId: 'dealer_1',
            domainId: 'domain_1',
            domain: 'dealer.example.com',
        }))

        await expect(response.json()).resolves.toEqual({ success: true })
        expect(response.status).toBe(200)
        expect(removeDomainFromMainProject).toHaveBeenCalledWith('dealer.example.com')
        expect(removeDomainFromProject).not.toHaveBeenCalled()
    })
})
