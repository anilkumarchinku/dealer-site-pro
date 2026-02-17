
const fs = require('fs');

try {
    const content = fs.readFileSync('lib/data/cars.ts', 'utf8');

    // Extract the array part
    const arrayStart = content.indexOf('[');
    const arrayEnd = content.lastIndexOf(']');

    if (arrayStart === -1 || arrayEnd === -1) {
        throw new Error("Could not find array in cars.ts");
    }

    const arrayString = content.substring(arrayStart, arrayEnd + 1);

    // Evaluate carefully (since it's JSON-like TS)
    // or try JSON.parse if it's strict JSON
    let cars = [];
    try {
        cars = JSON.parse(arrayString);
    } catch (e) {
        // If strict parse fails (e.g. trailing commas), use eval
        // This is safe here because we just generated this file ourselves
        cars = eval(arrayString);
    }

    const brands = {};

    cars.forEach(car => {
        if (!brands[car.make]) {
            brands[car.make] = new Set();
        }
        brands[car.make].add(car.model);
    });

    const sortedBrands = Object.keys(brands).sort();

    console.log(`### Verified Brands: ${sortedBrands.length}`);
    console.log(`### Total Models: ${cars.length}\n`);

    sortedBrands.forEach((brand, index) => {
        const models = Array.from(brands[brand]).sort();
        console.log(`${index + 1}. **${brand}** (${models.length})`);
        console.log(`   - ${models.join(', ')}`);
    });

} catch (e) {
    console.error("Error:", e.message);
}
