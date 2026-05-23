/**
 * Two-Wheeler DB Layer
 * All database access functions for the 2W dealership module.
 * Server-side only — uses createAdminClient() for trusted operations
 * and createRouteClient() for user-scoped reads.
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
import {
    applyUsedVehiclePriceOffersToRecords,
    fetchActiveUsedVehiclePriceOffers,
} from '@/lib/services/used-vehicle-price-offers'

// ── Helpers ───────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = DEFAULT_DB_PAGE_SIZE

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

    let query = dealerScopedActiveQuery('tw_vehicles', dealerId)

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

    return runPagedQuery<TwoWheelerVehicle, 'vehicles'>(query, page, pageSize, 'vehicles', 'getTwoWheelerVehicles')
}

export async function getTwoWheelerVehicleById(
    id: string,
    dealerId?: string
): Promise<TwoWheelerVehicle | null> {
    return getById<TwoWheelerVehicle>('tw_vehicles', id, dealerId, 'getTwoWheelerVehicleById')
}

export async function addTwoWheelerVehicle(
    dealerId: string,
    payload: Omit<AddTwoWheelerVehiclePayload, 'dealer_id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    return insertAndReturnId('tw_vehicles', { ...payload, dealer_id: dealerId, status: 'active', views: 0 }, 'addTwoWheelerVehicle')
}

export async function updateTwoWheelerVehicle(
    id: string,
    dealerId: string,
    payload: Partial<Omit<TwoWheelerVehicle, 'id' | 'dealer_id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('tw_vehicles', id, dealerId, payload, 'updateTwoWheelerVehicle')
}

export async function deleteTwoWheelerVehicle(
    id: string,
    dealerId: string
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('tw_vehicles', id, dealerId, { status: 'inactive' }, 'deleteTwoWheelerVehicle')
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

    const result = await runPagedQuery<TwoWheelerUsedVehicle, 'vehicles'>(query, page, pageSize, 'vehicles', 'getUsedTwoWheelers')
    const offers = await fetchActiveUsedVehiclePriceOffers(dealerId)
    return {
        ...result,
        vehicles: applyUsedVehiclePriceOffersToRecords(result.vehicles, offers, '2w'),
    }
}

export async function getUsedTwoWheelerById(
    id: string,
    dealerId?: string
): Promise<TwoWheelerUsedVehicle | null> {
    const vehicle = await getById<TwoWheelerUsedVehicle>('tw_used_vehicles', id, dealerId, 'getUsedTwoWheelerById')
    if (!vehicle || !dealerId) return vehicle
    const offers = await fetchActiveUsedVehiclePriceOffers(dealerId)
    return applyUsedVehiclePriceOffersToRecords([vehicle], offers, '2w')[0] ?? vehicle
}

export async function addUsedTwoWheeler(
    dealerId: string,
    payload: Omit<AddTwoWheelerUsedVehiclePayload, 'dealer_id'>
): Promise<{ success: boolean; id?: string; error?: string }> {
    return insertAndReturnId('tw_used_vehicles', { ...payload, dealer_id: dealerId, status: 'available' }, 'addUsedTwoWheeler')
}

export async function updateUsedTwoWheeler(
    id: string,
    dealerId: string,
    payload: Partial<Omit<TwoWheelerUsedVehicle, 'id' | 'dealer_id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('tw_used_vehicles', id, dealerId, payload, 'updateUsedTwoWheeler')
}

export async function deleteUsedTwoWheeler(
    id: string,
    dealerId: string
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('tw_used_vehicles', id, dealerId, { status: 'sold' }, 'deleteUsedTwoWheeler')
}

// ── tw_leads ──────────────────────────────────────────────────

export async function createTwoWheelerLead(
    payload: CreateTwoWheelerLeadPayload
): Promise<{ success: boolean; id?: string; error?: string }> {
    return insertAndReturnId('tw_leads', { ...payload, status: 'new' }, 'createTwoWheelerLead')
}

export async function getTwoWheelerLeads(
    dealerId: string,
    filters: TwoWheelerLeadFilters = {}
): Promise<{ leads: TwoWheelerLead[]; total: number }> {
    const { leadType, status, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters

    let query = db()
        .from('tw_leads')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

    if (leadType) query = query.eq('lead_type', leadType)
    if (status)   query = query.eq('status', status)

    return runPagedQuery<TwoWheelerLead, 'leads'>(query, page, pageSize, 'leads', 'getTwoWheelerLeads')
}

export async function updateTwoWheelerLeadStatus(
    id: string,
    dealerId: string,
    status: TwoWheelerLeadStatus
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('tw_leads', id, dealerId, { status }, 'updateTwoWheelerLeadStatus')
}

// ── tw_service_bookings ───────────────────────────────────────

export async function createServiceBooking(
    payload: CreateServiceBookingPayload
): Promise<{ success: boolean; id?: string; error?: string }> {
    return insertAndReturnId('tw_service_bookings', { ...payload, status: 'pending' }, 'createServiceBooking')
}

export async function getServiceBookings(
    dealerId: string,
    filters: ServiceBookingFilters = {}
): Promise<{ bookings: TwoWheelerServiceBooking[]; total: number }> {
    const { status, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters

    let query = db()
        .from('tw_service_bookings')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    return runPagedQuery<TwoWheelerServiceBooking, 'bookings'>(query, page, pageSize, 'bookings', 'getServiceBookings')
}

export async function updateServiceBookingStatus(
    id: string,
    dealerId: string,
    status: TwoWheelerServiceStatus
): Promise<{ success: boolean; error?: string }> {
    return updateDealerScoped('tw_service_bookings', id, dealerId, { status }, 'updateServiceBookingStatus')
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
            return { success: true, id: typeof existing?.id === 'string' ? existing.id : undefined }
        }
        console.error('[createTwoWheelerBooking]', error.message)
        return { success: false, error: error.message }
    }
    return { success: true, id: typeof data?.id === 'string' ? data.id : undefined }
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
    const query = db()
        .from('tw_bookings')
        .select('*', { count: 'exact' })
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

    return runPagedQuery<TwoWheelerBooking, 'bookings'>(query, page, pageSize, 'bookings', 'getTwoWheelerBookings')
}
