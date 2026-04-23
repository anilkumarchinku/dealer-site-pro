import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const root = path.resolve(process.cwd())
const publicDataDir = path.join(root, 'public', 'data')
const docsDir = path.join(root, 'docs')
const outputPath = path.join(docsDir, 'catalog-data-validation.md')

const brandModels = require(path.join(publicDataDir, 'brand-models.json'))
const { CAR_MODEL_COLORS } = require(path.join(root, 'lib', 'data', 'car-colors.ts'))
const { THREE_WHEELER_MODEL_COLORS } = require(path.join(root, 'lib', 'data', '3w-model-colors.ts'))

function compareStrings(a, b) {
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function normalize(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function formatList(values) {
  if (!values.length) return 'None'
  return values.join(', ')
}

function getSourceRows3W(rawData) {
  const vehicles = Array.isArray(rawData?.vehicles) ? rawData.vehicles : []
  return vehicles
    .map((vehicle) => {
      let model = ''
      let variant = ''

      if (typeof vehicle.model === 'string' && vehicle.model.trim()) {
        model = clean(vehicle.model).replace(/^Ape\s+/i, '')
        variant = clean(vehicle.variant || vehicle.variant_name || vehicle.model)
      } else {
        const rawVariant = clean(vehicle.variant_name || vehicle.model_name || '')
        model = clean(rawVariant.split('/')[0])
        variant = rawVariant
      }

      return {
        model,
        modelKey: normalize(model),
        variant,
      }
    })
    .filter((entry) => entry.model)
}

function get3WVariantNames(sourceRows, model) {
  const modelKey = normalize(clean(model).replace(/^Ape\s+/i, ''))
  return unique(
    sourceRows
      .filter(
        (entry) =>
          entry.modelKey === modelKey ||
          entry.modelKey.includes(modelKey) ||
          modelKey.includes(entry.modelKey)
      )
      .map((entry) => entry.variant)
  )
}

function build2WData() {
  const dir = path.join(publicDataDir, '2w')
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .sort(compareStrings)

  const brands = files.map((file) => {
    const data = readJson(path.join(dir, file))
    const byModel = new Map()

    for (const vehicle of data.vehicles || []) {
      const model = clean(vehicle.model || vehicle.variant_name || 'Unknown')
      const existing = byModel.get(model) || { variants: new Set(), colors: 0 }
      const variants =
        Array.isArray(vehicle.variants) && vehicle.variants.length
          ? vehicle.variants.map((variant) =>
              clean(variant.name || variant.variant_name || variant.label || '')
            )
          : [clean(vehicle.variant_name || model)]

      variants.filter(Boolean).forEach((variant) => existing.variants.add(variant))
      existing.colors = Math.max(
        existing.colors,
        Array.isArray(vehicle.colors) ? vehicle.colors.length : 0
      )

      byModel.set(model, existing)
    }

    const models = [...byModel.entries()]
      .map(([model, meta]) => ({
        model,
        variants: meta.variants.size,
        colors: meta.colors,
        variantNames: [...meta.variants].sort(compareStrings),
      }))
      .sort((a, b) => compareStrings(a.model, b.model))

    return {
      brand: data.brand || file.replace(/\.json$/, ''),
      source: path.posix.join('public/data/2w', file),
      models,
    }
  })

  return brands.sort((a, b) => compareStrings(a.brand, b.brand))
}

function build3WData() {
  const dir = path.join(publicDataDir, '3w')
  const rawFileMap = new Map(
    fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => [file.replace(/\.json$/, ''), readJson(path.join(dir, file))])
  )

  const brands = (brandModels.threeWheelers || [])
    .map((entry) => {
      const rawData = rawFileMap.get(entry.brandId) || null
      const sourceRows = getSourceRows3W(rawData)
      const models = unique(Object.values(entry.models || {}).flat().map(clean))
        .map((model) => {
          const variantNames = get3WVariantNames(sourceRows, model)
          return {
            model,
            variants: variantNames.length,
            colors: (THREE_WHEELER_MODEL_COLORS[`${entry.brand} ${model}`] || []).length,
            variantNames,
          }
        })
        .sort((a, b) => compareStrings(a.model, b.model))

      return {
        brand: entry.brand,
        source: rawData ? path.posix.join('public/data/3w', `${entry.brandId}.json`) : 'Missing raw source',
        sourceMissing: !rawData,
        models,
      }
    })
    .sort((a, b) => compareStrings(a.brand, b.brand))

  return brands
}

function build4WData() {
  const excludedFiles = new Set([
    'brand-models.json',
    '3w-brand-colors.json',
    'vehicle-image-urls.json',
  ])

  const brands = fs
    .readdirSync(publicDataDir)
    .filter((file) => file.endsWith('.json') && !excludedFiles.has(file))
    .sort(compareStrings)
    .flatMap((file) => {
      const fullPath = path.join(publicDataDir, file)
      if (!fs.statSync(fullPath).isFile()) return []

      const json = readJson(fullPath)
      const keys = Object.keys(json)
      if (keys.length !== 1) return []

      const rows = json[keys[0]]
      if (!Array.isArray(rows) || rows.length === 0) return []

      const firstRow = rows[0]
      if (!firstRow || typeof firstRow !== 'object' || !('model' in firstRow)) return []

      const brand = clean(firstRow.make || keys[0].replace(/[_-]+/g, ' '))
      const byModel = new Map()

      for (const row of rows) {
        const model = clean(row.model || 'Unknown')
        const existing = byModel.get(model) || { variants: new Set() }
        existing.variants.add(clean(row.variant_name || row.variant || model))
        byModel.set(model, existing)
      }

      const models = [...byModel.entries()]
        .map(([model, meta]) => ({
          model,
          variants: meta.variants.size,
          colors: (CAR_MODEL_COLORS[`${brand} ${model}`] || []).length,
          variantNames: [...meta.variants].sort(compareStrings),
        }))
        .sort((a, b) => compareStrings(a.model, b.model))

      return [
        {
          brand,
          source: path.posix.join('public/data', file),
          models,
        },
      ]
    })
    .sort((a, b) => compareStrings(a.brand, b.brand))

  return brands
}

function computeSummary(brands) {
  return {
    brands: brands.length,
    models: brands.reduce((sum, brand) => sum + brand.models.length, 0),
    variants: brands.reduce(
      (sum, brand) => sum + brand.models.reduce((modelSum, model) => modelSum + model.variants, 0),
      0
    ),
  }
}

function buildCoverageNotes(data) {
  const fourWCatalogBrands = (brandModels.fourWheelers || []).map((entry) => entry.brand)
  const fourWDetailedBrands = data['4W'].map((brand) => brand.brand)
  const detailed4WByKey = new Map(
    fourWDetailedBrands.map((brand) => [normalize(brand.replace(/\bmotors?\b/gi, '')), brand])
  )
  const missing4W = fourWCatalogBrands.filter(
    (brand) => !detailed4WByKey.has(normalize(brand.replace(/\bmotors?\b/gi, '')))
  )

  const threeWMissing = data['3W']
    .filter((brand) => brand.sourceMissing)
    .map((brand) => brand.brand)

  const twoWCatalogBrands = unique([
    ...(brandModels.twoWheelers?.traditional || []).map((entry) => entry.brand),
    ...(brandModels.twoWheelers?.electric || []).map((entry) => entry.brand),
  ])

  return {
    fourWCatalogBrands: fourWCatalogBrands.length,
    fourWDetailedBrands: fourWDetailedBrands.length,
    missing4W,
    threeWCatalogBrands: (brandModels.threeWheelers || []).length,
    threeWDetailedBrands: data['3W'].filter((brand) => !brand.sourceMissing).length,
    missing3W: threeWMissing,
    twoWCatalogBrands: twoWCatalogBrands.length,
    twoWDetailedBrands: data['2W'].length,
  }
}

function renderTable(models) {
  const lines = [
    '| Model | Variants | Colours | Variant Names |',
    '| --- | ---: | ---: | --- |',
    ...models.map(
      (model) =>
        `| ${model.model} | ${model.variants} | ${model.colors} | ${formatList(model.variantNames || [])} |`
    ),
  ]

  return lines.join('\n')
}

function renderSection(title, brands) {
  const summary = computeSummary(brands)
  const blocks = [
    `## ${title}`,
    '',
    `**Totals:** ${summary.brands} brands, ${summary.models} models, ${summary.variants} variants`,
    '',
  ]

  for (const brand of brands) {
    const brandVariantCount = brand.models.reduce((sum, model) => sum + model.variants, 0)
    blocks.push(`### ${brand.brand}`)
    blocks.push('')
    blocks.push(`Source: \`${brand.source}\``)
    blocks.push('')
    blocks.push(
      `Brand totals: ${brand.models.length} models, ${brandVariantCount} variants`
    )
    blocks.push('')
    blocks.push(renderTable(brand.models))
    blocks.push('')
  }

  return blocks.join('\n')
}

const data = {
  '4W': build4WData(),
  '3W': build3WData(),
  '2W': build2WData(),
}

const summaries = {
  '4W': computeSummary(data['4W']),
  '3W': computeSummary(data['3W']),
  '2W': computeSummary(data['2W']),
}

const coverage = buildCoverageNotes(data)
const generatedOn = new Date().toISOString().split('T')[0]

const markdown = [
  '# Catalog Data Validation',
  '',
  `Generated on: ${generatedOn}`,
  '',
  'This document is generated from the current repository data to support brand, model, variant, and colour validation.',
  '',
  '## Method',
  '',
  '- 4W counts come from `public/data/*.json` detailed car files, with colour counts from `lib/data/car-colors.ts`.',
  '- 3W counts come from `public/data/brand-models.json` plus raw model files in `public/data/3w/*.json`, with colour counts from `lib/data/3w-model-colors.ts`.',
  '- 2W counts come directly from `public/data/2w/*.json`, where model-level variants and colours are already stored.',
  '- If a brand exists in the catalog list but does not have a matching raw detail file yet, the document keeps the brand visible and shows source coverage clearly.',
  '',
  '## Summary',
  '',
  '| Category | Brands | Models | Variants |',
  '| --- | ---: | ---: | ---: |',
  `| 4W | ${summaries['4W'].brands} | ${summaries['4W'].models} | ${summaries['4W'].variants} |`,
  `| 3W | ${summaries['3W'].brands} | ${summaries['3W'].models} | ${summaries['3W'].variants} |`,
  `| 2W | ${summaries['2W'].brands} | ${summaries['2W'].models} | ${summaries['2W'].variants} |`,
  '',
  '## Coverage Notes',
  '',
  `- 4W catalog brand list in \`brand-models.json\`: ${coverage.fourWCatalogBrands}`,
  `- 4W brands with detailed per-model JSON currently available: ${coverage.fourWDetailedBrands}`,
  `- 4W catalog brands still missing detailed model files: ${formatList(coverage.missing4W)}`,
  `- 3W catalog brands in \`brand-models.json\`: ${coverage.threeWCatalogBrands}`,
  `- 3W brands with raw source files currently available: ${coverage.threeWDetailedBrands}`,
  `- 3W catalog brands missing raw source files: ${formatList(coverage.missing3W)}`,
  `- 2W catalog brands in \`brand-models.json\`: ${coverage.twoWCatalogBrands}`,
  `- 2W brands with detailed JSON currently available: ${coverage.twoWDetailedBrands}`,
  '',
  renderSection('4W Brands', data['4W']),
  '',
  renderSection('3W Brands', data['3W']),
  '',
  renderSection('2W Brands', data['2W']),
  '',
].join('\n')

fs.mkdirSync(docsDir, { recursive: true })
fs.writeFileSync(outputPath, markdown)

console.log(`Generated ${path.relative(root, outputPath)}`)
