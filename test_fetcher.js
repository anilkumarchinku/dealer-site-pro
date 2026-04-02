const fs = require('fs');

async function test() {
    const make = "TVS";
    const model = "Jupiter 110";
    
    // Simulate brandNameToId
    const brandId = make.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    console.log("brandId:", brandId);
    
    const filePath = `./public/data/2w/${brandId}.json`;
    console.log("Reading", filePath);
    
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const normalizedSearchModel = model.toLowerCase().trim();
        const matchingVehicle = data.vehicles.find((vh) => {
            const m = (vh.model || '').toLowerCase().trim();
            return m === normalizedSearchModel || m.includes(normalizedSearchModel) || normalizedSearchModel.includes(m);
        });
        
        console.log("Matching Vehicle found:", !!matchingVehicle);
        if (matchingVehicle) {
            console.log("Model matched:", matchingVehicle.model);
            console.log("Is variants array?:", Array.isArray(matchingVehicle.variants));
            console.log("Variants length:", matchingVehicle.variants ? matchingVehicle.variants.length : 0);
        } else {
            console.log("All models:", data.vehicles.map(v => v.model).slice(0, 10));
        }
    } else {
        console.log("File not found");
    }
}
test();
