import { describe, expect, it } from 'vitest'
import {
    defaultTwoWheelerVariantName,
    normalizeTwoWheelerVariants,
    parseTwoWheelerVariantPriceToPaise,
} from '@/lib/utils/two-wheeler-variants'

describe('two-wheeler variant normalization', () => {
    it('normalizes mixed variant field names and rupee prices', () => {
        expect(normalizeTwoWheelerVariants([
            { variant_name: 'Disc Brake', price: '₹1.25 Lakh' },
            { name: 'Drum Brake', price: '₹98,500' },
        ])).toEqual([
            { name: 'Disc Brake', price_paise: 12500000 },
            { name: 'Drum Brake', price_paise: 9850000 },
        ])
    })

    it('falls back to the current model variant when a source has no variants', () => {
        expect(normalizeTwoWheelerVariants([], {
            name: defaultTwoWheelerVariantName('XSR 155', 'XSR 155'),
            price_paise: 15095700,
        })).toEqual([
            { name: 'XSR 155 Standard', price_paise: 15095700 },
        ])
    })

    it('deduplicates variants but keeps the priced row', () => {
        expect(normalizeTwoWheelerVariants([
            { name: 'Standard', price: '' },
            { name: 'standard', price: '₹80,000' },
        ])).toEqual([
            { name: 'standard', price_paise: 8000000 },
        ])
    })

    it('parses plain rupee numbers into paise', () => {
        expect(parseTwoWheelerVariantPriceToPaise('150957')).toBe(15095700)
    })
})
