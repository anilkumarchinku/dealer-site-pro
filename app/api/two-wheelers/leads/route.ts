/**
 * POST /api/two-wheelers/leads  — Public (anon): submit a 2W lead
 * GET  /api/two-wheelers/leads  — Dealer: fetch their leads
 */

import { NextRequest } from 'next/server'
import type { z } from 'zod'
import { createTwoWheelerLead, getTwoWheelerLeads, updateTwoWheelerLeadStatus } from '@/lib/db/two-wheelers'
import type { TwoWheelerLeadFilters, TwoWheelerLeadStatus } from '@/lib/types/two-wheeler'
import { formatZodErrors, twLeadSchema, updateLeadStatusSchema } from '@/lib/validations/schemas'
import {
    buildVehicleLeadPayload,
    createVehicleLeadRouteHandlers,
} from '@/lib/services/vehicle-lead-route-service'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

function formatError(error: unknown): string {
    return formatZodErrors(error as z.ZodError)
}

const leadOptions = {
    leadTable: 'tw_leads',
    parseLead: (body: unknown) => twLeadSchema.safeParse(body),
    formatParseError: formatError,
    buildCreatePayload: buildVehicleLeadPayload,
    createLead: createTwoWheelerLead,
    createErrorStatus: 500,
    buildFilters: (searchParams: URLSearchParams): TwoWheelerLeadFilters => ({
        leadType: searchParams.get('leadType') as TwoWheelerLeadFilters['leadType'] ?? undefined,
        status: searchParams.get('status') as TwoWheelerLeadStatus ?? undefined,
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }),
    getLeads: getTwoWheelerLeads,
    parsePatch: (body: unknown) => updateLeadStatusSchema.safeParse(body),
    updateLeadStatus: updateTwoWheelerLeadStatus,
} as const

const handlers = createVehicleLeadRouteHandlers(leadOptions)
export async function POST(request: NextRequest) {
    const limited = await rateLimitOrNull("vehicle_lead_create_2w", request, 5, 60000); if (limited) return limited;
    return handlers.POST(request)
}
export const GET = handlers.GET
export const PATCH = handlers.PATCH
