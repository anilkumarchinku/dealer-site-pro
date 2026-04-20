import 'server-only'

import { cache } from 'react'
import fs from 'fs'
import path from 'path'

import { brandNameToId, modelToSlug } from '@/lib/utils/brand-model-images'

interface BikeWaleColorImage {
    name: string
    image: string
}

interface BikeWaleColorGallery {
    hero: string | null
    colors: BikeWaleColorImage[]
}

const USER_AGENT = 'Mozilla/5.0'
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const

const MAKE_SLUG_OVERRIDES: Record<string, string[]> = {
    'ampere-greaves': ['ampere-bikes'],
    'ather-energy': ['ather-bikes'],
    'bajaj-auto': ['bajaj-bikes'],
    'bajaj-chetak-ev': ['bajaj-bikes'],
    'bmw-motorrad-india': ['bmwmotorrad-bikes', 'bmw-bikes'],
    'cfmoto-india': ['cfmoto-bikes'],
    'harley-davidson-india': ['harley-davidson-bikes'],
    'hero-electric': ['heroelectric-bikes'],
    'hero-motocorp': ['hero-bikes'],
    'honda': ['honda-bikes'],
    'honda-hmsi': ['honda-bikes'],
    'keeway-india': ['keeway-bikes'],
    'ola-electric': ['olaelectric-bikes', 'ola-bikes'],
    'okinawa-autotech': ['okinawa-bikes'],
    'qj-motor-india': ['qjmotor-bikes', 'qjmotor-bikes'],
    'royal-enfield': ['royalenfield-bikes'],
    'suzuki-motorcycle': ['suzuki-bikes'],
    'triumph-india': ['triumph-bikes'],
    'tvs-iqube': ['tvs-bikes'],
    'tvs-motor': ['tvs-bikes'],
    'vida-hero': ['vida-bikes'],
    'yamaha-india': ['yamaha-bikes'],
    'yezdi-motorcycles': ['yezdi-bikes'],
}

function normalizeValue(value: string): string {
    return value
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '')
}

function uniqueStrings(values: string[]): string[] {
    return Array.from(new Set(values.filter(Boolean)))
}

function makeSlugCandidates(brandId: string, brand: string): string[] {
    const compactBrand = brand.toLowerCase().replace(/[^a-z0-9]+/g, '')
    const hyphenBrand = brand
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    const normalizedBrandId = brandId.toLowerCase()
    const baseCandidates = uniqueStrings([
        ...(MAKE_SLUG_OVERRIDES[normalizedBrandId] ?? []),
        `${normalizedBrandId}-bikes`,
        `${normalizedBrandId.replace(/-india$/g, '')}-bikes`,
        `${normalizedBrandId.replace(/-motocorp$/g, '')}-bikes`,
        `${normalizedBrandId.replace(/-motorcycle$/g, '')}-bikes`,
        `${normalizedBrandId.replace(/-motorrad$/g, '')}-bikes`,
        `${normalizedBrandId.replace(/-electric$/g, '')}-bikes`,
        `${normalizedBrandId.replace(/-autotech$/g, '')}-bikes`,
        `${normalizedBrandId.replace(/-mobility$/g, '')}-bikes`,
        `${normalizedBrandId.replace(/-greaves$/g, '')}-bikes`,
        `${compactBrand}-bikes`,
        `${hyphenBrand}-bikes`,
    ])

    return baseCandidates.map(candidate => candidate.replace(/--+/g, '-'))
}

function buildModelKeyVariants(model: string): string[] {
    const base = modelToSlug(model)
    const collapsed = normalizeValue(model)

    return uniqueStrings([
        base,
        base.replace(/-+/g, '-'),
        base.replace(/-202\d$/g, ''),
        base.replace(/-20\d{2}$/g, ''),
        base.replace(/-xc$/g, '-x'),
        base.replace(/-x$/g, '-xc'),
        base.replace(/-fi/g, ''),
        base.replace(/-v(\d)/g, '-$1'),
        base.replace(/-(\d)\s*0/g, '-$10'),
        collapsed,
        collapsed.replace(/202\d/g, ''),
    ])
}

function scoreModelPath(model: string, pathSlug: string): number {
    const modelKeys = buildModelKeyVariants(model)
    const normalizedPath = pathSlug.replace(/-20\d{2}$/g, '')
    const compactPath = normalizeValue(normalizedPath)

    if (modelKeys.includes(normalizedPath) || modelKeys.includes(compactPath)) return 100
    if (modelKeys.some(key => normalizedPath.startsWith(key) || key.startsWith(normalizedPath))) return 80
    if (modelKeys.some(key => normalizedPath.includes(key) || key.includes(normalizedPath))) return 65
    if (modelKeys.some(key => compactPath.includes(key) || key.includes(compactPath))) return 55
    return 0
}

function extractModelPaths(html: string, makeSlug: string): string[] {
    const matches = html.match(new RegExp(`/${makeSlug}/[^"'<>\\s]+/`, 'g')) ?? []

    return Array.from(
        new Set(
            matches
                .filter(match => !match.endsWith('/images/') && !match.endsWith('/reviews/'))
                .filter(match => !match.includes('\\u0022'))
        )
    )
}

function extractJsonLdBlocks(html: string): string[] {
    const blocks = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) ?? []
    return blocks
        .map(block => block.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '').trim())
        .filter(Boolean)
}

function extractColorGalleryFromJsonLd(html: string): BikeWaleColorGallery | null {
    const blocks = extractJsonLdBlocks(html)

    for (const block of blocks) {
        try {
            const parsed = JSON.parse(block)
            const items = Array.isArray(parsed) ? parsed : [parsed]

            for (const item of items) {
                if (item?.['@type'] !== 'ImageGallery') continue
                const media = Array.isArray(item.associatedMedia) ? item.associatedMedia : []
                const hero = typeof item.primaryImageOfPage?.contentUrl === 'string'
                    ? item.primaryImageOfPage.contentUrl
                    : null
                const colors: BikeWaleColorImage[] = media
                    .map((entry: { caption?: string; contentUrl?: string }) => ({
                        name: entry.caption?.trim() ?? '',
                        image: entry.contentUrl?.trim() ?? '',
                    }))
                    .filter((entry: BikeWaleColorImage) => entry.name && entry.image)

                if (colors.length > 0) {
                    return { hero, colors }
                }
            }
        } catch {
            // Ignore malformed blocks.
        }
    }

    return null
}

function localColorImageUrl(brandId: string, model: string, colorName: string): string | null {
    const modelSlug = modelToSlug(model)
    const colorSlug = modelToSlug(colorName)
    const baseDir = path.join(
        process.cwd(),
        'public',
        'data',
        'brand-model-images',
        '2w-colors',
        brandId,
        modelSlug
    )

    for (const extension of IMAGE_EXTENSIONS) {
        const filePath = path.join(baseDir, `${colorSlug}.${extension}`)
        if (fs.existsSync(filePath)) {
            return `/data/brand-model-images/2w-colors/${brandId}/${modelSlug}/${colorSlug}.${extension}`
        }
    }

    return null
}

const fetchHtml = cache(async (url: string): Promise<string | null> => {
    try {
        const response = await fetch(url, {
            headers: {
                'user-agent': USER_AGENT,
                'accept-language': 'en-IN,en;q=0.9',
            },
            next: { revalidate: 60 * 60 * 24 },
        })

        if (!response.ok) return null
        return await response.text()
    } catch {
        return null
    }
})

const resolveBikeWaleModelPath = cache(async (brandId: string, brand: string, model: string): Promise<string | null> => {
    const makeSlugs = makeSlugCandidates(brandId, brand)

    for (const makeSlug of makeSlugs) {
        const makeUrl = `https://www.bikewale.com/${makeSlug}/`
        const html = await fetchHtml(makeUrl)
        if (!html) continue

        const modelPaths = extractModelPaths(html, makeSlug)
        if (modelPaths.length === 0) continue

        const bestMatch = modelPaths
            .map(modelPath => {
                const pathSlug = modelPath.replace(`/${makeSlug}/`, '').replace(/\/$/, '')
                return {
                    modelPath,
                    score: scoreModelPath(model, pathSlug),
                }
            })
            .sort((left, right) => right.score - left.score)[0]

        if (bestMatch && bestMatch.score >= 65) {
            return `https://www.bikewale.com${bestMatch.modelPath}`
        }
    }

    return null
})

export const fetchTwoWheelerColorGallery = cache(async (
    brand: string,
    model: string
): Promise<BikeWaleColorGallery | null> => {
    const brandId = brandNameToId(brand, '2w')
    const modelUrl = await resolveBikeWaleModelPath(brandId, brand, model)
    if (!modelUrl) return null

    const colorsHtml = await fetchHtml(`${modelUrl.replace(/\/$/, '')}/colours/`)
    if (!colorsHtml) return null

    const gallery = extractColorGalleryFromJsonLd(colorsHtml)
    if (!gallery) return null

    return {
        hero: gallery.hero,
        colors: gallery.colors.map(color => ({
            ...color,
            image: localColorImageUrl(brandId, model, color.name) ?? color.image,
        })),
    }
})
