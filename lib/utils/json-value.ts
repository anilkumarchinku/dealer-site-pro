import type { Json } from '@/lib/database.types'

export function toJsonValue(value: unknown): Json | null {
    if (value === undefined || value === null) return null
    return JSON.parse(JSON.stringify(value)) as Json
}
