import { describe, expect, it } from 'vitest'
import {
    buildTemplateDetailBasePath,
    buildTemplateSiteBase,
    templateVehiclePathSuffix,
} from '@/lib/utils/template-site-paths'

describe('template site paths', () => {
    it('builds vehicle path suffixes for shared templates', () => {
        expect(templateVehiclePathSuffix('2w')).toBe('/two-wheelers')
        expect(templateVehiclePathSuffix('3w')).toBe('/three-wheelers')
        expect(templateVehiclePathSuffix('4w')).toBe('')
        expect(templateVehiclePathSuffix()).toBe('')
    })

    it('keeps main-domain preview links under /sites/{slug}', () => {
        expect(buildTemplateSiteBase('/sites/lakshmi-motors-audi', '4w')).toBe('/sites/lakshmi-motors-audi')
        expect(buildTemplateSiteBase('/sites/bhai-motors/three-wheelers', '3w')).toBe('/sites/bhai-motors/three-wheelers')
        expect(buildTemplateSiteBase('/sites/bhai-motors/two-wheelers', '2w')).toBe('/sites/bhai-motors/two-wheelers')
    })

    it('uses root-relative links on live subdomain and custom-domain dealer sites', () => {
        expect(buildTemplateSiteBase('/', '4w')).toBe('')
        expect(buildTemplateSiteBase('/three-wheelers', '3w')).toBe('/three-wheelers')
        expect(buildTemplateSiteBase('/two-wheelers', '2w')).toBe('/two-wheelers')
    })

    it('keeps generic non-dealer catalog and preview pages on /cars', () => {
        expect(buildTemplateSiteBase('/preview', '4w')).toBe('/cars')
        expect(buildTemplateSiteBase('/demo/templates', '4w')).toBe('/cars')
        expect(buildTemplateSiteBase('/cars', '4w')).toBe('/cars')
        expect(buildTemplateSiteBase('/brands/audi', '4w')).toBe('/cars')
    })

    it('points used-only 2W and 3W detail pages back to used listings', () => {
        expect(buildTemplateDetailBasePath({
            pathname: '/sites/bhai-motors/two-wheelers/used',
            vehicleType: '2w',
            sellsNewCars: false,
            sellsUsedCars: true,
        })).toBe('/sites/bhai-motors/two-wheelers/used')

        expect(buildTemplateDetailBasePath({
            pathname: '/three-wheelers/used',
            vehicleType: '3w',
            sellsNewCars: false,
            sellsUsedCars: true,
        })).toBe('/three-wheelers/used')
    })

    it('does not send live 4W dealer detail links to the global /cars route', () => {
        expect(buildTemplateDetailBasePath({
            pathname: '/',
            vehicleType: '4w',
            sellsNewCars: true,
            sellsUsedCars: false,
        })).toBe('')

        expect(`${buildTemplateDetailBasePath({
            pathname: '/',
            vehicleType: '4w',
            sellsNewCars: true,
            sellsUsedCars: false,
        }).replace(/\/$/, '')}/json-audi-0`.replace(/^\/\//, '/')).toBe('/json-audi-0')
    })
})
