/**
 * scrape_4w_gaps.js
 * Scrapes only the specific 4W model images that failed in the main scrape.
 * Also picks up the one missing 2W model (Matter Aera 5000+).
 *
 * Run: node scripts/scrape_4w_gaps.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE_4W = path.join(process.cwd(), 'public/data/brand-model-images/4w');
const BASE_2W = path.join(process.cwd(), 'public/data/brand-model-images/2w');

// ── Missing 4W models ─────────────────────────────────────────────────────────
const GAPS_4W = [
    { slug: 'toyota',     brand: 'Toyota',     models: ['Innova Crysta', 'Fortuner'] },
    { slug: 'kia',        brand: 'Kia',         models: ['Carens'] },
    { slug: 'mahindra',   brand: 'Mahindra',    models: ['XUV700'] },
    { slug: 'tata-motors',brand: 'Tata Motors', models: ['Safari'] },
    { slug: 'renault',    brand: 'Renault',     models: ['Kiger'] },
    { slug: 'volkswagen', brand: 'Volkswagen',  models: ['Tiguan'] },
    { slug: 'skoda',      brand: 'Skoda',       models: ['Superb'] },
    { slug: 'bmw',        brand: 'BMW',         models: ['i4', 'iX'] },
    { slug: 'jaguar',     brand: 'Jaguar',      models: ['XE', 'I-Pace'] },
    { slug: 'land-rover', brand: 'Land Rover',  models: ['Discovery', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover'] },
];

// ── Missing 2W models ─────────────────────────────────────────────────────────
const GAPS_2W = [
    { slug: 'matter-ev', brand: 'Matter', models: ['Aera 5000+'] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
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

async function scrapeModel(page, brand, model, destDir, typeHint = 'car') {
    const query = `${brand} ${model} India 2024 official ${typeHint} side view`;
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;

    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await delay(2000);

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

        // Remove old file with different extension if exists
        const altExt = ext === '.jpg' ? '.png' : '.jpg';
        const altDest = path.join(destDir, `${slug}${altExt}`);
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

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    const total4W = GAPS_4W.reduce((s, b) => s + b.models.length, 0);
    const total2W = GAPS_2W.reduce((s, b) => s + b.models.length, 0);
    console.log(`🚀 Gap Scraper — ${total4W} 4W models + ${total2W} 2W models\n`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

    let saved = 0, failed = 0;

    // 4W gaps
    for (const { slug, brand, models } of GAPS_4W) {
        const destDir = path.join(BASE_4W, slug);
        fs.mkdirSync(destDir, { recursive: true });
        console.log(`\n📦 ${brand} — ${models.length} missing`);
        for (const model of models) {
            const ok = await scrapeModel(page, brand, model, destDir, 'car');
            ok ? saved++ : failed++;
            await delay(1500);
        }
    }

    // 2W gaps
    for (const { slug, brand, models } of GAPS_2W) {
        const destDir = path.join(BASE_2W, slug);
        fs.mkdirSync(destDir, { recursive: true });
        console.log(`\n🏍️  ${brand} — ${models.length} missing`);
        for (const model of models) {
            const ok = await scrapeModel(page, brand, model, destDir, 'motorcycle');
            ok ? saved++ : failed++;
            await delay(1500);
        }
    }

    await browser.close();
    console.log(`\n\n✅ Done! Saved: ${saved} | Failed: ${failed}`);
}

main().catch(console.error);
