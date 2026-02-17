/**
 * Brand Configuration for Scraping
 * List of all 28 brands and their popular models
 */

const BRANDS = [
    // --- MASS MARKET ---
    {
        name: 'Maruti Suzuki',
        slug: 'maruti',
        models: [
            'swift', 'baleno', 'wagonr', 'alto-k10', 'dzire',
            'ertiga', 'brezza', 'fronx', 'grand-vitara', 'jimny',
            'celerio', 's-presso', 'eeco', 'invicto', 'ciaz', 'ignis', 'xl6'
        ]
    },
    {
        name: 'Hyundai',
        slug: 'hyundai',
        models: [
            'creta', 'venue', 'i20', 'verna', 'exter',
            'alcazar', 'tucson', 'ioniq-5', 'grand-i10-nios', 'aura',
            'kona', 'santro'
        ]
    },
    {
        name: 'Tata',
        slug: 'tata',
        models: [
            'nexon', 'punch', 'harrier', 'safari', 'tiago',
            'tigor', 'altroz', 'nexon-ev', 'tiago-ev', 'punch-ev',
            'curvv', 'harrier-ev'
        ]
    },
    {
        name: 'Mahindra',
        slug: 'mahindra',
        models: [
            'scorpio-n', 'xuv700', 'thar', 'bolero', 'xuv300',
            'scorpio', 'xuv400', 'marazzo', 'bolero-neo', 'xuv3xo'
        ]
    },
    {
        name: 'Honda',
        slug: 'honda',
        models: ['city', 'amaze', 'elevate', 'city-hybrid']
    },
    {
        name: 'Toyota',
        slug: 'toyota',
        models: [
            'innova-crysta', 'fortuner', 'glanza', 'urban-cruiser-hyryder',
            'innova-hycross', 'hilux', 'vellfire', 'camry', 'rumion', 'land-cruiser'
        ]
    },
    {
        name: 'Kia',
        slug: 'kia',
        models: ['seltos', 'sonet', 'carens', 'ev6', 'carnival', 'ev9']
    },
    {
        name: 'Renault',
        slug: 'renault',
        models: ['kwid', 'triber', 'kiger']
    },
    {
        name: 'Nissan',
        slug: 'nissan',
        models: ['magnite', 'x-trail']
    },
    {
        name: 'Volkswagen',
        slug: 'volkswagen',
        models: ['virtus', 'taigun', 'tiguan']
    },

    // --- MID-PREMIUM & UTILITY ---
    {
        name: 'Skoda',
        slug: 'skoda',
        models: ['slavia', 'kushaq', 'kodiaq', 'superb']
    },
    {
        name: 'MG',
        slug: 'mg',
        models: ['hector', 'astor', 'zs-ev', 'comet-ev', 'gloster', 'hector-plus']
    },
    {
        name: 'Jeep',
        slug: 'jeep',
        models: ['compass', 'meridian', 'wrangler', 'grand-cherokee']
    },
    {
        name: 'Citroen',
        slug: 'citroen',
        models: ['c3', 'ec3', 'c3-aircross', 'c5-aircross', 'basalt']
    },
    {
        name: 'Force',
        slug: 'force',
        models: ['gurkha', 'trax-cruiser']
    },
    {
        name: 'Isuzu',
        slug: 'isuzu',
        models: ['d-max', 'mu-x']
    },

    // --- LUXURY ---
    {
        name: 'Mercedes-Benz',
        slug: 'mercedes-benz',
        models: [
            'c-class', 'e-class', 's-class', 'gla', 'glc', 'gle', 'gls',
            'a-class-limousine', 'eqs', 'g-class'
        ]
    },
    {
        name: 'BMW',
        slug: 'bmw',
        models: [
            '3-series', '5-series', 'x1', 'x3', 'x5', 'x7', '7-series',
            'i7', 'ix1', 'm340i'
        ]
    },
    {
        name: 'Audi',
        slug: 'audi',
        models: ['a4', 'a6', 'q3', 'q5', 'q7', 'q8', 'e-tron', 'rs5']
    },
    {
        name: 'Jaguar',
        slug: 'jaguar', // check url slug
        models: ['f-pace', 'i-pace']
    },
    {
        name: 'Land Rover',
        slug: 'land-rover',
        models: [
            'defender', 'range-rover', 'range-rover-sport', 'range-rover-velar',
            'discovery', 'discovery-sport', 'range-rover-evoque'
        ]
    },
    {
        name: 'Volvo',
        slug: 'volvo',
        models: ['xc40', 'xc60', 'xc90', 's90', 'c40-recharge']
    },
    {
        name: 'Lexus',
        slug: 'lexus',
        models: ['es', 'nx', 'rx', 'ls', 'lx', 'lm']
    },
    {
        name: 'Porsche',
        slug: 'porsche',
        models: ['911', 'cayenne', 'macan', 'panamera', 'taycan', '718']
    },
    {
        name: 'Bentley',
        slug: 'bentley',
        models: ['continental', 'flying-spur', 'bentayga']
    },
    {
        name: 'Lamborghini',
        slug: 'lamborghini',
        models: ['urus', 'huracan', 'revuelto']
    },

    // --- ELECTRIC & NEW AGE ---
    {
        name: 'BYD',
        slug: 'byd',
        models: ['atto-3', 'e6', 'seal']
    },
    {
        name: 'Tesla',
        slug: 'tesla',
        models: []
    }
];

module.exports = { BRANDS };
