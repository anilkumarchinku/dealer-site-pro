/**
 * POST /api/vehicles/rc-lookup
 * Looks up vehicle registration details from the RC number (number plate).
 *
 * Integration options (set via env):
 *   RC_LOOKUP_PROVIDER = 'rapidor' | 'vehicleinfo' | 'mock'
 *
 *   1. Rapidor (https://rapidor.co) — recommended, free tier available
 *      Set: RAPIDOR_API_KEY
 *
 *   2. vehicleinfo.in — alternative provider
 *      Set: VEHICLE_INFO_API_KEY
 *
 *   3. mock — returns demo data (default when no key configured)
 *
 * Body: { rc: string }   e.g. "MH01AB1234"
 */

import { NextRequest, NextResponse } from 'next/server'
import { getOptionalEnv } from '@/lib/env'
import { externalApiFetch } from '@/lib/services/external-api-fetch'
import { requireAuth } from '@/lib/supabase-server'

const RC_CACHE_TTL_SECONDS = 60 * 60 * 24
const memoryCache = new Map<string, { expiresAt: number; value: Record<string, unknown> }>()

// Normalise RC: uppercase, remove spaces/hyphens
function normaliseRC(rc: string): string {
    return rc.toUpperCase().replace(/[\s\-]/g, '')
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

// ── Mock response for development/demo ───────────────────────────────────────
function mockResponse(rc: string) {
    const now = new Date()
    return {
        rc_number:        rc,
        owner_name:       'Sample Owner',
        registration_date:'01/01/2020',
        vehicle_class:    'Motor Car (LMV)',
        fuel_type:        'Petrol',
        make_model:       'Maruti Suzuki Swift',
        engine_number:    'K12MXX1234',
        chassis_number:   'MA3FJEB1S00000001',
        color:            'Red',
        insurance_upto:   new Date(now.getFullYear() + 1, 0, 1).toLocaleDateString('en-IN'),
        insurance_company:'Sample Insurance Co.',
        fitness_upto:     new Date(now.getFullYear() + 5, 0, 1).toLocaleDateString('en-IN'),
        rc_validity_upto:  new Date(now.getFullYear() + 5, 0, 1).toLocaleDateString('en-IN'),
        owner_count:       1,
        challan_count:     0,
        challan_status:    'No pending challans found',
        state:            'Maharashtra',
        rto:              'Mumbai Central',
        blacklisted:      false,
        noc_details:      'NA',
        _demo:            true,
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

// ── Rapidor API ───────────────────────────────────────────────────────────────
async function rapidorLookup(rc: string): Promise<Record<string, unknown>> {
    const apiKey = getOptionalEnv('RAPIDOR_API_KEY')!
    const data = await externalApiFetch<RapidorLookupResponse>({
        baseUrl: 'https://api.rapidor.co',
        providerName: 'Rapidor',
        path: '/vehicle/rc-details',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        init: {
            method: 'POST',
            body: JSON.stringify({ rc_number: rc }),
        },
    })
    // Normalise Rapidor response to our shape
    return {
        rc_number:        rc,
        owner_name:       data.owner_name ?? data.ownerName,
        registration_date:data.registration_date ?? data.regDate,
        vehicle_class:    data.vehicle_class ?? data.vehicleClass,
        fuel_type:        data.fuel_type ?? data.fuelType,
        make_model:       `${data.maker ?? ''} ${data.model ?? ''}`.trim(),
        engine_number:    data.engine_number ?? data.engineNumber,
        chassis_number:   data.chassis_number ?? data.chassisNumber,
        color:            data.color,
        insurance_upto:   data.insurance_upto ?? data.insuranceUpto,
        insurance_company:data.insurance_company ?? data.insuranceCompany,
        fitness_upto:     data.fitness_upto ?? data.fitnessUpto,
        rc_validity_upto:  data.rc_validity_upto ?? data.rcValidityUpto,
        owner_count:       data.owner_count ?? data.ownerCount,
        challan_count:     data.challan_count ?? data.challanCount,
        challan_status:    data.challan_status ?? data.challanStatus,
        state:            data.state,
        rto:              data.rto_name ?? data.rtoName,
        blacklisted:      data.blacklisted ?? false,
        noc_details:      data.noc_details ?? 'NA',
    }
}

export async function POST(request: NextRequest) {
    // Auth: only authenticated dealers can perform RC lookups
    const { errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const body = await request.json().catch(() => null)
    if (!body?.rc) {
        return NextResponse.json({ error: 'RC number is required' }, { status: 400 })
    }

    const rc = normaliseRC(String(body.rc))
    // Basic format validation: 2 letters + 2 digits + 1-2 letters + 4 digits (Indian plates)
    if (!/^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/.test(rc)) {
        return NextResponse.json({ error: 'Invalid RC number format. Example: MH01AB1234' }, { status: 400 })
    }

    const provider = getOptionalEnv('RC_LOOKUP_PROVIDER') ?? 'mock'

    try {
        const cached = await getCachedLookup(rc)
        if (cached) {
            return NextResponse.json({ success: true, data: cached, cached: true, ttl_seconds: RC_CACHE_TTL_SECONDS })
        }

        let result: Record<string, unknown>

        if (provider === 'rapidor' && getOptionalEnv('RAPIDOR_API_KEY')) {
            result = await rapidorLookup(rc)
        } else {
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    { error: 'RC lookup provider is not configured' },
                    { status: 503 }
                )
            }
            // Fall back to mock
            result = mockResponse(rc)
        }

        await setCachedLookup(rc, result)

        return NextResponse.json({ success: true, data: result, cached: false, ttl_seconds: RC_CACHE_TTL_SECONDS })
    } catch (err) {
        console.error('RC lookup error:', err)
        return NextResponse.json({ error: 'RC lookup failed. Please try again.' }, { status: 500 })
    }
}
