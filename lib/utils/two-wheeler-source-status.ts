import type { TwoWheelerStockStatus } from '@/lib/types/two-wheeler'

export function parseTwoWheelerSourceStatus(
    section: string | null | undefined
): TwoWheelerStockStatus {
    if (!section) return 'available'

    const normalized = section.toLowerCase()
    if (normalized.includes('upcoming') || normalized.includes('launch')) {
        return 'booking_open'
    }
    if (normalized.includes('discontinu') || normalized.includes('stopped')) {
        return 'out_of_stock'
    }

    return 'available'
}

export function isDiscontinuedTwoWheeler(
    section: string | null | undefined
): boolean {
    return parseTwoWheelerSourceStatus(section) === 'out_of_stock'
}
