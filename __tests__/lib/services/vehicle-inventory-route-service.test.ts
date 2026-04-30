import { NextRequest } from 'next/server'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { createVehicleDetailRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'

vi.mock('@/lib/db/dealers', () => ({
    fetchDealerBySlug: vi.fn(),
}))

type TestVehicle = {
    id: string
    brand: string
    model: string
    variant?: string | null
}

function testVehicle(id: string, model: string): TestVehicle {
    return {
        id,
        brand: 'Aprilia India',
        model,
        variant: null,
    }
}

describe('createVehicleDetailRouteHandlers', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('resolves older generated catalog ids even when DB catalog rows exist', async () => {
        vi.mocked(fetchDealerBySlug).mockResolvedValue({
            id: 'dealer_1',
            vehicle_type: 'two-wheeler',
            brandFilter: null,
            brands: ['Aprilia India'],
        } as never)

        const handlers = createVehicleDetailRouteHandlers<TestVehicle, Record<string, never>>({
            vehicleType: 'two-wheeler',
            catalogPrefix: 'cat-2w',
            dbPrefix: 'tw-',
            getVehicleById: vi.fn().mockResolvedValue(null),
            getVehicles: vi.fn().mockResolvedValue({ vehicles: [] }),
            getCatalogFromDB: vi.fn().mockResolvedValue([
                testVehicle('aprilia-rs-457-rs-457-standard', 'RS 457'),
            ]),
            getFallbackCatalog: vi.fn().mockReturnValue([
                testVehicle('catalog-2w-aprilia-india-1', 'Tuono 457'),
            ]),
            hydrateVehicle: vi.fn((vehicle) => vehicle),
            incrementViews: vi.fn().mockResolvedValue(undefined),
            updateVehicle: vi.fn(),
            deleteVehicle: vi.fn(),
        })

        const response = await handlers.GET(
            new NextRequest('https://example.test/api/two-wheelers/cat-2w-0-catalog-2w-aprilia-india-1?slug=shayam-motors'),
            { params: Promise.resolve({ id: 'cat-2w-0-catalog-2w-aprilia-india-1' }) }
        )

        await expect(response.json()).resolves.toMatchObject({
            id: 'cat-2w-0-catalog-2w-aprilia-india-1',
            model: 'Tuono 457',
        })
        expect(response.status).toBe(200)
    })
})
