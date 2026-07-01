/**
 * Three-Wheeler DB Layer
 * All functions use the admin client (bypasses RLS — auth enforced at API layer).
 */

import {
    DEFAULT_DB_PAGE_SIZE,
    db,
    dealerScopedActiveQuery,
    getById,
    insertAndReturnId,
    runPagedQuery,
    updateDealerScoped,
} from '@/lib/db/query-helpers'
import type {
    ThreeWheelerVehicle,
    ThreeWheelerUsedVehicle,
    ThreeWheelerLead,
    ThreeWheelerServiceBooking,
    ThreeWheelerBooking,
    ThreeWheelerFilters,
    ThreeWheelerUsedFilters,
    ThreeWheelerVehiclePayload,
    ThreeWheelerUsedVehiclePayload,
    ThreeWheelerLeadStatus,
    ThreeWheelerServiceStatus,
} from '@/lib/types/three-wheeler'
import {
    applyUsedVehiclePriceOffersToRecords,
    fetchActiveUsedVehiclePriceOffers,
} from '@/lib/services/used-vehicle-price-offers'

const DEFAULT_PAGE_SIZE = DEFAULT_DB_PAGE_SIZE
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// ── New Inventory ─────────────────────────────────────────────

export async function getThreeWheelerVehicles(
    dealerId: string,
    filters: ThreeWheelerFilters = {}
): Promise<{ vehicles: ThreeWheelerVehicle[]; total: number }> {
    const {
        type, brand, fuelType, bodyType, stockStatus,
        minPrice, maxPrice,
        permitType, minPayload, maxPayload,
        sortBy = 'newest',
        page = 1,
        pageSize = DEFAULT_PAGE_SIZE,
    } = filters

    let query = dealerScopedActiveQuery('thw_vehicles', dealerId)

    if (type)        query = query.eq('type', type)
    if (brand)       query = query.ilike('brand', `%${brand}%`)
    if (fuelType)    query = query.eq('fuel_type', fuelType)
    if (bodyType)    query = query.eq('body_type', bodyType)
    if (stockStatus) query = query.eq('stock_status', stockStatus)
    if (minPrice)    query = query.gte('ex_showroom_price_paise', minPrice)
    if (maxPrice)    query = query.lte('ex_showroom_price_paise', maxPrice)
    if (permitType)  query = query.eq('permit_type', permitType)
    if (minPayload)  query = query.gte('payload_kg', minPayload)
    if (maxPayload)  query = query.lte('payload_kg', maxPayload)

    const orderMap: Record<string, { column: string; asc: boolean }> = {
        price_asc:  { column: 'ex_showroom_price_paise', asc: true  },
        price_desc: { column: 'ex_showroom_price_paise', asc: false },
        views:      { column: 'views',      asc: false },
        newest:     { column: 'created_at', asc: false },
    }
    const order = orderMap[sortBy] ?? orderMap.newest
    query = query.order(order.column, { ascending: order.asc })

    return runPagedQuery<ThreeWheelerVehicle, 'vehicles'>(query, page, pageSize, 'vehicles', 'getThreeWheelerVehicles')
}

export async function getThreeWheelerVehicleById(id: string, dealerId?: string): Promise<ThreeWheelerVehicle | null> {
    if (!UUID_RE.test(id)) return null
    return getById<ThreeWheelerVehicle>('thw_vehicles', id, dealerId)
}

export async function addThreeWheelerVehicle(
    dealerId: string,
    payload: Omit<ThreeWheelerVehiclePayload, 'dealer_id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    return insertAndReturnId('thw_vehicles', { ...payload, dealer_id: dealerId })
}

export async function updateThreeWheelerVehicle(
    id: string,
    dealerId: string,
    payload: Partial<ThreeWheelerVehiclePayload>
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('thw_vehicles', id, dealerId, payload)
}

export async function deleteThreeWheelerVehicle(
    id: string,
    dealerId: string
): Promise<{ success: boolean; error?: string }> {
    return updateThreeWheelerVehicle(id, dealerId, { status: 'inactive' })
}

export async function incrementThreeWheelerViews(id: string): Promise<void> {
    await db().rpc('increment_thw_vehicle_view', { vehicle_id: id })
}

// ── Used Stock ────────────────────────────────────────────────

export async function getUsedThreeWheelers(
    dealerId: string,
    filters: ThreeWheelerUsedFilters = {}
): Promise<{ vehicles: ThreeWheelerUsedVehicle[]; total: number }> {
    const {
        type, brand, fuelType, conditionGrade,
        maxKm, minPrice, maxPrice,
        sortBy = 'newest',
        page = 1,
        pageSize = DEFAULT_PAGE_SIZE,
    } = filters

    let query = db()
        .from('thw_used_vehicles')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .eq('status', 'available')

    if (type)           query = query.eq('type', type)
    if (brand)          query = query.ilike('brand', `%${brand}%`)
    if (fuelType)       query = query.eq('fuel_type', fuelType)
    if (conditionGrade) query = query.eq('condition_grade', conditionGrade)
    if (maxKm)          query = query.lte('km_driven', maxKm)
    if (minPrice)       query = query.gte('price_paise', minPrice)
    if (maxPrice)       query = query.lte('price_paise', maxPrice)

    const orderMap: Record<string, { column: string; asc: boolean }> = {
        price_asc:  { column: 'price_paise', asc: true  },
        price_desc: { column: 'price_paise', asc: false },
        newest:     { column: 'created_at',  asc: false },
    }
    const order = orderMap[sortBy] ?? orderMap.newest
    query = query.order(order.column, { ascending: order.asc })

    const result = await runPagedQuery<ThreeWheelerUsedVehicle, 'vehicles'>(query, page, pageSize, 'vehicles', 'getUsedThreeWheelers')
    const offers = await fetchActiveUsedVehiclePriceOffers(dealerId)
    return {
        ...result,
        vehicles: applyUsedVehiclePriceOffersToRecords(result.vehicles, offers, '3w'),
    }
}

export async function getUsedThreeWheelerById(id: string, dealerId?: string): Promise<ThreeWheelerUsedVehicle | null> {
    const vehicle = await getById<ThreeWheelerUsedVehicle>('thw_used_vehicles', id, dealerId)
    if (!vehicle || !dealerId) return vehicle
    const offers = await fetchActiveUsedVehiclePriceOffers(dealerId)
    return applyUsedVehiclePriceOffersToRecords([vehicle], offers, '3w')[0] ?? vehicle
}

export async function addUsedThreeWheeler(
    dealerId: string,
    payload: Omit<ThreeWheelerUsedVehiclePayload, 'dealer_id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    return insertAndReturnId('thw_used_vehicles', { ...payload, dealer_id: dealerId })
}

export async function updateUsedThreeWheeler(
    id: string,
    dealerId: string,
    payload: Partial<ThreeWheelerUsedVehiclePayload>
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('thw_used_vehicles', id, dealerId, payload)
}

export async function deleteUsedThreeWheeler(
    id: string,
    dealerId: string
): Promise<{ success: boolean; error?: string }> {
    return updateUsedThreeWheeler(id, dealerId, { status: 'sold' })
}

// ── Leads ─────────────────────────────────────────────────────

export async function createThreeWheelerLead(
    payload: Omit<ThreeWheelerLead, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    return insertAndReturnId('thw_leads', payload)
}

export async function getThreeWheelerLeads(
    dealerId: string,
    filters: { status?: ThreeWheelerLeadStatus; page?: number; pageSize?: number } = {}
): Promise<{ leads: ThreeWheelerLead[]; total: number }> {
    const { status, page = 1, pageSize = 50 } = filters
    let query = db()
        .from('thw_leads')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    return runPagedQuery<ThreeWheelerLead, 'leads'>(query, page, pageSize, 'leads', 'getThreeWheelerLeads')
}

export async function updateThreeWheelerLeadStatus(
    id: string,
    dealerId: string,
    status: ThreeWheelerLeadStatus
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('thw_leads', id, dealerId, { status })
}

// ── Service Bookings ──────────────────────────────────────────

export async function createThreeWheelerServiceBooking(
    payload: Omit<ThreeWheelerServiceBooking, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    return insertAndReturnId('thw_service_bookings', payload)
}

export async function getThreeWheelerServiceBookings(
    dealerId: string,
    filters: { status?: ThreeWheelerServiceStatus; page?: number; pageSize?: number } = {}
): Promise<{ bookings: ThreeWheelerServiceBooking[]; total: number }> {
    const { status, page = 1, pageSize = 50 } = filters
    let query = db()
        .from('thw_service_bookings')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('preferred_date', { ascending: true })

    if (status) query = query.eq('status', status)

    return runPagedQuery<ThreeWheelerServiceBooking, 'bookings'>(query, page, pageSize, 'bookings', 'getThreeWheelerServiceBookings')
}

export async function updateThreeWheelerServiceBookingStatus(
    id: string,
    dealerId: string,
    status: ThreeWheelerServiceStatus
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('thw_service_bookings', id, dealerId, { status })
}

// ── Payment Bookings ──────────────────────────────────────────

export async function createThreeWheelerBooking(
    payload: Omit<ThreeWheelerBooking, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; booking?: ThreeWheelerBooking; error?: string }> {
    const { data, error } = await db()
        .from('thw_bookings')
        .insert(payload)
        .select('*')
        .single()

    if (error) {
        if (error.code === '23505') {
            // Duplicate idempotency key — return existing booking
            const { data: existing } = await db()
                .from('thw_bookings')
                .select('*')
                .eq('idempotency_key', payload.idempotency_key)
                .single()
            return { success: true, booking: existing as unknown as ThreeWheelerBooking }
        }
        return { success: false, error: error.message }
    }
    return { success: true, booking: data as unknown as ThreeWheelerBooking }
}

export async function updateThreeWheelerBookingPayment(
    idempotencyKey: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    status: 'paid' | 'failed'
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('thw_bookings')
        .update({ razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, status })
        .eq('idempotency_key', idempotencyKey)
    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function getThreeWheelerBookings(
    dealerId: string,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE
): Promise<{ bookings: ThreeWheelerBooking[]; total: number }> {
    const query = db()
        .from('thw_bookings')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

    return runPagedQuery<ThreeWheelerBooking, 'bookings'>(query, page, pageSize, 'bookings', 'getThreeWheelerBookings')
}
