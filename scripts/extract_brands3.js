const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/brand-models.json', 'utf8'));

const twICE = new Set();
const twEV = new Set();
const thW = new Set();

const add2wBrands = (categoryObj, isEv) => {
    if (!categoryObj) return;
    if (Array.isArray(categoryObj)) {
        categoryObj.forEach(g => {
            if (g.brand) {
                if (isEv) twEV.add(g.brand);
                else twICE.add(g.brand);
            }
        });
    } else {
        Object.values(categoryObj).forEach(val => add2wBrands(val, isEv));
    }
}

add2wBrands(data.twoWheelers.popular, false);
add2wBrands(data.twoWheelers.premium, false);
// Just these two are enough for 2W ICE usually

add2wBrands(data.twoWheelers.electric, true);

if (data.threeWheelers) {
    data.threeWheelers.forEach(g => thW.add(g.brand));
}

console.log("ICE Brands:", JSON.stringify(Array.from(twICE)));
console.log("EV Brands:", JSON.stringify(Array.from(twEV)));
console.log("3W Brands:", JSON.stringify(Array.from(thW)));
