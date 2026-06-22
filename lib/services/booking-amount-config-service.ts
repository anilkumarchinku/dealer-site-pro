import { createAdminClient } from '@/lib/supabase-server'

export type BookingVehicleCategory = '4w' | '2w' | '3w'

type DealerBookingAmounts = {
    booking_amount_paise: number | null
    four_wheeler_booking_amount_paise: number | null
    two_wheeler_booking_amount_paise: number | null
    three_wheeler_booking_amount_paise: number | null
}

function positiveAmount(value: number | null | undefined): number | null {
    return typeof value === 'number' && Number.isFinite(value) && value > 0
        ? Math.round(value)
        : null
}

function categoryAmount(row: DealerBookingAmounts, category: BookingVehicleCategory): number | null {
    if (category === '4w') return positiveAmount(row.four_wheeler_booking_amount_paise)
    if (category === '2w') return positiveAmount(row.two_wheeler_booking_amount_paise)
    return positiveAmount(row.three_wheeler_booking_amount_paise)
}

export async function getConfiguredBookingAmountPaise(
    dealerId: string,
    category: BookingVehicleCategory
): Promise<number | null> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('dealers')
        .select('booking_amount_paise, four_wheeler_booking_amount_paise, two_wheeler_booking_amount_paise, three_wheeler_booking_amount_paise')
        .eq('id', dealerId)
        .single()

    if (error || !data) {
        if (error && process.env.NODE_ENV !== 'test') {
            console.warn('[booking-amount-config] Could not load dealer booking amount:', error.message)
        }
        return null
    }

    return categoryAmount(data, category) ?? positiveAmount(data.booking_amount_paise)
}
