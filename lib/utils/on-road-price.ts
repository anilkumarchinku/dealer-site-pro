import type { Car } from '@/lib/types/car'

export type IndianStateCode =
    | 'AN' | 'AP' | 'AR' | 'AS' | 'BR' | 'CG' | 'CH' | 'DD' | 'DL' | 'GA'
    | 'GJ' | 'HP' | 'HR' | 'JH' | 'JK' | 'KA' | 'KL' | 'LA' | 'LD' | 'MH'
    | 'ML' | 'MN' | 'MP' | 'MZ' | 'NL' | 'OD' | 'PB' | 'PY' | 'RJ' | 'SK'
    | 'TN' | 'TR' | 'TS' | 'UK' | 'UP' | 'WB'

type FuelBucket = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng'

interface TaxSlab {
    upto?: number
    petrol: number
    diesel: number
    electric: number
    hybrid: number
    cng: number
}

interface StateProfile {
    code: IndianStateCode
    name: string
    insuranceMultiplier: number
    registrationFee: number
    smartCardFee: number
    hsrpFee: number
    fastagFee: number
    hypothecationFee: number
    slabs: TaxSlab[]
}

export interface CarOnRoadVariantOption {
    id: string
    label: string
    exShowroom: number
    fuelType: string
    engineCc: number | null
    exactOnRoad: number | null
}

export interface CarOnRoadPriceInput {
    exShowroom: number
    fuelType: string
    engineCc?: number | null
    stateCode: IndianStateCode
    financed?: boolean
    exactInsurance?: number | null
    exactOnRoad?: number | null
}

export interface CarOnRoadPriceBreakdown {
    exShowroom: number
    roadTax: number
    registrationFee: number
    smartCardFee: number
    hsrpFee: number
    fastagFee: number
    insurance: number
    tcs: number
    hypothecationFee: number
    total: number
    roadTaxPercent: number
    insuranceSource: 'catalog' | 'estimated'
    totalSource: 'catalog' | 'estimated'
    stateCode: IndianStateCode
    stateName: string
}

const DEFAULT_FEES = {
    registrationFee: 600,
    smartCardFee: 200,
    hsrpFee: 600,
    fastagFee: 600,
    hypothecationFee: 1500,
} as const

const DEFAULT_SLAB: TaxSlab = {
    petrol: 8,
    diesel: 9,
    electric: 3,
    hybrid: 7,
    cng: 7,
}

export const INDIAN_STATE_PROFILES: Record<IndianStateCode, StateProfile> = {
    AN: { code: 'AN', name: 'Andaman and Nicobar Islands', insuranceMultiplier: 0.95, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    AP: { code: 'AP', name: 'Andhra Pradesh', insuranceMultiplier: 1.01, ...DEFAULT_FEES, slabs: [{ petrol: 11, diesel: 12, electric: 6, hybrid: 10, cng: 10 }] },
    AR: { code: 'AR', name: 'Arunachal Pradesh', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    AS: { code: 'AS', name: 'Assam', insuranceMultiplier: 0.98, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 4, hybrid: 7, cng: 7 }] },
    BR: { code: 'BR', name: 'Bihar', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ petrol: 9, diesel: 10, electric: 4, hybrid: 8, cng: 8 }] },
    CG: { code: 'CG', name: 'Chhattisgarh', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 4, hybrid: 7, cng: 7 }] },
    CH: { code: 'CH', name: 'Chandigarh', insuranceMultiplier: 1.0, ...DEFAULT_FEES, slabs: [{ petrol: 6, diesel: 7, electric: 2, hybrid: 6, cng: 6 }] },
    DD: { code: 'DD', name: 'Dadra and Nagar Haveli and Daman and Diu', insuranceMultiplier: 0.95, ...DEFAULT_FEES, slabs: [{ petrol: 7, diesel: 8, electric: 3, hybrid: 7, cng: 7 }] },
    DL: {
        code: 'DL',
        name: 'Delhi',
        insuranceMultiplier: 1.0,
        ...DEFAULT_FEES,
        slabs: [
            { upto: 600000, petrol: 4, diesel: 5, electric: 0, hybrid: 4, cng: 4 },
            { upto: 1000000, petrol: 7, diesel: 8, electric: 0, hybrid: 6, cng: 6 },
            { petrol: 10, diesel: 12.5, electric: 0, hybrid: 8, cng: 8 },
        ],
    },
    GA: { code: 'GA', name: 'Goa', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 2, hybrid: 7, cng: 7 }] },
    GJ: { code: 'GJ', name: 'Gujarat', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ petrol: 6, diesel: 6, electric: 1, hybrid: 5, cng: 5 }] },
    HP: { code: 'HP', name: 'Himachal Pradesh', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 4, hybrid: 7, cng: 7 }] },
    HR: { code: 'HR', name: 'Haryana', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 2, hybrid: 7, cng: 7 }] },
    JH: { code: 'JH', name: 'Jharkhand', insuranceMultiplier: 0.98, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 4, hybrid: 7, cng: 7 }] },
    JK: { code: 'JK', name: 'Jammu and Kashmir', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 2, hybrid: 7, cng: 7 }] },
    KA: {
        code: 'KA',
        name: 'Karnataka',
        insuranceMultiplier: 1.02,
        ...DEFAULT_FEES,
        slabs: [
            { upto: 1000000, petrol: 13, diesel: 14, electric: 4, hybrid: 12, cng: 12 },
            { petrol: 18, diesel: 18, electric: 6, hybrid: 15, cng: 15 },
        ],
    },
    KL: { code: 'KL', name: 'Kerala', insuranceMultiplier: 1.01, ...DEFAULT_FEES, slabs: [{ petrol: 11, diesel: 13, electric: 5, hybrid: 10, cng: 10 }] },
    LA: { code: 'LA', name: 'Ladakh', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    LD: { code: 'LD', name: 'Lakshadweep', insuranceMultiplier: 0.95, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    MH: {
        code: 'MH',
        name: 'Maharashtra',
        insuranceMultiplier: 1.05,
        ...DEFAULT_FEES,
        slabs: [
            { upto: 1000000, petrol: 11, diesel: 12, electric: 6, hybrid: 10, cng: 10 },
            { petrol: 13, diesel: 14, electric: 7, hybrid: 11, cng: 11 },
        ],
    },
    ML: { code: 'ML', name: 'Meghalaya', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    MN: { code: 'MN', name: 'Manipur', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    MP: { code: 'MP', name: 'Madhya Pradesh', insuranceMultiplier: 0.98, ...DEFAULT_FEES, slabs: [{ petrol: 9, diesel: 10, electric: 4, hybrid: 8, cng: 8 }] },
    MZ: { code: 'MZ', name: 'Mizoram', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    NL: { code: 'NL', name: 'Nagaland', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    OD: { code: 'OD', name: 'Odisha', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 4, hybrid: 7, cng: 7 }] },
    PB: { code: 'PB', name: 'Punjab', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 4, hybrid: 7, cng: 7 }] },
    PY: { code: 'PY', name: 'Puducherry', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ petrol: 7, diesel: 8, electric: 3, hybrid: 6, cng: 6 }] },
    RJ: { code: 'RJ', name: 'Rajasthan', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ petrol: 10, diesel: 11, electric: 4, hybrid: 9, cng: 9 }] },
    SK: { code: 'SK', name: 'Sikkim', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    TN: { code: 'TN', name: 'Tamil Nadu', insuranceMultiplier: 1.03, ...DEFAULT_FEES, slabs: [{ petrol: 10, diesel: 11, electric: 5, hybrid: 9, cng: 9 }] },
    TR: { code: 'TR', name: 'Tripura', insuranceMultiplier: 0.96, ...DEFAULT_FEES, slabs: [{ ...DEFAULT_SLAB }] },
    TS: { code: 'TS', name: 'Telangana', insuranceMultiplier: 1.01, ...DEFAULT_FEES, slabs: [{ petrol: 12, diesel: 14, electric: 6, hybrid: 11, cng: 11 }] },
    UK: { code: 'UK', name: 'Uttarakhand', insuranceMultiplier: 0.97, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 4, hybrid: 7, cng: 7 }] },
    UP: { code: 'UP', name: 'Uttar Pradesh', insuranceMultiplier: 0.95, ...DEFAULT_FEES, slabs: [{ petrol: 8, diesel: 9, electric: 4, hybrid: 7, cng: 7 }] },
    WB: { code: 'WB', name: 'West Bengal', insuranceMultiplier: 0.98, ...DEFAULT_FEES, slabs: [{ petrol: 10, diesel: 11, electric: 5, hybrid: 9, cng: 9 }] },
}

export const INDIAN_STATE_OPTIONS = Object.values(INDIAN_STATE_PROFILES)

function inferFuelBucket(fuelType: string): FuelBucket {
    const normalized = fuelType.toLowerCase()
    if (normalized.includes('electric')) return 'electric'
    if (normalized.includes('diesel')) return 'diesel'
    if (normalized.includes('hybrid')) return 'hybrid'
    if (normalized.includes('cng')) return 'cng'
    return 'petrol'
}

function resolveRoadTaxPercent(exShowroom: number, fuelType: string, stateCode: IndianStateCode): number {
    const profile = INDIAN_STATE_PROFILES[stateCode] ?? INDIAN_STATE_PROFILES.DL
    const slab = profile.slabs.find((entry) => !entry.upto || exShowroom <= entry.upto) ?? profile.slabs[profile.slabs.length - 1]
    return slab[inferFuelBucket(fuelType)]
}

function estimateThirdPartyInsurance(engineCc: number | null | undefined, fuelType: string): number {
    const bucket = inferFuelBucket(fuelType)
    if (bucket === 'electric') return 5700
    if (!engineCc || engineCc <= 1000) return 6300
    if (engineCc <= 1500) return 10200
    return 23700
}

function estimateOwnDamageInsurance(exShowroom: number, fuelType: string, stateCode: IndianStateCode): number {
    const bucket = inferFuelBucket(fuelType)
    const profile = INDIAN_STATE_PROFILES[stateCode] ?? INDIAN_STATE_PROFILES.DL
    const rate = bucket === 'electric'
        ? 0.015
        : bucket === 'diesel'
            ? 0.020
            : 0.018
    const minimum = bucket === 'electric' ? 9000 : 12000
    return Math.max(Math.round(exShowroom * rate * profile.insuranceMultiplier), minimum)
}

export function calculateCarOnRoadPrice(input: CarOnRoadPriceInput): CarOnRoadPriceBreakdown {
    const profile = INDIAN_STATE_PROFILES[input.stateCode] ?? INDIAN_STATE_PROFILES.DL
    const roadTaxPercent = resolveRoadTaxPercent(input.exShowroom, input.fuelType, input.stateCode)
    const roadTax = Math.round(input.exShowroom * roadTaxPercent / 100)
    const insurance = input.exactInsurance && input.exactInsurance > 0
        ? input.exactInsurance
        : estimateThirdPartyInsurance(input.engineCc, input.fuelType) +
          estimateOwnDamageInsurance(input.exShowroom, input.fuelType, input.stateCode)
    const tcs = input.exShowroom > 1000000 ? Math.round(input.exShowroom * 0.01) : 0
    const hypothecationFee = input.financed ? profile.hypothecationFee : 0
    const estimatedTotal = input.exShowroom
        + roadTax
        + profile.registrationFee
        + profile.smartCardFee
        + profile.hsrpFee
        + profile.fastagFee
        + insurance
        + tcs
        + hypothecationFee
    const total = input.exactOnRoad && input.exactOnRoad > 0 ? input.exactOnRoad : estimatedTotal

    return {
        exShowroom: input.exShowroom,
        roadTax,
        registrationFee: profile.registrationFee,
        smartCardFee: profile.smartCardFee,
        hsrpFee: profile.hsrpFee,
        fastagFee: profile.fastagFee,
        insurance,
        tcs,
        hypothecationFee,
        total,
        roadTaxPercent,
        insuranceSource: input.exactInsurance && input.exactInsurance > 0 ? 'catalog' : 'estimated',
        totalSource: input.exactOnRoad && input.exactOnRoad > 0 ? 'catalog' : 'estimated',
        stateCode: input.stateCode,
        stateName: profile.name,
    }
}

export function buildCarOnRoadVariantOptions(car: Car): CarOnRoadVariantOption[] {
    if (car.variants && car.variants.length > 0) {
        const options = car.variants
            .filter((variant) => variant.price > 0)
            .map((variant) => ({
                id: variant.id,
                label: variant.name,
                exShowroom: variant.price,
                fuelType: variant.fuelType || car.engine.type,
                engineCc: variant.engineCc ?? car.engine.displacement ?? null,
                exactOnRoad: variant.exactOnRoad?.hyderabad ?? null,
            }))
        if (options.length > 0) return options
    }

    const fallbackPrice = car.pricing.exShowroom.min ?? car.pricing.exShowroom.max ?? 0
    return [{
        id: `${car.id}-default`,
        label: car.variant || `${car.make} ${car.model}`,
        exShowroom: fallbackPrice,
        fuelType: car.engine.type,
        engineCc: car.engine.displacement ?? null,
        exactOnRoad: car.pricing.onRoad?.hyderabad ?? null,
    }]
}

export function formatInr(amount: number): string {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`
}
