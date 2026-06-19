import { purchaseDomain, searchDomains } from '@/lib/services/domain-search-service'
import {
    fetchCyeproVehicles,
    forwardLeadToCyepro,
} from '@/lib/services/cyepro-service'
import { sendLeadSmsToDealer } from '@/lib/services/sms-service'

const originalFetch = global.fetch

describe('organized provider integrations', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        global.fetch = vi.fn()
        delete process.env.GODADDY_API_KEY
        delete process.env.GODADDY_API_SECRET
        delete process.env.MSG91_AUTH_KEY
        delete process.env.MSG91_LEAD_TEMPLATE_ID
        delete process.env.MSG91_SENDER_ID
    })

    afterEach(() => {
        global.fetch = originalFetch
        vi.restoreAllMocks()
    })

    it('keeps GoDaddy search deterministic when API keys are missing', async () => {
        const results = await searchDomains('abc motors')

        expect(results).toHaveLength(5)
        expect(results[0]).toMatchObject({
            domain: 'abcmotors.com',
            available: false,
            currency: 'INR',
            registrar: 'godaddy',
        })
        expect(global.fetch).not.toHaveBeenCalled()
    })

    it('keeps GoDaddy purchase mock behavior when API keys are missing', async () => {
        const result = await purchaseDomain('abcmotors.com', {
            name: 'ABC Motors',
            email: 'owner@example.com',
            phone: '9999999999',
            address: 'Road 1',
            city: 'Mumbai',
            state: 'MH',
            postalCode: '400001',
            country: 'IN',
        })

        expect(result).toMatchObject({
            success: true,
            orderId: expect.stringMatching(/^MOCK-/),
        })
        expect(global.fetch).not.toHaveBeenCalled()
    })

    it('keeps Cyepro vehicle fetch returning null on auth failure', async () => {
        vi.mocked(global.fetch).mockResolvedValue(
            new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
        )

        await expect(fetchCyeproVehicles('bad-key')).resolves.toBeNull()
    })

    it('keeps Cyepro lead forwarding non-blocking on provider failure', async () => {
        vi.mocked(global.fetch).mockResolvedValue(
            new Response(JSON.stringify({ message: 'failed' }), { status: 500 })
        )

        // Non-blocking contract: forwarding resolves (never throws) on a provider
        // failure. It now returns a typed result describing the failure instead of
        // void, so assert the result shape rather than undefined.
        await expect(forwardLeadToCyepro('api-key', {
            customerName: 'Asha',
            customerPhone: '9999999999',
            leadSource: 'Website',
        })).resolves.toMatchObject({ success: false, status: 500 })
    })

    it('skips SMS provider when MSG91 auth key is missing', async () => {
        await sendLeadSmsToDealer({
            dealerPhone: '9999999999',
            dealerName: 'ABC Motors',
            customerName: 'Asha',
            customerPhone: '8888888888',
        })

        expect(global.fetch).not.toHaveBeenCalled()
    })

    it('keeps SMS sending non-blocking on MSG91 provider failure', async () => {
        process.env.MSG91_AUTH_KEY = 'msg91-key'
        process.env.MSG91_LEAD_TEMPLATE_ID = 'template-1'
        vi.mocked(global.fetch).mockResolvedValue(
            new Response('provider failed', { status: 500 })
        )

        await expect(sendLeadSmsToDealer({
            dealerPhone: '9999999999',
            dealerName: 'ABC Motors',
            customerName: 'Asha',
            customerPhone: '8888888888',
        })).resolves.toBeUndefined()
    })
})
