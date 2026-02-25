/**
 * Step 2: Add missing car models to carInfo.json
 * Adds data for brands that are partial/low/incomplete
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'public', 'carInfo.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

function addModels(brandKey, newEntries) {
    if (!data[brandKey]) data[brandKey] = {};
    const existing = data[brandKey];
    // Find max numeric key
    let maxKey = -1;
    for (const k of Object.keys(existing)) {
        const n = parseInt(k);
        if (!isNaN(n) && n > maxKey) maxKey = n;
    }
    // Check if a brand uses "variants" key instead
    if (existing.variants && Array.isArray(existing.variants)) {
        existing.variants.push(...newEntries);
        console.log(`  Added ${newEntries.length} entries to ${brandKey}.variants`);
        return;
    }
    // Add as numbered entries
    for (const entry of newEntries) {
        maxKey++;
        existing[maxKey] = entry;
    }
    console.log(`  Added ${newEntries.length} entries to ${brandKey} (keys ${maxKey - newEntries.length + 1}..${maxKey})`);
}

function v(make, model, variant, price, fuel, trans, cc, bhp, nm, mileage, seats, boot, gc, dims, features, safety, img, year) {
    return {
        make, model, variant_name: variant,
        ex_showroom_price_min_inr: price, ex_showroom_price_max_inr: price,
        fuel_type: fuel, transmission: trans,
        engine_displacement_cc: cc, power_bhp: bhp, torque_nm: nm,
        mileage_kmpl_or_ev_range: mileage, seating_capacity: seats,
        boot_space_l: boot, ground_clearance_mm: gc, dimensions: dims,
        key_features: features, safety_features: safety,
        image_urls: [{ value: img }],
        availability_status: 'on_sale', source_url: '', launch_year: year
    };
}

// ============================
// TATA — add Nexon, Punch, Harrier, Safari, Tiago, Tigor
// ============================
console.log('\n🚗 TATA — adding missing models...');
const tataNew = [
    v('Tata Motors', 'Nexon', 'Smart', '799900', 'Petrol', 'Manual', 1199, 120, 170, '17.4', 5, 350, 209, '3993/1811/1606', '10.25" touchscreen, wireless Android Auto & Apple CarPlay, automatic climate control', '6 airbags, ESC, hill hold, TPMS, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Nexon/11104/1733914498498/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Nexon', 'Smart+ S', '899900', 'Petrol', 'Manual', 1199, 120, 170, '17.4', 5, 350, 209, '3993/1811/1606', 'Ventilated front seats, sunroof, air purifier', '6 airbags, ESC, hill hold, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Nexon/11104/1733914498498/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Nexon', 'Creative+ S', '1119900', 'Petrol', 'Manual', 1199, 120, 170, '17.4', 5, 350, 209, '3993/1811/1606', '10.25" touchscreen, JBL audio, 360 camera, powered driver seat', '6 airbags, ESC, all disc brakes, blind spot monitor', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Nexon/11104/1733914498498/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Nexon', 'Fearless+ S AMT', '1239900', 'Petrol', 'Automatic', 1199, 120, 170, '17.4', 5, 350, 209, '3993/1811/1606', 'Panoramic sunroof, powered tailgate, wireless charging, 360 camera', '6 airbags, ESC, ADAS Level 2, blind spot monitor', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Nexon/11104/1733914498498/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Nexon', 'Smart+ S', '999900', 'Diesel', 'Manual', 1497, 115, 260, '23.2', 5, 350, 209, '3993/1811/1606', '10.25" touchscreen, auto climate, cruise control', '6 airbags, ESC, hill hold, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Nexon/11104/1733914498498/front-left-side-47.jpg', 2024),

    v('Tata Motors', 'Punch', 'Pure', '599900', 'Petrol', 'Manual', 1199, 86, 113, '18.97', 5, 366, 187, '3827/1742/1615', 'Touchscreen infotainment, steering mounted controls', 'Dual airbags, ABS with EBD, reverse parking sensor', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Punch/11500/1713178541282/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Punch', 'Adventure', '719900', 'Petrol', 'Manual', 1199, 86, 113, '18.97', 5, 366, 187, '3827/1742/1615', '7" touchscreen, Apple CarPlay & Android Auto, auto AC', 'Dual airbags, ABS, rear parking camera, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Punch/11500/1713178541282/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Punch', 'Creative', '789900', 'Petrol', 'Manual', 1199, 86, 113, '18.97', 5, 366, 187, '3827/1742/1615', '10.25" touchscreen, auto headlamps, rain sensing wipers, cruise control', '6 airbags, ABS with EBD, hill hold, ESC', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Punch/11500/1713178541282/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Punch', 'Creative AMT', '849900', 'Petrol', 'Automatic', 1199, 86, 113, '18.97', 5, 366, 187, '3827/1742/1615', '10.25" touchscreen, auto headlamps, wireless charging', '6 airbags, ABS, ESC, hill hold, rear camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Punch/11500/1713178541282/front-left-side-47.jpg', 2024),

    v('Tata Motors', 'Harrier', 'Smart', '1499900', 'Diesel', 'Manual', 1956, 170, 350, '16.8', 5, 425, 198, '4598/1894/1706', '10.25" touchscreen, panoramic sunroof, auto AC, push start', '6 airbags, ESC, TPMS, hill hold, EPB', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Harrier/11108/1733914497752/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Harrier', 'Fearless', '1749900', 'Diesel', 'Manual', 1956, 170, 350, '16.8', 5, 425, 198, '4598/1894/1706', '12.3" touchscreen, JBL 9 speaker, ventilated seats, 360 camera', '6 airbags, ADAS Level 2, all disc brakes, ESP', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Harrier/11108/1733914497752/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Harrier', 'Fearless+ AT', '2149900', 'Diesel', 'Automatic', 1956, 170, 350, '14.6', 5, 425, 198, '4598/1894/1706', '12.3" touchscreen, wireless charging, powered driver seat, air purifier', '6 airbags, ADAS Level 2, 360 camera, blind spot monitor', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Harrier/11108/1733914497752/front-left-side-47.jpg', 2024),

    v('Tata Motors', 'Safari', 'Smart', '1599900', 'Diesel', 'Manual', 1956, 170, 350, '16.3', 7, 340, 198, '4661/1894/1786', '10.25" touchscreen, 3 zone AC, auto headlamps, push start', '6 airbags, ESC, TPMS, hill hold, EPB', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Safari/11107/1733914498020/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Safari', 'Accomplished+ AT', '2249900', 'Diesel', 'Automatic', 1956, 170, 350, '14.6', 7, 340, 198, '4661/1894/1786', '12.3" touchscreen, JBL audio, panoramic sunroof, powered seats, 360 camera', '6 airbags, ADAS Level 2, all disc brakes, ESP', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Safari/11107/1733914498020/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Safari', 'Adventure+ AT', '1999900', 'Diesel', 'Automatic', 1956, 170, 350, '14.6', 7, 340, 198, '4661/1894/1786', '10.25" touchscreen, ventilated front seats, 2nd row captain seats', '6 airbags, ESC, hill descent, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Safari/11107/1733914498020/front-left-side-47.jpg', 2024),

    v('Tata Motors', 'Tiago', 'XE', '549900', 'Petrol', 'Manual', 1199, 86, 113, '20.09', 5, 242, 170, '3765/1677/1535', 'Digital instrument cluster, follow-me-home headlamps', 'Dual airbags, ABS with EBD, rear parking assist', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Tiago/10380/1694601084498/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Tiago', 'XZ+', '699900', 'Petrol', 'Manual', 1199, 86, 113, '20.09', 5, 242, 170, '3765/1677/1535', '7" touchscreen, Apple CarPlay & Android Auto, auto AC', 'Dual airbags, ABS, rear parking camera, fog lamps', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Tiago/10380/1694601084498/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Tiago', 'XZ+ AMT', '749900', 'Petrol', 'Automatic', 1199, 86, 113, '20.09', 5, 242, 170, '3765/1677/1535', '7" touchscreen, auto AC, steering mounted controls, keyless entry', 'Dual airbags, ABS with EBD, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Tiago/10380/1694601084498/front-left-side-47.jpg', 2024),

    v('Tata Motors', 'Tigor', 'XE', '599900', 'Petrol', 'Manual', 1199, 86, 113, '20.3', 5, 419, 170, '3993/1677/1537', 'Digital instrument cluster, front power windows', 'Dual airbags, ABS with EBD, rear parking sensor', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Tigor/10613/1697706879498/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Tigor', 'XZ+', '749900', 'Petrol', 'Manual', 1199, 86, 113, '20.3', 5, 419, 170, '3993/1677/1537', '7" touchscreen, Apple CarPlay, auto AC, keyless entry, push start', 'Dual airbags, ABS, rear parking camera, fog lamps', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Tigor/10613/1697706879498/front-left-side-47.jpg', 2024),
    v('Tata Motors', 'Tigor', 'XZ+ AMT', '799900', 'Petrol', 'Automatic', 1199, 86, 113, '20.3', 5, 419, 170, '3993/1677/1537', '7" touchscreen, auto AC, cruise control, steering mounted controls', 'Dual airbags, ABS with EBD, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Tigor/10613/1697706879498/front-left-side-47.jpg', 2024),
];
addModels('tata', tataNew);

// ============================
// BMW — add X1, X3, X5, X7, 5 Series, 7 Series, i4, iX
// ============================
console.log('\n🚗 BMW — adding missing models...');
const bmwNew = [
    v('BMW', 'X1', 'sDrive18i xLine', '4190000', 'Petrol', 'Automatic', 1499, 136, 230, '15.7', 5, 540, 175, '4500/1845/1642', '10.7" curved display, wireless CarPlay, ambient lighting, panoramic sunroof', '6 airbags, ABS, ESC, TPMS, ISOFIX, parking assistant', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X1/10816/1711601268746/front-left-side-47.jpg', 2024),
    v('BMW', 'X1', 'sDrive18i M Sport', '4390000', 'Petrol', 'Automatic', 1499, 136, 230, '15.7', 5, 540, 175, '4500/1845/1642', 'M Sport package, sport seats, M steering, 14.9" touchscreen', '6 airbags, ABS, ESC, lane departure, front collision warning', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X1/10816/1711601268746/front-left-side-47.jpg', 2024),
    v('BMW', 'X1', 'sDrive20d M Sport', '4990000', 'Diesel', 'Automatic', 1995, 150, 360, '20.3', 5, 540, 175, '4500/1845/1642', 'M Sport package, Harman Kardon, 360 camera, powered tailgate', '6 airbags, ABS, ADAS, auto parking, driving assistant', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X1/10816/1711601268746/front-left-side-47.jpg', 2024),

    v('BMW', 'X3', 'xDrive20d xLine', '6690000', 'Diesel', 'Automatic', 1995, 190, 400, '18.5', 5, 550, 204, '4708/1891/1676', '12.3" digital dash, 14.9" touchscreen, wireless CarPlay, gesture control', '6 airbags, ABS, ESC, ADAS, 360 camera, parking assistant', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X3/10817/1711601269128/front-left-side-47.jpg', 2024),
    v('BMW', 'X3', 'xDrive20d M Sport', '7290000', 'Diesel', 'Automatic', 1995, 190, 400, '18.5', 5, 550, 204, '4708/1891/1676', 'M Sport package, adaptive suspension, Harman Kardon, head-up display', '6 airbags, ABS, ADAS Level 2, driving assistant plus', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X3/10817/1711601269128/front-left-side-47.jpg', 2024),

    v('BMW', 'X5', 'xDrive30d xLine', '9390000', 'Diesel', 'Automatic', 2993, 286, 650, '14.48', 5, 645, 214, '4922/2004/1745', 'Live Cockpit Professional, 4-zone AC, panoramic sunroof, Bowers & Wilkins', '8 airbags, ABS, ADAS, parking assistant plus, surround view', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X5/10818/1711601269476/front-left-side-47.jpg', 2024),
    v('BMW', 'X5', 'xDrive30d M Sport', '10490000', 'Diesel', 'Automatic', 2993, 286, 650, '14.48', 5, 645, 214, '4922/2004/1745', 'M Sport package, adaptive air suspension, head-up display, laser lights', '8 airbags, ABS, ADAS, driving assistant professional', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X5/10818/1711601269476/front-left-side-47.jpg', 2024),

    v('BMW', 'X7', 'xDrive40i M Sport', '13590000', 'Petrol', 'Automatic', 2998, 381, 520, '11.2', 7, 750, 193, '5151/2000/1805', 'Sky Lounge panoramic roof, 5-zone AC, Bowers & Wilkins, 23" display', '8 airbags, ABS, ADAS, driving assistant professional, surround view', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X7/10819/1711601270040/front-left-side-47.jpg', 2024),

    v('BMW', '5 Series', '520d M Sport', '7190000', 'Diesel', 'Automatic', 1995, 190, 400, '20.37', 5, 520, 142, '5060/1900/1515', '14.9" touchscreen, HUD, gesture control, wireless CarPlay, 4-zone AC', '6 airbags, ABS, ADAS Level 2, parking assistant plus', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/5-Series/10820/1711601270462/front-left-side-47.jpg', 2024),
    v('BMW', '5 Series', '530d M Sport', '8390000', 'Diesel', 'Automatic', 2993, 286, 650, '16.8', 5, 520, 142, '5060/1900/1515', '14.9" touchscreen, Harman Kardon, massage seats, adaptive suspension', '8 airbags, ABS, ADAS Level 2, driving assistant professional', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/5-Series/10820/1711601270462/front-left-side-47.jpg', 2024),

    v('BMW', '7 Series', '740d M Sport', '16900000', 'Diesel', 'Automatic', 2993, 340, 700, '14.4', 5, 540, 145, '5391/1950/1544', '31.3" rear theatre, Bowers & Wilkins, Sky Lounge, executive lounge seating', '8 airbags, ABS, ADAS, automatic parking, night vision', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/7-Series/10821/1711601270840/front-left-side-47.jpg', 2024),

    v('BMW', 'i4', 'eDrive40 M Sport', '7290000', 'Electric', 'Automatic', 0, 340, 430, '590 km', 5, 470, 144, '4783/1852/1448', '14.9" curved display, Harman Kardon, wireless CarPlay, ambient lighting', '6 airbags, ABS, ADAS, driving assistant, parking assistant', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/i4/10822/1711601271220/front-left-side-47.jpg', 2024),

    v('BMW', 'iX', 'xDrive40', '8690000', 'Electric', 'Automatic', 0, 326, 630, '425 km', 5, 500, 200, '4953/1967/1695', '14.9" curved display, Sky Lounge, HK audio, wireless CarPlay, 4-zone AC', '6 airbags, ABS, ADAS Level 2, driving assistant professional', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/iX/10823/1711601271520/front-left-side-47.jpg', 2024),
];
addModels('bmw', bmwNew);

// ============================
// TOYOTA — add Glanza, Urban Cruiser Taisor, Hilux, Land Cruiser
// ============================
console.log('\n🚗 TOYOTA — adding missing models...');
const toyotaNew = [
    v('Toyota', 'Glanza', 'G', '649000', 'Petrol', 'Manual', 1197, 90, 113, '22.35', 5, 318, 170, '3860/1735/1520', '9" SmartPlay Pro+, wireless Apple CarPlay & Android Auto, cruise control', '6 airbags, ABS with EBD, ESC, hill hold, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Glanza/11127/1701339072757/front-left-side-47.jpg', 2024),
    v('Toyota', 'Glanza', 'V', '779000', 'Petrol', 'Manual', 1197, 90, 113, '22.35', 5, 318, 170, '3860/1735/1520', 'HUD, 360 camera, wireless charging, auto folding mirrors', '6 airbags, ABS, ESC, TPMS, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Glanza/11127/1701339072757/front-left-side-47.jpg', 2024),
    v('Toyota', 'Glanza', 'V AMT', '829000', 'Petrol', 'Automatic', 1197, 90, 113, '22.35', 5, 318, 170, '3860/1735/1520', 'HUD, 360 camera, wireless charging, auto AC, cruise control', '6 airbags, ABS, ESC, TPMS, hill hold', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Glanza/11127/1701339072757/front-left-side-47.jpg', 2024),

    v('Toyota', 'Urban Cruiser Taisor', 'G', '739000', 'Petrol', 'Manual', 1197, 90, 113, '20.01', 5, 382, 195, '3995/1765/1550', '9" touchscreen, wireless CarPlay, cruise control, auto headlamps', '6 airbags, ABS, ESC, TPMS, hill hold, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Urban-Cruiser-Taisor/11128/1701339073050/front-left-side-47.jpg', 2024),
    v('Toyota', 'Urban Cruiser Taisor', 'V Turbo', '999000', 'Petrol', 'Manual', 998, 100, 148, '20.01', 5, 382, 195, '3995/1765/1550', 'HUD, wireless charging, 360 camera, auto AC', '6 airbags, ABS, ESC, TPMS, electronic parking brake', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Urban-Cruiser-Taisor/11128/1701339073050/front-left-side-47.jpg', 2024),
    v('Toyota', 'Urban Cruiser Taisor', 'V Turbo AT', '1099000', 'Petrol', 'Automatic', 998, 100, 148, '20.01', 5, 382, 195, '3995/1765/1550', 'HUD, 360 camera, wireless charging, sunroof, ventilated seats', '6 airbags, ABS, ESC, TPMS, hill hold', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Urban-Cruiser-Taisor/11128/1701339073050/front-left-side-47.jpg', 2024),

    v('Toyota', 'Hilux', 'Standard', '3060000', 'Diesel', 'Manual', 2755, 204, 500, '11.2', 5, 0, 220, '5325/1855/1815', '8" touchscreen, dual zone AC, tyre pressure display, push start', '7 airbags, ABS, ESC, hill assist, TPMS, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Hilux/11129/1701339073433/front-left-side-47.jpg', 2024),
    v('Toyota', 'Hilux', 'High', '3685000', 'Diesel', 'Automatic', 2755, 204, 500, '10.1', 5, 0, 220, '5325/1855/1815', '8" touchscreen, leather seats, front parking sensors, wireless CarPlay', '7 airbags, ABS, ESC, vehicle stability, TPMS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Hilux/11129/1701339073433/front-left-side-47.jpg', 2024),

    v('Toyota', 'Land Cruiser', 'LC300 GX-R', '21000000', 'Diesel', 'Automatic', 3346, 305, 700, '8', 7, 0, 230, '4985/1980/1925', '12.3" display, JBL audio, 4-zone AC, multi terrain select, crawl control', '10 airbags, ABS, ADAS, 360 camera, vehicle stability, KDSS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Land-Cruiser/11130/1701339073703/front-left-side-47.jpg', 2024),
];
addModels('toyota', toyotaNew);

// ============================
// HONDA — add Elevate
// ============================
console.log('\n🚗 HONDA — adding Elevate...');
const hondaNew = [
    v('Honda', 'Elevate', 'SV', '1104500', 'Petrol', 'Manual', 1498, 121, 145, '15.31', 5, 458, 220, '4312/1790/1650', '8" touchscreen, wireless Apple CarPlay & Android Auto, auto AC, push start', '6 airbags, ABS, ESC, hill start, TPMS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Honda/Elevate/11131/1701339073978/front-left-side-47.jpg', 2024),
    v('Honda', 'Elevate', 'V', '1229500', 'Petrol', 'Manual', 1498, 121, 145, '15.31', 5, 458, 220, '4312/1790/1650', '10.25" touchscreen, wireless charging, sunroof, LaneWatch camera', '6 airbags, ABS, ESC, hill start, TPMS, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Honda/Elevate/11131/1701339073978/front-left-side-47.jpg', 2024),
    v('Honda', 'Elevate', 'VX CVT', '1489500', 'Petrol', 'Automatic', 1498, 121, 145, '15.31', 5, 458, 220, '4312/1790/1650', '10.25" touchscreen, sunroof, wireless charging, auto LED headlamps', '6 airbags, ABS, ESC, ADAS, LaneWatch, auto high beam', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Honda/Elevate/11131/1701339073978/front-left-side-47.jpg', 2024),
    v('Honda', 'Elevate', 'ZX CVT', '1599500', 'Petrol', 'Automatic', 1498, 121, 145, '15.31', 5, 458, 220, '4312/1790/1650', '10.25" touchscreen, sunroof, wireless charging, power tailgate, leather seats', '6 airbags, ADAS suite, LaneWatch, rear cross traffic, auto high beam', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Honda/Elevate/11131/1701339073978/front-left-side-47.jpg', 2024),
];
addModels('honda', hondaNew);

// ============================
// MARUTI SUZUKI — add missing models (Swift, WagonR, S-Presso, XL6, Jimny, Invicto, Ciaz) + more variants
// ============================
console.log('\n🚗 MARUTI SUZUKI — adding missing models & variants...');
const marutiNew = [
    v('Maruti Suzuki', 'Swift', 'LXi', '599000', 'Petrol', 'Manual', 1197, 82, 112, '24.8', 5, 268, 163, '3860/1735/1530', 'SmartPlay infotainment, steering mounted controls, dual tone interiors', '6 airbags, ABS with EBD, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift/11132/1701339074240/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'Swift', 'VXi', '699000', 'Petrol', 'Manual', 1197, 82, 112, '24.8', 5, 268, 163, '3860/1735/1530', '7" SmartPlay Studio, Apple CarPlay & Android Auto, push start', '6 airbags, ABS, rear parking camera, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift/11132/1701339074240/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'Swift', 'ZXi+', '849000', 'Petrol', 'Manual', 1197, 82, 112, '24.8', 5, 268, 163, '3860/1735/1530', '9" SmartPlay Pro+, wireless charging, HUD, 360 camera, cruise control', '6 airbags, ABS, ESC, TPMS, hill hold', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift/11132/1701339074240/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'Swift', 'ZXi+ AMT', '899000', 'Petrol', 'Automatic', 1197, 82, 112, '24.8', 5, 268, 163, '3860/1735/1530', '9" SmartPlay Pro+, wireless charging, HUD, 360 camera, sunroof', '6 airbags, ABS, ESC, TPMS, hill hold', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift/11132/1701339074240/front-left-side-47.jpg', 2024),

    v('Maruti Suzuki', 'WagonR', 'LXi', '549000', 'Petrol', 'Manual', 1197, 82, 113, '24.43', 5, 341, 180, '3655/1620/1675', 'Steering mounted controls, front power windows, central locking', 'Dual airbags, ABS with EBD, rear parking sensor', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Wagon-R/11133/1701339074520/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'WagonR', 'ZXi', '649000', 'Petrol', 'Manual', 1197, 82, 113, '24.43', 5, 341, 180, '3655/1620/1675', '7" SmartPlay, Apple CarPlay, keyless entry, auto AC', 'Dual airbags, ABS, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Wagon-R/11133/1701339074520/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'WagonR', 'ZXi+ AGS', '749000', 'Petrol', 'Automatic', 1197, 82, 113, '24.43', 5, 341, 180, '3655/1620/1675', '7" SmartPlay, Apple CarPlay, keyless entry, push start, auto AC', 'Dual airbags, ABS with EBD, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Wagon-R/11133/1701339074520/front-left-side-47.jpg', 2024),

    v('Maruti Suzuki', 'XL6', 'Zeta', '1129000', 'Petrol', 'Manual', 1462, 103, 138, '20.97', 6, 209, 180, '4445/1775/1700', 'SmartPlay Pro+ 9", wireless CarPlay, cruise control, auto AC', '6 airbags, ABS, ESC, TPMS, hill hold, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/XL6/11134/1701339074801/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'XL6', 'Alpha+ AT', '1399000', 'Petrol', 'Automatic', 1462, 103, 138, '20.97', 6, 209, 180, '4445/1775/1700', '9" touchscreen, wireless charging, 360 camera, ventilated seats', '6 airbags, ABS, ESC, TPMS, hill hold, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/XL6/11134/1701339074801/front-left-side-47.jpg', 2024),

    v('Maruti Suzuki', 'Jimny', 'Zeta', '1274900', 'Petrol', 'Manual', 1462, 103, 138, '16.94', 4, 208, 210, '3985/1645/1720', '9" SmartPlay Pro+, wireless CarPlay, cruise control, LED headlamps', '6 airbags, ABS, ESC, TPMS, hill hold, hill descent', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Jimny/11135/1701339075080/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'Jimny', 'Alpha AT', '1369900', 'Petrol', 'Automatic', 1462, 103, 138, '16.94', 4, 208, 210, '3985/1645/1720', '9" SmartPlay Pro+, wireless CarPlay, LED headlamps, cruise control, 4WD', '6 airbags, ABS, ESC, TPMS, hill hold, hill descent', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Jimny/11135/1701339075080/front-left-side-47.jpg', 2024),

    v('Maruti Suzuki', 'Invicto', 'Zeta+', '2458000', 'Petrol', 'Automatic', 1987, 186, 188, '21.1', 7, 0, 185, '4755/1850/1795', '10.1" touchscreen, JBL audio, wireless CarPlay, panoramic sunroof, ventilated seats', '6 airbags, ABS, ESC, ADAS, 360 camera, TPMS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Invicto/11136/1701339075360/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'Invicto', 'Alpha+', '2685000', 'Petrol', 'Automatic', 1987, 186, 188, '21.1', 7, 0, 185, '4755/1850/1795', '10.1" touchscreen, JBL premium, ottomans, wireless charging, digital key', '6 airbags, ABS, ESC, ADAS suite, 360 camera, TPMS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Invicto/11136/1701339075360/front-left-side-47.jpg', 2024),

    v('Maruti Suzuki', 'Ciaz', 'Sigma', '899000', 'Petrol', 'Manual', 1462, 103, 138, '20.65', 5, 510, 170, '4490/1730/1485', 'SmartPlay infotainment, auto AC, steering mounted controls', 'Dual airbags, ABS with EBD, rear parking sensor', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Ciaz/11137/1701339075640/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'Ciaz', 'Alpha AT', '1159000', 'Petrol', 'Automatic', 1462, 103, 138, '20.65', 5, 510, 170, '4490/1730/1485', '9" SmartPlay Pro+, wireless CarPlay, cruise control, LED headlamps', 'Dual airbags, ABS, rear parking camera, fog lamps', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Ciaz/11137/1701339075640/front-left-side-47.jpg', 2024),

    v('Maruti Suzuki', 'S-Presso', 'LXi', '419000', 'Petrol', 'Manual', 998, 66, 89, '25.3', 4, 270, 180, '3565/1520/1549', 'Digital instrument cluster, front power windows', 'Dual airbags, ABS with EBD, rear parking sensor', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/S-Presso/11138/1701339075920/front-left-side-47.jpg', 2024),
    v('Maruti Suzuki', 'S-Presso', 'VXi+ AGS', '559000', 'Petrol', 'Automatic', 998, 66, 89, '25.3', 4, 270, 180, '3565/1520/1549', '7" SmartPlay, Apple CarPlay, keyless entry', 'Dual airbags, ABS with EBD, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/S-Presso/11138/1701339075920/front-left-side-47.jpg', 2024),
];
// Maruti uses "car_variants" key structure
if (data.maruti_suzuki && data.maruti_suzuki.car_variants) {
    data.maruti_suzuki.car_variants.push(...marutiNew);
    console.log(`  Added ${marutiNew.length} entries to maruti_suzuki.car_variants`);
} else {
    addModels('maruti_suzuki', marutiNew);
}

// ============================
// CITROEN — add C3 Aircross, Basalt (C3 already has 16 entries)
// ============================
console.log('\n🚗 CITROEN — adding C3 Aircross, Basalt...');
const citroenNew = [
    v('Citroen', 'C3 Aircross', 'Plus', '989000', 'Petrol', 'Manual', 1199, 82, 115, '18.64', 5, 460, 190, '4323/1765/1630', '10.25" touchscreen, wireless CarPlay, auto AC, cruise control', '6 airbags, ABS, ESC, TPMS, hill start, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Citroen/C3-Aircross/11139/1701339076200/front-left-side-47.jpg', 2024),
    v('Citroen', 'C3 Aircross', 'Max', '1049000', 'Petrol', 'Manual', 1199, 82, 115, '18.64', 7, 460, 190, '4323/1765/1630', '10.25" touchscreen, wireless CarPlay, auto AC, cruise control, panoramic sunroof', '6 airbags, ABS, ESC, TPMS, hill start, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Citroen/C3-Aircross/11139/1701339076200/front-left-side-47.jpg', 2024),
    v('Citroen', 'C3 Aircross', 'Max Turbo', '1189000', 'Petrol', 'Manual', 1199, 110, 190, '18.64', 7, 460, 190, '4323/1765/1630', '10.25" touchscreen, panoramic sunroof, wireless charging, connected car', '6 airbags, ABS, ESC, TPMS, hill start, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Citroen/C3-Aircross/11139/1701339076200/front-left-side-47.jpg', 2024),

    v('Citroen', 'Basalt', 'Plus', '799000', 'Petrol', 'Manual', 1199, 82, 115, '18.7', 5, 470, 180, '4352/1765/1593', '10.25" touchscreen, wireless Apple CarPlay & Android Auto, auto AC', '6 airbags, ABS, ESC, TPMS, hill start, ISOFIX', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Citroen/Basalt/11140/1701339076480/front-left-side-47.jpg', 2024),
    v('Citroen', 'Basalt', 'Max', '889000', 'Petrol', 'Manual', 1199, 82, 115, '18.7', 5, 470, 180, '4352/1765/1593', '10.25" touchscreen, wireless charging, sunroof, rear AC vents', '6 airbags, ABS, ESC, TPMS, rear parking camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Citroen/Basalt/11140/1701339076480/front-left-side-47.jpg', 2024),
    v('Citroen', 'Basalt', 'Max Turbo AT', '1069000', 'Petrol', 'Automatic', 1199, 110, 190, '18.7', 5, 470, 180, '4352/1765/1593', '10.25" touchscreen, panoramic sunroof, wireless charging, connected car', '6 airbags, ABS, ESC, TPMS, rear parking camera, blind spot', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Citroen/Basalt/11140/1701339076480/front-left-side-47.jpg', 2024),
];
addModels('citroen', citroenNew);

// ============================
// BYD — add Seal, Atto 3, e6
// ============================
console.log('\n🚗 BYD — adding Seal, Atto 3, e6...');
const bydNew = [
    v('BYD', 'Seal', 'Dynamic', '4099000', 'Electric', 'Automatic', 0, 204, 310, '510 km', 5, 400, 150, '4800/1875/1460', '15.6" rotating touchscreen, NFC key, 360 camera, wireless CarPlay', '6 airbags, ABS, ESC, ADAS, 360 camera, TPMS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BYD/Seal/11141/1701339076760/front-left-side-47.jpg', 2024),
    v('BYD', 'Seal', 'Premium', '5399000', 'Electric', 'Automatic', 0, 313, 360, '580 km', 5, 400, 150, '4800/1875/1460', '15.6" rotating touchscreen, Dynaudio audio, ventilated seats, powered trunk', '8 airbags, ABS, ESC, ADAS Level 2, 360 camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BYD/Seal/11141/1701339076760/front-left-side-47.jpg', 2024),

    v('BYD', 'Atto 3', 'Dynamic', '2499000', 'Electric', 'Automatic', 0, 204, 310, '521 km', 5, 440, 175, '4455/1875/1615', '12.8" rotating touchscreen, wireless CarPlay, 360 camera, panoramic sunroof', '6 airbags, ABS, ESC, TPMS, ADAS, rear camera', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BYD/Atto-3/11142/1701339077040/front-left-side-47.jpg', 2024),
    v('BYD', 'Atto 3', 'Superior', '3399000', 'Electric', 'Automatic', 0, 204, 310, '521 km', 5, 440, 175, '4455/1875/1615', '12.8" rotating screen, ventilated seats, Dirac audio, V2L', '7 airbags, ABS, ESC, ADAS suite, 360 camera, auto parking', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BYD/Atto-3/11142/1701339077040/front-left-side-47.jpg', 2024),

    v('BYD', 'e6', 'GL', '2960000', 'Electric', 'Automatic', 0, 95, 180, '415 km', 5, 580, 175, '4695/1810/1670', '10.1" touchscreen, keyless entry, auto AC, PM2.5 filter', '4 airbags, ABS, ESC, rear parking sensors, TPMS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BYD/e6/11143/1701339077320/front-left-side-47.jpg', 2024),
];
addModels('byd', bydNew);

// ============================
// VOLVO — add XC40, XC90, S90
// ============================
console.log('\n🚗 VOLVO — adding XC40, XC90, S90...');
const volvoNew = [
    v('Volvo', 'XC40', 'B4 Ultimate', '4690000', 'Petrol', 'Automatic', 1969, 197, 300, '14.1', 5, 452, 211, '4425/1863/1652', '9" touchscreen, Google built-in, Harman Kardon, panoramic sunroof', '7 airbags, ABS, ADAS Level 2, 360 camera, BLIS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Volvo/XC40/11144/1701339077600/front-left-side-47.jpg', 2024),
    v('Volvo', 'XC40 Recharge', 'Ultimate', '5690000', 'Electric', 'Automatic', 0, 408, 660, '418 km', 5, 452, 175, '4440/1873/1647', '9" Google built-in, Harman Kardon, panoramic sunroof, wireless charging', '7 airbags, ABS, ADAS Level 2, 360 camera, BLIS, TPMS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Volvo/XC40-Recharge/11145/1701339077880/front-left-side-47.jpg', 2024),

    v('Volvo', 'XC90', 'B6 Ultimate', '9790000', 'Petrol', 'Automatic', 1969, 310, 400, '12.8', 7, 262, 238, '4950/1931/1776', '9" Google built-in, Bowers & Wilkins, 4-zone AC, air suspension', '7 airbags, ABS, ADAS Level 2, 360 camera, city safety, BLIS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Volvo/XC90/11146/1701339078160/front-left-side-47.jpg', 2024),

    v('Volvo', 'S90', 'B5 Ultimate', '6890000', 'Petrol', 'Automatic', 1969, 250, 350, '14.7', 5, 500, 149, '4963/1879/1443', '9" Google built-in, Bowers & Wilkins, panoramic sunroof, air purifier', '7 airbags, ABS, ADAS Level 2, pilot assist, city safety, BLIS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Volvo/S90/11147/1701339078440/front-left-side-47.jpg', 2024),
];
addModels('volvo', volvoNew);

// ============================
// JEEP — add Meridian
// ============================
console.log('\n🚗 JEEP — adding Meridian...');
const jeepNew = [
    v('Jeep', 'Meridian', 'Limited', '3499000', 'Diesel', 'Automatic', 1956, 170, 350, '15.1', 7, 233, 203, '4769/1859/1682', '10.1" Uconnect, wireless CarPlay, dual zone AC, panoramic sunroof', '6 airbags, ABS, ESC, TPMS, hill start, hill descent', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Jeep/Meridian/11148/1701339078720/front-left-side-47.jpg', 2024),
    v('Jeep', 'Meridian', 'Limited (O)', '3699000', 'Diesel', 'Automatic', 1956, 170, 350, '15.1', 7, 233, 203, '4769/1859/1682', '10.1" Uconnect, wireless CarPlay, panoramic sunroof, ADAS, ventilated seats', '6 airbags, ABS, ESC, ADAS, blind spot, rear cross traffic, lane keep', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Jeep/Meridian/11148/1701339078720/front-left-side-47.jpg', 2024),
    v('Jeep', 'Meridian', 'Overland 4x4', '4199000', 'Diesel', 'Automatic', 1956, 170, 350, '14.2', 7, 233, 203, '4769/1859/1682', '10.1" Uconnect, Selec-Terrain 4x4, ventilated seats, powered tailgate', '6 airbags, ABS, ESC, ADAS suite, 360 camera, TPMS', 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Jeep/Meridian/11148/1701339078720/front-left-side-47.jpg', 2024),
];
addModels('jeep', jeepNew);

// ============================
// Save
// ============================
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('\n✅ Step 2 complete: All missing models added to carInfo.json');

// Quick summary
let totalModels = 0;
let totalEntries = 0;
for (const brand of Object.keys(data)) {
    const bData = data[brand];
    const entries = [];
    if (bData.variants && Array.isArray(bData.variants)) {
        entries.push(...bData.variants);
    } else if (bData.car_variants && Array.isArray(bData.car_variants)) {
        entries.push(...bData.car_variants);
    } else {
        for (const k of Object.keys(bData)) {
            const val = bData[k];
            if (val && typeof val === 'object' && val.model) entries.push(val);
        }
    }
    const models = new Set(entries.map(e => e.model).filter(Boolean));
    totalModels += models.size;
    totalEntries += entries.length;
}
console.log(`\nFinal: ${Object.keys(data).length} brands, ${totalModels} models, ${totalEntries} entries`);
