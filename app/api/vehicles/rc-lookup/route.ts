/**
 * POST /api/vehicles/rc-lookup
 * Looks up vehicle registration details from the RC number (number plate).
 *
 * Integration options:
 *   RC_LOOKUP_PROVIDER = 'surepass' | 'surpass' | 'rapidor' | 'mock'
 *
 * Surepass:
 *   SUREPASS_API_TOKEN=<secret>
 *   SUREPASS_API_BASE_URL=https://sandbox.surepass.app
 *
 * Redis cache:
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 *
 * Body: { rc: string } e.g. "MH01AB1234"
 */

import { NextRequest, NextResponse } from 'next/server'
import { getOptionalEnv } from '@/lib/env'
import { externalApiFetch } from '@/lib/services/external-api-fetch'
import { requireAuth } from '@/lib/supabase-server'

const RC_CACHE_TTL_SECONDS = 60 * 60 * 24
const memoryCache = new Map<string, { expiresAt: number; value: Record<string, unknown> }>()

function normaliseRC(rc: string): string {
    return rc.toUpperCase().replace(/[\s-]/g, '')
}

function buildRedisClient() {
    const url = getOptionalEnv('UPSTASH_REDIS_REST_URL')
    const token = getOptionalEnv('UPSTASH_REDIS_REST_TOKEN')
    if (!url || !token) return null

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Redis } = require('@upstash/redis')
        return new Redis({ url, token }) as {
            get: <T>(key: string) => Promise<T | null>
            set: (key: string, value: unknown, options?: { ex?: number }) => Promise<unknown>
        }
    } catch {
        return null
    }
}

const redis = buildRedisClient()

async function getCachedLookup(rc: string) {
    const key = `rc-lookup:${rc}`

    if (redis) {
        const cached = await redis.get<Record<string, unknown>>(key)
        if (cached) return { ...cached, _cache: 'redis' }
        return null
    }

    const cached = memoryCache.get(key)
    if (!cached) return null
    if (cached.expiresAt < Date.now()) {
        memoryCache.delete(key)
        return null
    }
    return { ...cached.value, _cache: 'memory' }
}

async function setCachedLookup(rc: string, value: Record<string, unknown>) {
    const key = `rc-lookup:${rc}`
    if (redis) {
        await redis.set(key, value, { ex: RC_CACHE_TTL_SECONDS })
        return
    }
    memoryCache.set(key, {
        value,
        expiresAt: Date.now() + RC_CACHE_TTL_SECONDS * 1000,
    })
}

function mockResponse(rc: string) {
    const now = new Date()
    return {
        rc_number: rc,
        owner_name: 'Sample Owner',
        registration_date: '01/01/2020',
        vehicle_class: 'Motor Car (LMV)',
        fuel_type: 'Petrol',
        make_model: 'Maruti Suzuki Swift',
        engine_number: 'K12MXX1234',
        chassis_number: 'MA3FJEB1S00000001',
        color: 'Red',
        insurance_upto: new Date(now.getFullYear() + 1, 0, 1).toLocaleDateString('en-IN'),
        insurance_company: 'Sample Insurance Co.',
        insurance_policy_number: 'POLICY123456',
        insurance_policy_type: 'Comprehensive',
        fitness_upto: new Date(now.getFullYear() + 5, 0, 1).toLocaleDateString('en-IN'),
        rc_validity_upto: new Date(now.getFullYear() + 5, 0, 1).toLocaleDateString('en-IN'),
        owner_count: 1,
        challan_count: 0,
        challan_status: 'No pending challans found',
        state: 'Maharashtra',
        rto: 'Mumbai Central',
        blacklisted: false,
        noc_details: 'NA',
        _demo: true,
    }
}

type RapidorLookupResponse = {
    owner_name?: string
    ownerName?: string
    registration_date?: string
    regDate?: string
    vehicle_class?: string
    vehicleClass?: string
    fuel_type?: string
    fuelType?: string
    maker?: string
    model?: string
    engine_number?: string
    engineNumber?: string
    chassis_number?: string
    chassisNumber?: string
    color?: string
    insurance_upto?: string
    insuranceUpto?: string
    insurance_company?: string
    insuranceCompany?: string
    fitness_upto?: string
    fitnessUpto?: string
    rc_validity_upto?: string
    rcValidityUpto?: string
    owner_count?: number
    ownerCount?: number
    challan_count?: number
    challanCount?: number
    challan_status?: string
    challanStatus?: string
    state?: string
    rto_name?: string
    rtoName?: string
    blacklisted?: boolean
    noc_details?: string
}

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

function getSurepassConfig() {
    return {
        baseUrl: (getOptionalEnv('SUREPASS_API_BASE_URL') ?? 'https://sandbox.surepass.app').replace(/\/$/, ''),
        token: getOptionalEnv('SUREPASS_API_TOKEN') ?? getOptionalEnv('SUREPASS_BEARER_TOKEN'),
        rcPath: getOptionalEnv('SUREPASS_RC_PATH') ?? '/api/v1/rc/rc-full',
        challanPath: getOptionalEnv('SUREPASS_CHALLAN_PATH') ?? '/api/v1/rc/rc-related/challan-details',
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

async function surepassLookup(rc: string): Promise<Record<string, unknown>> {
    const { baseUrl, token, rcPath, challanPath } = getSurepassConfig()
    if (!token) throw new Error('Surepass API token is not configured')

    const rcPayload = await externalApiFetch<SurepassEnvelope>({
        baseUrl,
        providerName: 'Surepass',
        path: rcPath,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        init: {
            method: 'POST',
            body: JSON.stringify({ id_number: rc }),
        },
    })

    if (rcPayload.success === false) {
        throw new Error(rcPayload.message ?? 'Surepass RC lookup failed')
    }

    const result = normaliseSurepassRc(rc, rcPayload.data ?? {})
    const chassisNumber = stringValue(result.chassis_number)
    const engineNumber = stringValue(result.engine_number)

    if (!chassisNumber || !engineNumber) {
        return {
            ...result,
            challan_status: 'Challan check needs chassis and engine number',
        }
    }

    const challanPayload = await externalApiFetch<SurepassEnvelope>({
        baseUrl,
        providerName: 'Surepass',
        path: challanPath,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        init: {
            method: 'POST',
            body: JSON.stringify({
                rc_number: rc,
                chassis_number: chassisNumber,
                engine_number: engineNumber,
                state_only: false,
            }),
        },
    })

    if (challanPayload.success === false) {
        return {
            ...result,
            challan_status: challanPayload.message ?? 'Challan lookup failed',
        }
    }

    const challans = extractChallans(challanPayload)
    const pendingCount = pendingChallanCount(challans)

    return {
        ...result,
        challan_count: pendingCount,
        challan_status: pendingCount > 0
            ? `${pendingCount} pending challan(s) found`
            : 'No pending challans found',
        challans,
    }
}

async function rapidorLookup(rc: string): Promise<Record<string, unknown>> {
    const apiKey = getOptionalEnv('RAPIDOR_API_KEY')!
    const data = await externalApiFetch<RapidorLookupResponse>({
        baseUrl: 'https://api.rapidor.co',
        providerName: 'Rapidor',
        path: '/vehicle/rc-details',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        init: {
            method: 'POST',
            body: JSON.stringify({ rc_number: rc }),
        },
    })

    return {
        rc_number: rc,
        owner_name: data.owner_name ?? data.ownerName,
        registration_date: data.registration_date ?? data.regDate,
        vehicle_class: data.vehicle_class ?? data.vehicleClass,
        fuel_type: data.fuel_type ?? data.fuelType,
        make_model: `${data.maker ?? ''} ${data.model ?? ''}`.trim(),
        engine_number: data.engine_number ?? data.engineNumber,
        chassis_number: data.chassis_number ?? data.chassisNumber,
        color: data.color,
        insurance_upto: data.insurance_upto ?? data.insuranceUpto,
        insurance_company: data.insurance_company ?? data.insuranceCompany,
        fitness_upto: data.fitness_upto ?? data.fitnessUpto,
        rc_validity_upto: data.rc_validity_upto ?? data.rcValidityUpto,
        owner_count: data.owner_count ?? data.ownerCount,
        challan_count: data.challan_count ?? data.challanCount,
        challan_status: data.challan_status ?? data.challanStatus,
        state: data.state,
        rto: data.rto_name ?? data.rtoName,
        blacklisted: data.blacklisted ?? false,
        noc_details: data.noc_details ?? 'NA',
    }
}

export async function POST(request: NextRequest) {
    const { errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const body = await request.json().catch(() => null)
    if (!body?.rc) {
        return NextResponse.json({ error: 'RC number is required' }, { status: 400 })
    }

    const rc = normaliseRC(String(body.rc))
    if (!/^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/.test(rc)) {
        return NextResponse.json({ error: 'Invalid RC number format. Example: MH01AB1234' }, { status: 400 })
    }

    const provider = (getOptionalEnv('RC_LOOKUP_PROVIDER') ?? 'mock').toLowerCase()

    try {
        const cached = await getCachedLookup(rc)
        if (cached) {
            return NextResponse.json({ success: true, data: cached, cached: true, ttl_seconds: RC_CACHE_TTL_SECONDS })
        }

        let result: Record<string, unknown>

        if ((provider === 'surepass' || provider === 'surpass') && (getOptionalEnv('SUREPASS_API_TOKEN') || getOptionalEnv('SUREPASS_BEARER_TOKEN'))) {
            result = await surepassLookup(rc)
        } else if (provider === 'rapidor' && getOptionalEnv('RAPIDOR_API_KEY')) {
            result = await rapidorLookup(rc)
        } else {
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    { error: 'RC lookup provider is not configured' },
                    { status: 503 }
                )
            }
            result = mockResponse(rc)
        }

        await setCachedLookup(rc, result)

        return NextResponse.json({ success: true, data: result, cached: false, ttl_seconds: RC_CACHE_TTL_SECONDS })
    } catch (err) {
        console.error('RC lookup error:', err)
        return NextResponse.json({ error: 'RC lookup failed. Please try again.' }, { status: 500 })
    }
}
