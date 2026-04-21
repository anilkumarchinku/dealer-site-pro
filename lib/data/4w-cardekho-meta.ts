import rawMeta from '@/lib/data/generated/4w-cardekho-meta.json'
import type { BodyType } from '@/lib/types/car'
import { normalize4WBodyType, normalize4WMakeKey, normalize4WModelKey } from '@/lib/data/four-wheelers'

export interface FourWCardekhoModelMeta {
    model: string
    bodyType: BodyType | null
    fuelType: string | null
    imageUrl: string | null
    sourceUrl: string | null
    priceMinInr: number | null
    existsInLocal: boolean
}

export interface FourWCardekhoBrandMeta {
    make: string
    cardekhoBrandUrl: string
    totalLocalModels: number
    totalCardekhoModels: number
    missingModels: string[]
    localOnlyModels?: string[]
    models: Record<string, FourWCardekhoModelMeta>
}

interface FourWCardekhoMetaFile {
    meta?: {
        generatedAt?: string
        brandsAudited?: number
        currentModelCount?: number
    }
    brands?: Record<string, FourWCardekhoBrandMeta>
}

const cardekhoMeta = rawMeta as FourWCardekhoMetaFile

export function get4WCardekhoBrandMeta(make: string): FourWCardekhoBrandMeta | null {
    return cardekhoMeta.brands?.[normalize4WMakeKey(make)] ?? null
}

export function get4WCardekhoModelMeta(make: string, model: string): FourWCardekhoModelMeta | null {
    const brandMeta = get4WCardekhoBrandMeta(make)
    if (!brandMeta) return null

    const meta = brandMeta.models?.[normalize4WModelKey(model)] ?? null
    if (!meta) return null

    return {
        ...meta,
        bodyType: normalize4WBodyType(meta.bodyType),
    }
}
