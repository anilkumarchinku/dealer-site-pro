const fs = require('fs');
const path = require('path');

// Read cars.ts content
const carsContent = fs.readFileSync(path.join(__dirname, 'lib/data/cars.ts'), 'utf-8');

// Extract all hero image paths, IDs, makes, models
const heroMatches = [...carsContent.matchAll(/"hero":\s*"([^"]*)"/g)];
const idMatches = [...carsContent.matchAll(/"id":\s*"([^"]*)"/g)];
const makeMatches = [...carsContent.matchAll(/"make":\s*"([^"]*)"/g)];
const modelMatches = [...carsContent.matchAll(/"model":\s*"([^"]*)"/g)];

console.log('=== TOTAL SCRAPED CARS:', idMatches.length, '===\n');

let missingImages = [];
let emptyImages = [];
let allGood = [];

for (let i = 0; i < idMatches.length; i++) {
    const id = idMatches[i][1];
    const make = makeMatches[i] ? makeMatches[i][1] : 'UNKNOWN';
    const model = modelMatches[i] ? modelMatches[i][1] : 'UNKNOWN';
    const hero = heroMatches[i] ? heroMatches[i][1] : '';

    if (!hero || hero === '') {
        emptyImages.push({ id, make, model });
    } else {
        const filePath = path.join(__dirname, 'public' + hero);
        if (!fs.existsSync(filePath)) {
            missingImages.push({ id, make, model, hero });
        } else {
            const stats = fs.statSync(filePath);
            allGood.push({ id, make, model, hero, sizeKB: Math.round(stats.size / 1024) });
        }
    }
}

console.log('VALID images on disk:', allGood.length);
console.log('EMPTY hero image:', emptyImages.length);
if (emptyImages.length > 0) {
    emptyImages.forEach(c => console.log('   EMPTY -', c.id, '(' + c.make + ' ' + c.model + ')'));
}
console.log('MISSING image files:', missingImages.length);
if (missingImages.length > 0) {
    missingImages.forEach(c => console.log('   MISSING -', c.id, '=>', c.hero));
}

// Read car-models.ts to check curated IDs
const carModelsContent = fs.readFileSync(path.join(__dirname, 'lib/data/car-models.ts'), 'utf-8');
const curatedIds = [...carModelsContent.matchAll(/id:\s*'([^']*)'/g)].map(m => m[1]);

console.log('\n=== CURATED vs SCRAPED ===');
console.log('Curated (car-models.ts):', curatedIds.length, 'cars');
console.log('Scraped (cars.ts):', idMatches.length, 'cars');

// Check which curated IDs match scraped IDs
const scrapedIds = idMatches.map(m => m[1]);
const normalizeId = (id) => id
    .replace(/^vw-/, 'volkswagen-')
    .replace(/^mercedes-/, 'mercedes-benz-')
    .replace(/^landrover-/, 'land-rover-')
    .replace(/^bmw-2-series$/, 'bmw-2-series-gran-coupe')
    .replace(/^isuzu-v-cross$/, 'isuzu-d-max')
    .replace(/^hyundai-i10-nios$/, 'hyundai-grand-i10-nios')
    .replace(/^toyota-hyryder$/, 'toyota-urban-cruiser-hyryder')
    .replace(/^bentley-continental-gt$/, 'bentley-continental')
    .replace(/^force-urbania$/, 'force-trax-cruiser');

let matched = 0;
let unmatched = [];
curatedIds.forEach(cId => {
    const found = scrapedIds.includes(cId) || scrapedIds.includes(normalizeId(cId));
    if (found) matched++;
    else unmatched.push(cId);
});

console.log('Curated IDs matched to scraped:', matched + '/' + curatedIds.length);
if (unmatched.length > 0) {
    console.log('UNMATCHED curated IDs (no scraped data/image):');
    unmatched.forEach(id => console.log('   -', id));
}

// Count additional scraped cars not in curated
const coveredIds = new Set();
curatedIds.forEach(id => { coveredIds.add(id); coveredIds.add(normalizeId(id)); });
const additionalScraped = scrapedIds.filter(id => !coveredIds.has(id) && !coveredIds.has(normalizeId(id)));
console.log('Additional scraped cars (not in curated):', additionalScraped.length);

// Group by brand
console.log('\n=== CARS PER BRAND (scraped) ===');
const brands = {};
for (let i = 0; i < idMatches.length; i++) {
    const make = makeMatches[i][1];
    if (!brands[make]) brands[make] = [];
    brands[make].push({
        id: idMatches[i][1],
        model: modelMatches[i][1],
        hero: heroMatches[i] ? heroMatches[i][1] : '',
        inCurated: coveredIds.has(idMatches[i][1]) || coveredIds.has(normalizeId(idMatches[i][1]))
    });
}

Object.entries(brands).sort((a, b) => a[0].localeCompare(b[0])).forEach(([brand, cars]) => {
    const curatedCount = cars.filter(c => c.inCurated).length;
    const totalCount = cars.length;
    const emptyCount = cars.filter(c => !c.hero).length;
    console.log(`  ${brand}: ${totalCount} total (${curatedCount} curated, ${totalCount - curatedCount} scraped-only${emptyCount > 0 ? ', ' + emptyCount + ' NO IMAGE' : ''})`);
});

// Check for tiny/corrupted images (under 1KB)
console.log('\n=== IMAGE SIZE CHECK ===');
const tinyImages = allGood.filter(c => c.sizeKB < 2);
if (tinyImages.length > 0) {
    console.log('WARNING - Images under 2KB (possibly broken):');
    tinyImages.forEach(c => console.log('   -', c.id, ':', c.sizeKB + 'KB', c.hero));
} else {
    console.log('All images are > 2KB (no corrupted images detected)');
}

console.log('\n=== SUMMARY ===');
console.log('Total cars that WILL show on website: ' + (matched + additionalScraped.length));
console.log('  - From curated data (best quality):', matched);
console.log('  - From scraped data (auto-converted):', additionalScraped.length);
console.log('Cars that WON\'T show (no scraped match, EV-only brands):', unmatched.length);
if (unmatched.length > 0) console.log('  IDs:', unmatched.join(', '));
