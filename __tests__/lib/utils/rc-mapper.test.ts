import { parseIndianDate } from '@/lib/utils/rc-mapper'

describe('rc-mapper', () => {
    describe('parseIndianDate', () => {
        it('keeps ISO dates returned by Surepass', () => {
            expect(parseIndianDate('2029-08-24')).toBe('2029-08-24')
        })

        it('normalizes Indian date formats', () => {
            expect(parseIndianDate('24/08/2029')).toBe('2029-08-24')
            expect(parseIndianDate('24-08-2029')).toBe('2029-08-24')
        })
    })
})
