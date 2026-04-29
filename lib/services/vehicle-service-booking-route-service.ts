import { NextRequest, NextResponse } from 'next/server'
import {
    readRouteJson,
    requireDealerAccount,
    SafeParseResult,
    updateDealerScopedStatus,
} from '@/lib/services/vehicle-route-service-utils'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

type ServiceBookingData = {
    dealer_id: string
    customer_name: string
    phone: string
    service_type: string
    preferred_date: string
    preferred_slot: string
    vehicle_make?: string | null
    vehicle_model?: string | null
    vehicle_year?: number | null
    vehicle_reg_no?: string | null
    km_reading?: number | null
}

type ServiceBookingRouteOptions<TBooking extends ServiceBookingData, TFilters, TStatus extends string, TCreatePayload> = {
    rateLimitKey: string
    invalidJsonMessage?: string
    parseBooking: (body: unknown) => SafeParseResult<TBooking>
    formatParseError: (error: unknown) => string
    buildCreatePayload: (data: TBooking) => TCreatePayload
    createBooking: (payload: TCreatePayload) => Promise<{ success: boolean; id?: string; error?: string }>
    createErrorStatus: number
    buildFilters: (searchParams: URLSearchParams) => TFilters
    getBookings: (dealerId: string, filters: TFilters) => Promise<unknown>
    parsePatch: (body: unknown) => SafeParseResult<{ id: string; status: TStatus }>
    updateBookingStatus: (id: string, dealerId: string, status: TStatus) => Promise<{ success: boolean; error?: string }>
}

type PaymentBookingsOptions = {
    getBookings: (dealerId: string, page: number, pageSize: number) => Promise<unknown>
}

export async function createVehicleServiceBooking<TBooking extends ServiceBookingData, TFilters, TStatus extends string, TCreatePayload>(
    request: NextRequest,
    options: ServiceBookingRouteOptions<TBooking, TFilters, TStatus, TCreatePayload>
) {
    const rateLimit = await rateLimitOrNull(options.rateLimitKey, request, 5, 10 * 60 * 1000)
    if (rateLimit) return rateLimit

    const body = await readRouteJson(request, options.invalidJsonMessage)
    if (body instanceof NextResponse) return body

    const parsed = options.parseBooking(body)
    if (!parsed.success) {
        return NextResponse.json({ error: options.formatParseError(parsed.error) }, { status: 400 })
    }

    const result = await options.createBooking(options.buildCreatePayload(parsed.data))
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: options.createErrorStatus })
    }
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}

export async function listVehicleServiceBookings<TBooking extends ServiceBookingData, TFilters, TStatus extends string, TCreatePayload>(
    request: NextRequest,
    options: ServiceBookingRouteOptions<TBooking, TFilters, TStatus, TCreatePayload>
) {
    const { dealer, errorResponse } = await requireDealerAccount()
    if (errorResponse) return errorResponse

    const { searchParams } = new URL(request.url)
    const result = await options.getBookings(dealer.id, options.buildFilters(searchParams))
    return NextResponse.json(result)
}

export async function updateVehicleServiceBookingStatus<TBooking extends ServiceBookingData, TFilters, TStatus extends string, TCreatePayload>(
    request: NextRequest,
    options: ServiceBookingRouteOptions<TBooking, TFilters, TStatus, TCreatePayload>
) {
    return updateDealerScopedStatus(request, {
        parsePatch: options.parsePatch,
        formatParseError: options.formatParseError,
        updateStatus: options.updateBookingStatus,
    })
}

export async function listVehiclePaymentBookings(
    request: NextRequest,
    options: PaymentBookingsOptions
) {
    const { dealer, errorResponse } = await requireDealerAccount()
    if (errorResponse) return errorResponse

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20
    const result = await options.getBookings(dealer.id, page, pageSize)
    return NextResponse.json(result)
}

export function createVehicleServiceBookingRouteHandlers<TBooking extends ServiceBookingData, TFilters, TStatus extends string, TCreatePayload>(
    options: ServiceBookingRouteOptions<TBooking, TFilters, TStatus, TCreatePayload>
) {
    return {
        POST: (request: NextRequest) => createVehicleServiceBooking(request, options),
        GET: (request: NextRequest) => listVehicleServiceBookings(request, options),
        PATCH: (request: NextRequest) => updateVehicleServiceBookingStatus(request, options),
    }
}
