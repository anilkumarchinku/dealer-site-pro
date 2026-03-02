/**
 * Three-Wheeler DB Layer
 * All functions use the admin client (bypasses RLS — auth enforced at API layer).
 */

import { createAdminClient } from '@/lib/supabase-server'
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

const DEFAULT_PAGE_SIZE = 20
const db = () => createAdminClient()

// ── New Inventory ─────────────────────────────────────────────

export async function getThreeWheelerVehicles(
    dealerId: string,
    filters: ThreeWheelerFilters = {}
): Promise<{ vehicles: ThreeWheelerVehicle[]; total: number }> {
    const {
        type, brand, fuelType, bodyType, stockStatus,
        minPrice, maxPrice,
        sortBy = 'newest',
        page = 1,
        pageSize = DEFAULT_PAGE_SIZE,
    } = filters

    let query = db()
        .from('thw_vehicles')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .eq('status', 'active')

    if (type)        query = query.eq('type', type)
    if (brand)       query = query.ilike('brand', `%${brand}%`)
    if (fuelType)    query = query.eq('fuel_type', fuelType)
    if (bodyType)    query = query.eq('body_type', bodyType)
    if (stockStatus) query = query.eq('stock_status', stockStatus)
    if (minPrice)    query = query.gte('ex_showroom_price_paise', minPrice)
    if (maxPrice)    query = query.lte('ex_showroom_price_paise', maxPrice)

    const orderMap: Record<string, { column: string; asc: boolean }> = {
        price_asc:  { column: 'ex_showroom_price_paise', asc: true  },
        price_desc: { column: 'ex_showroom_price_paise', asc: false },
        views:      { column: 'views',      asc: false },
        newest:     { column: 'created_at', asc: false },
    }
    const order = orderMap[sortBy] ?? orderMap.newest
    query = query.order(order.column, { ascending: order.asc })

    const from = (page - 1) * pageSize
    const { data, error, count } = await query.range(from, from + pageSize - 1)

    if (error) {
        console.error('[getThreeWheelerVehicles]', error.message)
        return { vehicles: [], total: 0 }
    }
    return { vehicles: (data ?? []) as ThreeWheelerVehicle[], total: count ?? 0 }
}

export async function getThreeWheelerVehicleById(id: string): Promise<ThreeWheelerVehicle | null> {
    const { data, error } = await db()
        .from('thw_vehicles')
        .select('*')
        .eq('id', id)
        .single()
    if (error) return null
    return data as ThreeWheelerVehicle
}

export async function addThreeWheelerVehicle(
    dealerId: string,
    payload: Omit<ThreeWheelerVehiclePayload, 'dealer_id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await db()
        .from('thw_vehicles')
        .insert({ ...payload, dealer_id: dealerId })
        .select('id')
        .single()
    if (error) return { success: false, error: error.message }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: true, id: (data as any).id }
}

export async function updateThreeWheelerVehicle(
    id: string,
    dealerId: string,
    payload: Partial<ThreeWheelerVehiclePayload>
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('thw_vehicles')
        .update(payload)
        .eq('id', id)
        .eq('dealer_id', dealerId)
    if (error) return { success: false, error: error.message }
    return { success: true }
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

    const from = (page - 1) * pageSize
    const { data, error, count } = await query.range(from, from + pageSize - 1)

    if (error) {
        console.error('[getUsedThreeWheelers]', error.message)
        return { vehicles: [], total: 0 }
    }
    return { vehicles: (data ?? []) as ThreeWheelerUsedVehicle[], total: count ?? 0 }
}

export async function getUsedThreeWheelerById(id: string): Promise<ThreeWheelerUsedVehicle | null> {
    const { data, error } = await db()
        .from('thw_used_vehicles')
        .select('*')
        .eq('id', id)
        .single()
    if (error) return null
    return data as ThreeWheelerUsedVehicle
}

export async function addUsedThreeWheeler(
    dealerId: string,
    payload: Omit<ThreeWheelerUsedVehiclePayload, 'dealer_id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await db()
        .from('thw_used_vehicles')
        .insert({ ...payload, dealer_id: dealerId })
        .select('id')
        .single()
    if (error) return { success: false, error: error.message }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: true, id: (data as any).id }
}

export async function updateUsedThreeWheeler(
    id: string,
    dealerId: string,
    payload: Partial<ThreeWheelerUsedVehiclePayload>
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('thw_used_vehicles')
        .update(payload)
        .eq('id', id)
        .eq('dealer_id', dealerId)
    if (error) return { success: false, error: error.message }
    return { success: true }
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
    const { data, error } = await db()
        .from('thw_leads')
        .insert(payload)
        .select('id')
        .single()
    if (error) return { success: false, error: error.message }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: true, id: (data as any).id }
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

    const from = (page - 1) * pageSize
    const { data, error, count } = await query.range(from, from + pageSize - 1)

    if (error) {
        console.error('[getThreeWheelerLeads]', error.message)
        return { leads: [], total: 0 }
    }
    return { leads: (data ?? []) as ThreeWheelerLead[], total: count ?? 0 }
}

export async function updateThreeWheelerLeadStatus(
    id: string,
    dealerId: string,
    status: ThreeWheelerLeadStatus
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('thw_leads')
        .update({ status })
        .eq('id', id)
        .eq('dealer_id', dealerId)
    if (error) return { success: false, error: error.message }
    return { success: true }
}

// ── Service Bookings ──────────────────────────────────────────

export async function createThreeWheelerServiceBooking(
    payload: Omit<ThreeWheelerServiceBooking, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await db()
        .from('thw_service_bookings')
        .insert(payload)
        .select('id')
        .single()
    if (error) return { success: false, error: error.message }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: true, id: (data as any).id }
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

    const from = (page - 1) * pageSize
    const { data, error, count } = await query.range(from, from + pageSize - 1)

    if (error) {
        console.error('[getThreeWheelerServiceBookings]', error.message)
        return { bookings: [], total: 0 }
    }
    return { bookings: (data ?? []) as ThreeWheelerServiceBooking[], total: count ?? 0 }
}

export async function updateThreeWheelerServiceBookingStatus(
    id: string,
    dealerId: string,
    status: ThreeWheelerServiceStatus
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('thw_service_bookings')
        .update({ status })
        .eq('id', id)
        .eq('dealer_id', dealerId)
    if (error) return { success: false, error: error.message }
    return { success: true }
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
            return { success: true, booking: existing as ThreeWheelerBooking }
        }
        return { success: false, error: error.message }
    }
    return { success: true, booking: data as ThreeWheelerBooking }
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
    const from = (page - 1) * pageSize
    const { data, error, count } = await db()
        .from('thw_bookings')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })
        .range(from, from + pageSize - 1)

    if (error) {
        console.error('[getThreeWheelerBookings]', error.message)
        return { bookings: [], total: 0 }
    }
    return { bookings: (data ?? []) as ThreeWheelerBooking[], total: count ?? 0 }
}
