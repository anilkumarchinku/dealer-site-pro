import { purchaseDomain, searchDomains } from '@/lib/services/domain-search-service'
import {
    clearCyeproSearchCache,
    fetchCyeproVehicles,
    forwardLeadToCyepro,
} from '@/lib/services/cyepro-service'
import { sendLeadSmsToDealer } from '@/lib/services/sms-service'

const originalFetch = global.fetch

describe('organized provider integrations', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        clearCyeproSearchCache()
        global.fetch = vi.fn()
        delete process.env.GODADDY_API_KEY
        delete process.env.GODADDY_API_SECRET
        delete process.env.MSG91_AUTH_KEY
        delete process.env.MSG91_LEAD_TEMPLATE_ID
        delete process.env.MSG91_SENDER_ID
    })

    afterEach(() => {
        global.fetch = originalFetch
        vi.useRealTimers()
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

    it('returns stale Cyepro inventory when a later provider call fails', async () => {
        vi.useFakeTimers()
        vi.setSystemTime(0)
        vi.mocked(global.fetch).mockResolvedValueOnce(
            new Response(JSON.stringify({
                vehicles: [{
                    id: 1,
                    make: 'Honda',
                    model: 'Activa',
                    vehicleManufactureYear: 2024,
                    customerSellingPrice: 90000,
                    kiloMeters: 120,
                    fuel: 'Petrol',
                    transmission: 'Automatic',
                    location: 'Hyderabad',
                    imageUrl: '',
                    variant: 'STD',
                    color: 'White',
                    regNumber: 'TS01AB1234',
                }],
                totalCount: 1,
                pageNumber: 1,
                pageSize: 30,
                totalPages: 1,
            }), { status: 200 })
        )

        const first = await fetchCyeproVehicles('api-key')
        expect(first?.vehicles).toHaveLength(1)

        vi.setSystemTime(70_000)
        vi.mocked(global.fetch).mockResolvedValueOnce(
            new Response(JSON.stringify({ message: 'failed' }), { status: 500 })
        )

        const fallback = await fetchCyeproVehicles('api-key')
        expect(fallback?.vehicles).toHaveLength(1)
        expect(vi.mocked(global.fetch)).toHaveBeenCalledTimes(2)
    })

    it('returns a failed Cyepro lead sync result on provider failure', async () => {
        vi.mocked(global.fetch).mockResolvedValue(
            new Response(JSON.stringify({ message: 'failed' }), { status: 500 })
        )

        await expect(forwardLeadToCyepro('api-key', {
            customerName: 'Asha',
            customerPhone: '9999999999',
            leadSource: 'Website',
        })).resolves.toMatchObject({
            success: false,
            status: 500,
            error: '{"message":"failed"}',
        })
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
