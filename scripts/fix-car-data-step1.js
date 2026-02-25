/**
 * Step 1: Fix structural issues in carInfo.json
 * - Merge mercedes + mercedes_benz → mercedes_benz
 * - Merge force + force_motors → force_motors
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'public', 'carInfo.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

console.log('Before merge:');
console.log('  mercedes entries:', Object.keys(data.mercedes || {}).length);
console.log('  mercedes_benz entries:', Object.keys(data.mercedes_benz || {}).length);
console.log('  force entries:', Object.keys(data.force || {}).length);
console.log('  force_motors entries:', Object.keys(data.force_motors || {}).length);

// --- Merge Mercedes ---
if (data.mercedes && data.mercedes_benz) {
    const mercedesItems = [];
    const mbItems = [];

    // Collect all items from mercedes
    for (const key of Object.keys(data.mercedes)) {
        const val = data.mercedes[key];
        if (val && typeof val === 'object' && val.model) {
            mercedesItems.push(val);
        }
    }

    // Collect all items from mercedes_benz
    if (data.mercedes_benz.variants && Array.isArray(data.mercedes_benz.variants)) {
        mbItems.push(...data.mercedes_benz.variants);
    } else {
        for (const key of Object.keys(data.mercedes_benz)) {
            const val = data.mercedes_benz[key];
            if (val && typeof val === 'object' && val.model) {
                mbItems.push(val);
            } else if (Array.isArray(val)) {
                mbItems.push(...val);
            }
        }
    }

    // Merge: fix make name to "Mercedes-Benz" for all
    const allMerc = [...mercedesItems, ...mbItems].map(item => ({
        ...item,
        make: 'Mercedes-Benz'
    }));

    // Deduplicate by model + variant_name
    const seen = new Set();
    const deduped = [];
    for (const item of allMerc) {
        const key = `${item.model}|${item.variant_name}`;
        if (!seen.has(key)) {
            seen.add(key);
            deduped.push(item);
        }
    }

    // Store as indexed object
    const merged = {};
    deduped.forEach((item, i) => { merged[i] = item; });

    delete data.mercedes;
    data.mercedes_benz = merged;
    console.log('  ✅ Merged mercedes → mercedes_benz:', deduped.length, 'entries');
}

// --- Merge Force ---
if (data.force && data.force_motors) {
    const forceItems = [];
    const fmItems = [];

    // force
    for (const key of Object.keys(data.force)) {
        const val = data.force[key];
        if (val && typeof val === 'object' && val.model) {
            forceItems.push(val);
        } else if (Array.isArray(val)) {
            forceItems.push(...val);
        }
    }

    // force_motors
    if (data.force_motors.variants && Array.isArray(data.force_motors.variants)) {
        fmItems.push(...data.force_motors.variants);
    } else {
        for (const key of Object.keys(data.force_motors)) {
            const val = data.force_motors[key];
            if (val && typeof val === 'object' && val.model) {
                fmItems.push(val);
            } else if (Array.isArray(val)) {
                fmItems.push(...val);
            }
        }
    }

    const allForce = [...forceItems, ...fmItems].map(item => ({
        ...item,
        make: 'Force Motors'
    }));

    const seen = new Set();
    const deduped = [];
    for (const item of allForce) {
        const key = `${item.model}|${item.variant_name}`;
        if (!seen.has(key)) {
            seen.add(key);
            deduped.push(item);
        }
    }

    const merged = {};
    deduped.forEach((item, i) => { merged[i] = item; });

    delete data.force;
    data.force_motors = merged;
    console.log('  ✅ Merged force → force_motors:', deduped.length, 'entries');
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('\n✅ Step 1 complete: carInfo.json updated');
