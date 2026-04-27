import 'server-only'

import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'
import { brandNameToId, modelToSlug } from '@/lib/utils/brand-model-images'
import { getRequestOrigin } from '@/lib/utils/request-origin'

export interface CardekhoGalleryData {
    sourceUrl: string
    hero: string | null
    exterior: string[]
    interior: string[]
    colorNames: string[]
    colorImages: string[]
    feature: string[]
}

interface GalleryLookupOptions {
    make?: string
    model?: string
}

function slugify(value: string): string {
    return String(value || '')
        .toLowerCase()
        .replace(/\./g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

function normalizeAliasKey(value: string): string {
    return String(value || '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
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

const EXPLICIT_4W_GALLERY_ALIASES: Record<string, string[]> = {
    'bentley::continental gt': ['continental'],
    'bentley::continental gtc': ['continental'],
    'bmw::m8': ['m8-coupe-competition'],
    'mahindra::xuv400': ['xuv400-ev'],
    'mahindra::scorpio classic': ['scorpio'],
    'maruti-suzuki::wagonr': ['wagon-r'],
    'hyundai::creta ev': ['creta-electric'],
    'mercedes-benz::eqg': ['g-class-electric'],
    'mercedes-benz::amg gt coupe': ['amg-gt-4-door-coupe'],
    'toyota::fortuner': ['Toyota_Fortuner'],
    'toyota::urban cruiser hyryder': ['hyryder'],
    'toyota::rumion': ['Toyota_Rumion'],
    'vinfast::vf 6': ['vf6'],
    'vinfast::vf 7': ['vf7'],
}

function getExplicitGalleryAliasTokens(make: string, model: string): string[] {
    const key = `${slugify(make)}::${normalizeAliasKey(model)}`
    return EXPLICIT_4W_GALLERY_ALIASES[key] ?? []
}

function normalizeUrl(url: string): string {
    return url
        .replace(/\\\//g, '/')
        .replace(/&amp;/g, '&')
        .replace(/\?tr=[^"' )]+/g, '')
        // Upgrade to highest resolution variant
        .replace(/\/\d{3,4}x\d{3,4}\//g, '/930x620/')
        .trim()
}

/**
 * Deduplicate scraped image URLs.
 * CardDekho serves the same photo under multiple paths:
 *   .../930x620/Brand/Model/11503/1738922227482/rear-view.jpg
 *   .../630x420/Brand/Model/11279/1722506862133/rear-view.jpg
 * These are the same "rear-view.jpg" for the same Brand/Model but with
 * different size prefixes AND different numeric IDs (model-year entries).
 * We dedup by extracting just Brand/Model/filename, ignoring size and IDs.
 */
function uniqueUrls(values: string[]): string[] {
    const seen = new Set<string>()
    const output: string[] = []

    for (const value of values) {
        const normalized = normalizeUrl(value)
        if (!normalized.startsWith('https://stimg.cardekho.com/images/')) continue
        // Strip size segments AND all-numeric path segments (IDs/timestamps)
        // to get a stable key like ".../carexteriorimages/Brand/Model/rear-view.jpg"
        // Uses split+filter because regex can't handle consecutive numeric segments
        // (the shared "/" between /11503/1738922227482/ gets consumed by the first match)
        const dedupKey = normalized.split('/').filter(seg => !/^\d+$/.test(seg) && !/^\d{3,4}x\d{3,4}$/.test(seg)).join('/')
        if (seen.has(dedupKey)) continue
        seen.add(dedupKey)
        output.push(normalized)
    }

    return output
}

function extractUrls(html: string, folder: 'carexteriorimages' | 'carinteriorimages'): string[] {
    const pattern = new RegExp(`https?:\\\\?/\\\\?/stimg\\.cardekho\\.com\\\\?/images\\\\?/${folder}[^"'\\s<)]+`, 'gi')
    return uniqueUrls(Array.from(html.matchAll(pattern), (match) => match[0]))
}

function extractColorImages(html: string): string[] {
    const pattern = /https?:\\?\/\\?\/stimg\.cardekho\.com\\?\/images\\?\/car-images[^"'\\s<)]+/gi
    return uniqueUrls(Array.from(html.matchAll(pattern), (match) => match[0]))
}

function extractFeatureExterior(html: string): string[] {
    const pattern = /https?:\\?\/\\?\/stimg\.cardekho\.com\\?\/images\\?\/carexteriorimages[^"'\\s<)]*visual-summary[^"'\\s<)]*/gi
    return uniqueUrls(Array.from(html.matchAll(pattern), (match) => match[0]))
}

function extractLdJsonBlocks(html: string): string[] {
    const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) ?? []
    return blocks
        .map((block) => block.replace(/^<script type="application\/ld\+json">/i, '').replace(/<\/script>$/i, '').trim())
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

function buildLocalGalleryCandidates(sourceUrl: string, options?: GalleryLookupOptions): string[] {
    const candidates = new Set<string>()
    const root = process.cwd()

    if (options?.make && options?.model) {
        const brandFolder = brandNameToId(options.make, '4w')
        const modelFolder = modelToSlug(options.model)
        candidates.add(
            path.join(root, 'public', 'data', 'brand-model-images', '4w-galleries', brandFolder, modelFolder, 'metadata.json')
        )

        for (const relatedModelToken of getExplicitGalleryAliasTokens(options.make, options.model)) {
            candidates.add(
                path.join(root, 'public', 'data', 'brand-model-images', '4w-galleries', brandFolder, relatedModelToken, 'metadata.json')
            )
        }
    }

    const tokens = deriveSourceTokens(sourceUrl)
    if (tokens) {
        for (const modelToken of tokens.modelTokens) {
            candidates.add(
                path.join(root, 'public', 'data', 'brand-model-images', '4w-galleries', tokens.brandSlug, modelToken, 'metadata.json')
            )
        }
    }

    return Array.from(candidates)
}

async function loadLocalGallery(sourceUrl: string, options?: GalleryLookupOptions): Promise<CardekhoGalleryData | null> {
    for (const candidate of buildLocalGalleryCandidates(sourceUrl, options)) {
        try {
            const metadata = JSON.parse(
                await fs.readFile(candidate, 'utf8')
            ) as Partial<CardekhoGalleryData> & { sourceUrl?: string }

            return {
                sourceUrl: metadata.sourceUrl ?? sourceUrl,
                hero: metadata.hero ?? null,
                exterior: metadata.exterior ?? [],
                interior: metadata.interior ?? [],
                colorNames: metadata.colorNames ?? [],
                colorImages: metadata.colorImages ?? [],
                feature: metadata.feature ?? [],
            }
        } catch {
            continue
        }
    }

    const origin = await getRequestOrigin()
    if (!origin) return null

    for (const candidate of buildLocalGalleryCandidates(sourceUrl, options)) {
        const publicPath = candidate.split(`${path.sep}public${path.sep}`)[1]
        if (!publicPath) continue

        try {
            const response = await fetch(`${origin}/${publicPath.split(path.sep).join('/')}`, {
                next: { revalidate: 60 * 60 * 24 },
            })
            if (!response.ok) continue

            const metadata = await response.json() as Partial<CardekhoGalleryData> & { sourceUrl?: string }
            return {
                sourceUrl: metadata.sourceUrl ?? sourceUrl,
                hero: metadata.hero ?? null,
                exterior: metadata.exterior ?? [],
                interior: metadata.interior ?? [],
                colorNames: metadata.colorNames ?? [],
                colorImages: metadata.colorImages ?? [],
                feature: metadata.feature ?? [],
            }
        } catch {
            continue
        }
    }

    return null
}

/**
 * Filter scraped image URLs to only those belonging to the target model.
 * CardDekho URLs follow: stimg.cardekho.com/images/{folder}/{size}/{Brand}/{Model}/{id}/...
 * We check that the URL contains the model token (e.g. "BE-6", "Thar-ROXX") so images
 * from "Similar Cars" / "More from Brand" sections are excluded.
 */
function filterByModel(urls: string[], modelTokens: string[]): string[] {
    if (modelTokens.length === 0) return urls
    // Normalise tokens for case-insensitive comparison
    const lower = modelTokens.map(t => t.toLowerCase())
    return urls.filter(url => {
        const urlLower = url.toLowerCase()
        return lower.some(token => urlLower.includes(`/${token}/`))
    })
}

export const fetchCardekhoGallery = cache(async (
    sourceUrl: string,
    options?: GalleryLookupOptions,
): Promise<CardekhoGalleryData | null> => {
    try {
        const localGallery = await loadLocalGallery(sourceUrl, options)
        if (localGallery) return localGallery

        if (!sourceUrl?.startsWith('http')) return null

        const tokens = deriveSourceTokens(sourceUrl)
        const modelTokens = tokens?.modelTokens ?? []

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

        // Extract all URLs then filter to only the target model
        const exterior = filterByModel(extractUrls(html, 'carexteriorimages'), modelTokens)
        const interior = filterByModel(extractUrls(html, 'carinteriorimages'), modelTokens)
        const colorNames = extractColorNamesFromLdJson(colorsHtml || html)
        const colorImages = filterByModel(extractColorImages(colorsHtml), modelTokens)
        const feature = filterByModel(extractFeatureExterior(colorsHtml), modelTokens)

        return {
            sourceUrl: normalizeSourceUrl(sourceUrl),
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
