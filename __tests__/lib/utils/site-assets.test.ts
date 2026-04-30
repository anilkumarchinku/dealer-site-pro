import { describe, expect, it } from 'vitest'
import { brandLogoUrl, firstVehicleHeroImage } from '@/lib/utils/site-assets'
import type { Car } from '@/lib/types/car'

function carWithImages(hero: string, exterior: string[] = []): Car {
    return {
        id: 'car-1',
        make: 'BMW',
        model: 'X5',
        variant: '',
        year: 2026,
        bodyType: 'SUV',
        segment: 'D',
        pricing: { exShowroom: { min: 1, max: 1, currency: 'INR' } },
        engine: { type: 'Petrol', power: '', torque: '' },
        transmission: { type: 'Automatic' },
        performance: {},
        dimensions: { seatingCapacity: 5 },
        features: { keyFeatures: [] },
        images: { hero, exterior, interior: [] },
        meta: { viewCount: 0 },
        condition: 'new',
    }
}

describe('site assets', () => {
    it('builds brand logo fallback URLs from display names', () => {
        expect(brandLogoUrl('Royal Enfield', '2w')).toBe('/data/brand-logos/royal-enfield.png')
        expect(brandLogoUrl('Lohia Auto', '3w')).toBe('/data/brand-logos/lohia-auto.png')
        expect(brandLogoUrl('Tata Motors', '4w')).toBe('/data/brand-logos/tata.png')
    })

    it('uses the first non-placeholder vehicle hero image', () => {
        expect(firstVehicleHeroImage([
            carWithImages('/placeholder-car.jpg', ['/fallback.jpg']),
            carWithImages('/hero.jpg'),
        ])).toBe('/hero.jpg')
    })

    it('falls back to exterior images when hero images are placeholders', () => {
        expect(firstVehicleHeroImage([
            carWithImages('/placeholder-car.jpg', ['/fallback.jpg']),
        ])).toBe('/fallback.jpg')
    })
})
