/**
 * CarDekho Scraper
 * Scrapes car data using Puppeteer from CarDekho.com
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const https = require('https');
const { BRANDS } = require('./brands-config');

const OUTPUT_DIR = path.join(process.cwd(), 'lib/data/sample-cars');
const IMAGES_DIR = path.join(process.cwd(), 'public/assets/cars');

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

// Download image function
async function downloadImage(url, destination) {
    if (!url) return null;
    if (!url.startsWith('http')) return null;

    // Create directory if it doesn't exist
    const dir = path.dirname(destination);
    await ensureDirectoryExists(dir);

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);

        https.get(url, response => {
            if (response.statusCode !== 200) {
                fs.unlink(destination, () => { });
                resolve(false);
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', err => {
            fs.unlink(destination, () => { });
            resolve(false); // Resolve false instead of reject to not break the scraper
        });
    });
}

async function scrapeCar(browser, brand, modelSlug) {
    // Respect random delay before each request
    await delay(500 + Math.random() * 1000);

    const page = await browser.newPage();
    const url = `https://www.cardekho.com/${brand.slug}/${modelSlug}`;

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`Scraping: ${brand.name} ${modelSlug}...`);

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait for critical elements
        try {
            await page.waitForSelector('h1', { timeout: 3000 });
        } catch (e) {
            // console.log('Timeout waiting for h1, proceeding anyway...');
        }

        // Basic Info extraction
        const data = await page.evaluate(() => {
            const getText = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.textContent.trim() : '';
            };

            const getSrc = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.getAttribute('src') : '';
            };

            const name = getText('h1');

            // Try multiple selectors for price matching
            let priceText = getText('.price');
            if (!priceText) priceText = getText('.g-price');
            if (!priceText) priceText = getText('div[class*="price"]');

            // Features - Try multiple structures
            const keyFeatures = [];
            const featureList = document.querySelectorAll('.key-feature-list li, .feature-list li, .key-specifications li');
            featureList.forEach(el => keyFeatures.push(el.textContent.trim()));

            // Specs (Engine, Mileage, etc.)
            const specs = {};
            const rows = document.querySelectorAll('tr, .spec-row, div[class*="row"]');
            rows.forEach(row => {
                // Flexible selector for label/value
                const labelEl = row.querySelector('td:first-child, .label, div[class*="label"], th');
                const valueEl = row.querySelector('td:last-child, .value, div[class*="value"], td');

                if (labelEl && valueEl) {
                    const label = labelEl.textContent?.trim().toLowerCase();
                    const value = valueEl.textContent?.trim();
                    // Avoid empty or super long keys
                    if (label && value && label.length < 50) {
                        specs[label] = value;
                    }
                }
            });

            // Images
            let heroImage = getSrc('.qc-image-gallery img') || getSrc('img[title*="' + name + '"]') || getSrc('img[alt*="' + name + '"]');
            if (heroImage) heroImage = heroImage.split('?')[0];

            return {
                name,
                priceText,
                keyFeatures,
                heroImage,
                specs
            };
        });

        // Populate features from specs if empty
        const KNOWN_FEATURES = [
            'power steering', 'power windows', 'air conditioner', 'heater', 'adjustable steering',
            'automatic climate control', 'air quality control', 'low fuel warning light',
            'accessory power outlet', 'trunk light', 'vanity mirror', 'rear reading lamp',
            'rear seat headrest', 'adjustable headrest', 'rear seat centre armrest',
            'cup holders-front', 'cup holders-rear', 'cruise control', 'parking sensors',
            'navigation system', 'foldable rear seat', 'keyless entry', 'engine start/stop button',
            'glove box cooling', 'voice control', 'usb charger', 'central console armrest',
            'tailgate ajar', 'drive modes', 'idle start-stop system', 'rear window wiper',
            'rear window washer', 'rear window defogger', 'alloy wheels', 'tinted glass',
            'sun roof', 'moon roof', 'side stepper', 'integrated antenna', 'projector headlamps',
            'fog lights', 'led drl', 'led taillamps', 'abs', 'brake assist', 'central locking',
            'power door locks', 'child safety locks', 'anti-theft alarm', 'driver airbag',
            'passenger airbag', 'side airbag-front', 'side airbag-rear', 'day & night rear view mirror',
            'passenger side rear view mirror', 'xenon headlamps', 'seat belt warning',
            'door ajar warning', 'traction control', 'tyre pressure monitor', 'engine immobilizer',
            'electronic stability control', 'rear camera', 'anti-theft device', 'speed sensing auto door lock',
            'iso fix child seat mounts', 'lane change indicator', 'hill assist', '360 view camera'
        ];

        if (data.keyFeatures.length === 0) {
            Object.keys(data.specs).forEach(key => {
                const cleanKey = key.replace(/[^a-z ]/g, '');
                if (KNOWN_FEATURES.some(f => cleanKey.includes(f)) || data.specs[key].toLowerCase() === 'yes') {
                    if (!['yes', 'no', 'na'].includes(cleanKey)) {
                        if (data.specs[key].toLowerCase() === 'yes' || data.specs[key] === '') {
                            data.keyFeatures.push(key);
                        }
                    }
                }
            });

            const potentialFeatures = [
                'keyless entry', 'push button start/stop', 'auto headlamps', 'cruise control',
                'six airbags', 'abs with ebd', 'electronic stability control', 'hill assist',
                'rear parking sensors', 'connected car technology', 'sunroof', 'alloy wheels'
            ];

            potentialFeatures.forEach(pf => {
                if (data.specs[pf]) {
                    data.keyFeatures.push(pf);
                }
            });
        }

        // Robust Price Parsing
        const parsePriceValue = (str) => {
            if (!str) return 0;
            const clean = str.replace(/[^0-9.]/g, '');
            const val = parseFloat(clean);
            if (isNaN(val)) return 0;

            if (str.includes('Cr')) return val * 10000000;
            if (str.includes('Lakh')) return val * 100000;
            if (val < 100) return val * 100000;
            return val;
        };

        let priceMin = 0;
        let priceMax = 0;

        if (data.priceText) {
            const cleanPrice = data.priceText.replace(/Rs\.|[*]|Ex-Showroom.*/g, '').trim();
            const parts = cleanPrice.split('-');

            if (parts.length >= 1) {
                priceMin = parsePriceValue(parts[0]);
            }
            if (parts.length > 1) {
                const maxPart = parts[1];
                priceMax = parsePriceValue(maxPart);
                if (priceMin < 100 && priceMax > 10000) {
                    if (maxPart.includes('Lakh')) priceMin = priceMin * 100000;
                    if (maxPart.includes('Cr')) priceMin = priceMin * 10000000;
                }
            } else {
                priceMax = priceMin;
            }
        }

        // Download Image Logic
        let localImagePath = '';
        if (data.heroImage) {
            const imageFileName = `${modelSlug}.jpg`;
            const relativePath = `/${brand.slug}/${imageFileName}`;
            const absolutePath = path.join(IMAGES_DIR, brand.slug, imageFileName);

            const downloaded = await downloadImage(data.heroImage, absolutePath);
            if (downloaded) {
                localImagePath = `/assets/cars${relativePath}`;
                console.log(`   Downloaded: ${relativePath}`);
            } else {
                localImagePath = data.heroImage;
                console.log(`   Img Download Failed, using remote: ${data.heroImage}`);
            }
        }

        // Spec Helper
        const getSpec = (keys) => {
            for (const key of keys) {
                if (data.specs[key]) return data.specs[key];
            }
            return null;
        };

        const displacementText = getSpec(['engine displacement', 'engine', 'displacement']) || '0';
        const displacement = parseInt(displacementText.replace(/[^0-9]/g, '')) || 0;

        const mileageText = getSpec(['mileage', 'arai mileage', 'city mileage', 'fuel efficiency']) || '0';
        const mileage = parseFloat(mileageText.replace(/[^0-9.]/g, '')) || 0;

        const carData = {
            id: `${brand.slug}-${modelSlug}`,
            make: brand.name,
            model: modelSlug.charAt(0).toUpperCase() + modelSlug.slice(1).replace(/-/g, ' '),
            variant: "Standard",
            year: new Date().getFullYear(),
            bodyType: getSpec(['body type']) || "Hatchback",
            segment: "B",
            price: data.priceText,
            pricing: {
                exShowroom: {
                    min: priceMin || 0,
                    max: priceMax || 0,
                    currency: "INR"
                }
            },
            engine: {
                type: getSpec(['engine type', 'fuel', 'fuel type']) || "Petrol",
                power: getSpec(['max power', 'power', 'max power (bhp@rpm)']) || "TBD",
                torque: getSpec(['max torque', 'torque', 'max torque (nm@rpm)']) || "TBD",
                displacement: displacement
            },
            transmission: {
                type: getSpec(['transmission type', 'transmission', 'gear box']) || "Manual"
            },
            performance: {
                fuelEfficiency: mileage
            },
            dimensions: {
                seatingCapacity: parseInt(getSpec(['seating capacity']) || '5'),
                bootSpace: parseInt((getSpec(['boot space']) || '0').replace(/[^0-9]/g, '')),
                groundClearance: parseInt((getSpec(['ground clearance unladen', 'ground clearance']) || '0').replace(/[^0-9]/g, '')),
                fuelTankCapacity: parseInt((getSpec(['fuel tank capacity']) || '0').replace(/[^0-9]/g, ''))
            },
            features: {
                keyFeatures: Array.from(new Set(data.keyFeatures)).slice(0, 10)
            },
            images: {
                hero: localImagePath,
                exterior: [],
                interior: []
            },
            meta: {
                scrapedAt: new Date().toISOString(), // Use simple ISO string
                sourceUrl: url
            }
        };

        // Save to file
        const brandDir = path.join(OUTPUT_DIR, brand.slug);
        await ensureDirectoryExists(brandDir);

        await fsPromises.writeFile(
            path.join(brandDir, `${modelSlug}.json`),
            JSON.stringify(carData, null, 2)
        );

        console.log(`✅ Saved ${brand.name} ${modelSlug}`);

    } catch (error) {
        console.error(`❌ Failed to scrape ${brand.name} ${modelSlug}:`, error);
    } finally {
        await page.close();
    }
}

async function runScraper() {
    await ensureDirectoryExists(OUTPUT_DIR);
    await ensureDirectoryExists(IMAGES_DIR);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // Loop through ALL brands and ALL models
        for (const brand of BRANDS) {
            console.log(`\n--- Starting ${brand.name} ---`);

            for (const model of brand.models) {
                await scrapeCar(browser, brand, model);
                // Small delay included in scrapeCar function
            }
        }
    } finally {
        await browser.close();
        console.log('\n✨ Scraping session complete!');
    }
}

// Execute
runScraper().catch(console.error);
