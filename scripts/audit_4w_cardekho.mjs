import fs from 'fs'
import path from 'path'

const PROJECT_ROOT = process.cwd()
const DATA_DIR = path.join(PROJECT_ROOT, 'public', 'data')
const OUTPUT_JSON = path.join(PROJECT_ROOT, 'lib', 'data', 'generated', '4w-cardekho-meta.json')
const OUTPUT_MD = path.join(PROJECT_ROOT, 'docs', '4w-cardekho-coverage-audit.md')

const FOUR_W_BRANDS = [
  { make: 'Tata Motors', jsonKey: 'tata', brandId: 'tata', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Tata', cardekhoBrandLabel: 'Tata' },
  { make: 'Maruti Suzuki', jsonKey: 'maruti_suzuki', brandId: 'maruti-suzuki', cardekhoBrandUrl: 'https://www.cardekho.com/maruti-suzuki-cars', cardekhoBrandLabel: 'Maruti' },
  { make: 'Hyundai', jsonKey: 'hyundai', brandId: 'hyundai', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Hyundai', cardekhoBrandLabel: 'Hyundai' },
  { make: 'Honda', jsonKey: 'honda', brandId: 'honda', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Honda', cardekhoBrandLabel: 'Honda' },
  { make: 'Mahindra', jsonKey: 'mahindra', brandId: 'mahindra', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Mahindra', cardekhoBrandLabel: 'Mahindra' },
  { make: 'Kia', jsonKey: 'kia', brandId: 'kia', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Kia', cardekhoBrandLabel: 'Kia' },
  { make: 'Toyota', jsonKey: 'toyota', brandId: 'toyota', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Toyota', cardekhoBrandLabel: 'Toyota' },
  { make: 'Volkswagen', jsonKey: 'volkswagen', brandId: 'volkswagen', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Volkswagen', cardekhoBrandLabel: 'Volkswagen' },
  { make: 'Skoda', jsonKey: 'skoda', brandId: 'skoda', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Skoda', cardekhoBrandLabel: 'Skoda' },
  { make: 'MG', jsonKey: 'mg', brandId: 'mg', cardekhoBrandUrl: 'https://www.cardekho.com/cars/MG', cardekhoBrandLabel: 'MG' },
  { make: 'Renault', jsonKey: 'renault', brandId: 'renault', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Renault', cardekhoBrandLabel: 'Renault' },
  { make: 'Nissan', jsonKey: 'nissan', brandId: 'nissan', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Nissan', cardekhoBrandLabel: 'Nissan' },
  { make: 'Jeep', jsonKey: 'jeep', brandId: 'jeep', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Jeep', cardekhoBrandLabel: 'Jeep' },
  { make: 'Citroen', jsonKey: 'citroen', brandId: 'citroen', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Citroen', cardekhoBrandLabel: 'Citroen' },
  { make: 'BYD', jsonKey: 'byd', brandId: 'byd', cardekhoBrandUrl: 'https://www.cardekho.com/cars/BYD', cardekhoBrandLabel: 'BYD' },
  { make: 'Force Motors', jsonKey: 'force', brandId: 'force-motors', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Force', cardekhoBrandLabel: 'Force' },
  { make: 'Isuzu', jsonKey: 'isuzu', brandId: 'isuzu', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Isuzu', cardekhoBrandLabel: 'Isuzu' },
  { make: 'VinFast', jsonKey: 'vinfast', brandId: 'vinfast', cardekhoBrandUrl: 'https://www.cardekho.com/cars/VinFast', cardekhoBrandLabel: 'VinFast' },
  { make: 'BMW', jsonKey: 'bmw', brandId: 'bmw', cardekhoBrandUrl: 'https://www.cardekho.com/cars/BMW', cardekhoBrandLabel: 'BMW' },
  { make: 'Audi', jsonKey: 'audi', brandId: 'audi', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Audi', cardekhoBrandLabel: 'Audi' },
  { make: 'Mercedes-Benz', jsonKey: 'mercedes', brandId: 'mercedes-benz', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Mercedes-Benz', cardekhoBrandLabel: 'Mercedes-Benz' },
  { make: 'Porsche', jsonKey: 'porsche', brandId: 'porsche', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Porsche', cardekhoBrandLabel: 'Porsche' },
  { make: 'Lamborghini', jsonKey: 'lamborghini', brandId: 'lamborghini', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Lamborghini', cardekhoBrandLabel: 'Lamborghini' },
  { make: 'Ferrari', jsonKey: 'ferrari', brandId: 'ferrari', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Ferrari', cardekhoBrandLabel: 'Ferrari' },
  { make: 'Land Rover', jsonKey: 'land_rover', brandId: 'land-rover', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Land_Rover', cardekhoBrandLabel: 'Land Rover' },
  { make: 'Jaguar', jsonKey: 'jaguar', brandId: 'jaguar', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Jaguar', cardekhoBrandLabel: 'Jaguar' },
  { make: 'Lexus', jsonKey: 'lexus', brandId: 'lexus', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Lexus', cardekhoBrandLabel: 'Lexus' },
  { make: 'Volvo', jsonKey: 'volvo', brandId: 'volvo', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Volvo', cardekhoBrandLabel: 'Volvo' },
  { make: 'Mini', jsonKey: 'mini', brandId: 'mini', cardekhoBrandUrl: 'https://www.cardekho.com/cars/MINI', cardekhoBrandLabel: 'MINI' },
  { make: 'Aston Martin', jsonKey: 'aston_martin', brandId: 'aston-martin', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Aston_Martin', cardekhoBrandLabel: 'Aston Martin' },
  { make: 'Bentley', jsonKey: 'bentley', brandId: 'bentley', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Bentley', cardekhoBrandLabel: 'Bentley' },
  { make: 'Maserati', jsonKey: 'maserati', brandId: 'maserati', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Maserati', cardekhoBrandLabel: 'Maserati' },
  { make: 'Rolls-Royce', jsonKey: 'rolls_royce', brandId: 'rolls-royce', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Rolls-Royce', cardekhoBrandLabel: 'Rolls-Royce' },
]

function normalizeMakeKey(value) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function normalizeModelKey(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeBodyType(value) {
  if (typeof value !== 'string') return null
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  if (!normalized) return null

  if (normalized.includes('pickup')) return 'Pickup'
  if (normalized.includes('convertible') || normalized.includes('roadster') || normalized.includes('cabriolet')) return 'Convertible'
  if (normalized.includes('coupe')) return normalized.includes('suv') ? 'SUV' : 'Coupe'
  if (normalized.includes('mpv') || normalized.includes('muv') || normalized.includes('minivan') || normalized.includes('people mover')) return 'MPV'
  if (normalized.includes('sport utilit') || normalized === 'suv' || normalized.includes('crossover')) return 'SUV'
  if (normalized.includes('hatchback')) return 'Hatchback'
  if (normalized.includes('sedan')) return 'Sedan'
  if (normalized.includes('van')) return 'MPV'
  if (normalized.includes('wagon')) return 'Hatchback'

  return null
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function getImg(imgUrls) {
  if (!Array.isArray(imgUrls)) return null
  const match = imgUrls.find((item) => item && typeof item === 'object' && typeof item.value === 'string' && item.value.startsWith('http'))
  return match?.value ?? null
}

function extractLocalModels(raw) {
  const models = []
  const seen = new Set()

  function walk(node, ctxModel, ctxPrice, ctxFuel) {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      node.forEach((item) => walk(item, ctxModel, ctxPrice, ctxFuel))
      return
    }

    const model = String(node.model ?? node.model_name ?? ctxModel ?? '').trim()
    const imageUrl = getImg(node.image_urls)
    const price = node.ex_showroom_price ?? node.ex_showroom_price_min_inr ?? ctxPrice ?? null
    const fuel = node.fuel_type ?? ctxFuel ?? null
    const transmission = node.transmission ?? null
    const seating = node.seating_capacity ?? 5

    if (model) {
      const looksLikeAggregateLabel = model.includes(',') && !imageUrl && !price
      if (looksLikeAggregateLabel) {
        // Some raw JSON parents carry a comma-joined heading like "Compass, Meridian, Wrangler".
        // Skip them so they do not masquerade as a real model in the coverage report.
      } else {
      const key = normalizeModelKey(model)
      if (!seen.has(key)) {
        seen.add(key)
        models.push({
          model,
          imageUrl,
          priceMinInr: Number(price) || null,
          fuelType: typeof fuel === 'string' ? fuel : null,
          transmission: typeof transmission === 'string' ? transmission : null,
          seating: Number(seating) || 5,
        })
      }
      }
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === 'image_urls') continue
      if (value && typeof value === 'object') walk(value, model || ctxModel, price, fuel)
    }
  }

  walk(raw)

  if (models.length > 0) {
    return models
  }

  function collectFromImageUrl(node) {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      node.forEach(collectFromImageUrl)
      return
    }

    const imageUrl = getImg(node.image_urls)
    if (imageUrl) {
      const match = imageUrl.match(/\/([A-Z][^/]+)\/\d{4,}\//)
      if (match) {
        const model = match[1].replace(/-/g, ' ')
        const key = normalizeModelKey(model)
        if (!seen.has(key)) {
          seen.add(key)
          models.push({
            model,
            imageUrl,
            priceMinInr: Number(node.ex_showroom_price ?? node.ex_showroom_price_min_inr) || null,
            fuelType: typeof node.fuel_type === 'string' ? node.fuel_type : null,
            transmission: typeof node.transmission === 'string' ? node.transmission : null,
            seating: Number(node.seating_capacity ?? 5) || 5,
          })
        }
      }
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === 'image_urls') continue
      if (value && typeof value === 'object') collectFromImageUrl(value)
    }
  }

  collectFromImageUrl(raw)
  return models
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'accept-language': 'en-IN,en;q=0.9',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }

  return await response.text()
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function extractJsonLd(html) {
  const blocks = []
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const parsed = safeJsonParse(match[1].trim())
    if (parsed) {
      if (Array.isArray(parsed)) blocks.push(...parsed)
      else blocks.push(parsed)
    }
  }
  return blocks
}

function flattenObjects(node, output = []) {
  if (!node || typeof node !== 'object') return output
  output.push(node)
  if (Array.isArray(node)) {
    node.forEach((item) => flattenObjects(item, output))
    return output
  }
  Object.values(node).forEach((value) => flattenObjects(value, output))
  return output
}

function stripBrandPrefix(name, brandLabel) {
  let result = name.trim()
  const candidates = Array.from(new Set([
    brandLabel,
    brandLabel.replace(/ Motors$/i, ''),
    brandLabel.replace(/-Benz$/i, ''),
    'Maruti Suzuki',
    'Maruti',
  ])).sort((a, b) => b.length - a.length)
  for (const candidate of candidates) {
    if (!candidate) continue
    const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    result = result.replace(new RegExp(`^${escaped}\\s+`, 'i'), '').trim()
  }
  return result
}

function extractBrandModelsFromHtml(html, brand) {
  const items = []
  const objects = flattenObjects(extractJsonLd(html))
  for (const obj of objects) {
    const list = Array.isArray(obj?.itemListElement) ? obj.itemListElement : null
    if (!list) continue

    for (const entry of list) {
      const product = entry?.Item && typeof entry.Item === 'object' ? entry.Item : null
      if (!product || product['@type'] !== 'Product') continue
      const rawName = typeof product.name === 'string' ? product.name : ''
      const model = stripBrandPrefix(rawName, brand.cardekhoBrandLabel)
      if (!model) continue
      items.push({
        model,
        name: rawName,
        sourceUrl: typeof product.url === 'string' ? product.url : null,
        imageUrl: typeof product.image === 'string' ? product.image : null,
        priceMinInr: Number(product?.offers?.lowPrice ?? product?.offers?.price) || null,
      })
    }
  }

  const deduped = new Map()
  for (const item of items) {
    const key = normalizeModelKey(item.model)
    if (!deduped.has(key)) deduped.set(key, item)
  }
  return Array.from(deduped.values())
}

function extractModelMetaFromHtml(html) {
  const objects = flattenObjects(extractJsonLd(html))
  const meta = {
    bodyType: null,
    fuelType: null,
    imageUrl: null,
    priceMinInr: null,
  }

  for (const obj of objects) {
    if (obj?.['@type'] !== 'Car' && obj?.['@type'] !== 'Product') continue

    meta.bodyType ||= normalizeBodyType(obj.bodyType)
    meta.fuelType ||= typeof obj.fuelType === 'string' ? obj.fuelType : null
    meta.imageUrl ||= typeof obj.image === 'string' ? obj.image : null
    meta.priceMinInr ||= Number(obj?.offers?.price ?? obj?.offers?.lowPrice) || null

    if (meta.bodyType && meta.fuelType && meta.imageUrl && meta.priceMinInr) {
      return meta
    }
  }

  return meta
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length)
  let index = 0

  async function worker() {
    while (index < items.length) {
      const current = index++
      results[current] = await mapper(items[current], current)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length || 1) }, () => worker()))
  return results
}

async function buildBrandAudit(brand) {
  const filePath = path.join(DATA_DIR, `${brand.jsonKey}.json`)
  if (!fs.existsSync(filePath)) {
    return {
      make: brand.make,
      error: `Missing local JSON: ${brand.jsonKey}.json`,
    }
  }

  const localModels = extractLocalModels(readJson(filePath))
  const localMap = new Map(localModels.map((model) => [normalizeModelKey(model.model), model]))

  const brandHtml = await fetchHtml(brand.cardekhoBrandUrl)
  const cardekhoModels = extractBrandModelsFromHtml(brandHtml, brand)

  const enrichedModels = await mapWithConcurrency(cardekhoModels, 6, async (model) => {
    if (!model.sourceUrl) {
      return {
        ...model,
        bodyType: null,
        fuelType: null,
      }
    }

    try {
      const modelHtml = await fetchHtml(model.sourceUrl)
      return {
        ...model,
        ...extractModelMetaFromHtml(modelHtml),
      }
    } catch {
      return {
        ...model,
        bodyType: null,
        fuelType: null,
      }
    }
  })

  const metaModels = {}
  const missingModels = []
  const localOnlyModels = []

  for (const model of enrichedModels) {
    const key = normalizeModelKey(model.model)
    const local = localMap.get(key)
    if (!local) missingModels.push(model.model)

    metaModels[key] = {
      model: model.model,
      bodyType: normalizeBodyType(model.bodyType),
      fuelType: model.fuelType ?? local?.fuelType ?? null,
      imageUrl: local?.imageUrl ?? model.imageUrl ?? null,
      sourceUrl: model.sourceUrl ?? null,
      priceMinInr: model.priceMinInr ?? local?.priceMinInr ?? null,
      existsInLocal: Boolean(local),
    }
  }

  for (const local of localModels) {
    const key = normalizeModelKey(local.model)
    if (!metaModels[key]) {
      localOnlyModels.push(local.model)
      metaModels[key] = {
        model: local.model,
        bodyType: null,
        fuelType: local.fuelType ?? null,
        imageUrl: local.imageUrl ?? null,
        sourceUrl: null,
        priceMinInr: local.priceMinInr ?? null,
        existsInLocal: true,
      }
    }
  }

  return {
    make: brand.make,
    cardekhoBrandUrl: brand.cardekhoBrandUrl,
    totalLocalModels: localModels.length,
    totalCardekhoModels: enrichedModels.length,
    missingModels,
    localOnlyModels,
    models: metaModels,
  }
}

function buildMarkdown(brands) {
  const lines = [
    '# 4W Cardekho Coverage Audit',
    '',
    `Date: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'This file compares the current local 4W JSON model list against live current-model Cardekho brand pages.',
    'Only Cardekho products with live pricing were counted as current models.',
    '',
    '## Summary',
    '',
  ]

  const totalMissing = brands.reduce((sum, brand) => sum + (brand.missingModels?.length ?? 0), 0)
  const totalLocalOnly = brands.reduce((sum, brand) => sum + (brand.localOnlyModels?.length ?? 0), 0)

  lines.push(`- Brands audited: ${brands.length}`)
  lines.push(`- Cardekho current models captured: ${brands.reduce((sum, brand) => sum + (brand.totalCardekhoModels ?? 0), 0)}`)
  lines.push(`- Missing locally but present on Cardekho: ${totalMissing}`)
  lines.push(`- Present locally but not found in current Cardekho list: ${totalLocalOnly}`)
  lines.push('')

  for (const brand of brands) {
    lines.push(`## ${brand.make}`)
    lines.push('')
    lines.push(`- Local models: ${brand.totalLocalModels}`)
    lines.push(`- Cardekho current models: ${brand.totalCardekhoModels}`)
    lines.push(`- Missing locally: ${brand.missingModels.length ? brand.missingModels.join(', ') : 'None'}`)
    lines.push(`- Local-only models: ${brand.localOnlyModels.length ? brand.localOnlyModels.join(', ') : 'None'}`)
    lines.push('')
  }

  return `${lines.join('\n')}\n`
}

async function main() {
  const brandAudits = []
  for (const brand of FOUR_W_BRANDS) {
    try {
      console.log(`Auditing ${brand.make}...`)
      brandAudits.push(await buildBrandAudit(brand))
    } catch (error) {
      console.error(`Failed ${brand.make}:`, error instanceof Error ? error.message : error)
    }
  }

  const output = {
    meta: {
      generatedAt: new Date().toISOString(),
      brandsAudited: brandAudits.length,
      currentModelCount: brandAudits.reduce((sum, brand) => sum + (brand.totalCardekhoModels ?? 0), 0),
    },
    brands: Object.fromEntries(
      brandAudits.map((brand) => [
        normalizeMakeKey(brand.make),
        {
          make: brand.make,
          cardekhoBrandUrl: brand.cardekhoBrandUrl,
          totalLocalModels: brand.totalLocalModels,
          totalCardekhoModels: brand.totalCardekhoModels,
          missingModels: brand.missingModels,
          localOnlyModels: brand.localOnlyModels,
          models: brand.models,
        },
      ]),
    ),
  }

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true })
  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(output, null, 2)}\n`)
  fs.writeFileSync(OUTPUT_MD, buildMarkdown(brandAudits))

  console.log(`Wrote ${OUTPUT_JSON}`)
  console.log(`Wrote ${OUTPUT_MD}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
