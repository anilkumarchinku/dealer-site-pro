export interface TwoWheelerVariantSource {
    name?: string | null
    variant?: string | null
    variant_name?: string | null
    price?: string | number | null
    price_paise?: number | null
}

export interface NormalizedTwoWheelerVariant {
    name: string
    price_paise: number
}

function normalizeVariantKey(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^\w]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export function parseTwoWheelerVariantPriceToPaise(raw: string | number | null | undefined): number {
    if (raw == null || raw === '') return 0
    if (typeof raw === 'number') {
        return Number.isFinite(raw) ? Math.round(raw * 100) : 0
    }

    const cleaned = raw.replace(/[₹,\s]/g, '')
    const lakhMatch = cleaned.match(/^([\d.]+)\s*[Ll]akh$/)
    if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000 * 100)
    const croreMatch = cleaned.match(/^([\d.]+)\s*[Cc]rore$/)
    if (croreMatch) return Math.round(parseFloat(croreMatch[1]) * 10000000 * 100)
    const parsed = parseFloat(cleaned)
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0
}

export function normalizeTwoWheelerVariants(
    variants: TwoWheelerVariantSource[] | null | undefined,
    fallback?: TwoWheelerVariantSource | null
): NormalizedTwoWheelerVariant[] {
    const rows = (variants ?? [])
        .map((variant) => {
            const name = (variant.name ?? variant.variant_name ?? variant.variant ?? '').trim()
            if (!name) return null
            return {
                name,
                price_paise: variant.price_paise ?? parseTwoWheelerVariantPriceToPaise(variant.price),
            }
        })
        .filter((variant): variant is NormalizedTwoWheelerVariant => Boolean(variant))

    if (rows.length === 0 && fallback) {
        const fallbackName = (fallback.name ?? fallback.variant_name ?? fallback.variant ?? '').trim()
        if (fallbackName) {
            rows.push({
                name: fallbackName,
                price_paise: fallback.price_paise ?? parseTwoWheelerVariantPriceToPaise(fallback.price),
            })
        }
    }

    const byName = new Map<string, NormalizedTwoWheelerVariant>()
    for (const row of rows) {
        const key = normalizeVariantKey(row.name)
        const existing = byName.get(key)
        if (!existing || (existing.price_paise <= 0 && row.price_paise > 0)) {
            byName.set(key, row)
        }
    }

    return Array.from(byName.values())
}

export function defaultTwoWheelerVariantName(model: string, variant?: string | null): string {
    const trimmedVariant = variant?.trim()
    if (trimmedVariant && normalizeVariantKey(trimmedVariant) !== normalizeVariantKey(model)) {
        return trimmedVariant
    }
    return `${model} Standard`
}
