import { NextRequest, NextResponse } from 'next/server'
import { externalApiFetch, ExternalApiError } from '@/lib/services/external-api-fetch'

type VpicDecodeResponse = {
    Results?: Array<{
        Make?: string
        Model?: string
        ModelYear?: string
        FuelTypePrimary?: string
        ErrorCode?: string
        ErrorText?: string
    }>
}

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i

function normalizeFuelType(value: string | undefined): string | undefined {
    const fuel = value?.trim().toLowerCase()
    if (!fuel) return undefined
    if (fuel.includes('electric')) return 'Electric'
    if (fuel.includes('diesel')) return 'Diesel'
    if (fuel.includes('hybrid')) return 'Hybrid'
    if (fuel.includes('cng')) return 'CNG'
    if (fuel.includes('lpg')) return 'LPG'
    return 'Petrol'
}

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null) as { vin?: string } | null
    const vin = body?.vin?.trim().toUpperCase()

    if (!vin) {
        return NextResponse.json({ success: false, error: 'VIN is required' }, { status: 400 })
    }
    if (!VIN_REGEX.test(vin)) {
        return NextResponse.json({ success: false, error: 'VIN must be 17 characters and cannot contain I, O, or Q' }, { status: 400 })
    }

    try {
        const data = await externalApiFetch<VpicDecodeResponse>({
            baseUrl:      'https://vpic.nhtsa.dot.gov',
            providerName: 'NHTSA VIN',
            path:         `/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`,
            headers:      { Accept: 'application/json' },
            timeoutMs:    10_000,
        })
        const result = data.Results?.[0]

        if (!result || (result.ErrorCode && result.ErrorCode !== '0')) {
            return NextResponse.json({
                success: false,
                error:   result?.ErrorText || 'Unable to decode this VIN',
            }, { status: 422 })
        }

        return NextResponse.json({
            success:   true,
            make:      result.Make || undefined,
            model:     result.Model || undefined,
            year:      result.ModelYear ? Number(result.ModelYear) : undefined,
            fuel_type: normalizeFuelType(result.FuelTypePrimary),
        })
    } catch (error) {
        const message = error instanceof ExternalApiError
            ? 'VIN decoder is temporarily unavailable'
            : 'Failed to decode VIN'
        return NextResponse.json({ success: false, error: message }, { status: 502 })
    }
}
