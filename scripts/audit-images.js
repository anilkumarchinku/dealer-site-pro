/**
 * audit-images.js — checks every brand/model across 2W, 3W, 4W-auto
 * Run: node scripts/audit-images.js
 */
const fs   = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const urls        = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/vehicle-image-urls.json'), 'utf8'));
const brandModels = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/brand-models.json'), 'utf8'));

const toSlug = s =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');

// Generic image resolver — works for 2w/, 3w/, 4w-auto/ prefixes
function resolves(prefix, model) {
  const base = model.split('/')[0].trim();   // strip fuel/variant suffix after '/'
  const slug = toSlug(base);
  const pre  = prefix;
  if (urls[`${pre}${slug}.jpg`]) return true;
  const parts = slug.split('-');
  for (let i = parts.length - 1; i >= 2; i--) {
    if (urls[`${pre}${parts.slice(0,i).join('-')}.jpg`]) return true;
  }
  for (const key of Object.keys(urls)) {
    if (!key.startsWith(pre)) continue;
    const stored = key.slice(pre.length, -4);
    if (slug.startsWith(stored) || stored.startsWith(slug)) return true;
  }
  return false;
}

/* ── 2W ──────────────────────────────────────────────────────────────── */
const missing2W = [];
const all2W     = [...(brandModels.twoWheelers?.traditional||[]),
                   ...(brandModels.twoWheelers?.electric||[])];
for (const brand of all2W) {
  const models = typeof brand.models === 'object' && !Array.isArray(brand.models)
    ? Object.values(brand.models).flat()
    : (brand.models || []);
  for (const m of models) {
    if (!resolves(`2w/${brand.brandId}/`, m))
      missing2W.push({ brandId: brand.brandId, model: m });
  }
}

/* ── 3W ──────────────────────────────────────────────────────────────── */
const FOLDER_3W = {
  'Bajaj':'bajaj','Piaggio':'piaggio','Mahindra':'mahindra','TVS King':'tvs',
  'Euler Motors':'euler','Atul Auto':'atul','Greaves Electric':'greaves',
  'Kinetic Green':'kinetic','Lohia Auto':'lohia','Altigreen':'altigreen',
  'Montra Electric':'montra','Omega Seiki Mobility':'omega','OSM':'osm',
  'YOUDHA':'youdha','YC Electric':'yc-ev','Saera Electric':'saera-ev',
  'Terra Motors':'terra-motors','ETrio':'etrio',
};
const missing3W = [];
const dir3W = path.join(ROOT,'public/data/3w');
for (const file of fs.readdirSync(dir3W).filter(f=>f.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(dir3W,file),'utf8'));
  const folder = FOLDER_3W[d.brand];
  if (!folder) { missing3W.push({ file, brand:d.brand, model:'(no folder mapping)' }); continue; }
  for (const v of (d.vehicles||[])) {
    const name = v.variant_name || v.model;
    if (!name) continue;
    if (!resolves(`3w/${folder}/`, name))
      missing3W.push({ file, brand:d.brand, folder, model:name });
  }
}

/* ── 4W-auto ─────────────────────────────────────────────────────────── */
const FOLDER_4W = {
  'Tata':'tata','Mahindra':'mahindra','Maruti Suzuki':'maruti',
  'Ashok Leyland':'ashok-leyland','Eicher':'eicher','Force Motors':'force',
};
const missing4W = [];
const dir4W = path.join(ROOT,'public/data/4w-auto');
for (const file of fs.readdirSync(dir4W).filter(f=>f.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(dir4W,file),'utf8'));
  const folder = FOLDER_4W[d.brand];
  if (!folder) { missing4W.push({ file, brand:d.brand, model:'(no folder)' }); continue; }
  // De-duplicate: use model field if present, else variant_name
  const hasModel = (d.vehicles||[]).some(v=>v.model);
  const names = [...new Set((d.vehicles||[]).map(v=>(hasModel?v.model:v.variant_name)).filter(Boolean))];
  for (const m of names) {
    if (!resolves(`4w-auto/${folder}/`, m))
      missing4W.push({ file, brand:d.brand, folder, model:m });
  }
}

/* ── PRINT RESULTS ───────────────────────────────────────────────────── */
console.log('\n══ 2W MISSING (' + missing2W.length + ') ══════════════════════════');
missing2W.forEach(x=>console.log(`  2w/${x.brandId}/  →  ${x.model}`));

console.log('\n══ 3W MISSING (' + missing3W.length + ') ══════════════════════════');
missing3W.forEach(x=>console.log(`  3w/${x.folder||'?'}/  →  ${x.model}`));

console.log('\n══ 4W-AUTO MISSING (' + missing4W.length + ') ═══════════════════════');
missing4W.forEach(x=>console.log(`  4w-auto/${x.folder||'?'}/  →  ${x.model}`));

console.log('\n══ SUMMARY ═════════════════════════════════════════════════');
const total2W  = all2W.reduce((n,b)=>n+(typeof b.models==='object'&&!Array.isArray(b.models)?Object.values(b.models).flat().length:(b.models||[]).length),0);
console.log(`2W    : ${total2W - missing2W.length} / ${total2W} have images  (${missing2W.length} missing)`);
const total3W  = missing3W.reduce((n)=>n,0); // dynamic — count below
let t3=0; for(const f of fs.readdirSync(dir3W).filter(f=>f.endsWith('.json'))){const d=JSON.parse(fs.readFileSync(path.join(dir3W,f),'utf8'));t3+=(d.vehicles||[]).filter(v=>v.variant_name||v.model).length;}
console.log(`3W    : ${t3 - missing3W.length} / ${t3} have images  (${missing3W.length} missing)`);
let t4=0; for(const f of fs.readdirSync(dir4W).filter(f=>f.endsWith('.json'))){const d=JSON.parse(fs.readFileSync(path.join(dir4W,f),'utf8'));const hm=(d.vehicles||[]).some(v=>v.model);const nm=[...new Set((d.vehicles||[]).map(v=>(hm?v.model:v.variant_name)).filter(Boolean))];t4+=nm.length;}
console.log(`4W-auto: ${t4 - missing4W.length} / ${t4} have images  (${missing4W.length} missing)`);
console.log(`TOTAL  : ${missing2W.length+missing3W.length+missing4W.length} missing`);
