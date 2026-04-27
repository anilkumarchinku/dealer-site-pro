export type TwoWheelerFuelType = 'petrol' | 'electric'

export interface TwoWheelerOnRoadVariantOption {
    id: string
    label: string
    exShowroomPaise: number
}

export interface TwoWheelerOnRoadPriceInput {
    exShowroomPaise: number
    engineCc: number | null
    fuelType: TwoWheelerFuelType
    stateCode: string
    financed?: boolean
}

export interface TwoWheelerOnRoadPriceBreakdown {
    exShowroom: number
    rtoCharges: number
    insurance: number
    handling: number
    hypothecation: number
    total: number
    rtoPercent: number
    stateCode: string
    stateName: string
}

export const TWO_WHEELER_STATE_PROFILES: Record<string, { name: string; petrolPct: number; electricPct: number }> = {
    AN: { name: 'Andaman and Nicobar Islands', petrolPct: 8, electricPct: 3 },
    AP: { name: 'Andhra Pradesh', petrolPct: 10, electricPct: 5 },
    AR: { name: 'Arunachal Pradesh', petrolPct: 8, electricPct: 3 },
    AS: { name: 'Assam', petrolPct: 8, electricPct: 4 },
    BR: { name: 'Bihar', petrolPct: 9, electricPct: 4 },
    CG: { name: 'Chhattisgarh', petrolPct: 8, electricPct: 4 },
    CH: { name: 'Chandigarh', petrolPct: 7, electricPct: 2 },
    DD: { name: 'Dadra and Nagar Haveli and Daman and Diu', petrolPct: 8, electricPct: 3 },
    DL: { name: 'Delhi', petrolPct: 4, electricPct: 0 },
    GA: { name: 'Goa', petrolPct: 8, electricPct: 3 },
    GJ: { name: 'Gujarat', petrolPct: 7, electricPct: 3 },
    HP: { name: 'Himachal Pradesh', petrolPct: 8, electricPct: 4 },
    HR: { name: 'Haryana', petrolPct: 8, electricPct: 4 },
    JH: { name: 'Jharkhand', petrolPct: 8, electricPct: 4 },
    JK: { name: 'Jammu and Kashmir', petrolPct: 8, electricPct: 3 },
    KA: { name: 'Karnataka', petrolPct: 13, electricPct: 4 },
    KL: { name: 'Kerala', petrolPct: 10, electricPct: 4 },
    LA: { name: 'Ladakh', petrolPct: 8, electricPct: 3 },
    LD: { name: 'Lakshadweep', petrolPct: 8, electricPct: 3 },
    MH: { name: 'Maharashtra', petrolPct: 10, electricPct: 7 },
    ML: { name: 'Meghalaya', petrolPct: 8, electricPct: 4 },
    MN: { name: 'Manipur', petrolPct: 8, electricPct: 4 },
    MP: { name: 'Madhya Pradesh', petrolPct: 8, electricPct: 4 },
    MZ: { name: 'Mizoram', petrolPct: 8, electricPct: 3 },
    NL: { name: 'Nagaland', petrolPct: 8, electricPct: 3 },
    OD: { name: 'Odisha', petrolPct: 8, electricPct: 4 },
    PB: { name: 'Punjab', petrolPct: 9, electricPct: 4 },
    PY: { name: 'Puducherry', petrolPct: 8, electricPct: 3 },
    RJ: { name: 'Rajasthan', petrolPct: 10, electricPct: 4 },
    SK: { name: 'Sikkim', petrolPct: 8, electricPct: 3 },
    TN: { name: 'Tamil Nadu', petrolPct: 10, electricPct: 5 },
    TR: { name: 'Tripura', petrolPct: 8, electricPct: 3 },
    TS: { name: 'Telangana', petrolPct: 12, electricPct: 6 },
    UK: { name: 'Uttarakhand', petrolPct: 8, electricPct: 4 },
    UP: { name: 'Uttar Pradesh', petrolPct: 11, electricPct: 5 },
    WB: { name: 'West Bengal', petrolPct: 10, electricPct: 5 },
}

export const TWO_WHEELER_STATE_OPTIONS = Object.entries(TWO_WHEELER_STATE_PROFILES).map(([code, value]) => ({
    code,
    name: value.name,
}))

export function parseTwoWheelerPriceToPaise(raw: string | null | undefined): number {
    if (!raw) return 0
    const cleaned = raw.replace(/[₹,\s]/g, '')
    const lakhMatch = cleaned.match(/^([\d.]+)\s*[Ll]akh$/)
    if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000 * 100)
    const croreMatch = cleaned.match(/^([\d.]+)\s*[Cc]rore$/)
    if (croreMatch) return Math.round(parseFloat(croreMatch[1]) * 10000000 * 100)
    const numeric = parseFloat(cleaned)
    if (!Number.isNaN(numeric)) return Math.round(numeric * 100)
    return 0
}

export function getTwoWheelerInsurance(engineCc: number | null, fuelType: TwoWheelerFuelType): number {
    if (fuelType === 'electric') return 4200
    if (!engineCc || engineCc === 0) return 2901
    if (engineCc <= 75) return 2901
    if (engineCc <= 150) return 3851
    if (engineCc <= 350) return 7897
    return 13034
}

export function calculateTwoWheelerOnRoadPrice(input: TwoWheelerOnRoadPriceInput): TwoWheelerOnRoadPriceBreakdown {
    const state = TWO_WHEELER_STATE_PROFILES[input.stateCode] ?? TWO_WHEELER_STATE_PROFILES.KA
    const exShowroom = input.exShowroomPaise / 100
    const rtoPercent = input.fuelType === 'electric' ? state.electricPct : state.petrolPct
    const rtoCharges = Math.round(exShowroom * rtoPercent / 100)
    const insurance = getTwoWheelerInsurance(input.engineCc, input.fuelType)
    const handling = 7500
    const hypothecation = input.financed ? 1500 : 0
    const total = exShowroom + rtoCharges + insurance + handling + hypothecation

    return {
        exShowroom,
        rtoCharges,
        insurance,
        handling,
        hypothecation,
        total,
        rtoPercent,
        stateCode: input.stateCode,
        stateName: state.name,
    }
}

export function formatInr(amount: number): string {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`
}
