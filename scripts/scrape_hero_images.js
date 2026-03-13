/**
 * scrape_hero_images.js
 * Scrapes wide hero/banner images for brands missing from /public/assets/hero/
 * Saves to: public/assets/hero/{brand-slug}.jpg
 *
 * Run: node scripts/scrape_hero_images.js
 * Run single: node scripts/scrape_hero_images.js renault
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DEST_DIR = path.join(process.cwd(), 'public/assets/hero');

// ── Missing hero images ───────────────────────────────────────────────────────
const HERO_BRANDS = [
    { slug: 'renault',      brand: 'Renault',      query: 'Renault India showroom hero banner car wide 4k' },
    { slug: 'volkswagen',   brand: 'Volkswagen',   query: 'Volkswagen India hero banner car wide 4k official' },
    { slug: 'mini',         brand: 'MINI',          query: 'MINI Cooper India hero banner wide official 4k' },
    { slug: 'mahindra',     brand: 'Mahindra',      query: 'Mahindra XUV700 India hero banner wide official 4k' },
    { slug: 'citroen',      brand: 'Citroen',       query: 'Citroen India C3 hero banner wide official 4k' },
    { slug: 'nissan',       brand: 'Nissan',        query: 'Nissan India Magnite hero banner wide official 4k' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
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

async function scrapeHeroImage(page, slug, brand, query) {
    // Search for wide/landscape hero image — filter by large size
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1&scenario=ImageHoverTitle`;

    console.log(`  🔍 Searching hero for: ${brand}...`);
    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await delay(2000);

        // Try to get a wide/landscape image (prefer width > height)
        const imgUrl = await page.evaluate(() => {
            const imgs = document.querySelectorAll('.iusc');
            let bestUrl = null;
            let bestScore = 0;

            for (const img of imgs) {
                try {
                    const meta = JSON.parse(img.getAttribute('m') || '{}');
                    if (!meta.murl || !meta.murl.startsWith('http')) continue;
                    // Prefer landscape images (wider than tall)
                    const w = meta.mw || 0;
                    const h = meta.mh || 0;
                    const ratio = w / (h || 1);
                    const score = ratio >= 1.5 ? w : 0; // Only landscape
                    if (score > bestScore) { bestScore = score; bestUrl = meta.murl; }
                } catch { continue; }
            }
            // Fallback: just take first image
            if (!bestUrl) {
                for (const img of imgs) {
                    try {
                        const meta = JSON.parse(img.getAttribute('m') || '{}');
                        if (meta.murl && meta.murl.startsWith('http')) return meta.murl;
                    } catch { continue; }
                }
            }
            return bestUrl;
        });

        if (!imgUrl) { console.log(`    ❌ No image found for ${brand}`); return false; }

        const ext = imgUrl.toLowerCase().includes('.png') ? '.png' : '.jpg';
        const dest = path.join(DEST_DIR, `${slug}${ext}`);

        const ok = await downloadImage(imgUrl, dest);
        if (ok) {
            console.log(`    ✅ Saved: ${slug}${ext}`);
            return { slug, ext };
        }
        console.log(`    ❌ Download failed: ${brand}`);
        return false;
    } catch (err) {
        console.log(`    ❌ Error (${brand}): ${err.message}`);
        return false;
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    const filterSlug = process.argv[2];
    const brands = filterSlug
        ? HERO_BRANDS.filter(b => b.slug === filterSlug)
        : HERO_BRANDS;

    if (filterSlug && brands.length === 0) {
        console.error(`❌ Brand not found: ${filterSlug}`);
        process.exit(1);
    }

    if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

    console.log(`🚀 Hero Image Scraper`);
    console.log(`   Brands to scrape: ${brands.map(b => b.brand).join(', ')}\n`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 }); // Wide viewport for hero images
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

    const results = [];
    for (const { slug, brand, query } of brands) {
        const result = await scrapeHeroImage(page, slug, brand, query);
        if (result) results.push(result);
        await delay(1500);
    }

    await browser.close();

    // Print brand-hero.ts additions needed
    if (results.length > 0) {
        console.log('\n\n📋 Add these to lib/utils/brand-hero.ts brandImageMap:');
        for (const { slug, ext } of results) {
            const extClean = ext.replace('.', '');
            console.log(`        '${slug}': '${extClean}',`);
        }
    }

    console.log(`\n✅ Done! Saved: ${results.length} | Failed: ${brands.length - results.length}`);
    console.log(`   Output: public/assets/hero/`);
}

main().catch(console.error);
