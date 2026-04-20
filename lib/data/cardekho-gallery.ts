import 'server-only'

import { cache } from 'react'
import fs from 'fs'
import path from 'path'

export interface CardekhoGalleryData {
    sourceUrl: string
    hero: string | null
    exterior: string[]
    interior: string[]
    colorNames: string[]
    colorImages: string[]
    feature: string[]
}

function slugify(value: string): string {
    return String(value || '')
        .toLowerCase()
        .replace(/\./g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

function stripBrandPrefix(modelSlug: string, brandSlug: string): string {
    const normalizedModel = slugify(modelSlug)
    const normalizedBrand = slugify(brandSlug)
    if (!normalizedBrand) return normalizedModel

    if (normalizedModel === normalizedBrand) return normalizedModel
    if (normalizedModel.startsWith(`${normalizedBrand}-`)) {
        return normalizedModel.slice(normalizedBrand.length + 1)
    }
    return normalizedModel
}

function normalizeSourceUrl(url: string): string {
    try {
        const parsed = new URL(String(url || '').trim())
        const cleanedPath = parsed.pathname
            .replace(/\/(?:variants\.htm|specs|colors)$/i, '')
            .replace(/\/price-in-[^/]+$/i, '')
            .replace(/\/$/, '')

        return `${parsed.origin.toLowerCase()}${cleanedPath}`
    } catch {
        return String(url || '').trim().replace(/\/$/, '')
    }
}

function deriveSourceTokens(sourceUrl: string): { brandSlug: string; modelTokens: string[] } | null {
    try {
        const parsed = new URL(sourceUrl)
        const parts = parsed.pathname.split('/').filter(Boolean)
        if (parts.length === 0) return null

        let brandSlug = ''
        let rawModel = ''

        if (parts[0].toLowerCase() === 'overview' && parts[1]) {
            rawModel = parts[1]
            brandSlug = slugify(rawModel.split(/[_-]+/)[0] || '')
        } else if (parts[0].toLowerCase() === 'carmodels' && parts[1] && parts[2]) {
            brandSlug = slugify(parts[1])
            rawModel = parts[2]
        } else if (parts[0] && parts[1]) {
            brandSlug = slugify(parts[0])
            rawModel = parts[1]
        } else {
            return null
        }

        const primaryModel = slugify(rawModel)
        const strippedModel = stripBrandPrefix(primaryModel, brandSlug)
        const modelTokens = Array.from(new Set([primaryModel, strippedModel].filter(Boolean)))

        return { brandSlug, modelTokens }
    } catch {
        return null
    }
}

type LocalGalleryEntry = CardekhoGalleryData & {
    brandSlug: string
    modelSlug: string
    makeSlug: string
    modelNameSlug: string
    sourceUrlNormalized: string
    modelTokens: string[]
}

const loadLocalGalleryIndex = cache((): LocalGalleryEntry[] => {
    const rootDir = path.join(
        process.cwd(),
        'public',
        'data',
        'brand-model-images',
        '4w-galleries'
    )

    if (!fs.existsSync(rootDir)) return []

    const entries: LocalGalleryEntry[] = []

    const visit = (dirPath: string) => {
        for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
            const fullPath = path.join(dirPath, entry.name)
            if (entry.isDirectory()) {
                visit(fullPath)
                continue
            }

            if (entry.name !== 'metadata.json') continue

            try {
                const metadata = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as Partial<CardekhoGalleryData> & {
                    sourceUrl?: string
                    brandSlug?: string
                    modelSlug?: string
                    make?: string
                    model?: string
                }

                const brandSlug = String(metadata.brandSlug ?? '')
                const modelSlug = String(metadata.modelSlug ?? '')
                const makeSlug = slugify(String(metadata.make ?? brandSlug))
                const modelNameSlug = slugify(String(metadata.model ?? modelSlug))
                const strippedModelSlug = stripBrandPrefix(modelSlug, brandSlug)

                entries.push({
                    sourceUrl: metadata.sourceUrl ?? '',
                    hero: metadata.hero ?? null,
                    exterior: metadata.exterior ?? [],
                    interior: metadata.interior ?? [],
                    colorNames: metadata.colorNames ?? [],
                    colorImages: metadata.colorImages ?? [],
                    feature: metadata.feature ?? [],
                    brandSlug,
                    modelSlug,
                    makeSlug,
                    modelNameSlug,
                    sourceUrlNormalized: normalizeSourceUrl(metadata.sourceUrl ?? ''),
                    modelTokens: Array.from(new Set([
                        slugify(modelSlug),
                        strippedModelSlug,
                        modelNameSlug,
                    ].filter(Boolean))),
                })
            } catch {
                continue
            }
        }
    }

    visit(rootDir)
    return entries
})

function loadLocalGallery(sourceUrl: string): CardekhoGalleryData | null {
    try {
        const entries = loadLocalGalleryIndex()
        if (entries.length === 0) return null

        const normalizedSourceUrl = normalizeSourceUrl(sourceUrl)

        const exactSourceMatch = entries.find((entry) => entry.sourceUrlNormalized === normalizedSourceUrl)
        if (exactSourceMatch) return exactSourceMatch

        const tokens = deriveSourceTokens(sourceUrl)
        if (!tokens) return null

        const exactTokenMatch = entries.find((entry) =>
            (entry.makeSlug === tokens.brandSlug || slugify(entry.brandSlug) === tokens.brandSlug) &&
            tokens.modelTokens.some((token) => entry.modelTokens.includes(token))
        )
        if (exactTokenMatch) return exactTokenMatch

        const looseTokenMatch = entries.find((entry) =>
            (entry.makeSlug === tokens.brandSlug || slugify(entry.brandSlug) === tokens.brandSlug) &&
            tokens.modelTokens.some((token) =>
                entry.modelTokens.some((entryToken) =>
                    entryToken === token ||
                    entryToken.startsWith(`${token}-`) ||
                    token.startsWith(`${entryToken}-`)
                )
            )
        )

        return looseTokenMatch ?? null
    } catch {
        return null
    }
}

function normalizeUrl(url: string): string {
    return url
        .replace(/\\\//g, '/')
        .replace(/&amp;/g, '&')
        .replace(/\?tr=[^"' )]+/g, '')
        .replace('/630x420/', '/930x620/')
        .trim()
}

function uniqueUrls(values: string[]): string[] {
    const seen = new Set<string>()
    const output: string[] = []

    for (const value of values) {
        const normalized = normalizeUrl(value)
        if (!normalized.startsWith('https://stimg.cardekho.com/images/')) continue
        if (seen.has(normalized)) continue
        seen.add(normalized)
        output.push(normalized)
    }

    return output
}

function extractUrls(html: string, folder: 'carexteriorimages' | 'carinteriorimages'): string[] {
    const pattern = new RegExp(`https?:\\\\?/\\\\?/stimg\\.cardekho\\.com\\\\?/images\\\\?/${folder}[^"'\\s<)]+`, 'gi')
    return uniqueUrls(Array.from(html.matchAll(pattern), match => match[0]))
}

function extractColorImages(html: string): string[] {
    const pattern = /https?:\\?\/\\?\/stimg\.cardekho\.com\\?\/images\\?\/car-images[^"'\\s<)]+/gi
    return uniqueUrls(Array.from(html.matchAll(pattern), match => match[0]))
}

function extractFeatureExterior(html: string): string[] {
    const pattern = /https?:\\?\/\\?\/stimg\.cardekho\.com\\?\/images\\?\/carexteriorimages[^"'\\s<)]*visual-summary[^"'\\s<)]*/gi
    return uniqueUrls(Array.from(html.matchAll(pattern), match => match[0]))
}

function extractLdJsonBlocks(html: string): string[] {
    const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) ?? []
    return blocks
        .map(block => block.replace(/^<script type="application\/ld\+json">/i, '').replace(/<\/script>$/i, '').trim())
        .filter(Boolean)
}

function extractColorNamesFromLdJson(html: string): string[] {
    const names = new Set<string>()

    for (const block of extractLdJsonBlocks(html)) {
        try {
            const parsed = JSON.parse(block)
            const nodes = Array.isArray(parsed) ? parsed : [parsed]

            for (const node of nodes) {
                const colors = Array.isArray(node?.Color) ? node.Color : []
                for (const color of colors) {
                    const name = String(color ?? '').trim()
                    if (name) names.add(name)
                }
            }
        } catch {
            continue
        }
    }

    return Array.from(names)
}

export const fetchCardekhoGallery = cache(async (sourceUrl: string): Promise<CardekhoGalleryData | null> => {
    if (!sourceUrl?.startsWith('http')) return null

    try {
        const localGallery = loadLocalGallery(sourceUrl)
        if (localGallery) return localGallery

        const picturesUrl = sourceUrl.replace(/\/$/, '') + '/pictures'
        const colorsUrl = sourceUrl.replace(/\/$/, '') + '/colors'

        const [response, colorsResponse] = await Promise.all([
            fetch(picturesUrl, {
                headers: {
                    'user-agent': 'Mozilla/5.0',
                    'accept-language': 'en-IN,en;q=0.9',
                },
                next: { revalidate: 60 * 60 * 24 },
            }),
            fetch(colorsUrl, {
                headers: {
                    'user-agent': 'Mozilla/5.0',
                    'accept-language': 'en-IN,en;q=0.9',
                },
                next: { revalidate: 60 * 60 * 24 },
            }),
        ])

        if (!response.ok && !colorsResponse.ok) return null

        const html = response.ok ? await response.text() : ''
        const colorsHtml = colorsResponse.ok ? await colorsResponse.text() : ''
        const exterior = extractUrls(html, 'carexteriorimages')
        const interior = extractUrls(html, 'carinteriorimages')
        const colorNames = extractColorNamesFromLdJson(colorsHtml || html)
        const colorImages = extractColorImages(colorsHtml)
        const feature = extractFeatureExterior(colorsHtml)

        return {
            sourceUrl,
            hero: exterior[0] ?? feature[0] ?? colorImages[0] ?? null,
            exterior,
            interior,
            colorNames,
            colorImages,
            feature,
        }
    } catch {
        return null
    }
})
