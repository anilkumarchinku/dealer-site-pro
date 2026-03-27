/**
 * Brand logo mapping — maps CAR_MAKES to local logo files in /public/assets/logos/
 * Same logos used in onboarding brand selection (clean, transparent backgrounds)
 */

export const BRAND_LOGOS: Record<string, string> = {
    'Audi': '/assets/logos/audi.png',
    'Bentley': '/assets/logos/bentley.png',
    'BMW': '/assets/logos/bmw.png',
    'BYD': '/assets/logos/byd.png',
    'Citroen': '/assets/logos/citroen.png',
    'Force Motors': '/assets/logos/force-motors.png',
    'Honda': '/assets/logos/honda.png',
    'Hyundai': '/assets/logos/hyundai.png',
    'Isuzu': '/assets/logos/isuzu.png',
    'Jaguar': '/assets/logos/jaguar.png',
    'Jeep': '/assets/logos/jeep.png',
    'Kia': '/assets/logos/kia.png',
    'Lamborghini': '/assets/logos/lamborghini.png',
    'Land Rover': '/assets/logos/land-rover.png',
    'Lexus': '/assets/logos/lexus.png',
    'Mahindra': '/assets/logos/mahindra.png',
    'Maruti Suzuki': '/assets/logos/maruti-suzuki.png',
    'Mercedes-Benz': '/assets/logos/mercedes-benz.png',
    'MG': '/assets/logos/mg.png',
    'MINI': '/assets/logos/mini.png',
    'Nissan': '/assets/logos/nissan.png',
    'Porsche': '/assets/logos/porsche.png',
    'Renault': '/assets/logos/renault.png',
    'Skoda': '/assets/logos/skoda.png',
    'Tata Motors': '/assets/logos/tata-motors.png',
    'Toyota': '/assets/logos/toyota.png',
    'Volkswagen': '/assets/logos/volkswagen.png',
    'VinFast': '/assets/logos/vinfast.png',
    'Volvo': '/assets/logos/volvo.png',
    'Ferrari': '/assets/logos/ferrari.svg',
    'Rolls-Royce': '/assets/logos/rolls-royce.svg',
    'Maserati': '/assets/logos/maserati.svg',
    'Aston Martin': '/assets/logos/aston-martin.svg',
    'Tesla': '/assets/logos/tesla.png',
};

/** Get logo path for a brand name (fallback to null) */
export function getBrandLogo(brand: string): string | null {
    return BRAND_LOGOS[brand] || null;
}
