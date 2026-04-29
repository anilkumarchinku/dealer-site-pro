import { NextRequest } from 'next/server'
import {
    createThreeWheelerServiceBooking,
    getThreeWheelerServiceBookings,
    updateThreeWheelerServiceBookingStatus,
} from '@/lib/db/three-wheelers'
import type { ThreeWheelerServiceStatus, ThreeWheelerServiceType } from '@/lib/types/three-wheeler'
import {
    createVehicleServiceBookingRouteHandlers,
} from '@/lib/services/vehicle-service-booking-route-service'

type ThreeWheelerServiceBookingInput = {
    dealer_id: string
    customer_name: string
    phone: string
    service_type: ThreeWheelerServiceType
    preferred_date: string
    preferred_slot: string
    vehicle_make: string | null
    vehicle_model: string | null
    vehicle_year: number | null
    vehicle_reg_no: string | null
    km_reading: number | null
}

function formatError(error: unknown): string {
    return String(error)
}

function asServiceBookingInput(body: unknown): ThreeWheelerServiceBookingInput | null {
    const data = body as Partial<ThreeWheelerServiceBookingInput> | null
    if (!data?.dealer_id || !data.customer_name || !data.phone || !data.service_type || !data.preferred_date || !data.preferred_slot) {
        return null
    }

    return {
        dealer_id: data.dealer_id,
        customer_name: data.customer_name,
        phone: data.phone,
        service_type: data.service_type as ThreeWheelerServiceType,
        preferred_date: data.preferred_date,
        preferred_slot: data.preferred_slot,
        vehicle_make: data.vehicle_make ?? null,
        vehicle_model: data.vehicle_model ?? null,
        vehicle_year: data.vehicle_year ?? null,
        vehicle_reg_no: data.vehicle_reg_no ?? null,
        km_reading: data.km_reading ?? null,
    }
}

const serviceBookingOptions = {
    rateLimitKey: 'thw_svc_create',
    invalidJsonMessage: 'Required fields missing',
    parseBooking: (body: unknown) => {
        const data = asServiceBookingInput(body)
        return data
            ? { success: true as const, data }
            : { success: false as const, error: 'Required fields missing' }
    },
    formatParseError: formatError,
    buildCreatePayload: (data: ThreeWheelerServiceBookingInput) => ({ status: 'pending' as const, ...data }),
    createBooking: createThreeWheelerServiceBooking,
    createErrorStatus: 400,
    buildFilters: (searchParams: URLSearchParams) => {
        const status = searchParams.get('status') as ThreeWheelerServiceStatus | null
        return {
            status: status ?? undefined,
            page: Number(searchParams.get('page') ?? 1),
            pageSize: Number(searchParams.get('pageSize') ?? 50),
        }
    },
    getBookings: getThreeWheelerServiceBookings,
    parsePatch: (body: unknown) => {
        const { id, status } = (body ?? {}) as { id?: string; status?: ThreeWheelerServiceStatus }
        return id && status
            ? { success: true as const, data: { id, status } }
            : { success: false as const, error: 'id and status required' }
    },
    updateBookingStatus: updateThreeWheelerServiceBookingStatus,
} as const

const handlers = createVehicleServiceBookingRouteHandlers(serviceBookingOptions)
export const POST = handlers.POST
export const GET = handlers.GET
export const PATCH = handlers.PATCH
