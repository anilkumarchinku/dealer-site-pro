#!/usr/bin/env node

import fs from 'fs/promises'
import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'

const ROOT = '/Users/anilkumarkolukulapalli/projects/cyepro/dealersite pro/dealer-site-pro'
const DATA_ROOT = path.join(ROOT, 'public', 'data')
const IMAGE_ROOT = path.join(DATA_ROOT, 'brand-model-images')
const TWO_W_COLOR_DIR = path.join(IMAGE_ROOT, '2w-colors')
const THREE_W_DIR = path.join(IMAGE_ROOT, '3w')
const FOUR_W_GALLERY_DIR = path.join(IMAGE_ROOT, '4w-galleries')

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function canonicalMake(value) {
  const normalized = String(value || '').toLowerCase().trim()
  const map = {
    force: 'force',
    'force motors': 'force',
    maruti: 'maruti suzuki',
    'maruti suzuki': 'maruti suzuki',
    mercedes: 'mercedes-benz',
    'mercedes-benz': 'mercedes-benz',
    mg: 'mg',
    'mg motor': 'mg',
    tata: 'tata',
    'tata motors': 'tata',
    'rolls royce': 'rolls-royce',
    'rolls-royce': 'rolls-royce',
  }
  return map[normalized] || normalized
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

function walkMetadata(dir) {
  const rows = []
  if (!existsSync(dir)) return rows

  const visit = (currentDir) => {
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        visit(fullPath)
        continue
      }
      if (entry.name === 'metadata.json') {
        rows.push(readJson(fullPath))
      }
    }
  }

  visit(dir)
  return rows
}

function csvEscape(value) {
  const text = String(value ?? '')
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

async function writeCsv(filePath, headers, rows) {
  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ]
  await fs.writeFile(filePath, `${lines.join('\n')}\n`)
}

const twoWBrandNameToIdMap = {
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
  'revolt motors': 'revolt-motors',
  'ampere (greaves electric)': 'ampere-greaves',
  komaki: 'komaki',
  'joy e-bike': 'joy-e-bike',
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
  matter: 'matter',
  bgauss: 'bgauss',
  'odysse electric': 'odysse-electric',
}

function getTwoWAliasSlugs(brand, model) {
  const key = `${String(brand).toLowerCase()}|${String(model).toLowerCase()}`
  const aliases = {
    'harley-davidson india|nightster special': ['nightster-special'],
    'harley-davidson india|sportster s': ['sportster-s'],
    'harley-davidson india|breakout': ['breakout'],
    'harley-davidson india|road glide': ['road-glide'],
    'harley-davidson india|pan america 1250 special': ['pan-america-1250-special'],
    'harley-davidson india|x440': ['x440'],
    'moto guzzi|v85 tt': ['v85-tt'],
    'bajaj chetak|chetak': ['chetak'],
    'bajaj chetak|chetak c25': ['chetak-c2501'],
    'revolt motors|rv400': ['rv400', 'rv-400'],
    'revolt motors|rv400 brz': ['rv400'],
    'revolt motors|rv1': ['rv1'],
    'revolt motors|rv blazex': ['rv-blazex'],
    'ampere (greaves electric)|nexus': ['nexus', 'nexus-ex', 'nexus-st'],
    'ampere (greaves electric)|magnus': ['magnus'],
    'ampere (greaves electric)|magnus grand': ['magnus-grand'],
    'ampere (greaves electric)|reo': ['reo', 'reo-80'],
    'bgauss|c12i ex': ['c12i'],
    'bgauss|c12i max': ['c12i'],
    'bajaj auto|pulsar ns200': ['pulsar-ns', 'pulsar-ns200'],
    'joy e-bike|gen nxt': ['gen-nxt'],
    'joy e-bike|wolf': ['wolf'],
    'joy e-bike|glob': ['glob'],
    'joy e-bike|mihos': ['mihos'],
    'kinetic green|dx': ['dx', 'kinetic-dx'],
    'matter|aera 5000': ['aera'],
    'matter|aera 5000+': ['aera'],
    'bounce infinity|e1': ['infinity-e1'],
    'pure ev|epluto 7g': ['epluto-7g'],
    'pure ev|etryst 350': ['etryst-350'],
    'pure ev|ecodryft': ['ecodryft'],
    'pure ev|etrance neo': ['etrance-neo'],
    'odysse electric|e2go': ['e2go'],
    'odysse electric|e2go lite': ['e2go'],
    'raptee hv|t30': ['t30'],
    'okaya ev (opg mobility)|faast f4': ['faast'],
    'tvs motor company|apache rtr 160': ['apache-rtr-160', 'apache-160', 'apache-rtr-160-4v'],
    'tvs iqube|iqube': ['iqube'],
    'tvs iqube|iqube s': ['iqube'],
    'tvs iqube|iqube st': ['iqube'],
    'tvs iqube|iqube st 5.3 kwh': ['iqube'],
    'vida (hero motocorp)|vx2 go': ['vx2'],
    'vida (hero motocorp)|vx2 plus': ['vx2'],
    'yamaha india|fz-s fi': ['fz-s'],
    'ola electric|s1 x plus': ['s1-x'],
    'ola electric|s1 pro plus': ['s1-pro'],
    'tork motors|kratos r': ['kratos'],
  }
  return Array.from(new Set([slugify(model), ...(aliases[key] || [])]))
}

const twoWUnavailable = new Set([
  'battre electric|loev',
  'battre electric|loev+',
  'battre electric|storie',
  'battre electric|one',
  'kabira mobility|km3000',
  'kabira mobility|km4000',
  'kabira mobility|km5000',
  'kabira mobility|intercity neo',
  'kabira mobility|intercity fs',
  'komaki|flora',
  'komaki|dt 3000',
  'komaki|venice',
  'komaki|se',
  'komaki|tn 95',
  'komaki|ranger',
  'komaki|xgt km',
  'komaki|x one',
  'komaki|xgt cat 2.0',
  'komaki|xgt x5',
  'odysse electric|v2',
  'odysse electric|v2 plus',
  'odysse electric|snap',
  'yulu|wynn',
  'lectrix ev|zyro',
  'bounce infinity|e1x',
])

function auditTwoW() {
  const brandModels = readJson(path.join(ROOT, 'lib', 'data', 'brand-models.json'))
  const expectedBrands = [...brandModels.twoWheelers.traditional, ...brandModels.twoWheelers.electric]
  const metadata = walkMetadata(TWO_W_COLOR_DIR)
  const metadataByBrandId = new Map()

  for (const item of metadata) {
    if (!metadataByBrandId.has(item.brandId)) metadataByBrandId.set(item.brandId, [])
    metadataByBrandId.get(item.brandId).push(item)
  }

  const rows = []

  for (const brand of expectedBrands) {
    const brandId = twoWBrandNameToIdMap[String(brand.brand).toLowerCase().trim()] || slugify(brand.brand)
    const models = typeof brand.models === 'object' && !Array.isArray(brand.models)
      ? Object.values(brand.models).flat()
      : (brand.models || [])
    const brandMetadata = metadataByBrandId.get(brandId) || []

    for (const model of models) {
      const normalizedModel = normalize(model)
      const exact = brandMetadata.find((item) => normalize(item.model) === normalizedModel)
      const aliasSlugs = getTwoWAliasSlugs(brand.brand, model)
      const alias = exact || aliasSlugs
        .map((slug) => path.join(TWO_W_COLOR_DIR, brandId, slug, 'metadata.json'))
        .find((filePath) => existsSync(filePath))

      let status = 'missing'
      let matchedSlug = ''
      let imageCount = 0
      let note = ''

      if (exact) {
        status = 'scraped_exact'
        matchedSlug = exact.modelSlug
        imageCount = exact.count || 0
      } else if (alias) {
        const aliasMeta = typeof alias === 'string' ? readJson(alias) : alias
        status = 'covered_by_alias'
        matchedSlug = aliasMeta.modelSlug
        imageCount = aliasMeta.count || 0
        note = `uses shared source model "${aliasMeta.model}"`
      } else if (twoWUnavailable.has(`${String(brand.brand).toLowerCase()}|${String(model).toLowerCase()}`)) {
        status = 'unavailable_on_source'
        note = 'no confirmed BikeWale colour page'
      }

      rows.push({
        category: '2w',
        brand: brand.brand,
        model,
        status,
        brand_id: brandId,
        matched_slug: matchedSlug,
        image_count: imageCount,
        note,
      })
    }
  }

  return rows.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model))
}

function auditThreeW() {
  const brandModels = readJson(path.join(ROOT, 'lib', 'data', 'brand-models.json'))
  const rows = []

  for (const brand of brandModels.threeWheelers || []) {
    const brandDir = path.join(THREE_W_DIR, brand.brandId)
    const files = existsSync(brandDir)
      ? readdirSync(brandDir).filter((file) => statSync(path.join(brandDir, file)).isFile())
      : []

    const models = Object.values(brand.models || {}).flat()
    for (const model of models) {
      const modelSlug = slugify(model)
      const match = files.find((file) => {
        const base = normalize(path.parse(file).name)
        return base.includes(normalize(modelSlug)) || normalize(modelSlug).includes(base)
      })

      rows.push({
        category: '3w',
        brand: brand.brand,
        model,
        status: match ? 'hero_present' : 'missing_hero',
        brand_id: brand.brandId,
        matched_slug: match || '',
        image_count: match ? 1 : 0,
        note: match ? 'local 3W hero image present' : 'no matched local 3W hero image',
      })
    }
  }

  return rows.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model))
}

function buildFourWExpected() {
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

  const rows = []
  const seen = new Set()

  const walk = (node, ctxModel = null, make = '') => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      for (const item of node) walk(item, ctxModel, make)
      return
    }

    const model = node.model || node.model_name || ctxModel
    const sourceUrl = String(node.model_citation ?? node.source_url ?? '').trim()
    if (model && sourceUrl && sourceUrl.startsWith('http')) {
      const key = `${canonicalMake(make)}|${String(model).trim().toLowerCase()}`
      if (!seen.has(key)) {
        seen.add(key)
        rows.push({ make: canonicalMake(make), model: String(model).trim() })
      }
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === 'image_urls') continue
      walk(value, model, make)
    }
  }

  const loadedFiles = new Set()
  for (const [make, jsonKey] of Object.entries(makeToJson)) {
    const filePath = path.join(DATA_ROOT, `${jsonKey}.json`)
    if (!existsSync(filePath) || loadedFiles.has(filePath)) continue
    loadedFiles.add(filePath)
    walk(readJson(filePath), null, make)
  }

  return rows
}

function getFourWFolder(item) {
  const folderOverrides = {
    'audi|a6': ['Audi', 'Audi_A6'],
    'bmw|m4': ['bmw', 'm4-competition'],
    'bmw|m8': ['bmw', 'm8-coupe-competition'],
    'bmw|6 series gt': ['BMW', 'BMW_6_Series'],
    'bmw|8 series gran coupe': ['bmw', '8-series'],
    'bmw|3 series': ['BMW', 'BMW_3_Series'],
    'bmw|m8 coupe competition': ['bmw', 'm8-coupe-competition'],
    'bmw|x5 m competition': ['bmw', 'x5-m'],
    'hyundai|creta ev': ['hyundai', 'creta-electric'],
    'toyota|fortuner': ['Toyota', 'Toyota_Fortuner'],
    'toyota|rumion': ['Toyota', 'Toyota_Rumion'],
    'volkswagen|tayron r-line': ['volkswagen', 'tayron-r-line'],
    'tata|altroz': ['tata', 'altroz'],
    'tata|curvv ev': ['tata', 'curvv-ev'],
    'tata|punch': ['tata', 'punch'],
    'tata|harrier': ['tata', 'harrier'],
    'tata|tiago': ['tata', 'tiago'],
    'tata|tigor': ['tata', 'tigor'],
    'tata|tigor ev': ['tata', 'tigor-ev'],
    'tata|sierra': ['tata', 'sierra'],
    'tata|nexon': ['tata', 'nexon'],
    'tata|nexon ev': ['tata', 'nexon-ev'],
    'tata|safari': ['tata', 'safari'],
    'tata|curvv': ['tata', 'curvv'],
    'tata|tiago ev': ['tata', 'tiago-ev'],
    'tata|punch ev': ['tata', 'punch-ev'],
    'tata|harrier ev': ['tata', 'harrier-ev'],
    'tata|xpres-t ev': ['tata', 'xpres-t-ev'],
    'tata|tiago nrg': ['tata', 'tiago-nrg'],
    'tata|xpres': ['tata', 'xpres'],
    'tata|yodha pickup': ['tata', 'yodha-pickup'],
  }

  const key = `${canonicalMake(item.make)}|${String(item.model).toLowerCase()}`
  const folder = folderOverrides[key] || [slugify(item.make), slugify(item.model)]
  return {
    brandSlug: folder[0],
    modelSlug: folder[1],
    metadataPath: path.join(FOUR_W_GALLERY_DIR, folder[0], folder[1], 'metadata.json'),
  }
}

function auditFourW() {
  const expected = buildFourWExpected()
  const metadata = walkMetadata(FOUR_W_GALLERY_DIR)
  const rows = []

  for (const item of expected) {
    const exact = metadata.find(
      (entry) =>
        canonicalMake(entry.make) === canonicalMake(item.make) &&
        normalize(entry.model) === normalize(item.model)
    )

    const folder = getFourWFolder(item)
    const alias = !exact && existsSync(folder.metadataPath) ? readJson(folder.metadataPath) : null

    let status = 'missing'
    let imageCount = 0
    let note = ''

    if (exact) {
      status = 'scraped_exact'
      imageCount = exact.counts?.total || 0
    } else if (alias) {
      status = 'covered_by_alias'
      imageCount = alias.counts?.total || 0
      note = `uses shared source model "${alias.model}"`
    }

    rows.push({
      category: '4w',
      brand: item.make,
      model: item.model,
      status,
      brand_id: folder.brandSlug,
      matched_slug: folder.modelSlug,
      image_count: imageCount,
      note,
    })
  }

  return rows.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model))
}

function countByStatus(rows) {
  return rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1
    return acc
  }, {})
}

function renderSummarySection(title, rows) {
  const counts = countByStatus(rows)
  const missing = rows.filter((row) => row.status.includes('missing') || row.status.includes('unavailable'))
  const alias = rows.filter((row) => row.status === 'covered_by_alias')

  const lines = [
    `## ${title}`,
    '',
    `- Total models: ${rows.length}`,
    ...Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])).map(([status, count]) => `- ${status}: ${count}`),
    '',
  ]

  if (alias.length > 0) {
    lines.push('### Shared-Source Alias Coverage')
    lines.push('')
    for (const row of alias) {
      lines.push(`- ${row.brand} ${row.model}: ${row.note}`)
    }
    lines.push('')
  }

  if (missing.length > 0) {
    lines.push('### Remaining Gaps')
    lines.push('')
    for (const row of missing) {
      lines.push(`- ${row.brand} ${row.model}: ${row.status}${row.note ? ` (${row.note})` : ''}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

async function main() {
  const twoW = auditTwoW()
  const threeW = auditThreeW()
  const fourW = auditFourW()

  await writeCsv(path.join(ROOT, 'scripts', 'gallery-audit-2w.csv'), [
    'category',
    'brand',
    'model',
    'status',
    'brand_id',
    'matched_slug',
    'image_count',
    'note',
  ], twoW)

  await writeCsv(path.join(ROOT, 'scripts', 'gallery-audit-3w.csv'), [
    'category',
    'brand',
    'model',
    'status',
    'brand_id',
    'matched_slug',
    'image_count',
    'note',
  ], threeW)

  await writeCsv(path.join(ROOT, 'scripts', 'gallery-audit-4w.csv'), [
    'category',
    'brand',
    'model',
    'status',
    'brand_id',
    'matched_slug',
    'image_count',
    'note',
  ], fourW)

  const summary = [
    '# Gallery Coverage Audit',
    '',
    renderSummarySection('Two-Wheelers', twoW),
    renderSummarySection('Three-Wheelers', threeW),
    renderSummarySection('Four-Wheelers', fourW),
  ].join('\n')

  await fs.writeFile(path.join(ROOT, 'docs', 'gallery-coverage-audit.md'), summary)

  console.log(JSON.stringify({
    twoW: countByStatus(twoW),
    threeW: countByStatus(threeW),
    fourW: countByStatus(fourW),
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
