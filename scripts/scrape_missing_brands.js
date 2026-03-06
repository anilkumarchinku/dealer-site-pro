/**
 * scrape_missing_brands.js
 * Scrapes vehicle images for trusted 2W brands that don't have image folders yet.
 * Uses Puppeteer + Bing Images. Only targets brands that are missing.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const https = require('https');
const http = require('http');

const IMAGES_BASE = path.join(process.cwd(), 'public/data/brand-model-images');

// Only brands that are MISSING from the scraped folder but are "trusted" (real manufacturers)
const MISSING_BRANDS = [
    {
        brandId: 'indian-motorcycle',
        brand: 'Indian Motorcycle',
        models: ['Chief Dark Horse', 'Chief Bobber Dark Horse', 'Sport Chief',
            'Super Chief Limited', 'Super Chief Dark Horse', 'Springfield',
            'Springfield Dark Horse', 'Chieftain Dark Horse', 'Chieftain Elite',
            'Roadmaster Elite', 'Pursuit Dark Horse', 'Challenger Dark Horse']
    },
    {
        brandId: 'moto-guzzi',
        brand: 'Moto Guzzi',
        models: ['V7', 'V7 Sport', 'V85 TT', 'V100 Mandello']
    },
    {
        brandId: 'cfmoto-india',
        brand: 'CFMoto',
        models: ['300NK', '300SS', '650NK', '650MT', '650GT', '700CL-X', '800MT']
    },
    {
        brandId: 'triumph-india',
        brand: 'Triumph',
        models: ['Speed 400', 'Scrambler 400 X', 'Street Twin', 'Speed Triple 1200 RS', 'Tiger Sport 660']
    },
    {
        brandId: 'kawasaki-india',
        brand: 'Kawasaki',
        models: ['Z650', 'Ninja 650', 'Versys 650', 'Z900', 'Ninja ZX-10R', 'W175']
    },
    {
        brandId: 'aprilia-india',
        brand: 'Aprilia',
        models: ['RS 457', 'Tuono 457', 'RS 660', 'Tuono 660', 'SXR 160']
    },
    {
        brandId: 'husqvarna-india',
        brand: 'Husqvarna',
        models: ['Vitpilen 125', 'Vitpilen 250', 'Svartpilen 401']
    },
    {
        brandId: 'benelli-india',
        brand: 'Benelli',
        models: ['TRK 502', '502C', 'Leoncino 500']
    },
    {
        brandId: 'jawa-motorcycles',
        brand: 'Jawa',
        models: ['Jawa 42', 'Jawa 350', 'Jawa Perak', 'Yezdi Roadster']
    },
    {
        brandId: 'keeway-india',
        brand: 'Keeway',
        models: ['K-Light 202', 'Vieste 300', 'TX 125E']
    }
];

async function ensureDir(dirPath) {
    await fsPromises.mkdir(dirPath, { recursive: true });
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function downloadImage(url, destination) {
    if (!url || !url.startsWith('http')) return Promise.resolve(false);
    const lib = url.startsWith('https') ? https : http;
    return new Promise((resolve) => {
        const file = fs.createWriteStream(destination);
        lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, response => {
            if (response.statusCode !== 200) { fs.unlink(destination, () => { }); resolve(false); return; }
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => { fs.unlink(destination, () => { }); resolve(false); });
    });
}

function modelToSlug(model) {
    return model.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function scrapeModelImage(page, brand, model, destPath) {
    const query = `${brand} ${model} motorcycle side view white background -site:wikipedia.org`;
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;

    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await delay(1500);

        const imgUrl = await page.evaluate(() => {
            const img = document.querySelector('.iusc');
            if (!img) return null;
            const meta = img.getAttribute('m');
            if (!meta) return null;
            try { return JSON.parse(meta).murl; } catch { return null; }
        });

        if (!imgUrl) { console.log(`  ✗ No image found for ${brand} ${model}`); return false; }

        const ext = imgUrl.includes('.png') ? '.png' : '.jpg';
        const success = await downloadImage(imgUrl, destPath + ext);
        if (success) { console.log(`  ✓ ${brand} ${model} → saved`); return true; }
        else { console.log(`  ✗ Download failed for ${brand} ${model}`); return false; }
    } catch (err) {
        console.log(`  ✗ Error scraping ${brand} ${model}: ${err.message}`);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting targeted image scrape for missing 2W brands...\n');

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    let totalSaved = 0;
    let totalFailed = 0;

    for (const brandData of MISSING_BRANDS) {
        const brandDir = path.join(IMAGES_BASE, '2w', brandData.brandId);
        await ensureDir(brandDir);

        console.log(`\n📦 ${brandData.brand} (${brandData.models.length} models)`);

        for (const model of brandData.models) {
            const slug = modelToSlug(model);
            const destBase = path.join(brandDir, slug);

            // Skip if already exists
            if (fs.existsSync(destBase + '.jpg') || fs.existsSync(destBase + '.png')) {
                console.log(`  ⏭  ${model} (already exists)`);
                totalSaved++;
                continue;
            }

            const ok = await scrapeModelImage(page, brandData.brand, model, destBase);
            if (ok) totalSaved++; else totalFailed++;
            await delay(800);
        }
    }

    await browser.close();
    console.log(`\n✅ Done! Saved: ${totalSaved}, Failed: ${totalFailed}`);
}

main().catch(console.error);
