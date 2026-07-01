import { describe, expect, it } from 'vitest'
import type { Car } from '@/lib/types/car'
import { resolveCarImage } from '@/lib/utils/car-image'

function car(overrides: Partial<Car> = {}): Car {
    return {
        id: 'test-car',
        make: 'Aston Martin',
        model: 'DB12',
        variant: 'Coupe',
        year: 2026,
        bodyType: 'Coupe',
        segment: 'Luxury',
        pricing: {
            exShowroom: { min: 30000000, max: 35000000, currency: 'INR' },
        },
        engine: {
            type: 'Petrol',
            power: '671 bhp',
            torque: '800 Nm',
        },
        transmission: {
            type: 'Automatic',
        },
        performance: {},
        dimensions: {
            seatingCapacity: 2,
        },
        features: {
            keyFeatures: [],
        },
        images: {
            hero: '',
            exterior: [],
            interior: [],
        },
        meta: {},
        vehicleCategory: '4w',
        ...overrides,
    }
}

describe('resolveCarImage', () => {
    it('returns a real model image for known catalog vehicles', () => {
        const image = resolveCarImage(car())

        expect(image).toBeTruthy()
        expect(image).not.toContain('placeholder')
        expect(image).not.toContain('data:image/svg+xml')
        expect(image).toMatch(/\/(?:data\/brand-model-images\/4w(?:-galleries)?|assets\/cars)\/aston-martin\//)
    })

    it('returns null instead of fake placeholder art when no real image exists', () => {
        const image = resolveCarImage(car({
            make: 'Unknown Make',
            model: 'Unknown Model',
            images: {
                hero: '/placeholder-car.jpg',
                exterior: [],
                interior: [],
            },
        }))

        expect(image).toBeNull()
    })
})
