/**
 * scrape-vehicle-images.mjs
 * Scrapes primary vehicle images from trucks.cardekho.com
 * and uploads them to Supabase Storage bucket: vehicle-images
 *
 * Usage: node scripts/scrape-vehicle-images.mjs
 */

import { createClient } from '@supabase/supabase-js'
import https from 'https'
import http from 'http'

const SUPABASE_URL = 'https://llsvbyeumrfngjvbedbz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3ZieWV1bXJmbmdqdmJlZGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwODMxNywiZXhwIjoyMDg2ODg0MzE3fQ.NUlqttWkhTpQEcTCLQ7GPLkQvEpoW-6g4UuEPkYJnaE'
const BUCKET = 'vehicle-images'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── Model list: [brandId, cardekhoSlug, modelSlug, storagePath] ──────────────
const MODELS = [
  // Bajaj Auto 3W
  ['bajaj', 'bajaj', 're-compact-4s',              '3w/bajaj/re-compact-4s.jpg'],
  ['bajaj', 'bajaj', 're-e-tec-9',                 '3w/bajaj/re-e-tec-9.jpg'],
  ['bajaj', 'bajaj', 're-optima',                  '3w/bajaj/re-optima.jpg'],
  ['bajaj', 'bajaj', 're-optima-plus',             '3w/bajaj/re-optima-plus.jpg'],
  ['bajaj', 'bajaj', 'maxima-c',                   '3w/bajaj/maxima-c.jpg'],
  ['bajaj', 'bajaj', 'maxima-z',                   '3w/bajaj/maxima-z.jpg'],
  ['bajaj', 'bajaj', 'maxima-x-wide',              '3w/bajaj/maxima-x-wide.jpg'],
  ['bajaj', 'bajaj', 'maxima-xl-cargo-e-tec-9',    '3w/bajaj/maxima-xl-cargo-e-tec-9.jpg'],
  ['bajaj', 'bajaj', 'maxima-xl-cargo-e-tec-12',   '3w/bajaj/maxima-xl-cargo-e-tec-12.jpg'],
  ['bajaj', 'bajaj', 'gogo-p5009',                 '3w/bajaj/gogo-p5009.jpg'],
  ['bajaj', 'bajaj', 'gogo-p5012',                 '3w/bajaj/gogo-p5012.jpg'],
  ['bajaj', 'bajaj', 'gogo-p7012',                 '3w/bajaj/gogo-p7012.jpg'],
  ['bajaj', 'bajaj', 'wego-p9018',                 '3w/bajaj/wego-p9018.jpg'],
  ['bajaj', 'bajaj', 'qute',                       '3w/bajaj/qute.jpg'],
  // Piaggio Ape 3W
  ['piaggio', 'piaggio', 'ape-auto-plus',          '3w/piaggio/ape-auto-plus.jpg'],
  ['piaggio', 'piaggio', 'ape-nxt-plus',           '3w/piaggio/ape-nxt-plus.jpg'],
  ['piaggio', 'piaggio', 'ape-city-plus',          '3w/piaggio/ape-city-plus.jpg'],
  ['piaggio', 'piaggio', 'ape-city-metro',         '3w/piaggio/ape-city-metro.jpg'],
  ['piaggio', 'piaggio', 'ape-auto-dx',            '3w/piaggio/ape-auto-dx.jpg'],
  ['piaggio', 'piaggio', 'ape-auto-ht-dx',         '3w/piaggio/ape-auto-ht-dx.jpg'],
  ['piaggio', 'piaggio', 'ape-xtra-ldx',           '3w/piaggio/ape-xtra-ldx.jpg'],
  ['piaggio', 'piaggio', 'ape-xtra-ldx-plus',      '3w/piaggio/ape-xtra-ldx-plus.jpg'],
  ['piaggio', 'piaggio', 'ape-xtra-classic',       '3w/piaggio/ape-xtra-classic.jpg'],
  ['piaggio', 'piaggio', 'ape-xtra-bada-700',      '3w/piaggio/ape-xtra-bada-700.jpg'],
  ['piaggio', 'piaggio', 'ape-xtra-600',           '3w/piaggio/ape-xtra-600.jpg'],
  ['piaggio', 'piaggio', 'ape-e-xtra-fx',          '3w/piaggio/ape-e-xtra-fx.jpg'],
  ['piaggio', 'piaggio', 'ape-e-xtra-fx-max',      '3w/piaggio/ape-e-xtra-fx-max.jpg'],
  ['piaggio', 'piaggio', 'ape-e-city',             '3w/piaggio/ape-e-city.jpg'],
  ['piaggio', 'piaggio', 'ape-e-city-fx',          '3w/piaggio/ape-e-city-fx.jpg'],
  ['piaggio', 'piaggio', 'ape-e-city-fx-new-max',  '3w/piaggio/ape-e-city-fx-new-max.jpg'],
  ['piaggio', 'piaggio', 'ape-e-city-ultra',       '3w/piaggio/ape-e-city-ultra.jpg'],
  ['piaggio', 'piaggio', 'ape-truk-plus',          '3w/piaggio/ape-truk-plus.jpg'],
  // Mahindra 3W
  ['mahindra', 'mahindra', 'alfa-champ',           '3w/mahindra/alfa-champ.jpg'],
  ['mahindra', 'mahindra', 'alfa-comfy',           '3w/mahindra/alfa-comfy.jpg'],
  ['mahindra', 'mahindra', 'alfa-dx',              '3w/mahindra/alfa-dx.jpg'],
  ['mahindra', 'mahindra', 'alfa-plus',            '3w/mahindra/alfa-plus.jpg'],
  ['mahindra', 'mahindra', 'e-alfa-cargo',         '3w/mahindra/e-alfa-cargo.jpg'],
  ['mahindra', 'mahindra', 'e-alfa-mini',          '3w/mahindra/e-alfa-mini.jpg'],
  ['mahindra', 'mahindra', 'e-alfa-plus',          '3w/mahindra/e-alfa-plus.jpg'],
  ['mahindra', 'mahindra', 'e-alfa-super',         '3w/mahindra/e-alfa-super.jpg'],
  ['mahindra', 'mahindra', 'treo',                 '3w/mahindra/treo.jpg'],
  ['mahindra', 'mahindra', 'treo-plus',            '3w/mahindra/treo-plus.jpg'],
  ['mahindra', 'mahindra', 'treo-yaari',           '3w/mahindra/treo-yaari.jpg'],
  ['mahindra', 'mahindra', 'treo-zor',             '3w/mahindra/treo-zor.jpg'],
  ['mahindra', 'mahindra', 'udo',                  '3w/mahindra/udo.jpg'],
  ['mahindra', 'mahindra', 'zor-grand',            '3w/mahindra/zor-grand.jpg'],
  // TVS King 3W
  ['tvs', 'tvs', 'king-deluxe',                    '3w/tvs/king-deluxe.jpg'],
  ['tvs', 'tvs', 'king-duramax',                   '3w/tvs/king-duramax.jpg'],
  ['tvs', 'tvs', 'king-duramax-plus',              '3w/tvs/king-duramax-plus.jpg'],
  ['tvs', 'tvs', 'king-kargo-cng-hd',              '3w/tvs/king-kargo-cng-hd.jpg'],
  ['tvs', 'tvs', 'king-kargo-hd-ev',              '3w/tvs/king-kargo-hd-ev.jpg'],
  ['tvs', 'tvs', 'king-ev-max',                    '3w/tvs/king-ev-max.jpg'],
  // Euler Motors 3W
  ['euler', 'euler', 'hiload-ev-dv',               '3w/euler/hiload-ev-dv.jpg'],
  ['euler', 'euler', 'hiload-ev-hd',               '3w/euler/hiload-ev-hd.jpg'],
  ['euler', 'euler', 'hiload-ev-pv',               '3w/euler/hiload-ev-pv.jpg'],
  ['euler', 'euler', 'neo-hicity-maxx',            '3w/euler/neo-hicity-maxx.jpg'],
  ['euler', 'euler', 'neo-hicity-plus',            '3w/euler/neo-hicity-plus.jpg'],
  ['euler', 'euler', 'neo-hirange',                '3w/euler/neo-hirange.jpg'],
  ['euler', 'euler', 'storm-ev-t1250',             '3w/euler/storm-ev-t1250.jpg'],
  ['euler', 'euler', 'turbo-ev-1000',              '3w/euler/turbo-ev-1000.jpg'],
  // Atul Auto 3W
  ['atul', 'atul', 'energie',                      '3w/atul/energie.jpg'],
  ['atul', 'atul', 'elite-cargo',                  '3w/atul/elite-cargo.jpg'],
  ['atul', 'atul', 'gem-cargo',                    '3w/atul/gem-cargo.jpg'],
  ['atul', 'atul', 'gem-paxx',                     '3w/atul/gem-paxx.jpg'],
  ['atul', 'atul', 'gemini',                       '3w/atul/gemini.jpg'],
  ['atul', 'atul', 'mobili',                       '3w/atul/mobili.jpg'],
  ['atul', 'atul', 'rik',                          '3w/atul/rik.jpg'],
  ['atul', 'atul', 'shakti-cargo',                 '3w/atul/shakti-cargo.jpg'],
  ['atul', 'atul', 'smart-cargo',                  '3w/atul/smart-cargo.jpg'],
  // Greaves Electric 3W
  ['greaves', 'greaves', 'e-pro-cargo-2100',       '3w/greaves/e-pro-cargo-2100.jpg'],
  ['greaves', 'greaves', 'eltra-city',             '3w/greaves/eltra-city.jpg'],
  ['greaves', 'greaves', 'eltra-ev-cargo-fb',      '3w/greaves/eltra-ev-cargo-fb.jpg'],
  ['greaves', 'greaves', 'eltra-ev-cargo-pu',      '3w/greaves/eltra-ev-cargo-pu.jpg'],
  ['greaves', 'greaves', 'xargo-ev',               '3w/greaves/xargo-ev.jpg'],
  // Kinetic Green 3W
  ['kinetic', 'kinetic', 'safar-jumbo',            '3w/kinetic/safar-jumbo.jpg'],
  ['kinetic', 'kinetic', 'safar-shakti',           '3w/kinetic/safar-shakti.jpg'],
  ['kinetic', 'kinetic', 'safar-smart',            '3w/kinetic/safar-smart.jpg'],
  ['kinetic', 'kinetic', 'super-dx',               '3w/kinetic/super-dx.jpg'],
  // Lohia Auto 3W
  ['lohia', 'lohia', 'comfort-f2f-plus',           '3w/lohia/comfort-f2f-plus.jpg'],
  ['lohia', 'lohia', 'humsafar-iaq',               '3w/lohia/humsafar-iaq.jpg'],
  ['lohia', 'lohia', 'narain-lc',                  '3w/lohia/narain-lc.jpg'],
  ['lohia', 'lohia', 'narain-plus',                '3w/lohia/narain-plus.jpg'],
  ['lohia', 'lohia', 'narain-slc',                 '3w/lohia/narain-slc.jpg'],
  // Altigreen 3W
  ['altigreen', 'altigreen', 'neev-tez',           '3w/altigreen/neev-tez.jpg'],
  ['altigreen', 'altigreen', 'neev-high-deck',     '3w/altigreen/neev-high-deck.jpg'],
  ['altigreen', 'altigreen', 'neev-low-deck',      '3w/altigreen/neev-low-deck.jpg'],
  ['altigreen', 'altigreen', 'neev-rahi',          '3w/altigreen/neev-rahi.jpg'],
  ['altigreen', 'altigreen', 'neev-flatbed',       '3w/altigreen/neev-flatbed.jpg'],
  // Montra Electric 3W
  ['montra', 'montra', 'eviator-e350l',            '3w/montra/eviator-e350l.jpg'],
  ['montra', 'montra', 'eviator-e350x',            '3w/montra/eviator-e350x.jpg'],
  ['montra', 'montra', 'super-auto-epl-2',         '3w/montra/super-auto-epl-2.jpg'],
  ['montra', 'montra', 'super-cargo-ecx',          '3w/montra/super-cargo-ecx.jpg'],
  // Omega Seiki 3W
  ['omega', 'omega', 'nrg',                        '3w/omega/nrg.jpg'],
  ['omega', 'omega', 'rage-plus',                  '3w/omega/rage-plus.jpg'],
  ['omega', 'omega', 'rage-plus-atr',              '3w/omega/rage-plus-atr.jpg'],
  ['omega', 'omega', 'rage-plus-frost',            '3w/omega/rage-plus-frost.jpg'],
  ['omega', 'omega', 'stream',                     '3w/omega/stream.jpg'],
  ['omega', 'omega', 'stream-city',                '3w/omega/stream-city.jpg'],
  ['omega', 'omega', 'swayamgati',                 '3w/omega/swayamgati.jpg'],
  // OSM 3W
  ['osm', 'osm', 'rage-plus-blaze',                '3w/osm/rage-plus-blaze.jpg'],
  ['osm', 'osm', 'rage-plus-flame',                '3w/osm/rage-plus-flame.jpg'],
  ['osm', 'osm', 'rage-plus-frost',                '3w/osm/rage-plus-frost.jpg'],
  ['osm', 'osm', 'stream-city',                    '3w/osm/stream-city.jpg'],
  ['osm', 'osm', 'stream-highway',                 '3w/osm/stream-highway.jpg'],
  // YOUDHA 3W
  ['youdha', 'youdha', 'epod-cargo',               '3w/youdha/epod-cargo.jpg'],
  ['youdha', 'youdha', 'g-van',                    '3w/youdha/g-van.jpg'],
  ['youdha', 'youdha', 'trevo-cargo',              '3w/youdha/trevo-cargo.jpg'],
  ['youdha', 'youdha', 'passenger-e-rickshaw',     '3w/youdha/passenger-e-rickshaw.jpg'],
  // 4W Auto — Tata
  ['tata', 'tata', 'tata-ace-gold',                '4w-auto/tata/ace-gold.jpg'],
  ['tata', 'tata', 'tata-ace-ev',                  '4w-auto/tata/ace-ev.jpg'],
  ['tata', 'tata', 'tata-intra-v10',               '4w-auto/tata/intra-v10.jpg'],
  ['tata', 'tata', 'tata-intra-v20',               '4w-auto/tata/intra-v20.jpg'],
  ['tata', 'tata', 'tata-intra-v30',               '4w-auto/tata/intra-v30.jpg'],
  ['tata', 'tata', 'tata-yodha',                   '4w-auto/tata/yodha.jpg'],
  // 4W Auto — Mahindra
  ['mahindra4w', 'mahindra', 'mahindra-jeeto',     '4w-auto/mahindra/jeeto.jpg'],
  ['mahindra4w', 'mahindra', 'mahindra-supro',     '4w-auto/mahindra/supro.jpg'],
  ['mahindra4w', 'mahindra', 'mahindra-bolero-pikup', '4w-auto/mahindra/bolero-pikup.jpg'],
  ['mahindra4w', 'mahindra', 'mahindra-veero',     '4w-auto/mahindra/veero.jpg'],
  // 4W Auto — Maruti Suzuki
  ['maruti', 'maruti-suzuki', 'super-carry',       '4w-auto/maruti/super-carry.jpg'],
  // 4W Auto — Ashok Leyland
  ['ashok', 'ashok-leyland', 'dost-plus',          '4w-auto/ashok-leyland/dost-plus.jpg'],
  ['ashok', 'ashok-leyland', 'bada-dost',          '4w-auto/ashok-leyland/bada-dost.jpg'],
  // 4W Auto — Eicher
  ['eicher', 'eicher', 'pro-2049',                 '4w-auto/eicher/pro-2049.jpg'],
  ['eicher', 'eicher', 'pro-x-2610',               '4w-auto/eicher/pro-x-2610.jpg'],
  // 4W Auto — Force
  ['force', 'force', 'trump-40',                   '4w-auto/force/trump-40.jpg'],
  ['force', 'force', 'traveller-delivery-van',     '4w-auto/force/traveller-delivery-van.jpg'],
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHtml(res.headers.location).then(resolve).catch(reject)
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })
    req.on('error', reject)
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function extractImageFromHtml(html) {
  // Try og:image first (most reliable)
  let m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  if (!m) m = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  if (m) return m[1]

  // Try first img with a vehicle-looking src
  const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']*(?:vehicle|car|truck|three|auto|ape|bajaj|mahindra|tvs|piaggio|euler|atul|greaves|kinetic|lohia|altigreen|montra|omega|osm|youdha|tata|maruti|eicher|force|ashok)[^"']*)["']/gi)]
  if (imgMatches.length > 0) return imgMatches[0][1]

  // Fallback: first large image URL in page
  const allImgs = [...html.matchAll(/https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|webp)/gi)]
  const filtered = allImgs.map(m => m[0]).filter(u =>
    !u.includes('logo') && !u.includes('icon') && !u.includes('banner') &&
    !u.includes('ad') && !u.includes('sprite')
  )
  return filtered[0] || null
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET)
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) throw new Error(`Cannot create bucket: ${error.message}`)
    console.log(`Created bucket: ${BUCKET}`)
  }
}

async function alreadyUploaded(path) {
  const { data } = await supabase.storage.from(BUCKET).list(path.split('/').slice(0, -1).join('/'))
  const filename = path.split('/').pop()
  return data?.some(f => f.name === filename) ?? false
}

async function processModel(brandId, cardekhoSlug, modelSlug, storagePath) {
  // Skip if already uploaded
  if (await alreadyUploaded(storagePath)) {
    console.log(`  SKIP  ${storagePath} (already exists)`)
    return { status: 'skipped', path: storagePath }
  }

  const url = `https://trucks.cardekho.com/en/trucks/${cardekhoSlug}/${modelSlug}`
  let imgUrl = null

  try {
    const html = await fetchHtml(url)
    imgUrl = extractImageFromHtml(html)
  } catch (e) {
    // Try alternate URL patterns
    try {
      const url2 = `https://trucks.cardekho.com/en/trucks/${cardekhoSlug}/${modelSlug}-price`
      const html2 = await fetchHtml(url2)
      imgUrl = extractImageFromHtml(html2)
    } catch {}
  }

  if (!imgUrl) {
    console.log(`  MISS  ${storagePath} — no image found on page`)
    return { status: 'miss', path: storagePath }
  }

  // Make absolute
  if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl
  if (imgUrl.startsWith('/')) imgUrl = 'https://trucks.cardekho.com' + imgUrl

  try {
    const imgBuf = await fetchBuffer(imgUrl)
    const contentType = imgUrl.match(/\.png$/i) ? 'image/png' :
                        imgUrl.match(/\.webp$/i) ? 'image/webp' : 'image/jpeg'

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, imgBuf, {
      contentType,
      upsert: true,
    })
    if (error) throw new Error(error.message)
    console.log(`  OK    ${storagePath}`)
    return { status: 'ok', path: storagePath }
  } catch (e) {
    console.log(`  ERR   ${storagePath} — ${e.message}`)
    return { status: 'error', path: storagePath, error: e.message }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Setting up Supabase Storage bucket...')
  await ensureBucket()

  console.log(`\nProcessing ${MODELS.length} models...\n`)

  const results = { ok: [], skipped: [], miss: [], error: [] }

  // Process in batches of 5 to avoid rate limiting
  for (let i = 0; i < MODELS.length; i += 5) {
    const batch = MODELS.slice(i, i + 5)
    const batchResults = await Promise.all(
      batch.map(([brandId, cardekhoSlug, modelSlug, storagePath]) =>
        processModel(brandId, cardekhoSlug, modelSlug, storagePath)
      )
    )
    for (const r of batchResults) results[r.status].push(r.path)
    // Small delay between batches
    if (i + 5 < MODELS.length) await new Promise(r => setTimeout(r, 800))
  }

  console.log('\n─────────────────────────────────────')
  console.log(`  Uploaded : ${results.ok.length}`)
  console.log(`  Skipped  : ${results.skipped.length}`)
  console.log(`  Not found: ${results.miss.length}`)
  console.log(`  Errors   : ${results.error.length}`)

  if (results.miss.length > 0) {
    console.log('\nMissing (need manual upload):')
    results.miss.forEach(p => console.log('  -', p))
  }
  if (results.error.length > 0) {
    console.log('\nErrors:')
    results.error.forEach(p => console.log('  -', p))
  }

  // Write public URL map to JSON for use in the app
  const baseUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`
  const urlMap = {}
  for (const path of [...results.ok, ...results.skipped]) {
    urlMap[path] = `${baseUrl}/${path}`
  }
  const fs = await import('fs')
  fs.writeFileSync('./public/data/vehicle-image-urls.json', JSON.stringify(urlMap, null, 2))
  console.log('\nURL map written to public/data/vehicle-image-urls.json')
}

main().catch(console.error)
