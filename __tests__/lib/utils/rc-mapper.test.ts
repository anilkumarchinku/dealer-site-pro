import { getChallanSummary, parseIndianDate } from '@/lib/utils/rc-mapper'

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

    describe('getChallanSummary', () => {
        it('uses unpaid challan records over a contradictory provider summary', () => {
            expect(getChallanSummary({
                challan_count: 0,
                challan_status: 'No pending challans found',
                challans: [
                    {
                        challan_number: 'HYD25EC151027634',
                        challan_status: 'Not Paid',
                        amount: 100,
                    },
                ],
            })).toMatchObject({
                status: '1 pending challan found',
                pendingCount: 1,
                recordCount: 1,
                hasPending: true,
                hasRecords: true,
            })
        })

        it('falls back to provider summary when detailed records are absent', () => {
            expect(getChallanSummary({
                challan_count: 0,
                challan_status: 'No pending challans found',
            })).toMatchObject({
                status: 'No pending challans found',
                pendingCount: 0,
                recordCount: 0,
                hasPending: false,
                hasRecords: false,
            })
        })
    })
})
