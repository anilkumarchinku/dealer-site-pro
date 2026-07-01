#!/usr/bin/env node

import puppeteer from 'puppeteer'
import { createClient } from '@supabase/supabase-js'

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3010'
const viewportWidth = Number(process.env.AUDIT_VIEWPORT_WIDTH || 390)
const viewportHeight = Number(process.env.AUDIT_VIEWPORT_HEIGHT || 844)
const domTimeoutMs = Number(process.env.AUDIT_DOM_TIMEOUT_MS || 15000)
const shouldDiscoverRoutes = process.env.AUDIT_DISCOVER_ROUTES !== 'false'
const maxDiscoveredRoutes = Number(process.env.AUDIT_MAX_DISCOVERED_ROUTES || 200)
const maxDiscoveredDealers = Number(process.env.AUDIT_MAX_DISCOVERED_DEALERS || 200)
const batchStart = Math.max(0, Number(process.env.AUDIT_BATCH_START || 0))
const batchSize = Math.max(0, Number(process.env.AUDIT_BATCH_SIZE || 0))
const shouldAuditInteractions = process.env.AUDIT_INTERACTIONS !== 'false'

function parseViewportWidths() {
    const raw = process.env.AUDIT_VIEWPORT_WIDTHS
    const values = raw
        ? raw.split(',').map((value) => Number(value.trim()))
        : [viewportWidth]
    const widths = values.filter((value) => Number.isFinite(value) && value > 0)
    return [...new Set(widths.length > 0 ? widths : [viewportWidth])]
}

const viewportWidths = parseViewportWidths()

const defaultRoutes = [
    '/',
    '/cars',
    '/bikes',
    '/autos',
    '/brands/Ducati?type=2w',
    '/brands/Montra%20Electric?type=3w',
    '/bikes/ducati-india-panigale-v4-r-19',
    '/autos/montra-ev-eviator-e-350x-3',
    '/sites/kumar-bhaii-hyderabad',
    '/sites/kumar-bhaii-hyderabad/cars',
    '/sites/kumar-bhaii-hyderabad/67615eb0-3da3-4a7d-95f5-a2528b2526ba',
    '/sites/kumar-bhaii-hyderabad/about',
    '/sites/kumar-bhaii-hyderabad/contact',
    '/sites/kumar-bhaii-hyderabad/service',
    '/sites/kumar-bhaii-hyderabad/sell',
    '/sites/singh-auto-dealers/two-wheelers',
    '/sites/singh-auto-dealers/two-wheelers/new',
    '/sites/singh-auto-dealers/two-wheelers/cat-2w-0-catalog-2w-hero-motocorp-0',
    '/sites/singh-auto-dealers/two-wheelers/bikes',
    '/sites/singh-auto-dealers/two-wheelers/scooters',
    '/sites/singh-auto-dealers/two-wheelers/electric',
    '/sites/singh-auto-dealers/two-wheelers/used',
    '/sites/singh-auto-dealers/two-wheelers/used/903b9d27-fa4d-4d89-9797-c143d8a43186',
    '/sites/singh-auto-dealers/two-wheelers/compare',
    '/sites/singh-auto-dealers/two-wheelers/offers',
    '/sites/singh-auto-dealers/two-wheelers/emi-calculator',
    '/sites/singh-auto-dealers/two-wheelers/about',
    '/sites/singh-auto-dealers/two-wheelers/contact',
    '/sites/singh-auto-dealers/two-wheelers/service',
    '/sites/singh-auto-dealers/three-wheelers',
    '/sites/singh-auto-dealers/three-wheelers/new',
    '/sites/singh-auto-dealers/three-wheelers/cat-3w-0-catalog-3w-bajaj-auto-3w-0',
    '/sites/singh-auto-dealers/three-wheelers/passenger',
    '/sites/singh-auto-dealers/three-wheelers/cargo',
    '/sites/singh-auto-dealers/three-wheelers/electric',
    '/sites/singh-auto-dealers/three-wheelers/used',
    '/sites/singh-auto-dealers/three-wheelers/compare',
    '/sites/singh-auto-dealers/three-wheelers/offers',
    '/sites/singh-auto-dealers/three-wheelers/emi-calculator',
    '/sites/singh-auto-dealers/three-wheelers/fleet-roi',
    '/sites/singh-auto-dealers/three-wheelers/about',
    '/sites/singh-auto-dealers/three-wheelers/contact',
    '/sites/singh-auto-dealers/three-wheelers/service',
    '/autos/altigreen-neev-bhai-flatbed-4',
    '/marketplace?type=all&condition=new#listing',
    '/marketplace?type=2w&condition=used&search=karizma#listing',
    '/marketplace?type=3w#listing',
    '/marketplace?type=4w#listing',
]

const explicitRoutes = process.argv.slice(2)

const badImageMarkers = [
    'placeholder-car',
    'ride-finder-assets',
    'images.unsplash.com/photo-1558981806',
    'images.unsplash.com/photo-1609630875171',
    'images.unsplash.com/photo-1519003722824',
    'bikedekho-logo',
    'cardekho-logo',
    'image-not-available',
    'not-available',
    'coming-soon',
    'image%20unavailable',
    'data:image/svg+xml',
    'stimg.cardekho.com/images/carexteriorimages',
]

const acceptedVehicleImageMarkers = [
    '/assets/cars/',
    '/data/brand-model-images/',
    '/images/3w/',
    'cdn.bikedekho.com/processedimages/',
    'imgd.aeplcdn.com/',
    '/storage/v1/object/public/vehicle-images/',
    '/storage/v1/object/public/brand-model-images/',
    '/storage/v1/object/public/dealer-assets/',
]

const acceptedModelCardImageMarkers = [
    '/assets/cars/',
    '/data/brand-model-images/',
    '/images/3w/',
    'cdn.bikedekho.com/processedimages/',
    'imgd.aeplcdn.com/',
    '/storage/v1/object/public/vehicle-images/',
    '/storage/v1/object/public/brand-model-images/',
]

const modelCardSelectors = [
    '.vrf-vehicle-card',
    '.dsp-vehicle-card-grid article',
    '[data-vehicle-card]',
    'article',
    'a[href*="/cars/"]',
    'a[href*="/bikes/"]',
    'a[href*="/autos/"]',
    'a[href*="/two-wheelers/"]',
    'a[href*="/three-wheelers/"]',
]

const mobileMenuSelectors = [
    'button[aria-label*="menu" i]',
    'button[aria-label*="navigation" i]',
]

const filterProbeSelectors = [
    '[data-mobile-filter-control="true"]',
    '[aria-label="Vehicle category filter"] button',
    '[aria-label="Vehicle condition"] button',
    '.vrf-category-option',
    '.vrf-filter-options button',
    '.vrf-chip',
    '.vrf-check-row',
    '.dsp-filter-rail button[aria-pressed]',
    'button[aria-label*="filter" i]',
]

function routeUrl(route) {
    if (/^https?:\/\//i.test(route)) return route
    return `${baseUrl}${route.startsWith('/') ? route : `/${route}`}`
}

function getOptionalEnv(name) {
    const value = process.env[name]
    return typeof value === 'string' && value.trim() ? value.trim() : null
}

function hasPlaceholderEnvValue(value) {
    return !value || /placeholder|your-|example|dummy/i.test(value)
}

function dedupeRoutes(routes) {
    return [...new Set(routes.filter(Boolean).map((route) => {
        if (/^https?:\/\//i.test(route)) {
            try {
                const url = new URL(route)
                return `${url.pathname}${url.search}${url.hash}`
            } catch {
                return route
            }
        }
        return route.startsWith('/') ? route : `/${route}`
    }))]
}

function dealerSupports2w(dealer) {
    return dealer?.sells_two_wheelers || dealer?.vehicle_type === '2w'
}

function dealerSupports3w(dealer) {
    return dealer?.sells_three_wheelers || dealer?.vehicle_type === '3w'
}

function dealerSupports4w(dealer) {
    return dealer?.sells_new_cars || dealer?.sells_used_cars || dealer?.vehicle_type === '4w' || !dealer?.vehicle_type
}

function dealerSupportRoutes(slug, prefix = '') {
    return [
        `/sites/${slug}${prefix}`,
        `/sites/${slug}${prefix}/about`,
        `/sites/${slug}${prefix}/contact`,
        `/sites/${slug}${prefix}/service`,
        `/sites/${slug}${prefix}/privacy`,
        `/sites/${slug}${prefix}/terms`,
    ]
}

function dealerGeneratedRoutes(dealer) {
    const slug = dealer?.slug?.trim()
    if (!slug) return []

    const routes = []
    if (dealerSupports4w(dealer)) {
        routes.push(...dealerSupportRoutes(slug), `/sites/${slug}/cars`, `/sites/${slug}/sell`)
    }
    if (dealerSupports2w(dealer)) {
        routes.push(
            ...dealerSupportRoutes(slug, '/two-wheelers'),
            `/sites/${slug}/two-wheelers/new`,
            `/sites/${slug}/two-wheelers/bikes`,
            `/sites/${slug}/two-wheelers/scooters`,
            `/sites/${slug}/two-wheelers/electric`,
            `/sites/${slug}/two-wheelers/used`,
            `/sites/${slug}/two-wheelers/compare`,
            `/sites/${slug}/two-wheelers/offers`,
            `/sites/${slug}/two-wheelers/emi-calculator`,
        )
    }
    if (dealerSupports3w(dealer)) {
        routes.push(
            ...dealerSupportRoutes(slug, '/three-wheelers'),
            `/sites/${slug}/three-wheelers/new`,
            `/sites/${slug}/three-wheelers/passenger`,
            `/sites/${slug}/three-wheelers/cargo`,
            `/sites/${slug}/three-wheelers/electric`,
            `/sites/${slug}/three-wheelers/used`,
            `/sites/${slug}/three-wheelers/compare`,
            `/sites/${slug}/three-wheelers/offers`,
            `/sites/${slug}/three-wheelers/emi-calculator`,
            `/sites/${slug}/three-wheelers/fleet-roi`,
        )
    }

    return routes
}

async function discoverDealerRoutes() {
    const url = getOptionalEnv('NEXT_PUBLIC_SUPABASE_URL')
    const key = getOptionalEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? getOptionalEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    if (hasPlaceholderEnvValue(url) || hasPlaceholderEnvValue(key)) return []

    try {
        const supabase = createClient(url, key, {
            auth: { autoRefreshToken: false, persistSession: false },
        })
        const { data, error } = await supabase
            .from('dealers')
            .select('slug, vehicle_type, sells_new_cars, sells_used_cars, sells_two_wheelers, sells_three_wheelers, onboarding_complete')
            .eq('onboarding_complete', true)
            .order('created_at', { ascending: false })
            .limit(maxDiscoveredDealers)

        if (error || !data) return []
        return data.flatMap(dealerGeneratedRoutes)
    } catch {
        return []
    }
}

async function discoverMarketplaceDetailRoutes() {
    const routes = []
    const queries = [
        '/api/marketplace?type=all&condition=used&pageSize=24',
        '/api/marketplace?type=2w&condition=used&pageSize=24',
        '/api/marketplace?type=3w&condition=used&pageSize=24',
        '/api/marketplace?type=4w&condition=used&pageSize=24',
        '/api/marketplace?type=all&condition=all&pageSize=24',
    ]

    for (const query of queries) {
        try {
            const response = await fetch(routeUrl(query))
            if (!response.ok) continue
            const json = await response.json()
            const vehicles = Array.isArray(json?.data?.vehicles) ? json.data.vehicles : []
            for (const vehicle of vehicles) {
                if (typeof vehicle?.detail_href === 'string' && vehicle.detail_href.startsWith('/')) {
                    routes.push(vehicle.detail_href)
                }
            }
        } catch {
            // Discovery is best-effort; the explicit route list still runs.
        }
    }

    return routes
}

function isGeneratedListingRoute(route) {
    return /\/sites\/[^/?#]+\/cars(?:[?#].*)?$/.test(route) ||
        /\/sites\/[^/?#]+\/two-wheelers\/(?:new|used|bikes|scooters|electric)(?:[?#].*)?$/.test(route) ||
        /\/sites\/[^/?#]+\/three-wheelers\/(?:new|used|passenger|cargo|electric)(?:[?#].*)?$/.test(route)
}

async function discoverGeneratedDetailRoutes(seedRoutes) {
    const routes = []
    const listingRoutes = seedRoutes.filter(isGeneratedListingRoute)

    for (const route of listingRoutes) {
        try {
            const response = await fetch(routeUrl(route))
            if (!response.ok) continue
            const html = await response.text()
            const matches = html.matchAll(/href=["']([^"']*\/sites\/[^"']+)["']/g)
            for (const match of matches) {
                const href = match[1]
                const url = new URL(href, baseUrl)
                const candidate = `${url.pathname}${url.search}${url.hash}`
                if (
                    /\/sites\/[^/?#]+\/[^/?#]+$/.test(candidate) ||
                    /\/sites\/[^/?#]+\/two-wheelers\/(?:used\/)?[^/?#]+$/.test(candidate) ||
                    /\/sites\/[^/?#]+\/three-wheelers\/(?:used\/)?[^/?#]+$/.test(candidate)
                ) {
                    routes.push(candidate)
                }
            }
        } catch {
            // Listing-page crawling is best-effort; static/default routes still run.
        }
    }

    return routes
}

async function getRoutesToAudit() {
    if (explicitRoutes.length > 0) return explicitRoutes
    if (!shouldDiscoverRoutes) return defaultRoutes

    const dealerRoutes = await discoverDealerRoutes()
    const discovered = [
        ...dealerRoutes,
        ...(await discoverGeneratedDetailRoutes([...defaultRoutes, ...dealerRoutes])),
        ...(await discoverMarketplaceDetailRoutes()),
    ]

    return dedupeRoutes([...defaultRoutes, ...discovered]).slice(0, maxDiscoveredRoutes)
}

function routeBatch(routes) {
    if (explicitRoutes.length > 0 || batchSize <= 0) {
        return { routes, start: 0, end: routes.length, total: routes.length }
    }

    return {
        routes: routes.slice(batchStart, batchStart + batchSize),
        start: batchStart,
        end: Math.min(routes.length, batchStart + batchSize),
        total: routes.length,
    }
}

function isFailure(result) {
    return Boolean(
        result.error ||
        (result.interactions ?? []).some((interaction) => interaction.failed) ||
        result.isErrorDocument ||
        result.overflowX ||
        !result.hasContent ||
        (result.badImages?.length ?? 0) > 0 ||
        (result.brokenImages?.length ?? 0) > 0 ||
        (result.modelCardImageFailures?.length ?? 0) > 0 ||
        (result.overflowingElements?.length ?? 0) > 0
    )
}

function marketplaceVehicleRows(payload) {
    return Array.isArray(payload?.data?.vehicles) ? payload.data.vehicles : []
}

function marketplaceTotal(payload, rows) {
    return Number(payload?.data?.total) || rows.length
}

function isUsedMarketplaceCondition(condition) {
    return condition === 'used' || condition === 'certified_pre_owned'
}

async function fetchMarketplaceAuditPayload(query) {
    const response = await fetch(routeUrl(query))
    if (!response.ok) {
        return {
            query,
            ok: false,
            status: response.status,
            rows: [],
            total: 0,
            failures: [`${query} returned HTTP ${response.status}`],
        }
    }

    const payload = await response.json()
    const rows = marketplaceVehicleRows(payload)
    return {
        query,
        ok: true,
        status: response.status,
        rows,
        total: marketplaceTotal(payload, rows),
        failures: [],
    }
}

async function auditMarketplaceApiFilters() {
    const checks = [
        { name: 'all', query: '/api/marketplace?type=all&condition=all&pageSize=48' },
        { name: 'used-all', query: '/api/marketplace?type=all&condition=used&pageSize=48' },
        { name: 'used-2w', query: '/api/marketplace?type=2w&condition=used&pageSize=48', category: '2w' },
        { name: 'used-3w', query: '/api/marketplace?type=3w&condition=used&pageSize=48', category: '3w' },
        { name: 'used-4w', query: '/api/marketplace?type=4w&condition=used&pageSize=48', category: '4w' },
    ]

    const results = await Promise.all(checks.map((check) =>
        fetchMarketplaceAuditPayload(check.query).then((payload) => ({ ...check, ...payload }))
    ))

    const all = results.find((result) => result.name === 'all')
    const used = results.find((result) => result.name === 'used-all')

    for (const result of results) {
        if (result.name.startsWith('used')) {
            const wrongConditions = result.rows
                .filter((row) => !isUsedMarketplaceCondition(row?.condition))
                .map((row) => ({ id: row?.id, condition: row?.condition, make: row?.make, model: row?.model }))
                .slice(0, 8)
            if (wrongConditions.length > 0) {
                result.failures.push(`${result.name} returned non-used rows: ${JSON.stringify(wrongConditions)}`)
            }
        }

        if (result.category) {
            const wrongCategories = result.rows
                .filter((row) => row?.vehicle_category !== result.category)
                .map((row) => ({ id: row?.id, category: row?.vehicle_category, make: row?.make, model: row?.model }))
                .slice(0, 8)
            if (wrongCategories.length > 0) {
                result.failures.push(`${result.name} returned wrong category rows: ${JSON.stringify(wrongCategories)}`)
            }
        }
    }

    if (all && used && used.total > 0) {
        const allHasUsed = all.rows.some((row) => isUsedMarketplaceCondition(row?.condition))
        if (!allHasUsed) {
            all.failures.push('condition=all did not include any used/CPO rows in the first page while condition=used has used rows')
        }
    }

    const failures = results.flatMap((result) => result.failures.map((failure) => ({
        name: result.name,
        query: result.query,
        failure,
    })))

    return {
        results: results.map((result) => ({
            name: result.name,
            query: result.query,
            status: result.status,
            total: result.total,
            rows: result.rows.length,
            conditions: [...new Set(result.rows.map((row) => row?.condition).filter(Boolean))],
            categories: [...new Set(result.rows.map((row) => row?.vehicle_category).filter(Boolean))],
            failures: result.failures,
        })),
        failures,
    }
}

async function auditInteractions(context) {
    if (!shouldAuditInteractions) return []

    const collectInteractionState = async () => await context.evaluate(({ badMarkers: markers, acceptedMarkers, cardAcceptedMarkers, cardSelectors }) => {
        const body = document.body
        const images = [...document.images].filter((image) => {
            const rect = image.getBoundingClientRect()
            return rect.width > 24 && rect.height > 24
        })
        const sources = images.map((image) => image.currentSrc || image.src).filter(Boolean)
        const badImages = sources.filter((source) => markers.some((marker) => source.toLowerCase().includes(marker)))
        const brokenImages = images
            .filter((image) => image.complete && (image.naturalWidth === 0 || image.naturalHeight === 0))
            .map((image) => image.currentSrc || image.src)
            .filter(Boolean)
        const text = body?.innerText?.replace(/\s+/g, ' ').trim() ?? ''
        const hasHorizontalOverflowBoundary = (element) => {
            let current = element.parentElement
            while (current && current !== document.body) {
                const style = window.getComputedStyle(current)
                const overflowX = style.overflowX
                if ((overflowX === 'auto' || overflowX === 'scroll') && current.scrollWidth > current.clientWidth + 1) return true
                if ((overflowX === 'hidden' || overflowX === 'clip') && current.clientWidth <= window.innerWidth + 1) return true
                current = current.parentElement
            }
            return false
        }
        const overflowingElements = body ? [...body.querySelectorAll('*')]
            .filter((element) => {
                const rect = element.getBoundingClientRect()
                const style = window.getComputedStyle(element)
                if (style.display === 'none' || style.visibility === 'hidden') return false
                if (rect.width <= 0 || rect.height <= 0) return false
                if (hasHorizontalOverflowBoundary(element)) return false
                return rect.left < -1 || rect.right > window.innerWidth + 1
            })
            .slice(0, 8)
            .map((element) => {
                const rect = element.getBoundingClientRect()
                return {
                    tag: element.tagName.toLowerCase(),
                    className: typeof element.className === 'string' ? element.className.slice(0, 160) : '',
                    text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) ?? '',
                    left: Math.round(rect.left),
                    right: Math.round(rect.right),
                    width: Math.round(rect.width),
                }
            })
            : []
        const modelCards = body ? [...new Set(cardSelectors.flatMap((selector) => {
            try {
                return [...document.querySelectorAll(selector)]
            } catch {
                return []
            }
        }))]
            .map((card) => {
                const cardText = card.textContent?.replace(/\s+/g, ' ').trim() ?? ''
                const image = card.querySelector('.vrf-card-media img, [class*="media"] img, [class*="image"] img, img[alt]:not([alt*="logo" i])')
                const src = image ? image.currentSrc || image.src : ''
                const lowerSrc = src.toLowerCase()
                const decodedSrc = (() => {
                    try {
                        return decodeURIComponent(lowerSrc)
                    } catch {
                        return lowerSrc
                    }
                })()
                const declaredImageSource = card.getAttribute('data-model-image-source') ?? ''
                const acceptedInventoryPhoto = declaredImageSource === 'inventory-photo' &&
                    (
                        decodedSrc.includes('/storage/v1/object/public/dealer-assets/vehicles/') ||
                        decodedSrc.includes('/storage/v1/object/public/dealer-assets/sell-requests/')
                    )
                const acceptedSource = cardAcceptedMarkers.some((marker) => lowerSrc.includes(marker) || decodedSrc.includes(marker)) || acceptedInventoryPhoto
                const badSource = markers.some((marker) => lowerSrc.includes(marker) || decodedSrc.includes(marker))
                const isVehicleCard =
                    card.matches('.vrf-vehicle-card, [data-vehicle-card]') ||
                    /\b(emi|price|ex-showroom|dealer listing|enquire|view details|test drive|on-road|used|new)\b/i.test(cardText) &&
                    /\b(car|bike|auto|vehicle|fuel|trans|seats|mileage|range|stock|dealer)\b/i.test(cardText)
                return {
                    text: cardText.slice(0, 120),
                    imageSrc: src,
                    declaredImageSource,
                    acceptedSource,
                    badSource,
                    missingImage: !src,
                    placeholderText: /\b(no image available|image unavailable)\b/i.test(cardText),
                    isVehicleCard,
                }
            })
            .filter((card) => card.isVehicleCard)
            : []
        const modelCardImageFailures = modelCards.filter((card) =>
            card.missingImage ||
            card.placeholderText ||
            card.badSource ||
            !card.acceptedSource
        )
        return {
            hasContent: text.length > 50,
            overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
            badImages: [...new Set(badImages)],
            brokenImages: [...new Set(brokenImages)],
            overflowingElements,
            modelCardImageFailures,
        }
    }, { badMarkers: badImageMarkers, acceptedMarkers: acceptedVehicleImageMarkers, cardAcceptedMarkers: acceptedModelCardImageMarkers, cardSelectors: modelCardSelectors })

    const stateFailed = (state) => !state.hasContent ||
        state.overflowX ||
        state.badImages.length > 0 ||
        state.brokenImages.length > 0 ||
        state.overflowingElements.length > 0 ||
        state.modelCardImageFailures.length > 0

    const filterResult = await context.evaluate(async ({ selectors }) => {
        const isVisible = (element) => {
            const rect = element.getBoundingClientRect()
            const style = window.getComputedStyle(element)
            return rect.width > 0 &&
                rect.height > 0 &&
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                rect.bottom > 0 &&
                rect.top < window.innerHeight &&
                rect.right > 0 &&
                rect.left < window.innerWidth
        }
        const isRendered = (element) => {
            const rect = element.getBoundingClientRect()
            const style = window.getComputedStyle(element)
            return rect.width > 0 &&
                rect.height > 0 &&
                style.display !== 'none' &&
                style.visibility !== 'hidden'
        }
        const countCards = () => document.querySelectorAll('.vrf-vehicle-card, [data-vehicle-card], .dsp-vehicle-card-grid article').length
        const buttonCandidates = selectors.flatMap((selector) => [...document.querySelectorAll(selector)])
            .filter((element, index, all) => all.indexOf(element) === index)
            .filter((button) => !/clear|reset|close/i.test(button.textContent ?? button.getAttribute('aria-label') ?? ''))
            .filter((button) => !/(^|\s)×\s*$/.test(button.textContent ?? ''))
            .filter(isRendered)
        const selectCandidates = [...document.querySelectorAll('select')]
            .filter((element, index, all) => all.indexOf(element) === index)
            .filter((select) => [...select.options].some((option) => option.value && option.value !== select.value))
            .filter(isRendered)
        if (!buttonCandidates.some(isVisible) && !selectCandidates.some(isVisible)) {
            const target = buttonCandidates[0] ?? selectCandidates[0] ?? null
            if (target) {
                target.scrollIntoView({ block: 'center', inline: 'nearest' })
                await new Promise((resolve) => setTimeout(resolve, 350))
            }
        }
        const buttons = buttonCandidates
        const button = buttons.find((item) => item.getAttribute('aria-pressed') !== 'true') ?? buttons[0]
        const selects = selectCandidates
        const beforeCardCount = countCards()
        if (!button && selects.length === 0) return { name: 'filter-control', skipped: true, reason: 'No visible filter control' }

        if (!button && selects.length > 0) {
            const select = selects[0]
            const beforeValue = select.value
            const option = [...select.options].find((item) => item.value && item.value !== beforeValue)
            const label = (select.getAttribute('aria-label') || select.closest('label')?.textContent || 'select filter').replace(/\s+/g, ' ').trim().slice(0, 80)
            if (option) {
                select.value = option.value
                select.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
                select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
            }
            await new Promise((resolve) => setTimeout(resolve, 650))
            const afterCardCount = countCards()
            return {
                name: 'filter-control',
                skipped: false,
                controlType: 'select',
                label,
                beforeValue,
                afterValue: select.value,
                beforeCardCount,
                afterCardCount,
                changed: beforeValue !== select.value || beforeCardCount !== afterCardCount,
            }
        }

        const beforePressed = button.getAttribute('aria-pressed')
        const label = (button.textContent || button.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80)
        button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
        await new Promise((resolve) => setTimeout(resolve, 650))
        const afterCardCount = countCards()
        return {
            name: 'filter-control',
            skipped: false,
            controlType: 'button',
            label,
            beforePressed,
            afterPressed: button.getAttribute('aria-pressed'),
            beforeCardCount,
            afterCardCount,
            changed: beforePressed !== button.getAttribute('aria-pressed') ||
                button.getAttribute('aria-pressed') === 'true' ||
                beforeCardCount !== afterCardCount,
        }
    }, { selectors: filterProbeSelectors })

    const interactions = []
    if (!filterResult.skipped) {
        const afterFilterState = await collectInteractionState()
        interactions.push({
            ...filterResult,
            afterState: afterFilterState,
            failed: !filterResult.changed || stateFailed(afterFilterState),
        })
    } else {
        interactions.push(filterResult)
    }

    const menuResult = await context.evaluate(async ({ selectors }) => {
        const isVisible = (element) => {
            const rect = element.getBoundingClientRect()
            const style = window.getComputedStyle(element)
            return rect.width > 0 &&
                rect.height > 0 &&
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                rect.bottom > 0 &&
                rect.top < window.innerHeight &&
                rect.right > 0 &&
                rect.left < window.innerWidth
        }

        const buttons = selectors.flatMap((selector) => [...document.querySelectorAll(selector)])
            .filter((element, index, all) => all.indexOf(element) === index)
            .filter(isVisible)
        const button = buttons.find((item) => /menu|navigation/i.test(item.getAttribute('aria-label') ?? item.textContent ?? ''))

        if (!button) {
            return {
                name: 'mobile-menu',
                skipped: true,
                reason: 'No visible mobile menu button',
            }
        }

        const beforeExpanded = button.getAttribute('aria-expanded')
        button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
        await new Promise((resolve) => setTimeout(resolve, 500))

        const afterExpanded = button.getAttribute('aria-expanded')
        const text = document.body?.innerText?.replace(/\s+/g, ' ').trim() ?? ''
        return {
            name: 'mobile-menu',
            skipped: false,
            beforeExpanded,
            afterExpanded,
            changed: beforeExpanded !== afterExpanded || afterExpanded === 'true',
            hasMenuContent: /home|inventory|contact|service|finance|privacy|terms|new|used/i.test(text),
        }
    }, { selectors: mobileMenuSelectors })

    if (menuResult.skipped) return [...interactions, menuResult]

    await new Promise((resolve) => setTimeout(resolve, 700))
    const afterState = await collectInteractionState()

    interactions.push({
        ...menuResult,
        afterState,
        failed: !menuResult.hasMenuContent || stateFailed(afterState),
    })

    return interactions
}

async function auditRoute(page, route) {
    const response = await page.goto(routeUrl(route), { waitUntil: 'domcontentloaded', timeout: 30000 })
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const frame = page.frames().find((item) => item.url().includes('/design-system-handoff/ui_kits/marketing/index.html')) ?? null
    const context = frame || page

    if (frame) {
        await context.waitForFunction(() => {
            const root = document.getElementById('root')
            const textLength = document.body?.innerText?.replace(/\s+/g, ' ').trim().length ?? 0
            return Boolean(root?.children.length) && textLength > 50
        }, { timeout: domTimeoutMs }).catch(() => undefined)
    }

    for (let attempt = 0; attempt < 20; attempt += 1) {
        const textLength = await context.evaluate(() => document.body?.innerText?.replace(/\s+/g, ' ').trim().length ?? 0)
        if (textLength > 50) break
        await new Promise((resolve) => setTimeout(resolve, 500))
    }

    await context.evaluate(() => {
        const target = document.querySelector(
            '#listing, #inventory, [data-section="listing"], [data-section="inventory"], a[href*="/cars/"], a[href*="/bikes/"], a[href*="/autos/"], a[href*="/two-wheelers/"], a[href*="/three-wheelers/"]'
        )
        if (target) {
            target.scrollIntoView({ block: 'center' })
            return
        }
        window.scrollTo(0, Math.round(document.documentElement.scrollHeight * 0.45))
    })
    await new Promise((resolve) => setTimeout(resolve, 3500))

    const result = await context.evaluate(({ badMarkers: markers, acceptedMarkers, cardAcceptedMarkers, cardSelectors }) => {
        const images = [...document.images].filter((image) => {
            const rect = image.getBoundingClientRect()
            return rect.width > 24 && rect.height > 24
        })
        const sources = images.map((image) => image.currentSrc || image.src).filter(Boolean)
        const badImages = sources.filter((source) =>
            markers.some((marker) => source.toLowerCase().includes(marker))
        )
        const brokenImages = images
            .filter((image) => image.complete && (image.naturalWidth === 0 || image.naturalHeight === 0))
            .map((image) => image.currentSrc || image.src)
            .filter(Boolean)
        const text = document.body?.innerText?.replace(/\s+/g, ' ').trim() ?? ''
        const hasHorizontalOverflowBoundary = (element) => {
            let current = element.parentElement
            while (current && current !== document.body) {
                const style = window.getComputedStyle(current)
                const overflowX = style.overflowX
                if ((overflowX === 'auto' || overflowX === 'scroll') && current.scrollWidth > current.clientWidth + 1) {
                    return true
                }
                if ((overflowX === 'hidden' || overflowX === 'clip') && current.clientWidth <= window.innerWidth + 1) {
                    return true
                }
                current = current.parentElement
            }
            return false
        }
        const overflowingElements = document.body ? [...document.body.querySelectorAll('*')]
            .filter((element) => {
                const rect = element.getBoundingClientRect()
                const style = window.getComputedStyle(element)
                if (style.display === 'none' || style.visibility === 'hidden') return false
                if (rect.width <= 0 || rect.height <= 0) return false
                if (hasHorizontalOverflowBoundary(element)) return false
                return rect.left < -1 || rect.right > window.innerWidth + 1
            })
            .slice(0, 12)
            .map((element) => {
                const rect = element.getBoundingClientRect()
                return {
                    tag: element.tagName.toLowerCase(),
                    className: typeof element.className === 'string' ? element.className.slice(0, 160) : '',
                    text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) ?? '',
                    left: Math.round(rect.left),
                    right: Math.round(rect.right),
                    width: Math.round(rect.width),
                }
            })
            : []
        const vehicleImages = images
            .map((image) => {
                const src = image.currentSrc || image.src
                const alt = image.getAttribute('alt') || ''
                const lowerSrc = src.toLowerCase()
                const decodedSrc = (() => {
                    try {
                        return decodeURIComponent(lowerSrc)
                    } catch {
                        return lowerSrc
                    }
                })()
                const acceptedSource = cardAcceptedMarkers.some((marker) => lowerSrc.includes(marker) || decodedSrc.includes(marker))
                const badSource = markers.some((marker) => lowerSrc.includes(marker) || decodedSrc.includes(marker))
                const rect = image.getBoundingClientRect()
                return {
                    alt,
                    src,
                    naturalWidth: image.naturalWidth,
                    naturalHeight: image.naturalHeight,
                    renderedWidth: Math.round(rect.width),
                    renderedHeight: Math.round(rect.height),
                    acceptedSource,
                    badSource,
                }
            })
            .filter((image) =>
                image.acceptedSource ||
                image.badSource ||
                /\b(car|bike|auto|vehicle|ducati|montra|audi|honda|hyundai|maruti|hero|euler)\b/i.test(image.alt)
            )
            .slice(0, 24)

        const modelCards = [...new Set(cardSelectors.flatMap((selector) => {
            try {
                return [...document.querySelectorAll(selector)]
            } catch {
                return []
            }
        }))]
            .map((card) => {
                const text = card.textContent?.replace(/\s+/g, ' ').trim() ?? ''
                const image = card.querySelector(
                    '.vrf-card-media img, [class*="media"] img, [class*="image"] img, img[alt]:not([alt*="logo" i])'
                )
                const hasVehicleCardContract =
                    card.matches('.vrf-vehicle-card, [data-vehicle-card], article') ||
                    Boolean(card.querySelector('.vrf-card-media, [class*="media"], [class*="image"]'))
                const src = image ? image.currentSrc || image.src : ''
                const lowerSrc = src.toLowerCase()
                const decodedSrc = (() => {
                    try {
                        return decodeURIComponent(lowerSrc)
                    } catch {
                        return lowerSrc
                    }
                })()
                const declaredImageSource = card.getAttribute('data-model-image-source') ?? ''
                const acceptedInventoryPhoto = declaredImageSource === 'inventory-photo' &&
                    (
                        decodedSrc.includes('/storage/v1/object/public/dealer-assets/vehicles/') ||
                        decodedSrc.includes('/storage/v1/object/public/dealer-assets/sell-requests/')
                    )
                const acceptedSource = cardAcceptedMarkers.some((marker) => lowerSrc.includes(marker) || decodedSrc.includes(marker)) || acceptedInventoryPhoto
                const badSource = markers.some((marker) => lowerSrc.includes(marker) || decodedSrc.includes(marker))
                const isVehicleCard =
                    card.matches('.vrf-vehicle-card, [data-vehicle-card]') ||
                    hasVehicleCardContract &&
                    /\b(emi|price|ex-showroom|dealer listing|enquire|view details|test drive|on-road|used|new)\b/i.test(text) &&
                    /\b(car|bike|auto|vehicle|fuel|trans|seats|mileage|range|stock|dealer)\b/i.test(text)
                return {
                    text: text.slice(0, 180),
                    imageSrc: src,
                    imageAlt: image?.getAttribute('alt') ?? '',
                    declaredImageSource,
                    acceptedSource,
                    badSource,
                    missingImage: !src,
                    placeholderText: /\b(no image available|image unavailable)\b/i.test(text),
                    isVehicleCard,
                }
            })
            .filter((card) => card.isVehicleCard)

        const modelCardImageFailures = modelCards.filter((card) =>
            card.missingImage ||
            card.placeholderText ||
            card.badSource ||
            !card.acceptedSource
        )

        return {
            pagePath: window.location.pathname,
            title: document.title,
            overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
            width: window.innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            visibleImages: images.length,
            badImages: [...new Set(badImages)],
            brokenImages: [...new Set(brokenImages)],
            overflowingElements,
            vehicleImages,
            modelCards,
            modelCardImageFailures,
            hasContent: text.length > 50,
            snippet: text.slice(0, 140),
        }
    }, { badMarkers: badImageMarkers, acceptedMarkers: acceptedVehicleImageMarkers, cardAcceptedMarkers: acceptedModelCardImageMarkers, cardSelectors: modelCardSelectors })

    const status = response?.status() ?? null
    const isErrorDocument =
        status !== null && status >= 400 ||
        /"_error"|statusCode":\s*(4|5)\d\d|Application error/i.test(result.snippet) ||
        /_error/i.test(result.pagePath)
    const interactions = await auditInteractions(context)

    return {
        status,
        isErrorDocument,
        interactions,
        ...result,
    }
}

const allRoutes = await getRoutesToAudit()
const batch = routeBatch(allRoutes)
const routes = batch.routes
const marketplaceApi = await auditMarketplaceApiFilters()

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

const results = []
for (const width of viewportWidths) {
    const page = await browser.newPage()
    page.setDefaultTimeout(domTimeoutMs)
    page.setDefaultNavigationTimeout(30000)
    await page.setViewport({
        width,
        height: viewportHeight,
        deviceScaleFactor: 2,
        isMobile: true,
    })

    for (const [index, route] of routes.entries()) {
        const absoluteIndex = batch.start + index + 1
        console.error(`[mobile-audit] ${absoluteIndex}/${batch.total} ${route} @${width}px`)
        try {
            const result = await auditRoute(page, route)
            results.push({ route, viewport: { width, height: viewportHeight }, ...result })
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            if (/Execution context was destroyed|Cannot find context|Target closed|Navigating frame was detached|Navigation timeout/i.test(message)) {
                try {
                    const result = await auditRoute(page, route)
                    results.push({ route, viewport: { width, height: viewportHeight }, ...result, retried: true })
                    continue
                } catch (retryError) {
                    results.push({ route, viewport: { width, height: viewportHeight }, error: retryError instanceof Error ? retryError.message : String(retryError), retried: true })
                    continue
                }
            }
            results.push({ route, viewport: { width, height: viewportHeight }, error: message })
        }
    }

    await page.close()
}

await browser.close()

const failures = results.filter(isFailure)
const marketplaceApiFailures = marketplaceApi.failures
const summary = {
    auditedRoutes: routes.length,
    discoveredRoutes: allRoutes.length,
    skippedDiscoveredRoutes: Math.max(0, allRoutes.length - routes.length),
    batch: { start: batch.start, end: batch.end, size: routes.length },
    viewportWidths,
    checks: results.length,
    failures: failures.length + marketplaceApiFailures.length,
    pageFailures: failures.length,
    marketplaceApiFailures: marketplaceApiFailures.length,
    routesWithVehicleImages: results.filter((result) => (result.vehicleImages?.length ?? 0) > 0).length,
    vehicleImages: results.reduce((count, result) => count + (result.vehicleImages?.length ?? 0), 0),
    modelCards: results.reduce((count, result) => count + (result.modelCards?.length ?? 0), 0),
    interactions: results.reduce((count, result) => count + (result.interactions?.length ?? 0), 0),
    interactionFailures: results.reduce((count, result) => count + ((result.interactions ?? []).filter((interaction) => interaction.failed).length), 0),
}

console.log(JSON.stringify({ baseUrl, viewport: { width: viewportWidth, height: viewportHeight }, summary, marketplaceApi, results }, null, 2))

if (failures.length > 0 || marketplaceApiFailures.length > 0) {
    console.error(`\nMobile image audit failed for ${failures.length} route(s) and ${marketplaceApiFailures.length} marketplace API check(s).`)
    process.exit(1)
}
