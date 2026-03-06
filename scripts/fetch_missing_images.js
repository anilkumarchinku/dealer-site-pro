const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const https = require('https');

const DATA_FILE = path.join(process.cwd(), 'scripts', 'missing_images.json');
const IMAGES_BASE = path.join(process.cwd(), 'public/data/brand-model-images');

async function ensureDirectoryExists(dirPath) {
    try {
        await fsPromises.access(dirPath);
    } catch (error) {
        await fsPromises.mkdir(dirPath, { recursive: true });
    }
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function downloadImage(url, destination) {
    if (!url || !url.startsWith('http')) return false;

    const dir = path.dirname(destination);
    await ensureDirectoryExists(dir);

    return new Promise((resolve) => {
        const file = fs.createWriteStream(destination);
        https.get(url, response => {
            if (response.statusCode !== 200) {
                fs.unlink(destination, () => { });
                resolve(false);
                return;
            }
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', err => {
            fs.unlink(destination, () => { });
            resolve(false);
        });
    });
}

function getSearchQuery(brand, modelName, type) {
    if (type === '3w') {
        return `${brand} ${modelName} auto rickshaw side view white background`;
    }
    return `${brand} ${modelName} side view studio shot white background`;
}

async function scrapeMissingImages() {
    if (!fs.existsSync(DATA_FILE)) {
        console.error("No missing_images.json found. Run the audit script first.");
        return;
    }

    let missingItems = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log(`Starting fetch for ${missingItems.length} missing images...`);

    let browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security'
        ]
    });

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < missingItems.length; i++) {
        const item = missingItems[i];
        const { type, brandId, originalBrand, model, slug } = item;
        const brandStr = originalBrand || brandId.replace(/-/g, ' ');
        const destinationJpg = path.join(IMAGES_BASE, type, brandId, `${slug}.jpg`);

        if (fs.existsSync(destinationJpg) || fs.existsSync(destinationJpg.replace('.jpg', '.png'))) {
            continue;
        }

        const query = getSearchQuery(brandStr, model, type);
        console.log(`\n[${i + 1}/${missingItems.length}] ${type.toUpperCase()}: ${query}`);

        try {
            // Re-open browser occasionally to avoid crashes or leaks
            if (i > 0 && i % 20 === 0) {
                console.log('--- Restarting browser container ---');
                await browser.close();
                browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            }

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            // Go to Bing Images instead of Google to avoid rigid bot layout locks
            const encodedQuery = encodeURIComponent(query);
            await page.goto(`https://www.bing.com/images/search?q=${encodedQuery}`, { waitUntil: 'domcontentloaded', timeout: 30000 });

            await delay(2000);

            const imageUrl = await page.evaluate(() => {
                const imgs = document.querySelectorAll('img.mimg');
                for (const img of imgs) {
                    const src = img.getAttribute('src');
                    // Bing provides direct URLs often or embedded base64 that translates. For actual downloaded images we need src that is http
                    if (src && src.startsWith('http')) return src;
                }
                return null;
            });

            if (imageUrl) {
                console.log(`   --> Found image...`);
                const downloaded = await downloadImage(imageUrl, destinationJpg);
                if (downloaded) {
                    console.log(`   ✅ Saved ${slug}`);
                    successCount++;
                } else {
                    console.log(`   ❌ Failed HTTP D/L`);
                    failedCount++;
                }
            } else {
                console.log(`   ❌ No valid image tags found`);
                failedCount++;
            }

            await page.close();

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            failedCount++;
            // If browser completely died, attempt to resurrect it for the next loop
            if (error.message.includes('Connection closed') || error.message.includes('Target closed')) {
                try { await browser.close(); } catch (e) { }
                browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            }
        }

        await delay(500 + Math.random() * 1000); // 0.5-1.5s delay
    }

    await browser.close();

    console.log(`\n================================`);
    console.log(`Scraping Complete.`);
    console.log(`Successfully Downloaded: ${successCount}`);
    console.log(`Failed/Missing: ${failedCount}`);
    console.log(`================================\n`);
}

scrapeMissingImages().catch(console.error);
