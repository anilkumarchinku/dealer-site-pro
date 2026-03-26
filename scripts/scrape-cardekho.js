#!/usr/bin/env node
/**
 * CardDekho Real Scraper
 * Extracts ACTUAL variant data from CardDekho model pages.
 *
 * The variant data appears in visible text as:
 * "Model Variant | 1197 cc, Manual, Petrol, 22.35 kmpl | ₹5.99 Lakh*"
 *
 * Usage: node scripts/scrape-cardekho.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'carInfo.json');

// All 4W brands
const BRANDS = [
  { key: 'maruti_suzuki', slug: 'maruti-suzuki', name: 'Maruti Suzuki', models: ['alto-k10','s-presso','celerio','wagon-r','swift','baleno','ignis','dzire','fronx','jimny','brezza','grand-vitara','e-vitara','ertiga','xl6','invicto','eeco','ciaz','victoris'] },
  { key: 'hyundai', slug: 'hyundai', name: 'Hyundai', models: ['venue','creta','alcazar','exter','i20','verna','grand-i10-nios','aura','tucson','ioniq-5','creta-electric','i20-n-line'] },
  { key: 'tata', slug: 'tata', name: 'Tata', models: ['tiago','tigor','altroz','punch','nexon','harrier','safari','curvv','curvv-ev','nexon-ev','tiago-ev','punch-ev','harrier-ev','sierra','tigor-ev'] },
  { key: 'mahindra', slug: 'mahindra', name: 'Mahindra', models: ['bolero','bolero-neo','scorpio-classic','scorpio-n','thar','thar-roxx','xuv-3xo','xuv700','xuv-400-ev','be-6','xev-9e','xev-9s','xuv-3xo-ev','marazzo','bolero-camper'] },
  { key: 'kia', slug: 'kia', name: 'Kia', models: ['sonet','seltos','carens','carnival','syros','ev6','ev9','carens-clavis'] },
  { key: 'toyota', slug: 'toyota', name: 'Toyota', models: ['glanza','taisor','rumion','urban-cruiser-hyryder','innova-crysta','innova-hycross','fortuner','camry','hilux','vellfire','land-cruiser'] },
  { key: 'honda', slug: 'honda', name: 'Honda', models: ['amaze','city','city-hybrid','elevate'] },
  { key: 'bmw', slug: 'bmw', name: 'BMW', models: ['2-series-gran-coupe','3-series','5-series','7-series','x1','x3','x5','x7','z4','i4','i5','i7','ix','ix1','m2','m5','6-series-gt','xm'] },
  { key: 'audi', slug: 'audi', name: 'Audi', models: ['a4','a6','q3','q3-sportback','q5','q7','q8','sq8','rs-q8','s5-sportback','e-tron-gt','rs-e-tron-gt','q8-e-tron','q8-sportback-e-tron'] },
  { key: 'mercedes_benz', slug: 'mercedes-benz', name: 'Mercedes-Benz', models: ['a-class-limousine','c-class','e-class','s-class','gla','glc','gle','gls','g-class','eqb','eqs','v-class','amg-gt','maybach-s-class','maybach-gls'] },
  { key: 'volkswagen', slug: 'volkswagen', name: 'Volkswagen', models: ['virtus','taigun','tiguan','golf-gti','tayron'] },
  { key: 'skoda', slug: 'skoda', name: 'Skoda', models: ['kylaq','kushaq','slavia','kodiaq','octavia'] },
  { key: 'renault', slug: 'renault', name: 'Renault', models: ['kwid','kiger','triber','duster'] },
  { key: 'nissan', slug: 'nissan', name: 'Nissan', models: ['magnite','x-trail'] },
  { key: 'mg', slug: 'mg', name: 'MG', models: ['astor','hector','hector-plus','gloster','windsor-ev','comet-ev','zs-ev'] },
  { key: 'byd', slug: 'byd', name: 'BYD', models: ['atto-3','seal','sealion-7','emax-7'] },
  { key: 'volvo', slug: 'volvo', name: 'Volvo', models: ['xc90','xc60','ex30','ex40','ec40'] },
  { key: 'porsche', slug: 'porsche', name: 'Porsche', models: ['911','cayenne','macan','taycan','panamera'] },
  { key: 'land_rover', slug: 'land-rover', name: 'Land Rover', models: ['defender','discovery','discovery-sport','range-rover-evoque','range-rover-sport','range-rover-velar','range-rover'] },
  { key: 'jeep', slug: 'jeep', name: 'Jeep', models: ['compass','meridian','wrangler','grand-cherokee'] },
  { key: 'lexus', slug: 'lexus', name: 'Lexus', models: ['es','nx','rx','lm','lx'] },
  { key: 'aston_martin', slug: 'aston-martin', name: 'Aston Martin', models: ['vantage','dbx','db12','vanquish'] },
  { key: 'lamborghini', slug: 'lamborghini', name: 'Lamborghini', models: ['urus','revuelto','huracan-evo','temerario'] },
  { key: 'bentley', slug: 'bentley', name: 'Bentley', models: ['bentayga','continental-gt','flying-spur'] },
  { key: 'jaguar', slug: 'jaguar', name: 'Jaguar', models: ['f-pace'] },
  { key: 'mini', slug: 'mini', name: 'Mini', models: ['cooper','countryman'] },
  { key: 'citroen', slug: 'citroen', name: 'Citroen', models: ['c3','c5-aircross','basalt','ec3'] },
  { key: 'force_motors', slug: 'force', name: 'Force', models: ['gurkha','urbania'] },
  { key: 'isuzu', slug: 'isuzu', name: 'Isuzu', models: ['d-max','v-cross','hi-lander','mu-x','s-cab'] },
  { key: 'vinfast', slug: 'vinfast', name: 'VinFast', models: ['vf-6','vf-7'] },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parsePrice(str) {
  if (!str) return 0;
  const s = str.replace(/[₹,*\s]/g, '').replace(/Rs\.?/gi, '');
  const lakh = s.match(/([\d.]+)\s*(?:Lakh|L)\b/i);
  if (lakh) return Math.round(parseFloat(lakh[1]) * 100000);
  const cr = s.match(/([\d.]+)\s*(?:Crore|Cr)\b/i);
  if (cr) return Math.round(parseFloat(cr[1]) * 10000000);
  const num = parseInt(s.replace(/,/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

// Parse variant line: "1197 cc, Manual, Petrol, 22.35 kmpl"
function parseSpecs(specStr) {
  const specs = { engine_displacement_cc: 0, transmission: '', fuel_type: '', mileage_kmpl: 0, power_bhp: 0, torque_nm: 0 };
  if (!specStr) return specs;

  const ccMatch = specStr.match(/([\d.]+)\s*cc/i);
  if (ccMatch) specs.engine_displacement_cc = Math.round(parseFloat(ccMatch[1]));

  if (/\bAutomatic\b|AMT|CVT|DCT|AT\b/i.test(specStr)) specs.transmission = 'Automatic';
  else if (/\bManual\b|MT\b/i.test(specStr)) specs.transmission = 'Manual';

  if (/\bPetrol\b/i.test(specStr)) specs.fuel_type = 'Petrol';
  else if (/\bDiesel\b/i.test(specStr)) specs.fuel_type = 'Diesel';
  else if (/\bCNG\b/i.test(specStr)) specs.fuel_type = 'CNG';
  else if (/\bElectric\b|EV\b|kWh/i.test(specStr)) specs.fuel_type = 'Electric';
  else if (/\bHybrid\b/i.test(specStr)) specs.fuel_type = 'Hybrid';

  const mileageMatch = specStr.match(/([\d.]+)\s*(?:kmpl|km\/l|km\/kg)/i);
  if (mileageMatch) specs.mileage_kmpl = parseFloat(mileageMatch[1]);

  const rangeMatch = specStr.match(/([\d.]+)\s*km\s*(?:range|\/charge)/i);
  if (rangeMatch) specs.mileage_kmpl = parseFloat(rangeMatch[1]);

  const bhpMatch = specStr.match(/([\d.]+)\s*(?:bhp|ps|hp)/i);
  if (bhpMatch) specs.power_bhp = Math.round(parseFloat(bhpMatch[1]));

  const nmMatch = specStr.match(/([\d.]+)\s*nm/i);
  if (nmMatch) specs.torque_nm = Math.round(parseFloat(nmMatch[1]));

  return specs;
}

async function scrapeModelPage(page, brandSlug, modelSlug, brandName) {
  const url = `https://www.cardekho.com/${brandSlug}/${modelSlug}`;

  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
    await sleep(5000);

    // Scroll to load all content
    await page.evaluate(() => window.scrollTo(0, 3000));
    await sleep(2000);

    const variants = await page.evaluate((bName) => {
      const results = [];
      const bodyText = document.body.innerText;
      const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l);

      // Pattern: variant lines contain "cc, [Manual/Automatic], [Petrol/Diesel/CNG], kmpl" + price
      // They appear as consecutive lines or pipe-separated
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if line has the spec pattern: "XXX cc, Manual/Automatic, Petrol/Diesel, XX kmpl"
        if (line.match(/\d+\s*cc.*(?:Manual|Automatic|AMT|CVT|DCT)/i) && line.match(/(?:Petrol|Diesel|CNG|Electric|Hybrid)/i)) {
          // This is a spec line - variant name should be in previous line(s)
          let variantName = '';
          let priceStr = '';

          // Look backwards for variant name
          for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
            const prev = lines[j];
            if (prev.length > 2 && prev.length < 100 && !prev.match(/₹|Lakh|waiting|Compare|Offers|View|month/i)) {
              variantName = prev;
              break;
            }
          }

          // Look forward for price
          for (let j = i; j <= Math.min(lines.length - 1, i + 3); j++) {
            const next = lines[j];
            if (next.match(/₹|Lakh|Cr/i)) {
              const priceMatch = next.match(/₹\s*([\d.,]+)\s*(?:Lakh|Cr)/i);
              if (priceMatch) {
                priceStr = priceMatch[0];
                break;
              }
            }
          }

          // Also check if variant name + specs + price are in the same context
          if (!variantName) {
            // Try pipe-separated: "Variant Name | specs | price"
            const context = lines.slice(Math.max(0, i-2), i+3).join(' | ');
            const parts = context.split('|').map(s => s.trim());
            for (const part of parts) {
              if (part.length > 2 && part.length < 80 && !part.match(/\d+\s*cc|₹|Lakh|waiting|Compare|View|month/i)) {
                variantName = part;
                break;
              }
            }
          }

          if (variantName) {
            results.push({
              variant_name: variantName.replace(/^\(Base Model\)\s*/i, '').trim(),
              specs_text: line,
              price_text: priceStr,
            });
          }
        }
      }

      return results;
    }, brandName);

    return variants;
  } catch (err) {
    console.log(`    Error: ${err.message}`);
    return [];
  }
}

async function main() {
  console.log('=== CardDekho Real Scraper ===\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 900 });

  const carInfo = {};
  let totalVariants = 0;
  let totalModels = 0;

  for (const brand of BRANDS) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`${brand.name} (${brand.models.length} models)`);
    console.log('='.repeat(50));

    const brandEntries = {};
    let idx = 0;

    for (const modelSlug of brand.models) {
      await sleep(2000);

      const modelName = modelSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        .replace('Ev', 'EV').replace('Suv', 'SUV').replace('Gt', 'GT');

      console.log(`  ${modelName}...`);

      const variants = await scrapeModelPage(page, brand.slug, modelSlug, brand.name);

      if (variants.length > 0) {
        console.log(`    Found ${variants.length} variants`);

        for (const v of variants) {
          const specs = parseSpecs(v.specs_text);
          const price = parsePrice(v.price_text);

          brandEntries[String(idx)] = {
            make: brand.name,
            model: modelName,
            variant_name: v.variant_name,
            ex_showroom_price_min_inr: price,
            fuel_type: specs.fuel_type,
            transmission: specs.transmission,
            engine_displacement_cc: specs.engine_displacement_cc,
            power_bhp: specs.power_bhp,
            torque_nm: specs.torque_nm,
            mileage_kmpl: specs.mileage_kmpl,
            source_url: `https://www.cardekho.com/${brand.slug}/${modelSlug}`,
          };
          idx++;
          totalVariants++;
        }
        totalModels++;
      } else {
        console.log(`    No variants found - adding placeholder`);
        brandEntries[String(idx)] = {
          make: brand.name,
          model: modelName,
          variant_name: modelName,
          ex_showroom_price_min_inr: 0,
          fuel_type: '',
          transmission: '',
          engine_displacement_cc: 0,
          power_bhp: 0,
          torque_nm: 0,
          mileage_kmpl: 0,
          source_url: `https://www.cardekho.com/${brand.slug}/${modelSlug}`,
        };
        idx++;
        totalModels++;
      }
    }

    carInfo[brand.key] = brandEntries;
    console.log(`  Total: ${idx} entries for ${brand.name}`);
  }

  await browser.close();

  // Write output
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Writing ${totalVariants} variants across ${totalModels} models`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(carInfo, null, 2));
  console.log(`Saved to ${OUTPUT_FILE}`);
  console.log('DONE!');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
