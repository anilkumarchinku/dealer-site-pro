import { describe, expect, it } from 'vitest'
import { buildDashboardSiteCards } from '@/lib/utils/dashboard-site-cards'

describe('dashboard site cards', () => {
    it('shows separate new brand and used cards for a hybrid 2W dealer', () => {
        const cards = buildDashboardSiteCards({
            slug: 'shayam-motors',
            dealerName: 'shayam motors',
            carBrands: [],
            twoWheelerBrands: ['Aprilia India', 'Royal Enfield'],
            threeWheelerBrands: [],
            isNew: true,
            isUsed: true,
            vehicleType: 'two-wheeler',
            has2W: true,
            has3W: false,
            has4W: false,
        })

        expect(cards.map(card => card.slug)).toEqual([
            'shayam-motors-aprilia-india/two-wheelers/new',
            'shayam-motors-royal-enfield/two-wheelers/new',
            'shayam-motors/two-wheelers/used',
        ])
        expect(cards.map(card => card.label)).toEqual(['Aprilia India 2W', 'Royal Enfield 2W', 'Used 2W'])
    })

    it('shows new and used pages for 3W hybrid dealers', () => {
        const cards = buildDashboardSiteCards({
            slug: 'praba-auto-dealers',
            dealerName: 'Praba Auto Dealers',
            carBrands: [],
            twoWheelerBrands: [],
            threeWheelerBrands: ['Bajaj', 'Lohia Auto'],
            isNew: true,
            isUsed: true,
            vehicleType: 'three-wheeler',
            has2W: false,
            has3W: true,
            has4W: false,
        })

        expect(cards.map(card => card.slug)).toEqual([
            'praba-auto-dealers-bajaj/three-wheelers/new',
            'praba-auto-dealers-lohia-auto/three-wheelers/new',
            'praba-auto-dealers/three-wheelers/used',
        ])
    })

    it('keeps existing 4W hybrid cards compatible', () => {
        const cards = buildDashboardSiteCards({
            slug: 'lakshmi-motors',
            dealerName: 'Lakshmi Motors',
            carBrands: ['BMW'],
            twoWheelerBrands: [],
            threeWheelerBrands: [],
            isNew: true,
            isUsed: true,
            vehicleType: 'car',
            has2W: false,
            has3W: false,
            has4W: true,
        })

        expect(cards.map(card => card.slug)).toEqual(['lakshmi-motors-bmw', 'lakshmi-motors-used'])
        expect(cards.map(card => card.label)).toEqual(['BMW', 'Pre-Owned Cars'])
    })

    it('combines active 2W, 3W, and 4W selections', () => {
        const cards = buildDashboardSiteCards({
            slug: 'multi-motors',
            dealerName: 'Multi Motors',
            carBrands: ['Hyundai'],
            twoWheelerBrands: ['Honda'],
            threeWheelerBrands: ['Piaggio'],
            isNew: true,
            isUsed: false,
            vehicleType: 'car',
            has2W: true,
            has3W: true,
            has4W: true,
        })

        expect(cards.map(card => card.slug)).toEqual([
            'multi-motors/two-wheelers/new',
            'multi-motors/three-wheelers/new',
            'multi-motors',
        ])
    })
})
