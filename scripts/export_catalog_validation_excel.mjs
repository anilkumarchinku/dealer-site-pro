import fs from 'fs/promises'
import path from 'path'
import { createRequire } from 'module'
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool'

const require = createRequire(import.meta.url)

const root = path.resolve(process.cwd())
const publicDataDir = path.join(root, 'public', 'data')
const outputDir = path.join(
  root,
  'outputs',
  `catalog-validation-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`
)
const outputPath = path.join(outputDir, 'catalog-data-validation.xlsx')

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

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

function formatList(values) {
  return values.length ? values.join(', ') : 'None'
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

async function build2WData() {
  const dir = path.join(publicDataDir, '2w')
  const files = (await fs.readdir(dir))
    .filter((file) => file.endsWith('.json'))
    .sort(compareStrings)

  const brands = []

  for (const file of files) {
    const data = await readJson(path.join(dir, file))
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

    brands.push({
      brand: data.brand || file.replace(/\.json$/, ''),
      source: path.posix.join('public/data/2w', file),
      models,
    })
  }

  return brands.sort((a, b) => compareStrings(a.brand, b.brand))
}

async function build3WData() {
  const dir = path.join(publicDataDir, '3w')
  const fileEntries = await fs.readdir(dir)
  const rawFileMap = new Map()

  for (const file of fileEntries.filter((file) => file.endsWith('.json'))) {
    rawFileMap.set(file.replace(/\.json$/, ''), await readJson(path.join(dir, file)))
  }

  return (brandModels.threeWheelers || [])
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
}

async function build4WData() {
  const excludedFiles = new Set([
    'brand-models.json',
    '3w-brand-colors.json',
    'vehicle-image-urls.json',
  ])
  const fileEntries = await fs.readdir(publicDataDir)
  const brands = []

  for (const file of fileEntries.filter((entry) => entry.endsWith('.json') && !excludedFiles.has(entry)).sort(compareStrings)) {
    const fullPath = path.join(publicDataDir, file)
    const stats = await fs.stat(fullPath)
    if (!stats.isFile()) continue

    const json = await readJson(fullPath)
    const keys = Object.keys(json)
    if (keys.length !== 1) continue

    const rows = json[keys[0]]
    if (!Array.isArray(rows) || !rows.length) continue

    const firstRow = rows[0]
    if (!firstRow || typeof firstRow !== 'object' || !('model' in firstRow)) continue

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

    brands.push({
      brand,
      source: path.posix.join('public/data', file),
      models,
    })
  }

  return brands.sort((a, b) => compareStrings(a.brand, b.brand))
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

  const missing3W = data['3W']
    .filter((brand) => brand.sourceMissing)
    .map((brand) => brand.brand)

  const twoWCatalogBrands = unique([
    ...(brandModels.twoWheelers?.traditional || []).map((entry) => entry.brand),
    ...(brandModels.twoWheelers?.electric || []).map((entry) => entry.brand),
  ])

  return [
    ['4W catalog brand count', fourWCatalogBrands.length],
    ['4W detailed brand count', data['4W'].length],
    ['4W missing detailed brands', formatList(missing4W)],
    ['3W catalog brand count', (brandModels.threeWheelers || []).length],
    ['3W detailed brand count', data['3W'].filter((brand) => !brand.sourceMissing).length],
    ['3W missing raw-source brands', formatList(missing3W)],
    ['2W catalog brand count', twoWCatalogBrands.length],
    ['2W detailed brand count', data['2W'].length],
  ]
}

function flattenRows(category, brands) {
  const rows = []
  for (const brand of brands) {
    for (const model of brand.models) {
      rows.push([
        category,
        brand.brand,
        model.model,
        model.variants,
        model.colors,
        formatList(model.variantNames || []),
        brand.source,
      ])
    }
  }
  return rows
}

function styleTitle(range) {
  range.format.font.bold = true
  range.format.font.size = 16
}

function styleHeader(range, color = '#1f4e78') {
  range.format.font.bold = true
  range.format.font.color = '#ffffff'
  range.format.fill.color = color
  range.format.wrapText = true
}

function styleSectionHeader(range) {
  range.format.font.bold = true
  range.format.fill.color = '#d9eaf7'
}

function styleUsedRange(sheet) {
  const used = sheet.getUsedRange(true)
  if (!used) return
  used.format.autofitColumns()
  used.format.autofitRows()
}

function addDataSheet(workbook, sheetName, rows, accentColor) {
  const sheet = workbook.worksheets.add(sheetName)
  const headers = [['Category', 'Brand', 'Model', 'Variant Count', 'Colour Count', 'Variant Names', 'Source']]
  sheet.getRange('A1:G1').values = [[`${sheetName} Catalog Validation`]]
  sheet.getRange('A1:G1').merge()
  styleTitle(sheet.getRange('A1:G1'))

  sheet.getRange('A3:G3').values = headers
  styleHeader(sheet.getRange('A3:G3'), accentColor)

  if (rows.length) {
    sheet.getRange(`A4:G${rows.length + 3}`).values = rows
  }

  sheet.freezePanes.freezeRows(3)
  sheet.freezePanes.freezeColumns(3)

  sheet.getRange('D:E').format.horizontalAlignment = 'center'
  sheet.getRange('F:G').format.wrapText = true
  styleUsedRange(sheet)
  sheet.getRange('F:G').format.columnWidthPx = 280

  return sheet
}

async function main() {
  const data = {
    '4W': await build4WData(),
    '3W': await build3WData(),
    '2W': await build2WData(),
  }

  const summaries = {
    '4W': computeSummary(data['4W']),
    '3W': computeSummary(data['3W']),
    '2W': computeSummary(data['2W']),
  }

  const workbook = Workbook.create()

  const summarySheet = workbook.worksheets.add('Summary')
  summarySheet.getRange('A1:H1').values = [['Catalog Data Validation Workbook']]
  summarySheet.getRange('A1:H1').merge()
  styleTitle(summarySheet.getRange('A1:H1'))

  summarySheet.getRange('A3:D3').values = [['Category', 'Brand Count', 'Model Count', 'Variant Count']]
  styleHeader(summarySheet.getRange('A3:D3'))
  summarySheet.getRange('A4:D6').values = [
    ['4W', summaries['4W'].brands, summaries['4W'].models, summaries['4W'].variants],
    ['3W', summaries['3W'].brands, summaries['3W'].models, summaries['3W'].variants],
    ['2W', summaries['2W'].brands, summaries['2W'].models, summaries['2W'].variants],
  ]

  summarySheet.getRange('A8:B8').values = [['Coverage Notes', 'Value']]
  styleHeader(summarySheet.getRange('A8:B8'), '#5b9bd5')
  const coverageNotes = buildCoverageNotes(data)
  summarySheet.getRange(`A9:B${coverageNotes.length + 8}`).values = coverageNotes

  summarySheet.getRange('F3:G3').values = [['Sheet', 'Purpose']]
  styleHeader(summarySheet.getRange('F3:G3'), '#70ad47')
  summarySheet.getRange('F4:G7').values = [
    ['Summary', 'High-level counts and source coverage'],
    ['4W', 'Four-wheeler brand, model, colour, and variant validation'],
    ['3W', 'Three-wheeler brand, model, colour, and variant validation'],
    ['2W', 'Two-wheeler brand, model, colour, and variant validation'],
  ]

  summarySheet.freezePanes.freezeRows(3)
  styleUsedRange(summarySheet)
  summarySheet.getRange('B:B').format.columnWidthPx = 380
  summarySheet.getRange('G:G').format.columnWidthPx = 420

  addDataSheet(workbook, '4W', flattenRows('4W', data['4W']), '#1f4e78')
  addDataSheet(workbook, '3W', flattenRows('3W', data['3W']), '#9e480e')
  addDataSheet(workbook, '2W', flattenRows('2W', data['2W']), '#2f5597')

  const summaryInspect = await workbook.inspect({
    kind: 'table',
    range: 'A1:H18',
    sheetId: summarySheet.id,
    include: 'values',
    tableMaxRows: 18,
    tableMaxCols: 8,
    summary: 'summary preview',
  })
  console.log(summaryInspect.ndjson)

  const fourWSheet = workbook.worksheets.getItem('4W')
  const fourWInspect = await workbook.inspect({
    kind: 'table',
    range: 'A1:G15',
    sheetId: fourWSheet.id,
    include: 'values',
    tableMaxRows: 15,
    tableMaxCols: 7,
    summary: '4W preview',
  })
  console.log(fourWInspect.ndjson)

  await workbook.render({ sheetName: 'Summary', range: 'A1:H18', scale: 2 })
  await workbook.render({ sheetName: '4W', range: 'A1:G18', scale: 2 })
  await workbook.render({ sheetName: '3W', range: 'A1:G18', scale: 2 })
  await workbook.render({ sheetName: '2W', range: 'A1:G18', scale: 2 })

  await fs.mkdir(outputDir, { recursive: true })
  const output = await SpreadsheetFile.exportXlsx(workbook)
  await output.save(outputPath)

  console.log(`Saved ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
