/**
 * scrape_all_gaps.js
 * Reads scripts/missing_gaps.json and scrapes all missing 2W + 3W vehicle images.
 * Uses specific Bing Image searches with quoted brand+model for better accuracy.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const GAPS_FILE = path.join(process.cwd(), 'scripts', 'missing_gaps.json');
const IMAGES_BASE = path.join(process.cwd(), 'public/data/brand-model-images');

function modelToSlug(m) {
    return m.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function downloadImage(url, destination) {
    if (!url || !url.startsWith('http')) return Promise.resolve(false);
    const lib = url.startsWith('https') ? https : http;
    return new Promise((resolve) => {
        const file = fs.createWriteStream(destination);
        lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120' } }, response => {
            if (response.statusCode !== 200) { fs.unlink(destination, () => { }); resolve(false); return; }
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => { fs.unlink(destination, () => { }); resolve(false); });
    });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scrapeImage(page, brand, model, category, destBase) {
    // Very specific search query to get exact model images
    const typeHint = category === '3w' ? 'auto rickshaw' : 'motorcycle scooter';
    const query = `"${brand}" "${model}" 2024 ${typeHint} side view`;
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;

    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await delay(1500);

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

        if (!imgUrl) { return false; }
        const ext = imgUrl.toLowerCase().includes('.png') ? '.png' : '.jpg';
        return await downloadImage(imgUrl, destBase + ext);
    } catch {
        return false;
    }
}

async function main() {
    if (!fs.existsSync(GAPS_FILE)) {
        console.error('Run audit_all_images.js first to generate missing_gaps.json');
        process.exit(1);
    }

    const gaps = JSON.parse(fs.readFileSync(GAPS_FILE, 'utf8'));
    let totalMissing = 0;
    for (const b of [...(gaps.twoWheelers || []), ...(gaps.threeWheelers || [])]) {
        totalMissing += b.models.length;
    }

    console.log(`🚀 Starting comprehensive image scrape — ${totalMissing} images needed\n`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    let saved = 0, failed = 0;

    // 2W brands
    for (const brandData of (gaps.twoWheelers || [])) {
        const brandDir = path.join(IMAGES_BASE, '2w', brandData.brandId);
        fs.mkdirSync(brandDir, { recursive: true });
        console.log(`\n📦 ${brandData.brand} (${brandData.models.length} missing)`);

        for (const model of brandData.models) {
            const slug = modelToSlug(model);
            const destBase = path.join(brandDir, slug);
            console.log(`  ↓ ${model}...`);
            const ok = await scrapeImage(page, brandData.brand, model, '2w', destBase);
            if (ok) { saved++; console.log(`    ✓`); }
            else { failed++; console.log(`    ✗`); }
            await delay(600);
        }
    }

    // 3W brands
    for (const brandData of (gaps.threeWheelers || [])) {
        const brandDir = path.join(IMAGES_BASE, '3w', brandData.brandId);
        fs.mkdirSync(brandDir, { recursive: true });
        console.log(`\n🛺 ${brandData.brand} (${brandData.models.length} missing)`);

        for (const model of brandData.models) {
            if (typeof model !== 'string' || model.length > 60) {
                console.log(`  ⏭  Skip: ${String(model).slice(0, 40)}...`);
                continue;
            }
            const slug = modelToSlug(model);
            const destBase = path.join(brandDir, slug);
            console.log(`  ↓ ${model}...`);
            const ok = await scrapeImage(page, brandData.brand, model, '3w', destBase);
            if (ok) { saved++; console.log(`    ✓`); }
            else { failed++; console.log(`    ✗`); }
            await delay(600);
        }
    }

    await browser.close();
    console.log(`\n\n✅ Comprehensive scrape complete!`);
    console.log(`   Saved: ${saved} | Failed: ${failed} | Total: ${totalMissing}`);
}

main().catch(console.error);
