/**
 * Car Data Analysis Script
 * Checks which cars are fetching from carInfo.json and which are missing data/images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read car-models.ts and extract CAR_MODELS array
const carModelsPath = path.join(__dirname, 'lib/data/car-models.ts');
const carModelsContent = fs.readFileSync(carModelsPath, 'utf-8');

// Extract all car entries from CAR_MODELS array
const carModelRegex = /\{[\s\S]*?id:\s*['"]([^'"]+)['"][\s\S]*?brand:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?imageUrl:\s*['"]([^'"]+)['"][\s\S]*?\}/g;
const carModels = [];
let match;

while ((match = carModelRegex.exec(carModelsContent)) !== null) {
    carModels.push({
        id: match[1],
        brand: match[2],
        name: match[3],
        imageUrl: match[4]
    });
}

console.log(`📊 Found ${carModels.length} car models in CAR_MODELS\n`);

// Read carInfo.json
const carInfoPath = path.join(__dirname, 'public/carInfo.json');
const carInfo = JSON.parse(fs.readFileSync(carInfoPath, 'utf-8'));

console.log(`📚 Loaded carInfo.json with ${Object.keys(carInfo).length} brands\n`);

// Normalize brand name for lookup
function normalizeBrand(brand) {
    return brand.toLowerCase().replace(/\s+/g, '_');
}

// Check if car info exists in carInfo.json
function findCarInfo(brand, model) {
    const brandKey = normalizeBrand(brand);
    const brandData = carInfo[brandKey];

    if (!brandData) {
        return { found: false, reason: 'brand_not_found' };
    }

    // Flatten the brand data
    let allCars = [];
    for (const key in brandData) {
        const value = brandData[key];
        if (Array.isArray(value)) {
            allCars = allCars.concat(value);
        } else if (value && typeof value === 'object' && value.model) {
            allCars.push(value);
        }
    }

    // Search for matching model
    const normalizedModel = model.toLowerCase().trim();
    const matchingCars = allCars.filter(car => {
        if (!car || !car.model) return false;
        const carModel = car.model.toLowerCase().trim();
        return carModel === normalizedModel ||
               carModel.includes(normalizedModel) ||
               normalizedModel.includes(carModel);
    });

    if (matchingCars.length === 0) {
        return {
            found: false,
            reason: 'model_not_found',
            availableModels: [...new Set(allCars.filter(c => c && c.model).map(c => c.model))]
        };
    }

    // Check for images in the matching cars
    const carsWithImages = matchingCars.filter(car =>
        car.image_urls && Array.isArray(car.image_urls) && car.image_urls.length > 0
    );

    return {
        found: true,
        variants: matchingCars.length,
        hasImages: carsWithImages.length > 0,
        imageCount: carsWithImages.length > 0 ? carsWithImages[0].image_urls.length : 0,
        sampleData: matchingCars[0]
    };
}

// Analyze each car model
const results = {
    withInfo: [],
    withInfoNoImages: [],
    noInfo: [],
    brandNotFound: []
};

console.log('🔍 Analyzing car models...\n');
console.log('='.repeat(100) + '\n');

carModels.forEach(car => {
    const info = findCarInfo(car.brand, car.name);

    if (!info.found) {
        if (info.reason === 'brand_not_found') {
            results.brandNotFound.push({
                ...car,
                reason: info.reason
            });
        } else {
            results.noInfo.push({
                ...car,
                reason: info.reason,
                availableModels: info.availableModels
            });
        }
    } else if (!info.hasImages) {
        results.withInfoNoImages.push({
            ...car,
            variants: info.variants,
            sampleData: info.sampleData
        });
    } else {
        results.withInfo.push({
            ...car,
            variants: info.variants,
            imageCount: info.imageCount
        });
    }
});

// Print detailed results
console.log('📈 SUMMARY\n');
console.log('='.repeat(100));
console.log(`✅ Cars WITH info from carInfo.json: ${results.withInfo.length}`);
console.log(`⚠️  Cars WITH info but NO images: ${results.withInfoNoImages.length}`);
console.log(`❌ Cars WITHOUT info: ${results.noInfo.length}`);
console.log(`🚫 Cars with brand not found: ${results.brandNotFound.length}`);
console.log('='.repeat(100) + '\n');

// Cars with info but no images
if (results.withInfoNoImages.length > 0) {
    console.log('\n⚠️  CARS WITH INFO BUT NO IMAGES:\n');
    console.log('='.repeat(100));
    results.withInfoNoImages.forEach((car, idx) => {
        console.log(`${idx + 1}. ${car.brand} ${car.name}`);
        console.log(`   ID: ${car.id}`);
        console.log(`   Variants found: ${car.variants}`);
        console.log(`   Current image: ${car.imageUrl}`);
        console.log('');
    });
}

// Cars without info
if (results.noInfo.length > 0) {
    console.log('\n❌ CARS WITHOUT INFO IN carInfo.json:\n');
    console.log('='.repeat(100));
    results.noInfo.forEach((car, idx) => {
        console.log(`${idx + 1}. ${car.brand} ${car.name}`);
        console.log(`   ID: ${car.id}`);
        console.log(`   Reason: ${car.reason}`);
        if (car.availableModels && car.availableModels.length > 0) {
            console.log(`   Available models for ${car.brand}: ${car.availableModels.slice(0, 10).join(', ')}${car.availableModels.length > 10 ? '...' : ''}`);
        }
        console.log('');
    });
}

// Cars with brand not found
if (results.brandNotFound.length > 0) {
    console.log('\n🚫 CARS WITH BRAND NOT FOUND IN carInfo.json:\n');
    console.log('='.repeat(100));
    results.brandNotFound.forEach((car, idx) => {
        console.log(`${idx + 1}. ${car.brand} ${car.name}`);
        console.log(`   ID: ${car.id}`);
        console.log(`   Brand key would be: ${normalizeBrand(car.brand)}`);
        console.log('');
    });
    console.log(`\nAvailable brands in carInfo.json: ${Object.keys(carInfo).join(', ')}\n`);
}

// Cars with info and images (success cases)
if (results.withInfo.length > 0) {
    console.log('\n✅ CARS WITH INFO AND IMAGES (Success):\n');
    console.log('='.repeat(100));
    results.withInfo.forEach((car, idx) => {
        console.log(`${idx + 1}. ${car.brand} ${car.name} - ${car.variants} variant(s), ${car.imageCount} image(s)`);
    });
    console.log('');
}

// Save results to JSON
const outputPath = path.join(__dirname, 'car-data-analysis-results.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`\n💾 Full results saved to: ${outputPath}\n`);
