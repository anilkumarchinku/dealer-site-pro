import { NextRequest } from 'next/server'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getTwoWheelerVehicleById, getTwoWheelerVehicles } from '@/lib/db/two-wheelers'
import { getThreeWheelerVehicleById, getThreeWheelerVehicles } from '@/lib/db/three-wheelers'
import {
    getThreeWheelerCatalogVehicleById,
    getTwoWheelerCatalogVehicleById,
} from '@/lib/data/catalog-db'
import { GET as getTwoWheelerDetail } from '@/app/api/two-wheelers/[id]/route'
import { GET as getThreeWheelerDetail } from '@/app/api/three-wheelers/[id]/route'

vi.mock('@/lib/db/dealers', () => ({
    fetchDealerBySlug: vi.fn(),
}))

vi.mock('@/lib/db/two-wheelers', () => ({
    deleteTwoWheelerVehicle: vi.fn(),
    getTwoWheelerVehicleById: vi.fn(),
    getTwoWheelerVehicles: vi.fn(),
    incrementTwoWheelerViews: vi.fn().mockResolvedValue(undefined),
    updateTwoWheelerVehicle: vi.fn(),
}))

vi.mock('@/lib/db/three-wheelers', () => ({
    deleteThreeWheelerVehicle: vi.fn(),
    getThreeWheelerVehicleById: vi.fn(),
    getThreeWheelerVehicles: vi.fn(),
    incrementThreeWheelerViews: vi.fn().mockResolvedValue(undefined),
    updateThreeWheelerVehicle: vi.fn(),
}))

vi.mock('@/lib/data/catalog-db', () => ({
    getTwoWheelerCatalogFromDB: vi.fn().mockResolvedValue([]),
    getTwoWheelerCatalogVehicleById: vi.fn(),
    getThreeWheelerCatalogFromDB: vi.fn().mockResolvedValue([]),
    getThreeWheelerCatalogVehicleById: vi.fn(),
}))

vi.mock('@/lib/data/two-wheelers', () => ({
    TWO_WHEELER_BRANDS: ['Hero MotoCorp'],
    getTwoWheelerCatalog: vi.fn().mockReturnValue([]),
}))

vi.mock('@/lib/data/three-wheelers', () => ({
    THREE_WHEELER_BRANDS: ['Bajaj Auto (3W)'],
    getThreeWheelerCatalog: vi.fn().mockReturnValue([
        {
            id: 'catalog-3w-bajaj-auto-3w-0',
            dealer_id: 'dealer-3w',
            brand: 'Bajaj Auto (3W)',
            model: 'RE Compact 4S/Petrol',
            variant: null,
        },
    ]),
}))

vi.mock('@/lib/data/two-wheeler-detail', () => ({
    hydrateTwoWheelerDetail: vi.fn((vehicle) => vehicle),
}))

vi.mock('@/lib/data/three-wheeler-detail', () => ({
    hydrateThreeWheelerWithJson: vi.fn((vehicle) => vehicle),
}))

vi.mock('@/lib/services/vehicle-route-service-utils', () => ({
    requireDealerAccount: vi.fn(),
}))

describe('catalog-backed public vehicle detail routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(getTwoWheelerVehicleById).mockResolvedValue(null)
        vi.mocked(getThreeWheelerVehicleById).mockResolvedValue(null)
        vi.mocked(getTwoWheelerVehicles).mockResolvedValue({ vehicles: [], total: 0 })
        vi.mocked(getThreeWheelerVehicles).mockResolvedValue({ vehicles: [], total: 0 })
    })

    it('resolves live 2W generated catalog ids for a public slug without dealer brand rows', async () => {
        vi.mocked(fetchDealerBySlug).mockResolvedValue({
            id: 'dealer-2w',
            phone: '9999999999',
            logo_url: null,
            dealership_name: 'Moto',
            style_template: 'modern',
            vehicle_type: 'two-wheeler',
            sells_two_wheelers: true,
            sells_three_wheelers: false,
            brandFilter: null,
            brands: [],
        } as never)
        vi.mocked(getTwoWheelerCatalogVehicleById).mockResolvedValue({
            id: 'hero-destini-125-zx-plus-obd-2b',
            dealer_id: 'dealer-2w',
            brand: 'Hero',
            model: 'Destini 125',
            variant: 'ZX Plus OBD 2B',
        } as never)

        const id = 'cat-2w-0-hero-destini-125-zx-plus-obd-2b'
        const response = await getTwoWheelerDetail(
            new NextRequest(`https://example.test/api/two-wheelers/${id}?slug=moto`),
            { params: Promise.resolve({ id }) }
        )

        expect(getTwoWheelerCatalogVehicleById).toHaveBeenCalledWith('hero-destini-125-zx-plus-obd-2b', 'dealer-2w')
        await expect(response.json()).resolves.toMatchObject({
            id,
            model: 'Destini 125',
            _dealer: { id: 'dealer-2w', dealership_name: 'Moto' },
        })
        expect(response.status).toBe(200)
    })

    it('resolves live 3W generated fallback catalog ids for a public slug without dealer brand rows', async () => {
        vi.mocked(fetchDealerBySlug).mockResolvedValue({
            id: 'dealer-3w',
            phone: '9999999999',
            logo_url: null,
            dealership_name: '3W Cyepro',
            style_template: 'modern',
            vehicle_type: 'three-wheeler',
            sells_two_wheelers: false,
            sells_three_wheelers: true,
            brandFilter: null,
            brands: [],
        } as never)
        vi.mocked(getThreeWheelerCatalogVehicleById).mockResolvedValue(null)

        const id = 'cat-3w-0-catalog-3w-bajaj-auto-3w-0'
        const response = await getThreeWheelerDetail(
            new NextRequest(`https://example.test/api/three-wheelers/${id}?slug=3wcyepro`),
            { params: Promise.resolve({ id }) }
        )

        await expect(response.json()).resolves.toMatchObject({
            id,
            model: 'RE Compact 4S/Petrol',
            _dealer: { id: 'dealer-3w', dealership_name: '3W Cyepro' },
        })
        expect(response.status).toBe(200)
    })
})
