/**
 * scrape_piaggio_3w.js
 * Scrapes high-quality images for Piaggio 3W models.
 * Saves them to public/data/brand-model-images/3w/piaggio-ape/
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PIAGGIO_DATA = path.join(process.cwd(), 'public/data/3w/piaggio-ape.json');
const DEST_DIR = path.join(process.cwd(), 'public/data/brand-model-images/3w/piaggio-ape');

function modelToSlug(m) {
    return m.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function downloadImage(url, destination) {
    if (!url || !url.startsWith('http')) return false;
    const protocol = url.startsWith('https') ? https : http;
    return new Promise((resolve) => {
        const file = fs.createWriteStream(destination);
        protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, response => {
            if (response.statusCode !== 200) {
                fs.unlink(destination, () => { });
                resolve(false);
                return;
            }
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => {
            fs.unlink(destination, () => { });
            resolve(false);
        });
    });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scrapeImage(page, model) {
    const query = `Piaggio Ape ${model} auto rickshaw 2024 side view white background`;
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;

    console.log(`  Searching for: ${model}...`);
    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
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

        if (!imgUrl) {
            console.log(`    ❌ No image found for ${model}`);
            return false;
        }

        const slug = modelToSlug(model);
        const ext = imgUrl.toLowerCase().includes('.png') ? '.png' : '.jpg';
        const dest = path.join(DEST_DIR, `${slug}${ext}`);

        // Remove old files with different extensions if necessary
        const altExt = ext === '.jpg' ? '.png' : '.jpg';
        const altDest = path.join(DEST_DIR, `${slug}${altExt}`);
        if (fs.existsSync(altDest)) fs.unlinkSync(altDest);

        const ok = await downloadImage(imgUrl, dest);
        if (ok) {
            console.log(`    ✅ Saved: ${slug}${ext}`);
            return true;
        } else {
            console.log(`    ❌ Failed to download: ${imgUrl}`);
            return false;
        }
    } catch (err) {
        console.log(`    ❌ Error: ${err.message}`);
        return false;
    }
}

async function main() {
    if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

    const data = JSON.parse(fs.readFileSync(PIAGGIO_DATA, 'utf8'));
    const models = data.vehicles;

    console.log(`🚀 Starting Piaggio 3W image scrape — ${models.length} models\n`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    let saved = 0, failed = 0;

    for (const v of models) {
        const ok = await scrapeImage(page, v.model);
        if (ok) saved++; else failed++;
        await delay(1000);
    }

    await browser.close();
    console.log(`\n\n✅ Scraping complete!`);
    console.log(`   Saved: ${saved} | Failed: ${failed}`);
}

main().catch(console.error);
