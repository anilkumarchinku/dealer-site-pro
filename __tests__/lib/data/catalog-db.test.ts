import { vi } from 'vitest'
import {
    resolveThwCatalogMake,
    thwRowToVehicle,
    twRowToVehicle,
    type VehicleCatalogDbRow,
} from '@/lib/data/catalog-db'
import { hydrateTwoWheelerWithJson } from '@/lib/data/two-wheeler-detail'

vi.mock('@/lib/data/two-wheeler-gallery', () => ({
    fetchTwoWheelerColorGallery: vi.fn(),
}))

vi.mock('@/lib/data/2w-brand-data', () => ({
    getModelEnrichment: vi.fn(() => ({
        engine_cc: null,
        mileage_kmpl: null,
        top_speed_kmph: 90,
        ex_showroom_price_paise: 14690700,
        range_km: 126,
        battery_kwh: null,
        colors: [],
        features: [],
        description: null,
        max_power: '6.4 kW',
        torque: '26 Nm',
        variant: '450X',
        all_variants: [
            { name: '450X 2.9 kWh', price_paise: 14690700 },
            { name: '450X 3.7 kWh', price_paise: 15740300 },
        ],
        stock_status: 'available',
        transmission: 'Automatic',
        wheelbase_mm: null,
        length_mm: null,
        width_mm: null,
        height_mm: null,
    })),
}))

function catalogRow(overrides: Partial<VehicleCatalogDbRow>): VehicleCatalogDbRow {
    return {
        id: 'catalog-1',
        make: 'Ather Energy',
        model: '450X',
        variant: null,
        year: 2026,
        body_type: null,
        fuel_type: null,
        engine_cc: null,
        mileage_kmpl: null,
        range_km: null,
        top_speed_kmph: null,
        passenger_capacity: null,
        payload_kg: null,
        price_min_paise: null,
        image_url: null,
        popularity_score: null,
        is_active: true,
        created_at: '2026-04-01T00:00:00.000Z',
        updated_at: '2026-04-02T00:00:00.000Z',
        ...overrides,
    }
}

describe('catalog DB row parsing', () => {
    it('normalizes punctuation-light three-wheeler brand slugs to catalog makes', () => {
        expect(resolveThwCatalogMake('Bajaj Auto 3w')).toBe('Bajaj')
    })

    it('maps electric two-wheeler catalog rows without losing pricing or media fields', () => {
        const vehicle = twRowToVehicle(catalogRow({
            fuel_type: 'Electric',
            mileage_kmpl: '112.5',
            range_km: 150,
            top_speed_kmph: 90,
            price_min_paise: 14500000,
            image_url: 'https://example.com/ather.jpg',
            popularity_score: 9,
        }), 'dealer-1')

        expect(vehicle).toMatchObject({
            id: 'catalog-1',
            dealer_id: 'dealer-1',
            type: 'electric',
            brand: 'Ather Energy',
            model: '450X',
            fuel_type: 'electric',
            mileage_kmpl: 112.5,
            range_km: 150,
            top_speed_kmph: 90,
            ex_showroom_price_paise: 14500000,
            images: ['https://example.com/ather.jpg'],
            fame_subsidy_eligible: true,
            is_featured: true,
            status: 'active',
        })
        expect(vehicle.all_variants).toEqual([
            { name: '450X Standard', price_paise: 14500000 },
        ])
    })

    it('hydrates DB fallback variants with richer two-wheeler JSON variants', () => {
        const vehicle = twRowToVehicle(catalogRow({
            fuel_type: 'Electric',
            price_min_paise: 14500000,
        }), 'dealer-1')

        expect(hydrateTwoWheelerWithJson(vehicle).all_variants).toEqual([
            { name: '450X 2.9 kWh', price_paise: 14690700 },
            { name: '450X 3.7 kWh', price_paise: 15740300 },
        ])
    })

    it('classifies petrol scooters from body type and defaults invalid mileage safely', () => {
        const vehicle = twRowToVehicle(catalogRow({
            make: 'Honda',
            model: 'Activa',
            body_type: 'Scooter',
            fuel_type: 'Petrol',
            mileage_kmpl: 'not-a-number',
            is_active: false,
        }), 'dealer-2')

        expect(vehicle.type).toBe('scooter')
        expect(vehicle.fuel_type).toBe('petrol')
        expect(vehicle.mileage_kmpl).toBeNull()
        expect(vehicle.status).toBe('inactive')
    })

    it('maps three-wheeler passenger rows and preserves operational fields', () => {
        const vehicle = thwRowToVehicle(catalogRow({
            make: 'Bajaj',
            model: 'RE Electric',
            fuel_type: 'electric',
            passenger_capacity: 3,
            payload_kg: 320,
            mileage_kmpl: 26,
            price_min_paise: 39000000,
            image_url: 'https://example.com/re-electric.jpg',
        }), 'dealer-3')

        expect(vehicle).toMatchObject({
            dealer_id: 'dealer-3',
            type: 'electric',
            brand: 'Bajaj',
            model: 'RE Electric',
            fuel_type: 'electric',
            passenger_capacity: 3,
            payload_kg: 320,
            mileage_kmpl: 26,
            ex_showroom_price_paise: 39000000,
            images: ['https://example.com/re-electric.jpg'],
            fame_subsidy_eligible: true,
        })
    })

    it('falls back unknown three-wheeler fuel values to petrol cargo vehicles', () => {
        const vehicle = thwRowToVehicle(catalogRow({
            make: 'Atul',
            model: 'Gem Cargo',
            fuel_type: 'hydrogen',
            passenger_capacity: 0,
        }), 'dealer-4')

        expect(vehicle.type).toBe('cargo')
        expect(vehicle.fuel_type).toBe('petrol')
        expect(vehicle.fame_subsidy_eligible).toBe(false)
    })
})
