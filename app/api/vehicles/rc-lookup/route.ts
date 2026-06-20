/**
 * POST /api/vehicles/rc-lookup
 * Looks up vehicle registration details from the RC number (number plate).
 *
 * Integration options:
 *   RC_LOOKUP_PROVIDER = 'surepass' | 'surpass' | 'rapidor' | 'mock'
 *
 * Surepass:
 *   SUREPASS_API_TOKEN and SUREPASS_API_BASE_URL in Supabase Edge Function secrets
 *
 * Redis cache:
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 *
 * Body: { rc: string } e.g. "MH01AB1234"
 */

import { NextRequest, NextResponse } from 'next/server'
import { getOptionalEnv } from '@/lib/env'
import { ExternalApiError, externalApiFetch } from '@/lib/services/external-api-fetch'
import { requireAuth, type RouteSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { logApiUsage } from '@/lib/db/credits'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { logger } from '@/lib/utils/logger'

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

type SurepassFunctionResponse = {
    success?: boolean
    data?: Record<string, unknown>
    error?: string
    provider_status?: number | string | null
}

async function surepassEdgeFunctionLookup(
    supabase: RouteSupabaseClient,
    rc: string
): Promise<Record<string, unknown>> {
    const { data, error } = await supabase.functions.invoke<SurepassFunctionResponse>(
        'surepass-rc-lookup',
        { body: { rc } }
    )

    if (error) {
        throw new ExternalApiError(
            `Surepass Edge Function failed: ${error.message}`,
            'Surepass Edge Function',
            '/functions/v1/surepass-rc-lookup',
            'status' in error && typeof error.status === 'number' ? error.status : undefined
        )
    }

    if (!data?.success || !data.data) {
        throw new ExternalApiError(
            data?.error ?? 'Surepass Edge Function returned an invalid response',
            'Surepass Edge Function',
            '/functions/v1/surepass-rc-lookup',
            typeof data?.provider_status === 'number' ? data.provider_status : undefined,
            undefined,
            data
        )
    }

    return data.data
}

/** Get dealer ID from authenticated user */
async function getDealerIdForUser(userId: string): Promise<string | null> {
    try {
        const supabase = createAdminClient()
        const { data } = await supabase
            .from('dealers')
            .select('id')
            .eq('user_id', userId)
            .single()
        return data?.id ?? null
    } catch (err) {
        console.warn('[RC Lookup] Dealer lookup skipped:', err instanceof Error ? err.message : err)
        return null
    }
}

export async function POST(request: NextRequest) {
    const limited = await rateLimitOrNull("rc_lookup", request, 30, 3600000); if (limited) return limited;
    const auth = await requireAuth()
    if (auth.errorResponse) return auth.errorResponse

    // Get dealer ID for usage tracking
    const dealerId = await getDealerIdForUser(auth.user.id)
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    const body = await request.json().catch(() => null)
    if (!body?.rc) {
        return NextResponse.json({ error: 'RC number is required' }, { status: 400 })
    }

    const rc = normaliseRC(String(body.rc))
    if (!/^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/.test(rc)) {
        return NextResponse.json({ error: 'Invalid RC number format. Example: MH01AB1234' }, { status: 400 })
    }

    const provider = (
        getOptionalEnv('RC_LOOKUP_PROVIDER') ??
        (process.env.NODE_ENV === 'production' ? 'surepass' : 'mock')
    ).toLowerCase()

    try {
        const cached = await getCachedLookup(rc)
        if (cached) {
            // Don't charge for cached results
            return NextResponse.json({ success: true, data: cached, cached: true, ttl_seconds: RC_CACHE_TTL_SECONDS })
        }

        let result: Record<string, unknown>

        if (provider === 'surepass' || provider === 'surpass') {
            result = await surepassEdgeFunctionLookup(auth.supabase, rc)
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

        // ✅ Log successful usage (₹3 for Plan 1)
        if (dealerId) {
            await logApiUsage({
                dealerId,
                apiType: 'rc_verification',
                requestParams: { rc },
                responseSuccess: true,
                ipAddress,
            }).catch(err => {
                console.error('[RC Lookup] Failed to log usage:', err)
                // Don't fail the request if logging fails
            })
        }

        return NextResponse.json({ success: true, data: result, cached: false, ttl_seconds: RC_CACHE_TTL_SECONDS })
    } catch (err) {
        console.error('RC lookup error:', err)

        // ❌ Log failed usage (still charged because provider was called)
        if (dealerId) {
            await logApiUsage({
                dealerId,
                apiType: 'rc_verification',
                requestParams: { rc },
                responseSuccess: false,
                errorMessage: err instanceof Error ? err.message : 'Unknown error',
                ipAddress,
            }).catch(logErr => {
                console.error('[RC Lookup] Failed to log error usage:', logErr)
            })
        }

        if (err instanceof ExternalApiError) {
            // Log the provider name / upstream status server-side only. These
            // reveal which third-party we use and hint at credential/config
            // problems, so they must never reach the client.
            logger.error('[RC Lookup] Provider error', {
                provider: err.providerName,
                providerStatus: err.status ?? null,
                rc,
            })

            // Client-facing message is generic for every upstream failure mode
            // (401/403/422/etc.) — a 422 may be a genuine bad RC, the rest are
            // transient/config issues, all expressed without leaking provider
            // internals.
            const clientMessage = err.status === 422
                ? 'We could not find details for this RC number. Please check it and try again.'
                : 'RC lookup is temporarily unavailable. Please try again later.'

            return NextResponse.json(
                { error: clientMessage },
                { status: 502 }
            )
        }

        return NextResponse.json({ error: 'RC lookup failed. Please try again.' }, { status: 500 })
    }
}
