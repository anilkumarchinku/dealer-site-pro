const https = require('https');
const fs = require('fs');

const fetchURL = (url) => new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return fetchURL(res.headers.location).then(resolve).catch(reject);
        }
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => resolve(body));
        res.on('error', reject);
    }).on('error', reject);
});

function getInitialState(html) {
    const match = /window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]*?\});/i.exec(html);
    if (match && match[1]) { try { return JSON.parse(match[1]); } catch(e) {} }
    return null;
}

// Concurrency pool helper
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

async function scrapeBrand(brandName, makeMasking) {
    console.log(`Starting ${brandName}...`);
    const mainHtml = await fetchURL(`https://www.bikewale.com/${makeMasking}-bikes/`);
    const state = getInitialState(mainHtml);
    if (!state || !state.makePage || !state.makePage.models) return;

    const models = [...state.makePage.models, ...(state.makePage.discontinuedModels || [])];
    
    const results = await mapConcurrent(models, 10, async (m) => {
        if (!m.makeMaskingName || !m.modelMaskingName) return null;
        try {
            const html = await fetchURL(`https://www.bikewale.com/${m.makeMaskingName}-bikes/${m.modelMaskingName}/`);
            const mState = getInitialState(html);
            if (!mState || !mState.modelPage) return null;

            const page = mState.modelPage;
            const overview = page.overviewData || {};
            
            // Fix: Fallback to `m` which is correct from the main listing
            const make = m.makeName || brandName;
            const modelName = m.modelName || page.defaultVersionName || "Unknown Model";
            
            const getVal = (arr, str) => (arr || []).find(s => String(s.itemName).includes(str))?.value;
            
            const vehicle = {
                make: make,
                model: modelName,
                variant_name: page.defaultVersionName || modelName,
                price: overview.priceDetails?.price || m.price || "N/A",
                engine_displacement: overview.displacement || (getVal(m.basicSpecs, 'Displacement') || 'N/A') + ' cc',
                mileage: overview.mileage || (getVal(m.basicSpecs, 'Mileage') || 'N/A') + ' kmpl',
                max_power: overview.maxPower || (getVal(m.basicSpecs, 'Power') || 'N/A') + ' bhp',
                max_torque: overview.maxTorque || "N/A",
                top_speed: overview.topSpeed || (getVal(m.specsSummary, 'Top Speed') || 'N/A') + ' kmph',
                fuel_type: overview.fuelType || "Petrol",
                source_section: m.status === 2 ? "Discontinued" : "Available",
                description: typeof page.contentStrategySummaries?.[0]?.content === 'string' 
                            ? page.contentStrategySummaries[0].content.replace(/<[^>]*>?/gm, '') 
                            : (page.modelSummary || `The ${make} ${modelName} is a two-wheeler available in India.`),
                features: [],
                variants: (page.versions || []).map(v => ({ name: v.versionName, price: v.priceDetails?.price || "N/A" })),
                colors: (page.colors || []).map(c => c.colorName),
                technical_specifications: {}
            };
            
            (page.basicSpecs || []).forEach(s => {
                vehicle.technical_specifications[String(s.itemName).toLowerCase().replace(/ /g, '_')] = s.value;
            });
            
            return vehicle;
        } catch (e) {
            return null;
        }
    });

    const validResults = results.filter(Boolean);
    
    const existingFiles = fs.readdirSync('public/data/2w').filter(f => f.endsWith('.json'));
    let filename = `${makeMasking}.json`;
    for (const f of existingFiles) {
        const base = f.replace('.json', '');
        if (base === makeMasking || base.includes(makeMasking) || makeMasking.includes(base)) {
            filename = f; break;
        }
    }

    const finalJSON = {
        brand: brandName,
        brandId: filename.replace('.json', ''),
        type: "2w",
        lastUpdated: new Date().toISOString().split('T')[0],
        source: "BikeWale",
        vehicles: validResults
    };

    fs.writeFileSync(`public/data/2w/${filename}`, JSON.stringify(finalJSON, null, 2));
    console.log(`✅ Saved ${validResults.length} vehicles to ${filename}`);
}

async function run() {
    const mainHtml = await fetchURL(`https://www.bikewale.com/`);
    const state = getInitialState(mainHtml);
    // If bikewale.com doesn't have it, fetch a known page
    const knownHtml = await fetchURL(`https://www.bikewale.com/tvs-bikes/`);
    const knownState = getInitialState(knownHtml);
    const makes = knownState.makePage.allMakes;
    
    // Concurrent scrapers for brands
    await mapConcurrent(makes, 3, async (make) => {
        await scrapeBrand(make.makeName, make.maskingName);
    });
}
run();
