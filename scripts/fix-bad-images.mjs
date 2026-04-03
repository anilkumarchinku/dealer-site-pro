/**
 * fix-bad-images.mjs
 * Replaces 65 placeholder images (1137-byte TrucksDekho logo) in Supabase Storage
 * with real vehicle photos scraped from trucks.cardekho.com brand listing pages.
 *
 * Strategy:
 *   1. Fetch brand listing pages and extract __NEXT_DATA__ JSON
 *   2. Build a model-name → image-URL map from the JSON
 *   3. For each bad path, find matching image URL and upload if > 20KB
 *   4. Update public/data/vehicle-image-urls.json with new URLs
 *
 * Usage: node scripts/fix-bad-images.mjs
 */

import { createClient } from '@supabase/supabase-js'
import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://llsvbyeumrfngjvbedbz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3ZieWV1bXJmbmdqdmJlZGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwODMxNywiZXhwIjoyMDg2ODg0MzE3fQ.NUlqttWkhTpQEcTCLQ7GPLkQvEpoW-6g4UuEPkYJnaE'
const BUCKET = 'vehicle-images'
const URL_MAP_PATH = './public/data/vehicle-image-urls.json'
const MIN_IMAGE_SIZE = 20 * 1024 // 20 KB

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── Bad paths to fix ─────────────────────────────────────────────────────────
const BAD_PATHS = [
  '3w/atul/gem-cargo.jpg',
  '3w/atul/gemini.jpg',
  '3w/atul/rik.jpg',
  '3w/atul/gem-paxx.jpg',
  '3w/atul/elite-cargo.jpg',
  '3w/mahindra/e-alfa-super.jpg',
  '3w/atul/smart-cargo.jpg',
  '3w/lohia/humsafar-iaq.jpg',
  '3w/piaggio/ape-e-city.jpg',
  '3w/tvs/king-duramax-plus.jpg',
  '3w/piaggio/ape-xtra-classic.jpg',
  '3w/lohia/narain-plus.jpg',
  '3w/tvs/king-kargo-hd-ev.jpg',
  '3w/altigreen/neev-high-deck.jpg',
  '3w/mahindra/treo-plus.jpg',
  '3w/piaggio/ape-e-city-fx-new-max.jpg',
  '3w/bajaj/maxima-c.jpg',
  '3w/piaggio/ape-xtra-ldx.jpg',
  '3w/piaggio/ape-xtra-ldx-plus.jpg',
  '3w/piaggio/ape-xtra-600.jpg',
  '3w/lohia/narain-slc.jpg',
  '3w/mahindra/e-alfa-cargo.jpg',
  '3w/euler/neo-hirange.jpg',
  '3w/piaggio/ape-city-plus.jpg',
  '3w/altigreen/neev-low-deck.jpg',
  '3w/bajaj/gogo-p5009.jpg',
  '3w/piaggio/ape-e-city-fx.jpg',
  '3w/kinetic/safar-shakti.jpg',
  '3w/tvs/king-ev-max.jpg',
  '3w/bajaj/qute.jpg',
  '3w/mahindra/treo-yaari.jpg',
  '3w/osm/rage-plus-frost.jpg',
  '3w/greaves/eltra-city.jpg',
  '3w/piaggio/ape-e-xtra-fx-max.jpg',
  '3w/kinetic/safar-smart.jpg',
  '4w-auto/force/traveller-delivery-van.jpg',
  '3w/youdha/g-van.jpg',
  '4w-auto/force/trump-40.jpg',
  '3w/youdha/trevo-cargo.jpg',
  '3w/piaggio/ape-city-metro.jpg',
  '3w/osm/stream-city.jpg',
  '4w-auto/eicher/pro-2049.jpg',
  '3w/piaggio/ape-xtra-bada-700.jpg',
  '3w/bajaj/gogo-p7012.jpg',
  '3w/mahindra/e-alfa-mini.jpg',
  '3w/piaggio/ape-auto-ht-dx.jpg',
  '3w/bajaj/maxima-x-wide.jpg',
  '3w/kinetic/safar-jumbo.jpg',
  '3w/altigreen/neev-flatbed.jpg',
  '4w-auto/maruti/super-carry.jpg',
  '3w/altigreen/neev-tez.jpg',
  '3w/mahindra/udo.jpg',
  '3w/tvs/king-kargo-cng-hd.jpg',
  '3w/tvs/king-duramax.jpg',
  '3w/altigreen/neev-rahi.jpg',
  '3w/greaves/xargo-ev.jpg',
  '3w/piaggio/ape-e-city-ultra.jpg',
  '3w/mahindra/treo-zor.jpg',
  '4w-auto/ashok-leyland/bada-dost.jpg',
  '3w/piaggio/ape-e-xtra-fx.jpg',
  '3w/mahindra/treo.jpg',
  '3w/euler/turbo-ev-1000.jpg',
  '3w/atul/energie.jpg',
  '3w/mahindra/e-alfa-plus.jpg',
  '3w/piaggio/ape-nxt-plus.jpg',
]

// ── Brand listing page URLs ──────────────────────────────────────────────────
const BRAND_PAGES = {
  bajaj:         'https://trucks.cardekho.com/en/brands/bajaj.html',
  piaggio:       'https://trucks.cardekho.com/en/brands/piaggio.html',
  mahindra:      'https://trucks.cardekho.com/en/brands/mahindra.html',
  tvs:           'https://trucks.cardekho.com/en/brands/tvs.html',
  euler:         'https://trucks.cardekho.com/en/brands/euler.html',
  atul:          'https://trucks.cardekho.com/en/brands/atul.html',
  greaves:       'https://trucks.cardekho.com/en/brands/greaves.html',
  kinetic:       'https://trucks.cardekho.com/en/brands/kinetic-green.html',
  lohia:         'https://trucks.cardekho.com/en/brands/lohia.html',
  altigreen:     'https://trucks.cardekho.com/en/brands/altigreen.html',
  osm:           'https://trucks.cardekho.com/en/brands/osm.html',
  youdha:        'https://trucks.cardekho.com/en/brands/youdha.html',
  force:         'https://trucks.cardekho.com/en/brands/force.html',
  eicher:        'https://trucks.cardekho.com/en/brands/eicher.html',
  maruti:        'https://trucks.cardekho.com/en/brands/maruti.html',
  'ashok-leyland': 'https://trucks.cardekho.com/en/brands/ashok-leyland.html',
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function fetchHtml(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'))
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
        const location = res.headers.location
        if (!location) return reject(new Error('Redirect with no location'))
        const abs = location.startsWith('/') ? new URL(location, url).href : location
        return fetchHtml(abs, redirectCount + 1).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
    req.on('error', reject)
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function fetchBuffer(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'))
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
        const location = res.headers.location
        const abs = location.startsWith('/') ? new URL(location, url).href : location
        return fetchBuffer(abs, redirectCount + 1).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })
    req.on('error', reject)
    req.setTimeout(25000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

// ── Extract model → image map from __NEXT_DATA__ ─────────────────────────────

function extractNextData(html) {
  const m = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i)
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch {
    return null
  }
}

function isRealImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  if (!/^https?:\/\//.test(url)) return false
  if (!/\.(jpg|jpeg|png|webp)/i.test(url)) return false
  const lower = url.toLowerCase()
  if (lower.includes('logo') || lower.includes('brand') || lower.includes('icon')) return false
  return true
}

/**
 * Recursively walk a JSON value and collect all image URLs.
 * Returns array of { modelSlug, imageUrl } pairs.
 */
function collectImages(obj, result = [], depth = 0) {
  if (depth > 15) return result
  if (Array.isArray(obj)) {
    for (const item of obj) collectImages(item, result, depth + 1)
  } else if (obj && typeof obj === 'object') {
    // Look for model name + image URL co-located in an object
    const keys = Object.keys(obj)
    const nameKeys = ['modelSlug', 'slug', 'modelName', 'name', 'truckName', 'carName', 'model']
    const imgKeys = ['imageUrl', 'image', 'img', 'thumbnail', 'photo', 'imagesList', 'images', 'primaryImage', 'coverImage']

    let slug = null
    let imgUrl = null

    for (const k of nameKeys) {
      if (typeof obj[k] === 'string' && obj[k].length > 1) {
        slug = obj[k].toLowerCase().replace(/\s+/g, '-')
        break
      }
    }

    for (const k of imgKeys) {
      if (typeof obj[k] === 'string' && isRealImageUrl(obj[k])) {
        imgUrl = obj[k]
        break
      }
      if (Array.isArray(obj[k])) {
        const first = obj[k].find(u => typeof u === 'string' && isRealImageUrl(u))
        if (first) { imgUrl = first; break }
        // Array of objects with url/src/path
        const firstObj = obj[k].find(item => item && typeof item === 'object')
        if (firstObj) {
          const u = firstObj.url || firstObj.src || firstObj.path || firstObj.imageUrl || firstObj.image
          if (isRealImageUrl(u)) { imgUrl = u; break }
        }
      }
    }

    if (slug && imgUrl) {
      result.push({ slug, imgUrl })
    }

    // Also collect all image URLs from this object level
    for (const k of keys) {
      if (typeof obj[k] === 'string' && isRealImageUrl(obj[k])) {
        // Associate with slug if we have one
        if (slug && !result.find(r => r.imgUrl === obj[k])) {
          result.push({ slug, imgUrl: obj[k] })
        }
      }
    }

    // Recurse into children
    for (const k of keys) {
      if (obj[k] && typeof obj[k] === 'object') {
        collectImages(obj[k], result, depth + 1)
      }
    }
  }
  return result
}

/**
 * Extract all aeplcdn.com / truckcdn.cardekho.com image URLs with any
 * associated model slug text nearby.
 */
function extractImageUrlsFromHtml(html) {
  const found = new Map() // slug → imageUrl

  // Strategy 1: __NEXT_DATA__ JSON
  const nextData = extractNextData(html)
  if (nextData) {
    const items = collectImages(nextData)
    for (const { slug, imgUrl } of items) {
      if (!found.has(slug)) found.set(slug, imgUrl)
    }
  }

  // Strategy 2: All aeplcdn / truckcdn URLs in raw HTML, with nearby text
  const cdnPattern = /https:\/\/(?:imgd\.aeplcdn\.com|truckcdn\.cardekho\.com)[^\s"'<>)]+\.(?:jpg|jpeg|png|webp)/gi
  const cdnMatches = [...html.matchAll(cdnPattern)].map(m => m[0]).filter(isRealImageUrl)

  // For each CDN URL, look at surrounding 500 chars for a model slug
  for (const imgUrl of cdnMatches) {
    const idx = html.indexOf(imgUrl)
    const context = html.slice(Math.max(0, idx - 300), idx + imgUrl.length + 200)

    // Extract slug-like tokens from context
    const slugMatches = context.match(/"(?:slug|modelSlug|truckSlug|modelName|name)"\s*:\s*"([^"]{3,60})"/gi)
    if (slugMatches) {
      for (const sm of slugMatches) {
        const val = sm.match(/"([^"]{3,60})"$/)?.[1]?.toLowerCase().replace(/\s+/g, '-')
        if (val && !found.has(val)) found.set(val, imgUrl)
      }
    }
  }

  return found
}

// ── Match storage path to image URL ─────────────────────────────────────────

/**
 * Normalize a model name/slug for matching.
 * e.g. "ape-e-city-fx-new-max" → "apecityfxnewmax"
 */
function normalize(s) {
  return s.toLowerCase()
    .replace(/[-_\s]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

function findBestMatch(storagePath, imageMap) {
  // storagePath like "3w/piaggio/ape-e-city-fx-new-max.jpg"
  const modelSlug = path.basename(storagePath, '.jpg') // "ape-e-city-fx-new-max"
  const normTarget = normalize(modelSlug)

  // Exact slug match first
  if (imageMap.has(modelSlug)) return imageMap.get(modelSlug)

  // Normalized exact match
  for (const [slug, url] of imageMap) {
    if (normalize(slug) === normTarget) return url
  }

  // Partial: stored slug is substring of target or vice versa
  let bestUrl = null
  let bestScore = 0
  for (const [slug, url] of imageMap) {
    const normSlug = normalize(slug)
    // Longer overlap wins
    if (normTarget.includes(normSlug) || normSlug.includes(normTarget)) {
      const score = Math.min(normTarget.length, normSlug.length)
      if (score > bestScore) {
        bestScore = score
        bestUrl = url
      }
    }
  }
  if (bestUrl && bestScore >= 4) return bestUrl

  return null
}

// ── Individual model page fallback ───────────────────────────────────────────

async function tryModelPage(storagePath) {
  // "3w/piaggio/ape-e-city.jpg" → brand=piaggio, model=ape-e-city
  const parts = storagePath.replace('.jpg', '').split('/')
  const brand = parts[1]
  const model = parts[2]

  const urls = [
    `https://trucks.cardekho.com/en/trucks/${brand}/${model}`,
    `https://trucks.cardekho.com/en/trucks/${brand}/${brand}-${model}`,
  ]

  for (const url of urls) {
    try {
      const html = await fetchHtml(url)
      // og:image
      let m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      if (!m) m = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
      if (m && isRealImageUrl(m[1]) && !m[1].includes('cardekho-og')) return m[1]

      // __NEXT_DATA__ from model page
      const nd = extractNextData(html)
      if (nd) {
        const items = collectImages(nd)
        const first = items.find(x => isRealImageUrl(x.imgUrl))
        if (first) return first.imgUrl
      }

      // CDN URL directly
      const cdnPattern = /https:\/\/(?:imgd\.aeplcdn\.com|truckcdn\.cardekho\.com)[^\s"'<>)]+\.(?:jpg|jpeg|png|webp)/i
      const cdnMatch = html.match(cdnPattern)
      if (cdnMatch && isRealImageUrl(cdnMatch[0])) return cdnMatch[0]
    } catch {}
  }
  return null
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nFix Bad Images — ${BAD_PATHS.length} paths to fix\n`)

  // ── Step 1: Identify unique brands needed ────────────────────────────────
  const brandsNeeded = new Set()
  for (const p of BAD_PATHS) {
    const brand = p.split('/')[1]
    brandsNeeded.add(brand)
  }
  console.log(`Brands to fetch: ${[...brandsNeeded].join(', ')}\n`)

  // ── Step 2: Fetch brand listing pages and build image maps ────────────────
  const brandImageMaps = new Map() // brand → Map<slug, imgUrl>

  for (const brand of brandsNeeded) {
    const pageUrl = BRAND_PAGES[brand]
    if (!pageUrl) {
      console.log(`  WARN  No brand page configured for: ${brand}`)
      brandImageMaps.set(brand, new Map())
      continue
    }

    try {
      console.log(`  Fetching brand page: ${pageUrl}`)
      const html = await fetchHtml(pageUrl)
      const imageMap = extractImageUrlsFromHtml(html)
      brandImageMaps.set(brand, imageMap)
      console.log(`    → Found ${imageMap.size} model→image entries`)
    } catch (e) {
      console.log(`  ERR   Brand page ${brand}: ${e.message}`)
      brandImageMaps.set(brand, new Map())
    }

    // Rate-limit brand page fetches
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n')

  // ── Step 3: For each bad path, find and upload the image ──────────────────
  const results = { fixed: [], still_bad: [], skipped: [] }
  const newUrls = {}

  // Process in batches of 3
  for (let i = 0; i < BAD_PATHS.length; i += 3) {
    const batch = BAD_PATHS.slice(i, i + 3)

    await Promise.all(batch.map(async (storagePath) => {
      const brand = storagePath.split('/')[1]
      const imageMap = brandImageMaps.get(brand) || new Map()

      let imgUrl = findBestMatch(storagePath, imageMap)

      // Fallback: try individual model page
      if (!imgUrl) {
        imgUrl = await tryModelPage(storagePath)
        if (imgUrl) {
          console.log(`  FALLBACK model page → ${storagePath}`)
        }
      }

      if (!imgUrl) {
        console.log(`  MISS  ${storagePath} — no image URL found`)
        results.still_bad.push(storagePath)
        return
      }

      // Ensure absolute URL
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl

      try {
        // Download image
        const imgBuf = await fetchBuffer(imgUrl)

        // Validate size
        if (imgBuf.length < MIN_IMAGE_SIZE) {
          console.log(`  SKIP  ${storagePath} — image too small (${imgBuf.length} bytes), still placeholder`)
          results.still_bad.push(storagePath)
          return
        }

        // Upload to Supabase
        const contentType = imgUrl.match(/\.png$/i) ? 'image/png'
          : imgUrl.match(/\.webp$/i) ? 'image/webp'
          : 'image/jpeg'

        const { error } = await supabase.storage.from(BUCKET).upload(storagePath, imgBuf, {
          contentType,
          upsert: true,
        })

        if (error) throw new Error(error.message)

        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`
        newUrls[storagePath] = publicUrl
        results.fixed.push(storagePath)
        console.log(`  OK    ${storagePath} (${Math.round(imgBuf.length / 1024)}KB)`)
      } catch (e) {
        console.log(`  ERR   ${storagePath} — ${e.message}`)
        results.still_bad.push(storagePath)
      }
    }))

    if (i + 3 < BAD_PATHS.length) await new Promise(r => setTimeout(r, 400))
  }

  // ── Step 4: Update vehicle-image-urls.json ───────────────────────────────
  if (Object.keys(newUrls).length > 0) {
    let existingMap = {}
    if (fs.existsSync(URL_MAP_PATH)) {
      try {
        existingMap = JSON.parse(fs.readFileSync(URL_MAP_PATH, 'utf8'))
      } catch {}
    }

    const merged = { ...existingMap, ...newUrls }
    fs.writeFileSync(URL_MAP_PATH, JSON.stringify(merged, null, 2))
    console.log(`\nURL map written/updated: ${URL_MAP_PATH}`)
  }

  // ── Step 5: Final summary ────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════')
  console.log(`  Total to fix : ${BAD_PATHS.length}`)
  console.log(`  Fixed        : ${results.fixed.length}`)
  console.log(`  Still bad    : ${results.still_bad.length}`)
  console.log('══════════════════════════════════════\n')

  if (results.fixed.length > 0) {
    console.log('Fixed:')
    results.fixed.forEach(p => console.log(`  + ${p}`))
  }

  if (results.still_bad.length > 0) {
    console.log('\nStill bad (need manual upload):')
    results.still_bad.forEach(p => console.log(`  - ${p}`))
  }
}

main().catch(console.error)
