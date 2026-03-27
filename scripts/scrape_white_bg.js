/**
 * scrape_white_bg.js
 * Re-scrapes images that have non-white backgrounds with white background versions.
 * Reads from: scripts/non_white_bg_images.json
 *
 * Run all:        node scripts/scrape_white_bg.js
 * Run category:   node scripts/scrape_white_bg.js 4w
 * Run brand:      node scripts/scrape_white_bg.js --brand bmw
 * Dry run:        node scripts/scrape_white_bg.js --dry-run
 * Resume from N:  node scripts/scrape_white_bg.js --start 50
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.join(SCRIPT_DIR, '..');
const DATA_FILE = path.join(SCRIPT_DIR, 'non_white_bg_images.json');
const RESULTS_FILE = path.join(SCRIPT_DIR, 'white_bg_results.json');

// Category → base directory mapping
const CATEGORY_DIRS = {
    '4w': path.join(PROJECT_ROOT, 'public/assets/cars'),
    '4w-new': path.join(PROJECT_ROOT, 'public/data/brand-model-images/4w'),
    '2w': path.join(PROJECT_ROOT, 'public/data/brand-model-images/2w'),
    '3w': path.join(PROJECT_ROOT, 'public/data/brand-model-images/3w'),
};

// Vehicle type keywords for better search queries
const VEHICLE_KEYWORDS = {
    '4w': 'car',
    '4w-new': 'car',
    '2w': 'motorcycle scooter bike',
    '3w': 'auto rickshaw three wheeler',
};

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
        const req = proto.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
            timeout: 15000,
        }, res => {
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
                const stats = fs.statSync(dest);
                if (stats.size < 5000) {
                    fs.unlinkSync(dest);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
        req.on('error', () => { fs.unlink(dest, () => {}); resolve(false); });
        req.on('timeout', () => { req.destroy(); fs.unlink(dest, () => {}); resolve(false); });
    });
}

function getBrandDisplayName(brand, category) {
    // Clean up brand slug to display name
    const mappings = {
        'maruti-suzuki': 'Maruti Suzuki',
        'mercedes-benz': 'Mercedes-Benz',
        'force-motors': 'Force Motors',
        'tata-motors': 'Tata Motors',
        'land-rover': 'Land Rover',
        'aston-martin': 'Aston Martin',
        'honda-hmsi': 'Honda',
        'hero-motocorp': 'Hero MotoCorp',
        'bajaj-auto': 'Bajaj',
        'bajaj-auto-3w': 'Bajaj',
        'tvs-motor': 'TVS',
        'tvs-iqube': 'TVS iQube',
        'tvs-king': 'TVS King',
        'yamaha-india': 'Yamaha',
        'suzuki-motorcycle': 'Suzuki',
        'royal-enfield': 'Royal Enfield',
        'ktm-india': 'KTM',
        'kawasaki-india': 'Kawasaki',
        'ather-energy': 'Ather Energy',
        'ola-electric': 'Ola Electric',
        'bmw-motorrad-india': 'BMW Motorrad',
        'ducati-india': 'Ducati',
        'harley-davidson-india': 'Harley-Davidson',
        'triumph-india': 'Triumph',
        'indian-motorcycle': 'Indian Motorcycle',
        'jawa-motorcycles': 'Jawa',
        'benelli-india': 'Benelli',
        'cfmoto-india': 'CFMoto',
        'keeway-india': 'Keeway',
        'husqvarna-india': 'Husqvarna',
        'aprilia-india': 'Aprilia',
        'piaggio-ape': 'Piaggio Ape',
        'mahindra-3w': 'Mahindra',
        'euler-motors': 'Euler Motors',
        'greaves-electric-3w': 'Greaves Electric',
        'kinetic-green': 'Kinetic Green',
        'lohia-auto': 'Lohia Auto',
        'atul-auto': 'Atul Auto',
        'okinawa-autotech': 'Okinawa',
        'norton-motorcycles': 'Norton',
        'moto-guzzi': 'Moto Guzzi',
        'vespa-india': 'Vespa',
        'vida-hero': 'Vida',
        'yezdi-motorcycles': 'Yezdi',
        'zontes-india': 'Zontes',
        'simple-energy': 'Simple Energy',
        'pure-ev': 'Pure EV',
        'oben-electric': 'Oben Electric',
        'odysse-electric': 'Odysse Electric',
        'ampere-greaves': 'Ampere',
        'hop-electric': 'Hop Electric',
        'hero-electric': 'Hero Electric',
        'joy-e-bike': 'Joy e-bike',
        'kabira-mobility': 'Kabira Mobility',
        'komaki': 'Komaki',
        'lectrix-ev': 'Lectrix EV',
        'matter-ev': 'Matter',
        'okaya-ev': 'Okaya EV',
        'quantum-energy': 'Quantum Energy',
        'river-ev': 'River',
        'bounce-infinity': 'Bounce Infinity',
        'mahindra-two-wheelers': 'Mahindra',
        'tork-motors': 'Tork Motors',
        'bajaj-chetak-ev': 'Bajaj Chetak',
        'ultraviolette': 'Ultraviolette',
    };
    return mappings[brand] || brand.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getModelDisplayName(slug) {
    // Convert slug back to rough display name
    return slug.replace(/^(honda-|bmw-|maruti-|mercedes-benz-|vespa-|jawa-)/, '')
        .split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function scrapeImage(page, brand, model, category) {
    const brandName = getBrandDisplayName(brand, category);
    const modelName = getModelDisplayName(model);
    const vehicleType = VEHICLE_KEYWORDS[category] || 'vehicle';

    const queries = [
        `${brandName} ${modelName} ${vehicleType} white background studio shot India 2024`,
        `${brandName} ${modelName} official press image white background`,
        `${brandName} ${modelName} ${vehicleType} side view white background`,
    ];

    for (const query of queries) {
        try {
            const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-large+filterui:color2-FGcls_WHITE&form=IRFLTR`;
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await delay(1500);

            // Strategy 1: .iusc metadata
            let imgUrl = await page.evaluate(() => {
                const items = document.querySelectorAll('.iusc');
                for (const item of items) {
                    try {
                        const meta = JSON.parse(item.getAttribute('m') || '{}');
                        if (meta.murl && meta.murl.startsWith('http') &&
                            !meta.murl.includes('favicon') && !meta.murl.includes('logo') &&
                            !meta.murl.includes('icon')) {
                            return meta.murl;
                        }
                    } catch { continue; }
                }
                return null;
            });

            if (imgUrl) return imgUrl;

            // Strategy 2: img.mimg
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
            // Try next query
        }
    }
    return null;
}

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const startIdx = args.includes('--start') ? parseInt(args[args.indexOf('--start') + 1]) || 0 : 0;
    const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null;
    const catFilter = args.find(a => !a.startsWith('--') && ['4w', '2w', '3w'].includes(a));

    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ non_white_bg_images.json not found. Run detect_non_white_bg.py first.');
        process.exit(1);
    }

    let items = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Filter out 4w-new (duplicates of 4w, will be handled by copying)
    items = items.filter(i => i.category !== '4w-new');

    if (catFilter) items = items.filter(i => i.category === catFilter);
    if (brandFilter) items = items.filter(i => i.brand === brandFilter);
    items = items.slice(startIdx);

    console.log(`\n🖼  White Background Image Scraper`);
    console.log(`   Total: ${items.length} images to re-scrape`);
    console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
    if (startIdx > 0) console.log(`   Starting from: #${startIdx}`);
    console.log('');

    if (dryRun) {
        const grouped = {};
        for (const item of items) {
            const key = `${item.category}/${item.brand}`;
            grouped[key] = (grouped[key] || 0) + 1;
        }
        for (const [key, count] of Object.entries(grouped).sort()) {
            console.log(`   ${key}: ${count} images`);
        }
        console.log(`\n   Run without --dry-run to start.`);
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
    const failedItems = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (`${item.category}/${item.brand}` !== currentBrand) {
            currentBrand = `${item.category}/${item.brand}`;
            console.log(`\n📦 ${currentBrand}`);
        }

        console.log(`   [${startIdx + i + 1}] ${item.slug}`);

        // Restart browser every 20 images
        if (i > 0 && i % 20 === 0) {
            console.log('\n   🔄 Restarting browser...\n');
            try { await page.close(); } catch {}
            try { await browser.close(); } catch {}
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            });
            page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        }

        try {
            const imgUrl = await scrapeImage(page, item.brand, item.slug, item.category);

            if (!imgUrl) {
                console.log(`      ❌ No image found`);
                failed++;
                failedItems.push(item);
                continue;
            }

            // Determine destination paths
            const baseDir = CATEGORY_DIRS[item.category];
            const destDir = path.join(baseDir, item.brand);
            ensureDir(destDir);
            const dest = path.join(destDir, `${item.slug}.jpg`);

            const ok = await downloadImage(imgUrl, dest);

            if (ok) {
                const size = fs.statSync(dest).size;
                console.log(`      ✅ ${(size / 1024).toFixed(1)} KB`);
                saved++;

                // If 4w, also copy to 4w-new
                if (item.category === '4w') {
                    const newDir = path.join(CATEGORY_DIRS['4w-new'], item.brand);
                    ensureDir(newDir);
                    const newDest = path.join(newDir, `${item.slug}.jpg`);
                    fs.copyFileSync(dest, newDest);
                }
            } else {
                console.log(`      ❌ Download failed`);
                failed++;
                failedItems.push(item);
            }

        } catch (err) {
            console.log(`      ❌ Error: ${err.message}`);
            failed++;
            failedItems.push(item);

            if (err.message.includes('Connection closed') || err.message.includes('Target closed')) {
                try { await browser.close(); } catch {}
                browser = await puppeteer.launch({
                    headless: 'new',
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
                });
                page = await browser.newPage();
                await page.setViewport({ width: 1280, height: 800 });
                await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            }
        }

        await delay(800 + Math.random() * 1200);
    }

    try { await browser.close(); } catch {}

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`✅ Scraping Complete!`);
    console.log(`   Saved:  ${saved}`);
    console.log(`   Failed: ${failed}`);
    console.log(`${'═'.repeat(50)}\n`);

    // Save results
    fs.writeFileSync(RESULTS_FILE, JSON.stringify({
        saved, failed,
        failedItems,
        timestamp: new Date().toISOString(),
    }, null, 2));

    // Convert non-JPEG files to actual JPEG
    if (saved > 0) {
        console.log('🔄 Converting any non-JPEG files to actual JPEG...');
        const { execSync } = require('child_process');
        for (const cat of Object.keys(CATEGORY_DIRS)) {
            try {
                const result = execSync(
                    `find "${CATEGORY_DIRS[cat]}" -name "*.jpg" -exec file {} \\; | grep -v JPEG | grep -v empty | cut -d: -f1`,
                    { encoding: 'utf8', timeout: 30000 }
                ).trim();
                if (result) {
                    for (const f of result.split('\n').filter(Boolean)) {
                        try {
                            execSync(`sips -s format jpeg "${f}" --out /tmp/sips_conv.jpg 2>/dev/null && mv /tmp/sips_conv.jpg "${f}"`);
                        } catch {}
                    }
                }
            } catch {}
        }
        console.log('   Done!\n');
    }
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
