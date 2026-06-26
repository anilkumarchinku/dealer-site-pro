import { createAdminClient } from '@/lib/supabase-server'
import type { Car } from '@/lib/types/car'

export type UsedVehicleCategory = '2w' | '3w' | '4w'
export type UsedVehicleSourceType = 'manual' | 'cyepro'

export interface UsedVehiclePriceOffer {
    id: string
    dealer_id: string
    vehicle_category: UsedVehicleCategory
    source_type: UsedVehicleSourceType
    source_vehicle_id: string
    offer_price_paise: number
    offer_label: string | null
    valid_until: string | null
    is_active: boolean
    created_at?: string
    updated_at?: string
}

type OfferRecord = UsedVehiclePriceOffer

type OfferTableClient = {
    from(table: 'used_vehicle_price_offers'): {
        select(columns: string): OfferSelectQuery
        upsert(
            payload: Partial<OfferRecord>,
            options: { onConflict: string }
        ): {
            select(columns: string): {
                single(): Promise<{ data: Pick<OfferRecord, 'id'> | null; error: { message: string } | null }>
            }
        }
        update(payload: Partial<OfferRecord>): OfferMutationQuery
    }
}

type OfferSelectQuery = PromiseLike<{ data: OfferRecord[] | null; error: { message: string; code?: string } | null }> & {
    eq(column: string, value: unknown): OfferSelectQuery
    or(filter: string): OfferSelectQuery
    order(column: string, options?: { ascending?: boolean }): OfferSelectQuery
}

type OfferMutationQuery = {
    eq(column: string, value: unknown): OfferMutationQuery
} & PromiseLike<{ error: { message: string } | null }>

export function usedVehicleOfferKey(
    category: UsedVehicleCategory,
    sourceType: UsedVehicleSourceType,
    sourceVehicleId: string
) {
    return `${category}:${sourceType}:${sourceVehicleId}`
}

function getOfferClient(): OfferTableClient {
    return createAdminClient() as unknown as OfferTableClient
}

function isMissingOfferTableError(error: { message: string; code?: string } | null): boolean {
    if (!error) return false
    return error.code === 'PGRST205' || /used_vehicle_price_offers/i.test(error.message) && /schema cache|does not exist|could not find/i.test(error.message)
}

export async function fetchActiveUsedVehiclePriceOffers(dealerId: string): Promise<UsedVehiclePriceOffer[]> {
    const today = new Date().toISOString().slice(0, 10)
    const { data, error } = await getOfferClient()
        .from('used_vehicle_price_offers')
        .select('id, dealer_id, vehicle_category, source_type, source_vehicle_id, offer_price_paise, offer_label, valid_until, is_active, created_at, updated_at')
        .eq('dealer_id', dealerId)
        .eq('is_active', true)
        .or(`valid_until.is.null,valid_until.gte.${today}`)
        .order('updated_at', { ascending: false })

    if (error) {
        if (isMissingOfferTableError(error)) return []
        console.warn('[used_vehicle_price_offers] read failed:', error.message)
        return []
    }

    return (data ?? []) as UsedVehiclePriceOffer[]
}

export function buildUsedVehicleOfferMap(offers: UsedVehiclePriceOffer[]) {
    return new Map(
        offers.map((offer) => [
            usedVehicleOfferKey(offer.vehicle_category, offer.source_type, offer.source_vehicle_id),
            offer,
        ])
    )
}

function getCarSourceType(car: Car): UsedVehicleSourceType {
    return /cyepro/i.test(car.meta?.dataSource ?? '') ? 'cyepro' : 'manual'
}

function getCarSourceVehicleId(car: Car): string {
    return car.meta?.sourceVehicleId ?? car.id
}

export function applyUsedVehiclePriceOffersToCars(cars: Car[], offers: UsedVehiclePriceOffer[]): Car[] {
    if (offers.length === 0) return cars

    const offerMap = buildUsedVehicleOfferMap(offers)
    return cars.map((car) => {
        const category = car.vehicleCategory ?? '4w'
        const sourceType = getCarSourceType(car)
        const sourceVehicleId = getCarSourceVehicleId(car)
        const offer = offerMap.get(usedVehicleOfferKey(category, sourceType, sourceVehicleId))
        if (!offer) return car

        const originalPrice = car.pricing?.exShowroom?.min ?? null
        const offerPrice = Math.round(offer.offer_price_paise / 100)

        return {
            ...car,
            offer: {
                price: offerPrice,
                originalPrice,
                label: offer.offer_label ?? 'Offer price',
                validUntil: offer.valid_until ?? undefined,
            },
        }
    })
}

export function applyUsedVehiclePriceOffersToRecords<
    TRecord extends { id: string; price_paise: number }
>(
    vehicles: TRecord[],
    offers: UsedVehiclePriceOffer[],
    category: UsedVehicleCategory,
    sourceType: UsedVehicleSourceType = 'manual'
): Array<TRecord & { offer_price_paise?: number | null; offer_label?: string | null; offer_valid_until?: string | null }> {
    if (offers.length === 0) return vehicles

    const offerMap = buildUsedVehicleOfferMap(offers)
    return vehicles.map((vehicle) => {
        const offer = offerMap.get(usedVehicleOfferKey(category, sourceType, vehicle.id))
        if (!offer) return vehicle
        return {
            ...vehicle,
            offer_price_paise: offer.offer_price_paise,
            offer_label: offer.offer_label,
            offer_valid_until: offer.valid_until,
        }
    })
}

export async function upsertUsedVehiclePriceOffer(input: {
    dealer_id: string
    vehicle_category: UsedVehicleCategory
    source_type: UsedVehicleSourceType
    source_vehicle_id: string
    offer_price_paise: number
    offer_label?: string | null
    valid_until?: string | null
}) {
    const { data, error } = await getOfferClient()
        .from('used_vehicle_price_offers')
        .upsert(
            {
                ...input,
                offer_label: input.offer_label?.trim() || 'Offer price',
                valid_until: input.valid_until || null,
                is_active: true,
            },
            { onConflict: 'dealer_id,vehicle_category,source_type,source_vehicle_id' }
        )
        .select('id')
        .single()

    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
}

export async function clearUsedVehiclePriceOffer(input: {
    dealer_id: string
    vehicle_category: UsedVehicleCategory
    source_type: UsedVehicleSourceType
    source_vehicle_id: string
}) {
    const { error } = await getOfferClient()
        .from('used_vehicle_price_offers')
        .update({ is_active: false })
        .eq('dealer_id', input.dealer_id)
        .eq('vehicle_category', input.vehicle_category)
        .eq('source_type', input.source_type)
        .eq('source_vehicle_id', input.source_vehicle_id)

    if (error) return { success: false, error: error.message }
    return { success: true }
}
