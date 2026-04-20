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

function loadLocalGallery(sourceUrl: string): CardekhoGalleryData | null {
    try {
        const parsed = new URL(sourceUrl)
        const [brandSlug, modelSlug] = parsed.pathname.split('/').filter(Boolean)
        if (!brandSlug || !modelSlug) return null

        const metadataPath = path.join(
            process.cwd(),
            'public',
            'data',
            'brand-model-images',
            '4w-galleries',
            brandSlug,
            modelSlug,
            'metadata.json'
        )

        if (!fs.existsSync(metadataPath)) return null

        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as Partial<CardekhoGalleryData> & {
            colorNames?: string[]
            colorImages?: string[]
            hero?: string | null
            exterior?: string[]
            interior?: string[]
            feature?: string[]
        }

        return {
            sourceUrl,
            hero: metadata.hero ?? null,
            exterior: metadata.exterior ?? [],
            interior: metadata.interior ?? [],
            colorNames: metadata.colorNames ?? [],
            colorImages: metadata.colorImages ?? [],
            feature: metadata.feature ?? [],
        }
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
