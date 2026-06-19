import { NextRequest } from 'next/server'
import type { z } from 'zod'
import { createThreeWheelerLead, getThreeWheelerLeads, updateThreeWheelerLeadStatus } from '@/lib/db/three-wheelers'
import type { ThreeWheelerLeadStatus } from '@/lib/types/three-wheeler'
import { formatZodErrors, thwLeadSchema } from '@/lib/validations/schemas'
import {
    buildVehicleLeadPayload,
    createVehicleLeadRouteHandlers,
} from '@/lib/services/vehicle-lead-route-service'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

function formatError(error: unknown): string {
    return typeof error === 'string' ? error : formatZodErrors(error as z.ZodError)
}

type ThreeWheelerLeadInput = z.infer<typeof thwLeadSchema>

const leadOptions = {
    leadTable: 'thw_leads',
    invalidJsonMessage: 'Invalid JSON',
    parseLead: (body: unknown) => thwLeadSchema.safeParse(body),
    formatParseError: formatError,
    buildCreatePayload: (data: ThreeWheelerLeadInput) => buildVehicleLeadPayload(data, {
        fleet_size: null,
        status: 'new' as const,
    }),
    createLead: createThreeWheelerLead,
    createErrorStatus: 400,
    buildFilters: (searchParams: URLSearchParams) => {
        const status = searchParams.get('status') as ThreeWheelerLeadStatus | null
        return {
            status: status ?? undefined,
            page: Number(searchParams.get('page') ?? 1),
            pageSize: Number(searchParams.get('pageSize') ?? 50),
        }
    },
    getLeads: getThreeWheelerLeads,
    parsePatch: (body: unknown) => {
        const { id, status } = (body ?? {}) as { id?: string; status?: ThreeWheelerLeadStatus }
        return id && status
            ? { success: true as const, data: { id, status } }
            : { success: false as const, error: 'id and status required' }
    },
    updateLeadStatus: updateThreeWheelerLeadStatus,
} as const

const handlers = createVehicleLeadRouteHandlers(leadOptions)
export async function POST(request: NextRequest) {
    const limited = await rateLimitOrNull("vehicle_lead_create_3w", request, 5, 60000); if (limited) return limited;
    return handlers.POST(request)
}
export const GET = handlers.GET
export const PATCH = handlers.PATCH
