import dns from 'dns/promises'
import { verifyCustomDomain } from '@/lib/services/dns-verification-service'

vi.mock('dns/promises', () => ({
    default: {
        resolve4: vi.fn(),
        resolveCname: vi.fn(),
    },
}))

const mockedDns = vi.mocked(dns)

describe('dns-verification-service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('requires both root A and www CNAME records to match the issued instructions', async () => {
        const cnameTarget = process.env.NEXT_PUBLIC_CNAME_TARGET ?? 'cname.vercel-dns.com'
        mockedDns.resolve4.mockResolvedValue(['1.1.1.1', '76.76.21.21'])
        mockedDns.resolveCname.mockResolvedValue([`${cnameTarget}.`])

        const result = await verifyCustomDomain('dealer.example.com')

        expect(result.allVerified).toBe(true)
        expect(mockedDns.resolve4).toHaveBeenCalledWith('dealer.example.com')
        expect(mockedDns.resolveCname).toHaveBeenCalledWith('www.dealer.example.com')
        expect(result.records).toMatchObject([
            { type: 'A', name: 'dealer.example.com', isVerified: true },
            { type: 'CNAME', name: 'www.dealer.example.com', isVerified: true },
        ])
    })

    it('does not verify when root A exists but www CNAME is missing', async () => {
        mockedDns.resolve4.mockResolvedValue(['76.76.21.21'])
        mockedDns.resolveCname.mockRejectedValue(new Error('not found'))

        const result = await verifyCustomDomain('dealer.example.com')

        expect(result.allVerified).toBe(false)
        expect(result.records).toMatchObject([
            { type: 'A', name: 'dealer.example.com', isVerified: true },
            { type: 'CNAME', name: 'www.dealer.example.com', isVerified: false },
        ])
    })
})
