#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { readFileSync } from 'fs'

const ROOT = '/Users/anilkumarkolukulapalli/projects/cyepro/dealersite pro/dealer-site-pro'
const PUBLIC_DIR = path.join(ROOT, 'public')
const DATA_DIR = path.join(PUBLIC_DIR, 'data')
const GENERATED_4W_META_PATH = path.join(ROOT, 'lib', 'data', 'generated', '4w-cardekho-meta.json')
const FOUR_W_DIR = path.join(DATA_DIR, 'brand-model-images', '4w-galleries')
const TWO_W_COLOR_DIR = path.join(DATA_DIR, 'brand-model-images', '2w-colors')

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeUrl(url) {
  return String(url || '')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
    .replace(/\?tr=[^"' )]+/g, '')
    .trim()
}

function absolutizeCardekhoImageUrl(url) {
  const normalized = normalizeUrl(url)
  if (!normalized) return ''
  if (normalized.startsWith('https://')) return normalized
  if (normalized.startsWith('//')) return `https:${normalized}`
  if (
    normalized.startsWith('car-images/') ||
    normalized.startsWith('carexteriorimages/') ||
    normalized.startsWith('carinteriorimages/')
  ) {
    return `https://stimg.cardekho.com/images/${normalized}`
  }
  return normalized
}

function normalizeLoose(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function uniqueUrls(values) {
  const seen = new Set()
  const output = []
  for (const value of values) {
    const normalized = absolutizeCardekhoImageUrl(value)
    if (!normalized.startsWith('https://')) continue
    if (seen.has(normalized)) continue
    seen.add(normalized)
    output.push(normalized)
  }
  return output
}

function canonicalImageKey(url) {
  const normalized = normalizeUrl(url)
  if (!normalized.startsWith('https://')) return ''

  try {
    const parsed = new URL(normalized)
    const segments = parsed.pathname
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.toLowerCase())

    const categoryIndex = segments.findIndex((segment) =>
      segment === 'carexteriorimages' ||
      segment === 'carinteriorimages' ||
      segment === 'car-images'
    )

    if (categoryIndex >= 0) {
      const relevantSegments = segments.slice(categoryIndex + 1)
      const filteredSegments = relevantSegments.filter((segment, index) => {
        if (index === 0 && /^\d+x\d+$/.test(segment)) return false
        return true
      })
      if (filteredSegments.length > 0) {
        return filteredSegments.join('/')
      }
    }

    return `${parsed.hostname.toLowerCase()}${parsed.pathname.toLowerCase()}`
  } catch {
    return normalized.toLowerCase()
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      'accept-language': 'en-IN,en;q=0.9',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }

  return response.text()
}

async function fetchTextWithStatus(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      'accept-language': 'en-IN,en;q=0.9',
    },
  })

  return {
    ok: response.ok,
    status: response.status,
    text: await response.text(),
  }
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      'accept-language': 'en-IN,en;q=0.9',
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }

  const contentType = response.headers.get('content-type') || ''
  const arrayBuffer = await response.arrayBuffer()
  return {
    contentType,
    buffer: Buffer.from(arrayBuffer),
  }
}

function buildImageFallbackUrls(url) {
  const values = [url]
  const withoutQuery = url.split('?')[0]
  if (withoutQuery.endsWith('.webp')) {
    values.push(url.replace(/\.webp(\?|$)/i, '.jpg$1'))
    values.push(url.replace(/\.webp(\?|$)/i, '.jpeg$1'))
    values.push(url.replace(/\.webp(\?|$)/i, '.png$1'))
  }
  return Array.from(new Set(values))
}

function inferExtension(url, contentType = '') {
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.includes('.png') || contentType.includes('png')) return 'png'
  if (lowerUrl.includes('.webp') || contentType.includes('webp')) return 'webp'
  if (lowerUrl.includes('.avif') || contentType.includes('avif')) return 'avif'
  return 'jpg'
}

function extractUrls(html, folder) {
  const pattern = new RegExp(`https?:\\\\?/\\\\?/stimg\\.cardekho\\.com\\\\?/images\\\\?/${folder}[^"'\\s<)]+`, 'gi')
  return uniqueUrls(Array.from(html.matchAll(pattern), (match) => match[0]))
}

function extractColorImages(html) {
  const pattern = /(?:https?:\\?\/\\?\/stimg\.cardekho\.com\\?\/images\\?\/)?car-images[^"'\\s<)]+?\.(?:jpe?g|png|webp|avif)(?:\?[^"'\\s<)]*)?/gi
  return uniqueUrls(Array.from(html.matchAll(pattern), (match) => match[0]))
}

function extractColorPairsFromHtml(html) {
  const pattern = /"src":"((?:https?:\\?\/\\?\/stimg\.cardekho\.com\\?\/images\\?\/)?car-images[^"]+)","title":"([^"]+)"/gi
  const output = []
  const seen = new Set()

  for (const match of html.matchAll(pattern)) {
    const image = absolutizeCardekhoImageUrl(match[1])
    const name = String(match[2] || '').trim()
    if (!image || !name) continue
    const key = `${name.toLowerCase()}|${image}`
    if (seen.has(key)) continue
    seen.add(key)
    output.push({ name, image })
  }

  return output
}

function extractJsonValueFromHtml(html, key) {
  const needle = `"${key}":`
  const start = html.indexOf(needle)
  if (start < 0) return null

  let index = start + needle.length
  while (index < html.length && /\s/.test(html[index])) index += 1

  const openChar = html[index]
  const closeChar = openChar === '[' ? ']' : openChar === '{' ? '}' : ''
  if (!closeChar) return null

  let depth = 0
  let inString = false
  let escaped = false
  let value = ''

  for (; index < html.length; index += 1) {
    const char = html[index]
    value += char

    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
      continue
    }

    if (char === openChar) {
      depth += 1
      continue
    }

    if (char === closeChar) {
      depth -= 1
      if (depth === 0) {
        return value
      }
    }
  }

  return null
}

function extract4WGalleryPopup(html) {
  const raw = extractJsonValueFromHtml(html, 'galleryPopup')
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function extract4WGalleryPopupBuckets(html) {
  const galleryPopup = extract4WGalleryPopup(html)
  if (!galleryPopup) {
    return { colors: [] }
  }

  const colors = []

  for (const section of galleryPopup) {
    const sectionValue = String(section?.value || '').toLowerCase()
    const sectionLists = Array.isArray(section?.list) ? section.list : []

    if (sectionValue === 'colours') {
      for (const image of sectionLists) {
        if (typeof image?.src === 'string' && typeof image?.title === 'string') {
          colors.push({ name: image.title, image: image.src })
        }
      }
    }
  }

  return {
    colors: dedupeColorPairs(
      colors.map((entry) => entry.name),
      colors.map((entry) => entry.image)
    ),
  }
}

function buildModelLooseCandidates(brandSlug, modelSlug) {
  const candidates = new Set()
  const brandLoose = normalizeLoose(brandSlug)
  const rawModel = String(modelSlug || '')
  const rawModelLoose = normalizeLoose(rawModel)
  const aliasMap = {
    'bmw|3serieslongwheelbase': ['3seriesgranlimousine'],
    'volkswagen|tiguanrline': ['tiguan2025', 'tiguan'],
    'honda|amaze2ndgen': ['amaze'],
    'mini|cooperconvertible': ['convertible', 'cooperconvertible'],
    'mercedesbenz|maybacheqssuv': ['maybacheqs'],
  }

  if (rawModelLoose) candidates.add(rawModelLoose)

  const strippedBrand = rawModel
    .replace(new RegExp(`^${String(brandSlug).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[_-]?`, 'i'), '')
    .trim()
  const strippedBrandLoose = normalizeLoose(strippedBrand)
  if (strippedBrandLoose) candidates.add(strippedBrandLoose)

  const underscoreTail = rawModel.includes('_') ? rawModel.split('_').slice(1).join('_') : ''
  const underscoreTailLoose = normalizeLoose(underscoreTail)
  if (underscoreTailLoose) candidates.add(underscoreTailLoose)

  if (brandLoose && rawModelLoose.startsWith(brandLoose)) {
    candidates.add(rawModelLoose.slice(brandLoose.length))
  }

  const manualAliases = aliasMap[`${brandLoose}|${rawModelLoose}`] || []
  for (const alias of manualAliases) {
    const aliasLoose = normalizeLoose(alias)
    if (aliasLoose) candidates.add(aliasLoose)
  }

  return Array.from(candidates).filter(Boolean)
}

function filterUrlsForModel(values, brandSlug, modelSlug) {
  const brandLoose = normalizeLoose(brandSlug)
  const modelCandidates = buildModelLooseCandidates(brandSlug, modelSlug)

  return uniqueUrls(values).filter((value) => {
    const loose = normalizeLoose(value)
    return loose.includes(brandLoose) && modelCandidates.some((candidate) => loose.includes(candidate))
  })
}

function filterColorPairsForModel(values, brandSlug, modelSlug) {
  const brandLoose = normalizeLoose(brandSlug)
  const modelCandidates = buildModelLooseCandidates(brandSlug, modelSlug)

  return values.filter((entry) => {
    const loose = normalizeLoose(entry.image)
    return loose.includes(brandLoose) && modelCandidates.some((candidate) => loose.includes(candidate))
  })
}

function extractLdJsonBlocks(html) {
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) ?? []
  return blocks
    .map((block) => block.replace(/^<script type="application\/ld\+json">/i, '').replace(/<\/script>$/i, '').trim())
    .filter(Boolean)
}

function extractColorNamesFromLdJson(html) {
  const names = new Set()
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

function extractTwoWJsonLdColorGallery(html) {
  const blocks = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) ?? []
  for (const block of blocks) {
    const raw = block.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '').trim()
    try {
      const parsed = JSON.parse(raw)
      const items = Array.isArray(parsed) ? parsed : [parsed]
      for (const item of items) {
        if (item?.['@type'] !== 'ImageGallery') continue
        const media = Array.isArray(item.associatedMedia) ? item.associatedMedia : []
        const colors = media
          .map((entry) => ({
            name: String(entry?.caption ?? '').trim(),
            image: String(entry?.contentUrl ?? '').trim(),
          }))
          .filter((entry) => entry.name && entry.image)

        if (colors.length > 0) {
          return {
            hero: typeof item.primaryImageOfPage?.contentUrl === 'string' ? item.primaryImageOfPage.contentUrl : null,
            colors,
          }
        }
      }
    } catch {
      continue
    }
  }
  return null
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function saveDownloadedImage(url, destWithoutExt) {
  let lastError = null
  for (const candidate of buildImageFallbackUrls(url)) {
    try {
      const { buffer, contentType } = await fetchBuffer(candidate)
      const extension = inferExtension(candidate, contentType)
      const finalPath = `${destWithoutExt}.${extension}`
      await ensureDir(path.dirname(finalPath))
      await fs.writeFile(finalPath, buffer)
      return path.basename(finalPath)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError ?? new Error(`Failed to download ${url}`)
}

function selectUniqueBucket(values, limit, sharedSeen) {
  const output = []
  const localSeen = new Set()

  for (const value of values) {
    const normalized = normalizeUrl(value)
    if (!normalized.startsWith('https://')) continue

    const canonicalKey = canonicalImageKey(normalized)
    const looseKey = normalized.toLowerCase()
    const key = canonicalKey || looseKey

    if (localSeen.has(key)) continue
    if (sharedSeen.has(key)) continue

    localSeen.add(key)
    sharedSeen.add(key)
    output.push(normalized)

    if (limit && output.length >= limit) break
  }

  return output
}

function dedupeColorPairs(names, images) {
  const output = []
  const seen = new Set()
  const max = Math.max(names.length, images.length)
  for (let index = 0; index < max; index += 1) {
    const name = String(names[index] ?? '').trim()
    const image = String(images[index] ?? '').trim()
    const key = `${name.toLowerCase()}|${normalizeUrl(image)}`
    if (!name || !image || seen.has(key)) continue
    seen.add(key)
    output.push({ name, image })
  }
  return output
}

function guessColorNameFromImageUrl(url) {
  try {
    const parsed = new URL(normalizeUrl(url))
    const filename = decodeURIComponent(parsed.pathname.split('/').pop() || '')
      .replace(/\.[a-z0-9]+$/i, '')
      .trim()

    if (!filename) return ''

    const parts = filename.split('_').filter(Boolean)
    const trimmedParts = parts.filter((part, index) => {
      if (index === 0 && /^\d+$/.test(part)) return false
      if (index === parts.length - 1 && /^[a-f0-9]{3,}$/i.test(part)) return false
      return true
    })

    const value = trimmedParts.join(' ')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!value) return ''

    return value
      .split(' ')
      .map((part) => part ? part[0].toUpperCase() + part.slice(1) : '')
      .join(' ')
      .trim()
  } catch {
    return ''
  }
}

function deriveColorPairsFromImages(images) {
  return uniqueUrls(images)
    .map((image) => ({
      name: guessColorNameFromImageUrl(image),
      image,
    }))
    .filter((entry) => entry.name && entry.image)
}

function selectUniqueColorPairs(values, sharedSeen) {
  const output = []
  const localSeen = new Set()

  for (const entry of values) {
    const name = String(entry?.name ?? '').trim()
    const image = absolutizeCardekhoImageUrl(entry?.image)
    if (!name || !image.startsWith('https://')) continue

    const imageKey = canonicalImageKey(image) || image.toLowerCase()
    const pairKey = name.toLowerCase()

    if (localSeen.has(pairKey)) continue
    if (sharedSeen.has(imageKey)) continue

    localSeen.add(pairKey)
    sharedSeen.add(imageKey)
    output.push({ name, image })
  }

  return output
}

function normalize4WSourceUrl(make, model, sourceUrl) {
  const manualMap = {
    'audi|a6': 'https://www.cardekho.com/carmodels/Audi/Audi_A6',
    'bmw|m4': 'https://www.cardekho.com/bmw/m4-competition',
    'bmw|m8': 'https://www.cardekho.com/bmw/m8-coupe-competition',
    'bmw|6 series gt': 'https://www.cardekho.com/carmodels/BMW/BMW_6_Series',
    'bmw|8 series gran coupe': 'https://www.cardekho.com/bmw/8-series',
    'bmw|3 series': 'https://www.cardekho.com/BMW/BMW_3_Series',
    'bmw|m8 coupe competition': 'https://www.cardekho.com/bmw/m8-coupe-competition',
    'bmw|x5 m competition': 'https://www.cardekho.com/bmw/x5-m',
    'hyundai|creta ev': 'https://www.cardekho.com/hyundai/creta-electric',
    'toyota|fortuner': 'https://www.cardekho.com/Toyota/Toyota_Fortuner',
    'toyota|rumion': 'https://www.cardekho.com/Toyota/Toyota_Rumion',
    'volkswagen|tayron r-line': 'https://www.cardekho.com/volkswagen/tayron-r-line',
    'tata motors|altroz': 'https://www.cardekho.com/tata/altroz',
    'tata motors|curvv ev': 'https://www.cardekho.com/tata/curvv-ev',
    'tata motors|punch': 'https://www.cardekho.com/tata/punch',
    'tata motors|harrier': 'https://www.cardekho.com/tata/harrier',
    'tata motors|tiago': 'https://www.cardekho.com/tata/tiago',
    'tata motors|tigor': 'https://www.cardekho.com/tata/tigor',
    'tata motors|tigor ev': 'https://www.cardekho.com/tata/tigor-ev',
    'tata motors|sierra': 'https://www.cardekho.com/tata/sierra',
    'tata motors|nexon': 'https://www.cardekho.com/tata/nexon',
    'tata motors|nexon ev': 'https://www.cardekho.com/tata/nexon-ev',
    'tata motors|safari': 'https://www.cardekho.com/tata/safari',
    'tata motors|curvv': 'https://www.cardekho.com/tata/curvv',
    'tata motors|tiago ev': 'https://www.cardekho.com/tata/tiago-ev',
    'tata motors|punch ev': 'https://www.cardekho.com/tata/punch-ev',
    'tata motors|harrier ev': 'https://www.cardekho.com/tata/harrier-ev',
    'tata motors|xpres-t ev': 'https://www.cardekho.com/tata/xpres-t-ev',
    'tata motors|tiago nrg': 'https://www.cardekho.com/tata/tiago-nrg',
    'tata motors|xpres': 'https://www.cardekho.com/tata/xpres',
    'tata motors|yodha pickup': 'https://www.cardekho.com/tata/yodha-pickup',
  }
  const manualKey = `${String(make).toLowerCase()}|${String(model).toLowerCase()}`
  if (manualMap[manualKey]) return manualMap[manualKey]

  const fallbackBrandSlug = slugify(make)
  const fallbackModelSlug = slugify(model)

  try {
    const url = new URL(sourceUrl)
    const segments = url.pathname.split('/').filter(Boolean)

    if (segments[0] === 'carmodels') {
      const rawBrand = segments[1] || ''
      const rawModel = segments[2] || ''

      if (rawBrand && rawModel) {
        const brandSlug = slugify(rawBrand)
        const modelSlug = slugify(
          rawModel
            .replace(new RegExp(`^${rawBrand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_?`, 'i'), '')
            .replace(/_/g, ' ')
        )

        if (brandSlug && modelSlug) {
          return `https://www.cardekho.com/${brandSlug}/${modelSlug}`
        }
      }

      return `https://www.cardekho.com/${fallbackBrandSlug}/${fallbackModelSlug}`
    }

    if (segments.length >= 2 && segments[0] !== 'overview' && segments[0] !== 'cars') {
      const [brandSlug, modelSlug] = segments
      return `https://www.cardekho.com/${brandSlug}/${modelSlug}`
    }

    if (segments[0] === 'overview' && segments[1]) {
      const raw = segments[1]
      const rawParts = raw.split('_').filter(Boolean)
      if (rawParts.length >= 2) {
        const brandSlug = slugify(rawParts[0])
        const modelSlug = slugify(rawParts.slice(1).join(' '))
        return `https://www.cardekho.com/${brandSlug}/${modelSlug}`
      }
    }

    return `https://www.cardekho.com/${fallbackBrandSlug}/${fallbackModelSlug}`
  } catch {
    return `https://www.cardekho.com/${fallbackBrandSlug}/${fallbackModelSlug}`
  }
}

function gather4WFallbackModels() {
  const makeToJson = {
    'aston martin': 'aston_martin',
    audi: 'audi',
    bentley: 'bentley',
    bmw: 'bmw',
    byd: 'byd',
    citroen: 'citroen',
    ferrari: 'ferrari',
    'force motors': 'force',
    force: 'force',
    honda: 'honda',
    hyundai: 'hyundai',
    isuzu: 'isuzu',
    jaguar: 'jaguar',
    jeep: 'jeep',
    kia: 'kia',
    lamborghini: 'lamborghini',
    'land rover': 'land_rover',
    lexus: 'lexus',
    mahindra: 'mahindra',
    'maruti suzuki': 'maruti_suzuki',
    maruti: 'maruti_suzuki',
    'mercedes-benz': 'mercedes',
    mercedes: 'mercedes',
    mg: 'mg',
    'mg motor': 'mg',
    mini: 'mini',
    nissan: 'nissan',
    porsche: 'porsche',
    renault: 'renault',
    'rolls-royce': 'rolls_royce',
    'rolls royce': 'rolls_royce',
    skoda: 'skoda',
    'tata motors': 'tata',
    tata: 'tata',
    toyota: 'toyota',
    vinfast: 'vinfast',
    volkswagen: 'volkswagen',
    volvo: 'volvo',
  }

  const output = []
  const seen = new Set()

  function walk(node, ctxModel = null, make = '') {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      for (const item of node) walk(item, ctxModel, make)
      return
    }

    const model = node.model || node.model_name || ctxModel
    const sourceUrl = String(node.model_citation ?? node.source_url ?? '').trim()
    if (model && sourceUrl && sourceUrl.startsWith('http')) {
      const normalizedSourceUrl = normalize4WSourceUrl(make, String(model).trim(), sourceUrl)
      const key = `${make}|${String(model).trim().toLowerCase()}|${normalizedSourceUrl}`
      if (!seen.has(key)) {
        seen.add(key)
        output.push({
          make,
          model: String(model).trim(),
          sourceUrl: normalizedSourceUrl,
        })
      }
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === 'image_urls') continue
      walk(value, model, make)
    }
  }

  for (const [make, jsonKey] of Object.entries(makeToJson)) {
    const filePath = path.join(DATA_DIR, `${jsonKey}.json`)
    const raw = JSON.parse(readFileSync(filePath, 'utf8'))
    walk(raw, null, make)
  }

  return output
}

function gather4WModelsFromGeneratedMeta() {
  const raw = JSON.parse(readFileSync(GENERATED_4W_META_PATH, 'utf8'))
  const brands = raw?.brands && typeof raw.brands === 'object' ? raw.brands : {}
  const output = []
  const seen = new Set()

  for (const [brandKey, brandEntry] of Object.entries(brands)) {
    const make = String(brandEntry?.make || brandKey || '').trim()
    const models = brandEntry?.models && typeof brandEntry.models === 'object' ? brandEntry.models : {}

    for (const modelEntry of Object.values(models)) {
      const model = String(modelEntry?.model || '').trim()
      const sourceUrl = String(modelEntry?.sourceUrl || '').trim()
      if (!make || !model || !sourceUrl.startsWith('http')) continue

      const normalizedSourceUrl = normalize4WSourceUrl(make, model, sourceUrl)
      const key = `${make.toLowerCase()}|${model.toLowerCase()}|${normalizedSourceUrl}`
      if (seen.has(key)) continue

      seen.add(key)
      output.push({
        make,
        model,
        sourceUrl: normalizedSourceUrl,
      })
    }
  }

  return output
}

function gather4WModels() {
  return gather4WModelsFromGeneratedMeta()
}

function gather2WModels() {
  const brandModels = JSON.parse(readFileSync(path.join(ROOT, 'lib/data/brand-models.json'), 'utf8'))
  const overrideMap = {
    'ampere-greaves': ['ampere-bikes'],
    'ather-energy': ['ather-bikes'],
    'bajaj-auto': ['bajaj-bikes'],
    'bajaj-chetak-ev': ['bajaj-bikes'],
    'bounce-infinity': ['bounce-bikes', 'bounce-infinity-bikes'],
    'bmw-motorrad-india': ['bmwmotorrad-bikes', 'bmw-bikes'],
    'cfmoto-india': ['cfmoto-bikes'],
    'harley-davidson-india': ['harleydavidson-bikes', 'harley-davidson-bikes'],
    'hero-electric': ['heroelectric-bikes'],
    'hero-motocorp': ['hero-bikes'],
    honda: ['honda-bikes'],
    'honda-hmsi': ['honda-bikes'],
    'joy-e-bike': ['joyebike-bikes', 'joy-e-bike-bikes'],
    'keeway-india': ['keeway-bikes'],
    'kinetic-green': ['kinetic-bikes', 'kinetic-green-bikes'],
    'moto-guzzi': ['motoguzzi-bikes', 'moto-guzzi-bikes'],
    'odysse-electric': ['odysse-bikes', 'odysse-electric-bikes'],
    'ola-electric': ['olaelectric-bikes', 'ola-bikes'],
    'okinawa-autotech': ['okinawa-bikes'],
    'okaya-ev-opg-mobility': ['opg-mobility-bikes', 'okaya-ev-bikes'],
    'pure-ev': ['pureev-bikes', 'pure-ev-bikes'],
    'qj-motor-india': ['qjmotor-bikes'],
    'raptee-hv': ['raptee-bikes', 'raptee-hv-bikes'],
    'revolt-motors': ['revolt-bikes', 'revolt-motors-bikes'],
    'royal-enfield': ['royalenfield-bikes'],
    'suzuki-motorcycle': ['suzuki-bikes'],
    'triumph-india': ['triumph-bikes'],
    'tvs-iqube': ['tvs-bikes'],
    'tvs-motor': ['tvs-bikes'],
    'vida-hero': ['vida-bikes'],
    'yamaha-india': ['yamaha-bikes'],
    'yezdi-motorcycles': ['yezdi-bikes'],
  }

  const brandNameToIdMap = {
    'royal enfield': 'royal-enfield',
    'hero motocorp': 'hero-motocorp',
    'honda motorcycle & scooter india': 'honda-hmsi',
    honda: 'honda-hmsi',
    'tvs motor company': 'tvs-motor',
    tvs: 'tvs-motor',
    'bajaj auto': 'bajaj-auto',
    bajaj: 'bajaj-auto',
    'yamaha india': 'yamaha-india',
    yamaha: 'yamaha-india',
    'suzuki motorcycle india': 'suzuki-motorcycle',
    suzuki: 'suzuki-motorcycle',
    'ktm india': 'ktm-india',
    ktm: 'ktm-india',
    'kawasaki india': 'kawasaki-india',
    kawasaki: 'kawasaki-india',
    'ather energy': 'ather-energy',
    ather: 'ather-energy',
    'moto guzzi': 'moto-guzzi',
    'bajaj chetak': 'bajaj-chetak-ev',
    'bounce infinity': 'bounce-infinity',
    'ola electric': 'ola-electric',
    'hero electric': 'hero-electric',
    'harley-davidson india': 'harley-davidson-india',
    'moto guzzi': 'moto-guzzi',
    'bajaj chetak': 'bajaj-chetak-ev',
    'revolt motors': 'revolt-motors',
    'ampere (greaves electric)': 'ampere-greaves',
    komaki: 'komaki',
    'joy e-bike': 'joy-e-bike',
    'bounce infinity': 'bounce-infinity',
    'battre electric': 'battre-electric',
    'pure ev': 'pure-ev',
    'okaya ev (opg mobility)': 'okaya-ev-opg-mobility',
    'lectrix ev': 'lectrix-ev',
    yulu: 'yulu',
    'kabira mobility': 'kabira-mobility',
    'kinetic green': 'kinetic-green',
    'raptee hv': 'raptee-hv',
    'tork motors': 'tork-motors',
    'triumph motorcycles': 'triumph-india',
    'vespa india': 'vespa-india',
    vespa: 'vespa-india',
    'vida (hero motocorp)': 'vida-hero',
    vida: 'vida-hero',
  }

  const allBrands = [...brandModels.twoWheelers.traditional, ...brandModels.twoWheelers.electric]
  const output = []

  function buildMakeSlugs(brandId) {
    const reduced = brandId
      .replace(/-india$/i, '')
      .replace(/-motorcycles?$/i, '')
      .replace(/-motocorp$/i, '')
      .replace(/-motors$/i, '')
      .replace(/-motor$/i, '')
      .replace(/-auto$/i, '')
      .replace(/-automotive$/i, '')
      .replace(/-electric$/i, '')
      .replace(/-ev$/i, '')
      .replace(/-opg-mobility$/i, '')

    return Array.from(
      new Set([
        ...(overrideMap[brandId] || []),
        `${brandId}-bikes`,
        `${reduced}-bikes`,
      ])
    ).filter(Boolean)
  }

  for (const brand of allBrands) {
    const brandId = brandNameToIdMap[String(brand.brand).toLowerCase().trim()] || slugify(brand.brand)
    const makeSlugs = buildMakeSlugs(brandId)
    const models = typeof brand.models === 'object' && !Array.isArray(brand.models)
      ? Object.values(brand.models).flat()
      : (brand.models || [])

    for (const model of models) {
      output.push({
        brand: brand.brand,
        brandId,
        makeSlugs,
        model,
      })
    }
  }

  return output
}

function extractBikeWaleModelSlugs(html, makeSlug) {
  const escaped = makeSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(`https?:\\\\?/\\\\?/www\\.bikewale\\.com\\\\?/${escaped}\\\\?/([^/"?#]+)`, 'gi'),
    new RegExp(`href=["']/${escaped}/([^/"?#]+)`, 'gi'),
  ]

  const output = new Set()
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const value = String(match[1] || '').trim().replace(/\/$/, '')
      if (!value || value === 'news' || value === 'videos') continue
      output.add(value)
    }
  }

  return Array.from(output)
}

function scoreBikeWaleModelSlug(model, slug) {
  const modelNorm = normalizeLoose(model)
  const slugNorm = normalizeLoose(slug)
  let score = 0

  if (modelNorm === slugNorm) score += 100
  if (modelNorm.includes(slugNorm) || slugNorm.includes(modelNorm)) score += 50
  if (modelNorm.replace(/0+$/g, '') === slugNorm.replace(/0+$/g, '')) score += 25

  const modelTokens = String(model).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  const slugTokens = String(slug).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  for (const token of modelTokens) {
    if (slugTokens.includes(token)) score += token.length >= 3 ? 10 : 4
  }

  return score
}

function getTwoWModelSlugCandidates(modelEntry) {
  const base = slugify(modelEntry.model)
  const normalizedBrand = String(modelEntry.brand).toLowerCase()
  const candidates = [base]

  const aliasMap = {
    'harley-davidson india|nightster special': ['nightster-special'],
    'harley-davidson india|sportster s': ['sportster-s'],
    'harley-davidson india|breakout': ['breakout'],
    'harley-davidson india|road glide': ['road-glide'],
    'harley-davidson india|pan america 1250 special': ['pan-america-1250-special'],
    'harley-davidson india|x440': ['x440'],
    'moto guzzi|v85 tt': ['v85-tt'],
    'bajaj chetak|chetak': ['chetak'],
    'bajaj chetak|chetak c25': ['chetak-c2501'],
    'revolt motors|rv400': ['rv400'],
    'revolt motors|rv400 brz': ['rv400'],
    'revolt motors|rv1': ['rv1'],
    'revolt motors|rv blazex': ['rv-blazex'],
    'ampere (greaves electric)|nexus': ['nexus-ex', 'nexus-st', 'nexus'],
    'ampere (greaves electric)|magnus': ['magnus'],
    'ampere (greaves electric)|magnus grand': ['magnus-grand'],
    'ampere (greaves electric)|reo': ['reo', 'reo-80'],
    'bgauss|c12i ex': ['c12i'],
    'bajaj auto|pulsar ns200': ['pulsar-ns', 'pulsar-ns200'],
    'joy e-bike|gen nxt': ['gen-nxt'],
    'joy e-bike|wolf': ['wolf'],
    'joy e-bike|glob': ['glob'],
    'joy e-bike|mihos': ['mihos'],
    'kinetic green|dx': ['dx', 'kinetic-dx'],
    'matter|aera 5000': ['aera'],
    'moto guzzi|v85 tt': ['v85-tt'],
    'bounce infinity|e1': ['infinity-e1'],
    'pure ev|epluto 7g': ['epluto-7g'],
    'pure ev|etryst 350': ['etryst-350'],
    'pure ev|ecodryft': ['ecodryft'],
    'pure ev|etrance neo': ['etrance-neo'],
    'odysse electric|e2go': ['e2go'],
    'raptee hv|t30': ['t30'],
    'revolt motors|rv400': ['rv400', 'rv-400'],
    'bajaj chetak|chetak': ['chetak'],
    'bajaj chetak|chetak c25': ['chetak-c2501'],
    'okaya ev (opg mobility)|faast f4': ['faast'],
    'tvs motor company|apache rtr 160': ['apache-rtr-160', 'apache-160'],
    'vida (hero motocorp)|vx2 go': ['vx2'],
    'yamaha india|fz-s fi': ['fz-s'],
  }

  const key = `${normalizedBrand}|${String(modelEntry.model).toLowerCase()}`
  if (aliasMap[key]) candidates.push(...aliasMap[key])

  return Array.from(new Set(candidates.filter(Boolean)))
}

async function resolveTwoWColorsUrl(modelEntry) {
  const attempted = []
  const directModelSlugs = getTwoWModelSlugCandidates(modelEntry)

  for (const makeSlug of modelEntry.makeSlugs) {
    for (const directModelSlug of directModelSlugs) {
      const directUrl = `https://www.bikewale.com/${makeSlug}/${directModelSlug}/colours/`
      attempted.push(directUrl)
      const direct = await fetchTextWithStatus(directUrl)
      if (direct.ok) {
        return {
          html: direct.text,
          colorsUrl: directUrl,
          makeSlug,
          modelSlug: directModelSlug,
        }
      }

      if (direct.status !== 404 && direct.status !== 410) continue
    }

    const brandPage = await fetchTextWithStatus(`https://www.bikewale.com/${makeSlug}/`).catch(() => null)
    if (!brandPage?.ok) continue

    const bestSlug = extractBikeWaleModelSlugs(brandPage.text, makeSlug)
      .map((slug) => ({ slug, score: scoreBikeWaleModelSlug(modelEntry.model, slug) }))
      .sort((a, b) => b.score - a.score)[0]

    if (!bestSlug || bestSlug.score < 20) continue

    const resolvedUrl = `https://www.bikewale.com/${makeSlug}/${bestSlug.slug}/colours/`
    attempted.push(resolvedUrl)
    const resolved = await fetchTextWithStatus(resolvedUrl)
    if (resolved.ok) {
      return {
        html: resolved.text,
        colorsUrl: resolvedUrl,
        makeSlug,
        modelSlug: bestSlug.slug,
      }
    }
  }

  throw new Error(`No BikeWale colours page found. Tried: ${attempted.slice(0, 6).join(', ')}`)
}

async function scrape4WOne(modelEntry) {
  const url = new URL(modelEntry.sourceUrl)
  const segments = url.pathname.split('/').filter(Boolean)
  const [brandSlug, modelSlug] = segments[0]?.toLowerCase() === 'carmodels'
    ? [segments[1], segments[2]]
    : [segments[0], segments[1]]
  if (!brandSlug || !modelSlug) {
    throw new Error(`Could not parse source URL: ${modelEntry.sourceUrl}`)
  }

  const makeKey = String(modelEntry.make || '').trim().toLowerCase()
  const modelKey = String(modelEntry.model || '').trim().toLowerCase()
  const overrideColorPageMap = {
    'audi|a6': 'https://www.cardekho.com/audi/audi-a6-colors.html',
    'mini|cooper convertible': 'https://www.cardekho.com/mini/mini-cooper-convertible-2015-2023-colors.html',
    'mercedes-benz|v-class extra lwb': 'https://www.cardekho.com/mercedes-benz/v-class-2019-2022/colors',
  }

  const picturesUrl = `${modelEntry.sourceUrl.replace(/\/$/, '')}/pictures`
  const colorsUrl = overrideColorPageMap[`${makeKey}|${modelKey}`] || `${modelEntry.sourceUrl.replace(/\/$/, '')}/colors`

  const [picturesHtml, colorsHtml] = await Promise.all([
    fetchText(picturesUrl),
    fetchText(colorsUrl).catch(() => ''),
  ])
  const popupBuckets = extract4WGalleryPopupBuckets(picturesHtml)

  const sharedImageKeys = new Set()
  const colorPairs = selectUniqueColorPairs(
    filterColorPairsForModel(
      [
        ...popupBuckets.colors,
        ...extractColorPairsFromHtml(picturesHtml),
        ...dedupeColorPairs(
          extractColorNamesFromLdJson(colorsHtml || picturesHtml),
          [...extractColorImages(colorsHtml), ...extractColorImages(picturesHtml)]
        ),
        ...deriveColorPairsFromImages([
          ...extractColorImages(colorsHtml),
          ...extractColorImages(picturesHtml),
        ]),
      ],
      brandSlug,
      modelSlug
    ),
    sharedImageKeys
  )

  const brandDir = slugify(modelEntry.make || brandSlug)
  const modelDir = slugify(modelEntry.model || modelSlug)
  const destDir = path.join(FOUR_W_DIR, brandDir, modelDir)
  await ensureDir(destDir)

  const saved = {
    colors: [],
  }

  for (let index = 0; index < colorPairs.length; index += 1) {
    const colorSlug = slugify(colorPairs[index].name) || `color-${index + 1}`
    try {
      const file = await saveDownloadedImage(colorPairs[index].image, path.join(destDir, 'colors', colorSlug))
      saved.colors.push({
        name: colorPairs[index].name,
        file,
        source: colorPairs[index].image,
      })
    } catch {
      continue
    }
  }

  if (saved.colors.length === 0) {
    throw new Error(`No color images downloaded for ${modelEntry.make} ${modelEntry.model}`)
  }

  const metadata = {
    make: modelEntry.make,
    model: modelEntry.model,
    brandSlug,
    modelSlug,
    sourceUrl: modelEntry.sourceUrl,
    scrapedAt: new Date().toISOString(),
    mode: 'colors-only',
    counts: {
      colors: saved.colors.length,
      total: saved.colors.length,
    },
    hero: saved.colors[0] ? `/data/brand-model-images/4w-galleries/${brandDir}/${modelDir}/colors/${saved.colors[0].file}` : null,
    colorNames: saved.colors.map((entry) => entry.name),
    colorImages: saved.colors.map((entry) => `/data/brand-model-images/4w-galleries/${brandDir}/${modelDir}/colors/${entry.file}`),
  }

  await fs.writeFile(path.join(destDir, 'metadata.json'), JSON.stringify(metadata, null, 2))
  return metadata
}

async function scrape2WOne(modelEntry) {
  const resolved = await resolveTwoWColorsUrl(modelEntry)
  const { html, colorsUrl, makeSlug, modelSlug } = resolved
  const gallery = extractTwoWJsonLdColorGallery(html)
  if (!gallery) {
    throw new Error(`No color gallery found for ${modelEntry.brand} ${modelEntry.model}`)
  }

  const destDir = path.join(TWO_W_COLOR_DIR, modelEntry.brandId, modelSlug)
  await ensureDir(destDir)

  const savedColors = []
  for (const color of gallery.colors) {
    const colorSlug = slugify(color.name)
    if (!colorSlug) continue
    try {
      const file = await saveDownloadedImage(color.image, path.join(destDir, colorSlug))
      savedColors.push({
        name: color.name,
        file,
        source: color.image,
      })
    } catch {
      continue
    }
  }

  if (savedColors.length === 0) {
    throw new Error(`No color images downloaded for ${modelEntry.brand} ${modelEntry.model}`)
  }

  const metadata = {
    brand: modelEntry.brand,
    model: modelEntry.model,
    brandId: modelEntry.brandId,
    makeSlug,
    modelSlug,
    sourceUrl: colorsUrl,
    scrapedAt: new Date().toISOString(),
    count: savedColors.length,
    hero: gallery.hero,
    colors: savedColors.map((entry) => ({
      name: entry.name,
      image: `/data/brand-model-images/2w-colors/${modelEntry.brandId}/${modelSlug}/${entry.file}`,
    })),
  }

  await fs.writeFile(path.join(destDir, 'metadata.json'), JSON.stringify(metadata, null, 2))
  return metadata
}

function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    category: 'all',
    limit: null,
    brand: '',
    model: '',
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--category') options.category = args[index + 1] || 'all'
    if (arg === '--limit') options.limit = Number(args[index + 1] || 0) || null
    if (arg === '--brand') options.brand = String(args[index + 1] || '').toLowerCase()
    if (arg === '--model') options.model = String(args[index + 1] || '').toLowerCase()
  }

  return options
}

function filterItems(items, options, brandKey = 'brand', modelKey = 'model') {
  let output = items
  if (options.brand) {
    output = output.filter((item) => String(item[brandKey]).toLowerCase().includes(options.brand))
  }
  if (options.model) {
    output = output.filter((item) => String(item[modelKey]).toLowerCase().includes(options.model))
  }
  if (options.limit) {
    output = output.slice(0, options.limit)
  }
  return output
}

async function main() {
  const options = parseArgs()
  const report = {
    fourWheelers: [],
    twoWheelers: [],
  }

  if (options.category === 'all' || options.category === '4w') {
    const models = filterItems(gather4WModels(), options, 'make', 'model')
    for (const model of models) {
      try {
        const metadata = await scrape4WOne(model)
        report.fourWheelers.push({ ok: true, make: model.make, model: model.model, colors: metadata.counts.colors })
        console.log(`4W OK  ${model.make} ${model.model} -> ${metadata.counts.colors} colors`)
      } catch (error) {
        report.fourWheelers.push({ ok: false, make: model.make, model: model.model, error: error.message })
        console.log(`4W ERR ${model.make} ${model.model} -> ${error.message}`)
      }
    }
  }

  if (options.category === 'all' || options.category === '2w') {
    const models = filterItems(gather2WModels(), options, 'brand', 'model')
    for (const model of models) {
      try {
        const metadata = await scrape2WOne(model)
        report.twoWheelers.push({ ok: true, brand: model.brand, model: model.model, count: metadata.count })
        console.log(`2W OK  ${model.brand} ${model.model} -> ${metadata.count} colors`)
      } catch (error) {
        report.twoWheelers.push({ ok: false, brand: model.brand, model: model.model, error: error.message })
        console.log(`2W ERR ${model.brand} ${model.model} -> ${error.message}`)
      }
    }
  }

  const reportDir = path.join(ROOT, 'scripts')
  const reportPath = path.join(reportDir, 'scrape_model_galleries_results.json')
  await fs.writeFile(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    options,
    report,
  }, null, 2))

  console.log(`Saved report to ${reportPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
