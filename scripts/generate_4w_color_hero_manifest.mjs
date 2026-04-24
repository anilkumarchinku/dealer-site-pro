import fs from 'fs'
import path from 'path'

const repoRoot = process.cwd()
const galleriesRoot = path.join(repoRoot, 'public', 'data', 'brand-model-images', '4w-galleries')
const outputPath = path.join(repoRoot, 'lib', 'data', 'generated', '4w-color-hero-fallbacks.json')

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

for (const metadataPath of walk(galleriesRoot)) {
    try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
        const brandSlug = String(metadata.brandSlug ?? '').trim()
        const modelSlug = String(metadata.modelSlug ?? '').trim()
        const heroImage = typeof metadata.colorImages?.[0] === 'string' && metadata.colorImages[0].trim()
            ? metadata.colorImages[0].trim()
            : (typeof metadata.hero === 'string' && metadata.hero.trim() ? metadata.hero.trim() : null)

        if (!brandSlug || !modelSlug || !heroImage) continue

        manifest[`${brandSlug}/${modelSlug}`] = heroImage
    } catch {
        // Ignore malformed metadata rows so generation can continue.
    }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`Wrote ${Object.keys(manifest).length} 4W color hero fallbacks to ${outputPath}`)
