import fs from 'fs/promises'
import path from 'path'
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool'

const root = path.resolve(process.cwd())
const auditJsonPath = path.join(root, 'outputs', 'catalog-validation-4w-variant-prices', '4w-variant-price-audit.json')
const checklistCsvPath = path.join(root, 'outputs', 'catalog-validation-4w-variant-prices', '4w-variant-price-checklist.csv')
const outputPath = path.join(root, 'outputs', 'catalog-validation-4w-variant-prices', '4w-price-sync-checklist.xlsx')

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

function statusPriority(status) {
  switch (status) {
    case 'MISMATCH':
      return 0
    case 'NO_PRICE_PARSED':
      return 1
    case 'ERROR':
      return 2
    case 'LOCAL_ONLY_VARIANT':
      return 3
    case 'CARDEKHO_ONLY_VARIANT':
      return 4
    default:
      return 5
  }
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

function toCurrency(value) {
  const num = Number(value)
  if (!Number.isFinite(num) || num <= 0) return ''
  return `₹${num.toLocaleString('en-IN')}`
}

async function main() {
  const audit = JSON.parse(await fs.readFile(auditJsonPath, 'utf8'))
  const csvText = await fs.readFile(checklistCsvPath, 'utf8')
  const rows = parseCsv(csvText)
  const actionable = rows
    .filter((row) => row.Status && row.Status !== 'MATCH')
    .sort((a, b) => {
      const brandDelta = String(a.Brand).localeCompare(String(b.Brand), undefined, { sensitivity: 'base', numeric: true })
      if (brandDelta !== 0) return brandDelta
      const modelDelta = String(a.Model).localeCompare(String(b.Model), undefined, { sensitivity: 'base', numeric: true })
      if (modelDelta !== 0) return modelDelta
      const statusDelta = statusPriority(a.Status) - statusPriority(b.Status)
      if (statusDelta !== 0) return statusDelta
      return String(a['Local Variant'] || a['Cardekho Variant'] || '').localeCompare(
        String(b['Local Variant'] || b['Cardekho Variant'] || ''),
        undefined,
        { sensitivity: 'base', numeric: true },
      )
    })

  const workbook = Workbook.create()

  const summarySheet = workbook.worksheets.add('Summary')
  summarySheet.getRange('A1:H1').values = [['4W Ex-Showroom Price Sync']]
  summarySheet.getRange('A1:H1').merge()
  styleTitle(summarySheet.getRange('A1:H1'))

  summarySheet.getRange('A3:B3').values = [['Metric', 'Value']]
  styleHeader(summarySheet.getRange('A3:B3'))
  const summaryRows = [
    ['Generated At', audit.generatedAt],
    ['Brand-Model Groups Checked', audit.totalGroups],
    ['Checklist Rows', audit.totalRows],
    ['Actionable Rows', actionable.length],
    ['Price Mismatches', Object.values(audit.summaryByBrand || {}).reduce((sum, item) => sum + (item.mismatch || 0), 0)],
    ['Local-Only Variants', Object.values(audit.summaryByBrand || {}).reduce((sum, item) => sum + (item.localOnly || 0), 0)],
    ['Cardekho-Only Variants', Object.values(audit.summaryByBrand || {}).reduce((sum, item) => sum + (item.cardekhoOnly || 0), 0)],
    ['Errors', Object.values(audit.summaryByBrand || {}).reduce((sum, item) => sum + (item.errors || 0), 0)],
  ]
  summarySheet.getRange(`A4:B${summaryRows.length + 3}`).values = summaryRows

  summarySheet.getRange('D3:J3').values = [['Brand', 'Total Local', 'Match', 'Mismatch', 'Local Only', 'Cardekho Only', 'Errors']]
  styleHeader(summarySheet.getRange('D3:J3'), '#5b9bd5')
  const brandSummaryRows = Object.entries(audit.summaryByBrand || {})
    .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }))
    .map(([brand, stats]) => [
      brand,
      stats.total ?? 0,
      stats.match ?? 0,
      stats.mismatch ?? 0,
      stats.localOnly ?? 0,
      stats.cardekhoOnly ?? 0,
      stats.errors ?? 0,
    ])
  if (brandSummaryRows.length) {
    summarySheet.getRange(`D4:J${brandSummaryRows.length + 3}`).values = brandSummaryRows
  }
  summarySheet.freezePanes.freezeRows(3)
  styleUsedRange(summarySheet)
  summarySheet.getRange('A:A').format.columnWidthPx = 240
  summarySheet.getRange('B:B').format.columnWidthPx = 180
  summarySheet.getRange('D:D').format.columnWidthPx = 180

  const checklistSheet = workbook.worksheets.add('Checklist')
  checklistSheet.getRange('A1:K1').values = [[
    'Brand',
    'Model',
    'Status',
    'Local Variant',
    'Local Ex-Showroom',
    'Cardekho Variant',
    'Cardekho Ex-Showroom',
    'Delta',
    'Variants URL',
    'Local Citation URL',
    'Note',
  ]]
  styleHeader(checklistSheet.getRange('A1:K1'))

  const checklistRows = actionable.map((row) => [
    row.Brand,
    row.Model,
    row.Status,
    row['Local Variant'],
    toCurrency(row['Local Ex-Showroom INR']),
    row['Cardekho Variant'],
    toCurrency(row['Cardekho Ex-Showroom INR']),
    row['Delta INR'] ? toCurrency(row['Delta INR']) : '',
    row['Variants URL'],
    row['Local Citation URL'],
    row.Note,
  ])
  if (checklistRows.length) {
    checklistSheet.getRange(`A2:K${checklistRows.length + 1}`).values = checklistRows
  }
  checklistSheet.freezePanes.freezeRows(1)
  checklistSheet.freezePanes.freezeColumns(3)
  checklistSheet.getRange('A:K').format.wrapText = true
  styleUsedRange(checklistSheet)
  checklistSheet.getRange('I:K').format.columnWidthPx = 320
  checklistSheet.getRange('D:G').format.columnWidthPx = 170
  checklistSheet.getRange('A:C').format.columnWidthPx = 150

  const modelQueueSheet = workbook.worksheets.add('Model Queue')
  modelQueueSheet.getRange('A1:F1').values = [[
    'Brand',
    'Model',
    'Rows To Review',
    'Highest Priority Status',
    'Variants URL',
    'Status Breakdown',
  ]]
  styleHeader(modelQueueSheet.getRange('A1:F1'), '#70ad47')

  const grouped = new Map()
  for (const row of actionable) {
    const key = `${row.Brand}|||${row.Model}`
    const existing = grouped.get(key) ?? {
      brand: row.Brand,
      model: row.Model,
      url: row['Variants URL'] || '',
      rows: 0,
      statuses: new Map(),
      highest: row.Status,
    }
    existing.rows += 1
    existing.url ||= row['Variants URL'] || ''
    existing.statuses.set(row.Status, (existing.statuses.get(row.Status) ?? 0) + 1)
    if (statusPriority(row.Status) < statusPriority(existing.highest)) existing.highest = row.Status
    grouped.set(key, existing)
  }

  const modelQueueRows = [...grouped.values()]
    .sort((a, b) => {
      const brandDelta = String(a.brand).localeCompare(String(b.brand), undefined, { sensitivity: 'base', numeric: true })
      if (brandDelta !== 0) return brandDelta
      return String(a.model).localeCompare(String(b.model), undefined, { sensitivity: 'base', numeric: true })
    })
    .map((entry) => [
      entry.brand,
      entry.model,
      entry.rows,
      entry.highest,
      entry.url,
      [...entry.statuses.entries()]
        .sort((a, b) => statusPriority(a[0]) - statusPriority(b[0]))
        .map(([status, count]) => `${status}=${count}`)
        .join(', '),
    ])

  if (modelQueueRows.length) {
    modelQueueSheet.getRange(`A2:F${modelQueueRows.length + 1}`).values = modelQueueRows
  }
  modelQueueSheet.freezePanes.freezeRows(1)
  modelQueueSheet.freezePanes.freezeColumns(2)
  modelQueueSheet.getRange('A:F').format.wrapText = true
  styleUsedRange(modelQueueSheet)
  modelQueueSheet.getRange('E:F').format.columnWidthPx = 320
  modelQueueSheet.getRange('A:B').format.columnWidthPx = 170

  const summaryInspect = await workbook.inspect({
    kind: 'table',
    sheetId: summarySheet.id,
    range: 'A1:J15',
    include: 'values',
    tableMaxRows: 15,
    tableMaxCols: 10,
    summary: '4W price sync workbook summary preview',
  })
  console.log(summaryInspect.ndjson)

  await workbook.render({ sheetName: 'Summary', range: 'A1:J20', scale: 2 })
  await workbook.render({ sheetName: 'Checklist', range: 'A1:K18', scale: 2 })
  await workbook.render({ sheetName: 'Model Queue', range: 'A1:F18', scale: 2 })

  const output = await SpreadsheetFile.exportXlsx(workbook)
  await output.save(outputPath)
  console.log(`Saved ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
