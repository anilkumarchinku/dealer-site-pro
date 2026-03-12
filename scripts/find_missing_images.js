/**
 * find_missing_images.js
 * Replicates the admin/audit-images API locally to find all missing 2W/3W images.
 * Outputs a JSON file for the scraper.
 */
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('public/data/brand-models.json', 'utf8'));
const imagesBase = path.join(process.cwd(), 'public/data/brand-model-images');

const BRAND_FOLDER_MAP_2W = {
    'royal enfield': 'royal-enfield', 'hero motocorp': 'hero-motocorp',
    'honda motorcycle & scooter india': 'honda-hmsi', 'honda': 'honda-hmsi',
    'tvs motor company': 'tvs-motor', 'tvs': 'tvs-motor',
    'bajaj auto': 'bajaj-auto', 'bajaj': 'bajaj-auto',
    'yamaha india': 'yamaha-india', 'yamaha': 'yamaha-india',
    'suzuki motorcycle india': 'suzuki-motorcycle', 'suzuki': 'suzuki-motorcycle',
    'ktm india': 'ktm-india', 'ktm': 'ktm-india',
    'kawasaki india': 'kawasaki-india', 'kawasaki': 'kawasaki-india',
    'ather energy': 'ather-energy', 'ather': 'ather-energy',
    'ola electric': 'ola-electric',
};
const BRAND_FOLDER_MAP_3W = {
    'mahindra': 'mahindra-3w', 'bajaj': 'bajaj-auto-3w', 'bajaj auto': 'bajaj-auto-3w',
    'tvs': 'tvs-king', 'tvs motor company': 'tvs-king', 'piaggio': 'piaggio-ape',
    'greaves': 'greaves-electric-3w', 'greaves electric': 'greaves-electric-3w',
    'kinetic': 'kinetic-green', 'kinetic green': 'kinetic-green',
    'euler': 'euler-motors', 'euler motors': 'euler-motors',
    'atul': 'atul-auto', 'atul auto': 'atul-auto',
    'lohia': 'lohia-auto', 'lohia auto': 'lohia-auto',
};

function brandNameToId(name, cat) {
    const lower = name.toLowerCase().trim();
    const map = cat === '3w' ? BRAND_FOLDER_MAP_3W : BRAND_FOLDER_MAP_2W;
    if (map[lower]) return map[lower];
    return lower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function modelToSlug(m) {
    return m.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const missing = [];
let total = 0;

function check(type, brandId, model, brand) {
    total++;
    const slug = modelToSlug(model);
    const jpg = path.join(imagesBase, type, brandId, slug + '.jpg');
    const png = path.join(imagesBase, type, brandId, slug + '.png');
    const webp = path.join(imagesBase, type, brandId, slug + '.webp');
    if (!fs.existsSync(jpg) && !fs.existsSync(png) && !fs.existsSync(webp)) {
        missing.push({ type, brandId, brand, model, slug });
    }
}

// 2W — handle both array and object shapes
const tw = data.twoWheelers;
const twBrands = Array.isArray(tw) ? tw : Object.values(tw).flat();
for (const bg of twBrands) {
    const brandId = brandNameToId(bg.brandId || bg.brand, '2w');
    const models = bg.models;
    if (Array.isArray(models)) {
        models.forEach(m => check('2w', brandId, m, bg.brand));
    } else if (models && typeof models === 'object') {
        for (const ml of Object.values(models)) {
            if (Array.isArray(ml)) ml.forEach(m => check('2w', brandId, m, bg.brand));
        }
    }
}

// 3W
for (const bg of data.threeWheelers) {
    const brandId = brandNameToId(bg.brandId || bg.brand, '3w');
    const models = bg.models;
    if (Array.isArray(models)) {
        models.forEach(m => check('3w', brandId, m, bg.brand));
    } else if (models && typeof models === 'object') {
        for (const ml of Object.values(models)) {
            if (Array.isArray(ml)) ml.forEach(m => check('3w', brandId, m, bg.brand));
        }
    }
}

console.log(`Total models: ${total}`);
console.log(`Missing images: ${missing.length}`);
console.log(`Present: ${total - missing.length}`);
console.log('');

// Group by type + brand
const grouped = {};
for (const m of missing) {
    const key = `${m.type}|${m.brand}|${m.brandId}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
}

for (const [key, items] of Object.entries(grouped)) {
    const [type, brand, brandId] = key.split('|');
    console.log(`[${type.toUpperCase()}] ${brand} (${brandId}) — ${items.length} missing:`);
    items.forEach(i => console.log(`  - ${i.model} (${i.slug})`));
}

// Write JSON for scraper
fs.writeFileSync('scripts/missing_audit.json', JSON.stringify(missing, null, 2));
console.log(`\nWrote scripts/missing_audit.json`);
