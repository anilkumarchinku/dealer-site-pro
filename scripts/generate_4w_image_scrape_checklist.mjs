#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

const META_JSON_PATH = path.join(PROJECT_ROOT, 'lib', 'data', 'generated', '4w-cardekho-meta.json')
const GALLERIES_DIR = path.join(PROJECT_ROOT, 'public', 'data', 'brand-model-images', '4w-galleries')
const DEDUPE_JSON_PATH = path.join(PROJECT_ROOT, 'docs', '4w-gallery-dedupe-report.json')

const OUTPUT_JSON_PATH = path.join(PROJECT_ROOT, 'lib', 'data', 'generated', '4w-image-scrape-checklist.json')
const OUTPUT_MD_PATH = path.join(PROJECT_ROOT, 'docs', '4w-image-scrape-checklist.md')

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
}

function normalizeUrl(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '')
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseInteger(value) {
  const parsed = Number.parseInt(String(value ?? '').trim(), 10)
  return Number.isFinite(parsed) ? parsed : 0
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function readOptionalJson(filePath, fallback) {
  try {
    return await readJson(filePath)
  } catch {
    return fallback
  }
}

async function collectMetadataFiles(dirPath) {
  const output = []

  async function walk(currentPath) {
    let entries = []
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const resolved = path.join(currentPath, entry.name)
      if (entry.isDirectory()) {
        await walk(resolved)
        continue
      }

      if (entry.isFile() && entry.name === 'metadata.json') {
        output.push(resolved)
      }
    }
  }

  await walk(dirPath)
  return output
}

function makeModelKey(make, model) {
  return `${normalizeText(make)}::${normalizeText(model)}`
}

function dedupeRemovedCount(entry) {
  const removedColors = Array.isArray(entry?.removed?.colors) ? entry.removed.colors : []
  return removedColors.length
}

function buildStatus({ metadataExists, colorCount, duplicateRemovedCount }) {
  if (!metadataExists) return 'not_started'
  if (colorCount === 0) return 'metadata_exists_no_colors'
  if (duplicateRemovedCount > 0) return 'colors_captured_after_dedupe_validation_pending'
  return 'colors_captured_validation_pending'
}

function checklistFlags({ metadataExists, colorCount, duplicateRemovedCount }) {
  return {
    metadataExists,
    fetchAllColors: colorCount === 0,
    verifyFullCardekhoColorCoverage: true,
    verifyNoDuplicates: duplicateRemovedCount > 0,
  }
}

function markdownEscape(value) {
  return String(value ?? '').replace(/\|/g, '\\|')
}

async function main() {
  const meta = await readJson(META_JSON_PATH)
  const dedupeRows = await readOptionalJson(DEDUPE_JSON_PATH, [])
  const metadataFiles = await collectMetadataFiles(GALLERIES_DIR)

  const metadataByUrl = new Map()
  const metadataByModel = new Map()

  for (const filePath of metadataFiles) {
    try {
      const entry = await readJson(filePath)
      const sourceUrl = String(entry?.sourceUrl || '').trim()
      const make = String(entry?.make || '').trim()
      const model = String(entry?.model || '').trim()
      const colorImages = Array.isArray(entry?.colorImages) ? entry.colorImages : []
      const colors = Array.isArray(entry?.colors) ? entry.colors : []
      const colorNames = Array.isArray(entry?.colorNames)
        ? entry.colorNames
        : colors.map((color) => String(color?.name || '').trim()).filter(Boolean)
      const colorCount = parseInteger(entry?.counts?.colors) || colorImages.length || colors.length

      const normalizedEntry = {
        filePath,
        sourceUrl,
        make,
        model,
        colorCount,
        colorNames,
        colorImages,
        mode: String(entry?.mode || '').trim(),
      }

      const urlKey = normalizeUrl(sourceUrl)
      const modelKey = makeModelKey(make, model)

      if (urlKey) metadataByUrl.set(urlKey, normalizedEntry)
      if (make && model) metadataByModel.set(modelKey, normalizedEntry)
    } catch {
      continue
    }
  }

  const dedupeByUrl = new Map()
  const dedupeByModel = new Map()

  for (const row of dedupeRows) {
    const urlKey = normalizeUrl(row?.sourceUrl || '')
    const modelKey = makeModelKey(row?.make, row?.model)
    if (urlKey) dedupeByUrl.set(urlKey, row)
    dedupeByModel.set(modelKey, row)
  }

  const brandKeys = Object.keys(meta.brands).sort((left, right) => left.localeCompare(right))
  const outputBrands = []

  const totals = {
    models: 0,
    modelsWithMetadata: 0,
    modelsWithAnyColorImages: 0,
    modelsWithoutMetadata: 0,
    modelsWithZeroColorImages: 0,
    modelsWithColorDuplicateRemovals: 0,
    modelsPendingCardekhoColorValidation: 0,
    totalCurrentColorImages: 0,
  }

  for (const brandKey of brandKeys) {
    const brand = meta.brands[brandKey]
    const modelEntries = Object.values(brand.models)
      .filter((entry) => Boolean(entry?.sourceUrl))
      .sort((left, right) => left.model.localeCompare(right.model))

    const outputModels = []
    let withMetadataCount = 0
    let withAnyColorImagesCount = 0
    let withoutMetadataCount = 0
    let withZeroColorImagesCount = 0
    let colorDuplicateRemovalCount = 0
    let pendingCardekhoColorValidationCount = 0
    let totalBrandCurrentColorImages = 0

    for (const model of modelEntries) {
      const urlKey = normalizeUrl(model.sourceUrl)
      const modelKey = makeModelKey(brand.make, model.model)
      const metadata = metadataByUrl.get(urlKey) || metadataByModel.get(modelKey) || null
      const dedupe = dedupeByUrl.get(urlKey) || dedupeByModel.get(modelKey) || null

      const metadataExists = Boolean(metadata)
      const rawColorCount = metadata?.colorCount ?? 0
      const duplicateRemovedCount = dedupeRemovedCount(dedupe)
      const currentColorCount = metadataExists
        ? (dedupe?.counts?.colors ? parseInteger(dedupe.counts.colors) : rawColorCount)
        : 0
      const fullCardekhoColorCoverageNeedsValidation = true
      const status = buildStatus({
        metadataExists,
        colorCount: currentColorCount,
        duplicateRemovedCount,
      })

      if (metadataExists) withMetadataCount += 1
      if (!metadataExists) withoutMetadataCount += 1
      if (currentColorCount > 0) withAnyColorImagesCount += 1
      if (metadataExists && currentColorCount === 0) withZeroColorImagesCount += 1
      if (duplicateRemovedCount > 0) colorDuplicateRemovalCount += 1
      if (fullCardekhoColorCoverageNeedsValidation) pendingCardekhoColorValidationCount += 1
      totalBrandCurrentColorImages += currentColorCount

      outputModels.push({
        make: brand.make,
        makeKey: brandKey,
        model: model.model,
        modelKey: slugify(model.model),
        bodyType: model.bodyType,
        sourceUrl: model.sourceUrl,
        heroImageUrl: model.imageUrl,
        existsInLocal: Boolean(model.existsInLocal),
        scrapeTargets: {
          scope: 'colors_only',
          colors: 'all_available_on_cardekho',
          dedupe: 'no_duplicate_color_images',
        },
        currentCoverage: {
          metadataExists,
          rawColorCount,
          currentColorCount,
          colorNames: metadata?.colorNames ?? [],
          duplicateRemovedCount,
          metadataTracked: metadataExists,
          metadataPath: metadata?.filePath ?? null,
          scrapeMode: metadata?.mode || null,
          fullCardekhoColorCoverageNeedsValidation,
          colorStatus: currentColorCount > 0 ? 'captured_needs_validation' : 'missing',
        },
        checklist: checklistFlags({
          metadataExists,
          colorCount: currentColorCount,
          duplicateRemovedCount,
        }),
        overallStatus: status,
      })
    }

    totals.models += outputModels.length
    totals.modelsWithMetadata += withMetadataCount
    totals.modelsWithAnyColorImages += withAnyColorImagesCount
    totals.modelsWithoutMetadata += withoutMetadataCount
    totals.modelsWithZeroColorImages += withZeroColorImagesCount
    totals.modelsWithColorDuplicateRemovals += colorDuplicateRemovalCount
    totals.modelsPendingCardekhoColorValidation += pendingCardekhoColorValidationCount
    totals.totalCurrentColorImages += totalBrandCurrentColorImages

    outputBrands.push({
      make: brand.make,
      makeKey: brandKey,
      cardekhoBrandUrl: brand.cardekhoBrandUrl,
      totalModels: outputModels.length,
      modelsWithMetadata: withMetadataCount,
      modelsWithAnyColorImages: withAnyColorImagesCount,
      modelsWithoutMetadata: withoutMetadataCount,
      modelsWithZeroColorImages: withZeroColorImagesCount,
      modelsWithColorDuplicateRemovals: colorDuplicateRemovalCount,
      modelsPendingCardekhoColorValidation: pendingCardekhoColorValidationCount,
      totalCurrentColorImages: totalBrandCurrentColorImages,
      models: outputModels,
    })
  }

  const outputJson = {
    meta: {
      generatedAt: new Date().toISOString(),
      sourceMetaGeneratedAt: meta?.meta?.generatedAt ?? null,
      brandCount: outputBrands.length,
      modelCount: totals.models,
      sourceCurrentModelCount: meta?.meta?.currentModelCount ?? totals.models,
      metadataModelCount: metadataFiles.length,
      dedupeAuditedModelCount: Array.isArray(dedupeRows) ? dedupeRows.length : 0,
    },
    targets: {
      scope: 'colors_only',
      colors: 'all_available_on_cardekho',
      dedupe: 'no_duplicate_color_images',
    },
    summary: totals,
    brands: outputBrands,
  }

  const markdownLines = [
    '# 4W Color Image Checklist',
    '',
    `- Generated at: ${outputJson.meta.generatedAt}`,
    `- Cardekho-backed current models tracked: ${outputJson.meta.sourceCurrentModelCount}`,
    `- Brands tracked: ${outputJson.meta.brandCount}`,
    `- Models with local metadata rows: ${outputJson.summary.modelsWithMetadata}`,
    `- Models with any current color images: ${outputJson.summary.modelsWithAnyColorImages}`,
    `- Models without metadata: ${outputJson.summary.modelsWithoutMetadata}`,
    `- Models with metadata but zero current color images: ${outputJson.summary.modelsWithZeroColorImages}`,
    `- Models with color duplicate removals already flagged: ${outputJson.summary.modelsWithColorDuplicateRemovals}`,
    `- Models still needing full Cardekho color coverage validation: ${outputJson.summary.modelsPendingCardekhoColorValidation}`,
    `- Total current color images saved locally: ${outputJson.summary.totalCurrentColorImages}`,
    '',
    'Target per model:',
    '',
    '- Colors: capture all colors available on Cardekho',
    '- Duplicates: zero duplicate color images in final set',
    '',
    'Status legend:',
    '',
    '- `not_started`: no local color metadata exists yet',
    '- `metadata_exists_no_colors`: local metadata exists, but no current color images are tracked',
    '- `colors_captured_validation_pending`: current color images exist, but full Cardekho color coverage still needs validation',
    '- `colors_captured_after_dedupe_validation_pending`: current color images exist and duplicate removals were flagged, but full Cardekho color coverage still needs validation',
    '',
    'Color counts show the current local color-image count after applying any available dedupe audit.',
    '',
  ]

  for (const brand of outputBrands) {
    markdownLines.push(`## ${brand.make}`)
    markdownLines.push('')
    markdownLines.push(`- Cardekho brand page: ${brand.cardekhoBrandUrl}`)
    markdownLines.push(`- Models tracked: ${brand.totalModels}`)
    markdownLines.push(`- Local metadata coverage: ${brand.modelsWithMetadata}/${brand.totalModels}`)
    markdownLines.push(`- Models with any current color images: ${brand.modelsWithAnyColorImages}/${brand.totalModels}`)
    markdownLines.push(`- Models without metadata: ${brand.modelsWithoutMetadata}`)
    markdownLines.push(`- Models with metadata but zero current color images: ${brand.modelsWithZeroColorImages}`)
    markdownLines.push(`- Color duplicate removals flagged: ${brand.modelsWithColorDuplicateRemovals}`)
    markdownLines.push(`- Models pending full Cardekho color validation: ${brand.modelsPendingCardekhoColorValidation}`)
    markdownLines.push(`- Total current saved color images: ${brand.totalCurrentColorImages}`)
    markdownLines.push('')
    markdownLines.push('| Model | Body Type | In Local | Metadata Exists | Current Colors | Dupes Removed | Needs Coverage Validation | Status |')
    markdownLines.push('| --- | --- | --- | --- | --- | --- | --- | --- |')

    for (const model of brand.models) {
      markdownLines.push(
        `| ${markdownEscape(model.model)} | ${markdownEscape(model.bodyType || 'Unknown')} | ${model.existsInLocal ? 'Yes' : 'No'} | ${model.currentCoverage.metadataExists ? 'Yes' : 'No'} | ${model.currentCoverage.currentColorCount} | ${model.currentCoverage.duplicateRemovedCount} | ${model.currentCoverage.fullCardekhoColorCoverageNeedsValidation ? 'Yes' : 'No'} | ${markdownEscape(model.overallStatus)} |`
      )
    }

    markdownLines.push('')
  }

  await fs.writeFile(OUTPUT_JSON_PATH, `${JSON.stringify(outputJson, null, 2)}\n`)
  await fs.writeFile(OUTPUT_MD_PATH, `${markdownLines.join('\n')}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
