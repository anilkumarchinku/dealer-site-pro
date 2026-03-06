const fs = require('fs');
const filepath = '/Users/anilkumarkolukulapalli/projects/cyepro/dealersite pro/dealer-site-pro/lib/colors/automotive-brands.ts';
let content = fs.readFileSync(filepath, 'utf8');

const ALL_NEW_BRANDS = [
    "Hero MotoCorp", "Honda Motorcycle & Scooter India", "TVS Motor Company",
    "Bajaj Auto", "Royal Enfield", "Yamaha India", "Suzuki Motorcycle India",
    "KTM India", "Husqvarna India", "Jawa Motorcycles", "Yezdi Motorcycles",
    "Benelli India", "Kawasaki India", "Aprilia India", "Vespa India",
    "Harley-Davidson India", "Triumph India", "Ducati India", "BMW Motorrad India",
    "Indian Motorcycle", "Moto Guzzi", "CFMoto India", "Keeway India",
    "Zontes India", "Mahindra Two Wheelers", "Ola Electric", "Ather Energy",
    "Bajaj Chetak", "TVS iQube", "Hero Electric", "Vida (Hero MotoCorp)",
    "Revolt Motors", "Okinawa Autotech", "Ampere (Greaves Electric)", "Tork Motors",
    "Ultraviolette Automotive", "Simple Energy", "Kabira Mobility", "Pure EV",
    "Matter", "Hop Electric", "Okaya EV (OPG Mobility)", "Oben Electric",
    "Lectrix EV", "River", "Odysse Electric", "Joy e-bike", "Komaki",
    "Bounce Infinity", "Quantum Energy", "Yulu", "Bajaj Auto (3W)",
    "Piaggio Ape", "TVS King", "Mahindra (3W)", "Atul Auto",
    "Kinetic Green", "Lohia Auto", "Euler Motors", "Greaves Electric Mobility",
    "Force Motors"
];

let additions = '';

for (const b of ALL_NEW_BRANDS) {
    if (!content.includes("'" + b + "':") && !content.includes('"' + b + '":')) {
        additions += "        '" + b + "': { primary: '#2563EB', secondary: '#000000', background: '#FFFFFF', accent: '#666666', category: 'Other' },\n";
    }
}

if (additions.length > 0) {
    if (content.includes("export const automotiveBrands = {")) {
        content = content.replace("export const automotiveBrands = {", "export const automotiveBrands = {\n" + additions);
    } else if (content.includes("export const automotiveBrands: Record<string, BrandConfig> = {")) {
        content = content.replace("export const automotiveBrands: Record<string, BrandConfig> = {", "export const automotiveBrands: Record<string, BrandConfig> = {\n" + additions);
    }
    fs.writeFileSync(filepath, content);
    console.log('Injected fallback styling for ' + ALL_NEW_BRANDS.length + ' brands');
} else {
    console.log('No new brands needed to be injected into automotiveBrands');
}
