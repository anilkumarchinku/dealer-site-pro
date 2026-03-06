const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'public', 'data', 'brand-models.json');
const TS_FILE = path.join(__dirname, '..', 'lib', 'data', 'three-wheelers.ts');

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Get all 3W brands from JSON
const allBrands = data.threeWheelers;

const existingContent = fs.readFileSync(TS_FILE, 'utf8');

// The brands currently hardcoded in the TS file (from what we assume might be there, we'll just check)
// Let's parse existing brands by looking for 'const SOME_BRAND: CatalogEntry[] ='
const existingRegex = /const ([A-Z0-9_]+):\s+CatalogEntry\[\]\s+=/g;
const existingRefs = [];
let match;
while ((match = existingRegex.exec(existingContent)) !== null) {
    existingRefs.push(match[1]);
}

let generatedCode = '';
let lookupAdditions = '';

for (const brandData of allBrands) {
    const constName = brandData.brand.toUpperCase()
        .replace(/ /g, '_')
        .replace(/&/g, 'AND')
        .replace(/[^A-Z0-9_]/g, '');

    if (existingRefs.includes(constName)) continue; // Already exists

    generatedCode += `\n// ── ${brandData.brand} ─────────────────────────────────────────────────────────────\n`;
    generatedCode += `const ${constName}: CatalogEntry[] = [\n`;

    // Parse models
    const models = [];
    if (Array.isArray(brandData.models)) {
        brandData.models.forEach(m => models.push({ name: m, fuel: 'cng' }));
    } else {
        if (brandData.models.passenger) brandData.models.passenger.forEach(m => models.push({ name: m, fuel: 'auto', type: 'passenger' }));
        if (brandData.models.cargo) brandData.models.cargo.forEach(m => models.push({ name: m, fuel: 'diesel', type: 'cargo' }));
        if (brandData.models.electric) brandData.models.electric.forEach(m => models.push({ name: m, fuel: 'electric', type: 'passenger' }));
    }

    for (const m of models) {
        const type = m.type || 'passenger';
        const fuel = m.fuel || 'cng';

        generatedCode += `    {
        brand: '${brandData.brand}', model: '${m.name.replace(/'/g, "\\'")}', variant: 'Standard',
        type: '${type}', fuel_type: '${fuel}', year: 2024,
        engine_cc: ${fuel === 'electric' ? 'null' : '400'}, mileage_kmpl: ${fuel === 'electric' ? 'null' : '30'}, range_km: ${fuel === 'electric' ? '120' : 'null'}, top_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: ${fuel === 'electric'},
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },\n`;
    }

    generatedCode += `]\n`;
    lookupAdditions += `    '${brandData.brand}': ${constName},\n`;
}

if (generatedCode) {
    const parts = existingContent.split('// ── Master lookup — keys must match EXACT brand names stored in DB ─────────────');

    if (parts.length === 2) {
        const newContent = parts[0] + generatedCode + '\n// ── Master lookup — keys must match EXACT brand names stored in DB ─────────────\n' + parts[1].replace('const CATALOG_BY_BRAND: Record<string, CatalogEntry[]> = {', 'const CATALOG_BY_BRAND: Record<string, CatalogEntry[]> = {\n' + lookupAdditions);
        fs.writeFileSync(TS_FILE, newContent);
        console.log('Successfully added missing brands to three-wheelers.ts catalog!');
    } else {
        console.log('Could not find split point in three-wheelers.ts');
    }
} else {
    console.log('No missing 3W brands found.');
}
