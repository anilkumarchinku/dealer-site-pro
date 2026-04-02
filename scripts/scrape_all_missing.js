/**
 * scrape_all_missing.js
 * Scrapes all 240 missing brand-model images (2W + 3W + 4W).
 * Generated from audit on 2026-04-01.
 *
 * Run all:    node scripts/scrape_all_missing.js
 * One brand:  node scripts/scrape_all_missing.js honda
 * One cat:    node scripts/scrape_all_missing.js --cat 4w
 * Dry run:    node scripts/scrape_all_missing.js --dry
 *
 * Output: public/data/brand-model-images/{2w|3w|4w}/{brand-slug}/{model-slug}.jpg
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE_DIR = path.join(process.cwd(), 'public/data/brand-model-images');

// ── Supabase upload ───────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://llsvbyeumrfngjvbedbz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3ZieWV1bXJmbmdqdmJlZGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwODMxNywiZXhwIjoyMDg2ODg0MzE3fQ.NUlqttWkhTpQEcTCLQ7GPLkQvEpoW-6g4UuEPkYJnaE';
const BUCKET = 'brand-model-images';

function uploadToSupabase(localFile, storagePath) {
    return new Promise(resolve => {
        const data = fs.readFileSync(localFile);
        const mime = localFile.endsWith('.png') ? 'image/png' : 'image/jpeg';
        const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`;
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'apikey': SUPABASE_KEY,
                'Content-Type': mime,
                'x-upsert': 'true',
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Length': data.length,
            },
        };
        const req = https.request(url, options, res => {
            res.resume();
            resolve(res.statusCode === 200 || res.statusCode === 201);
        });
        req.on('error', () => resolve(false));
        req.write(data);
        req.end();
    });
}

// ── Target catalog (all missing images from audit) ────────────────────────────

const MISSING = [

    // ═══════════════════════════════════════════════════════════
    // 2W — TWO WHEELERS
    // ═══════════════════════════════════════════════════════════

    {
        cat: '2w', slug: 'honda', brand: 'Honda',
        searchSuffix: 'motorcycle scooter India side view official',
        models: [
            'Activa', 'Activa 125', 'Activa e', 'Dio', 'Dio 125',
            'Shine', 'Shine 100', 'SP 125', 'SP160', 'Livo',
            'Unicorn', 'Hornet 2.0', 'CB300F', 'CB350RS', 'Hness CB350',
            'NX200', 'NX500', 'CB650R', 'CB750 Hornet', 'CB1000 Hornet',
            'CB125 Hornet', 'CBR650R', 'CBR1000RR-R Fireblade',
            'Transalp XL750', 'X-ADV 750', 'Goldwing Tour', 'QC1',
        ],
    },
    {
        cat: '2w', slug: 'ola-electric', brand: 'Ola Electric',
        searchSuffix: 'electric scooter India side view official',
        models: [
            'Roadster Base', 'Roadster Pro', 'Roadster Ultra',
            'S1 X+ 2 kWh', 'S1 X+ 3 kWh', 'S1 X+ 4 kWh',
        ],
    },
    {
        cat: '2w', slug: 'lectrix-ev', brand: 'Lectrix EV',
        searchSuffix: 'electric scooter India side view official',
        models: ['City', 'EV Cafe', 'Electric Scooter', 'LXS G3.0', 'Loop', 'SX Flex'],
    },
    {
        cat: '2w', slug: 'odysse-electric', brand: 'Odysse Electric',
        searchSuffix: 'electric scooter motorcycle India side view',
        models: ['E2', 'E2S', 'E4', 'Rogue', 'Stream'],
    },
    {
        cat: '2w', slug: 'bgauss', brand: 'BGauss',
        searchSuffix: 'electric scooter India side view official',
        models: ['A2 Neo', 'B8 Neo', 'D15i Neo', 'RUV501'],
    },
    {
        cat: '2w', slug: 'bajaj-chetak-ev', brand: 'Bajaj Chetak',
        searchSuffix: 'electric scooter India side view official',
        models: ['Chetak Leadr', 'Chetak Legacy', 'Chetak Premium', 'Chetak Urbane'],
    },
    {
        cat: '2w', slug: 'kabira-mobility', brand: 'Kabira Mobility',
        searchSuffix: 'electric motorcycle India side view official',
        models: ['Intercity FS', 'Intercity Neo', 'KM3000', 'KM4000'],
    },
    {
        cat: '2w', slug: 'quantum-energy', brand: 'Quantum Energy',
        searchSuffix: 'electric scooter India side view official',
        models: ['Elko', 'Hum Se Honda', 'Miles 52', 'Miles 60'],
    },
    {
        cat: '2w', slug: 'indian-motorcycle', brand: 'Indian Motorcycle',
        searchSuffix: 'motorcycle side view official 2024',
        models: ['101 Scout', 'Scout Classic', 'Sport Scout', 'Super Scout'],
    },
    {
        cat: '2w', slug: 'ducati-india', brand: 'Ducati',
        searchSuffix: 'motorcycle India side view official white background',
        models: ['Scrambler Icon', 'Scrambler Nightshift', 'XDiavel V4'],
    },
    {
        cat: '2w', slug: 'battre-ev', brand: 'Battre Electric',
        searchSuffix: 'electric scooter India side view official',
        models: ['EM', 'Smart', 'Yelo'],
    },
    {
        cat: '2w', slug: 'okaya-ev', brand: 'Okaya EV',
        searchSuffix: 'electric scooter India side view official',
        models: ['Classiq Pro', 'Ferrato Connect', 'Hunk H1'],
    },
    {
        cat: '2w', slug: 'tvs-iqube', brand: 'TVS iQube',
        searchSuffix: 'electric scooter India side view official',
        models: ['TVS iQube', 'TVS iQube S', 'TVS iQube ST'],
    },
    {
        cat: '2w', slug: 'hero-electric', brand: 'Hero Electric',
        searchSuffix: 'electric scooter India side view official',
        models: ['Optima CX', 'Photon CX'],
    },
    {
        cat: '2w', slug: 'ivoomi-energy', brand: 'iVoomi',
        searchSuffix: 'electric scooter India side view official',
        models: ['Energy', 'S1 Pro'],
    },
    {
        cat: '2w', slug: 'joy-e-bike', brand: 'Joy e-bike',
        searchSuffix: 'electric scooter India side view official',
        models: ['Monster', 'Wolf Plus'],
    },
    {
        cat: '2w', slug: 'keeway-india', brand: 'Keeway India',
        searchSuffix: 'motorcycle India side view official',
        models: ['SR250', 'ZW25R'],
    },
    {
        cat: '2w', slug: 'mahindra-two-wheelers', brand: 'Mahindra Two Wheelers',
        searchSuffix: 'motorcycle India side view official',
        models: ['Centuro N1', 'Mojo 300 ABS'],
    },
    {
        cat: '2w', slug: 'ampere-greaves', brand: 'Ampere',
        searchSuffix: 'electric scooter India side view official',
        models: ['Magnus Pro', 'Primus'],
    },
    {
        cat: '2w', slug: 'bajaj-auto', brand: 'Bajaj',
        searchSuffix: 'motorcycle India side view official white background',
        models: ['CT 110'],
    },
    {
        cat: '2w', slug: 'bmw-motorrad-india', brand: 'BMW Motorrad',
        searchSuffix: 'motorcycle India side view official white background',
        models: ['M 1000 R'],
    },
    {
        cat: '2w', slug: 'komaki', brand: 'Komaki',
        searchSuffix: 'electric scooter India side view official',
        models: ['Komaki Ranger'],
    },
    {
        cat: '2w', slug: 'matter-ev', brand: 'Matter',
        searchSuffix: 'electric motorcycle India side view official',
        models: ['Aera 6000+'],
    },
    {
        cat: '2w', slug: 'river-ev', brand: 'River EV',
        searchSuffix: 'electric scooter India side view official',
        models: ['Indie'],
    },
    {
        cat: '2w', slug: 'simple-energy', brand: 'Simple Energy',
        searchSuffix: 'electric scooter India side view official',
        models: ['Simple One'],
    },
    {
        cat: '2w', slug: 'triumph-india', brand: 'Triumph',
        searchSuffix: 'motorcycle India side view official white background',
        models: ['Street Triple R'],
    },
    {
        cat: '2w', slug: 'tvs-iqube', brand: 'TVS iQube',
        searchSuffix: 'electric scooter side view official white background',
        models: ['TVS iQube', 'TVS iQube S', 'TVS iQube ST'],
    },
    {
        cat: '2w', slug: 'ultraviolette', brand: 'Ultraviolette',
        searchSuffix: 'electric motorcycle India side view official',
        models: ['F77 Recon'],
    },
    {
        cat: '2w', slug: 'vespa-india', brand: 'Vespa',
        searchSuffix: 'scooter India side view official white background',
        models: ['Vespa ZX 125'],
    },
    {
        cat: '2w', slug: 'vida-hero', brand: 'Vida',
        searchSuffix: 'electric scooter India side view official',
        models: ['VX2'],
    },
    {
        cat: '2w', slug: 'yamaha-india', brand: 'Yamaha',
        searchSuffix: 'motorcycle India side view official white background',
        models: ['FZ-S Fi V4'],
    },
    {
        cat: '2w', slug: 'yulu', brand: 'Yulu',
        searchSuffix: 'electric scooter India side view official',
        models: ['Miracle GR'],
    },

    // ═══════════════════════════════════════════════════════════
    // 3W — THREE WHEELERS
    // ═══════════════════════════════════════════════════════════

    {
        cat: '3w', slug: 'euler-motors', brand: 'Euler Motors',
        searchSuffix: 'electric three wheeler cargo side view India official',
        models: [
            '2200/TR Electric', '2200/XR Electric', 'T1500 Electric',
            'LongRange 200 Electric', '2080/City Electric',
            '2180/Fast Charge Electric', '2180/Maxx Electric',
            '2200/MAXX Electric', '2200/PLUS Electric', '2200/SR Electric',
            'PLUS Electric', 'MAXX Electric',
        ],
    },
    {
        cat: '3w', slug: 'piaggio-ape', brand: 'Piaggio Ape',
        searchSuffix: 'three wheeler auto rickshaw side view India official',
        models: ['Ape City Plus CNG', 'Ape City Plus LPG', 'Ape City Plus Petrol', 'Ape Truk Plus Diesel'],
    },
    {
        cat: '3w', slug: 'tvs-king', brand: 'TVS King',
        searchSuffix: 'three wheeler auto rickshaw side view India official',
        models: ['King ZS+ Fi-4S CNG', 'King LS+ Fi-4S LPG', 'King GS+ Fi-4S Petrol'],
    },
    {
        cat: '3w', slug: 'bajaj-auto-3w', brand: 'Bajaj',
        searchSuffix: 'three wheeler auto rickshaw side view India official',
        models: ['Maxima C2 Petrol', 'Maxima Z Plus CNG', 'RE Optima Plus Electric'],
    },
    {
        cat: '3w', slug: 'greaves-electric-3w', brand: 'Greaves Electric',
        searchSuffix: 'electric three wheeler cargo side view India official',
        models: ['Greaves D435 Cargo', 'Greaves D435 City', 'Greaves D599 Plus City', 'Greaves Eltra City'],
    },
    {
        cat: '3w', slug: 'atul-auto', brand: 'Atul Auto',
        searchSuffix: 'three wheeler auto rickshaw side view India official',
        models: ['Smart 3-Seater CNG', 'E-Rik Electric'],
    },
    {
        cat: '3w', slug: 'mahindra-3w', brand: 'Mahindra',
        searchSuffix: 'three wheeler auto rickshaw side view India official',
        models: ['Alfa Plus CNG', 'Alfa Plus Petrol', 'Alfa Plus LPG'],
    },
    {
        cat: '3w', slug: 'kinetic-green', brand: 'Kinetic Green',
        searchSuffix: 'three wheeler CNG auto rickshaw side view India official',
        models: ['Safar Passenger CNG'],
    },
    {
        cat: '3w', slug: 'terra-motors', brand: 'Terra Motors',
        searchSuffix: 'electric three wheeler side view India official',
        models: ['Terra Motors Toro'],
    },

    // ═══════════════════════════════════════════════════════════
    // 4W — FOUR WHEELERS
    // ═══════════════════════════════════════════════════════════

    {
        cat: '4w', slug: 'ferrari', brand: 'Ferrari',
        searchSuffix: 'car side view official white background 2024',
        models: ['12Cilindri', '296 GTB', '849 Testarossa', 'Amalfi', 'F8 Tributo', 'Purosangue', 'Roma', 'SF90 Stradale'],
    },
    {
        cat: '4w', slug: 'maserati', brand: 'Maserati',
        searchSuffix: 'car side view official white background 2024',
        models: ['GranCabrio', 'GranTurismo', 'Grecale', 'Levante', 'Quattroporte'],
    },
    {
        cat: '4w', slug: 'rolls-royce', brand: 'Rolls-Royce',
        searchSuffix: 'car side view official white background 2024',
        models: ['Cullinan', 'Ghost Series II', 'Phantom', 'Spectre'],
    },
    {
        cat: '4w', slug: 'tata-motors', brand: 'Tata',
        searchSuffix: 'car side view official white background India 2024',
        models: [
            'Curvv EV', 'Harrier EV', 'Nexon EV', 'Punch EV',
            'Safari', 'Sierra', 'Tiago EV', 'Tiago NRG',
            'Tigor EV', 'Xpres', 'Xpres-T EV', 'Yodha Pickup',
        ],
    },
    {
        cat: '4w', slug: 'mercedes-benz', brand: 'Mercedes-Benz',
        searchSuffix: 'car side view official white background 2024',
        models: [
            'AMG A 45 S', 'AMG C 63', 'AMG C43', 'AMG CLE 53', 'AMG E 63 S',
            'AMG GLA 35', 'AMG GLE 63 S', 'AMG GT R', 'EQB', 'EQE SUV',
            'EQS SUV', 'G-Class', 'GLA', 'Maybach GLS', 'Maybach S-Class',
        ],
    },
    {
        cat: '4w', slug: 'bmw', brand: 'BMW',
        searchSuffix: 'car side view official white background 2024',
        models: [
            '2 Series Gran Coupe', '3 Series Gran Limousine', '7 Series',
            '8 Series Gran Coupe', 'M2', 'M4 Competition', 'M5', 'M8',
            'M8 Coupe Competition', 'X5 M Competition', 'XM', 'Z4', 'i5', 'i7', 'iX1',
        ],
    },
    {
        cat: '4w', slug: 'mahindra', brand: 'Mahindra',
        searchSuffix: 'car SUV side view official white background India 2024',
        models: [
            'Bolero Camper', 'Bolero Neo', 'Bolero Neo Plus', 'Bolero Pik-Up',
            'Marazzo', 'XEV 9S', 'XUV 3XO', 'XUV 7XO',
        ],
    },
    {
        cat: '4w', slug: 'hyundai', brand: 'Hyundai',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Aura', 'Creta EV', 'Creta N Line', 'Grand i10 Nios', 'Prime HB', 'Prime SD', 'Venue N Line'],
    },
    {
        cat: '4w', slug: 'toyota', brand: 'Toyota',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Fortuner Legender', 'Innova Hycross', 'Rumion', 'Taisor', 'Urban Cruiser Hyryder', 'Vellfire'],
    },
    {
        cat: '4w', slug: 'citroen', brand: 'Citroen',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Aircross', 'Basalt', 'eC3'],
    },
    {
        cat: '4w', slug: 'land-rover', brand: 'Land Rover',
        searchSuffix: 'car SUV side view official white background 2024',
        models: ['Discovery Sport', 'Range Rover Velar'],
    },
    {
        cat: '4w', slug: 'lexus', brand: 'Lexus',
        searchSuffix: 'car side view official white background India 2024',
        models: ['LM', 'LX'],
    },
    {
        cat: '4w', slug: 'kia', brand: 'Kia',
        searchSuffix: 'car side view official white background India 2024',
        models: ['EV9', 'Syros'],
    },
    {
        cat: '4w', slug: 'mg', brand: 'MG',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Cyberster', 'Hector Plus', 'M9'],
    },
    {
        cat: '4w', slug: 'vinfast', brand: 'VinFast',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Limo Green', 'VF 3'],
    },
    {
        cat: '4w', slug: 'aston-martin', brand: 'Aston Martin',
        searchSuffix: 'car side view official white background 2024',
        models: ['DB11', 'DBS Superleggera'],
    },
    {
        cat: '4w', slug: 'audi', brand: 'Audi',
        searchSuffix: 'car side view official white background India 2024',
        models: ['RS Q8', 'S5 Sportback'],
    },
    {
        cat: '4w', slug: 'jeep', brand: 'Jeep',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Compass'],
    },
    {
        cat: '4w', slug: 'skoda', brand: 'Skoda',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Kylaq'],
    },
    {
        cat: '4w', slug: 'renault', brand: 'Renault',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Duster'],
    },
    {
        cat: '4w', slug: 'porsche', brand: 'Porsche',
        searchSuffix: 'car side view official white background 2024',
        models: ['Cayenne Coupe'],
    },
    {
        cat: '4w', slug: 'volvo', brand: 'Volvo',
        searchSuffix: 'car side view official white background 2024',
        models: ['EX30'],
    },
    {
        cat: '4w', slug: 'byd', brand: 'BYD',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Sealion 7'],
    },
    {
        cat: '4w', slug: 'bentley', brand: 'Bentley',
        searchSuffix: 'car side view official white background 2024',
        models: ['Continental GTC'],
    },
    {
        cat: '4w', slug: 'honda', brand: 'Honda',
        searchSuffix: 'car side view official white background India 2024',
        models: ['Amaze 2nd Gen', 'Elevate'],
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function modelToSlug(m) {
    return m.toLowerCase()
        .replace(/\./g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadImage(url, dest) {
    if (!url || !url.startsWith('http')) return Promise.resolve(false);
    const proto = url.startsWith('https') ? https : http;
    return new Promise(resolve => {
        const file = fs.createWriteStream(dest);
        const req = proto.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/jpeg,image/png,*/*',
            },
            timeout: 20000,
        }, res => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                file.close();
                fs.unlink(dest, () => {});
                return downloadImage(res.headers.location, dest).then(resolve);
            }
            if (res.statusCode !== 200) {
                file.close();
                fs.unlink(dest, () => {});
                resolve(false);
                return;
            }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        });
        req.on('error', () => { fs.unlink(dest, () => {}); resolve(false); });
        req.on('timeout', () => { req.destroy(); fs.unlink(dest, () => {}); resolve(false); });
    });
}

async function scrapeImage(page, brand, model, searchSuffix, destDir) {
    const slug = modelToSlug(model);
    const destJpg = path.join(destDir, `${slug}.jpg`);
    const destPng = path.join(destDir, `${slug}.png`);

    // Skip if already downloaded
    if (fs.existsSync(destJpg) || fs.existsSync(destPng)) {
        console.log(`    ⏭  ${slug} (exists)`);
        return 'skip';
    }

    const query = `${brand} ${model} ${searchSuffix}`;
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;

    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await delay(2000);

        const imgUrl = await page.evaluate(() => {
            const imgs = document.querySelectorAll('.iusc');
            for (const img of imgs) {
                try {
                    const meta = JSON.parse(img.getAttribute('m') || '{}');
                    if (meta.murl && meta.murl.startsWith('http')) return meta.murl;
                } catch { continue; }
            }
            // Fallback: try imgpt elements
            const imgs2 = document.querySelectorAll('a.iusc img, .imgpt img');
            for (const img of imgs2) {
                const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
                if (src.startsWith('http') && !src.includes('bing.com')) return src;
            }
            return null;
        });

        if (!imgUrl) {
            console.log(`    ❌ No image found: ${model}`);
            return 'fail';
        }

        const isPng = imgUrl.toLowerCase().includes('.png');
        const ext = isPng ? '.png' : '.jpg';
        const dest = isPng ? destPng : destJpg;
        const ok = await downloadImage(imgUrl, dest);

        if (ok) {
            // Upload to Supabase Storage
            const storagePath = dest.replace(/.*brand-model-images\//, '').replace(/\\/g, '/');
            const uploaded = await uploadToSupabase(dest, storagePath);
            console.log(`    ✅ ${slug}${ext}${uploaded ? ' → S3 ✓' : ' → S3 ✗'}`);
            return 'ok';
        }
        console.log(`    ❌ Download failed: ${model} (${imgUrl.slice(0, 60)}...)`);
        return 'fail';
    } catch (err) {
        console.log(`    ❌ Error (${model}): ${err.message?.slice(0, 80)}`);
        return 'fail';
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    const args = process.argv.slice(2);
    const dry = args.includes('--dry');
    const catFilter = args.find(a => a.startsWith('--cat='))?.split('=')[1]
                   || (args.find(a => a === '--cat') ? args[args.indexOf('--cat') + 1] : null);
    const brandFilter = args.find(a => !a.startsWith('--'));

    // Deduplicate MISSING entries (same slug can appear twice like tvs-iqube)
    const seen = new Map();
    for (const entry of MISSING) {
        const key = `${entry.cat}::${entry.slug}`;
        if (!seen.has(key)) {
            seen.set(key, { ...entry, models: [...entry.models] });
        } else {
            // Merge models, deduplicate
            const existing = seen.get(key);
            for (const m of entry.models) {
                if (!existing.models.includes(m)) existing.models.push(m);
            }
        }
    }
    let targets = [...seen.values()];

    if (catFilter) targets = targets.filter(t => t.cat === catFilter);
    if (brandFilter) targets = targets.filter(t => t.slug === brandFilter);

    if (targets.length === 0) {
        console.error(`❌ No matching targets. Available slugs:\n  ${[...seen.keys()].join('\n  ')}`);
        process.exit(1);
    }

    const totalModels = targets.reduce((s, t) => s + t.models.length, 0);
    console.log(`\n🚀 Missing Image Scraper — All Categories`);
    console.log(`   Brands: ${targets.length} | Models: ${totalModels}`);
    if (catFilter) console.log(`   Category filter: ${catFilter}`);
    if (brandFilter) console.log(`   Brand filter: ${brandFilter}`);
    if (dry) { console.log('\n[DRY RUN] Would scrape:'); targets.forEach(t => console.log(`  ${t.cat}/${t.slug}: ${t.models.join(', ')}`)); return; }
    console.log('');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

    let ok = 0, failed = 0, skipped = 0;

    for (const { cat, slug, brand, searchSuffix, models } of targets) {
        const destDir = path.join(BASE_DIR, cat, slug);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        console.log(`\n📦 [${cat.toUpperCase()}] ${brand} (${models.length}) → ${cat}/${slug}/`);

        for (const model of models) {
            const result = await scrapeImage(page, brand, model, searchSuffix, destDir);
            if (result === 'ok') ok++;
            else if (result === 'fail') failed++;
            else skipped++;
            await delay(1500);
        }
    }

    await browser.close();

    console.log(`\n\n✅ Done!`);
    console.log(`   Saved:   ${ok}`);
    console.log(`   Failed:  ${failed}`);
    console.log(`   Skipped: ${skipped} (already existed)`);
    console.log(`\n   Output: public/data/brand-model-images/{2w,3w,4w}/`);
    if (failed > 0) {
        console.log(`\n   Tip: Re-run with a brand slug to retry failures:`);
        console.log(`   node scripts/scrape_all_missing.js honda`);
    }
}

main().catch(console.error);
