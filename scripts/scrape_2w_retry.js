/**
 * scrape_2w_retry.js — Retry the 6 failed images with alternative search queries.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PROJECT_ROOT = path.join(__dirname, '..');
const TW_DIR = path.join(PROJECT_ROOT, 'public/data/brand-model-images/2w');

const RETRIES = [
    {
        brand: 'Honda', brandSlug: 'honda-hmsi', slug: 'dio',
        queries: [
            'Honda Dio scooter India 2024',
            'Honda Dio 110 scooter official',
            'Honda Dio 2024 side profile',
        ],
    },
    {
        brand: 'Honda', brandSlug: 'honda-hmsi', slug: 'hness-cb350',
        queries: [
            'Honda Hness CB350 India 2024',
            'Honda H ness CB 350 motorcycle official',
            'Honda CB350 Hness side view India',
        ],
    },
    {
        brand: 'Honda', brandSlug: 'honda-hmsi', slug: 'cb350c',
        queries: [
            'Honda CB350C motorcycle India',
            'Honda CB 350 C cruiser India 2024',
            'Honda CB350 cafe racer India',
        ],
    },
    {
        brand: 'Yamaha', brandSlug: 'yamaha-india', slug: 'fascino-125',
        queries: [
            'Yamaha Fascino 125 scooter India 2024',
            'Yamaha Fascino 125 Fi official image',
            'Yamaha Fascino 125 side view',
        ],
    },
    {
        brand: 'Vespa', brandSlug: 'vespa-india', slug: 'vxl-125',
        queries: [
            'Vespa VXL 125 scooter India 2024',
            'Piaggio Vespa VXL 125 official',
            'Vespa VXL 125 side view India',
        ],
    },
    {
        brand: 'Jawa', brandSlug: 'jawa-motorcycles', slug: '42-fj',
        queries: [
            'Jawa 42 FJ motorcycle India 2024',
            'Jawa 42 FJ bobber official image',
            'Jawa Forty Two FJ India',
        ],
    },
];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

async function downloadImage(url, dest) {
    if (!url || !url.startsWith('http')) return false;
    const proto = url.startsWith('https') ? https : http;
    return new Promise(resolve => {
        const file = fs.createWriteStream(dest);
        proto.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'image/*,*/*;q=0.8',
            },
            timeout: 15000,
        }, res => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                file.close();
                fs.unlink(dest, () => {});
                downloadImage(res.headers.location, dest).then(resolve);
                return;
            }
            if (res.statusCode !== 200) { file.close(); fs.unlink(dest, () => {}); resolve(false); return; }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                const stats = fs.statSync(dest);
                if (stats.size < 5000) { console.log(`      ⚠ Too small (${stats.size}b)`); fs.unlinkSync(dest); resolve(false); }
                else resolve(true);
            });
        }).on('error', () => { file.close(); fs.unlink(dest, () => {}); resolve(false); });
    });
}

async function main() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    let saved = 0, failed = 0;

    for (let i = 0; i < RETRIES.length; i++) {
        const item = RETRIES[i];
        console.log(`[${i+1}/${RETRIES.length}] ${item.brand} ${item.slug}`);

        let imgUrl = null;
        for (const query of item.queries) {
            try {
                const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-large&form=IRFLTR`;
                await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await delay(2500);

                // Try .iusc metadata — pick from top 3 results
                imgUrl = await page.evaluate(() => {
                    const items = document.querySelectorAll('.iusc');
                    for (let j = 0; j < Math.min(items.length, 5); j++) {
                        try {
                            const meta = JSON.parse(items[j].getAttribute('m') || '{}');
                            if (meta.murl && meta.murl.startsWith('http') &&
                                !meta.murl.includes('favicon') && !meta.murl.includes('logo') &&
                                !meta.murl.includes('.svg')) {
                                return meta.murl;
                            }
                        } catch { continue; }
                    }
                    return null;
                });

                if (imgUrl) {
                    console.log(`   Found via: "${query}"`);
                    break;
                }

                // Fallback: img.mimg
                imgUrl = await page.evaluate(() => {
                    const imgs = document.querySelectorAll('img.mimg');
                    for (const img of imgs) {
                        const src = img.getAttribute('src') || '';
                        if (src.startsWith('http') && !src.includes('favicon') && !src.includes('logo')) return src;
                    }
                    return null;
                });

                if (imgUrl) {
                    console.log(`   Found via fallback: "${query}"`);
                    break;
                }
            } catch (err) {
                console.log(`   ⚠ Query error: ${err.message}`);
            }
        }

        if (!imgUrl) {
            console.log(`   ❌ No image found after all queries`);
            failed++;
            continue;
        }

        const destDir = path.join(TW_DIR, item.brandSlug);
        ensureDir(destDir);
        const dest = path.join(destDir, `${item.slug}.jpg`);

        const ok = await downloadImage(imgUrl, dest);
        if (ok) {
            const size = fs.statSync(dest).size;
            console.log(`   ✅ Saved (${(size / 1024).toFixed(1)} KB)`);
            saved++;
        } else {
            console.log(`   ❌ Download failed`);
            failed++;
        }

        await delay(1500 + Math.random() * 1000);
    }

    await browser.close();

    console.log(`\n${'═'.repeat(40)}`);
    console.log(`Retry Complete: ${saved} saved, ${failed} failed`);
    console.log(`${'═'.repeat(40)}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
