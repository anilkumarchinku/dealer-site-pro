/**
 * Brand Hero Image Utility
 * Returns the hero image path for a given brand
 */

export function getBrandHeroImage(brandName: string): string {
    // Normalize brand name to match file naming
    const normalizedBrand = brandName.toLowerCase().replace(/\s+/g, '-');

    // Map of brand names to their hero image extensions
    const brandImageMap: Record<string, string> = {
        'ather': 'jpg',
        'ather-energy': 'jpg',
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
        'nissan': 'jpg',
        'ola': 'jpg',
        'ola-electric': 'jpg',
        'porsche': 'jpg',
        'renault': 'jpg',
        'skoda': 'jpg',
        'tata-motors': 'jpg',
        'tesla': 'jpg',
        'toyota': 'png',
        'volkswagen': 'jpg',
        'volvo': 'jpg',
    };

    const extension = brandImageMap[normalizedBrand] || 'jpg';
    return `/assets/hero/${normalizedBrand}.${extension}`;
}

// Fallback hero image if brand not found
export const DEFAULT_HERO_IMAGE = '/assets/hero/toyota.png';
