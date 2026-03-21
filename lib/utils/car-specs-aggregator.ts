/**
 * Car Specs Aggregator
 * Fetches and aggregates car specifications from all variants
 * Provides complete information about fuels, transmissions, seating, mileage, power
 */

import { getDetailedCarInfo, type DetailedCarInfo } from './car-info-fetcher'

export interface AggregatedCarSpecs {
    fuels: string[]                    // All fuel types (Petrol, Diesel, etc.)
    transmissions: string[]            // All transmission types (Manual, Auto, etc.)
    seatingOptions: number[]           // All seating capacities
    powerRange: {
        min: number
        max: number
        unit: string                   // 'bhp'
    }
    mileageRange: {
        min: string | number
        max: string | number
        unit: string                   // 'km/l'
    }
    variants: DetailedCarInfo[]        // All variant details
    summary: string                    // Human-readable summary
}

/**
 * Fetch and aggregate specifications for a car model
 * Returns all fuels, transmissions, seating, power, and mileage variations
 */
export async function getAggregatedCarSpecs(make: string, model: string): Promise<AggregatedCarSpecs | null> {
    try {
        const variants = await getDetailedCarInfo(make, model)

        if (!variants || variants.length === 0) {
            console.warn(`No variants found for ${make} ${model}`)
            return null
        }

        // Extract all unique fuel types
        const fuels = [...new Set(
            variants
                .map(v => v.fuel_type)
                .filter(Boolean)
        )].sort()

        // Extract all unique transmissions
        const transmissions = [...new Set(
            variants
                .map(v => v.transmission)
                .filter(Boolean)
                .map(t => t === 'Automatic' ? 'Auto' : t === 'Manual' ? 'Manual' : t)
        )].sort()

        // Extract all unique seating capacities
        const seatingOptions = [...new Set(
            variants
                .map(v => v.seating_capacity)
                .filter(v => v != null)
        )].sort((a, b) => a - b)

        // Get power range across all variants
        const powers = variants
            .map(v => v.power_bhp)
            .filter(v => v != null)

        const powerRange = {
            min: Math.min(...powers),
            max: Math.max(...powers),
            unit: 'bhp'
        }

        // Get mileage range across all variants
        const mileages = variants
            .map(v => {
                const value = v.mileage_kmpl || (v as any).mileage || parseFloat(v.mileage_kmpl_or_ev_range || '0')
                return value > 0 ? value : null
            })
            .filter(v => v != null)

        const mileageRange = mileages.length > 0 ? {
            min: Math.min(...mileages).toFixed(1),
            max: Math.max(...mileages).toFixed(1),
            unit: 'km/l'
        } : {
            min: 'N/A',
            max: 'N/A',
            unit: 'km/l'
        }

        // Create human-readable summary
        const summaryParts = []
        if (fuels.length > 0) summaryParts.push(`${fuels.join(' / ')}`)
        if (transmissions.length > 0) summaryParts.push(`${transmissions.join(' / ')}`)
        if (seatingOptions.length > 0) summaryParts.push(`${seatingOptions.join(' / ')} seater`)
        const summary = summaryParts.join(' • ')

        return {
            fuels,
            transmissions,
            seatingOptions,
            powerRange,
            mileageRange,
            variants,
            summary
        }
    } catch (error) {
        console.error(`Error aggregating specs for ${make} ${model}:`, error)
        return null
    }
}

/**
 * Format aggregated specs for display in card/popup
 */
export function formatSpecsForDisplay(specs: AggregatedCarSpecs | null) {
    if (!specs) return null

    return {
        fuelsDisplay: specs.fuels.join(' / '),
        transmissionsDisplay: specs.transmissions.join(' / '),
        seatingDisplay: specs.seatingOptions.join(' / '),
        powerDisplay: specs.powerRange.min === specs.powerRange.max
            ? `${specs.powerRange.min} ${specs.powerRange.unit}`
            : `${specs.powerRange.min} - ${specs.powerRange.max} ${specs.powerRange.unit}`,
        mileageDisplay: specs.mileageRange.min === specs.mileageRange.max
            ? `${specs.mileageRange.min} ${specs.mileageRange.unit}`
            : `${specs.mileageRange.min} - ${specs.mileageRange.max} ${specs.mileageRange.unit}`,
        summary: specs.summary,
        variantCount: specs.variants.length
    }
}

/**
 * Get variant-specific information
 */
export function getVariantInfo(variant: DetailedCarInfo) {
    return {
        name: variant.variant_name,
        fuel: variant.fuel_type,
        transmission: variant.transmission === 'Automatic' ? 'Auto' : variant.transmission,
        power: `${variant.power_bhp} bhp`,
        torque: `${variant.torque_nm} Nm`,
        mileage: variant.mileage_kmpl
            ? `${variant.mileage_kmpl} km/l`
            : (variant.mileage_kmpl_or_ev_range || 'N/A'),
        seating: `${variant.seating_capacity} seater`,
        price: variant.ex_showroom_price_min_inr,
        priceRange: variant.ex_showroom_price_max_inr
            ? `${variant.ex_showroom_price_min_inr} - ${variant.ex_showroom_price_max_inr}`
            : `${variant.ex_showroom_price_min_inr}`,
        engine: `${variant.engine_displacement_cc}cc`,
        bootSpace: variant.boot_space_l ? `${variant.boot_space_l}L` : null,
        groundClearance: variant.ground_clearance_mm ? `${variant.ground_clearance_mm}mm` : null
    }
}
