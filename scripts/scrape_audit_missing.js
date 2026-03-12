/**
 * scrape_audit_missing.js
 * Scrapes all missing images identified by the audit (scripts/missing_audit.json).
 * Uses quality-aware Bing scraping with min 400px / 10KB thresholds.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const IMAGES_BASE = path.join(process.cwd(), 'public/data/brand-model-images');
const MISSING_FILE = path.join(process.cwd(), 'scripts/missing_audit.json');
const MIN_FILE_SIZE = 8 * 1024;
const MIN_DIMENSION = 350;

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadImage(url, dest) {
    if (!url || !url.startsWith('http')) return Promise.resolve(false);
    const lib = url.startsWith('https') ? https : http;
    return new Promise((resolve) => {
        const file = fs.createWriteStream(dest);
        lib.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122' },
            timeout: 15000,
        }, response => {
            if ([301, 302].includes(response.statusCode) && response.headers.location) {
                file.close(); try { fs.unlinkSync(dest); } catch {}
                return downloadImage(response.headers.location, dest).then(resolve);
            }
            if (response.statusCode !== 200) { file.close(); fs.unlink(dest, () => {}); resolve(false); return; }
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => { file.close(); fs.unlink(dest, () => {}); resolve(false); });
    });
}

function getImageDimensions(filePath) {
    try {
        const out = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}" 2>/dev/null`, { encoding: 'utf8' });
        const w = parseInt(out.match(/pixelWidth:\s*(\d+)/)?.[1] || '0');
        const h = parseInt(out.match(/pixelHeight:\s*(\d+)/)?.[1] || '0');
        return { width: w, height: h };
    } catch { return { width: 0, height: 0 }; }
}

function validateImage(filePath) {
    if (!fs.existsSync(filePath)) return false;
    const stats = fs.statSync(filePath);
    if (stats.size < MIN_FILE_SIZE) return false;
    const dims = getImageDimensions(filePath);
    if (dims.width < MIN_DIMENSION && dims.height < MIN_DIMENSION) return false;
    return true;
}

async function scrapeForModel(page, entry) {
    const { type, brandId, brand, model, slug } = entry;
    const destDir = path.join(IMAGES_BASE, type, brandId);
    fs.mkdirSync(destDir, { recursive: true });

    const typeHint = type === '3w' ? 'three wheeler auto' : 'motorcycle scooter electric bike';
    const queries = [
        `"${brand}" "${model}" ${typeHint} side view HD`,
        `${brand} ${model} 2024 India ${typeHint}`,
        `${brand} ${model} official image price`,
    ];

    for (const query of queries) {
        const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-large&form=IRFLTR`;
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
            await delay(1500 + Math.random() * 1000);

            const candidates = await page.evaluate(() => {
                const results = [];
                for (const el of document.querySelectorAll('.iusc')) {
                    if (results.length >= 8) break;
                    try {
                        const meta = JSON.parse(el.getAttribute('m') || '{}');
                        if (meta.murl && meta.murl.startsWith('http')) results.push(meta.murl);
                    } catch {}
                }
                return results;
            });

            for (const imgUrl of candidates) {
                const ext = imgUrl.toLowerCase().includes('.png') ? '.png' : '.jpg';
                const tempPath = path.join(destDir, `${slug}_temp${ext}`);
                const finalPath = path.join(destDir, `${slug}${ext}`);

                const ok = await downloadImage(imgUrl, tempPath);
                if (!ok) continue;

                if (validateImage(tempPath)) {
                    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
                    fs.renameSync(tempPath, finalPath);
                    const dims = getImageDimensions(finalPath);
                    const size = (fs.statSync(finalPath).size / 1024).toFixed(1);
                    console.log(`  ✅ ${brand} ${model} → ${dims.width}x${dims.height} (${size}KB)`);
                    return true;
                }
                try { fs.unlinkSync(tempPath); } catch {}
            }
        } catch {}
        await delay(500);
    }

    console.log(`  ❌ ${brand} ${model} — no quality image found`);
    return false;
}

async function main() {
    if (!fs.existsSync(MISSING_FILE)) {
        console.error('Run find_missing_images.js first');
        process.exit(1);
    }

    const missing = JSON.parse(fs.readFileSync(MISSING_FILE, 'utf8'));
    // Skip the Piaggio NXT+ since we already fixed it with a file copy
    const toScrape = missing.filter(m => !(m.type === '3w' && m.slug === 'nxt'));

    console.log(`\n🔍 Scraping ${toScrape.length} missing images from audit\n`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    let page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122');

    let success = 0, failed = 0;

    for (let i = 0; i < toScrape.length; i++) {
        const entry = toScrape[i];
        // Restart browser every 10 requests
        if (i > 0 && i % 10 === 0) {
            await page.close();
            page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122');
        }

        const ok = await scrapeForModel(page, entry);
        if (ok) success++; else failed++;
        await delay(800 + Math.random() * 700);
    }

    await browser.close();

    console.log(`\n━━━ SUMMARY ━━━`);
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${success + failed}`);
}

main().catch(err => { console.error(err); process.exit(1); });
