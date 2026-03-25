/**
 * Brand Hero Image Utility
 * Returns the hero image path for a given brand
 */

// Aliases: long/variant brand names → the hero image slug (4W only)
const BRAND_ALIASES_4W: Record<string, string> = {
    'bmw-motorrad-india': 'bmw',  // fallback only if no 2W hero exists
};

// 2W brands that have their own dedicated hero images in /assets/hero/
const HERO_2W: Record<string, string> = {
    'ather': 'jpg',
    'ola': 'jpg',
};

// 4W hero images in /assets/hero/
const HERO_4W: Record<string, string> = {
    'audi': 'jpg',
    'bentley': 'jpg',
    'bmw': 'png',
    'byd': 'webp',
    'citroen': 'jpg',
    'force-motors': 'png',
    'honda': 'jpg',
    'hyundai': 'png',
    'isuzu': 'jpg',
    'jaguar': 'jpg',
    'jeep': 'jpg',
    'kia': 'jpg',
    'lamborghini': 'jpg',
    'land-rover': 'jpg',
    'lexus': 'png',
    'mahindra': 'jpg',
    'maruti-suzuki': 'jpg',
    'mercedes-benz': 'jpg',
    'mg': 'jpg',
    'mini': 'jpg',
    'nissan': 'jpg',
    'porsche': 'jpg',
    'renault': 'webp',
    'skoda': 'jpg',
    'tata-motors': 'jpg',
    'tesla': 'jpg',
    'toyota': 'jpg',
    'vinfast': 'jpg',
    'volkswagen': 'jpg',
    'volvo': 'jpg',
};

export function getBrandHeroImage(brandName: string, vehicleType?: '2w' | '3w' | '4w'): string {
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');

    // For 2W/3W brands: use a dedicated hero if available, else use a scraped model image
    if (vehicleType === '2w' || vehicleType === '3w') {
        // Check for dedicated 2W hero image first
        const alias2w = slug.replace(/-energy$/, '').replace(/-electric$/, '');
        if (HERO_2W[alias2w]) {
            return `/assets/hero/${alias2w}.${HERO_2W[alias2w]}`;
        }
        // No dedicated hero — return empty so the template can use its own fallback
        // (e.g. scraped brand image or gradient-only hero)
        return '';
    }

    // 4W: resolve aliases and look up hero image
    const resolved = BRAND_ALIASES_4W[slug] ?? slug;
    if (HERO_4W[resolved]) {
        return `/assets/hero/${resolved}.${HERO_4W[resolved]}`;
    }
    return DEFAULT_HERO_IMAGE;
}

// Fallback hero image if brand not found (4W only)
export const DEFAULT_HERO_IMAGE = '/assets/hero/toyota.jpg';
