const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'public/data/brand-models.json');
const imagesBase = path.join(process.cwd(), 'public/data/brand-model-images');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// From brand-model-images.ts mapping
const BRAND_FOLDER_MAP_2W = {
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
    "ola electric": "ola-electric",
};

const BRAND_FOLDER_MAP_3W = {
    "mahindra": "mahindra-3w",
    "bajaj": "bajaj-auto-3w",
    "bajaj auto": "bajaj-auto-3w",
    "tvs": "tvs-king",
    "tvs motor company": "tvs-king",
    "piaggio": "piaggio-ape",
    "greaves": "greaves-electric-3w",
    "greaves electric": "greaves-electric-3w",
    "kinetic": "kinetic-green",
    "kinetic green": "kinetic-green",
    "euler": "euler-motors",
    "euler motors": "euler-motors",
    "atul": "atul-auto",
    "atul auto": "atul-auto",
    "lohia": "lohia-auto",
    "lohia auto": "lohia-auto",
};

function brandNameToId(brandName, category = "2w") {
    const lower = brandName.toLowerCase().trim();
    const map = category === "3w" ? BRAND_FOLDER_MAP_3W : BRAND_FOLDER_MAP_2W;

    if (map[lower]) return map[lower];

    return lower
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function modelToSlug(model) {
    return model
        .toLowerCase()
        .replace(/\./g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

let total = 0;
let missing = 0;
const missingList = [];

function checkCategory(categoryData, vehicleType) {
    if (!categoryData) return;

    for (const [subcat, brands] of Object.entries(categoryData)) {
        for (const brandGroup of brands) {
            const rawBrandId = brandGroup.brandId || brandGroup.brand;
            const modelsObj = brandGroup.models;

            const brandId = brandNameToId(rawBrandId || brandGroup.brand, vehicleType);

            if (Array.isArray(modelsObj)) {
                modelsObj.forEach(model => checkModel(vehicleType, brandId, model));
            } else {
                for (const [type, models] of Object.entries(modelsObj)) {
                    models.forEach(model => checkModel(vehicleType, brandId, model));
                }
            }
        }
    }
}

function checkModel(vehicleType, brandId, model) {
    total++;
    const slug = modelToSlug(model);
    const jpgPath = path.join(imagesBase, vehicleType, brandId, `${slug}.jpg`);
    const pngPath = path.join(imagesBase, vehicleType, brandId, `${slug}.png`);

    if (!fs.existsSync(jpgPath) && !fs.existsSync(pngPath)) {
        missing++;
        missingList.push({ type: vehicleType, brand: brandId, model: model, slug: slug });
    }
}

checkCategory(data.twoWheelers, '2w');
checkCategory(data.threeWheelers, '3w');

console.log(`\n================================`);
console.log(`Total Models: ${total}`);
console.log(`Missing Images: ${missing}`);
console.log(`================================\n`);

fs.writeFileSync(path.join(process.cwd(), 'scripts', 'missing_images.json'), JSON.stringify(missingList, null, 2));
console.log('Saved scripts/missing_images.json');
