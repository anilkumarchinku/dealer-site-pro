/**
 * scrape_gaps.js
 * Targeted scraper for models that exist in brand-models.json but have no scraped image file.
 * Reads brand-models.json, checks which model slugs are missing, and scrapes those.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const https = require('https');
const http = require('http');

const BRAND_MODELS = path.join(process.cwd(), 'public/data/brand-models.json');
const IMAGES_BASE = path.join(process.cwd(), 'public/data/brand-model-images');

// brandId mapping (brand name → folder name)
const BRAND_ID_MAP = {
    'Indian Motorcycle': 'indian-motorcycle',
    'Moto Guzzi': 'moto-guzzi',
    'CFMoto India': 'cfmoto-india',
    'Triumph India': 'triumph-india',
    'Kawasaki India': 'kawasaki-india',
    'Jawa Motorcycles': 'jawa-motorcycles',
    'Yezdi Motorcycles': 'yezdi-motorcycles',
    'Benelli India': 'benelli-india',
    'Husqvarna India': 'husqvarna-india',
    'Aprilia India': 'aprilia-india',
    'Keeway India': 'keeway-india',
    'Ducati India': 'ducati-india',
    'BMW Motorrad India': 'bmw-motorrad-india',
    'Harley-Davidson India': 'harley-davidson-india',
    'Vespa India': 'vespa-india',
};

function modelToSlug(model) {
    return model.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scrapeImage(page, brand, model, destBase) {
    // Use VERY specific query to avoid duplicates
    const query = `"${brand}" "${model}" 2024 side view motorcycle`;
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await delay(1200);
        const imgUrl = await page.evaluate(() => {
            const imgs = document.querySelectorAll('.iusc');
            for (const img of imgs) {
                const meta = img.getAttribute('m');
                if (!meta) continue;
                try {
                    const parsed = JSON.parse(meta);
                    if (parsed.murl && parsed.murl.startsWith('http')) return parsed.murl;
                } catch { continue; }
            }
            return null;
        });
        if (!imgUrl) { console.log(`  ✗ No image: ${brand} ${model}`); return false; }
        const ext = imgUrl.toLowerCase().includes('.png') ? '.png' : '.jpg';
        const ok = await downloadImage(imgUrl, destBase + ext);
        if (ok) { console.log(`  ✓ Saved: ${model}`); return true; }
        console.log(`  ✗ Download failed: ${model}`);
        return false;
    } catch (e) {
        console.log(`  ✗ Error: ${model} — ${e.message}`);
        return false;
    }
}

async function main() {
    const data = JSON.parse(fs.readFileSync(BRAND_MODELS, 'utf8'));
    const allBrands = [...data.twoWheelers.traditional, ...data.twoWheelers.electric];

    // Find all brand+model pairs missing images
    const missing = [];
    for (const brandData of allBrands) {
        const brandId = BRAND_ID_MAP[brandData.brand];
        if (!brandId) continue; // Only process brands with known image folders

        const brandDir = path.join(IMAGES_BASE, '2w', brandId);
        if (!fs.existsSync(brandDir)) { fs.mkdirSync(brandDir, { recursive: true }); }

        const models = Array.isArray(brandData.models)
            ? brandData.models
            : Object.values(brandData.models).flat();

        for (const model of models) {
            const slug = modelToSlug(model);
            const jpgExists = fs.existsSync(path.join(brandDir, slug + '.jpg'));
            const pngExists = fs.existsSync(path.join(brandDir, slug + '.png'));
            if (!jpgExists && !pngExists) {
                missing.push({ brand: brandData.brand, brandId, model, slug, brandDir });
            }
        }
    }

    console.log(`🔍 Found ${missing.length} missing model images across ${[...new Set(missing.map(m => m.brand))].join(', ')}\n`);

    if (missing.length === 0) { console.log('✅ All images are present!'); return; }

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    let saved = 0, failed = 0;
    let lastBrand = '';

    for (const { brand, brandId, model, slug, brandDir } of missing) {
        if (brand !== lastBrand) {
            console.log(`\n📦 ${brand}`);
            lastBrand = brand;
        }
        const ok = await scrapeImage(page, brand, model, path.join(brandDir, slug));
        if (ok) saved++; else failed++;
        await delay(700);
    }

    await browser.close();
    console.log(`\n✅ Done! Saved: ${saved}, Failed: ${failed}`);
}

main().catch(console.error);
