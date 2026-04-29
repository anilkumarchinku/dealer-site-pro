/**
 * POST /api/two-wheelers/service-booking  — Public (anon): book a service
 * GET  /api/two-wheelers/service-booking  — Dealer: list service bookings
 * PATCH                                   — Dealer: update booking status
 */

import { NextRequest } from 'next/server'
import type { z } from 'zod'
import { createServiceBooking, getServiceBookings, updateServiceBookingStatus } from '@/lib/db/two-wheelers'
import type { ServiceBookingFilters, TwoWheelerServiceStatus } from '@/lib/types/two-wheeler'
import { formatZodErrors, serviceBookingSchema, updateServiceStatusSchema } from '@/lib/validations/schemas'
import {
    createVehicleServiceBookingRouteHandlers,
} from '@/lib/services/vehicle-service-booking-route-service'

function formatError(error: unknown): string {
    return formatZodErrors(error as z.ZodError)
}

type ServiceBookingInput = z.infer<typeof serviceBookingSchema>

const serviceBookingOptions = {
    rateLimitKey: 'tw_service_booking',
    parseBooking: (body: unknown) => serviceBookingSchema.safeParse(body),
    formatParseError: formatError,
    buildCreatePayload: (data: ServiceBookingInput) => ({
        dealer_id: data.dealer_id,
        customer_name: data.customer_name,
        phone: data.phone,
        vehicle_make: data.vehicle_make ?? null,
        vehicle_model: data.vehicle_model ?? null,
        vehicle_year: data.vehicle_year ?? null,
        km_reading: data.km_reading ?? null,
        service_type: data.service_type,
        preferred_date: data.preferred_date,
        preferred_slot: data.preferred_slot,
    }),
    createBooking: createServiceBooking,
    createErrorStatus: 500,
    buildFilters: (searchParams: URLSearchParams): ServiceBookingFilters => ({
        status: searchParams.get('status') as TwoWheelerServiceStatus ?? undefined,
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }),
    getBookings: getServiceBookings,
    parsePatch: (body: unknown) => updateServiceStatusSchema.safeParse(body),
    updateBookingStatus: updateServiceBookingStatus,
} as const

const handlers = createVehicleServiceBookingRouteHandlers(serviceBookingOptions)
export const POST = handlers.POST
export const GET = handlers.GET
export const PATCH = handlers.PATCH
