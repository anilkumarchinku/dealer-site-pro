/**
 * Two-Wheeler DB Layer
 * All database access functions for the 2W dealership module.
 * Server-side only — uses createAdminClient() for trusted operations
 * and createRouteClient() for user-scoped reads.
 */

import { createAdminClient } from '@/lib/supabase-server'
import type {
    TwoWheelerVehicle,
    TwoWheelerUsedVehicle,
    TwoWheelerLead,
    TwoWheelerServiceBooking,
    TwoWheelerBooking,
    TwoWheelerFilters,
    TwoWheelerUsedFilters,
    TwoWheelerLeadFilters,
    ServiceBookingFilters,
    AddTwoWheelerVehiclePayload,
    AddTwoWheelerUsedVehiclePayload,
    CreateTwoWheelerLeadPayload,
    CreateServiceBookingPayload,
    CreateTwoWheelerBookingPayload,
    TwoWheelerLeadStatus,
    TwoWheelerServiceStatus,
    TwoWheelerBookingStatus,
} from '@/lib/types/two-wheeler'

// ── Helpers ───────────────────────────────────────────────────

function db() {
    return createAdminClient()
}

const DEFAULT_PAGE_SIZE = 20

// ── tw_vehicles — New 2W Inventory ───────────────────────────

export async function getTwoWheelerVehicles(
    dealerId: string,
    filters: TwoWheelerFilters = {}
): Promise<{ vehicles: TwoWheelerVehicle[]; total: number }> {
    const {
        type,
        brand,
        fuelType,
        minPrice,
        maxPrice,
        stockStatus,
        sortBy = 'newest',
        page = 1,
        pageSize = DEFAULT_PAGE_SIZE,
    } = filters

    const from = (page - 1) * pageSize
    const to   = from + pageSize - 1

    let query = db()
        .from('tw_vehicles')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .eq('status', 'active')

    if (type)        query = query.eq('type', type)
    if (brand)       query = query.ilike('brand', `%${brand}%`)
    if (fuelType)    query = query.eq('fuel_type', fuelType)
    if (stockStatus) query = query.eq('stock_status', stockStatus)
    if (minPrice != null) query = query.gte('ex_showroom_price_paise', minPrice)
    if (maxPrice != null) query = query.lte('ex_showroom_price_paise', maxPrice)

    if (sortBy === 'price_asc')  query = query.order('ex_showroom_price_paise', { ascending: true })
    else if (sortBy === 'price_desc') query = query.order('ex_showroom_price_paise', { ascending: false })
    else if (sortBy === 'views') query = query.order('views', { ascending: false })
    else                         query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query.range(from, to)

    if (error) {
        console.error('[getTwoWheelerVehicles]', error.message)
        return { vehicles: [], total: 0 }
    }
    return { vehicles: (data ?? []) as unknown as TwoWheelerVehicle[], total: count ?? 0 }
}

export async function getTwoWheelerVehicleById(
    id: string,
    dealerId?: string
): Promise<TwoWheelerVehicle | null> {
    let query = db()
        .from('tw_vehicles')
        .select('*')
        .eq('id', id)
    if (dealerId) query = query.eq('dealer_id', dealerId)
    const { data, error } = await query.single()

    if (error) {
        console.error('[getTwoWheelerVehicleById]', error.message)
        return null
    }
    return data as unknown as TwoWheelerVehicle
}

export async function addTwoWheelerVehicle(
    dealerId: string,
    payload: Omit<AddTwoWheelerVehiclePayload, 'dealer_id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await db()
        .from('tw_vehicles')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ ...payload, dealer_id: dealerId, status: 'active', views: 0 } as any)
        .select('id')
        .single()

    if (error) {
        console.error('[addTwoWheelerVehicle]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true, id: data.id }
}

export async function updateTwoWheelerVehicle(
    id: string,
    dealerId: string,
    payload: Partial<Omit<TwoWheelerVehicle, 'id' | 'dealer_id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('tw_vehicles')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(payload as any)
        .eq('id', id)
        .eq('dealer_id', dealerId)

    if (error) {
        console.error('[updateTwoWheelerVehicle]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true }
}

export async function deleteTwoWheelerVehicle(
    id: string,
    dealerId: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('tw_vehicles')
        .update({ status: 'inactive' })
        .eq('id', id)
        .eq('dealer_id', dealerId)

    if (error) {
        console.error('[deleteTwoWheelerVehicle]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true }
}

export async function incrementTwoWheelerViews(id: string): Promise<void> {
    await db().rpc('increment_tw_vehicle_view', { vehicle_id: id })
}

// ── tw_used_vehicles — Used 2W Stock ─────────────────────────

export async function getUsedTwoWheelers(
    dealerId: string,
    filters: TwoWheelerUsedFilters = {}
): Promise<{ vehicles: TwoWheelerUsedVehicle[]; total: number }> {
    const {
        type,
        brand,
        fuelType,
        minPrice,
        maxPrice,
        conditionGrade,
        maxKm,
        sortBy = 'newest',
        page = 1,
        pageSize = DEFAULT_PAGE_SIZE,
    } = filters

    const from = (page - 1) * pageSize
    const to   = from + pageSize - 1

    let query = db()
        .from('tw_used_vehicles')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .neq('status', 'sold')

    if (type)           query = query.eq('type', type)
    if (brand)          query = query.ilike('brand', `%${brand}%`)
    if (fuelType)       query = query.eq('fuel_type', fuelType)
    if (conditionGrade) query = query.eq('condition_grade', conditionGrade)
    if (minPrice != null) query = query.gte('price_paise', minPrice)
    if (maxPrice != null) query = query.lte('price_paise', maxPrice)
    if (maxKm != null)    query = query.lte('km_driven', maxKm)

    if (sortBy === 'price_asc')  query = query.order('price_paise', { ascending: true })
    else if (sortBy === 'price_desc') query = query.order('price_paise', { ascending: false })
    else if (sortBy === 'km_asc')     query = query.order('km_driven', { ascending: true })
    else                              query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query.range(from, to)

    if (error) {
        console.error('[getUsedTwoWheelers]', error.message)
        return { vehicles: [], total: 0 }
    }
    return { vehicles: (data ?? []) as TwoWheelerUsedVehicle[], total: count ?? 0 }
}

export async function getUsedTwoWheelerById(
    id: string,
    dealerId?: string
): Promise<TwoWheelerUsedVehicle | null> {
    let query = db()
        .from('tw_used_vehicles')
        .select('*')
        .eq('id', id)
    if (dealerId) query = query.eq('dealer_id', dealerId)
    const { data, error } = await query.single()

    if (error) {
        console.error('[getUsedTwoWheelerById]', error.message)
        return null
    }
    return data as TwoWheelerUsedVehicle
}

export async function addUsedTwoWheeler(
    dealerId: string,
    payload: Omit<AddTwoWheelerUsedVehiclePayload, 'dealer_id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await db()
        .from('tw_used_vehicles')
        .insert({ ...payload, dealer_id: dealerId, status: 'available' })
        .select('id')
        .single()

    if (error) {
        console.error('[addUsedTwoWheeler]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true, id: data.id }
}

export async function updateUsedTwoWheeler(
    id: string,
    dealerId: string,
    payload: Partial<Omit<TwoWheelerUsedVehicle, 'id' | 'dealer_id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('tw_used_vehicles')
        .update(payload)
        .eq('id', id)
        .eq('dealer_id', dealerId)

    if (error) {
        console.error('[updateUsedTwoWheeler]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true }
}

export async function deleteUsedTwoWheeler(
    id: string,
    dealerId: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('tw_used_vehicles')
        .update({ status: 'sold' })
        .eq('id', id)
        .eq('dealer_id', dealerId)

    if (error) {
        console.error('[deleteUsedTwoWheeler]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true }
}

// ── tw_leads ──────────────────────────────────────────────────

export async function createTwoWheelerLead(
    payload: CreateTwoWheelerLeadPayload
): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await db()
        .from('tw_leads')
        .insert({ ...payload, status: 'new' })
        .select('id')
        .single()

    if (error) {
        console.error('[createTwoWheelerLead]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true, id: data.id }
}

export async function getTwoWheelerLeads(
    dealerId: string,
    filters: TwoWheelerLeadFilters = {}
): Promise<{ leads: TwoWheelerLead[]; total: number }> {
    const { leadType, status, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters
    const from = (page - 1) * pageSize
    const to   = from + pageSize - 1

    let query = db()
        .from('tw_leads')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

    if (leadType) query = query.eq('lead_type', leadType)
    if (status)   query = query.eq('status', status)

    const { data, error, count } = await query.range(from, to)

    if (error) {
        console.error('[getTwoWheelerLeads]', error.message)
        return { leads: [], total: 0 }
    }
    return { leads: (data ?? []) as TwoWheelerLead[], total: count ?? 0 }
}

export async function updateTwoWheelerLeadStatus(
    id: string,
    dealerId: string,
    status: TwoWheelerLeadStatus
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('tw_leads')
        .update({ status })
        .eq('id', id)
        .eq('dealer_id', dealerId)

    if (error) {
        console.error('[updateTwoWheelerLeadStatus]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true }
}

// ── tw_service_bookings ───────────────────────────────────────

export async function createServiceBooking(
    payload: CreateServiceBookingPayload
): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await db()
        .from('tw_service_bookings')
        .insert({ ...payload, status: 'pending' })
        .select('id')
        .single()

    if (error) {
        console.error('[createServiceBooking]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true, id: data.id }
}

export async function getServiceBookings(
    dealerId: string,
    filters: ServiceBookingFilters = {}
): Promise<{ bookings: TwoWheelerServiceBooking[]; total: number }> {
    const { status, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters
    const from = (page - 1) * pageSize
    const to   = from + pageSize - 1

    let query = db()
        .from('tw_service_bookings')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, error, count } = await query.range(from, to)

    if (error) {
        console.error('[getServiceBookings]', error.message)
        return { bookings: [], total: 0 }
    }
    return { bookings: (data ?? []) as TwoWheelerServiceBooking[], total: count ?? 0 }
}

export async function updateServiceBookingStatus(
    id: string,
    dealerId: string,
    status: TwoWheelerServiceStatus
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('tw_service_bookings')
        .update({ status })
        .eq('id', id)
        .eq('dealer_id', dealerId)

    if (error) {
        console.error('[updateServiceBookingStatus]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true }
}

// ── tw_bookings (Razorpay) ────────────────────────────────────

export async function createTwoWheelerBooking(
    payload: CreateTwoWheelerBookingPayload
): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await db()
        .from('tw_bookings')
        .insert({
            ...payload,
            status: 'pending',
            razorpay_order_id:  null,
            razorpay_payment_id: null,
        })
        .select('id')
        .single()

    if (error) {
        // Unique constraint on idempotency_key — return idempotent success
        if (error.code === '23505') {
            const { data: existing } = await db()
                .from('tw_bookings')
                .select('id')
                .eq('idempotency_key', payload.idempotency_key)
                .single()
            return { success: true, id: existing?.id }
        }
        console.error('[createTwoWheelerBooking]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true, id: data.id }
}

export async function updateTwoWheelerBookingPayment(
    idempotencyKey:    string,
    razorpayOrderId:   string,
    razorpayPaymentId: string,
    status:            TwoWheelerBookingStatus
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db()
        .from('tw_bookings')
        .update({ razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, status })
        .eq('idempotency_key', idempotencyKey)

    if (error) {
        console.error('[updateTwoWheelerBookingPayment]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true }
}

export async function getTwoWheelerBookings(
    dealerId: string,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE
): Promise<{ bookings: TwoWheelerBooking[]; total: number }> {
    const from = (page - 1) * pageSize
    const to   = from + pageSize - 1

    const { data, error, count } = await db()
        .from('tw_bookings')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        console.error('[getTwoWheelerBookings]', error.message)
        return { bookings: [], total: 0 }
    }
    return { bookings: (data ?? []) as TwoWheelerBooking[], total: count ?? 0 }
}
