import { NextRequest } from 'next/server'
import { POST } from '@/app/api/vehicles/decode-vin/route'
import { ExternalApiError, externalApiFetch } from '@/lib/services/external-api-fetch'

vi.mock('@/lib/services/external-api-fetch', async () => {
    const actual = await vi.importActual<typeof import('@/lib/services/external-api-fetch')>('@/lib/services/external-api-fetch')
    return {
        ...actual,
        externalApiFetch: vi.fn(),
    }
})

function vinRequest(body: unknown) {
    return new NextRequest('https://example.com/api/vehicles/decode-vin', {
        method:  'POST',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

describe('POST /api/vehicles/decode-vin', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('rejects invalid VIN values before calling the provider', async () => {
        const response = await POST(vinRequest({ vin: 'ABC123' }))

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error:   'VIN must be 17 characters and cannot contain I, O, or Q',
        })
        expect(externalApiFetch).not.toHaveBeenCalled()
    })

    it('returns normalized decoded vehicle data', async () => {
        vi.mocked(externalApiFetch).mockResolvedValue({
            Results: [{
                Make:            'Toyota',
                Model:           'Camry',
                ModelYear:       '2024',
                FuelTypePrimary: 'Gasoline',
                ErrorCode:       '0',
            }],
        })

        const response = await POST(vinRequest({ vin: '4T1BF1FK0HU123456' }))

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({
            success:   true,
            make:      'Toyota',
            model:     'Camry',
            year:      2024,
            fuel_type: 'Petrol',
        })
        expect(externalApiFetch).toHaveBeenCalledWith(expect.objectContaining({
            baseUrl:      'https://vpic.nhtsa.dot.gov',
            providerName: 'NHTSA VIN',
            path:         '/api/vehicles/DecodeVinValues/4T1BF1FK0HU123456?format=json',
            timeoutMs:    10_000,
        }))
    })

    it('returns a stable provider-unavailable error for provider failures', async () => {
        vi.mocked(externalApiFetch).mockRejectedValue(
            new ExternalApiError('timeout', 'NHTSA VIN', '/api/vehicles/DecodeVinValues/4T1BF1FK0HU123456')
        )

        const response = await POST(vinRequest({ vin: '4T1BF1FK0HU123456' }))

        expect(response.status).toBe(502)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error:   'VIN decoder is temporarily unavailable',
        })
    })
})
