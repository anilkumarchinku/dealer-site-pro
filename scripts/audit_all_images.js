/**
 * audit_all_images.js
 * Full audit of all 2W and 3W brands in brand-models.json vs filesystem.
 * Outputs what's missing, and optionally saves a JSON to feed into the scraper.
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'public/data/brand-models.json');
const IMAGES_BASE = path.join(process.cwd(), 'public/data/brand-model-images');

function modelToSlug(m) {
    return m.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function imageExists(dir, slug) {
    return fs.existsSync(path.join(dir, slug + '.jpg')) ||
        fs.existsSync(path.join(dir, slug + '.png')) ||
        fs.existsSync(path.join(dir, slug + '.webp'));
}

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

function auditCategory(brands, category) {
    let totalPresent = 0, totalMissing = 0;
    const report = {};

    for (const b of brands) {
        const brandDir = path.join(IMAGES_BASE, category, b.brandId);
        const models = Array.isArray(b.models) ? b.models : Object.values(b.models).flat();
        const missing = [];
        const present = [];

        for (const m of models) {
            if (typeof m !== 'string') continue;
            const s = modelToSlug(m);
            if (imageExists(brandDir, s)) { present.push(m); totalPresent++; }
            else { missing.push(m); totalMissing++; }
        }

        if (missing.length > 0 || present.length > 0) {
            report[b.brand] = {
                brandId: b.brandId,
                total: models.filter(m => typeof m === 'string').length,
                present: present.length,
                missing: missing.length,
                missingModels: missing
            };
        }
    }

    return { totalPresent, totalMissing, report };
}

console.log('\n═══════════════════════════════════════════════');
console.log(' 2W IMAGE AUDIT');
console.log('═══════════════════════════════════════════════');
const tw = auditCategory([...data.twoWheelers.traditional, ...data.twoWheelers.electric], '2w');
console.log(`Total: ${tw.totalPresent} present, ${tw.totalMissing} missing\n`);
for (const [brand, r] of Object.entries(tw.report)) {
    if (r.missing > 0) {
        console.log(`❌ ${brand} (${r.brandId})`);
        console.log(`   Missing ${r.missing}/${r.total}: ${r.missingModels.join(', ')}`);
    }
}

console.log('\n═══════════════════════════════════════════════');
console.log(' 3W IMAGE AUDIT');
console.log('═══════════════════════════════════════════════');
const thw = auditCategory(data.threeWheelers, '3w');
console.log(`Total: ${thw.totalPresent} present, ${thw.totalMissing} missing\n`);
for (const [brand, r] of Object.entries(thw.report)) {
    if (r.missing > 0) {
        console.log(`❌ ${brand} (${r.brandId})`);
        console.log(`   Missing ${r.missing}/${r.total}: ${r.missingModels.slice(0, 5).join(', ')}${r.missing > 5 ? ` ...+${r.missing - 5} more` : ''}`);
    }
}

// Save missing to JSON file for the scraper
const missingAll = {
    twoWheelers: [],
    threeWheelers: [],
};
for (const brands of [data.twoWheelers.traditional, data.twoWheelers.electric]) {
    for (const b of brands) {
        const brandDir = path.join(IMAGES_BASE, '2w', b.brandId);
        const models = Array.isArray(b.models) ? b.models : Object.values(b.models).flat();
        const missing = models.filter(m => typeof m === 'string' && !imageExists(brandDir, modelToSlug(m)));
        if (missing.length > 0) missingAll.twoWheelers.push({ brand: b.brand, brandId: b.brandId, models: missing });
    }
}
for (const b of data.threeWheelers) {
    const brandDir = path.join(IMAGES_BASE, '3w', b.brandId);
    const models = Array.isArray(b.models) ? b.models : Object.values(b.models || {}).flat();
    const missing = models.filter(m => typeof m === 'string' && !imageExists(brandDir, modelToSlug(m)));
    if (missing.length > 0) missingAll.threeWheelers.push({ brand: b.brand, brandId: b.brandId, models: missing });
}

fs.writeFileSync('scripts/missing_gaps.json', JSON.stringify(missingAll, null, 2));
console.log('\n\n✅ Saved missing list to scripts/missing_gaps.json');
