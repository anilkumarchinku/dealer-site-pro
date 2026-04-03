/**
 * rescrape_2w_prices.js
 * Re-scrapes BikeWale for all 2W brands that have missing prices/specs.
 * Writes enriched data back into public/data/2w/{brandId}.json
 * 
 * Run: node scripts/rescrape_2w_prices.js
 * Or:  node scripts/rescrape_2w_prices.js honda tvs bajaj   (specific brands only)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/data/2w');
const DELAY_MS = 800; // polite delay between requests
const CONCURRENCY = 3; // parallel model page scrapes per brand

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function fetchURL(url, retries = 3) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const req = protocol.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'identity',
            },
            timeout: 20000,
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchURL(res.headers.location, retries).then(resolve).catch(reject);
            }
            if (res.statusCode === 429 || res.statusCode === 503) {
                if (retries > 0) {
                    return new Promise(r => setTimeout(r, 3000)).then(() => fetchURL(url, retries - 1)).then(resolve).catch(reject);
                }
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            const chunks = [];
            res.on('data', d => chunks.push(d));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
            res.on('error', reject);
        });
        req.on('error', err => {
            if (retries > 0) {
                setTimeout(() => fetchURL(url, retries - 1).then(resolve).catch(reject), 2000);
            } else {
                reject(err);
            }
        });
        req.on('timeout', () => {
            req.destroy();
            if (retries > 0) {
                setTimeout(() => fetchURL(url, retries - 1).then(resolve).catch(reject), 2000);
            } else {
                reject(new Error('Timeout'));
            }
        });
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function getInitialState(html) {
    // Try multiple patterns BikeWale uses
    const patterns = [
        /window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]*?\});\s*(?:window|<\/script>)/,
        /window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]*?\});/,
    ];
    for (const pat of patterns) {
        const match = pat.exec(html);
        if (match) {
            try { return JSON.parse(match[1]); } catch(e) { /* try next */ }
        }
    }
    return null;
}

async function mapConcurrent(items, limit, fn) {
    const results = [];
    let executing = [];
    for (const item of items) {
        const p = fn(item).then(r => { executing.splice(executing.indexOf(p), 1); return r; });
        executing.push(p);
        results.push(p);
        if (executing.length >= limit) await Promise.race(executing);
    }
    return Promise.all(results);
}

// ── Price parser ──────────────────────────────────────────────────────────────

function cleanPrice(raw) {
    if (!raw) return 'N/A';
    const s = String(raw).trim();
    // Already looks like ₹X,XX,XXX
    if (/^₹[\d,]+$/.test(s)) return s;
    // Remove currency symbols and commas
    const num = s.replace(/[₹,\s]/g, '').replace(/Rs\.?/gi, '').trim();
    if (/^\d+$/.test(num) && num.length >= 4) {
        return `₹${parseInt(num).toLocaleString('en-IN')}`;
    }
    return s || 'N/A';
}

function formatSpec(val, suffix = '') {
    if (!val || val === 'N/A' || val === 'NA' || val === '-') return null;
    const s = String(val).trim();
    if (!s || s === 'N/A') return null;
    // Already has unit
    if (suffix && s.toLowerCase().includes(suffix.toLowerCase())) return s;
    return suffix ? `${s} ${suffix}` : s;
}

// ── Model page scraper ────────────────────────────────────────────────────────

async function scrapeModelPage(makeMasking, modelMasking, brandName) {
    try {
        await sleep(DELAY_MS);
        const url = `https://www.bikewale.com/${makeMasking}-bikes/${modelMasking}/`;
        const html = await fetchURL(url);
        const state = getInitialState(html);
        if (!state || !state.modelPage) return null;

        const page = state.modelPage;
        const overview = page.overviewData || {};
        const specs = page.basicSpecs || [];

        // Helper to find spec value by partial key match
        const getSpec = (...keys) => {
            for (const key of keys) {
                const found = specs.find(s => String(s.itemName || s.name || '').toLowerCase().includes(key.toLowerCase()));
                if (found) return found.value || found.itemValue || null;
            }
            return null;
        };

        const make = page.make?.makeName || brandName;
        const modelName = page.model?.modelName || page.modelName || '';

        // Variants from versions array
        const variants = (page.versions || []).map(v => {
            const price = v.priceDetails?.price || v.price || v.priceOverview?.price || null;
            return {
                name: v.versionName || v.name || '',
                price: cleanPrice(price),
            };
        }).filter(v => v.name);

        // Also check for price from overviewData if single variant
        const overviewPrice = overview.priceDetails?.price || overview.price || null;

        // Engine specs
        const engineCC = formatSpec(overview.displacement || getSpec('displacement', 'engine cc', 'engine capacity'), 'cc');
        const mileage = formatSpec(overview.mileage || getSpec('mileage', 'fuel efficiency'), 'kmpl');
        const maxPower = formatSpec(overview.maxPower || getSpec('max power', 'power'), 'bhp');
        const maxTorque = formatSpec(overview.maxTorque || getSpec('torque', 'max torque'), 'Nm');
        const topSpeed = formatSpec(overview.topSpeed || getSpec('top speed'), 'kmph');
        const fuelType = overview.fuelType || getSpec('fuel type') || 'Petrol';

        // Colors
        const colors = (page.colors || []).map(c => c.colorName || c.name || c).filter(Boolean);

        // Features
        const features = [];
        if (page.features) {
            for (const cat of page.features) {
                for (const item of (cat.featureItems || [])) {
                    if (item.itemValue === 'Yes' || item.value === 'Yes') {
                        features.push(item.itemName || item.name || '');
                    }
                }
            }
        }

        // Description from content summaries
        let description = null;
        if (Array.isArray(page.contentStrategySummaries) && page.contentStrategySummaries[0]?.content) {
            description = String(page.contentStrategySummaries[0].content).replace(/<[^>]+>/gm, '').trim();
        } else if (page.modelSummary) {
            description = page.modelSummary;
        }

        // Technical specs object
        const technical_specifications = {};
        for (const s of specs) {
            const key = String(s.itemName || s.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_');
            if (key) technical_specifications[key] = s.value || s.itemValue || '';
        }

        return {
            make,
            model: modelName,
            variant_name: page.defaultVersionName || variants[0]?.name || modelName,
            price: variants.length > 0 && variants[0].price !== 'N/A' 
                ? variants[0].price 
                : cleanPrice(overviewPrice),
            engine_displacement: engineCC || 'N/A',
            mileage: mileage || 'N/A',
            max_power: maxPower || 'N/A',
            max_torque: maxTorque || 'N/A',
            top_speed: topSpeed || 'N/A',
            fuel_type: fuelType,
            source_section: page.model?.status === 2 ? 'Discontinued' : 'Available',
            description,
            features: features.filter(Boolean),
            variants,
            colors,
            technical_specifications,
        };

    } catch (e) {
        return null;
    }
}

// ── Brand scraper ─────────────────────────────────────────────────────────────

async function scrapeBrand(brandId) {
    const filePath = path.join(DATA_DIR, `${brandId}.json`);
    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️  File not found: ${brandId}.json`);
        return;
    }

    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const brandName = existing.brand || brandId;

    // Get the BikeWale make masking name by fetching the brand listing page
    // First try to get it from existing data models
    let makeMasking = brandId.replace(/-india$/, '').replace(/-motorcycle$/, '').replace(/-hmsi$/, '');

    // Try common masking name mapping
    const maskingMap = {
        'honda': 'honda',
        'tvs-motor': 'tvs',
        'bajaj-auto': 'bajaj',
        'hero-motocorp': 'hero-motocorp',
        'yamaha-india': 'yamaha',
        'suzuki-motorcycle': 'suzuki',
        'ktm-india': 'ktm',
        'ather-energy': 'ather',
        'ola-electric': 'ola-electric',
        'royal-enfield': 'royal-enfield',
        'kawasaki-india': 'kawasaki',
        'triumph-india': 'triumph',
        'ducati-india': 'ducati',
        'bmw-motorrad-india': 'bmw',
        'harley-davidson-india': 'harley-davidson',
        'benelli-india': 'benelli',
        'cfmoto-india': 'cfmoto',
        'husqvarna-india': 'husqvarna',
        'ktm-india': 'ktm',
        'jawa-motorcycles': 'jawa',
        'yezdi-motorcycles': 'yezdi',
        'revolt-motors': 'revolt',
        'aprilia-india': 'aprilia',
        'vespa-india': 'vespa',
        'bajaj-chetak-ev': 'bajaj',
        'tvs-iqube': 'tvs',
        'ampere-greaves': 'ampere',
        'okinawa-autotech': 'okinawa',
        'hero-electric': 'hero-electric',
        'keeway-india': 'keeway',
        'indian-motorcycle': 'indian',
        'moto-guzzi': 'moto-guzzi',
        'zontes-india': 'zontes',
        'ultraviolette': 'ultraviolette',
        'simple-energy': 'simple-energy',
        'bounce-infinity': 'bounce',
        'tork-motors': 'tork',
        'matter-ev': 'matter',
        'river-ev': 'river',
        'oben-electric': 'oben',
        'joy-e-bike': 'joy-e-bike',
        'kabira-mobility': 'kabira',
        'ivoomi-energy': 'ivoomi',
        'bgauss': 'bgauss',
        'lectrix-ev': 'lectrix',
        'pure-ev': 'pure-ev',
        'quantum-energy': 'quantum-energy',
        'odysse-electric': 'odysse',
        'okaya-ev': 'okaya',
        'hop-electric': 'hop',
        'vida-hero': 'vida',
        'komaki': 'komaki',
        'kinetic': 'kinetic-green',
        'bsa': 'bsa',
        'norton-motorcycles': 'norton',
        'raptee': 'raptee',
        'mahindra-two-wheelers': 'mahindra-2-wheelers',
        'brixton-motorcycles': 'brixton',
        'vlf': 'vlf-motorcycles',
    };

    makeMasking = maskingMap[brandId] || makeMasking;

    console.log(`\n🔄 Scraping ${brandName} (${brandId}) → bikewale.com/${makeMasking}-bikes/`);

    // Fetch brand page to get all model masking names
    let models = [];
    try {
        const html = await fetchURL(`https://www.bikewale.com/${makeMasking}-bikes/`);
        const state = getInitialState(html);
        if (!state || !state.makePage) {
            console.log(`  ⚠️  No INITIAL_STATE for ${brandId}`);
            return;
        }
        const allModels = [
            ...(state.makePage.models || []),
            ...(state.makePage.discontinuedModels || []),
        ];
        models = allModels.filter(m => m.makeMaskingName && m.modelMaskingName);
        console.log(`  Found ${models.length} models on BikeWale`);
    } catch (e) {
        console.log(`  ❌ Failed to fetch brand page: ${e.message}`);
        return;
    }

    if (models.length === 0) {
        console.log(`  ⚠️  No models found for ${brandId}`);
        return;
    }

    // Scrape each model page concurrently (with limit)
    const scraped = await mapConcurrent(models, CONCURRENCY, async (m) => {
        const result = await scrapeModelPage(m.makeMaskingName, m.modelMaskingName, brandName);
        if (result && result.model) {
            const variantCount = result.variants.length;
            const hasPrice = result.price && result.price !== 'N/A';
            console.log(`  ✓ ${result.model} — ${variantCount} variants, price: ${hasPrice ? result.price : 'N/A'}`);
        }
        return result;
    });

    const validScraped = scraped.filter(Boolean).filter(v => v.model);

    if (validScraped.length === 0) {
        console.log(`  ⚠️  No valid results scraped for ${brandId}`);
        return;
    }

    // Merge with existing data — scraped data wins on price/specs, keep existing if scrape missed
    const existingByModel = {};
    for (const v of (existing.vehicles || [])) {
        const key = (v.model || '').toLowerCase().trim();
        if (key) existingByModel[key] = v;
    }

    // Build merged vehicle list
    const merged = [];
    const scrapedModels = new Set();

    for (const sv of validScraped) {
        const key = sv.model.toLowerCase().trim();
        scrapedModels.add(key);
        const old = existingByModel[key] || {};
        merged.push({
            make: sv.make || old.make || brandName,
            model: sv.model,
            variant_name: sv.variant_name || old.variant_name || sv.model,
            price: sv.price !== 'N/A' ? sv.price : (old.price !== 'N/A' ? old.price : 'N/A'),
            engine_displacement: sv.engine_displacement !== 'N/A' ? sv.engine_displacement : (old.engine_displacement || 'N/A'),
            mileage: sv.mileage !== 'N/A' ? sv.mileage : (old.mileage || 'N/A'),
            max_power: sv.max_power !== 'N/A' ? sv.max_power : (old.max_power || 'N/A'),
            max_torque: sv.max_torque !== 'N/A' ? sv.max_torque : (old.max_torque || 'N/A'),
            top_speed: sv.top_speed !== 'N/A' ? sv.top_speed : (old.top_speed || 'N/A'),
            fuel_type: sv.fuel_type || old.fuel_type || 'Petrol',
            source_section: sv.source_section || old.source_section || 'Available',
            description: sv.description || old.description || null,
            features: sv.features.length > 0 ? sv.features : (old.features || []),
            variants: sv.variants.length > 0 ? sv.variants : (old.variants || []),
            colors: sv.colors.length > 0 ? sv.colors : (old.colors || []),
            technical_specifications: Object.keys(sv.technical_specifications).length > 0 
                ? sv.technical_specifications 
                : (old.technical_specifications || {}),
        });
    }

    // Save back
    const output = {
        brand: brandName,
        brandId,
        type: '2w',
        lastUpdated: new Date().toISOString().split('T')[0],
        source: 'BikeWale',
        vehicles: merged,
    };

    fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
    const withPrice = merged.filter(v => v.price && v.price !== 'N/A').length;
    console.log(`  ✅ Saved ${merged.length} models (${withPrice} with price) → ${brandId}.json`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    // Priority brands (biggest market share first)
    const priorityBrands = [
        'honda', 'tvs-motor', 'bajaj-auto', 'hero-motocorp',
        'yamaha-india', 'suzuki-motorcycle', 'ktm-india',
        'ather-energy', 'ola-electric', 'royal-enfield',  // royal-enfield already good but has duplicate
        'kawasaki-india', 'triumph-india', 'ducati-india',
        'bmw-motorrad-india', 'harley-davidson-india', 'jawa-motorcycles',
        'yezdi-motorcycles', 'benelli-india', 'cfmoto-india',
        'husqvarna-india', 'aprilia-india', 'vespa-india',
        'revolt-motors', 'tvs-iqube', 'bajaj-chetak-ev',
        'hero-electric', 'ampere-greaves', 'okinawa-autotech',
        'simple-energy', 'ultraviolette', 'tork-motors',
        'matter-ev', 'river-ev', 'oben-electric',
        'joy-e-bike', 'kabira-mobility', 'ivoomi-energy',
        'bgauss', 'lectrix-ev', 'pure-ev',
        'quantum-energy', 'odysse-electric', 'okaya-ev',
        'hop-electric', 'vida-hero', 'kinetic',
        'bounce-infinity', 'raptee', 'zontes-india',
        'norton-motorcycles', 'bsa', 'keeway-india',
        'indian-motorcycle', 'moto-guzzi', 'komaki',
        'quantum-energy', 'numeros', 'evolet', 'gemopai',
        'ferrato', 'vlf', 'motomorini',
    ];

    // Allow filtering: node rescrape_2w_prices.js honda tvs
    const args = process.argv.slice(2);
    const brandsToScrape = args.length > 0 
        ? args 
        : priorityBrands;

    console.log(`\n🏍️  2W Price Re-Scraper`);
    console.log(`📦 Brands to process: ${brandsToScrape.length}`);
    console.log(`⏱️  Estimated time: ~${Math.ceil(brandsToScrape.length * 30 / 60)} minutes\n`);

    let success = 0, failed = 0;

    for (const brandId of brandsToScrape) {
        try {
            await scrapeBrand(brandId);
            success++;
        } catch (e) {
            console.log(`❌ ${brandId}: ${e.message}`);
            failed++;
        }
        await sleep(500); // brief pause between brands
    }

    console.log(`\n✅ Done! ${success} brands updated, ${failed} failed.`);
}

main().catch(console.error);
