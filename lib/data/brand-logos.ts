/**
 * Brand logo mapping — maps CAR_MAKES to local logo files in /public/brands/
 * Logos sourced from Wikimedia Commons (public domain / freely licensed)
 */

export const BRAND_LOGOS: Record<string, string> = {
    'Audi': '/brands/audi.png',
    'Bentley': '/brands/bentley.png',
    'BMW': '/brands/bmw.png',
    'BYD': '/brands/byd.png',
    'Citroen': '/brands/citroen.png',
    'Force Motors': '/brands/force-motors.png',
    'Honda': '/brands/honda.png',
    'Hyundai': '/brands/hyundai.png',
    'Isuzu': '/brands/isuzu.png',
    'Jaguar': '/brands/jaguar.png',
    'Jeep': '/brands/jeep.png',
    'Kia': '/brands/kia.png',
    'Lamborghini': '/brands/lamborghini.png',
    'Land Rover': '/brands/land-rover.png',
    'Lexus': '/brands/lexus.png',
    'Mahindra': '/brands/mahindra.png',
    'Maruti Suzuki': '/brands/maruti-suzuki.png',
    'Mercedes-Benz': '/brands/mercedes-benz.png',
    'MG': '/brands/mg.png',
    'MINI': '/brands/mini.png',
    'Nissan': '/brands/nissan.png',
    'Porsche': '/brands/porsche.png',
    'Renault': '/brands/renault.png',
    'Skoda': '/brands/skoda.png',
    'Tata Motors': '/brands/tata-motors.png',
    'Toyota': '/brands/toyota.png',
    'Volkswagen': '/brands/volkswagen.png',
    'Volvo': '/brands/volvo.png',
};

/** Get logo path for a brand name (fallback to null) */
export function getBrandLogo(brand: string): string | null {
    return BRAND_LOGOS[brand] || null;
}
