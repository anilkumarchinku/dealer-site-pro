/**
 * Retry failed white background scrapes with custom search queries.
 * Run: node scripts/retry_white_bg.js
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PROJECT_ROOT = path.join(__dirname, '..');
const CATEGORY_DIRS = {
    '4w': path.join(PROJECT_ROOT, 'public/assets/cars'),
    '2w': path.join(PROJECT_ROOT, 'public/data/brand-model-images/2w'),
    '3w': path.join(PROJECT_ROOT, 'public/data/brand-model-images/3w'),
};

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

async function downloadImage(url, dest) {
    if (!url || !url.startsWith('http')) return false;
    const proto = url.startsWith('https') ? https : http;
    return new Promise(resolve => {
        const file = fs.createWriteStream(dest);
        proto.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' },
            timeout: 15000,
        }, res => {
            if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
                fs.unlink(dest, () => {}); downloadImage(res.headers.location, dest).then(resolve); return;
            }
            if (res.statusCode !== 200) { fs.unlink(dest, () => {}); resolve(false); return; }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                const s = fs.statSync(dest).size;
                if (s < 5000) { fs.unlinkSync(dest); resolve(false); } else resolve(true);
            });
        }).on('error', () => { fs.unlink(dest, () => {}); resolve(false); });
    });
}

async function main() {
    const items = JSON.parse(fs.readFileSync(path.join(__dirname, 'retry_failed_white_bg.json'), 'utf8'));
    console.log(`\n🔄 Retrying ${items.length} failed images...\n`);

    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

    let saved = 0, failed = 0;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`[${i+1}/${items.length}] ${item.category}/${item.brand}/${item.slug}`);

        try {
            // Try without white filter first, then with
            for (const filterSuffix of ['', '&qft=+filterui:color2-FGcls_WHITE']) {
                const url = `https://www.bing.com/images/search?q=${encodeURIComponent(item.query)}${filterSuffix}&form=IRFLTR`;
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await delay(2000);

                const imgUrl = await page.evaluate(() => {
                    const items = document.querySelectorAll('.iusc');
                    for (const el of items) {
                        try {
                            const meta = JSON.parse(el.getAttribute('m') || '{}');
                            if (meta.murl && meta.murl.startsWith('http')) return meta.murl;
                        } catch { continue; }
                    }
                    const imgs = document.querySelectorAll('img.mimg');
                    for (const img of imgs) {
                        const src = img.getAttribute('src') || '';
                        if (src.startsWith('http')) return src;
                    }
                    return null;
                });

                if (imgUrl) {
                    const baseDir = CATEGORY_DIRS[item.category];
                    const destDir = path.join(baseDir, item.brand);
                    ensureDir(destDir);
                    const dest = path.join(destDir, `${item.slug}.jpg`);
                    const ok = await downloadImage(imgUrl, dest);
                    if (ok) {
                        const size = fs.statSync(dest).size;
                        console.log(`   ✅ ${(size/1024).toFixed(1)} KB`);
                        saved++;
                        // Copy to 4w-new if 4w
                        if (item.category === '4w') {
                            const newDir = path.join(PROJECT_ROOT, 'public/data/brand-model-images/4w', item.brand);
                            ensureDir(newDir);
                            fs.copyFileSync(dest, path.join(newDir, `${item.slug}.jpg`));
                        }
                        break;
                    }
                }
            }
        } catch (err) {
            console.log(`   ❌ ${err.message}`);
            failed++;
        }

        await delay(1500);
    }

    await browser.close();
    console.log(`\n✅ Done! Saved: ${saved}, Failed: ${failed}`);

    // Convert non-JPEG
    const { execSync } = require('child_process');
    for (const dir of Object.values(CATEGORY_DIRS)) {
        try {
            const result = execSync(`find "${dir}" -name "*.jpg" -exec file {} \\; | grep -v JPEG | grep -v empty | cut -d: -f1`, { encoding: 'utf8', timeout: 30000 }).trim();
            for (const f of result.split('\n').filter(Boolean)) {
                try { execSync(`sips -s format jpeg "${f}" --out /tmp/sips_conv.jpg 2>/dev/null && mv /tmp/sips_conv.jpg "${f}"`); } catch {}
            }
        } catch {}
    }
}

main().catch(console.error);
