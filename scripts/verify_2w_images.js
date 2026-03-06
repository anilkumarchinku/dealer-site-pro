const fs = require('fs');
const path = require('path');
const { automotiveBrands } = require('./lib/colors/automotive-brands');
const brandModels = JSON.parse(fs.readFileSync('./public/data/brand-models.json', 'utf8'));

// Need to mock the modelToSlug here since we can't easily import the ts
function modelToSlug(model) {
    return model
        .toLowerCase()
        .replace(/\./g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

// Copy the map from the TS file to test against it and find what's missing
const map2w = {
    "royal enfield": "royal-enfield",
    "hero motocorp": "hero-motocorp",
    "honda motorcycle & scooter india": "honda-hmsi",
    "honda": "honda-hmsi",
    "tvs motor company": "tvs-motor",
    "tvs": "tvs-motor",
    "bajaj auto": "bajaj-auto",
    "bajaj": "bajaj-auto",
    "yamaha india": "yamaha-india",
    "yamaha": "yamaha-india",
    "suzuki motorcycle india": "suzuki-motorcycle",
    "suzuki": "suzuki-motorcycle",
    "ktm india": "ktm-india",
    "ktm": "ktm-india",
    "kawasaki india": "kawasaki-india",
    "kawasaki": "kawasaki-india",
    "ather energy": "ather-energy",
    "ather": "ather-energy",
    "ola electric": "ola-electric"
};

function brandNameToId(brandName) {
    const lower = brandName.toLowerCase().trim();
    if (map2w[lower]) return map2w[lower];
    return lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

let missingBrands = new Set();
let missingImages = 0;
let totalChecked = 0;

['2w_ice', '2w_ev'].forEach(category => {
    Object.keys(brandModels[category]).forEach(brand => {
        const brandId = brandNameToId(brand);
        const models = brandModels[category][brand];
        
        models.forEach(model => {
            const slug = modelToSlug(model);
            const jpgPath = path.join(process.cwd(), 'public/data/brand-model-images/2w', brandId, `${slug}.jpg`);
            const pngPath = path.join(process.cwd(), 'public/data/brand-model-images/2w', brandId, `${slug}.png`);
            
            if (!fs.existsSync(jpgPath) && !fs.existsSync(pngPath)) {
                missingBrands.add(brand);
                missingImages++;
                // console.log(`Missing: ${brandId}/${slug}.jpg`);
            }
            totalChecked++;
        });
    });
});

console.log(`\nChecked ${totalChecked} 2W models.`);
console.log(`Images are missing for ${missingImages} models.`);
console.log(`Brands with missing images:`, Array.from(missingBrands));
