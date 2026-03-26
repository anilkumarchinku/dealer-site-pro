#!/usr/bin/env node
/**
 * COMPLETE CardDekho Scraper v2
 * Uses /variants.htm pages to get ALL variants via links
 * Then extracts prices from variant overview pages
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, '..', 'public', 'carInfo.json');

const BRANDS = [
  {key:'maruti_suzuki',make:'Maruti Suzuki',slug:'maruti-suzuki',cdBrand:'Maruti',models:{
    'alto-k10':'Maruti_Alto_K10','s-presso':'Maruti_S_Presso','celerio':'Maruti_Celerio','wagon-r':'Maruti_Wagon_R',
    'swift':'Maruti_Swift','baleno':'Maruti_Baleno','ignis':'Maruti_Ignis','dzire':'Maruti_Dzire',
    'fronx':'Maruti_Fronx','jimny':'Maruti_Jimny','brezza':'Maruti_Brezza','grand-vitara':'Maruti_Grand_Vitara',
    'e-vitara':'Maruti_e_Vitara','ertiga':'Maruti_Ertiga','xl6':'Maruti_XL6','invicto':'Maruti_Invicto',
    'eeco':'Maruti_Eeco','ciaz':'Maruti_Ciaz','victoris':'Maruti_Victoris'}},
  {key:'hyundai',make:'Hyundai',slug:'hyundai',cdBrand:'Hyundai',models:{
    'venue':'Hyundai_Venue','creta':'Hyundai_Creta','alcazar':'Hyundai_Alcazar','exter':'Hyundai_Exter',
    'i20':'Hyundai_i20','verna':'Hyundai_Verna','grand-i10-nios':'Hyundai_Grand_i10_Nios','aura':'Hyundai_Aura',
    'tucson':'Hyundai_Tucson','ioniq-5':'Hyundai_Ioniq_5','creta-electric':'Hyundai_Creta_Electric','i20-n-line':'Hyundai_i20_N_Line'}},
  {key:'tata',make:'Tata',slug:'tata',cdBrand:'Tata',models:{
    'tiago':'Tata_Tiago','tigor':'Tata_Tigor','altroz':'Tata_Altroz','punch':'Tata_Punch','nexon':'Tata_Nexon',
    'harrier':'Tata_Harrier','safari':'Tata_Safari','curvv':'Tata_Curvv','curvv-ev':'Tata_Curvv_EV',
    'nexon-ev':'Tata_Nexon_EV','tiago-ev':'Tata_Tiago_EV','punch-ev':'Tata_Punch_EV',
    'harrier-ev':'Tata_Harrier_EV','sierra':'Tata_Sierra','tigor-ev':'Tata_Tigor_EV'}},
  {key:'mahindra',make:'Mahindra',slug:'mahindra',cdBrand:'Mahindra',models:{
    'bolero':'Mahindra_Bolero','bolero-neo':'Mahindra_Bolero_Neo','scorpio-classic':'Mahindra_Scorpio',
    'scorpio-n':'Mahindra_Scorpio_N','thar':'Mahindra_Thar','thar-roxx':'Mahindra_Thar_Roxx',
    'xuv-3xo':'Mahindra_XUV_3XO','xuv700':'Mahindra_XUV700','xuv-400-ev':'Mahindra_XUV400_EV',
    'be-6':'Mahindra_BE_6','xev-9e':'Mahindra_XEV_9e','xev-9s':'Mahindra_XEV_9S',
    'xuv-3xo-ev':'Mahindra_XUV_3XO_EV','marazzo':'Mahindra_Marazzo','bolero-camper':'Mahindra_Bolero_Camper',
    'xuv-7xo':'Mahindra_XUV_7XO'}},
  {key:'kia',make:'Kia',slug:'kia',cdBrand:'Kia',models:{
    'sonet':'Kia_Sonet','seltos':'Kia_Seltos','carens':'Kia_Carens','carnival':'Kia_Carnival',
    'syros':'Kia_Syros','ev6':'Kia_EV6','ev9':'Kia_EV9','carens-clavis':'Kia_Carens_Clavis'}},
  {key:'toyota',make:'Toyota',slug:'toyota',cdBrand:'Toyota',models:{
    'glanza':'Toyota_Glanza','taisor':'Toyota_Taisor','rumion':'Toyota_Rumion',
    'urban-cruiser-hyryder':'Toyota_Urban_Cruiser_Hyryder','innova-crysta':'Toyota_Innova_Crysta',
    'innova-hycross':'Toyota_Innova_Hycross','fortuner':'Toyota_Fortuner','camry':'Toyota_Camry',
    'hilux':'Toyota_Hilux','vellfire':'Toyota_Vellfire','land-cruiser':'Toyota_Land_Cruiser_300'}},
  {key:'honda',make:'Honda',slug:'honda',cdBrand:'Honda',models:{
    'amaze':'Honda_Amaze','city':'Honda_City','city-hybrid':'Honda_City_Hybrid','elevate':'Honda_Elevate'}},
  {key:'volkswagen',make:'Volkswagen',slug:'volkswagen',cdBrand:'Volkswagen',models:{
    'virtus':'Volkswagen_Virtus','taigun':'Volkswagen_Taigun','tiguan':'Volkswagen_Tiguan',
    'golf-gti':'Volkswagen_Golf_GTI','tayron':'Volkswagen_Tayron'}},
  {key:'skoda',make:'Skoda',slug:'skoda',cdBrand:'Skoda',models:{
    'kylaq':'Skoda_Kylaq','kushaq':'Skoda_Kushaq','slavia':'Skoda_Slavia',
    'kodiaq':'Skoda_Kodiaq','octavia':'Skoda_Octavia'}},
  {key:'renault',make:'Renault',slug:'renault',cdBrand:'Renault',models:{
    'kwid':'Renault_Kwid','kiger':'Renault_Kiger','triber':'Renault_Triber','duster':'Renault_Duster'}},
  {key:'nissan',make:'Nissan',slug:'nissan',cdBrand:'Nissan',models:{
    'magnite':'Nissan_Magnite','x-trail':'Nissan_X_Trail'}},
  {key:'mg',make:'MG',slug:'mg',cdBrand:'MG',models:{
    'astor':'MG_Astor','hector':'MG_Hector','hector-plus':'MG_Hector_Plus','gloster':'MG_Gloster',
    'windsor-ev':'MG_Windsor_EV','comet-ev':'MG_Comet_EV','zs-ev':'MG_ZS_EV','m9':'MG_M9','cyberster':'MG_Cyberster'}},
  {key:'byd',make:'BYD',slug:'byd',cdBrand:'BYD',models:{
    'atto-3':'BYD_Atto_3','seal':'BYD_Seal','sealion-7':'BYD_Sealion_7','emax-7':'BYD_eMAX_7'}},
];

function parsePrice(str) {
  if (!str) return 0;
  const s = str.replace(/[₹,*\s]/g, '').replace(/Rs\.?/gi, '');
  const lakh = s.match(/([\d.]+)\s*(?:Lakh|L)\b/i);
  if (lakh) return Math.round(parseFloat(lakh[1]) * 100000);
  const cr = s.match(/([\d.]+)\s*(?:Crore|Cr)\b/i);
  if (cr) return Math.round(parseFloat(cr[1]) * 10000000);
  return parseInt(s, 10) || 0;
}

function slugToModel(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ')
    .replace(/\bEv\b/g,'EV').replace(/\bGt\b/g,'GT').replace(/\bSuv\b/g,'SUV')
    .replace(/\bAmg\b/g,'AMG').replace(/\bGti\b/g,'GTI').replace(/\bEc3\b/g,'eC3')
    .replace(/\bXuv\b/g,'XUV').replace(/\bXev\b/g,'XEV');
}

async function scrapeVariantsPage(page, brandSlug, modelSlug, cdModelKey) {
  // Strategy: visit /variants.htm, extract variant links with names and prices
  const variantsUrl = `https://www.cardekho.com/${brandSlug}/${modelSlug}/variants.htm`;

  try {
    await page.goto(variantsUrl, {waitUntil:'networkidle0',timeout:40000});
    await new Promise(r=>setTimeout(r,4000));

    // Scroll fully
    for (let i = 0; i < 15; i++) {
      await page.evaluate((p) => window.scrollTo(0, p), i * 500);
      await new Promise(r=>setTimeout(r,200));
    }
    await new Promise(r=>setTimeout(r,2000));

    const data = await page.evaluate(() => {
      const variants = [];

      // Method 1: Extract from overview links (most reliable - gives ALL variant names)
      const links = document.querySelectorAll('a[href*="/overview/"]');
      const seen = new Set();
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        const text = link.textContent?.trim();
        if (text && text.length > 2 && text.length < 80 && !seen.has(text)) {
          seen.add(text);

          // Try to find price near this link
          let price = '';
          const parent = link.closest('tr, [class*="variant"], [class*="row"], li, div');
          if (parent) {
            const priceEl = parent.querySelector('[class*="price"], [class*="Price"]');
            if (priceEl) price = priceEl.textContent?.trim() || '';
            if (!price) {
              const m = parent.textContent?.match(/₹\s*([\d.,]+)\s*(?:Lakh|Cr)/i);
              if (m) price = m[0];
            }
          }

          variants.push({ name: text, price, href });
        }
      }

      // Method 2: Extract from visible text with spec pattern
      const lines = document.body.innerText.split('\n').map(l=>l.trim()).filter(l=>l);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(/\d+\s*cc.*(?:Manual|Automatic|AMT|CVT|DCT)/i)) {
          let vn = '';
          for (let j = i-1; j >= Math.max(0,i-3); j--) {
            const p = lines[j];
            if (p.length > 2 && p.length < 100 && !p.match(/₹|Lakh|waiting|Compare|Offers|View|month|Rs\.|Ad\b/i)) {
              vn = p.replace(/^\(Base Model\)\s*/i, '').trim();
              break;
            }
          }
          let pr = '';
          for (let j = i; j <= Math.min(lines.length-1, i+3); j++) {
            const m = lines[j].match(/₹\s*([\d.,]+)\s*(?:Lakh|Cr)/i);
            if (m) { pr = m[0]; break; }
          }
          if (vn && !seen.has(vn)) {
            seen.add(vn);
            variants.push({ name: vn, price: pr, href: '', specs: line });
          }
        }
      }

      return variants;
    });

    return data;
  } catch(e) {
    return [];
  }
}

async function getVariantDetails(page, href) {
  // Visit individual variant page to get exact price and specs
  try {
    const url = href.startsWith('http') ? href : 'https://www.cardekho.com' + href;
    await page.goto(url, {waitUntil:'networkidle0',timeout:30000});
    await new Promise(r=>setTimeout(r,3000));

    return await page.evaluate(() => {
      const text = document.body.innerText;
      let price = 0;
      const priceMatch = text.match(/Ex-Showroom.*?₹\s*([\d.,]+)\s*(?:Lakh|Cr)/is)
                      || text.match(/₹\s*([\d.,]+)\s*(?:Lakh|Cr)/i);
      if (priceMatch) price = priceMatch[0];

      // Extract specs
      let fuel='', trans='', cc=0, mileage=0;
      const ccM = text.match(/(\d{3,4})\s*cc/i);
      if (ccM) cc = parseInt(ccM[1]);
      if (/\bPetrol\b/i.test(text)) fuel='Petrol';
      else if (/\bDiesel\b/i.test(text)) fuel='Diesel';
      else if (/\bElectric\b/i.test(text)) fuel='Electric';
      else if (/\bCNG\b/i.test(text)) fuel='CNG';
      else if (/\bHybrid\b/i.test(text)) fuel='Hybrid';
      if (/\bAutomatic\b|AMT|CVT|DCT/i.test(text)) trans='Automatic';
      else if (/\bManual\b/i.test(text)) trans='Manual';
      const milM = text.match(/([\d.]+)\s*(?:kmpl|km\/l)/i);
      if (milM) mileage=parseFloat(milM[1]);

      return { price, fuel, trans, cc, mileage };
    });
  } catch(e) {
    return null;
  }
}

async function main() {
  console.log('=== CardDekho COMPLETE Scraper v2 ===');
  console.log('Using /variants.htm + overview links for ALL variants\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  const carInfo = {};
  let grand = 0;

  for (const brand of BRANDS) {
    const entries = {};
    let idx = 0;
    console.log('\n' + brand.make + ':');

    for (const [modelSlug, cdKey] of Object.entries(brand.models)) {
      await new Promise(r=>setTimeout(r,1500));

      const modelName = slugToModel(modelSlug);
      const variants = await scrapeVariantsPage(page, brand.slug, modelSlug, cdKey);

      if (variants.length > 0) {
        // For variants without prices, try to get from individual pages (limit to first few)
        let needPrice = variants.filter(v => !v.price).length;
        if (needPrice > 0 && needPrice <= 3) {
          for (const v of variants) {
            if (!v.price && v.href) {
              const details = await getVariantDetails(page, v.href);
              if (details?.price) v.price = details.price;
              if (details?.fuel) v.fuel = details.fuel;
              if (details?.trans) v.trans = details.trans;
              if (details?.cc) v.cc = details.cc;
              await new Promise(r=>setTimeout(r,1000));
            }
          }
        }

        for (const v of variants) {
          // Parse specs from the specs text or from individual details
          let fuel = v.fuel || '', trans = v.trans || '', cc = v.cc || 0, mileage = 0;
          if (v.specs) {
            if (!fuel) {
              if (/Petrol/i.test(v.specs)) fuel='Petrol';
              else if (/Diesel/i.test(v.specs)) fuel='Diesel';
              else if (/Electric/i.test(v.specs)) fuel='Electric';
              else if (/CNG/i.test(v.specs)) fuel='CNG';
              else if (/Hybrid/i.test(v.specs)) fuel='Hybrid';
            }
            if (!trans) {
              if (/Automatic|AMT|CVT|DCT/i.test(v.specs)) trans='Automatic';
              else if (/Manual/i.test(v.specs)) trans='Manual';
            }
            if (!cc) {
              const ccM = v.specs.match(/(\d+)\s*cc/i);
              if (ccM) cc = parseInt(ccM[1]);
            }
            const milM = v.specs.match(/([\d.]+)\s*(?:kmpl|km\/l)/i);
            if (milM) mileage = parseFloat(milM[1]);
          }

          // Infer from variant name if still missing
          if (!fuel) {
            if (v.name.match(/CNG/i)) fuel='CNG';
            else if (v.name.match(/EV|Electric/i)) fuel='Electric';
            else if (v.name.match(/Hybrid/i)) fuel='Hybrid';
            else if (v.name.match(/Diesel|TDI/i)) fuel='Diesel';
            else fuel='Petrol';
          }
          if (!trans) {
            if (v.name.match(/AMT|CVT|DCT|AT\b|Automatic/i)) trans='Automatic';
            else trans='Manual';
          }

          entries[String(idx)] = {
            make: brand.make,
            model: modelName,
            variant_name: v.name,
            ex_showroom_price_min_inr: parsePrice(v.price),
            fuel_type: fuel,
            transmission: trans,
            engine_displacement_cc: cc,
            power_bhp: 0,
            torque_nm: 0,
            mileage_kmpl: mileage,
            source_url: `https://www.cardekho.com/${brand.slug}/${modelSlug}/variants.htm`,
          };
          idx++;
        }
        process.stdout.write('  ' + modelSlug + '(' + variants.length + ')');
      } else {
        entries[String(idx)] = {
          make: brand.make, model: modelName, variant_name: modelName,
          ex_showroom_price_min_inr: 0, fuel_type: '', transmission: '',
          engine_displacement_cc: 0, power_bhp: 0, torque_nm: 0, mileage_kmpl: 0,
          source_url: `https://www.cardekho.com/${brand.slug}/${modelSlug}`,
        };
        idx++;
        process.stdout.write('  ' + modelSlug + '(0)');
      }
    }

    carInfo[brand.key] = entries;
    grand += idx;
    console.log(' = ' + idx + ' total');
  }

  await browser.close();
  fs.writeFileSync(OUTPUT, JSON.stringify(carInfo, null, 2));
  console.log('\n=== DONE: ' + grand + ' variants across ' + BRANDS.length + ' brands ===');
  console.log('Saved to ' + OUTPUT);
}

main().catch(e => { console.error(e); process.exit(1); });
