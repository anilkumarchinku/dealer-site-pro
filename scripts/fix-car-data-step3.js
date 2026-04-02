/**
 * Step 3: Comprehensive car catalog audit fixes
 * 1. Fix model name mismatches (slug → proper names) for Mercedes-Benz, BMW, Kia
 * 2. Add missing variants for Hyundai, Kia, Mahindra, Tata, BMW, Mercedes-Benz
 * 3. Add entirely missing brands: Ferrari, Maserati, Rolls-Royce
 * 4. Add missing Mercedes-Benz models: GLC, AMG*, EQ* extras
 *
 * Data source: Supabase car_catalog (project llsvbyeumrfngjvbedbz)
 * Output: compact JSON (no spaces/newlines)
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'public', 'carInfo.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ============================================================
// HELPERS
// ============================================================

function addModels(brandKey, newEntries) {
    if (!data[brandKey]) data[brandKey] = {};
    const existing = data[brandKey];
    let maxKey = -1;
    for (const k of Object.keys(existing)) {
        const n = parseInt(k);
        if (!isNaN(n) && n > maxKey) maxKey = n;
    }
    for (const entry of newEntries) {
        maxKey++;
        existing[maxKey] = entry;
    }
    console.log(`  Added ${newEntries.length} entries to ${brandKey} (new max key: ${maxKey})`);
}

// Price in paise → INR integer
function paise(p) { return Math.round(p / 100); }

// Build a standard variant entry
function v(make, model, variant, price_inr, fuel, trans, extra) {
    return Object.assign({
        make,
        model,
        variant_name: variant,
        ex_showroom_price_min_inr: price_inr,
        ex_showroom_price_max_inr: price_inr,
        fuel_type: fuel,
        transmission: trans,
        engine_displacement_cc: null,
        power_bhp: null,
        torque_nm: null,
        mileage_kmpl_or_ev_range: null,
        seating_capacity: null,
        boot_space_l: null,
        ground_clearance_mm: null,
        dimensions: null,
        key_features: [],
        safety_features: [],
        image_urls: [],
        availability_status: 'on_sale',
        source_url: '',
        launch_year: null
    }, extra || {});
}

// ============================================================
// STEP 1 — Fix model name mismatches in Mercedes-Benz
// Slug conversion produced wrong names. Fix to match Supabase/proper names.
// ============================================================
console.log('\n--- STEP 1: Fix Mercedes-Benz model name mismatches ---');
const mbRenames = {
    'A Class Limousine': 'A-Class Limousine',
    'C Class': 'C-Class',
    'E Class': 'E-Class',
    'G Class': 'G-Class',
    'Gla': 'GLA',
    'Gle': 'GLE',
    'Gls': 'GLS',
    'Eqa': 'EQA',
    'Eqb': 'EQB',
    'Eqe SUV': 'EQE SUV',
    'Eqs': 'EQS',
    'Eqs SUV': 'EQS SUV',
    'Cle': 'CLE',
    'S Class': 'S-Class',
    'V Class': 'V-Class',
    'Maybach Gls': 'Maybach GLS',
    'Maybach S Class': 'Maybach S-Class',
};
const mb = data.mercedes_benz;
let mbFixed = 0;
for (const k of Object.keys(mb)) {
    const item = mb[k];
    if (item && item.model && mbRenames[item.model]) {
        const oldName = item.model;
        item.model = mbRenames[item.model];
        mbFixed++;
        console.log(`  mercedes_benz[${k}]: "${oldName}" → "${item.model}"`);
    }
}
console.log(`  Fixed ${mbFixed} Mercedes-Benz model name entries`);

// ============================================================
// STEP 2 — Fix BMW model name mismatches
// ============================================================
console.log('\n--- STEP 2: Fix BMW model name mismatches ---');
const bmwRenames = {
    'Ix': 'iX',
    'Ix1': 'iX1',
    'I4': 'i4',
    'I5': 'i5',
    'I7': 'i7',
};
const bmwData = data.bmw;
let bmwFixed = 0;
for (const k of Object.keys(bmwData)) {
    const item = bmwData[k];
    if (item && item.model && bmwRenames[item.model]) {
        const oldName = item.model;
        item.model = bmwRenames[item.model];
        bmwFixed++;
        console.log(`  bmw[${k}]: "${oldName}" → "${item.model}"`);
    }
}
console.log(`  Fixed ${bmwFixed} BMW model name entries`);

// ============================================================
// STEP 3 — Fix Kia model name mismatches
// ============================================================
console.log('\n--- STEP 3: Fix Kia model name mismatches ---');
const kiaRenames = {
    'Ev6': 'EV6',
    'Ev9': 'EV9',
};
const kiaData = data.kia;
let kiaFixed = 0;
for (const k of Object.keys(kiaData)) {
    const item = kiaData[k];
    if (item && item.model && kiaRenames[item.model]) {
        const oldName = item.model;
        item.model = kiaRenames[item.model];
        kiaFixed++;
        console.log(`  kia[${k}]: "${oldName}" → "${item.model}"`);
    }
}
console.log(`  Fixed ${kiaFixed} Kia model name entries`);

// ============================================================
// STEP 4 — Add missing Hyundai: Venue N Line (6 variants)
// ============================================================
console.log('\n--- STEP 4: Add Hyundai Venue N Line ---');
addModels('hyundai', [
    v('Hyundai', 'Venue N Line', 'N6', paise(106540000), 'Petrol', 'Manual'),
    v('Hyundai', 'Venue N Line', 'N6 Dual Tone', paise(108340000), 'Petrol', 'Manual'),
    v('Hyundai', 'Venue N Line', 'N6 DCT', paise(115540000), 'Petrol', 'DCT'),
    v('Hyundai', 'Venue N Line', 'N6 DCT Dual Tone', paise(117340000), 'Petrol', 'DCT'),
    v('Hyundai', 'Venue N Line', 'N10 DCT', paise(154010000), 'Petrol', 'DCT'),
    v('Hyundai', 'Venue N Line', 'N10 DCT Dual Tone', paise(155810000), 'Petrol', 'DCT'),
]);

// ============================================================
// STEP 5 — Add missing Kia: Carens Clavis EV (3 variants)
// ============================================================
console.log('\n--- STEP 5: Add Kia Carens Clavis EV ---');
addModels('kia', [
    v('Kia', 'Carens Clavis EV', 'HTX E', paise(179900000), 'Electric', 'Automatic'),
    v('Kia', 'Carens Clavis EV', 'HTX E Plus', paise(209900000), 'Electric', 'Automatic'),
    v('Kia', 'Carens Clavis EV', 'HTX E LR', paise(249900000), 'Electric', 'Automatic'),
]);

// ============================================================
// STEP 6 — Add missing Mahindra: Bolero Neo Plus (2 variants)
// ============================================================
console.log('\n--- STEP 6: Add Mahindra Bolero Neo Plus ---');
addModels('mahindra', [
    v('Mahindra', 'Bolero Neo Plus', 'P4 2.2 Diesel MT', paise(109000000), 'Diesel', 'Manual'),
    v('Mahindra', 'Bolero Neo Plus', 'P10 2.2 Diesel MT', paise(119500000), 'Diesel', 'Manual'),
]);

// ============================================================
// STEP 7 — Add missing Tata: Tiago NRG (4 variants) + Xpres (2 variants)
// Note: Tata Xpres-T EV already exists in carInfo.json (keys 102-103)
// ============================================================
console.log('\n--- STEP 7: Add Tata Tiago NRG and Xpres ---');
addModels('tata', [
    v('Tata Motors', 'Tiago NRG', 'Tiago NRG XZ Petrol MT', paise(66800000), 'Petrol', 'Manual'),
    v('Tata Motors', 'Tiago NRG', 'Tiago NRG XZA Petrol AMT', paise(71800000), 'Petrol', 'AMT'),
    v('Tata Motors', 'Tiago NRG', 'Tiago NRG XZ iCNG MT', paise(75900000), 'CNG', 'Manual'),
    v('Tata Motors', 'Tiago NRG', 'Tiago NRG XZA iCNG AMT', paise(81000000), 'CNG', 'AMT'),
    v('Tata Motors', 'Xpres', 'Xpres Petrol', paise(55900000), 'Petrol', 'Manual'),
    v('Tata Motors', 'Xpres', 'Xpres CNG', paise(64900000), 'CNG', 'Manual'),
]);

// ============================================================
// STEP 8 — Add missing BMW models
// M4 (2 variants), M4 Competition (1), M340i (2), X4 M40i (1),
// X5 M Competition (1), M8 Coupe Competition (1)
// Also fix 3 Series Gran Limousine: existing entry has model-name-as-variant,
// add 2 missing variants (M340i 50 Jahre, M340i xDrive)
// ============================================================
console.log('\n--- STEP 8: Add missing BMW variants ---');

// Fix existing 3 Series Gran Limousine entry: variant_name is wrong
for (const k of Object.keys(bmwData)) {
    const item = bmwData[k];
    if (item && item.model === '3 Series Gran Limousine' && item.variant_name === '3 Series Gran Limousine') {
        item.variant_name = '330Li M Sport';
        console.log(`  Fixed bmw[${k}] 3 Series Gran Limousine variant_name → "330Li M Sport"`);
    }
}

addModels('bmw', [
    v('BMW', '3 Series Gran Limousine', 'M340i 50 Jahre Edition', paise(728500000), 'Petrol', 'Automatic'),
    v('BMW', '3 Series Gran Limousine', 'M340i xDrive', paise(754000000), 'Petrol', 'Automatic'),
    v('BMW', 'M340i', '50 Jahre Edition', paise(728500000), 'Petrol', 'Automatic'),
    v('BMW', 'M340i', 'xDrive', paise(754000000), 'Petrol', 'Automatic'),
    v('BMW', 'M4', 'Competition xDrive', paise(1520000000), 'Petrol', 'Automatic'),
    v('BMW', 'M4', 'CS xDrive', paise(1788000000), 'Petrol', 'Automatic'),
    v('BMW', 'M4 Competition', 'xDrive', paise(1520000000), 'Petrol', 'Automatic'),
    v('BMW', 'X4', 'M40i', paise(962000000), 'Petrol', 'Automatic'),
    v('BMW', 'X5 M Competition', 'Competition', paise(2079000000), 'Petrol', 'Automatic'),
    v('BMW', 'M8 Coupe Competition', 'Coupe Competition 50 Jahre', paise(2384000000), 'Petrol', 'Automatic'),
]);

// ============================================================
// STEP 9 — Add missing Mercedes-Benz variants
// Models in Supabase but carInfo only has 1 variant (need more):
// C-Class: add C 200, C 300
// E-Class: add E 220d, E 450
// G-Class: add G 500, AMG G 63
// GLA: add GLA 220d 4MATIC, GLA 220d 4MATIC AMG Line
// GLE: add GLE 450 4Matic, GLE 450d 4Matic
// GLS: add GLS 450 4MATIC AMG Line, GLS 450d 4MATIC, GLS 450d 4MATIC AMG Line
// Maybach GLS: add Night Series + Celebration Edition
// Maybach S-Class: add S680
// S-Class: add S450 4Matic
// V-Class: add V 260 Extra Long, V 300d Extra Long
// A-Class Limousine: add A 200d
// CLE: fix variant_name (currently "Cle") — already done in rename, update variant_name
// EQS: add EQS 450+, fix existing EQS entry variant_name
// EQS SUV: add EQS SUV 580 4MATIC
// EQB: add EQB 350 4Matic
//
// Entirely NEW models:
// GLC (not in carInfo at all): 220d, 300
// AMG A 45 S
// AMG C 63 (S E Performance)
// AMG E 63 S
// AMG G-Class (already added via G-Class AMG G 63 above -- but Supabase has it as separate model)
// AMG GLA 35
// AMG GT (2 variants)
// ============================================================
console.log('\n--- STEP 9: Add missing Mercedes-Benz variants ---');

// Fix existing CLE entry variant_name
for (const k of Object.keys(mb)) {
    const item = mb[k];
    if (item && item.model === 'CLE' && (item.variant_name === 'Cle' || item.variant_name === 'CLE')) {
        item.variant_name = 'AMG CLE 53 4Matic';
        item.fuel_type = 'Petrol';
        item.transmission = 'Automatic';
        item.ex_showroom_price_min_inr = paise(1280000000);
        item.ex_showroom_price_max_inr = paise(1280000000);
        console.log(`  Fixed mercedes_benz[${k}] CLE variant_name → "AMG CLE 53 4Matic"`);
    }
}

// Fix existing EQS entry (currently "EQS 580 4MATIC Celebration Edition")
for (const k of Object.keys(mb)) {
    const item = mb[k];
    if (item && item.model === 'EQS' && item.variant_name === 'EQS 580 4MATIC Celebration Edition') {
        item.variant_name = 'EQS 580 4MATIC';
        item.ex_showroom_price_min_inr = paise(1570000000);
        item.ex_showroom_price_max_inr = paise(1570000000);
        console.log(`  Fixed mercedes_benz[${k}] EQS variant_name → "EQS 580 4MATIC"`);
    }
}

// Fix existing EQS SUV entry variant_name "EQS SUV 450 4Matic" → keep, just normalize capitalization
for (const k of Object.keys(mb)) {
    const item = mb[k];
    if (item && item.model === 'EQS SUV' && item.variant_name === 'EQS SUV 450 4Matic') {
        item.variant_name = 'EQS SUV 450 4MATIC';
        console.log(`  Fixed mercedes_benz[${k}] EQS SUV variant_name → "EQS SUV 450 4MATIC"`);
    }
}

// Fix existing Maybach S-Class price (currently 27400000, Supabase S580 = 27430000 ≈ close enough, but update)
for (const k of Object.keys(mb)) {
    const item = mb[k];
    if (item && item.model === 'Maybach S-Class' && item.variant_name === 'Maybach S-Class S580') {
        item.variant_name = 'S580';
        item.ex_showroom_price_min_inr = paise(2743000000);
        item.ex_showroom_price_max_inr = paise(2743000000);
        console.log(`  Fixed mercedes_benz[${k}] Maybach S-Class variant_name → "S580"`);
    }
}

addModels('mercedes_benz', [
    // A-Class Limousine — add A 200d
    v('Mercedes-Benz', 'A-Class Limousine', 'A 200d', paise(459256800), 'Diesel', 'Automatic'),
    // C-Class — add C 200, C 300
    v('Mercedes-Benz', 'C-Class', 'C 200', paise(589000000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'C-Class', 'C 300', paise(643200000), 'Petrol', 'Automatic'),
    // E-Class — add E 220d, E 450
    v('Mercedes-Benz', 'E-Class', 'E 220d', paise(804100000), 'Diesel', 'Automatic'),
    v('Mercedes-Benz', 'E-Class', 'E 450', paise(916600000), 'Petrol', 'Automatic'),
    // G-Class — add G 500
    v('Mercedes-Benz', 'G-Class', 'G 500', paise(2750000000), 'Petrol', 'Automatic'),
    // GLA — add GLA 220d 4MATIC, GLA 220d 4MATIC AMG Line
    v('Mercedes-Benz', 'GLA', 'GLA 220d 4MATIC', paise(508700000), 'Diesel', 'Automatic'),
    v('Mercedes-Benz', 'GLA', 'GLA 220d 4MATIC AMG Line', paise(527300000), 'Diesel', 'Automatic'),
    // GLC — entirely new model
    v('Mercedes-Benz', 'GLC', '220d', paise(739666700), 'Diesel', 'Automatic'),
    v('Mercedes-Benz', 'GLC', '300', paise(739666700), 'Petrol', 'Automatic'),
    // GLE — add GLE 450 4Matic, GLE 450d 4Matic
    v('Mercedes-Benz', 'GLE', 'GLE 450 4Matic', paise(1070000000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'GLE', 'GLE 450d 4Matic', paise(1120000000), 'Diesel', 'Automatic'),
    // GLS — add 3 more variants
    v('Mercedes-Benz', 'GLS', 'GLS 450 4MATIC AMG Line', paise(1320000000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'GLS', 'GLS 450d 4MATIC AMG Line', paise(1340000000), 'Diesel', 'Automatic'),
    v('Mercedes-Benz', 'GLS', 'GLS 450d 4MATIC', paise(1340000000), 'Diesel', 'Automatic'),
    // Maybach GLS — add Night Series + Celebration Edition
    v('Mercedes-Benz', 'Maybach GLS', 'Maybach GLS 600 Night Series', paise(3710000000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'Maybach GLS', 'Maybach GLS 600 Celebration Edition', paise(4100000000), 'Petrol', 'Automatic'),
    // Maybach S-Class — add S680
    v('Mercedes-Benz', 'Maybach S-Class', 'S680', paise(3473500000), 'Petrol', 'Automatic'),
    // S-Class — add S450 4Matic
    v('Mercedes-Benz', 'S-Class', 'S450 4Matic', paise(1795405400), 'Petrol', 'Automatic'),
    // V-Class — add V 260 Extra Long, V 300d Extra Long
    v('Mercedes-Benz', 'V-Class', 'V 260 Extra Long', paise(1400000000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'V-Class', 'V 300d Extra Long', paise(1400000000), 'Diesel', 'Automatic'),
    // EQS — add EQS 450+
    v('Mercedes-Benz', 'EQS', 'EQS 450+', paise(1300000000), 'Electric', 'Automatic'),
    // EQS SUV — add EQS SUV 580 4MATIC
    v('Mercedes-Benz', 'EQS SUV', 'EQS SUV 580 4MATIC', paise(1335000000), 'Electric', 'Automatic'),
    // EQB — add EQB 350 4Matic
    v('Mercedes-Benz', 'EQB', 'EQB 350 4Matic', paise(789000000), 'Electric', 'Automatic'),
    // AMG models — all new
    v('Mercedes-Benz', 'AMG A 45 S', 'AMG A 45 S 4MATIC+', paise(948000000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'AMG C 63', 'AMG C 63 S E Performance', paise(1910000000), 'Hybrid', 'Automatic'),
    v('Mercedes-Benz', 'AMG E 63 S', 'AMG E 63 S 4MATIC+', paise(1900000000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'AMG G-Class', 'AMG G 63', paise(4300000000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'AMG GLA 35', 'AMG GLA 35 4MATIC', paise(600700000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'AMG GT', 'AMG GT 55 4MATIC+', paise(2270000000), 'Petrol', 'Automatic'),
    v('Mercedes-Benz', 'AMG GT', 'AMG GT 63 4MATIC+', paise(3650000000), 'Petrol', 'Automatic'),
]);

// ============================================================
// STEP 10 — Add Ferrari (entirely missing brand)
// Data from: Supabase car_catalog + public/data/ferrari.json
// ============================================================
console.log('\n--- STEP 10: Add Ferrari brand ---');
data.ferrari = {};
addModels('ferrari', [
    v('Ferrari', 'Roma', 'V8', paise(3760000000), 'Petrol', 'Automatic', {
        engine_displacement_cc: 3855, power_bhp: 611, torque_nm: 760,
        mileage_kmpl_or_ev_range: 10.0, seating_capacity: 2, boot_space_l: 272,
        ground_clearance_mm: 125, dimensions: '4656/1974/1301',
        availability_status: 'on_sale', launch_year: 2021,
        image_urls: [{ value: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Ferrari/Roma/9538/1769678289085/front-left-side-47.jpg' }]
    }),
    v('Ferrari', '296 GTB', 'Assetto Fiorano', paise(5400000000), 'Hybrid', 'Automatic', {
        engine_displacement_cc: 2992, power_bhp: 818, torque_nm: 740,
        mileage_kmpl_or_ev_range: 18.0, seating_capacity: 2, boot_space_l: 92,
        ground_clearance_mm: 110, dimensions: '4565/1958/1187',
        availability_status: 'on_sale', launch_year: 2022,
        image_urls: [{ value: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Ferrari/296-GTB/9530/1769678172978/front-left-side-47.jpg' }]
    }),
    v('Ferrari', 'Purosangue', 'V12', paise(7000000000), 'Petrol', 'Automatic', {
        engine_displacement_cc: 6496, power_bhp: 715, torque_nm: 716,
        mileage_kmpl_or_ev_range: 8.0, seating_capacity: 4, boot_space_l: 473,
        ground_clearance_mm: 185, dimensions: '4973/2028/1589',
        availability_status: 'on_sale', launch_year: 2023,
        image_urls: [{ value: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Ferrari/Purosangue/10485/1769678437601/front-left-side-47.jpg' }]
    }),
    v('Ferrari', 'F8 Tributo', 'V8 Turbo', paise(4020000000), 'Petrol', 'Automatic', {
        engine_displacement_cc: 3902, power_bhp: 710, torque_nm: 770,
        mileage_kmpl_or_ev_range: 5.8, seating_capacity: 2, boot_space_l: 200,
        ground_clearance_mm: 130, dimensions: '4611/1979/1206',
        availability_status: 'on_sale', launch_year: 2020,
        image_urls: [{ value: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Ferrari/F8-Tributo/9525/1769678001068/front-left-side-47.jpg' }]
    }),
    v('Ferrari', 'SF90 Stradale', 'Assetto Fiorano', paise(7500000000), 'Hybrid', 'Automatic', {
        engine_displacement_cc: 3990, power_bhp: 769, torque_nm: 800,
        mileage_kmpl_or_ev_range: 18.0, seating_capacity: 2, boot_space_l: 92,
        ground_clearance_mm: 105, dimensions: '4591/1972/1186',
        availability_status: 'on_sale', launch_year: 2020,
        image_urls: [{ value: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Ferrari/SF90-Stradale/9532/1769678528743/front-left-side-47.jpg' }]
    }),
    v('Ferrari', 'Amalfi', 'V8', paise(5590000000), 'Petrol', 'Automatic', {
        engine_displacement_cc: 3902, power_bhp: 631, torque_nm: 760,
        mileage_kmpl_or_ev_range: 9.0, seating_capacity: 2, boot_space_l: 270,
        ground_clearance_mm: 120, dimensions: '4745/1975/1300',
        availability_status: 'on_sale', launch_year: 2026,
        image_urls: [{ value: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Ferrari/Amalfi/12977/1769677840498/front-left-side-47.jpg' }]
    }),
    v('Ferrari', '849 Testarossa', 'PHEV', paise(10370000000), 'Hybrid', 'Automatic', {
        engine_displacement_cc: 3990, power_bhp: 1035, torque_nm: 842,
        mileage_kmpl_or_ev_range: 12.0, seating_capacity: 2, boot_space_l: 92,
        ground_clearance_mm: 100, dimensions: '4600/1975/1190',
        availability_status: 'on_sale', launch_year: 2026,
        image_urls: [{ value: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Ferrari/849-Testarossa/13218/1769677999345/front-left-side-47.jpg' }]
    }),
    v('Ferrari', '12Cilindri', 'V12', paise(8500000000), 'Petrol', 'Automatic', {
        engine_displacement_cc: 6496, power_bhp: 818, torque_nm: 678,
        mileage_kmpl_or_ev_range: null, seating_capacity: 2, boot_space_l: 270,
        ground_clearance_mm: 115, dimensions: '4700/1975/1280',
        availability_status: 'upcoming', launch_year: 2028,
        image_urls: [{ value: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Ferrari/12Cilindri/12977/1769677840498/front-left-side-47.jpg' }]
    }),
]);

// ============================================================
// STEP 11 — Add Maserati (entirely missing brand)
// ============================================================
console.log('\n--- STEP 11: Add Maserati brand ---');
data.maserati = {};
addModels('maserati', [
    v('Maserati', 'Grecale', 'GT', paise(1310000000), 'Petrol', 'Automatic'),
    v('Maserati', 'Grecale', 'Trofeo', paise(2050000000), 'Petrol', 'Automatic'),
    v('Maserati', 'GranTurismo', 'Modena', paise(2250000000), 'Petrol', 'Automatic'),
    v('Maserati', 'GranTurismo', 'Trofeo', paise(2750000000), 'Petrol', 'Automatic'),
    v('Maserati', 'GranCabrio', 'Sport', paise(2460000000), 'Petrol', 'Automatic'),
    v('Maserati', 'GranCabrio', 'Trofeo', paise(2690000000), 'Petrol', 'Automatic'),
    v('Maserati', 'Levante', 'Diesel', paise(1490000000), 'Diesel', 'Automatic'),
    v('Maserati', 'Levante', 'S', paise(1750000000), 'Petrol', 'Automatic'),
    v('Maserati', 'Quattroporte', 'Diesel', paise(1670000000), 'Diesel', 'Automatic'),
    v('Maserati', 'Quattroporte', 'GranLusso', paise(1710000000), 'Petrol', 'Automatic'),
    v('Maserati', 'Quattroporte', 'GranSport', paise(1850000000), 'Petrol', 'Automatic'),
]);

// ============================================================
// STEP 12 — Add Rolls-Royce (entirely missing brand)
// ============================================================
console.log('\n--- STEP 12: Add Rolls-Royce brand ---');
data.rolls_royce = {};
addModels('rolls_royce', [
    v('Rolls-Royce', 'Cullinan', 'Base', paise(10500000000), 'Petrol', 'Automatic'),
    v('Rolls-Royce', 'Cullinan', 'Black Badge', paise(12250000000), 'Petrol', 'Automatic'),
    v('Rolls-Royce', 'Ghost Series II', 'Standard Wheelbase', paise(8950000000), 'Petrol', 'Automatic'),
    v('Rolls-Royce', 'Ghost Series II', 'Extended Wheelbase', paise(10520000000), 'Petrol', 'Automatic'),
    v('Rolls-Royce', 'Phantom', 'Standard Wheelbase', paise(8990000000), 'Petrol', 'Automatic'),
    v('Rolls-Royce', 'Phantom', 'Extended Wheelbase', paise(10480000000), 'Petrol', 'Automatic'),
    v('Rolls-Royce', 'Spectre', 'Base', paise(7500000000), 'Electric', 'Automatic'),
]);

// ============================================================
// WRITE OUTPUT — compact JSON (no spaces)
// ============================================================
console.log('\n--- Writing compact carInfo.json ---');
fs.writeFileSync(FILE, JSON.stringify(data));
const stats = fs.statSync(FILE);
console.log(`\n✅ Step 3 complete: carInfo.json updated (${(stats.size / 1024).toFixed(1)} KB)`);

// ============================================================
// SUMMARY
// ============================================================
console.log('\n=== SUMMARY ===');
console.log('Model name fixes:');
console.log(`  Mercedes-Benz: ${mbFixed} entries renamed`);
console.log(`  BMW: ${bmwFixed} entries renamed`);
console.log(`  Kia: ${kiaFixed} entries renamed`);
console.log('\nNew variants added:');
console.log('  Hyundai: 6 (Venue N Line)');
console.log('  Kia: 3 (Carens Clavis EV)');
console.log('  Mahindra: 2 (Bolero Neo Plus)');
console.log('  Tata: 6 (Tiago NRG x4, Xpres x2)');
console.log('  BMW: 10 (M4 x2, M4 Competition, M340i x2, X4, X5 M, M8, 3 Series GL x2)');
console.log('  Mercedes-Benz: 31 (A-Class+, C-Class+, E-Class+, G-Class+, GLA+, GLC new, GLE+, GLS+, Maybach+, S-Class+, V-Class+, EQS+, EQS SUV+, EQB+, AMG A45S, AMG C63, AMG E63S, AMG G-Class, AMG GLA35, AMG GT x2)');
console.log('\nNew brands added:');
console.log('  Ferrari: 8 models');
console.log('  Maserati: 11 variants (5 models)');
console.log('  Rolls-Royce: 7 variants (4 models)');
