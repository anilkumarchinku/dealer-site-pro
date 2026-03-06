const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'public', 'data', 'brand-models.json');
const TS_FILE = path.join(__dirname, '..', 'lib', 'data', 'two-wheelers.ts');

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Get all 2W brands from JSON
const allBrands = [
    ...data.twoWheelers.traditional,
    ...data.twoWheelers.electric
];

const existingContent = fs.readFileSync(TS_FILE, 'utf8');

// The brands currently hardcoded in the TS file
const existingBrands = [
    'Royal Enfield', 'Hero MotoCorp', 'Honda Motorcycle & Scooter India',
    'TVS Motor Company', 'Bajaj Auto', 'Yamaha India', 'Suzuki Motorcycle India',
    'KTM India', 'Ather Energy', 'Kawasaki India', 'Ola Electric'
];

let generatedCode = '';
let lookupAdditions = '';

for (const brandData of allBrands) {
    if (existingBrands.includes(brandData.brand)) continue; // Already exists

    const constName = brandData.brand.toUpperCase()
        .replace(/ /g, '_')
        .replace(/&/g, 'AND')
        .replace(/[^A-Z0-9_]/g, '');

    generatedCode += `\n// ── ${brandData.brand} ─────────────────────────────────────────────────────────────\n`;
    generatedCode += `const ${constName}: CatalogEntry[] = [\n`;

    // Parse models
    const models = [];
    if (Array.isArray(brandData.models)) {
        brandData.models.forEach(m => models.push({ name: m, type: 'bike' }));
    } else {
        if (brandData.models.motorcycles) brandData.models.motorcycles.forEach(m => models.push({ name: m, type: 'bike', fuel: 'petrol' }));
        if (brandData.models.scooters) brandData.models.scooters.forEach(m => models.push({ name: m, type: 'scooter', fuel: 'petrol' }));
        if (brandData.models.mopeds) brandData.models.mopeds.forEach(m => models.push({ name: m, type: 'moped', fuel: 'petrol' }));
        if (brandData.models.electric) brandData.models.electric.forEach(m => models.push({ name: m, type: 'electric', fuel: 'electric' }));
    }

    for (const m of models) {
        // If the brand is strictly from the "electric" array, default to electric type.
        const isEvSub = brandData.brandId && data.twoWheelers.electric.find(e => e.brand === brandData.brand);
        const type = m.type || (isEvSub ? 'electric' : 'bike');
        const fuel = m.fuel || (isEvSub ? 'electric' : 'petrol');

        generatedCode += `    {
        brand: '${brandData.brand}', model: '${m.name.replace(/'/g, "\\'")}', variant: 'Standard',
        type: '${type}', fuel_type: '${fuel}', year: 2024,
        engine_cc: ${fuel === 'petrol' ? '150' : 'null'}, mileage_kmpl: ${fuel === 'petrol' ? '40' : 'null'}, range_km: ${fuel === 'electric' ? '100' : 'null'}, top_speed_kmph: 80,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 10000000, on_road_price_paise: 11500000, emi_starting_paise: 250000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: ${fuel === 'electric'},
        colors: [{ name: 'Black', hex: '#1A1A1A' }],
        images: [], brochure_url: null, description: 'Reliable urban mobility.', features: [], status: 'active',
    },\n`;
    }

    generatedCode += `]\n`;
    lookupAdditions += `    '${brandData.brand}': ${constName},\n`;
}

// We must insert generatedCode BEFORE "const CATALOG_BY_BRAND"
// and insert lookupAdditions INTO "const CATALOG_BY_BRAND = {"

const parts = existingContent.split('// ── Master lookup — keys must match EXACT brand names stored in DB ─────────────');

const newContent = parts[0] + generatedCode + '\n// ── Master lookup — keys must match EXACT brand names stored in DB ─────────────\n' + parts[1].replace('const CATALOG_BY_BRAND: Record<string, CatalogEntry[]> = {', 'const CATALOG_BY_BRAND: Record<string, CatalogEntry[]> = {\n' + lookupAdditions);

fs.writeFileSync(TS_FILE, newContent);
console.log('Successfully added missing brands to two-wheelers.ts catalog!');
