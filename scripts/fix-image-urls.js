/**
 * fix-image-urls.js
 * Updates vehicle-image-urls.json to use local file paths instead of
 * broken Supabase CDN URLs, wherever local images already exist.
 * Run after scrape_truck_model_images.js to pick up newly downloaded files.
 */

const fs = require('fs');
const path = require('path');

// Maps the SHORT brand folder name (used in JSON keys) to the FULL folder name
// (used in public/images/3w/ and public/images/4w-auto/)
const BRAND_DIR_3W = {
  'bajaj':        'bajaj-auto-3w',
  'piaggio':      'piaggio-ape',
  'mahindra':     'mahindra-3w',
  'tvs':          'tvs-king',
  'euler':        'euler-motors',
  'atul':         'atul-auto',
  'greaves':      'greaves-electric-3w',
  'kinetic':      'kinetic-green',
  'lohia':        'lohia-auto',
  'altigreen':    'altigreen',
  'montra':       'montra-ev',
  'omega':        'omega-seiki-mobility',
  'osm':          'osm',
  'youdha':       'youdha',
  'yc-ev':        'yc-ev',
  'saera-ev':     'saera-ev',
  'terra-motors': 'terra-motors',
  'etrio':        'etrio',
};

const BRAND_DIR_4W = {
  'maruti':          'maruti-suzuki',
  'ashok-leyland':   'ashok-leyland',
  'eicher':          'eicher',
  'force':           'force',
  'mahindra':        'mahindra',
  'tata':            'tata',
};

const ROOT = path.join(__dirname, '..');
const urlsPath = path.join(ROOT, 'public', 'data', 'vehicle-image-urls.json');
const urls = JSON.parse(fs.readFileSync(urlsPath, 'utf8'));

let updated = 0;
let alreadyLocal = 0;
let stillMissing = [];

for (const [key, value] of Object.entries(urls)) {
  // Skip entries already pointing to local paths
  if (value.startsWith('/images/')) {
    alreadyLocal++;
    continue;
  }

  // Parse: "3w/bajaj/maxima-c.jpg" or "4w-auto/tata/ace-gold.jpg"
  const parts = key.split('/');
  if (parts.length !== 3) continue;

  const [type, shortBrand, filename] = parts;
  const slug = filename.replace('.jpg', '');

  const brandMap = type === '3w' ? BRAND_DIR_3W : BRAND_DIR_4W;
  const fullBrand = brandMap[shortBrand] || shortBrand;
  const imgDir = path.join(ROOT, 'public', 'images', type, fullBrand);

  // 1. Exact filename match
  const exactPath = path.join(imgDir, filename);
  if (fs.existsSync(exactPath)) {
    urls[key] = `/images/${type}/${fullBrand}/${filename}`;
    updated++;
    continue;
  }

  // 2. Fuzzy: normalize dashes/numbers and prefix-match
  //    Also try stripping brand prefix from slug (e.g. "osm-stream-city" → "stream-city")
  if (fs.existsSync(imgDir)) {
    const files = fs.readdirSync(imgDir).filter(f => /\.(jpg|png|webp)$/.test(f));
    const norm = s => s.replace(/-/g, '').toLowerCase();
    // Additional slug candidates: strip leading brand-name prefix
    const slugCandidates = [slug];
    const brandPrefixStripped = slug.replace(new RegExp(`^${shortBrand}-`), '');
    if (brandPrefixStripped !== slug) slugCandidates.push(brandPrefixStripped);
    // Also strip full-brand prefix (e.g. "youdha-trevo-cargo" → "trevo-cargo")
    const fullBrandStripped = slug.replace(new RegExp(`^${fullBrand.split('-')[0]}-`), '');
    if (fullBrandStripped !== slug) slugCandidates.push(fullBrandStripped);

    let match = null;
    for (const s of slugCandidates) {
      match = files.find(f => {
        const base = f.replace(/\.(jpg|png|webp)$/, '');
        const nb = norm(base), ns = norm(s);
        return nb === ns || nb.startsWith(ns) || ns.startsWith(nb);
      });
      if (match) break;
    }
    if (match) {
      urls[key] = `/images/${type}/${fullBrand}/${match}`;
      updated++;
      continue;
    }
  }

  stillMissing.push({ key, type, brand: fullBrand, slug });
}

fs.writeFileSync(urlsPath, JSON.stringify(urls, null, 2));

console.log('\n📊 vehicle-image-urls.json update results');
console.log('══════════════════════════════════════════');
console.log(`✅ Updated to local path : ${updated}`);
console.log(`⏭  Already local         : ${alreadyLocal}`);
console.log(`❌ Still missing          : ${stillMissing.length}`);

if (stillMissing.length > 0) {
  console.log('\n⚠️  Missing images (run scraper to download):');
  const byBrand = {};
  for (const m of stillMissing) {
    if (!byBrand[m.brand]) byBrand[m.brand] = [];
    byBrand[m.brand].push(m.slug);
  }
  for (const [brand, slugs] of Object.entries(byBrand)) {
    console.log(`  ${brand}: ${slugs.join(', ')}`);
  }
}
