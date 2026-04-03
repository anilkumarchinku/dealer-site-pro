/**
 * scrape-official-images.mjs
 * Downloads vehicle images from official brand websites and uploads to Supabase Storage.
 * Priority: og:image > JSON-LD image > CDN URLs (imgd.aeplcdn.com, stimg.cardekho.com, imgd.cardekho.com) > first vehicle img
 * Batch size: 4 with 600ms delay between batches.
 */

import { createClient } from '@supabase/supabase-js'
import https from 'https'
import http from 'http'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_URL = 'https://llsvbyeumrfngjvbedbz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3ZieWV1bXJmbmdqdmJlZGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwODMxNywiZXhwIjoyMDg2ODg0MzE3fQ.NUlqttWkhTpQEcTCLQ7GPLkQvEpoW-6g4UuEPkYJnaE'
const BUCKET = 'vehicle-images'
const BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`
const URL_MAP_PATH = path.join(__dirname, '../public/data/vehicle-image-urls.json')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const MISSING = [
  // Bajaj — https://www.bajajauto.com/three-wheelers
  { path: '3w/bajaj/re-compact-4s.jpg', urls: [
    'https://www.bajajauto.com/three-wheelers/re-compact-4s',
    'https://www.bajajauto.com/three-wheelers',
    'https://trucks.cardekho.com/en/trucks/bajaj/bajaj-re-compact-4s-price',
  ]},
  { path: '3w/bajaj/re-optima.jpg', urls: [
    'https://www.bajajauto.com/three-wheelers/re-optima',
    'https://www.bajajauto.com/three-wheelers',
    'https://trucks.cardekho.com/en/trucks/bajaj/re-optima',
  ]},
  { path: '3w/bajaj/re-optima-plus.jpg', urls: [
    'https://www.bajajauto.com/three-wheelers/re-optima-plus',
    'https://www.bajajauto.com/three-wheelers',
    'https://trucks.cardekho.com/en/trucks/bajaj/re-optima-plus',
  ]},
  { path: '3w/bajaj/maxima-z.jpg', urls: [
    'https://www.bajajauto.com/three-wheelers/maxima-z',
    'https://www.bajajauto.com/three-wheelers/maxima',
    'https://trucks.cardekho.com/en/trucks/bajaj/maxima-z',
  ]},
  { path: '3w/bajaj/maxima-xl-cargo-e-tec-9.jpg', urls: [
    'https://www.bajajauto.com/three-wheelers/maxima-xl',
    'https://www.bajajauto.com/three-wheelers/re-e-tec',
    'https://trucks.cardekho.com/en/trucks/bajaj/maxima-xl-cargo-e-tec-9-0',
  ]},
  { path: '3w/bajaj/gogo-p5012.jpg', urls: [
    'https://www.bajajauto.com/three-wheelers/gogo',
    'https://www.bajajauto.com/three-wheelers',
    'https://trucks.cardekho.com/en/trucks/bajaj/gogo-p5012',
  ]},
  { path: '3w/bajaj/wego-p9018.jpg', urls: [
    'https://www.bajajauto.com/three-wheelers/wego',
    'https://www.bajajauto.com/three-wheelers',
    'https://trucks.cardekho.com/en/trucks/bajaj/wego-p9018',
  ]},
  // Piaggio — https://www.piaggiovehicles.com/
  { path: '3w/piaggio/ape-auto-plus.jpg', urls: [
    'https://www.piaggiovehicles.com/ape-auto-plus',
    'https://www.piaggiovehicles.com/passenger',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/130813/ape-auto-plus-exterior-right-front-three-quarter.jpeg',
    'https://trucks.cardekho.com/en/trucks/piaggio/ape-auto-plus',
  ]},
  { path: '3w/piaggio/ape-auto-dx.jpg', urls: [
    'https://www.piaggiovehicles.com/ape-auto-dx',
    'https://www.piaggiovehicles.com/passenger',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/130813/ape-auto-dx-exterior-right-front-three-quarter.jpeg',
    'https://trucks.cardekho.com/en/trucks/piaggio/ape-auto-dx',
  ]},
  { path: '3w/piaggio/ape-truk-plus.jpg', urls: [
    'https://www.piaggiovehicles.com/ape-truk-plus',
    'https://www.piaggiovehicles.com/cargo',
    'https://trucks.cardekho.com/en/trucks/piaggio/ape-truk-plus',
  ]},
  // Mahindra — https://auto.mahindra.com/
  { path: '3w/mahindra/alfa-champ.jpg', urls: [
    'https://auto.mahindra.com/three-wheeler/alfa-champ',
    'https://auto.mahindra.com/three-wheeler',
    'https://trucks.cardekho.com/en/trucks/mahindra/alfa-champ',
  ]},
  { path: '3w/mahindra/alfa-comfy.jpg', urls: [
    'https://auto.mahindra.com/three-wheeler/alfa-comfy',
    'https://auto.mahindra.com/three-wheeler',
    'https://trucks.cardekho.com/en/trucks/mahindra/alfa-comfy',
  ]},
  { path: '3w/mahindra/alfa-dx.jpg', urls: [
    'https://auto.mahindra.com/three-wheeler/alfa-dx',
    'https://auto.mahindra.com/three-wheeler/alfa',
    'https://trucks.cardekho.com/en/trucks/mahindra/alfa-dx',
  ]},
  { path: '3w/mahindra/alfa-plus.jpg', urls: [
    'https://auto.mahindra.com/three-wheeler/alfa-plus',
    'https://auto.mahindra.com/three-wheeler/alfa',
    'https://trucks.cardekho.com/en/trucks/mahindra/alfa-plus',
  ]},
  { path: '3w/mahindra/zor-grand.jpg', urls: [
    'https://auto.mahindra.com/three-wheeler/zor-grand',
    'https://auto.mahindra.com/electric-three-wheeler/zor-grand',
    'https://trucks.cardekho.com/en/trucks/mahindra/zor-grand',
  ]},
  // TVS
  { path: '3w/tvs/king-deluxe.jpg', urls: [
    'https://www.tvsmotor.com/three-wheelers/tvs-king-deluxe',
    'https://www.tvsmotor.com/three-wheelers',
    'https://trucks.cardekho.com/en/trucks/tvs/king-deluxe',
  ]},
  // Euler Motors
  { path: '3w/euler/hiload-ev-dv.jpg', urls: [
    'https://eulermotors.in/hiload-ev',
    'https://eulermotors.in/products/hiload',
    'https://trucks.cardekho.com/en/trucks/euler/hiload-ev-dv',
  ]},
  { path: '3w/euler/hiload-ev-hd.jpg', urls: [
    'https://eulermotors.in/hiload-ev',
    'https://eulermotors.in/products/hiload',
    'https://trucks.cardekho.com/en/trucks/euler/hiload-ev-hd',
  ]},
  { path: '3w/euler/hiload-ev-pv.jpg', urls: [
    'https://eulermotors.in/hiload-ev',
    'https://eulermotors.in/products/hiload',
    'https://trucks.cardekho.com/en/trucks/euler/hiload-ev-pv',
  ]},
  // Atul
  { path: '3w/atul/mobili.jpg', urls: [
    'https://www.atulauto.co.in/products/mobili',
    'https://www.atulauto.co.in/three-wheelers',
    'https://trucks.cardekho.com/en/trucks/atul/mobili',
  ]},
  { path: '3w/atul/shakti-cargo.jpg', urls: [
    'https://www.atulauto.co.in/products/shakti',
    'https://www.atulauto.co.in/three-wheelers',
    'https://trucks.cardekho.com/en/trucks/atul/shakti-cargo',
  ]},
  // Greaves Electric
  { path: '3w/greaves/eltra-ev-cargo-fb.jpg', urls: [
    'https://greaveselectric.in/eltra-ev-cargo',
    'https://greaveselectric.in/cargo',
    'https://trucks.cardekho.com/en/trucks/greaves/eltra-ev-cargo-fb',
  ]},
  { path: '3w/greaves/eltra-ev-cargo-pu.jpg', urls: [
    'https://greaveselectric.in/eltra-ev-cargo',
    'https://greaveselectric.in/cargo',
    'https://trucks.cardekho.com/en/trucks/greaves/eltra-ev-cargo-pu',
  ]},
  // Kinetic Green
  { path: '3w/kinetic/super-dx.jpg', urls: [
    'https://kineticgreen.in/products/super-dx',
    'https://kineticgreen.in/three-wheelers',
    'https://trucks.cardekho.com/en/trucks/kinetic/super-dx',
  ]},
  // Lohia Auto
  { path: '3w/lohia/comfort-f2f-plus.jpg', urls: [
    'https://lohiaauto.com/comfort-f2f',
    'https://lohiaauto.com/products',
    'https://trucks.cardekho.com/en/trucks/lohia/comfort-f2f-plus',
  ]},
  { path: '3w/lohia/narain-lc.jpg', urls: [
    'https://lohiaauto.com/narain',
    'https://lohiaauto.com/products',
    'https://trucks.cardekho.com/en/trucks/lohia/narain-lc',
  ]},
  // Montra Electric
  { path: '3w/montra/eviator-e350l.jpg', urls: [
    'https://montraelectric.com/eviator',
    'https://montraelectric.com/products',
    'https://trucks.cardekho.com/en/trucks/montra/eviator-e350l',
  ]},
  { path: '3w/montra/eviator-e350x.jpg', urls: [
    'https://montraelectric.com/eviator',
    'https://montraelectric.com/products',
    'https://trucks.cardekho.com/en/trucks/montra/eviator-e350x',
  ]},
  { path: '3w/montra/super-auto-epl-2.jpg', urls: [
    'https://montraelectric.com/super-auto',
    'https://montraelectric.com/products',
    'https://trucks.cardekho.com/en/trucks/montra/super-auto-epl-2-0',
  ]},
  { path: '3w/montra/super-cargo-ecx.jpg', urls: [
    'https://montraelectric.com/super-cargo',
    'https://montraelectric.com/products',
    'https://trucks.cardekho.com/en/trucks/montra/super-cargo-ecx-d-plus',
  ]},
  // Omega Seiki
  { path: '3w/omega/nrg.jpg', urls: [
    'https://www.omegaseiki.com/nrg',
    'https://www.omegaseiki.com/products',
    'https://trucks.cardekho.com/en/trucks/omega/nrg',
    'https://trucks.cardekho.com/en/trucks/omega-seiki/nrg',
  ]},
  { path: '3w/omega/rage-plus.jpg', urls: [
    'https://www.omegaseiki.com/rage-plus',
    'https://www.omegaseiki.com/products',
    'https://trucks.cardekho.com/en/trucks/omega/rage-plus',
    'https://trucks.cardekho.com/en/trucks/omega-seiki/rage-plus',
  ]},
  { path: '3w/omega/rage-plus-atr.jpg', urls: [
    'https://www.omegaseiki.com/rage-plus-atr',
    'https://www.omegaseiki.com/products',
    'https://trucks.cardekho.com/en/trucks/omega/rage-plus-atr',
    'https://trucks.cardekho.com/en/trucks/omega-seiki/rage-plus-atr',
  ]},
  { path: '3w/omega/rage-plus-frost.jpg', urls: [
    'https://www.omegaseiki.com/rage-plus-frost',
    'https://www.omegaseiki.com/products',
    'https://trucks.cardekho.com/en/trucks/omega/rage-plus-frost',
    'https://trucks.cardekho.com/en/trucks/omega-seiki/rage-plus-frost',
  ]},
  { path: '3w/omega/stream.jpg', urls: [
    'https://www.omegaseiki.com/stream',
    'https://www.omegaseiki.com/products',
    'https://trucks.cardekho.com/en/trucks/omega/stream',
    'https://trucks.cardekho.com/en/trucks/omega-seiki/stream',
  ]},
  { path: '3w/omega/stream-city.jpg', urls: [
    'https://www.omegaseiki.com/stream-city',
    'https://www.omegaseiki.com/products',
    'https://trucks.cardekho.com/en/trucks/omega/stream-city',
    'https://trucks.cardekho.com/en/trucks/omega-seiki/stream-city',
  ]},
  { path: '3w/omega/swayamgati.jpg', urls: [
    'https://www.omegaseiki.com/swayamgati',
    'https://www.omegaseiki.com/products',
    'https://trucks.cardekho.com/en/trucks/omega/swayamgati',
    'https://trucks.cardekho.com/en/trucks/omega-seiki/swayamgati',
  ]},
  // OSM
  { path: '3w/osm/rage-plus-blaze.jpg', urls: [
    'https://www.osmvehicles.com/rage-plus-blaze',
    'https://www.osmvehicles.com/products',
    'https://trucks.cardekho.com/en/trucks/osm/rage-plus-blaze',
  ]},
  { path: '3w/osm/rage-plus-flame.jpg', urls: [
    'https://www.osmvehicles.com/rage-plus-flame',
    'https://www.osmvehicles.com/products',
    'https://trucks.cardekho.com/en/trucks/osm/rage-plus-flame',
  ]},
  { path: '3w/osm/stream-highway.jpg', urls: [
    'https://www.osmvehicles.com/stream-highway',
    'https://www.osmvehicles.com/products',
    'https://trucks.cardekho.com/en/trucks/osm/stream-highway',
  ]},
  // YOUDHA
  { path: '3w/youdha/epod-cargo.jpg', urls: [
    'https://youdha.in/epod',
    'https://youdha.in/products',
    'https://trucks.cardekho.com/en/trucks/youdha/epod-cargo',
  ]},
  { path: '3w/youdha/passenger-e-rickshaw.jpg', urls: [
    'https://youdha.in/passenger',
    'https://youdha.in/products',
    'https://trucks.cardekho.com/en/trucks/youdha/passenger-e-rickshaw',
  ]},
  // Tata
  { path: '4w-auto/tata/intra-v30.jpg', urls: [
    'https://www.tatamotors.com/cars/intra-v30',
    'https://trucks.cardekho.com/en/trucks/tata/tata-intra-v30-bs6-price',
    'https://trucks.cardekho.com/en/trucks/tata/intra-v30-bs6',
    'https://trucks.cardekho.com/en/trucks/tata/intra-v30',
  ]},
  // Mahindra 4W
  { path: '4w-auto/mahindra/supro.jpg', urls: [
    'https://auto.mahindra.com/commercial-vehicles/supro',
    'https://auto.mahindra.com/trucks/supro-profit-truck-mini',
    'https://trucks.cardekho.com/en/trucks/mahindra/supro',
  ]},
  // Eicher
  { path: '4w-auto/eicher/pro-x-2610.jpg', urls: [
    'https://www.eichermotors.com/light-commercial-vehicles/pro-x',
    'https://trucks.cardekho.com/en/trucks/eicher/pro-x-2610-price',
    'https://trucks.cardekho.com/en/trucks/eicher/pro-x-2610',
  ]},
]

// ─── HTTP helpers ────────────────────────────────────────────────────────────

function fetchHtml(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'))
    const parsedUrl = new URL(url)
    const client = parsedUrl.protocol === 'https:' ? https : http
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      }
    }
    const req = client.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : `${parsedUrl.protocol}//${parsedUrl.hostname}${res.headers.location}`
        res.resume()
        return fetchHtml(redirectUrl, redirectCount + 1).then(resolve).catch(reject)
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')) })
    req.end()
  })
}

function fetchBuffer(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'))
    const parsedUrl = new URL(url)
    const client = parsedUrl.protocol === 'https:' ? https : http
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/webp,image/jpeg,image/png,image/*,*/*;q=0.8',
        'Referer': `${parsedUrl.protocol}//${parsedUrl.hostname}/`,
        'Accept-Encoding': 'identity',
      }
    }
    const req = client.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : `${parsedUrl.protocol}//${parsedUrl.hostname}${res.headers.location}`
        res.resume()
        return fetchBuffer(redirectUrl, redirectCount + 1).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        res.resume()
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.setTimeout(25000, () => { req.destroy(); reject(new Error('timeout')) })
    req.end()
  })
}

// ─── Image extraction ────────────────────────────────────────────────────────

function extractImageFromHtml(html, pageUrl) {
  // 1. og:image meta tag
  const ogPatterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+property=["']og:image:url["'][^>]+content=["']([^"']+)["']/i,
  ]
  for (const pat of ogPatterns) {
    const m = html.match(pat)
    if (m && m[1] && !isLogoOrIcon(m[1]) && m[1].length > 20) {
      return normalizeUrl(m[1], pageUrl)
    }
  }

  // 2. JSON-LD "image" field
  const ldMatches = [...html.matchAll(/"image"\s*:\s*"(https?:[^"]+\.(?:jpg|jpeg|png|webp))"/gi)]
  for (const m of ldMatches) {
    if (!isLogoOrIcon(m[1])) return m[1]
  }

  // 3. CDN image URLs — imgd.aeplcdn.com, stimg.cardekho.com, imgd.cardekho.com
  const cdnPattern = /https?:\/\/(?:imgd\.aeplcdn\.com|stimg\.cardekho\.com|imgd\.cardekho\.com)[^\s"'<>]+\.(?:jpg|jpeg|png|webp)(?:[?#][^\s"'<>]*)?/gi
  const cdnMatches = [...html.matchAll(cdnPattern)].map(m => m[0])
  if (cdnMatches.length > 0) return cdnMatches[0]

  // 4. First img src that looks like a vehicle photo (not logo/icon/banner)
  const imgPattern = /<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi
  const imgMatches = [...html.matchAll(imgPattern)]
  for (const m of imgMatches) {
    const src = m[1]
    if (!isLogoOrIcon(src) && isLikelyVehicle(src)) {
      return normalizeUrl(src, pageUrl)
    }
  }

  // 5. Any sufficiently large image URL found anywhere in the page
  const anyImgPattern = /["'](https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp))["']/gi
  const anyMatches = [...html.matchAll(anyImgPattern)].map(m => m[1])
  for (const src of anyMatches) {
    if (!isLogoOrIcon(src) && src.length > 40) {
      return src
    }
  }

  return null
}

function isLogoOrIcon(url) {
  const lower = url.toLowerCase()
  return (
    lower.includes('logo') ||
    lower.includes('icon') ||
    lower.includes('favicon') ||
    lower.includes('sprite') ||
    lower.includes('banner') ||
    lower.includes('placeholder') ||
    lower.includes('avatar') ||
    lower.includes('profile') ||
    lower.includes('close') ||
    lower.includes('globe') ||
    lower.includes('arrow') ||
    lower.includes('header') ||
    lower.includes('footer') ||
    lower.includes('bg.') ||
    lower.includes('background') ||
    lower.includes('social') ||
    lower.includes('whatsapp') ||
    lower.includes('facebook') ||
    lower.includes('twitter') ||
    lower.includes('youtube') ||
    lower.includes('instagram') ||
    lower.includes('/images/header/') ||
    lower.includes('/images/footer/') ||
    lower.includes('/images/icons/') ||
    lower.includes('/images/ui/') ||
    lower.includes('/themes/') ||
    lower.includes('/wp-content/themes/') ||
    (lower.match(/\d+x\d+/) && !lower.match(/\d{3,}x\d{3,}/)) // tiny dimensions
  )
}

function isLikelyVehicle(url) {
  const lower = url.toLowerCase()
  return (
    lower.includes('vehicle') ||
    lower.includes('bike') ||
    lower.includes('scooter') ||
    lower.includes('auto') ||
    lower.includes('truck') ||
    lower.includes('three-wheel') ||
    lower.includes('cargo') ||
    lower.includes('ev') ||
    lower.includes('electric') ||
    lower.includes('product') ||
    lower.match(/\/[a-z-]+-(?:image|photo|pic)/) ||
    lower.match(/vehicles?\//i) ||
    lower.match(/(?:exterior|front|side|rear)/)
  )
}

function normalizeUrl(url, pageUrl) {
  if (url.startsWith('//')) return 'https:' + url
  if (url.startsWith('/') && pageUrl) {
    try {
      const base = new URL(pageUrl)
      return `${base.protocol}//${base.hostname}${url}`
    } catch {}
  }
  return url
}

function getContentType(url) {
  const lower = url.toLowerCase().split('?')[0]
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif')) return 'image/gif'
  return 'image/jpeg'
}

// ─── Direct image URL detection ──────────────────────────────────────────────

function isDirectImageUrl(url) {
  const lower = url.toLowerCase().split('?')[0]
  return (
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.webp') ||
    lower.includes('imgd.aeplcdn.com') ||
    lower.includes('stimg.cardekho.com') ||
    lower.includes('imgd.cardekho.com')
  )
}

// ─── Process one model ───────────────────────────────────────────────────────

async function processOne({ path: storagePath, urls }) {
  let imgUrl = null

  for (const url of urls) {
    // If the URL is already a direct image (CDN link), use it directly
    if (isDirectImageUrl(url)) {
      imgUrl = url
      console.log(`  DIRECT  ${storagePath} — ${url.substring(0, 80)}`)
      break
    }

    try {
      console.log(`  FETCH   ${storagePath} — ${url.substring(0, 70)}`)
      const html = await fetchHtml(url)
      const found = extractImageFromHtml(html, url)
      if (found) {
        imgUrl = found
        console.log(`  FOUND   ${storagePath} — ${found.substring(0, 80)}`)
        break
      }
    } catch (e) {
      console.log(`  SKIP    ${url.substring(0, 70)} — ${e.message}`)
    }
  }

  if (!imgUrl) {
    console.log(`  MISS    ${storagePath} — no image found in any URL`)
    return { path: storagePath, ok: false }
  }

  // Normalize the image URL
  if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl

  try {
    const buf = await fetchBuffer(imgUrl)
    if (buf.length < 1000) {
      throw new Error(`Image too small (${buf.length} bytes) — likely placeholder`)
    }
    const ct = getContentType(imgUrl)
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buf, {
      contentType: ct,
      upsert: true,
    })
    if (error) throw new Error(error.message)
    console.log(`  OK      ${storagePath} (${(buf.length / 1024).toFixed(0)} KB)`)
    return { path: storagePath, ok: true }
  } catch (e) {
    console.log(`  ERR     ${storagePath} — ${e.message}`)
    return { path: storagePath, ok: false }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nScraping ${MISSING.length} vehicle images from official brand sites...\n`)
  console.log('─'.repeat(60))

  const results = []

  for (let i = 0; i < MISSING.length; i += 4) {
    const batch = MISSING.slice(i, i + 4)
    const batchNum = Math.floor(i / 4) + 1
    const totalBatches = Math.ceil(MISSING.length / 4)
    console.log(`\n[Batch ${batchNum}/${totalBatches}]`)
    const batchResults = await Promise.all(batch.map(item => processOne(item)))
    results.push(...batchResults)
    if (i + 4 < MISSING.length) {
      await new Promise(r => setTimeout(r, 600))
    }
  }

  // ─── Update vehicle-image-urls.json ────────────────────────────────────────

  const urlMap = JSON.parse(readFileSync(URL_MAP_PATH, 'utf8'))
  const uploaded = results.filter(r => r.ok)
  const failed = results.filter(r => !r.ok)

  for (const { path: p } of uploaded) {
    urlMap[p] = `${BASE_URL}/${p}`
  }

  writeFileSync(URL_MAP_PATH, JSON.stringify(urlMap, null, 2))
  console.log(`\nURL map updated: ${URL_MAP_PATH}`)

  // ─── Summary ───────────────────────────────────────────────────────────────

  console.log('\n' + '═'.repeat(60))
  console.log(`  Uploaded:       ${uploaded.length} / ${MISSING.length}`)
  console.log(`  Still failed:   ${failed.length}`)
  if (failed.length > 0) {
    console.log('\n  Failed paths:')
    for (const { path: p } of failed) {
      console.log(`    - ${p}`)
    }
  }
  console.log('═'.repeat(60) + '\n')
}

main().catch(console.error)
