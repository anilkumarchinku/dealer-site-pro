import { describe, expect, it } from 'vitest'
import { isUsableVehicleImageUrl } from '@/lib/utils/brand-model-images'
import { resolveGeneratedVehicleImage } from '@/lib/utils/generated-vehicle-images'

const BAD_MARKERS = [
    '/placeholder-car.jpg',
    'placeholder',
    'image-not-available',
    'no-image',
    'coming-soon',
]

function expectRealModelImage(url: string | null) {
    expect(url).toBeTruthy()
    expect(isUsableVehicleImageUrl(url)).toBe(true)
    for (const marker of BAD_MARKERS) {
        expect(url!.toLowerCase()).not.toContain(marker)
    }
}

describe('generated vehicle image resolution', () => {
    it('uses a 2W model image when generated inventory has a fake uploaded placeholder', () => {
        const image = resolveGeneratedVehicleImage(
            '2w',
            'Ducati',
            'Panigale V4 R',
            ['/placeholder-car.jpg'],
        )

        expectRealModelImage(image)
        expect(image).toContain('/data/brand-model-images/2w/')
        expect(image).toContain('panigale-v4-r')
    })

    it('uses a 3W model image when generated inventory has no uploaded image', () => {
        const image = resolveGeneratedVehicleImage(
            '3w',
            'Montra Electric',
            'Eviator E-350X',
            [],
        )

        expectRealModelImage(image)
        expect(image).toMatch(/\/(?:data\/brand-model-images|images)\/3w\//)
        expect(image).toMatch(/eviator-e-350x|eviator-e350x|eviator/)
    })

    it('ignores a fake 2W primary image before choosing the model photo', () => {
        const image = resolveGeneratedVehicleImage(
            '2w',
            'Hero MotoCorp',
            'MOTOCORP LTD KARIZMA BSIII',
            ['/placeholder-car.jpg'],
        )

        expectRealModelImage(image)
        expect(image).toContain('/data/brand-model-images/2w/')
        expect(image).toContain('karizma-xmr')
    })

    it('keeps a usable dealer-uploaded model image as first choice', () => {
        const uploaded = 'https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/vehicle-images/2w/ducati-india/panigale-v4-r.jpg'
        expect(resolveGeneratedVehicleImage('2w', 'Ducati', 'Panigale V4 R', [uploaded])).toBe(uploaded)
    })
})
