/**
 * scrape-missing-images.mjs
 * Retries missed models using alternate URL patterns and image search
 */

import { createClient } from '@supabase/supabase-js'
import https from 'https'
import http from 'http'

const SUPABASE_URL = 'https://llsvbyeumrfngjvbedbz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3ZieWV1bXJmbmdqdmJlZGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwODMxNywiZXhwIjoyMDg2ODg0MzE3fQ.NUlqttWkhTpQEcTCLQ7GPLkQvEpoW-6g4UuEPkYJnaE'
const BUCKET = 'vehicle-images'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Missing models with alternate URL attempts
// Format: [storagePath, ...urlsToTry]
const MISSING = [
  // Bajaj — try brand page variations
  ['3w/bajaj/re-compact-4s.jpg',      'https://trucks.cardekho.com/en/trucks/bajaj/re-compact-4s', 'https://trucks.cardekho.com/en/trucks/bajaj/bajaj-re-compact-4s'],
  ['3w/bajaj/re-e-tec-9.jpg',         'https://trucks.cardekho.com/en/trucks/bajaj/re-e-tec-9-0', 'https://trucks.cardekho.com/en/trucks/bajaj/re-e-tec'],
  ['3w/bajaj/re-optima.jpg',          'https://trucks.cardekho.com/en/trucks/bajaj/re-optima', 'https://trucks.cardekho.com/en/trucks/bajaj/bajaj-re-optima'],
  ['3w/bajaj/re-optima-plus.jpg',     'https://trucks.cardekho.com/en/trucks/bajaj/re-optima-plus', 'https://trucks.cardekho.com/en/trucks/bajaj/bajaj-re-optima-plus'],
  ['3w/bajaj/maxima-z.jpg',           'https://trucks.cardekho.com/en/trucks/bajaj/maxima-z', 'https://trucks.cardekho.com/en/trucks/bajaj/bajaj-maxima-z'],
  ['3w/bajaj/maxima-xl-cargo-e-tec-9.jpg',  'https://trucks.cardekho.com/en/trucks/bajaj/maxima-xl-cargo-e-tec-9-0', 'https://trucks.cardekho.com/en/trucks/bajaj/maxima-xl'],
  ['3w/bajaj/maxima-xl-cargo-e-tec-12.jpg', 'https://trucks.cardekho.com/en/trucks/bajaj/maxima-xl-cargo-e-tec-12-0', 'https://trucks.cardekho.com/en/trucks/bajaj/maxima-xl'],
  ['3w/bajaj/gogo-p5012.jpg',         'https://trucks.cardekho.com/en/trucks/bajaj/gogo-p5012', 'https://trucks.cardekho.com/en/trucks/bajaj/bajaj-gogo-p5012'],
  ['3w/bajaj/wego-p9018.jpg',         'https://trucks.cardekho.com/en/trucks/bajaj/wego-p9018', 'https://trucks.cardekho.com/en/trucks/bajaj/bajaj-wego-p9018'],
  // Piaggio
  ['3w/piaggio/ape-auto-plus.jpg',    'https://trucks.cardekho.com/en/trucks/piaggio/ape-auto-plus', 'https://trucks.cardekho.com/en/trucks/piaggio/piaggio-ape-auto-plus'],
  ['3w/piaggio/ape-auto-dx.jpg',      'https://trucks.cardekho.com/en/trucks/piaggio/ape-auto-dx', 'https://trucks.cardekho.com/en/trucks/piaggio/piaggio-ape-auto-dx'],
  ['3w/piaggio/ape-truk-plus.jpg',    'https://trucks.cardekho.com/en/trucks/piaggio/ape-truk-plus', 'https://trucks.cardekho.com/en/trucks/piaggio/piaggio-ape-truk-plus'],
  // Mahindra
  ['3w/mahindra/alfa-champ.jpg',      'https://trucks.cardekho.com/en/trucks/mahindra/alfa-champ', 'https://trucks.cardekho.com/en/trucks/mahindra/mahindra-alfa-champ'],
  ['3w/mahindra/alfa-comfy.jpg',      'https://trucks.cardekho.com/en/trucks/mahindra/alfa-comfy', 'https://trucks.cardekho.com/en/trucks/mahindra/mahindra-alfa-comfy'],
  ['3w/mahindra/alfa-dx.jpg',         'https://trucks.cardekho.com/en/trucks/mahindra/alfa-dx', 'https://trucks.cardekho.com/en/trucks/mahindra/mahindra-alfa-dx'],
  ['3w/mahindra/alfa-plus.jpg',       'https://trucks.cardekho.com/en/trucks/mahindra/alfa-plus', 'https://trucks.cardekho.com/en/trucks/mahindra/mahindra-alfa-plus'],
  ['3w/mahindra/zor-grand.jpg',       'https://trucks.cardekho.com/en/trucks/mahindra/zor-grand', 'https://trucks.cardekho.com/en/trucks/mahindra/mahindra-zor-grand'],
  // TVS
  ['3w/tvs/king-deluxe.jpg',          'https://trucks.cardekho.com/en/trucks/tvs/king-deluxe', 'https://trucks.cardekho.com/en/trucks/tvs/tvs-king-deluxe'],
  // Euler
  ['3w/euler/hiload-ev-dv.jpg',       'https://trucks.cardekho.com/en/trucks/euler/hiload-ev-dv', 'https://trucks.cardekho.com/en/trucks/euler/hiload-ev'],
  ['3w/euler/hiload-ev-hd.jpg',       'https://trucks.cardekho.com/en/trucks/euler/hiload-ev-hd', 'https://trucks.cardekho.com/en/trucks/euler/hiload-ev'],
  ['3w/euler/hiload-ev-pv.jpg',       'https://trucks.cardekho.com/en/trucks/euler/hiload-ev-pv', 'https://trucks.cardekho.com/en/trucks/euler/hiload-ev'],
  ['3w/euler/neo-hicity-maxx.jpg',    'https://trucks.cardekho.com/en/trucks/euler/neo-hicity-maxx', 'https://trucks.cardekho.com/en/trucks/euler/neo-hicity'],
  ['3w/euler/neo-hicity-plus.jpg',    'https://trucks.cardekho.com/en/trucks/euler/neo-hicity-plus', 'https://trucks.cardekho.com/en/trucks/euler/neo-hicity'],
  ['3w/euler/storm-ev-t1250.jpg',     'https://trucks.cardekho.com/en/trucks/euler/storm-ev-t1250', 'https://trucks.cardekho.com/en/trucks/euler/storm-ev'],
  // Atul
  ['3w/atul/mobili.jpg',              'https://trucks.cardekho.com/en/trucks/atul/mobili', 'https://trucks.cardekho.com/en/trucks/atul/atul-mobili'],
  ['3w/atul/shakti-cargo.jpg',        'https://trucks.cardekho.com/en/trucks/atul/shakti-cargo', 'https://trucks.cardekho.com/en/trucks/atul/atul-shakti'],
  // Greaves
  ['3w/greaves/e-pro-cargo-2100.jpg', 'https://trucks.cardekho.com/en/trucks/greaves/e-pro-cargo', 'https://trucks.cardekho.com/en/trucks/greaves/greaves-e-pro'],
  ['3w/greaves/eltra-ev-cargo-fb.jpg','https://trucks.cardekho.com/en/trucks/greaves/eltra-ev-cargo-fb', 'https://trucks.cardekho.com/en/trucks/greaves/eltra-ev-cargo'],
  ['3w/greaves/eltra-ev-cargo-pu.jpg','https://trucks.cardekho.com/en/trucks/greaves/eltra-ev-cargo-pu', 'https://trucks.cardekho.com/en/trucks/greaves/eltra-ev-cargo'],
  // Kinetic
  ['3w/kinetic/super-dx.jpg',         'https://trucks.cardekho.com/en/trucks/kinetic/super-dx', 'https://trucks.cardekho.com/en/trucks/kinetic/kinetic-super-dx'],
  // Lohia
  ['3w/lohia/comfort-f2f-plus.jpg',   'https://trucks.cardekho.com/en/trucks/lohia/comfort-f2f-plus', 'https://trucks.cardekho.com/en/trucks/lohia/lohia-comfort'],
  ['3w/lohia/narain-lc.jpg',          'https://trucks.cardekho.com/en/trucks/lohia/narain-lc', 'https://trucks.cardekho.com/en/trucks/lohia/lohia-narain-lc'],
  // Montra
  ['3w/montra/eviator-e350l.jpg',     'https://trucks.cardekho.com/en/trucks/montra/eviator-e350l', 'https://trucks.cardekho.com/en/trucks/montra/montra-eviator'],
  ['3w/montra/eviator-e350x.jpg',     'https://trucks.cardekho.com/en/trucks/montra/eviator-e350x', 'https://trucks.cardekho.com/en/trucks/montra/montra-eviator'],
  ['3w/montra/super-auto-epl-2.jpg',  'https://trucks.cardekho.com/en/trucks/montra/super-auto-epl-2-0', 'https://trucks.cardekho.com/en/trucks/montra/montra-super-auto'],
  ['3w/montra/super-cargo-ecx.jpg',   'https://trucks.cardekho.com/en/trucks/montra/super-cargo-ecx-d-plus', 'https://trucks.cardekho.com/en/trucks/montra/montra-super-cargo'],
  // Omega
  ['3w/omega/nrg.jpg',                'https://trucks.cardekho.com/en/trucks/omega/nrg', 'https://trucks.cardekho.com/en/trucks/omega-seiki/nrg'],
  ['3w/omega/rage-plus.jpg',          'https://trucks.cardekho.com/en/trucks/omega/rage-plus', 'https://trucks.cardekho.com/en/trucks/omega-seiki/rage-plus'],
  ['3w/omega/rage-plus-atr.jpg',      'https://trucks.cardekho.com/en/trucks/omega/rage-plus-atr', 'https://trucks.cardekho.com/en/trucks/omega-seiki/rage-plus-atr'],
  ['3w/omega/rage-plus-frost.jpg',    'https://trucks.cardekho.com/en/trucks/omega/rage-plus-frost', 'https://trucks.cardekho.com/en/trucks/omega-seiki/rage-plus-frost'],
  ['3w/omega/stream.jpg',             'https://trucks.cardekho.com/en/trucks/omega/stream', 'https://trucks.cardekho.com/en/trucks/omega-seiki/stream'],
  ['3w/omega/stream-city.jpg',        'https://trucks.cardekho.com/en/trucks/omega/stream-city', 'https://trucks.cardekho.com/en/trucks/omega-seiki/stream-city'],
  ['3w/omega/swayamgati.jpg',         'https://trucks.cardekho.com/en/trucks/omega/swayamgati', 'https://trucks.cardekho.com/en/trucks/omega-seiki/swayamgati'],
  // OSM
  ['3w/osm/rage-plus-blaze.jpg',      'https://trucks.cardekho.com/en/trucks/osm/rage-plus-blaze', 'https://trucks.cardekho.com/en/trucks/osm/osm-rage-plus'],
  ['3w/osm/rage-plus-flame.jpg',      'https://trucks.cardekho.com/en/trucks/osm/rage-plus-flame', 'https://trucks.cardekho.com/en/trucks/osm/osm-rage-plus-flame'],
  ['3w/osm/stream-highway.jpg',       'https://trucks.cardekho.com/en/trucks/osm/stream-highway', 'https://trucks.cardekho.com/en/trucks/osm/osm-stream'],
  // YOUDHA
  ['3w/youdha/epod-cargo.jpg',        'https://trucks.cardekho.com/en/trucks/youdha/epod-cargo', 'https://trucks.cardekho.com/en/trucks/youdha/youdha-epod'],
  ['3w/youdha/passenger-e-rickshaw.jpg', 'https://trucks.cardekho.com/en/trucks/youdha/passenger-e-rickshaw', 'https://trucks.cardekho.com/en/trucks/youdha/youdha-e-rickshaw'],
  // 4W Auto — Tata
  ['4w-auto/tata/ace-gold.jpg',       'https://trucks.cardekho.com/en/trucks/tata/ace-gold', 'https://trucks.cardekho.com/en/trucks/tata/tata-ace-gold'],
  ['4w-auto/tata/ace-ev.jpg',         'https://trucks.cardekho.com/en/trucks/tata/ace-ev', 'https://trucks.cardekho.com/en/trucks/tata/tata-ace-ev'],
  ['4w-auto/tata/intra-v10.jpg',      'https://trucks.cardekho.com/en/trucks/tata/intra-v10', 'https://trucks.cardekho.com/en/trucks/tata/tata-intra-v10'],
  ['4w-auto/tata/intra-v20.jpg',      'https://trucks.cardekho.com/en/trucks/tata/intra-v20', 'https://trucks.cardekho.com/en/trucks/tata/tata-intra-v20'],
  ['4w-auto/tata/intra-v30.jpg',      'https://trucks.cardekho.com/en/trucks/tata/intra-v30', 'https://trucks.cardekho.com/en/trucks/tata/tata-intra-v30'],
  ['4w-auto/tata/yodha.jpg',          'https://trucks.cardekho.com/en/trucks/tata/yodha', 'https://trucks.cardekho.com/en/trucks/tata/tata-yodha'],
  // 4W Auto — Mahindra
  ['4w-auto/mahindra/jeeto.jpg',      'https://trucks.cardekho.com/en/trucks/mahindra/jeeto', 'https://trucks.cardekho.com/en/trucks/mahindra/mahindra-jeeto'],
  ['4w-auto/mahindra/supro.jpg',      'https://trucks.cardekho.com/en/trucks/mahindra/supro', 'https://trucks.cardekho.com/en/trucks/mahindra/mahindra-supro'],
  ['4w-auto/mahindra/bolero-pikup.jpg','https://trucks.cardekho.com/en/trucks/mahindra/bolero-pik-up', 'https://trucks.cardekho.com/en/trucks/mahindra/bolero-pikup'],
  ['4w-auto/mahindra/veero.jpg',      'https://trucks.cardekho.com/en/trucks/mahindra/veero', 'https://trucks.cardekho.com/en/trucks/mahindra/mahindra-veero'],
  // Ashok Leyland
  ['4w-auto/ashok-leyland/dost-plus.jpg', 'https://trucks.cardekho.com/en/trucks/ashok-leyland/dost-plus', 'https://trucks.cardekho.com/en/trucks/ashok-leyland/dost'],
  // Eicher
  ['4w-auto/eicher/pro-x-2610.jpg',   'https://trucks.cardekho.com/en/trucks/eicher/pro-x-2610', 'https://trucks.cardekho.com/en/trucks/eicher/eicher-pro-x'],
]

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
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

function extractImage(html) {
  // og:image
  let m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  if (!m) m = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  if (m && m[1] && !m[1].includes('logo') && m[1].length > 20) return m[1]

  // JSON-LD image
  const ldMatch = html.match(/"image"\s*:\s*"(https?:[^"]+\.(?:jpg|jpeg|png|webp))"/i)
  if (ldMatch) return ldMatch[1]

  // Any CDN image URL from the page
  const cdnPattern = /https?:\/\/[^\s"']*(?:imgd\.cardekho|stimg\.cardekho|imgstg)[^\s"']*\.(?:jpg|jpeg|png|webp)/gi
  const cdnMatches = [...html.matchAll(cdnPattern)].map(m => m[0])
  if (cdnMatches.length > 0) return cdnMatches[0]

  return null
}

async function processOne(storagePath, urls) {
  let imgUrl = null
  for (const url of urls) {
    try {
      const html = await fetchHtml(url)
      imgUrl = extractImage(html)
      if (imgUrl) break
    } catch {}
  }

  if (!imgUrl) {
    console.log(`  MISS  ${storagePath}`)
    return false
  }

  if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl
  if (imgUrl.startsWith('/')) imgUrl = 'https://trucks.cardekho.com' + imgUrl

  try {
    const buf = await fetchBuffer(imgUrl)
    const ct = imgUrl.match(/\.png$/i) ? 'image/png' : imgUrl.match(/\.webp$/i) ? 'image/webp' : 'image/jpeg'
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buf, { contentType: ct, upsert: true })
    if (error) throw new Error(error.message)
    console.log(`  OK    ${storagePath}`)
    return true
  } catch (e) {
    console.log(`  ERR   ${storagePath} — ${e.message}`)
    return false
  }
}

async function main() {
  console.log(`Retrying ${MISSING.length} missing models...\n`)
  let ok = 0, miss = 0

  for (let i = 0; i < MISSING.length; i += 4) {
    const batch = MISSING.slice(i, i + 4)
    const results = await Promise.all(batch.map(([path, ...urls]) => processOne(path, urls)))
    results.forEach(r => r ? ok++ : miss++)
    if (i + 4 < MISSING.length) await new Promise(r => setTimeout(r, 600))
  }

  console.log(`\n──────────────────────────`)
  console.log(`  Uploaded: ${ok}`)
  console.log(`  Still missing: ${miss}`)

  // Update the URL map
  const { data: files } = await supabase.storage.from(BUCKET).list('3w', { limit: 1000 })
  const fs = await import('fs')
  const existing = JSON.parse(fs.readFileSync('./public/data/vehicle-image-urls.json', 'utf8'))
  const base = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

  // Add newly uploaded ones
  for (const [path] of MISSING) {
    existing[path] = `${base}/${path}`
  }
  fs.writeFileSync('./public/data/vehicle-image-urls.json', JSON.stringify(existing, null, 2))
  console.log('URL map updated.')
}

main().catch(console.error)
