function normalizeText(value: string | null | undefined): string {
    return (value ?? '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
}

export function dedupeCaseInsensitiveStrings(values: string[]): string[] {
    const seen = new Set<string>()
    const deduped: string[] = []

    for (const value of values) {
        const key = normalizeText(value)
        if (!key || seen.has(key)) continue
        seen.add(key)
        deduped.push(value)
    }

    return deduped
}

export function dedupeByKey<T>(items: T[], getKey: (item: T) => string): T[] {
    const seen = new Set<string>()
    const deduped: T[] = []

    for (const item of items) {
        const key = normalizeText(getKey(item))
        if (!key || seen.has(key)) continue
        seen.add(key)
        deduped.push(item)
    }

    return deduped
}

export function dedupeByBrandModel<T extends { brand?: string | null; model?: string | null }>(items: T[]): T[] {
    return dedupeByKey(items, item => `${item.brand ?? ''}__${item.model ?? ''}`)
}

export function dedupeByMakeModel<T extends { make?: string | null; model?: string | null }>(items: T[]): T[] {
    return dedupeByKey(items, item => `${item.make ?? ''}__${item.model ?? ''}`)
}
