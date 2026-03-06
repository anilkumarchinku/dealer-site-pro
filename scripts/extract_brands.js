const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/data/brand-models.json', 'utf8'));

const twICE = new Set();
const twEV = new Set();
const thW = new Set();

if (data.twoWheelers) {
    if (data.twoWheelers.popular) data.twoWheelers.popular.forEach(g => twICE.add(g.brand));
    if (data.twoWheelers.premium) data.twoWheelers.premium.forEach(g => twICE.add(g.brand));
    if (data.twoWheelers.latest) data.twoWheelers.latest.forEach(g => twICE.add(g.brand));
    if (data.twoWheelers.upcoming) data.twoWheelers.upcoming.forEach(g => twICE.add(g.brand));
    if (data.twoWheelers.electric) data.twoWheelers.electric.forEach(g => twEV.add(g.brand));
}

if (data.threeWheelers) {
    data.threeWheelers.forEach(g => thW.add(g.brand));
}

console.log("ICE Brands:", JSON.stringify(Array.from(twICE)));
console.log("EV Brands:", JSON.stringify(Array.from(twEV)));
console.log("3W Brands:", JSON.stringify(Array.from(thW)));
