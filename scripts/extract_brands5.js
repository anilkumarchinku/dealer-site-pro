const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/brand-models.json', 'utf8'));

const twICE = new Set();
const twEV = new Set();

if (data.twoWheelers) {
    for (const [key, brandsArray] of Object.entries(data.twoWheelers)) {
        if (!Array.isArray(brandsArray)) continue;

        brandsArray.forEach(brandObj => {
            const name = brandObj.brand || brandObj.brandId;
            if (name) {
                if (key === 'electric') {
                    twEV.add(name);
                } else {
                    twICE.add(name);
                }
            }
        });
    }
}

console.log("ICE Brands:", JSON.stringify(Array.from(twICE)));
console.log("EV Brands:", JSON.stringify(Array.from(twEV)));
