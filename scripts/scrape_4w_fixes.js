/**
 * scrape_4w_fixes.js
 * Scrapes missing, broken, and wrong car images for 4W brands.
 * Saves to BOTH locations:
 *   - public/assets/cars/{brand}/{slug}.jpg  (legacy path)
 *   - public/data/brand-model-images/4w/{brand}/{slug}.jpg  (new path)
 *
 * Run all:    node scripts/scrape_4w_fixes.js
 * Run brand:  node scripts/scrape_4w_fixes.js bmw
 * Dry run:    node scripts/scrape_4w_fixes.js --dry-run
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.join(SCRIPT_DIR, '..');
const LEGACY_DIR = path.join(PROJECT_ROOT, 'public/assets/cars');
const NEW_DIR = path.join(PROJECT_ROOT, 'public/data/brand-model-images/4w');
const DATA_FILE = path.join(SCRIPT_DIR, 'missing_images_4w.json');

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
                fs.unlink(dest, () => {});
                downloadImage(res.headers.location, dest).then(resolve);
                return;
            }
            if (res.statusCode !== 200) {
                fs.unlink(dest, () => {});
                resolve(false);
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                // Verify file is at least 5KB (reject thumbnails)
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
            fs.unlink(dest, () => {});
            resolve(false);
        });
    });
}

async function scrapeImage(page, brand, model) {
    // Try multiple search strategies
    const queries = [
        `${brand} ${model} car India 2024 official press image`,
        `${brand} ${model} 2024 side view white background`,
        `${brand} ${model} car official image`,
    ];

    for (const query of queries) {
        try {
            const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-large&form=IRFLTR`;
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await delay(2000);

            // Strategy 1: Try .iusc metadata (high-res original URLs)
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

            // Strategy 2: Try img.mimg tags
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
    const filterBrand = args.find(a => !a.startsWith('--'));

    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ missing_images_4w.json not found. Run the audit first.');
        process.exit(1);
    }

    let items = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    if (filterBrand) {
        items = items.filter(i => i.brandSlug === filterBrand);
        if (items.length === 0) {
            console.error(`❌ No items for brand: ${filterBrand}`);
            const allBrands = [...new Set(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')).map(i => i.brandSlug))];
            console.log('Available:', allBrands.join(', '));
            process.exit(1);
        }
    }

    console.log(`\n🚗 4W Image Scraper — Fix Missing/Broken/Wrong Images`);
    console.log(`   Total: ${items.length} images to scrape`);
    console.log(`   Mode: ${dryRun ? 'DRY RUN (no downloads)' : 'LIVE'}`);
    console.log(`   Legacy dir: public/assets/cars/`);
    console.log(`   New dir:    public/data/brand-model-images/4w/\n`);

    if (dryRun) {
        console.log('── Images to scrape ──────────────────────────────────────\n');
        const grouped = {};
        for (const item of items) {
            if (!grouped[item.brand]) grouped[item.brand] = [];
            grouped[item.brand].push(item);
        }
        for (const [brand, models] of Object.entries(grouped)) {
            console.log(`📦 ${brand} (${models.length})`);
            for (const m of models) {
                console.log(`   ${m.reason === 'missing' ? '❌' : '🔄'} ${m.model} → ${m.slug}.jpg [${m.reason}]`);
            }
        }
        console.log(`\nRun without --dry-run to start scraping.`);
        return;
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    let page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    let saved = 0, failed = 0, skipped = 0;
    let currentBrand = '';

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Print brand header
        if (item.brand !== currentBrand) {
            currentBrand = item.brand;
            const brandItems = items.filter(x => x.brand === currentBrand);
            console.log(`\n📦 ${currentBrand} (${brandItems.length} images)`);
        }

        const tag = item.reason === 'missing' ? '❌ MISSING' : item.reason === 'broken' ? '💔 BROKEN' : '🔄 WRONG';
        console.log(`   [${i + 1}/${items.length}] ${tag}: ${item.model}`);

        // Restart browser every 15 images to prevent memory leaks
        if (i > 0 && i % 15 === 0) {
            console.log('\n   🔄 Restarting browser...\n');
            await page.close();
            await browser.close();
            const newBrowser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            });
            page = await newBrowser.newPage();
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        }

        try {
            const imgUrl = await scrapeImage(page, item.brand, item.model);

            if (!imgUrl) {
                console.log(`      ❌ No image found`);
                failed++;
                continue;
            }

            // Save to legacy location
            const legacyDir = path.join(LEGACY_DIR, item.brandSlug);
            ensureDir(legacyDir);
            const legacyDest = path.join(legacyDir, `${item.slug}.jpg`);

            // Save to new location
            const newDir = path.join(NEW_DIR, item.brandSlug);
            ensureDir(newDir);
            const newDest = path.join(newDir, `${item.slug}.jpg`);

            // Download to legacy path
            const ok = await downloadImage(imgUrl, legacyDest);

            if (ok) {
                // Copy to new path
                fs.copyFileSync(legacyDest, newDest);
                const size = fs.statSync(legacyDest).size;
                console.log(`      ✅ Saved (${(size / 1024).toFixed(1)} KB)`);
                saved++;
            } else {
                console.log(`      ❌ Download failed`);
                failed++;
            }

        } catch (err) {
            console.log(`      ❌ Error: ${err.message}`);
            failed++;
        }

        // Random delay between 1-2.5 seconds to be polite
        await delay(1000 + Math.random() * 1500);
    }

    await browser.close();

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`✅ Scraping Complete!`);
    console.log(`   Saved:   ${saved}`);
    console.log(`   Failed:  ${failed}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`${'═'.repeat(50)}\n`);

    // Write results summary
    const resultsFile = path.join(SCRIPT_DIR, 'scrape_4w_results.json');
    fs.writeFileSync(resultsFile, JSON.stringify({ saved, failed, skipped, timestamp: new Date().toISOString() }, null, 2));
    console.log(`Results saved to: scripts/scrape_4w_results.json`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
