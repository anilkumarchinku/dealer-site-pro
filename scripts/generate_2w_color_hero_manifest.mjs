import fs from 'fs'
import path from 'path'

const repoRoot = process.cwd()
const colorsRoot = path.join(repoRoot, 'public', 'data', 'brand-model-images', '2w-colors')
const outputPath = path.join(repoRoot, 'lib', 'data', 'generated', '2w-color-hero-fallbacks.json')

function walk(dir, results = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            walk(fullPath, results)
        } else if (entry.isFile() && entry.name === 'metadata.json') {
            results.push(fullPath)
        }
    }
    return results
}

const manifest = {}

for (const metadataPath of walk(colorsRoot)) {
    try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
        const brandId = String(metadata.brandId ?? '').trim()
        const modelSlug = String(metadata.modelSlug ?? '').trim()
        const firstColorImage = metadata.colors?.[0]?.image

        if (!brandId || !modelSlug || typeof firstColorImage !== 'string' || !firstColorImage.trim()) {
            continue
        }

        manifest[`${brandId}/${modelSlug}`] = firstColorImage.trim()
    } catch {
        // Ignore malformed metadata rows so generation can continue.
    }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`Wrote ${Object.keys(manifest).length} 2W color hero fallbacks to ${outputPath}`)
