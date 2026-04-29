import fs from 'fs'
import path from 'path'

const PROJECT_ROOT = process.cwd()
const DATA_DIR = path.join(PROJECT_ROOT, 'public', 'data')
const META_FILE = path.join(PROJECT_ROOT, 'lib', 'data', 'generated', '4w-cardekho-meta.json')
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'outputs', 'catalog-validation-4w-variant-prices')
const OUTPUT_JSON = path.join(OUTPUT_DIR, '4w-variant-price-audit.json')
const OUTPUT_CSV = path.join(OUTPUT_DIR, '4w-variant-price-checklist.csv')
const OUTPUT_MD = path.join(PROJECT_ROOT, 'docs', '4w-variant-price-audit.md')

const BRAND_FILE_MAP = [
    { make: 'Tata Motors', file: 'tata.json', brandSlug: 'tata' },
    { make: 'Maruti Suzuki', file: 'maruti_suzuki.json', brandSlug: 'maruti-suzuki' },
    { make: 'Hyundai', file: 'hyundai.json', brandSlug: 'hyundai' },
    { make: 'Honda', file: 'honda.json', brandSlug: 'honda' },
    { make: 'Mahindra', file: 'mahindra.json', brandSlug: 'mahindra' },
    { make: 'Kia', file: 'kia.json', brandSlug: 'kia' },
    { make: 'Toyota', file: 'toyota.json', brandSlug: 'toyota' },
    { make: 'Volkswagen', file: 'volkswagen.json', brandSlug: 'volkswagen' },
    { make: 'Skoda', file: 'skoda.json', brandSlug: 'skoda' },
    { make: 'MG', file: 'mg.json', brandSlug: 'mg' },
    { make: 'Renault', file: 'renault.json', brandSlug: 'renault' },
    { make: 'Nissan', file: 'nissan.json', brandSlug: 'nissan' },
    { make: 'Jeep', file: 'jeep.json', brandSlug: 'jeep' },
    { make: 'Citroen', file: 'citroen.json', brandSlug: 'citroen' },
    { make: 'BYD', file: 'byd.json', brandSlug: 'byd' },
    { make: 'Force Motors', file: 'force.json', brandSlug: 'force' },
    { make: 'Isuzu', file: 'isuzu.json', brandSlug: 'isuzu' },
    { make: 'VinFast', file: 'vinfast.json', brandSlug: 'vinfast' },
    { make: 'BMW', file: 'bmw.json', brandSlug: 'bmw' },
    { make: 'Audi', file: 'audi.json', brandSlug: 'audi' },
    { make: 'Mercedes-Benz', file: 'mercedes.json', brandSlug: 'mercedes-benz' },
    { make: 'Porsche', file: 'porsche.json', brandSlug: 'porsche' },
    { make: 'Lamborghini', file: 'lamborghini.json', brandSlug: 'lamborghini' },
    { make: 'Ferrari', file: 'ferrari.json', brandSlug: 'ferrari' },
    { make: 'Land Rover', file: 'land_rover.json', brandSlug: 'land-rover' },
    { make: 'Jaguar', file: 'jaguar.json', brandSlug: 'jaguar' },
    { make: 'Lexus', file: 'lexus.json', brandSlug: 'lexus' },
    { make: 'Volvo', file: 'volvo.json', brandSlug: 'volvo' },
    { make: 'Mini', file: 'mini.json', brandSlug: 'mini' },
    { make: 'Aston Martin', file: 'aston_martin.json', brandSlug: 'aston-martin' },
    { make: 'Bentley', file: 'bentley.json', brandSlug: 'bentley' },
    { make: 'Maserati', file: 'maserati.json', brandSlug: 'maserati' },
    { make: 'Rolls-Royce', file: 'rolls_royce.json', brandSlug: 'rolls-royce' },
]

const APPLY_MODE = process.argv.includes('--apply')

function normalizeText(value) {
    return String(value ?? '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[.'`]/g, '')
        .replace(/\((base model|top model|latest model|current)\)/gi, ' ')
        .replace(/\*/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^a-z0-9 ]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function normalizeMakeKey(value) {
    const normalized = normalizeText(value)
    if (normalized === 'tata') return 'tata motors'
    if (normalized === 'maruti') return 'maruti suzuki'
    if (normalized === 'force') return 'force motors'
    if (normalized === 'mercedes benz') return 'mercedes benz'
    return normalized
}

function normalizeModelKey(value) {
    return normalizeText(value)
}

function stripPrefixes(value, candidates) {
    let result = String(value ?? '').trim()
    for (const candidate of candidates.filter(Boolean).sort((a, b) => b.length - a.length)) {
        const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        result = result.replace(new RegExp(`^${escaped}\\s+`, 'i'), '').trim()
    }
    return result
}

function normalizeTransmission(value) {
    const normalized = normalizeText(value)
    if (!normalized) return ''
    if (normalized.includes('automatic') || normalized === 'at' || normalized === 'amt' || normalized === 'cvt' || normalized === 'dct') return 'automatic'
    if (normalized.includes('manual') || normalized === 'mt') return 'manual'
    return normalized
}

function variantCandidateKeys(variantName, modelName, makeName, fuelType = '', transmission = '') {
    const raw = String(variantName ?? '').trim()
    const stripped = stripPrefixes(raw, [
        String(modelName ?? '').trim(),
        `${String(makeName ?? '').trim()} ${String(modelName ?? '').trim()}`.trim(),
        `${String(modelName ?? '').trim()} ${String(modelName ?? '').trim()}`.trim(),
    ])
    const normalizedFuel = normalizeText(fuelType)
    const normalizedTransmission = normalizeTransmission(transmission)
    const seeds = [raw, stripped]
    const keys = new Set()

    for (const seed of seeds) {
        const base = normalizeText(seed)
        if (!base) continue
        keys.add(base)
        if (normalizedFuel) keys.add(normalizeText(`${seed} ${normalizedFuel}`))
        if (normalizedTransmission) {
            keys.add(normalizeText(`${seed} ${normalizedTransmission}`))
            if (normalizedTransmission === 'automatic') keys.add(normalizeText(`${seed} at`))
            if (normalizedTransmission === 'manual') keys.add(normalizeText(`${seed} mt`))
        }
        if (normalizedFuel && normalizedTransmission) {
            keys.add(normalizeText(`${seed} ${normalizedFuel} ${normalizedTransmission}`))
            if (normalizedTransmission === 'automatic') keys.add(normalizeText(`${seed} ${normalizedFuel} at`))
            if (normalizedTransmission === 'manual') keys.add(normalizeText(`${seed} ${normalizedFuel} mt`))
        }
    }

    return Array.from(keys)
}

function parsePriceValue(value) {
    if (value && typeof value === 'object') {
        if ('min' in value) return parsePriceValue(value.min)
        if ('value' in value) return parsePriceValue(value.value)
    }

    if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value)

    const cleaned = String(value ?? '').replace(/[^0-9.]/g, '')
    if (!cleaned) return null
    const parsed = Number(cleaned)
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null
}

function getLocalPriceMin(record, fallback = null) {
    return parsePriceValue(
        record.ex_showroom_price_min_inr ??
        record.ex_showroom_price_min ??
        record.ex_showroom_min ??
        record.ex_showroom_price_range ??
        record.ex_showroom_price ??
        record.pricing?.ex_showroom_min ??
        record.pricing?.ex_showroom ??
        record.pricing?.ex_showroom_price ??
        fallback,
    )
}

function getLocalPriceMax(record, fallback = null) {
    return parsePriceValue(
        record.ex_showroom_price_max_inr ??
        record.ex_showroom_price_max ??
        record.ex_showroom_max ??
        record.pricing?.ex_showroom_max ??
        getLocalPriceMin(record, fallback),
    )
}

function getCitationUrl(record) {
    return [
        record.source_url,
        record.source_url_citation,
        record.variant_name_citation,
        record.model_citation,
        record.make_citation,
        record.metadata?.source_url,
        record.metadata?.source_url_citation,
    ].find((value) => typeof value === 'string' && value.startsWith('http')) ?? null
}

function setLocalPrice(record, nextPrice) {
    if ('ex_showroom_price_min_inr' in record || 'ex_showroom_price_max_inr' in record) {
        record.ex_showroom_price_min_inr = nextPrice
        record.ex_showroom_price_max_inr = nextPrice
        return
    }

    if ('ex_showroom_price_min' in record || 'ex_showroom_price_max' in record) {
        record.ex_showroom_price_min = nextPrice
        record.ex_showroom_price_max = nextPrice
        return
    }

    if ('ex_showroom_price' in record) {
        if (record.ex_showroom_price && typeof record.ex_showroom_price === 'object') {
            record.ex_showroom_price.min = nextPrice
            record.ex_showroom_price.max = nextPrice
        } else {
            record.ex_showroom_price = nextPrice
        }
        return
    }

    if (record.pricing && typeof record.pricing === 'object') {
        if (record.pricing.ex_showroom && typeof record.pricing.ex_showroom === 'object') {
            record.pricing.ex_showroom.min = nextPrice
            record.pricing.ex_showroom.max = nextPrice
            return
        }
        if (record.pricing.ex_showroom_price && typeof record.pricing.ex_showroom_price === 'object') {
            record.pricing.ex_showroom_price.min = nextPrice
            record.pricing.ex_showroom_price.max = nextPrice
            return
        }
        if ('ex_showroom' in record.pricing) {
            record.pricing.ex_showroom = { min: nextPrice, max: nextPrice }
            return
        }
    }

    record.ex_showroom_price_min_inr = nextPrice
    record.ex_showroom_price_max_inr = nextPrice
}

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true })
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, value) {
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function csvEscape(value) {
    const text = String(value ?? '')
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
    return text
}

function loadMetaLookup() {
    const raw = readJson(META_FILE)
    const lookup = new Map()

    for (const brand of Object.values(raw.brands ?? {})) {
        const make = brand.make
        for (const model of Object.values(brand.models ?? {})) {
            lookup.set(
                `${normalizeMakeKey(make)}|${normalizeModelKey(model.model)}`,
                model,
            )
        }
    }

    return lookup
}

function extractLocalVariants(raw, filePath, defaultMake) {
    const entries = []
    const seen = new Set()

    function walk(node, ctx = {}) {
        if (!node || typeof node !== 'object') return

        if (Array.isArray(node)) {
            node.forEach((item) => walk(item, ctx))
            return
        }

        const record = node
        const make = String(record.make ?? ctx.make ?? defaultMake ?? '').trim()
        const model = String(record.model ?? record.model_name ?? ctx.model ?? '').trim()
        const variantName = String(record.variant_name ?? record.variant ?? '').trim()
        const minPrice = getLocalPriceMin(record, ctx.price)
        const maxPrice = getLocalPriceMax(record, ctx.price)
        const fuelType = String(
            record.fuel_type ??
            record.fuel ??
            record.powertrain?.fuel ??
            ctx.fuelType ??
            '',
        ).trim()
        const transmission = String(
            record.transmission ??
            record.powertrain?.transmission ??
            ctx.transmission ??
            '',
        ).trim()
        const hasPrice = minPrice != null || maxPrice != null
        const hasOwnModel = 'model' in record || 'model_name' in record
        const hasOwnVariant = 'variant_name' in record || 'variant' in record
        const hasOwnIdentity = hasOwnModel || hasOwnVariant
        const hasIdentity = Boolean(model || variantName)

        if (hasOwnIdentity && hasIdentity && hasPrice) {
            const entry = {
                make: make || defaultMake,
                model: model || variantName,
                variantName: variantName || model,
                priceMinInr: minPrice,
                priceMaxInr: maxPrice,
                fuelType,
                transmission,
                citationUrl: getCitationUrl(record),
                filePath,
                record,
            }
            const dedupeKey = [
                normalizeMakeKey(entry.make),
                normalizeModelKey(entry.model),
                normalizeText(entry.variantName),
                entry.priceMinInr ?? '',
                entry.priceMaxInr ?? '',
                filePath,
            ].join('|')
            if (!seen.has(dedupeKey)) {
                seen.add(dedupeKey)
                entries.push(entry)
            }
        }

        const nextCtx = {
            make: make || ctx.make || defaultMake,
            model: model || ctx.model,
            price: minPrice ?? ctx.price ?? null,
            fuelType: fuelType || ctx.fuelType || '',
            transmission: transmission || ctx.transmission || '',
        }

        for (const [key, value] of Object.entries(record)) {
            if (key === 'image_urls') continue
            if (value && typeof value === 'object') walk(value, nextCtx)
        }
    }

    walk(raw)
    return entries
}

function slugifyModel(model) {
    const overrides = {
        'creta ev': 'creta-electric',
    }
    const override = overrides[String(model ?? '').trim().toLowerCase()]
    if (override) return override
    return String(model ?? '')
        .replace(/\b&\b/g, 'and')
        .replace(/\./g, '')
        .replace(/[^A-Za-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()
}

function buildVariantsUrl(sourceUrl, brandSlug, model) {
    if (!sourceUrl) {
        return brandSlug ? `https://www.cardekho.com/${brandSlug}/${slugifyModel(model)}/variants.htm` : null
    }
    if (sourceUrl.includes('/variants.htm')) return sourceUrl
    if (sourceUrl.includes('/overview/') || sourceUrl.includes('/carmodels/')) {
        return brandSlug ? `https://www.cardekho.com/${brandSlug}/${slugifyModel(model)}/variants.htm` : sourceUrl
    }
    return `${sourceUrl.replace(/\/+$/, '')}/variants.htm`
}

async function fetchHtml(url) {
    const response = await fetch(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'accept-language': 'en-IN,en;q=0.9',
        },
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return await response.text()
}

function extractCardekhoVariantsFromHtml(html, make, model) {
    const variants = []
    const seen = new Set()
    const priceRegex = /"exShowRoomPrice":(\d+)/g
    const normalizedTargetModel = normalizeModelKey(model)

    for (const match of html.matchAll(priceRegex)) {
        const index = match.index ?? 0
        const window = html.slice(Math.max(0, index - 1600), Math.min(html.length, index + 2600))
        const price = Number(match[1])
        if (!Number.isFinite(price) || price <= 0) continue

        const variantShortName = window.match(/"variantShortName":"([^"]+)"/)?.[1] ?? ''
        const text = window.match(/"text":"([^"]+)"/)?.[1] ?? ''
        const title = window.match(/"title":"([^"]+)"/)?.[1] ?? ''
        const modelName = window.match(/"modelName":"([^"]+)"/)?.[1] ?? model
        const variantStatus = window.match(/"variantStatus":"([^"]+)"/)?.[1] ?? ''
        const fuelName = window.match(/"fuelName":"([^"]+)"/)?.[1] ?? ''
        const subText = window.match(/"subText":"([^"]+)"/)?.[1] ?? ''
        const transmission = /\bAutomatic\b|\bAMT\b|\bCVT\b|\bDCT\b|\bAT\b/i.test(subText)
            ? 'Automatic'
            : /\bManual\b|\bMT\b/i.test(subText)
                ? 'Manual'
                : ''

        const rawName = variantShortName || text || title
        if (!rawName) continue

        const normalizedModelName = normalizeModelKey(modelName)
        const normalizedRawName = normalizeModelKey(rawName)
        const sameModel =
            normalizedModelName === normalizedTargetModel ||
            (normalizedModelName && normalizedTargetModel.includes(normalizedModelName)) ||
            (normalizedTargetModel && normalizedModelName.includes(normalizedTargetModel)) ||
            normalizedRawName.includes(normalizedTargetModel)

        if (!sameModel) continue

        const keys = variantCandidateKeys(rawName, modelName || model, make, fuelName, transmission)
        const dedupeKey = `${normalizeModelKey(modelName || model)}|${keys[0] ?? normalizeText(rawName)}|${price}`
        if (seen.has(dedupeKey)) continue
        seen.add(dedupeKey)

        variants.push({
            make,
            model: modelName || model,
            variantName: rawName,
            variantShortName,
            priceMinInr: price,
            variantStatus,
            keys,
        })
    }

    if (variants.length > 0) return variants

    const directPrice = html.match(/"priceMinInr":(\d+)/)?.[1]
    if (directPrice) {
        return [{
            make,
            model,
            variantName: model,
            variantShortName: '',
            priceMinInr: Number(directPrice),
            variantStatus: 'CURRENT',
            keys: variantCandidateKeys(model, model, make),
        }]
    }

    return []
}

function groupByBrandModel(entries) {
    const grouped = new Map()
    for (const entry of entries) {
        const key = `${normalizeMakeKey(entry.make)}|${normalizeModelKey(entry.model)}`
        if (!grouped.has(key)) {
            grouped.set(key, {
                make: entry.make,
                model: entry.model,
                entries: [],
            })
        }
        grouped.get(key).entries.push(entry)
    }
    return grouped
}

function chooseCurrentVariant(localEntry, currentVariants, make, model) {
    const keySet = new Set(variantCandidateKeys(localEntry.variantName, model, make, localEntry.fuelType, localEntry.transmission))
    const matches = currentVariants.filter((variant) => variant.keys.some((key) => keySet.has(key)))
    if (matches.length === 1) return matches[0]

    if (matches.length > 1) {
        const exactShort = matches.find((variant) => normalizeText(variant.variantShortName) === normalizeText(localEntry.variantName))
        if (exactShort) return exactShort
        const exactText = matches.find((variant) => normalizeText(variant.variantName) === normalizeText(localEntry.variantName))
        if (exactText) return exactText
        return null
    }

    if (currentVariants.length === 1) return currentVariants[0]
    return null
}

function brandDisplayName(make) {
    return make === 'Tata Motors' ? 'Tata' : make
}

async function main() {
    ensureDir(OUTPUT_DIR)

    const metaLookup = loadMetaLookup()
    const brandSlugLookup = new Map(BRAND_FILE_MAP.map((brand) => [normalizeMakeKey(brand.make), brand.brandSlug]))
    const brandFiles = BRAND_FILE_MAP
        .map(({ make, file }) => ({
            make,
            file,
            filePath: path.join(DATA_DIR, file),
        }))
        .filter(({ filePath }) => fs.existsSync(filePath))

    const allLocalEntries = []
    const rawFiles = new Map()

    for (const brand of brandFiles) {
        const raw = readJson(brand.filePath)
        rawFiles.set(brand.filePath, raw)
        allLocalEntries.push(...extractLocalVariants(raw, brand.filePath, brand.make))
    }

    const grouped = groupByBrandModel(allLocalEntries)
    const currentByGroup = new Map()
    const fetchFailures = []

    for (const [groupKey, group] of grouped.entries()) {
        const meta = metaLookup.get(`${normalizeMakeKey(group.make)}|${normalizeModelKey(group.model)}`)
        const sourceUrl = meta?.sourceUrl ?? group.entries.map((entry) => entry.citationUrl).find(Boolean) ?? null
        const brandSlug = brandSlugLookup.get(normalizeMakeKey(group.make)) ?? ''
        const variantsUrl = buildVariantsUrl(sourceUrl, brandSlug, group.model)

        if (!variantsUrl) {
            currentByGroup.set(groupKey, { variantsUrl: null, variants: [], error: 'NO_SOURCE_URL' })
            continue
        }

        try {
            const html = await fetchHtml(variantsUrl)
            let currentVariants = extractCardekhoVariantsFromHtml(html, brandDisplayName(group.make), group.model)

            if (currentVariants.length === 0 && sourceUrl && sourceUrl.includes('/overview/') && group.entries.length === 1) {
                try {
                    const overviewHtml = await fetchHtml(sourceUrl)
                    const overviewVariants = extractCardekhoVariantsFromHtml(overviewHtml, brandDisplayName(group.make), group.model)
                    if (overviewVariants.length > 0) {
                        currentVariants = overviewVariants
                    }
                } catch {
                    // Keep the original no-price-parsed result when overview fallback fails.
                }
            }

            currentByGroup.set(groupKey, {
                variantsUrl,
                variants: currentVariants,
                error: currentVariants.length === 0 ? 'NO_PRICE_PARSED' : null,
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            fetchFailures.push({ make: group.make, model: group.model, variantsUrl, error: message })
            currentByGroup.set(groupKey, { variantsUrl, variants: [], error: `FETCH_ERROR: ${message}` })
        }
    }

    const checklistRows = []
    const summaryByBrand = new Map()
    let updatedCount = 0

    for (const [groupKey, group] of grouped.entries()) {
        const currentInfo = currentByGroup.get(groupKey) ?? { variantsUrl: null, variants: [], error: 'NO_SOURCE_URL' }
        const matchedCurrentKeys = new Set()

        for (const entry of group.entries) {
            const currentVariant = chooseCurrentVariant(entry, currentInfo.variants, group.make, group.model)
            const localPrice = entry.priceMinInr ?? 0
            const currentPrice = currentVariant?.priceMinInr ?? null
            let status = 'MATCH'
            let note = ''

            if (currentInfo.error) {
                status = currentInfo.error.startsWith('FETCH_ERROR') ? 'FETCH_ERROR' : currentInfo.error
                note = currentInfo.error
            } else if (!currentVariant) {
                status = 'LOCAL_ONLY_VARIANT'
                note = 'Local variant not found on current Cardekho variants feed'
            } else if (currentPrice == null) {
                status = 'NO_PRICE_PARSED'
                note = 'Current Cardekho variant found but no ex-showroom price parsed'
            } else if (localPrice !== currentPrice) {
                status = 'PRICE_MISMATCH'
                note = `Local ₹${localPrice.toLocaleString('en-IN')} vs Cardekho ₹${currentPrice.toLocaleString('en-IN')}`
                if (APPLY_MODE) {
                    setLocalPrice(entry.record, currentPrice)
                    entry.priceMinInr = currentPrice
                    entry.priceMaxInr = currentPrice
                    updatedCount += 1
                }
            }

            if (currentVariant) {
                matchedCurrentKeys.add(normalizeText(currentVariant.variantName))
                matchedCurrentKeys.add(normalizeText(currentVariant.variantShortName))
            }

            checklistRows.push({
                brand: group.make,
                model: group.model,
                localVariant: entry.variantName,
                localPriceInr: localPrice,
                cardekhoVariant: currentVariant?.variantName ?? '',
                cardekhoPriceInr: currentPrice ?? '',
                deltaInr: currentPrice != null ? currentPrice - localPrice : '',
                status,
                variantsUrl: currentInfo.variantsUrl ?? '',
                citationUrl: entry.citationUrl ?? '',
                note,
            })

            if (!summaryByBrand.has(group.make)) {
                summaryByBrand.set(group.make, { total: 0, match: 0, mismatch: 0, localOnly: 0, cardekhoOnly: 0, errors: 0 })
            }
            const summary = summaryByBrand.get(group.make)
            summary.total += 1
            if (status === 'MATCH') summary.match += 1
            else if (status === 'PRICE_MISMATCH') summary.mismatch += 1
            else if (status === 'LOCAL_ONLY_VARIANT') summary.localOnly += 1
            else summary.errors += 1
        }

        for (const currentVariant of currentInfo.variants) {
            const currentKeys = [normalizeText(currentVariant.variantName), normalizeText(currentVariant.variantShortName)].filter(Boolean)
            if (currentKeys.some((key) => matchedCurrentKeys.has(key))) continue

            checklistRows.push({
                brand: group.make,
                model: group.model,
                localVariant: '',
                localPriceInr: '',
                cardekhoVariant: currentVariant.variantName,
                cardekhoPriceInr: currentVariant.priceMinInr,
                deltaInr: '',
                status: 'CARDEKHO_ONLY_VARIANT',
                variantsUrl: currentInfo.variantsUrl ?? '',
                citationUrl: '',
                note: 'Current Cardekho variant not found locally',
            })

            if (!summaryByBrand.has(group.make)) {
                summaryByBrand.set(group.make, { total: 0, match: 0, mismatch: 0, localOnly: 0, cardekhoOnly: 0, errors: 0 })
            }
            const summary = summaryByBrand.get(group.make)
            summary.cardekhoOnly += 1
        }
    }

    if (APPLY_MODE && updatedCount > 0) {
        for (const [filePath, raw] of rawFiles.entries()) {
            writeJson(filePath, raw)
        }
    }

    checklistRows.sort((a, b) =>
        a.brand.localeCompare(b.brand) ||
        a.model.localeCompare(b.model) ||
        String(a.localVariant || a.cardekhoVariant).localeCompare(String(b.localVariant || b.cardekhoVariant)),
    )

    const jsonOutput = {
        generatedAt: new Date().toISOString(),
        applyMode: APPLY_MODE,
        filesAudited: brandFiles.map((brand) => path.relative(PROJECT_ROOT, brand.filePath)),
        totalGroups: grouped.size,
        totalRows: checklistRows.length,
        updatedCount,
        fetchFailures,
        summaryByBrand: Object.fromEntries(Array.from(summaryByBrand.entries()).sort(([a], [b]) => a.localeCompare(b))),
        rows: checklistRows,
    }
    writeJson(OUTPUT_JSON, jsonOutput)

    const csvHeader = [
        'Brand',
        'Model',
        'Local Variant',
        'Local Ex-Showroom INR*',
        'Cardekho Variant',
        'Cardekho Ex-Showroom INR*',
        'Delta INR',
        'Status',
        'Variants URL',
        'Local Citation URL',
        'Note',
    ]
    const csvLines = [
        csvHeader.join(','),
        ...checklistRows.map((row) => [
            row.brand,
            row.model,
            row.localVariant,
            row.localPriceInr,
            row.cardekhoVariant,
            row.cardekhoPriceInr,
            row.deltaInr,
            row.status,
            row.variantsUrl,
            row.citationUrl,
            row.note,
        ].map(csvEscape).join(',')),
    ]
    fs.writeFileSync(OUTPUT_CSV, `${csvLines.join('\n')}\n`)

    const mismatchCount = checklistRows.filter((row) => row.status === 'PRICE_MISMATCH').length
    const localOnlyCount = checklistRows.filter((row) => row.status === 'LOCAL_ONLY_VARIANT').length
    const cardekhoOnlyCount = checklistRows.filter((row) => row.status === 'CARDEKHO_ONLY_VARIANT').length
    const errorCount = checklistRows.filter((row) => !['MATCH', 'PRICE_MISMATCH', 'LOCAL_ONLY_VARIANT', 'CARDEKHO_ONLY_VARIANT'].includes(row.status)).length

    const mdLines = [
        '# 4W Variant Price Audit',
        '',
        `Generated: ${jsonOutput.generatedAt}`,
        '',
        `Mode: ${APPLY_MODE ? 'apply' : 'audit'}`,
        '',
        `Audited brand files: ${brandFiles.length}`,
        `Brand-model groups checked: ${grouped.size}`,
        `Checklist rows: ${checklistRows.length}`,
        `Price mismatches: ${mismatchCount}`,
        `Local-only variants: ${localOnlyCount}`,
        `Cardekho-only variants: ${cardekhoOnlyCount}`,
        `Fetch / parse errors: ${errorCount}`,
        `Updated local rows: ${updatedCount}`,
        '',
        '## Brand Summary',
        '',
        '| Brand | Total Local Variants | Matches | Price Mismatches | Local-Only | Cardekho-Only | Errors |',
        '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
        ...Array.from(summaryByBrand.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([brand, summary]) => `| ${brand} | ${summary.total} | ${summary.match} | ${summary.mismatch} | ${summary.localOnly} | ${summary.cardekhoOnly} | ${summary.errors} |`),
        '',
        '## Output Files',
        '',
        `- JSON: \`${path.relative(PROJECT_ROOT, OUTPUT_JSON)}\``,
        `- CSV checklist: \`${path.relative(PROJECT_ROOT, OUTPUT_CSV)}\``,
        '',
        '## Notes',
        '',
        '- This audit compares local 4W brand JSON variant prices against the current Cardekho variants pages.',
        '- Main public `/cars` listings still read DB-backed `car_catalog` prices, so JSON fixes alone do not automatically update that separate source.',
        '- `LOCAL_ONLY_VARIANT` means the local variant row did not match the current Cardekho variants feed for that model.',
        '- `CARDEKHO_ONLY_VARIANT` means Cardekho currently lists a variant we do not currently have as a local variant row.',
    ]
    fs.writeFileSync(OUTPUT_MD, `${mdLines.join('\n')}\n`)

    console.log(`4W variant price audit complete (${APPLY_MODE ? 'apply' : 'audit'} mode).`)
    console.log(`Checklist rows: ${checklistRows.length}`)
    console.log(`Price mismatches: ${mismatchCount}`)
    console.log(`Local-only variants: ${localOnlyCount}`)
    console.log(`Cardekho-only variants: ${cardekhoOnlyCount}`)
    console.log(`Errors: ${errorCount}`)
    console.log(`Updated local rows: ${updatedCount}`)
    console.log(`CSV: ${OUTPUT_CSV}`)
}

await main()
