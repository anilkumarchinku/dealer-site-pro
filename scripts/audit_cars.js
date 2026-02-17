const fs = require('fs');

const carsFile = '/Users/anilkumarkolukulapalli/projects/cyepro/dealersite pro/dealer-site-pro/lib/data/cars.ts';

try {
    const content = fs.readFileSync(carsFile, 'utf8');

    // Simple parsing assuming standard formatting from what we saw
    // We'll look for blocks or just extract all makes and models
    // Since specific regex for full object parsing is hard, let's assume the file structure is consistent
    // "make": "Brand",
    // "model": "Name",

    const cars = [];
    const lines = content.split('\n');
    let currentMake = null;
    let currentModel = null;

    for (const line of lines) {
        const makeMatch = line.match(/"make":\s*"([^"]+)"/);
        const modelMatch = line.match(/"model":\s*"([^"]+)"/);

        if (makeMatch) {
            currentMake = makeMatch[1];
        }
        if (modelMatch) {
            currentModel = modelMatch[1];
            if (currentMake && currentModel) {
                cars.push({ make: currentMake, model: currentModel });
                // Reset for next car
                currentMake = null;
                currentModel = null;
            }
        }
    }

    // Group by Make
    const grouped = {};
    cars.forEach(car => {
        if (!grouped[car.make]) {
            grouped[car.make] = new Set();
        }
        grouped[car.make].add(car.model);
    });

    // Output
    console.log("# Current Scraped Cars List\n");
    const sortedMakes = Object.keys(grouped).sort();

    for (const make of sortedMakes) {
        const models = Array.from(grouped[make]).sort();
        console.log(`### ${make} (${models.length})`);
        models.forEach(model => console.log(`- ${model}`));
        console.log('');
    }

} catch (err) {
    console.error("Error reading file:", err);
}
