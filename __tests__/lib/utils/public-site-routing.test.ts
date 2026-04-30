import { describe, expect, it } from 'vitest'
import { isMainDealerHost, publicDealerSitePath, publicVehicleHubPath } from '@/lib/utils/public-site-routing'

describe('public site routing', () => {
    it('treats the configured base domain and localhost as main app hosts', () => {
        expect(isMainDealerHost('indrav.in', 'indrav.in')).toBe(true)
        expect(isMainDealerHost('www.indrav.in', 'indrav.in')).toBe(true)
        expect(isMainDealerHost('localhost:3000', 'indrav.in')).toBe(true)
        expect(isMainDealerHost('dealer-site-pro.vercel.app', 'indrav.in')).toBe(true)
    })

    it('keeps main-domain vehicle hubs under /sites/{slug}', () => {
        expect(publicVehicleHubPath({
            dealerSlug: 'lakshmi-motors',
            segment: 'two-wheelers',
            host: 'indrav.in',
            baseDomain: 'indrav.in',
        })).toBe('/sites/lakshmi-motors/two-wheelers')
    })

    it('builds alternate dealer-site links on the active app host', () => {
        expect(publicDealerSitePath({
            siteSlug: 'lakshmi-motors-bmw',
            host: 'indrav.in',
            baseDomain: 'indrav.in',
        })).toBe('/sites/lakshmi-motors-bmw')

        expect(publicDealerSitePath({
            siteSlug: 'lakshmi-motors-used',
            host: 'lakshmi-motors.indrav.in',
            baseDomain: 'indrav.in',
        })).toBe('https://indrav.in/sites/lakshmi-motors-used')
    })

    it('uses root-relative vehicle hubs on dealer subdomains and custom domains', () => {
        expect(publicVehicleHubPath({
            dealerSlug: 'lakshmi-motors',
            segment: 'two-wheelers',
            host: 'lakshmi-motors.indrav.in',
            baseDomain: 'indrav.in',
        })).toBe('/two-wheelers')

        expect(publicVehicleHubPath({
            dealerSlug: 'lakshmi-motors',
            segment: 'three-wheelers',
            host: 'lakshmimotors.com',
            baseDomain: 'indrav.in',
        })).toBe('/three-wheelers')
    })
})
