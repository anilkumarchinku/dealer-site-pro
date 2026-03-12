/**
 * rescrape_duplicates.js
 * Targeted re-scrape for 3W duplicate pairs + cleanup of stale files.
 * Uses very specific search terms to differentiate similar models.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const IMAGES_BASE = path.join(process.cwd(), 'public/data/brand-model-images');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadImage(url, destination) {
    if (!url || !url.startsWith('http')) return Promise.resolve(false);
    const lib = url.startsWith('https') ? https : http;
    return new Promise((resolve) => {
        const file = fs.createWriteStream(destination);
        lib.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122' },
            timeout: 15000,
        }, response => {
            if ([301, 302].includes(response.statusCode) && response.headers.location) {
                file.close(); fs.unlinkSync(destination);
                return downloadImage(response.headers.location, destination).then(resolve);
            }
            if (response.statusCode !== 200) { file.close(); fs.unlink(destination, () => {}); resolve(false); return; }
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => { file.close(); fs.unlink(destination, () => {}); resolve(false); });
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

// Each entry: exact search query, destination filename, previous duplicate's md5 to avoid
const TARGETS = [
    // Bajaj Maxima Z CNG vs Maxima XL Electric — very different vehicles
    {
        query: 'Bajaj Maxima Z CNG three wheeler cargo side view 2024',
        dir: '3w/bajaj-auto-3w',
        filename: 'maxima-z-cng',
    },
    {
        query: 'Bajaj Maxima XL electric cargo three wheeler side view 2024',
        dir: '3w/bajaj-auto-3w',
        filename: 'maxima-xl-electric',
    },
    // Mahindra Treo vs Treo Plus
    {
        query: 'Mahindra Treo electric auto rickshaw passenger 2024',
        dir: '3w/mahindra-3w',
        filename: 'treo',
    },
    {
        query: 'Mahindra Treo Plus electric auto rickshaw 2024 new model',
        dir: '3w/mahindra-3w',
        filename: 'treo-plus',
    },
    // Mahindra E-Alfa Plus vs Alfa Passenger
    {
        query: 'Mahindra Alfa Passenger diesel three wheeler auto 2024',
        dir: '3w/mahindra-3w',
        filename: 'alfa-passenger',
    },
    {
        query: 'Mahindra E-Alfa Plus electric three wheeler 2024',
        dir: '3w/mahindra-3w',
        filename: 'e-alfa-plus',
    },
    // TVS King Kargo vs King Kargo HD EV
    {
        query: 'TVS King Kargo diesel cargo three wheeler 2024',
        dir: '3w/tvs-king',
        filename: 'king-kargo',
    },
    {
        query: 'TVS King Kargo HD EV electric cargo three wheeler 2024',
        dir: '3w/tvs-king',
        filename: 'king-kargo-hd-ev',
    },
    // Piaggio NXT+ (old nxt.jpg needs deletion)
    {
        query: 'Piaggio Ape NXT Plus three wheeler auto 2024 side view',
        dir: '3w/piaggio-ape',
        filename: 'nxt-plus',
    },
];

async function scrapeTarget(page, target) {
    const destDir = path.join(IMAGES_BASE, target.dir);
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(target.query)}&qft=+filterui:imagesize-large&form=IRFLTR`;

    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await delay(2000);

        const candidates = await page.evaluate(() => {
            const results = [];
            const imgs = document.querySelectorAll('.iusc');
            for (const img of imgs) {
                if (results.length >= 10) break;
                try {
                    const meta = JSON.parse(img.getAttribute('m') || '{}');
                    if (meta.murl && meta.murl.startsWith('http')) {
                        results.push(meta.murl);
                    }
                } catch { continue; }
            }
            return results;
        });

        // Try candidates, skip first one if this is a "second of pair" to avoid getting same image
        const startIdx = target.skipFirst ? 1 : 0;
        for (let i = startIdx; i < candidates.length; i++) {
            const url = candidates[i];
            const ext = url.toLowerCase().includes('.png') ? '.png' : '.jpg';
            const tempPath = path.join(destDir, `${target.filename}_temp${ext}`);
            const finalPath = path.join(destDir, `${target.filename}${ext}`);

            const ok = await downloadImage(url, tempPath);
            if (!ok) continue;

            const stats = fs.statSync(tempPath);
            const dims = getImageDimensions(tempPath);
            if (stats.size > 8000 && (dims.width >= 400 || dims.height >= 400)) {
                // Remove old files with any extension
                for (const oldExt of ['.jpg', '.png']) {
                    const old = path.join(destDir, `${target.filename}${oldExt}`);
                    if (fs.existsSync(old)) fs.unlinkSync(old);
                }
                fs.renameSync(tempPath, finalPath);
                console.log(`  ✅ ${target.filename} → ${dims.width}x${dims.height} (${(stats.size/1024).toFixed(1)}KB)`);
                return true;
            }
            fs.unlinkSync(tempPath);
        }
    } catch (err) {
        console.log(`  ⚠️  Error: ${err.message}`);
    }
    console.log(`  ❌ ${target.filename} — no unique quality image found`);
    return false;
}

async function main() {
    console.log(`\n🔧 Targeted re-scrape for ${TARGETS.length} duplicate/stale images\n`);

    // Step 1: Clean up stale files
    const staleFiles = [
        'public/data/brand-model-images/3w/piaggio-ape/nxt.jpg', // old slug, replaced by nxt-plus.jpg
    ];
    // Also clean up old 2W .jpg files that now have .png versions
    const oldJpgs = [
        'public/data/brand-model-images/2w/bajaj-auto/ct-110x.jpg',
        'public/data/brand-model-images/2w/vespa-india/vespa-tech-125.jpg',
        'public/data/brand-model-images/2w/vespa-india/vespa-s-tech-125.jpg',
    ];
    for (const f of [...staleFiles, ...oldJpgs]) {
        const p = path.join(process.cwd(), f);
        if (fs.existsSync(p)) {
            fs.unlinkSync(p);
            console.log(`🗑  Deleted stale: ${path.basename(f)}`);
        }
    }
    console.log('');

    // Step 2: Scrape unique images for duplicate pairs
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122');

    let ok = 0, fail = 0;
    // Process pairs: first item normal, second item skips first result
    for (let i = 0; i < TARGETS.length; i += 2) {
        const a = TARGETS[i];
        const b = TARGETS[i + 1];
        console.log(`📦 ${a.filename} vs ${b ? b.filename : '(single)'}`);

        if (await scrapeTarget(page, a)) ok++; else fail++;
        await delay(1500);
        if (b) {
            b.skipFirst = true; // Skip first result to avoid duplicate
            if (await scrapeTarget(page, b)) ok++; else fail++;
            await delay(1500);
        }
        console.log('');
    }

    await browser.close();
    console.log(`━━━ Done: ✅ ${ok} success, ❌ ${fail} failed ━━━`);
}

main().catch(err => { console.error(err); process.exit(1); });
