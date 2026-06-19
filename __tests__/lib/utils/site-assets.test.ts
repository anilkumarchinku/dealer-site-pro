import { describe, expect, it } from 'vitest'
import {
    brandLogoUrl,
    firstVehicleHeroImage,
    isDealerUploadedHero,
    resolveDealerHeroImage,
} from '@/lib/utils/site-assets'
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
        expect(brandLogoUrl('Tata Motors', '4w')).toBe('/data/brand-logos/tata-motors.png')
        expect(brandLogoUrl('Hop Electric', '2w')).toBe('/data/brand-logos/hop-electric.svg')
        expect(brandLogoUrl('Okinawa Autotech', '2w')).toBe('/data/brand-logos/okinawa-autotech.webp')
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

    it('does not use generated catalog images as dealer uploaded hero images', () => {
        expect(isDealerUploadedHero('/data/brand-model-images/4w/bmw/6-series.jpg')).toBe(false)
        expect(isDealerUploadedHero('https://images.unsplash.com/photo-vehicle')).toBe(false)
        expect(isDealerUploadedHero('https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/dealer-assets/dealers/dealer-1/hero.jpg')).toBe(true)
        expect(isDealerUploadedHero('data:image/png;base64,abc')).toBe(true)
    })

    it('prefers dealer-uploaded hero images but falls back to inventory images', () => {
        const inventoryHero = '/data/brand-model-images/4w/audi/a4.jpg'

        expect(resolveDealerHeroImage({
            uploadedHeroImage: 'https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/dealer-assets/dealers/dealer-1/hero.jpg',
            inventoryHeroImage: inventoryHero,
        })).toBe('https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/dealer-assets/dealers/dealer-1/hero.jpg')

        expect(resolveDealerHeroImage({
            uploadedHeroImage: '/data/brand-model-images/4w/bmw/6-series.jpg',
            inventoryHeroImage: inventoryHero,
        })).toBe(inventoryHero)

        expect(resolveDealerHeroImage({
            uploadedHeroImage: '/placeholder-car.jpg',
            inventoryHeroImage: '/placeholder.png',
        })).toBeUndefined()
    })
})
