import fs from 'fs'
import path from 'path'

const PROJECT_ROOT = process.cwd()
const INPUT_CSV = path.join(PROJECT_ROOT, 'outputs', 'catalog-validation-4w-variant-prices', '4w-variant-price-checklist.csv')
const OUTPUT_MD = path.join(PROJECT_ROOT, 'docs', '4w-price-sync-checklist.md')

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

const raw = fs.readFileSync(INPUT_CSV, 'utf8')
const rows = parseCsv(raw)
const actionable = rows.filter((row) => row.Status && row.Status !== 'MATCH')

const grouped = new Map()

for (const row of actionable) {
  const brand = row.Brand || 'Unknown Brand'
  const model = row.Model || 'Unknown Model'
  const brandEntry = grouped.get(brand) ?? new Map()
  const modelEntry = brandEntry.get(model) ?? {
    url: row['Variants URL'] || '',
    rows: [],
  }
  modelEntry.rows.push(row)
  if (!modelEntry.url && row['Variants URL']) modelEntry.url = row['Variants URL']
  brandEntry.set(model, modelEntry)
  grouped.set(brand, brandEntry)
}

const brands = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b))
const generatedAt = new Date().toISOString()

const lines = [
  '# 4W Ex-Showroom Price Sync Checklist',
  '',
  `Generated: ${generatedAt}`,
  '',
  'This checklist is grouped make-wise, then model-wise, so we can fix one model at a time from the live Cardekho variants page.',
  '',
  'Priority order:',
  '- `MISMATCH`: local price exists but does not equal current Cardekho price',
  '- `NO_PRICE_PARSED`: current Cardekho variants page exists, but our audit could not reliably parse the live price',
  '- `ERROR`: fetch / parsing / model resolution issue',
  '- `LOCAL_ONLY_VARIANT`: local variant is not matching the current Cardekho feed',
  '- `CARDEKHO_ONLY_VARIANT`: current Cardekho variant is not present locally',
  '',
  `Actionable rows: ${actionable.length}`,
  `Makes with pending work: ${brands.length}`,
  '',
]

for (const brand of brands) {
  const brandEntry = grouped.get(brand)
  const models = Array.from(brandEntry.keys()).sort((a, b) => a.localeCompare(b))
  const brandRows = models.reduce((sum, model) => sum + brandEntry.get(model).rows.length, 0)

  lines.push(`## ${brand}`)
  lines.push('')
  lines.push(`Pending models: ${models.length}`)
  lines.push(`Pending rows: ${brandRows}`)
  lines.push('')

  for (const model of models) {
    const modelEntry = brandEntry.get(model)
    const sortedRows = [...modelEntry.rows].sort((a, b) => {
      const priorityDelta = statusPriority(a.Status) - statusPriority(b.Status)
      if (priorityDelta !== 0) return priorityDelta
      return (a['Local Variant'] || a['Cardekho Variant'] || '').localeCompare(b['Local Variant'] || b['Cardekho Variant'] || '')
    })

    const statusCounts = sortedRows.reduce((acc, row) => {
      acc[row.Status] = (acc[row.Status] ?? 0) + 1
      return acc
    }, {})

    lines.push(`### ${model}`)
    lines.push('')
    if (modelEntry.url) lines.push(`Cardekho variants: ${modelEntry.url}`)
    lines.push(`Rows to review: ${sortedRows.length}`)
    lines.push(`Status mix: ${Object.entries(statusCounts).map(([status, count]) => `${status}=${count}`).join(', ')}`)
    lines.push('')

    for (const row of sortedRows) {
      const localVariant = row['Local Variant'] || '—'
      const localPrice = row['Local Ex-Showroom INR'] ? `₹${Number(row['Local Ex-Showroom INR']).toLocaleString('en-IN')}` : '—'
      const cdVariant = row['Cardekho Variant'] || '—'
      const cdPrice = row['Cardekho Ex-Showroom INR'] ? `₹${Number(row['Cardekho Ex-Showroom INR']).toLocaleString('en-IN')}` : '—'
      const note = row.Note || ''

      lines.push(`- [ ] ${row.Status}: local \`${localVariant}\` (${localPrice}) -> Cardekho \`${cdVariant}\` (${cdPrice})`)
      if (note) lines.push(`  Note: ${note}`)
    }

    lines.push('')
  }
}

fs.writeFileSync(OUTPUT_MD, `${lines.join('\n')}\n`)
console.log(`Wrote ${OUTPUT_MD}`)
