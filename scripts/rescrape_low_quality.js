/**
 * rescrape_low_quality.js
 * Re-scrapes low quality, tiny, and duplicate 3W + 2W vehicle images.
 * Unlike previous scrapers, this one:
 *   1. Filters by minimum image dimensions (400px wide)
 *   2. Validates downloaded file size (>10KB)
 *   3. Tries multiple search queries for better results
 *   4. Checks multiple Bing results instead of just the first one
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const IMAGES_BASE = path.join(process.cwd(), 'public/data/brand-model-images');
const MIN_FILE_SIZE = 10 * 1024; // 10KB minimum
const MIN_DIMENSION = 400;       // 400px minimum width or height
const MAX_CANDIDATES = 8;        // Check up to 8 Bing results

// ── Images that need re-scraping ──────────────────────────────────────────────

const THREE_WHEELER_RESCRAPE = [
    // Bajaj Auto 3W — almost all are tiny thumbnails
    { brand: 'Bajaj Auto', brandDir: 'bajaj-auto-3w', models: [
        'RE CNG', 'RE LPG', 'RE Diesel', 'RE Electric',
        'Maxima Z CNG', 'Compact RE CNG', 'Maxima XL Electric',
        'Maxima X Wide Diesel', 'Maxima C CNG', 'Riki P40',
    ]},
    // Mahindra 3W — most are low-res
    { brand: 'Mahindra', brandDir: 'mahindra-3w', models: [
        'Alfa Passenger', 'Alfa Load', 'E-Alfa Mini', 'E-Alfa Plus',
        'Treo', 'Treo Plus', 'Treo Zor', 'Treo Yaari HRT', 'Treo Yaari SFT',
        'UDO', 'Zor Grand',
    ]},
    // TVS King — 4/6 low-res, 1 duplicate pair
    { brand: 'TVS King', brandDir: 'tvs-king', models: [
        'King Deluxe', 'King Duramax', 'King Duramax Plus',
        'King EV Max', 'King Kargo HD EV', 'King Kargo',
    ]},
    // Piaggio Ape — 5/9 low-res, 1 duplicate pair
    { brand: 'Piaggio Ape', brandDir: 'piaggio-ape', models: [
        'Auto DX', 'NXT+', 'E-Xtra FX', 'E-Xtra FX Max',
        'Xtra LDX CNG', 'Xtra LDX Diesel',
    ]},
    // Euler Motors — 1 duplicate pair, 1 low-res
    { brand: 'Euler Motors', brandDir: 'euler-motors', models: [
        'HiLoad EV 120', 'HiLoad EV 170', 'NEO HiCITY',
    ]},
    // Lohia Auto — missing Youdha E5 Passenger
    { brand: 'Lohia Auto', brandDir: 'lohia-auto', models: [
        'Youdha E5 Passenger',
    ]},
];

const TWO_WHEELER_RESCRAPE = [
    // Files under 5KB
    { brand: 'Bajaj', brandDir: 'bajaj-auto', models: ['CT 110X'] },
    { brand: 'Vespa', brandDir: 'vespa-india', models: ['Vespa Qala', 'Vespa Tech 125', 'Vespa S Tech 125'] },
    { brand: 'Yamaha', brandDir: 'yamaha-india', models: [
        'Fascino 125 Fi', 'Ray ZR 125 Fi Street Rally', 'FZ-S Fi',
    ]},
    // Other low-res files
    { brand: 'Ducati', brandDir: 'ducati-india', models: ['Scrambler 800', 'DesertX Discovery'] },
    { brand: 'Jawa', brandDir: 'jawa-motorcycles', models: ['Jawa 42 FJ'] },
    { brand: 'Ola Electric', brandDir: 'ola-electric', models: ['S1 X'] },
    { brand: 'Triumph', brandDir: 'triumph-india', models: ['Street Triple 765 R', 'Tiger 660'] },
    { brand: 'Royal Enfield', brandDir: 'royal-enfield', models: ['Hunter 350', 'Shotgun 650'] },
    { brand: 'Harley-Davidson', brandDir: 'harley-davidson-india', models: ['Nightster Special'] },
    { brand: 'TVS', brandDir: 'tvs-motor', models: ['XL100 Comfort'] },
    // Duplicate pair fix
    { brand: 'Suzuki', brandDir: 'suzuki-motorcycle', models: ['Gixxer SF', 'Gixxer SF 250'] },
];

// ── Utilities ─────────────────────────────────────────────────────────────────

function modelToSlug(m) {
    return m.toLowerCase().replace(/\+/g, '-plus').replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadImage(url, destination) {
    if (!url || !url.startsWith('http')) return Promise.resolve(false);
    const lib = url.startsWith('https') ? https : http;
    return new Promise((resolve) => {
        const file = fs.createWriteStream(destination);
        lib.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
            timeout: 15000,
        }, response => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                const redirect = response.headers.location;
                if (redirect) {
                    file.close();
                    fs.unlinkSync(destination);
                    return downloadImage(redirect, destination).then(resolve);
                }
            }
            if (response.statusCode !== 200) { file.close(); fs.unlink(destination, () => {}); resolve(false); return; }
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => { file.close(); fs.unlink(destination, () => {}); resolve(false); });
    });
}

/** Use macOS `sips` to check image dimensions */
function getImageDimensions(filePath) {
    try {
        const out = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}" 2>/dev/null`, { encoding: 'utf8' });
        const w = parseInt(out.match(/pixelWidth:\s*(\d+)/)?.[1] || '0');
        const h = parseInt(out.match(/pixelHeight:\s*(\d+)/)?.[1] || '0');
        return { width: w, height: h };
    } catch {
        return { width: 0, height: 0 };
    }
}

/** Validate downloaded image meets quality thresholds */
function validateImage(filePath) {
    if (!fs.existsSync(filePath)) return false;
    const stats = fs.statSync(filePath);
    if (stats.size < MIN_FILE_SIZE) return false;
    const dims = getImageDimensions(filePath);
    if (dims.width < MIN_DIMENSION && dims.height < MIN_DIMENSION) return false;
    return true;
}

// ── Scraping ──────────────────────────────────────────────────────────────────

/** Build multiple search queries for better coverage */
function buildSearchQueries(brand, model, category) {
    const typeHint3W = 'three wheeler auto rickshaw';
    const typeHint2W = 'motorcycle scooter bike';
    const typeHint = category === '3w' ? typeHint3W : typeHint2W;

    return [
        // Most specific first
        `"${brand}" "${model}" ${category === '3w' ? 'three wheeler' : ''} side view HD`,
        `${brand} ${model} 2024 ${typeHint} high resolution`,
        `${brand} ${model} official image`,
        `${brand} ${model} ${category === '3w' ? 'auto' : 'bike'} India price image`,
    ];
}

async function scrapeImageWithQuality(page, brand, model, category, destDir) {
    const slug = modelToSlug(model);
    const queries = buildSearchQueries(brand, model, category);

    for (const query of queries) {
        const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-large&form=IRFLTR`;

        try {
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
            await delay(1500 + Math.random() * 1000);

            // Extract multiple candidate image URLs with dimension metadata
            const candidates = await page.evaluate((maxCandidates) => {
                const results = [];
                const imgs = document.querySelectorAll('.iusc');
                for (const img of imgs) {
                    if (results.length >= maxCandidates) break;
                    try {
                        const meta = JSON.parse(img.getAttribute('m') || '{}');
                        if (meta.murl && meta.murl.startsWith('http')) {
                            results.push({
                                url: meta.murl,
                                width: meta.pingu?.width || meta.thn_w || 0,
                                height: meta.pingu?.height || meta.thn_h || 0,
                            });
                        }
                    } catch { continue; }
                }
                return results;
            }, MAX_CANDIDATES);

            if (candidates.length === 0) continue;

            // Try each candidate, validate quality
            for (const candidate of candidates) {
                const ext = candidate.url.toLowerCase().includes('.png') ? '.png' : '.jpg';
                const tempPath = path.join(destDir, `${slug}_temp${ext}`);
                const finalPath = path.join(destDir, `${slug}${ext}`);

                const downloaded = await downloadImage(candidate.url, tempPath);
                if (!downloaded) continue;

                if (validateImage(tempPath)) {
                    // Remove old file (any extension)
                    for (const oldExt of ['.jpg', '.png', '.webp']) {
                        const oldPath = path.join(destDir, `${slug}${oldExt}`);
                        if (fs.existsSync(oldPath) && oldPath !== finalPath) {
                            fs.unlinkSync(oldPath);
                        }
                    }
                    // Rename temp to final
                    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
                    fs.renameSync(tempPath, finalPath);

                    const dims = getImageDimensions(finalPath);
                    const size = (fs.statSync(finalPath).size / 1024).toFixed(1);
                    console.log(`  ✅ ${brand} ${model} → ${dims.width}x${dims.height} (${size}KB)`);
                    return true;
                } else {
                    // Delete failed temp file
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                }
            }
        } catch (err) {
            // Try next query
        }

        await delay(500);
    }

    console.log(`  ❌ ${brand} ${model} — no quality image found`);
    return false;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    const total3W = THREE_WHEELER_RESCRAPE.reduce((sum, b) => sum + b.models.length, 0);
    const total2W = TWO_WHEELER_RESCRAPE.reduce((sum, b) => sum + b.models.length, 0);
    console.log(`\n🔄 Re-scraping ${total3W} 3W + ${total2W} 2W low-quality images\n`);
    console.log(`   Quality thresholds: ≥${MIN_DIMENSION}px, ≥${MIN_FILE_SIZE / 1024}KB`);
    console.log(`   Checking up to ${MAX_CANDIDATES} candidates per search\n`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    let page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    let success = 0;
    let failed = 0;
    let count = 0;

    // ── 3W Images ──
    console.log('━━━ THREE-WHEELERS ━━━\n');
    for (const entry of THREE_WHEELER_RESCRAPE) {
        const destDir = path.join(IMAGES_BASE, '3w', entry.brandDir);
        fs.mkdirSync(destDir, { recursive: true });
        console.log(`📦 ${entry.brand} (${entry.models.length} models)`);

        for (const model of entry.models) {
            count++;
            // Restart browser every 15 requests to avoid memory issues
            if (count % 15 === 0) {
                await page.close();
                page = await browser.newPage();
                await page.setViewport({ width: 1280, height: 800 });
                await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
            }

            const ok = await scrapeImageWithQuality(page, entry.brand, model, '3w', destDir);
            if (ok) success++; else failed++;
            await delay(800 + Math.random() * 700);
        }
        console.log('');
    }

    // ── 2W Images ──
    console.log('━━━ TWO-WHEELERS ━━━\n');
    for (const entry of TWO_WHEELER_RESCRAPE) {
        const destDir = path.join(IMAGES_BASE, '2w', entry.brandDir);
        fs.mkdirSync(destDir, { recursive: true });
        console.log(`🏍️ ${entry.brand} (${entry.models.length} models)`);

        for (const model of entry.models) {
            count++;
            if (count % 15 === 0) {
                await page.close();
                page = await browser.newPage();
                await page.setViewport({ width: 1280, height: 800 });
                await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
            }

            const ok = await scrapeImageWithQuality(page, entry.brand, model, '2w', destDir);
            if (ok) success++; else failed++;
            await delay(800 + Math.random() * 700);
        }
        console.log('');
    }

    await browser.close();

    console.log('━━━ SUMMARY ━━━');
    console.log(`✅ Successfully scraped: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total attempted: ${success + failed}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
