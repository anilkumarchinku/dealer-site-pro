/**
 * Car Audit Utility
 * Verifies all cars follow the same specification display pattern
 */

import { getAggregatedCarSpecs, formatSpecsForDisplay } from './car-specs-aggregator'

export interface CarAuditResult {
    make: string
    model: string
    variantCount: number
    fuels: string[]
    transmissions: string[]
    seatingOptions: number[]
    powerRange: { min: number; max: number }
    mileageRange: { min: string | number; max: string | number }
    status: 'complete' | 'partial' | 'error'
    error?: string
}

/**
 * Audit a single car model
 */
export async function auditCarSpecs(make: string, model: string): Promise<CarAuditResult> {
    try {
        const specs = await getAggregatedCarSpecs(make, model)

        if (!specs || specs.variants.length === 0) {
            return {
                make,
                model,
                variantCount: 0,
                fuels: [],
                transmissions: [],
                seatingOptions: [],
                powerRange: { min: 0, max: 0 },
                mileageRange: { min: 'N/A', max: 'N/A' },
                status: 'error',
                error: 'No variants found'
            }
        }

        return {
            make,
            model,
            variantCount: specs.variants.length,
            fuels: specs.fuels,
            transmissions: specs.transmissions,
            seatingOptions: specs.seatingOptions,
            powerRange: specs.powerRange,
            mileageRange: specs.mileageRange,
            status: specs.variants.length > 0 ? 'complete' : 'partial'
        }
    } catch (error) {
        return {
            make,
            model,
            variantCount: 0,
            fuels: [],
            transmissions: [],
            seatingOptions: [],
            powerRange: { min: 0, max: 0 },
            mileageRange: { min: 'N/A', max: 'N/A' },
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Generate audit report for a car
 */
export function generateAuditReport(result: CarAuditResult): string {
    const separator = '─'.repeat(50)
    const status = result.status === 'complete' ? '✅' : result.status === 'partial' ? '⚠️' : '❌'

    return `
${separator}
${status} ${result.make} ${result.model}
${separator}
Variants: ${result.variantCount}
Fuels: ${result.fuels.join(' / ') || 'N/A'}
Transmissions: ${result.transmissions.join(' / ') || 'N/A'}
Seating: ${result.seatingOptions.join(' / ') || 'N/A'}
Power: ${result.powerRange.min} - ${result.powerRange.max} bhp
Mileage: ${result.mileageRange.min} - ${result.mileageRange.max} km/l
${result.error ? `Error: ${result.error}` : 'Status: Ready for display'}
`
}
