/**
 * POST /api/inventory/cyepro/test
 *
 * Diagnostic endpoint to test the Cyepro API connection.
 * Returns detailed info about what's working and what's not.
 */

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/supabase-server'


const BASE_URL = 'https://api.cyepro.com'
const SERVICE_ID = '460'
const TIME_ZONE = 'Asia/Calcutta'

export async function POST(request: Request) {
    const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        steps: [],
    }

    try {
        // Step 1: Auth check
        const { user, supabase, errorResponse: authErr } = await requireAuth()
        if (authErr) {
            diagnostics.steps.push({ step: 'auth', status: 'FAIL', error: 'Not authenticated' })
            return NextResponse.json({ success: false, diagnostics }, { status: 401 })
        }
        diagnostics.steps.push({ step: 'auth', status: 'OK', userId: user.id })

        // Step 2: Get dealer ID
        const body = await request.json()
        const { dealerId } = body

        if (!dealerId) {
            diagnostics.steps.push({ step: 'dealerId', status: 'FAIL', error: 'No dealerId provided' })
            return NextResponse.json({ success: false, diagnostics }, { status: 400 })
        }
        diagnostics.steps.push({ step: 'dealerId', status: 'OK', dealerId })

        // Step 3: Fetch API key from database
        const { data: dealer, error: dealerErr } = await supabase
            .from('dealers')
            .select('id, dealership_name, cyepro_api_key, sells_used_cars')
            .eq('id', dealerId)
            .eq('user_id', user.id)
            .single()

        if (dealerErr || !dealer) {
            diagnostics.steps.push({
                step: 'fetch_dealer',
                status: 'FAIL',
                error: dealerErr?.message ?? 'Dealer not found',
            })
            return NextResponse.json({ success: false, diagnostics }, { status: 404 })
        }

        diagnostics.steps.push({
            step: 'fetch_dealer',
            status: 'OK',
            dealerName: dealer.dealership_name,
            hasApiKey: !!dealer.cyepro_api_key,
            apiKeyLength: dealer.cyepro_api_key?.length ?? 0,
            sellsUsedCars: dealer.sells_used_cars,
        })

        if (!dealer.cyepro_api_key) {
            diagnostics.steps.push({
                step: 'api_key_check',
                status: 'FAIL',
                error: 'No Cyepro API key configured. Go to Settings → Integrations.',
            })
            return NextResponse.json({ success: false, diagnostics })
        }

        // Step 4: Test the Cyepro API with a minimal request
        const testBody = {
            page: 1,
            size: 5,
            priceMin: 0,
            priceMax: 100_000_000,
            yearMin: 1970,
            yearMax: new Date().getFullYear() + 1,
            vehicleStatusIds: [],
            kmDrivenMax: 9_999_999,
            daysFilter: null,
            sortBy: null,
            order: 'asc' as const,
        }

        const headers = {
            'Content-Type': 'application/json',
            'API-KEY': dealer.cyepro_api_key,
            'SERVICE-TYPE-ID': SERVICE_ID,
            'timeZone': TIME_ZONE,
        }

        diagnostics.steps.push({
            step: 'api_request',
            status: 'SENDING',
            url: `${BASE_URL}/dynamicForms/search/vehicles/filterQueryApi`,
            headers: { ...headers, 'API-KEY': `${dealer.cyepro_api_key.substring(0, 8)}...` },
            body: testBody,
        })

        let res: Response
        const startTime = Date.now()
        try {
            res = await fetch(
                `${BASE_URL}/dynamicForms/search/vehicles/filterQueryApi`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(testBody),
                    cache: 'no-store',
                },
            )
        } catch (fetchErr) {
            const duration = Date.now() - startTime
            const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr)
            diagnostics.steps.push({
                step: 'api_network_error',
                status: 'FAIL',
                error: errMsg,
                durationMs: duration,
                hint: errMsg.includes('ENOTFOUND') || errMsg.includes('getaddrinfo')
                    ? 'DNS resolution failed — api.cyepro.com may not exist or is unreachable'
                    : errMsg.includes('ECONNREFUSED')
                        ? 'Connection refused — the API server is not accepting connections'
                        : errMsg.includes('ETIMEDOUT') || errMsg.includes('timeout')
                            ? 'Connection timed out — the API server is not responding'
                            : 'Network error — check if the API URL is correct',
            })
            return NextResponse.json({
                success: false,
                message: `Cannot reach api.cyepro.com: ${errMsg}`,
                diagnostics,
            })
        }
        const duration = Date.now() - startTime

        diagnostics.steps.push({
            step: 'api_response',
            status: res.ok ? 'OK' : 'FAIL',
            httpStatus: res.status,
            statusText: res.statusText,
            durationMs: duration,
        })

        if (!res.ok) {
            const errorBody = await res.text()
            diagnostics.steps.push({
                step: 'api_error_body',
                status: 'FAIL',
                body: errorBody.substring(0, 500),
            })
            return NextResponse.json({ success: false, diagnostics })
        }

        // Step 5: Parse response
        const rawData = await res.json()
        diagnostics.steps.push({
            step: 'parse_response',
            status: 'OK',
            responseKeys: Object.keys(rawData),
            rawSample: JSON.stringify(rawData).substring(0, 500),
        })

        // Step 6: Check vehicle data
        const vehicles = rawData.vehicles ?? rawData.data ?? rawData.results ?? rawData.content ?? []
        const totalCount = rawData.totalCount ?? rawData.total ?? rawData.totalElements ?? vehicles.length

        diagnostics.steps.push({
            step: 'vehicle_data',
            status: vehicles.length > 0 ? 'OK' : 'EMPTY',
            vehicleCount: vehicles.length,
            totalCount,
            sampleVehicle: vehicles[0] ? {
                id: vehicles[0].id,
                make: vehicles[0].make,
                model: vehicles[0].model,
                keys: Object.keys(vehicles[0]),
            } : null,
        })

        return NextResponse.json({
            success: vehicles.length > 0,
            message: vehicles.length > 0
                ? `Connected! Found ${totalCount} vehicles.`
                : 'API connected but no vehicles found. Check if your Cyepro account has inventory.',
            diagnostics,
        })

    } catch (error) {
        diagnostics.steps.push({
            step: 'exception',
            status: 'FAIL',
            error: error instanceof Error ? error.message : String(error),
        })
        return NextResponse.json({ success: false, diagnostics }, { status: 500 })
    }
}
