import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { forwardLeadToCyepro } from '@/lib/services/cyepro-service'
import { logger } from '@/lib/utils/logger'
import {
    readRouteJson,
    requireDealerAccount,
    SafeParseResult,
    updateDealerScopedStatus,
} from '@/lib/services/vehicle-route-service-utils'

type LeadCreateResult = { success: boolean; id?: string; error?: string }
type LeadUpdateResult = { success: boolean; error?: string }
type VehicleLeadTable = 'tw_leads' | 'thw_leads'
type CyeproSyncStatus = 'pending' | 'synced' | 'failed' | 'skipped'

type LeadData = {
    dealer_id: string
    lead_type: string
    name: string
    phone: string
    email?: string | null
    vehicle_id?: string | null
    vehicle_name?: string | null
    used_vehicle_id?: string | null
    preferred_date?: string | null
    message?: string | null
    offer_price_paise?: number | null
}

type VehicleLeadPayload<TLead extends LeadData> = {
    dealer_id: TLead['dealer_id']
    vehicle_id: string | null
    used_vehicle_id: string | null
    lead_type: TLead['lead_type']
    name: TLead['name']
    phone: TLead['phone']
    email: string | null
    preferred_date: string | null
    message: string | null
    offer_price_paise: number | null
}

type LeadRouteOptions<TLead extends LeadData, TFilters, TStatus extends string, TCreatePayload> = {
    leadTable: VehicleLeadTable
    invalidJsonMessage?: string
    parseLead: (body: unknown) => SafeParseResult<TLead>
    formatParseError: (error: unknown) => string
    buildCreatePayload: (data: TLead) => TCreatePayload
    createLead: (payload: TCreatePayload) => Promise<LeadCreateResult>
    createErrorStatus: number
    buildFilters: (searchParams: URLSearchParams) => TFilters
    getLeads: (dealerId: string, filters: TFilters) => Promise<unknown>
    parsePatch: (body: unknown) => SafeParseResult<{ id: string; status: TStatus }>
    updateLeadStatus: (id: string, dealerId: string, status: TStatus) => Promise<LeadUpdateResult>
}

type CyeproLeadPayload = {
    customerName: string
    customerPhone: string
    customerEmail?: string
    vehicleName?: string
    message?: string
    leadSource?: string
}

export function buildVehicleLeadPayload<TLead extends LeadData, TExtra extends object = Record<string, never>>(
    data: TLead,
    extraPayload?: TExtra
): VehicleLeadPayload<TLead> & TExtra {
    return {
        dealer_id: data.dealer_id,
        vehicle_id: data.vehicle_id ?? null,
        used_vehicle_id: data.used_vehicle_id ?? null,
        lead_type: data.lead_type,
        name: data.name,
        phone: data.phone,
        email: data.email ?? null,
        preferred_date: data.preferred_date ?? null,
        message: data.message ?? null,
        offer_price_paise: data.offer_price_paise ?? null,
        ...extraPayload,
    } as VehicleLeadPayload<TLead> & TExtra
}

function getServiceSupabase() {
    return createAdminClient()
}

async function updateVehicleLeadCyeproStatus(
    table: VehicleLeadTable,
    leadId: string,
    update: {
        cyepro_sync_status: CyeproSyncStatus
        cyepro_synced_at?: string | null
        cyepro_error?: string | null
        cyepro_lead_id?: string | null
    }
) {
    const { error } = await getServiceSupabase()
        .from(table)
        .update(update)
        .eq('id', leadId)

    if (error) logger.warn(`[${table}] Cyepro sync status update failed:`, error.message)
}

async function markVehicleLeadCyeproSyncResult(
    table: VehicleLeadTable,
    leadId: string | undefined,
    dealerApiKey: string | null | undefined,
    payload: CyeproLeadPayload
) {
    if (!leadId) return

    if (!dealerApiKey) {
        await updateVehicleLeadCyeproStatus(table, leadId, {
            cyepro_sync_status: 'skipped',
            cyepro_error: 'Dealer has no Cyepro API key configured',
        })
        return
    }

    const result = await forwardLeadToCyepro(dealerApiKey, payload)
    await updateVehicleLeadCyeproStatus(
        table,
        leadId,
        result.success
            ? {
                cyepro_sync_status: 'synced',
                cyepro_synced_at: new Date().toISOString(),
                cyepro_error: null,
                cyepro_lead_id: result.cyeproLeadId ?? null,
            }
            : {
                cyepro_sync_status: 'failed',
                cyepro_error: result.error.slice(0, 1000),
            }
    )
}

export async function createVehicleLead<TLead extends LeadData, TFilters, TStatus extends string, TCreatePayload>(
    request: NextRequest,
    options: LeadRouteOptions<TLead, TFilters, TStatus, TCreatePayload>
) {
    const body = await readRouteJson(request, options.invalidJsonMessage)
    if (body instanceof NextResponse) return body

    const parsed = options.parseLead(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: options.formatParseError(parsed.error) },
            { status: 400 }
        )
    }

    const data = parsed.data
    const supabaseCheck = getServiceSupabase()
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: recentLead } = await supabaseCheck
        .from(options.leadTable)
        .select('id')
        .eq('dealer_id', data.dealer_id)
        .eq('phone', data.phone.trim())
        .gte('created_at', fiveMinutesAgo)
        .limit(1)
        .maybeSingle()

    if (recentLead) {
        return NextResponse.json({ success: true, id: recentLead.id, duplicate: true }, { status: 200 })
    }

    const result = await options.createLead(options.buildCreatePayload(data))
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: options.createErrorStatus })
    }

    const supabase = getServiceSupabase()
    const { data: dealer } = await supabase
        .from('dealers')
        .select('cyepro_api_key')
        .eq('id', data.dealer_id)
        .single()

    markVehicleLeadCyeproSyncResult(
        options.leadTable,
        result.id,
        dealer?.cyepro_api_key,
        {
            customerName: data.name,
            customerPhone: data.phone,
            customerEmail: data.email ?? undefined,
            vehicleName: data.vehicle_name ?? undefined,
            message: data.message ?? undefined,
            leadSource: data.lead_type,
        }
    ).catch(() => { /* already logged inside */ })

    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
}

export async function listVehicleLeads<TLead extends LeadData, TFilters, TStatus extends string, TCreatePayload>(
    request: NextRequest,
    options: LeadRouteOptions<TLead, TFilters, TStatus, TCreatePayload>
) {
    const { dealer, errorResponse } = await requireDealerAccount()
    if (errorResponse) return errorResponse

    const { searchParams } = new URL(request.url)
    const result = await options.getLeads(dealer.id, options.buildFilters(searchParams))
    return NextResponse.json(result)
}

export async function updateVehicleLeadStatus<TLead extends LeadData, TFilters, TStatus extends string, TCreatePayload>(
    request: NextRequest,
    options: LeadRouteOptions<TLead, TFilters, TStatus, TCreatePayload>
) {
    return updateDealerScopedStatus(request, {
        parsePatch: options.parsePatch,
        formatParseError: options.formatParseError,
        updateStatus: options.updateLeadStatus,
    })
}

export function createVehicleLeadRouteHandlers<TLead extends LeadData, TFilters, TStatus extends string, TCreatePayload>(
    options: LeadRouteOptions<TLead, TFilters, TStatus, TCreatePayload>
) {
    return {
        POST: (request: NextRequest) => createVehicleLead(request, options),
        GET: (request: NextRequest) => listVehicleLeads(request, options),
        PATCH: (request: NextRequest) => updateVehicleLeadStatus(request, options),
    }
}
