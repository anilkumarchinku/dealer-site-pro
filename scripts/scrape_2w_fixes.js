/**
 * scrape_2w_fixes.js
 * Scrapes missing two-wheeler (2W) images + one 4W Porsche Cayenne Electric.
 * Saves 2W images to: public/data/brand-model-images/2w/{brandId}/{slug}.jpg
 * Saves 4W Porsche to BOTH legacy + new paths.
 *
 * Run:       node scripts/scrape_2w_fixes.js
 * Dry run:   node scripts/scrape_2w_fixes.js --dry-run
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.join(SCRIPT_DIR, '..');
const TW_DIR = path.join(PROJECT_ROOT, 'public/data/brand-model-images/2w');
const FW_DIR = path.join(PROJECT_ROOT, 'public/data/brand-model-images/4w');
const FW_LEGACY_DIR = path.join(PROJECT_ROOT, 'public/assets/cars');

// ── Missing 2W models ───────────────────────────────────────────────────────

const ITEMS = [
    // Honda (honda-hmsi)
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'Activa 6G', slug: 'activa-6g', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'Activa 125', slug: 'activa-125', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'Shine', slug: 'shine', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'SP 125', slug: 'sp-125', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'SP160', slug: 'sp160', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'Dio', slug: 'dio', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'Dio 125', slug: 'dio-125', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'Livo', slug: 'livo', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'CB350', slug: 'cb350', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'H\'ness CB350', slug: 'hness-cb350', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'CB350RS', slug: 'cb350rs', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'CB350C', slug: 'cb350c', type: '2w' },
    { brand: 'Honda', brandSlug: 'honda-hmsi', model: 'Activa e:', slug: 'activa-e', type: '2w' },

    // Yamaha (yamaha-india)
    { brand: 'Yamaha', brandSlug: 'yamaha-india', model: 'FZS-FI V4', slug: 'fzs-fi-v4', type: '2w' },
    { brand: 'Yamaha', brandSlug: 'yamaha-india', model: 'MT-15', slug: 'mt-15', type: '2w' },
    { brand: 'Yamaha', brandSlug: 'yamaha-india', model: 'Fascino 125', slug: 'fascino-125', type: '2w' },
    { brand: 'Yamaha', brandSlug: 'yamaha-india', model: 'Ray ZR 125', slug: 'ray-zr-125', type: '2w' },
    { brand: 'Yamaha', brandSlug: 'yamaha-india', model: 'XSR 155', slug: 'xsr-155', type: '2w' },

    // Vespa (vespa-india)
    { brand: 'Vespa', brandSlug: 'vespa-india', model: 'VXL 125', slug: 'vxl-125', type: '2w' },
    { brand: 'Vespa', brandSlug: 'vespa-india', model: 'SXL 125', slug: 'sxl-125', type: '2w' },
    { brand: 'Vespa', brandSlug: 'vespa-india', model: 'ZX 125', slug: 'zx-125', type: '2w' },
    { brand: 'Vespa', brandSlug: 'vespa-india', model: 'VXL 150', slug: 'vxl-150', type: '2w' },
    { brand: 'Vespa', brandSlug: 'vespa-india', model: 'SXL 150', slug: 'sxl-150', type: '2w' },

    // Jawa (jawa-motorcycles) — slugs WITHOUT "jawa-" prefix
    { brand: 'Jawa', brandSlug: 'jawa-motorcycles', model: 'Jawa 42', slug: '42', type: '2w' },
    { brand: 'Jawa', brandSlug: 'jawa-motorcycles', model: 'Jawa 42 Bobber', slug: '42-bobber', type: '2w' },
    { brand: 'Jawa', brandSlug: 'jawa-motorcycles', model: 'Jawa Perak', slug: 'perak', type: '2w' },
    { brand: 'Jawa', brandSlug: 'jawa-motorcycles', model: 'Jawa 42 FJ', slug: '42-fj', type: '2w' },

    // Triumph (triumph-india)
    { brand: 'Triumph', brandSlug: 'triumph-india', model: 'Speed T4', slug: 'speed-t4', type: '2w' },
    { brand: 'Triumph', brandSlug: 'triumph-india', model: 'Scrambler 400 XC', slug: 'scrambler-400-xc', type: '2w' },
    { brand: 'Triumph', brandSlug: 'triumph-india', model: 'Thruxton 400', slug: 'thruxton-400', type: '2w' },
    { brand: 'Triumph', brandSlug: 'triumph-india', model: 'Daytona 660', slug: 'daytona-660', type: '2w' },

    // Suzuki (suzuki-motorcycle)
    { brand: 'Suzuki', brandSlug: 'suzuki-motorcycle', model: 'Avenis', slug: 'avenis', type: '2w' },
    { brand: 'Suzuki', brandSlug: 'suzuki-motorcycle', model: 'Burgman Street', slug: 'burgman-street', type: '2w' },

    // Indian Motorcycle (indian-motorcycle)
    { brand: 'Indian Motorcycle', brandSlug: 'indian-motorcycle', model: 'Scout Bobber', slug: 'scout-bobber', type: '2w' },
    { brand: 'Indian Motorcycle', brandSlug: 'indian-motorcycle', model: 'Chieftain', slug: 'chieftain', type: '2w' },

    // ── 4W: Porsche Cayenne Electric (failed earlier) ───────────────────────
    { brand: 'Porsche', brandSlug: 'porsche', model: 'Cayenne Electric', slug: 'cayenne-electric', type: '4w' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function downloadImage(url, dest) {
    if (!url || !url.startsWith('http')) return false;
    const proto = url.startsWith('https') ? https : http;

    return new Promise(resolve => {
        const file = fs.createWriteStream(dest);
        proto.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
            timeout: 15000,
        }, res => {
            // Follow redirects
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                file.close();
                fs.unlink(dest, () => {});
                downloadImage(res.headers.location, dest).then(resolve);
                return;
            }
            if (res.statusCode !== 200) {
                file.close();
                fs.unlink(dest, () => {});
                resolve(false);
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                // Reject images under 5KB (thumbnails / broken)
                const stats = fs.statSync(dest);
                if (stats.size < 5000) {
                    console.log(`      ⚠ Too small (${stats.size} bytes), skipping`);
                    fs.unlinkSync(dest);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        }).on('error', () => {
            file.close();
            fs.unlink(dest, () => {});
            resolve(false);
        });
    });
}

async function scrapeImage(page, brand, model, type) {
    const vehicle = type === '2w' ? 'motorcycle' : 'car';
    const queries = [
        `${brand} ${model} ${vehicle} India 2024 official`,
        `${brand} ${model} 2024 side view`,
        `${brand} ${model} ${vehicle} official image`,
    ];

    for (const query of queries) {
        try {
            const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-large&form=IRFLTR`;
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await delay(2000);

            // Strategy 1: .iusc metadata (high-res originals)
            let imgUrl = await page.evaluate(() => {
                const items = document.querySelectorAll('.iusc');
                for (const item of items) {
                    try {
                        const meta = JSON.parse(item.getAttribute('m') || '{}');
                        if (meta.murl && meta.murl.startsWith('http') &&
                            !meta.murl.includes('favicon') &&
                            !meta.murl.includes('logo')) {
                            return meta.murl;
                        }
                    } catch { continue; }
                }
                return null;
            });

            if (imgUrl) return imgUrl;

            // Strategy 2: img.mimg tags
            imgUrl = await page.evaluate(() => {
                const imgs = document.querySelectorAll('img.mimg');
                for (const img of imgs) {
                    const src = img.getAttribute('src') || '';
                    if (src.startsWith('http') && !src.includes('favicon') && !src.includes('logo')) {
                        return src;
                    }
                }
                return null;
            });

            if (imgUrl) return imgUrl;

        } catch (err) {
            console.log(`      ⚠ Query failed: ${err.message}`);
        }
    }

    return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');

    console.log(`\n🏍️  2W Image Scraper — Fix Missing Images (+1 Porsche 4W)`);
    console.log(`   Total: ${ITEMS.length} images to scrape`);
    console.log(`   Mode: ${dryRun ? 'DRY RUN (no downloads)' : 'LIVE'}`);
    console.log(`   2W dir: public/data/brand-model-images/2w/`);
    console.log(`   4W dir: public/data/brand-model-images/4w/ + public/assets/cars/\n`);

    if (dryRun) {
        console.log('── Images to scrape ──────────────────────────────────────\n');
        const grouped = {};
        for (const item of ITEMS) {
            const key = `${item.brand} (${item.brandSlug})`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(item);
        }
        for (const [brand, models] of Object.entries(grouped)) {
            console.log(`📦 ${brand} (${models.length})`);
            for (const m of models) {
                console.log(`   ❌ ${m.model} → ${m.brandSlug}/${m.slug}.jpg [${m.type}]`);
            }
        }
        console.log(`\nRun without --dry-run to start scraping.`);
        return;
    }

    let browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    let page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    let saved = 0, failed = 0;
    let currentBrand = '';
    const results = [];

    for (let i = 0; i < ITEMS.length; i++) {
        const item = ITEMS[i];

        // Print brand header
        if (item.brand !== currentBrand) {
            currentBrand = item.brand;
            const brandItems = ITEMS.filter(x => x.brand === currentBrand);
            console.log(`\n📦 ${currentBrand} (${brandItems.length} images)`);
        }

        console.log(`   [${i + 1}/${ITEMS.length}] ❌ MISSING: ${item.model}`);

        // Restart browser every 15 images to prevent memory leaks
        if (i > 0 && i % 15 === 0) {
            console.log('\n   🔄 Restarting browser...\n');
            await page.close();
            await browser.close();
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            });
            page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        }

        try {
            const imgUrl = await scrapeImage(page, item.brand, item.model, item.type);

            if (!imgUrl) {
                console.log(`      ❌ No image found`);
                failed++;
                results.push({ ...item, status: 'failed', reason: 'no_image_found' });
                continue;
            }

            if (item.type === '2w') {
                // 2W: save only to new 2w directory
                const destDir = path.join(TW_DIR, item.brandSlug);
                ensureDir(destDir);
                const dest = path.join(destDir, `${item.slug}.jpg`);

                const ok = await downloadImage(imgUrl, dest);
                if (ok) {
                    const size = fs.statSync(dest).size;
                    console.log(`      ✅ Saved (${(size / 1024).toFixed(1)} KB) → 2w/${item.brandSlug}/${item.slug}.jpg`);
                    saved++;
                    results.push({ ...item, status: 'saved', size });
                } else {
                    console.log(`      ❌ Download failed`);
                    failed++;
                    results.push({ ...item, status: 'failed', reason: 'download_failed' });
                }
            } else {
                // 4W: save to BOTH legacy + new paths
                const legacyDir = path.join(FW_LEGACY_DIR, item.brandSlug);
                ensureDir(legacyDir);
                const legacyDest = path.join(legacyDir, `${item.slug}.jpg`);

                const newDir = path.join(FW_DIR, item.brandSlug);
                ensureDir(newDir);
                const newDest = path.join(newDir, `${item.slug}.jpg`);

                const ok = await downloadImage(imgUrl, legacyDest);
                if (ok) {
                    fs.copyFileSync(legacyDest, newDest);
                    const size = fs.statSync(legacyDest).size;
                    console.log(`      ✅ Saved (${(size / 1024).toFixed(1)} KB) → 4w/${item.brandSlug}/${item.slug}.jpg (both paths)`);
                    saved++;
                    results.push({ ...item, status: 'saved', size });
                } else {
                    console.log(`      ❌ Download failed`);
                    failed++;
                    results.push({ ...item, status: 'failed', reason: 'download_failed' });
                }
            }

        } catch (err) {
            console.log(`      ❌ Error: ${err.message}`);
            failed++;
            results.push({ ...item, status: 'failed', reason: err.message });
        }

        // Random delay between 1-2 seconds
        await delay(1000 + Math.random() * 1000);
    }

    await page.close();
    await browser.close();

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`✅ Scraping Complete!`);
    console.log(`   Saved:  ${saved}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total:  ${ITEMS.length}`);
    console.log(`${'═'.repeat(50)}\n`);

    // Write results
    const resultsFile = path.join(SCRIPT_DIR, 'scrape_2w_results.json');
    const failedItems = results.filter(r => r.status === 'failed');
    fs.writeFileSync(resultsFile, JSON.stringify({
        saved,
        failed,
        total: ITEMS.length,
        timestamp: new Date().toISOString(),
        failedItems,
    }, null, 2));
    console.log(`Results saved to: scripts/scrape_2w_results.json`);

    if (failedItems.length > 0) {
        console.log(`\n⚠ Failed images:`);
        for (const f of failedItems) {
            console.log(`   - ${f.brand} ${f.model} (${f.brandSlug}/${f.slug}.jpg) — ${f.reason}`);
        }
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
