import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const DEFAULT_BASE_URL = 'https://kyc-api.surepass.app'
const DEFAULT_RC_PATH = '/api/v1/rc/rc-full'
const DEFAULT_CHALLAN_PATH = '/api/v1/rc/rc-related/challan-details'

type SurepassEnvelope = {
    data?: Record<string, unknown>
    status_code?: number
    success?: boolean
    message?: string | null
    message_code?: string | null
}

type SurepassChallan = {
    challan_number?: string
    offense_details?: string
    challan_place?: string | null
    challan_date?: string
    state?: string
    rto?: string | null
    amount?: number | string
    challan_status?: string | null
    court_challan?: boolean | null
}

function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

function normaliseRC(rc: string): string {
    return rc.toUpperCase().replace(/[\s-]/g, '')
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    const payload = token.split('.')[1]
    if (!payload) return null

    try {
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), '=')
        return JSON.parse(atob(padded))
    } catch {
        return null
    }
}

function requireAuthenticatedRole(request: Request): Response | null {
    const authHeader = request.headers.get('Authorization') ?? ''
    const token = authHeader.match(/^Bearer\s+(.+)$/i)?.[1]
    const payload = token ? decodeJwtPayload(token) : null

    if (!payload) {
        return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    if (payload.role !== 'authenticated') {
        return jsonResponse({ error: 'Forbidden' }, 403)
    }

    return null
}

function stringValue(value: unknown): string | undefined {
    if (typeof value === 'string') {
        const trimmed = value.trim()
        return trimmed || undefined
    }
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return undefined
}

function numberValue(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string') {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) return parsed
    }
    return undefined
}

function booleanValue(value: unknown): boolean | undefined {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') {
        const lowered = value.trim().toLowerCase()
        if (['true', 'yes', 'y', 'blacklisted'].includes(lowered)) return true
        if (['false', 'no', 'n', 'na', 'n/a', 'null', ''].includes(lowered)) return false
    }
    return undefined
}

function pickString(data: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
        const value = stringValue(data[key])
        if (value) return value
    }
    return undefined
}

function pickNumber(data: Record<string, unknown>, keys: string[]): number | undefined {
    for (const key of keys) {
        const value = numberValue(data[key])
        if (value !== undefined) return value
    }
    return undefined
}

function getConfig() {
    return {
        baseUrl: (Deno.env.get('SUREPASS_API_BASE_URL') ?? DEFAULT_BASE_URL).replace(/\/$/, ''),
        token: Deno.env.get('SUREPASS_API_TOKEN') ?? Deno.env.get('SUREPASS_BEARER_TOKEN'),
        rcPath: Deno.env.get('SUREPASS_RC_PATH') ?? DEFAULT_RC_PATH,
        challanPath: Deno.env.get('SUREPASS_CHALLAN_PATH') ?? DEFAULT_CHALLAN_PATH,
    }
}

function normaliseSurepassRc(rc: string, data: Record<string, unknown>): Record<string, unknown> {
    const make = pickString(data, ['maker_description', 'maker', 'make'])
    const model = pickString(data, ['maker_model', 'model', 'variant'])
    const makeModel = [make, model].filter(Boolean).join(' ').trim() || undefined
    const blacklistStatus = pickString(data, ['blacklist_status', 'blacklisted'])
    const explicitBlacklisted = booleanValue(data.blacklisted)

    return {
        rc_number: pickString(data, ['rc_number']) ?? rc,
        owner_name: pickString(data, ['owner_name']),
        registration_date: pickString(data, ['registration_date', 'regDate']),
        vehicle_class: pickString(data, ['vehicle_category_description', 'vehicle_category', 'vehicle_class']),
        fuel_type: pickString(data, ['fuel_type']),
        make_model: makeModel,
        engine_number: pickString(data, ['vehicle_engine_number', 'engine_number', 'engineNumber']),
        chassis_number: pickString(data, ['vehicle_chasi_number', 'vehicle_chassis_number', 'chassis_number', 'chassisNumber']),
        color: pickString(data, ['color']),
        insurance_upto: pickString(data, ['insurance_upto', 'insuranceUpto']),
        insurance_company: pickString(data, ['insurance_company', 'insuranceCompany']),
        insurance_policy_number: pickString(data, ['insurance_policy_number', 'insurance_policy_no', 'policy_number', 'policy_no']),
        insurance_policy_type: pickString(data, ['insurance_policy_type', 'insurance_type', 'policy_type']),
        fitness_upto: pickString(data, ['fit_up_to', 'fitness_upto', 'fitnessUpto']),
        rc_validity_upto: pickString(data, ['rc_validity_upto', 'rcValidityUpto', 'fit_up_to']),
        owner_count: pickNumber(data, ['owner_number', 'owner_count', 'ownerCount']),
        state: pickString(data, ['state']),
        rto: pickString(data, ['registered_at', 'rto_name', 'rtoName']),
        blacklisted: explicitBlacklisted ?? Boolean(blacklistStatus && !['NA', 'N/A', 'NO', 'NONE', 'NULL'].includes(blacklistStatus.toUpperCase())),
        noc_details: pickString(data, ['noc_details']) ?? 'NA',
        rc_status: pickString(data, ['rc_status']),
        pucc_upto: pickString(data, ['pucc_upto']),
        tax_upto: pickString(data, ['tax_upto', 'tax_paid_upto']),
        permit_valid_upto: pickString(data, ['permit_valid_upto']),
        financer: pickString(data, ['financer']),
        body_type: pickString(data, ['body_type']),
        seating_capacity: pickString(data, ['seat_capacity']),
        _provider: 'surepass',
    }
}

function extractChallans(payload: SurepassEnvelope): SurepassChallan[] {
    const data = payload.data ?? {}
    const challanDetails = data.challan_details
    if (
        challanDetails &&
        typeof challanDetails === 'object' &&
        Array.isArray((challanDetails as { challans?: unknown }).challans)
    ) {
        return (challanDetails as { challans: SurepassChallan[] }).challans
    }
    if (Array.isArray(data.challans)) return data.challans as SurepassChallan[]
    return []
}

function pendingChallanCount(challans: SurepassChallan[]): number {
    return challans.filter(challan => {
        const status = challan.challan_status?.toLowerCase()
        return !status || status.includes('pending') || status.includes('unpaid')
    }).length
}

async function surepassFetch(path: string, token: string, body: unknown): Promise<SurepassEnvelope> {
    const { baseUrl } = getConfig()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    try {
        const response = await fetch(`${baseUrl}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        })
        const text = await response.text()
        const json = text ? JSON.parse(text) : {}

        if (!response.ok) {
            return {
                success: false,
                status_code: response.status,
                message: typeof json?.message === 'string' ? json.message : `Surepass API ${path} failed`,
                data: typeof json === 'object' ? json : undefined,
            }
        }

        return json
    } finally {
        clearTimeout(timeout)
    }
}

async function lookup(rc: string) {
    const { token, rcPath, challanPath } = getConfig()
    if (!token) {
        return jsonResponse({ error: 'SUREPASS_API_TOKEN is not configured in Supabase secrets' }, 503)
    }

    const rcPayload = await surepassFetch(rcPath, token, { id_number: rc })
    if (rcPayload.success === false) {
        return jsonResponse({
            error: rcPayload.message ?? 'Surepass RC lookup failed',
            provider_status: rcPayload.status_code ?? null,
        }, 502)
    }

    const result = normaliseSurepassRc(rc, rcPayload.data ?? {})
    const chassisNumber = stringValue(result.chassis_number)
    const engineNumber = stringValue(result.engine_number)

    if (!chassisNumber || !engineNumber) {
        return jsonResponse({
            success: true,
            data: {
                ...result,
                challan_status: 'Challan check needs chassis and engine number',
            },
        })
    }

    const challanPayload = await surepassFetch(challanPath, token, {
        rc_number: rc,
        chassis_number: chassisNumber,
        engine_number: engineNumber,
        state_only: false,
    })

    if (challanPayload.success === false) {
        return jsonResponse({
            success: true,
            data: {
                ...result,
                challan_status: challanPayload.message ?? 'Challan lookup failed',
                challan_error: challanPayload.status_code ?? 'provider_error',
            },
        })
    }

    const challans = extractChallans(challanPayload)
    const pendingCount = pendingChallanCount(challans)

    return jsonResponse({
        success: true,
        data: {
            ...result,
            challan_count: pendingCount,
            challan_status: pendingCount > 0
                ? `${pendingCount} pending challan(s) found`
                : 'No pending challans found',
            challans,
        },
    })
}

serve(async request => {
    const authError = requireAuthenticatedRole(request)
    if (authError) return authError

    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405)
    }

    const body = await request.json().catch(() => null)
    if (!body?.rc) {
        return jsonResponse({ error: 'RC number is required' }, 400)
    }

    const rc = normaliseRC(String(body.rc))
    if (!/^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/.test(rc)) {
        return jsonResponse({ error: 'Invalid RC number format. Example: MH01AB1234' }, 400)
    }

    try {
        return await lookup(rc)
    } catch (error) {
        return jsonResponse({
            error: error instanceof Error ? error.message : 'Surepass lookup failed',
        }, 500)
    }
})
