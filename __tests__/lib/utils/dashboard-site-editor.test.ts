import { describe, expect, it } from 'vitest'
import { parseDashboardSiteEditorTarget } from '@/lib/utils/dashboard-site-editor'

describe('dashboard site editor target parsing', () => {
    it('detects brand-specific new 2W pages', () => {
        expect(parseDashboardSiteEditorTarget('shayam-motors-aprilia-india/two-wheelers/new', 'shayam-motors')).toMatchObject({
            brandSlug: 'aprilia-india',
            brandLabel: 'Aprilia India',
            vehicleLabel: '2W',
            stockLabel: 'New',
            pageLabel: 'Aprilia India / New 2W',
        })
    })

    it('detects used 3W stock pages without treating used as a brand', () => {
        expect(parseDashboardSiteEditorTarget('shayam-motors/three-wheelers/used', 'shayam-motors')).toMatchObject({
            brandSlug: null,
            brandLabel: null,
            vehicleLabel: '3W',
            stockLabel: 'Used',
            pageLabel: 'Used 3W',
        })
    })

    it('detects 4W hybrid used pages without treating used as a brand', () => {
        expect(parseDashboardSiteEditorTarget('lakshmi-motors-used', 'lakshmi-motors')).toMatchObject({
            brandSlug: null,
            vehicleLabel: '4W',
            stockLabel: 'Used',
            pageLabel: 'Used 4W',
        })
    })
})
