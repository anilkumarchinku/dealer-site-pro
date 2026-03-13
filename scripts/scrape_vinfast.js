const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const BRAND_ID = 'vinfast';
const MODELS = ['VF 6', 'VF 7', 'VF 8', 'VF 9'];
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data', 'brand-model-images', '4w', BRAND_ID);

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .on('finish', resolve);
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}

async function scrapeModelImage(modelName, customQuery) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set a realistic viewport and user agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const query = customQuery || `${BRAND_ID} ${modelName} official press photo white background`;
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1&tsc=ImageHoverTitle`;

    console.log(`Searching for: ${query}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Extract image URLs
    const imageUrls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('a.iusc'));
        return imgs.map(a => {
            const m = JSON.parse(a.getAttribute('m'));
            return m.murl;
        }).filter(url => url.startsWith('http'));
    });

    if (imageUrls.length > 0) {
        const topUrl = imageUrls[0];
        const fileName = `${modelName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        const filePath = path.join(OUTPUT_DIR, fileName);

        console.log(`Downloading ${topUrl} to ${filePath}`);
        try {
            await downloadImage(topUrl, filePath);
            console.log(`Successfully saved ${fileName}`);
        } catch (err) {
            console.error(`Failed to download ${fileName}: ${err.message}`);
        }
    } else {
        console.log(`No images found for ${modelName}`);
    }

    await browser.close();
}

async function run() {
    const refinedModels = [
        { name: 'VF 7', query: 'vinfast vf 7 exterior car full view white background front three quarter official press photo' }
    ];

    for (const model of refinedModels) {
        console.log(`Re-scraping ${model.name}...`);
        await scrapeModelImage(model.name, model.query);
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log('Scraping complete!');
}

run().catch(console.error);
