import { describe, expect, it } from 'vitest'
import { brandToUrlSlug, findBrandNameByUrlSlug } from '@/lib/db/dealers'

describe('dealer public slug brand resolution', () => {
    it('resolves 2W brand URL slugs back to the exact selected brand name', () => {
        expect(findBrandNameByUrlSlug(
            ['Honda Motorcycle & Scooter India', 'Royal Enfield'],
            'honda-motorcycle-scooter-india',
        )).toBe('Honda Motorcycle & Scooter India')
    })

    it('resolves 3W brand URL slugs containing punctuation back to the exact selected brand name', () => {
        expect(findBrandNameByUrlSlug(
            ['Bajaj Auto (3W)', 'Lohia Auto'],
            'bajaj-auto-3w',
        )).toBe('Bajaj Auto (3W)')
    })

    it('keeps dashboard and public resolver slug generation aligned for non-car brands', () => {
        expect(brandToUrlSlug('Honda Motorcycle & Scooter India')).toBe('honda-motorcycle-scooter-india')
        expect(brandToUrlSlug('Bajaj Auto (3W)')).toBe('bajaj-auto-3w')
    })
})
