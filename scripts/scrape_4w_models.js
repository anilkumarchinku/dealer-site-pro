/**
 * scrape_4w_models.js
 * Scrapes model images for all 27 missing 4W brands.
 * Saves to: public/data/brand-model-images/4w/{brand-slug}/{model-slug}.jpg
 *
 * Run: node scripts/scrape_4w_models.js
 * Run single brand: node scripts/scrape_4w_models.js maruti-suzuki
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE_DIR = path.join(process.cwd(), 'public/data/brand-model-images/4w');

// ── Brand → models catalog ───────────────────────────────────────────────────
const BRANDS_4W = [
    {
        slug: 'maruti-suzuki',
        brand: 'Maruti Suzuki',
        models: ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Grand Vitara', 'Fronx', 'Jimny', 'Alto K10', 'Dzire', 'Ciaz'],
    },
    {
        slug: 'hyundai',
        brand: 'Hyundai',
        models: ['Creta', 'i20', 'Venue', 'Verna', 'Alcazar', 'Tucson', 'Exter', 'Ioniq 5'],
    },
    {
        slug: 'tata-motors',
        brand: 'Tata Motors',
        models: ['Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz', 'Tiago', 'Tigor', 'Curvv'],
    },
    {
        slug: 'mahindra',
        brand: 'Mahindra',
        models: ['XUV700', 'Thar', 'Scorpio-N', 'XUV400', 'Bolero', 'BE 6', 'XEV 9e', 'Thar Roxx'],
    },
    {
        slug: 'kia',
        brand: 'Kia',
        models: ['Seltos', 'Sonet', 'Carens', 'EV6', 'Carnival'],
    },
    {
        slug: 'toyota',
        brand: 'Toyota',
        models: ['Innova Crysta', 'Fortuner', 'Hyryder', 'Hilux', 'Camry', 'Glanza', 'Urban Cruiser Taisor'],
    },
    {
        slug: 'renault',
        brand: 'Renault',
        models: ['Kwid', 'Triber', 'Kiger'],
    },
    {
        slug: 'nissan',
        brand: 'Nissan',
        models: ['Magnite', 'X-Trail'],
    },
    {
        slug: 'volkswagen',
        brand: 'Volkswagen',
        models: ['Taigun', 'Virtus', 'Tiguan'],
    },
    {
        slug: 'skoda',
        brand: 'Skoda',
        models: ['Slavia', 'Kushaq', 'Kodiaq', 'Superb', 'Octavia'],
    },
    {
        slug: 'mg',
        brand: 'MG',
        models: ['Hector', 'Astor', 'Comet EV', 'Windsor EV', 'Gloster', 'ZS EV'],
    },
    {
        slug: 'jeep',
        brand: 'Jeep',
        models: ['Meridian', 'Compass', 'Wrangler', 'Grand Cherokee'],
    },
    {
        slug: 'citroen',
        brand: 'Citroen',
        models: ['C3', 'C3 Aircross', 'C5 Aircross'],
    },
    {
        slug: 'force-motors',
        brand: 'Force Motors',
        models: ['Gurkha', 'Trax Cruiser'],
    },
    {
        slug: 'isuzu',
        brand: 'Isuzu',
        models: ['D-Max', 'D-Max V-Cross', 'MU-X'],
    },
    {
        slug: 'bmw',
        brand: 'BMW',
        models: ['3 Series', '5 Series', 'X1', 'X3', 'X5', 'X7', 'i4', 'iX'],
    },
    {
        slug: 'mercedes-benz',
        brand: 'Mercedes-Benz',
        models: ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'EQS', 'GLS'],
    },
    {
        slug: 'audi',
        brand: 'Audi',
        models: ['A4', 'A6', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron GT', 'Q8 e-tron'],
    },
    {
        slug: 'jaguar',
        brand: 'Jaguar',
        models: ['F-Pace', 'XE', 'XF', 'F-Type', 'I-Pace'],
    },
    {
        slug: 'land-rover',
        brand: 'Land Rover',
        models: ['Defender', 'Discovery', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover'],
    },
    {
        slug: 'volvo',
        brand: 'Volvo',
        models: ['XC40', 'XC60', 'XC90', 'S90', 'C40 Recharge'],
    },
    {
        slug: 'lexus',
        brand: 'Lexus',
        models: ['NX', 'RX', 'UX', 'LX', 'ES', 'LS'],
    },
    {
        slug: 'porsche',
        brand: 'Porsche',
        models: ['Cayenne', 'Macan', 'Panamera', '911', 'Taycan'],
    },
    {
        slug: 'bentley',
        brand: 'Bentley',
        models: ['Bentayga', 'Continental GT', 'Flying Spur', 'Bentayga EWB'],
    },
    {
        slug: 'lamborghini',
        brand: 'Lamborghini',
        models: ['Urus', 'Huracan', 'Revuelto'],
    },
    {
        slug: 'mini',
        brand: 'MINI',
        models: ['Cooper', 'Countryman', 'Clubman', 'Paceman'],
    },
    {
        slug: 'byd',
        brand: 'BYD',
        models: ['Atto 3', 'Seal', 'Sealion 6', 'e6'],
    },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function modelToSlug(m) {
    return m.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function downloadImage(url, dest) {
    if (!url || !url.startsWith('http')) return false;
    const proto = url.startsWith('https') ? https : http;
    return new Promise(resolve => {
        const file = fs.createWriteStream(dest);
        proto.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' }
        }, res => {
            if (res.statusCode !== 200) { fs.unlink(dest, () => {}); resolve(false); return; }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => { fs.unlink(dest, () => {}); resolve(false); });
    });
}

async function scrapeModelImage(page, brand, model, destDir) {
    const query = `${brand} ${model} car side view 2024 official white background`;
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;

    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await delay(1800);

        const imgUrl = await page.evaluate(() => {
            const imgs = document.querySelectorAll('.iusc');
            for (const img of imgs) {
                try {
                    const meta = JSON.parse(img.getAttribute('m') || '{}');
                    if (meta.murl && meta.murl.startsWith('http')) return meta.murl;
                } catch { continue; }
            }
            return null;
        });

        if (!imgUrl) { console.log(`    ❌ No image: ${model}`); return false; }

        const slug = modelToSlug(model);
        const ext = imgUrl.toLowerCase().includes('.png') ? '.png' : '.jpg';
        const dest = path.join(destDir, `${slug}${ext}`);

        // Remove old file with different extension
        const altDest = path.join(destDir, `${slug}${ext === '.jpg' ? '.png' : '.jpg'}`);
        if (fs.existsSync(altDest)) fs.unlinkSync(altDest);

        const ok = await downloadImage(imgUrl, dest);
        if (ok) { console.log(`    ✅ ${slug}${ext}`); return true; }
        console.log(`    ❌ Download failed: ${model}`);
        return false;
    } catch (err) {
        console.log(`    ❌ Error (${model}): ${err.message}`);
        return false;
    }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const filterSlug = process.argv[2]; // Optional: run single brand
    const brands = filterSlug
        ? BRANDS_4W.filter(b => b.slug === filterSlug)
        : BRANDS_4W;

    if (filterSlug && brands.length === 0) {
        console.error(`❌ Brand not found: ${filterSlug}`);
        console.log('Available:', BRANDS_4W.map(b => b.slug).join(', '));
        process.exit(1);
    }

    console.log(`🚀 4W Model Image Scraper`);
    console.log(`   Brands: ${brands.length} | Total models: ${brands.reduce((s, b) => s + b.models.length, 0)}\n`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

    let totalSaved = 0, totalFailed = 0;

    for (const { slug, brand, models } of brands) {
        const destDir = path.join(BASE_DIR, slug);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        console.log(`\n📦 ${brand} (${models.length} models) → 4w/${slug}/`);

        for (const model of models) {
            const ok = await scrapeModelImage(page, brand, model, destDir);
            if (ok) totalSaved++; else totalFailed++;
            await delay(1200);
        }
    }

    await browser.close();
    console.log(`\n\n✅ Done!`);
    console.log(`   Saved: ${totalSaved} | Failed: ${totalFailed}`);
    console.log(`   Output: public/data/brand-model-images/4w/`);
}

main().catch(console.error);
