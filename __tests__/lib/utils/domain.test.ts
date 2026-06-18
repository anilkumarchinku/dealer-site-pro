import { afterEach, describe, expect, it, vi } from 'vitest'

async function loadDomainHelpers(baseDomain: string, useSubdomain: boolean) {
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_BASE_DOMAIN', baseDomain)
    vi.stubEnv('NEXT_PUBLIC_USE_SUBDOMAIN', useSubdomain ? 'true' : 'false')
    return import('@/lib/utils/domain')
}

describe('dealer site domain helpers', () => {
    afterEach(() => {
        vi.unstubAllEnvs()
        vi.resetModules()
    })

    it('builds direct 2W and 3W path slugs', async () => {
        const { dealerVehicleSiteSlug } = await loadDomainHelpers('indrav.in', false)

        expect(dealerVehicleSiteSlug('win-motors', 'two-wheeler')).toBe('win-motors/two-wheelers')
        expect(dealerVehicleSiteSlug('fosha-auto-traders', 'three-wheeler')).toBe('fosha-auto-traders/three-wheelers')
        expect(dealerVehicleSiteSlug('lakshmi-motors-bmw', 'car')).toBe('lakshmi-motors-bmw')
    })

    it('keeps localhost and preview domains path-based when subdomains are disabled', async () => {
        const { dealerVehicleSiteUrl, dealerVehicleSiteHref } = await loadDomainHelpers('localhost:3000', false)

        expect(dealerVehicleSiteUrl('win-motors', 'two-wheeler')).toBe('localhost:3000/sites/win-motors/two-wheelers')
        expect(dealerVehicleSiteHref('fosha-auto-traders', 'three-wheeler')).toBe('http://localhost:3000/sites/fosha-auto-traders/three-wheelers')
    })

    it('uses slug-first public URLs on indrav.in even when the env flag is false', async () => {
        const { dealerVehicleSiteUrl, dealerVehicleSiteHref } = await loadDomainHelpers('indrav.in', false)

        expect(dealerVehicleSiteUrl('win-motors', 'two-wheeler')).toBe('win-motors.indrav.in/two-wheelers')
        expect(dealerVehicleSiteHref('fosha-auto-traders', 'three-wheeler')).toBe('https://fosha-auto-traders.indrav.in/three-wheelers')
    })

    it('builds direct 2W and 3W URLs on subdomain mode', async () => {
        const { dealerVehicleSiteUrl, dealerVehicleSiteHref } = await loadDomainHelpers('indrav.in', true)

        expect(dealerVehicleSiteUrl('win-motors', 'two-wheeler')).toBe('win-motors.indrav.in/two-wheelers')
        expect(dealerVehicleSiteHref('fosha-auto-traders', 'three-wheeler')).toBe('https://fosha-auto-traders.indrav.in/three-wheelers')
    })
})
