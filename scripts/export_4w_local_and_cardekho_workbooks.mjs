import fs from 'fs/promises'
import path from 'path'
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool'

const root = path.resolve(process.cwd())
const checklistCsvPath = path.join(root, 'outputs', 'catalog-validation-4w-variant-prices', '4w-variant-price-checklist.csv')
const outputDir = path.join(root, 'outputs', 'catalog-validation-4w-variant-prices')
const projectOutputPath = path.join(outputDir, '4w-project-prices.xlsx')
const cardekhoOutputPath = path.join(outputDir, '4w-cardekho-prices.xlsx')

function parseCsv(text) {
  const rows = []
  let current = ''
  let row = []
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]
    const next = text[i + 1]

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (ch === ',' && !inQuotes) {
      row.push(current)
      current = ''
      continue
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1
      if (current.length > 0 || row.length > 0) {
        row.push(current)
        rows.push(row)
        row = []
        current = ''
      }
      continue
    }

    current += ch
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current)
    rows.push(row)
  }

  const [header = [], ...dataRows] = rows
  return dataRows.map((values) =>
    Object.fromEntries(header.map((key, index) => [key, values[index] ?? '']))
  )
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

function styleUsedRange(sheet) {
  const used = sheet.getUsedRange(true)
  if (!used) return
  used.format.autofitColumns()
  used.format.autofitRows()
}

function toCurrencyText(value) {
  const num = Number(value)
  if (!Number.isFinite(num) || num <= 0) return ''
  return `₹${num.toLocaleString('en-IN')}`
}

function sortRows(rows, variantKey) {
  return [...rows].sort((a, b) => {
    const brandDelta = String(a.Brand).localeCompare(String(b.Brand), undefined, { sensitivity: 'base', numeric: true })
    if (brandDelta !== 0) return brandDelta
    const modelDelta = String(a.Model).localeCompare(String(b.Model), undefined, { sensitivity: 'base', numeric: true })
    if (modelDelta !== 0) return modelDelta
    return String(a[variantKey]).localeCompare(String(b[variantKey]), undefined, { sensitivity: 'base', numeric: true })
  })
}

async function buildWorkbook({ title, rows, variantKey, priceKey, citationKey, outPath, headerColor }) {
  const workbook = Workbook.create()

  const summarySheet = workbook.worksheets.add('Summary')
  summarySheet.getRange('A1:H1').values = [[title]]
  summarySheet.getRange('A1:H1').merge()
  styleTitle(summarySheet.getRange('A1:H1'))

  summarySheet.getRange('A3:B3').values = [['Metric', 'Value']]
  styleHeader(summarySheet.getRange('A3:B3'), headerColor)

  const uniqueBrands = new Set(rows.map((r) => r.Brand))
  const uniqueModels = new Set(rows.map((r) => `${r.Brand}|||${r.Model}`))
  const statusCounts = rows.reduce((acc, row) => {
    acc[row.Status] = (acc[row.Status] ?? 0) + 1
    return acc
  }, {})

  const summaryRows = [
    ['Generated At', new Date().toISOString()],
    ['Total Rows', rows.length],
    ['Brands Covered', uniqueBrands.size],
    ['Brand-Model Groups', uniqueModels.size],
    ['MATCH Rows', statusCounts.MATCH ?? 0],
    ['LOCAL_ONLY_VARIANT Rows', statusCounts.LOCAL_ONLY_VARIANT ?? 0],
    ['CARDEKHO_ONLY_VARIANT Rows', statusCounts.CARDEKHO_ONLY_VARIANT ?? 0],
    ['NO_PRICE_PARSED Rows', statusCounts.NO_PRICE_PARSED ?? 0],
    ['NO_SOURCE_URL Rows', statusCounts.NO_SOURCE_URL ?? 0],
  ]
  summarySheet.getRange(`A4:B${summaryRows.length + 3}`).values = summaryRows

  const brandSummary = [...uniqueBrands]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }))
    .map((brand) => {
      const brandRows = rows.filter((r) => r.Brand === brand)
      return [
        brand,
        brandRows.length,
        new Set(brandRows.map((r) => r.Model)).size,
        brandRows.filter((r) => r.Status === 'MATCH').length,
        brandRows.filter((r) => r.Status === 'LOCAL_ONLY_VARIANT').length,
        brandRows.filter((r) => r.Status === 'CARDEKHO_ONLY_VARIANT').length,
        brandRows.filter((r) => r.Status === 'NO_PRICE_PARSED').length,
      ]
    })

  summarySheet.getRange('D3:J3').values = [['Brand', 'Rows', 'Models', 'Match', 'Local Only', 'Cardekho Only', 'No Price Parsed']]
  styleHeader(summarySheet.getRange('D3:J3'), '#5b9bd5')
  if (brandSummary.length) summarySheet.getRange(`D4:J${brandSummary.length + 3}`).values = brandSummary

  summarySheet.freezePanes.freezeRows(3)
  styleUsedRange(summarySheet)
  summarySheet.getRange('A:A').format.columnWidthPx = 220
  summarySheet.getRange('B:B').format.columnWidthPx = 170
  summarySheet.getRange('D:D').format.columnWidthPx = 180

  const priceSheet = workbook.worksheets.add('Prices')
  priceSheet.getRange('A1:J1').values = [[
    'Brand',
    'Model',
    'Variant',
    'Ex-Showroom INR',
    'Ex-Showroom Text',
    'Status',
    'Delta INR',
    'Variants URL',
    'Citation URL',
    'Note',
  ]]
  styleHeader(priceSheet.getRange('A1:J1'), headerColor)

  const tableRows = rows.map((row) => [
    row.Brand,
    row.Model,
    row[variantKey],
    Number(row[priceKey]) || '',
    toCurrencyText(row[priceKey]),
    row.Status,
    Number(row['Delta INR']) || '',
    row['Variants URL'],
    row[citationKey] || '',
    row.Note || '',
  ])
  if (tableRows.length) priceSheet.getRange(`A2:J${tableRows.length + 1}`).values = tableRows
  priceSheet.freezePanes.freezeRows(1)
  priceSheet.freezePanes.freezeColumns(3)
  priceSheet.getRange('A:J').format.wrapText = true
  styleUsedRange(priceSheet)
  priceSheet.getRange('A:C').format.columnWidthPx = 170
  priceSheet.getRange('D:G').format.columnWidthPx = 140
  priceSheet.getRange('H:J').format.columnWidthPx = 320

  await fs.mkdir(outputDir, { recursive: true })
  const output = await SpreadsheetFile.exportXlsx(workbook)
  await output.save(outPath)
}

async function main() {
  const csvText = await fs.readFile(checklistCsvPath, 'utf8')
  const rows = parseCsv(csvText)

  const projectRows = sortRows(
    rows.filter((row) => row['Local Variant']),
    'Local Variant',
  )

  const cardekhoRows = sortRows(
    rows.filter((row) => row['Cardekho Variant']),
    'Cardekho Variant',
  )

  await buildWorkbook({
    title: '4W Project Price Sheet',
    rows: projectRows,
    variantKey: 'Local Variant',
    priceKey: 'Local Ex-Showroom INR',
    citationKey: 'Local Citation URL',
    outPath: projectOutputPath,
    headerColor: '#1f4e78',
  })

  await buildWorkbook({
    title: '4W Cardekho Price Sheet',
    rows: cardekhoRows,
    variantKey: 'Cardekho Variant',
    priceKey: 'Cardekho Ex-Showroom INR',
    citationKey: 'Variants URL',
    outPath: cardekhoOutputPath,
    headerColor: '#c55a11',
  })

  console.log(`Saved ${projectOutputPath}`)
  console.log(`Saved ${cardekhoOutputPath}`)
}

await main()
