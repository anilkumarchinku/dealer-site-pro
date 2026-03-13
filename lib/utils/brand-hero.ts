/**
 * Brand Hero Image Utility
 * Returns the hero image path for a given brand
 */

// Aliases: long/variant brand names → the hero image slug
const BRAND_ALIASES: Record<string, string> = {
    'ather-energy': 'ather',
    'ola-electric': 'ola',
    'bmw-motorrad-india': 'bmw',
    'honda-motorcycle-&-scooter-india': 'honda',
    'honda-hmsi': 'honda',
};

export function getBrandHeroImage(brandName: string): string {
    // Normalize brand name to match file naming
    let normalizedBrand = brandName.toLowerCase().replace(/\s+/g, '-');
    // Resolve aliases (e.g. "ather-energy" → "ather")
    normalizedBrand = BRAND_ALIASES[normalizedBrand] ?? normalizedBrand;

    // Map of brand names to their hero image extensions
    const brandImageMap: Record<string, string> = {
        // 4W brands
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
        // 2W brands — keys must match the actual filename in /assets/hero/
        'ather': 'jpg',
        'ola': 'jpg',
    };

    // If brand not in the map, return the default hero rather than a broken path
    if (!brandImageMap[normalizedBrand]) {
        return DEFAULT_HERO_IMAGE;
    }
    return `/assets/hero/${normalizedBrand}.${brandImageMap[normalizedBrand]}`;
}

// Fallback hero image if brand not found
export const DEFAULT_HERO_IMAGE = '/assets/hero/toyota.jpg';
