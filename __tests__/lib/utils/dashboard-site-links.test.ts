import { describe, expect, it } from 'vitest'
import { dashboardSiteDisplayUrl, dashboardSiteHref, dashboardSitePath } from '@/lib/utils/dashboard-site-links'

describe('dashboard site links', () => {
    it('builds a current-app path for dashboard site pages', () => {
        expect(dashboardSitePath('lakshmi-motors-bmw')).toBe('/sites/lakshmi-motors-bmw')
        expect(dashboardSitePath('/sites/lakshmi-motors-used')).toBe('/sites/lakshmi-motors-used')
    })

    it('builds absolute copy URLs from the active browser origin', () => {
        const siteOrigin = { origin: 'https://indrav.in', host: 'indrav.in' }

        expect(dashboardSiteHref('lakshmi-motors-bmw', siteOrigin)).toBe('https://indrav.in/sites/lakshmi-motors-bmw')
        expect(dashboardSiteDisplayUrl('lakshmi-motors-bmw', siteOrigin)).toBe('indrav.in/sites/lakshmi-motors-bmw')
    })
})
