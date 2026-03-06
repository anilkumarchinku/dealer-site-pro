const fs = require('fs');
const path = require('path');

const IMAGES_BASE = path.join(__dirname, '..', 'public', 'data', 'brand-model-images');

// We will keep these "trusted" major brands where Bing image search is usually 95%+ accurate.
// Any brand NOT on this list will have its scraped images deleted so they fall back to "No Image"
// and the dealer is forced to upload a real picture of the obscure bike.
const TRUSTED_BRANDS = [
    // 2W
    'royal-enfield',
    'hero-motocorp',
    'honda-hmsi',
    'tvs-motor',
    'bajaj-auto',
    'yamaha-india',
    'suzuki-motorcycle',
    'ktm-india',
    'kawasaki-india',
    'ather-energy',
    'ola-electric',
    'vespa-india',
    'aprilia-india',
    'triumph-india',
    'harley-davidson-india',
    'bmw-motorrad-india',
    'ducati-india',
    'husqvarna-india',
    'jawa-motorcycles',
    'yezdi-motorcycles',
    'hero-electric',

    // 3W
    'mahindra-3w',
    'bajaj-auto-3w',
    'tvs-king',
    'piaggio-ape'
];

async function cleanupObscureImages() {
    let deletedCount = 0;

    // Check both 2w and 3w folders
    const categories = ['2w', '3w'];

    for (const category of categories) {
        const categoryPath = path.join(IMAGES_BASE, category);
        if (!fs.existsSync(categoryPath)) continue;

        const brandFolders = fs.readdirSync(categoryPath);

        for (const brandId of brandFolders) {
            if (brandId.startsWith('.')) continue; // ignore hidden files

            // If the brand is NOT in our trusted major brands list
            if (!TRUSTED_BRANDS.includes(brandId)) {
                const brandPath = path.join(categoryPath, brandId);
                const files = fs.readdirSync(brandPath);

                // Delete all images in this folder
                for (const file of files) {
                    if (file.endsWith('.jpg') || file.endsWith('.png')) {
                        fs.unlinkSync(path.join(brandPath, file));
                        deletedCount++;
                        console.log(`Deleted hallucinated image: ${category}/${brandId}/${file}`);
                    }
                }

                // Remove the empty folder
                if (fs.readdirSync(brandPath).length === 0) {
                    fs.rmdirSync(brandPath);
                    console.log(`Removed empty brand folder: ${brandId}`);
                }
            }
        }
    }

    console.log(`\nCleanup complete! Deleted ${deletedCount} bad images from obscure brands.`);
}

cleanupObscureImages();
