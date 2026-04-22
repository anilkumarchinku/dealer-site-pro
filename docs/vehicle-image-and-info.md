# Vehicle Image & Info — Complete Reference

> **Purpose:** Quick reference for agents and developers to know exactly where vehicle data and images live, what format they're in, and which directory to use for each vehicle category.
>
> **Last updated:** 2026-04-22

---

## 1. Vehicle Data (JSON)

### 4W Cars

| File / Directory | Purpose | Format |
|-----------------|---------|--------|
| `public/data/{brand}.json` (35 files) | **Primary data source** — full variant specs per brand | `{ brand, vehicles: [{ model, variant_name, ex_showroom_price, engine_specs, ... }] }` |
| `public/carInfo.json` (752KB) | Legacy consolidated file — all brands in one | Nested by brand slug → variant index |
| `public/data/4w-auto/*.json` (6 files) | Commercial vehicles (trucks, vans) | Same structure as 4W cars |
| `lib/data/brand-models.json` | NOT in public — model classification for 2W/3W only | — |

**4W brand files:** `aston_martin.json`, `audi.json`, `bajaj.json`, `bentley.json`, `bmw.json`, `byd.json`, `citroen.json`, `ferrari.json`, `force.json`, `honda.json`, `hyundai.json`, `isuzu.json`, `jaguar.json`, `jeep.json`, `kia.json`, `lamborghini.json`, `land_rover.json`, `lexus.json`, `mahindra.json`, `maruti_suzuki.json`, `maruti_suzuki_all_models.json`, `maserati.json`, `mercedes.json`, `mg.json`, `mini.json`, `nissan.json`, `porsche.json`, `renault.json`, `rolls_royce.json`, `skoda.json`, `tata.json`, `toyota.json`, `vinfast.json`, `volkswagen.json`, `volvo.json`

**4W-auto brand files:** `ashok-leyland.json`, `eicher.json`, `force.json`, `mahindra.json`, `maruti-suzuki.json`, `tata.json`

### 2W Bikes & Scooters

| File / Directory | Purpose | Count |
|-----------------|---------|-------|
| `public/data/2w/*.json` | One file per brand — model specs, prices, engine details | 68 brand files |

**Key fields:** `model`, `variant_name`, `price`/`ex_showroom_price`, `engine_displacement`, `mileage`, `fuel_type`, `top_speed`, `max_power`

**API route:** `/api/bikes` reads from these files  
**API detail:** `/api/bikes/[id]` reads from these files

### 3W Autos / Three-Wheelers

| File / Directory | Purpose | Count |
|-----------------|---------|-------|
| `public/data/3w/*.json` | One file per brand — variant specs, prices | 18 brand files |

**3W brands:** altigreen, atul-auto, bajaj-auto-3w, etrio, euler-motors, greaves-electric-3w, kinetic-green, lohia-auto, mahindra-3w, montra-ev, omega-seiki-mobility, osm, piaggio-ape, saera-ev, terra-motors, tvs-king, yc-ev, youdha

**Two JSON formats exist:**
- **Flat fields** (Piaggio, Bajaj): `fuel_type`, `engine_cc`, `max_power`, `passenger_capacity`, `vehicle_category`, `gvw_kg`, `transmission_type`
- **Nested fields** (Mahindra, Atul, others): `technical_specifications.fuel_type`, `engine_details.displacement`, `payload_features.payload_capacity`

API code must check flat first, then nested fallback.

**API route:** `/api/autos` reads from these files  
**API detail:** `/api/autos/[id]` reads from these files

### Reference / Classification Data

| File | Purpose |
|------|---------|
| `public/data/brand-models.json` | Master list of all 2W and 3W models with type classification (motorcycle/scooter, passenger/cargo/electric) |
| `public/data/brand-colors.json` | Brand color schemes (primary, secondary, accent) for 2W/3W brands |
| `public/data/3w-brand-colors.json` | 3W-specific brand colors |
| `public/data/vehicle-image-urls.json` | Maps local image paths to Supabase storage URLs (CDN fallback) |
| `lib/data/brand-models.json` | Same classification data, used by API routes server-side |

---

## 2. Vehicle Images

### 2W Bike/Scooter Images

| Directory | Purpose | Count | Used by |
|-----------|---------|-------|---------|
| `public/data/brand-model-images/2w/{brandId}/{model-slug}.jpg` | Hero image per model | 69 brands, 872 images | `/api/bikes`, bike cards |
| `public/data/brand-model-images/2w-colors/{brandId}/{model-slug}/` | Color variant images + `metadata.json` | 61 brands, 1,977 images | `/api/bikes/colors`, bike detail page |

**Image naming:** kebab-case slug of model name. E.g., "Splendor Plus" → `splendor-plus.jpg`

### 3W Auto Images

| Directory | Purpose | Count | Naming Convention |
|-----------|---------|-------|-------------------|
| **`public/images/3w/{brandId}/`** | **COMPLETE set, correct slugs** | 18 brands, ~250 images | Full model slug: `ape-auto-plus.jpg`, `ape-truk-plus.jpg` |
| `public/data/brand-model-images/3w/{brandId}/` | Partial set, inconsistent naming | 80 brand dirs, 192 images | Often stripped prefix: `auto-plus.jpg`, `city-plus.jpg` |

**IMPORTANT:** `images/3w/` has 100% coverage (all 151 models matched). `data/brand-model-images/3w/` has only ~91% with fuzzy matching. The resolver (`lib/utils/resolve-3w-images.ts`) scans both directories with `images/3w/` taking priority.

**Image naming in `images/3w/`:** Direct kebab-case of JSON model name.
- "Ape Auto Plus" → `ape-auto-plus.jpg`
- "YC Electric Yatri" → NOT here (uses brandId `yc-ev`, slug `yatri.jpg`)
- "King Duramax" → `king-duramax.jpg`

### 4W Car Images

| Directory | Purpose | Count | Used by |
|-----------|---------|-------|---------|
| **`public/assets/cars/{brandId}/`** | Curated hero images (highest quality) | 33 brands, 312 images | Car cards, detail pages (priority 1) |
| `public/data/brand-model-images/4w/{brandId}/` | Scraped hero images from CardDekho | 37 brands, 286 images | Fallback when curated not available |
| `public/data/brand-model-images/4w-galleries/{brandId}/{model}/` | Color variant gallery images | 36 brands, 2,348 images | Car detail page color section |

**Priority order** (defined in `lib/utils/brand-model-images.ts` → `getVehicleImageUrls`):
1. `assets/cars/{brandId}/{slug}.[jpg|png|webp]` — curated
2. DB `image_url` (CardDekho CDN) — if not a placeholder
3. `data/brand-model-images/4w/{brandId}/{slug}.[jpg|png|webp]` — scraped

**Curated asset brands (33):** aston-martin, audi, bentley, bmw, byd, citroen, ferrari, force-motors, honda, hyundai, isuzu, jaguar, jeep, kia, lamborghini, land-rover, lexus, mahindra, maruti-suzuki, maserati, mercedes-benz, mg, mini, nissan, porsche, renault, rolls-royce, skoda, tata, toyota, vinfast, volkswagen, volvo

### 4W Commercial Vehicle Images

| Directory | Purpose |
|-----------|---------|
| `public/images/4w-auto/{brandId}/` | Truck/van images matching `data/4w-auto/` JSON data |

**Brands:** ashok-leyland, eicher, force, mahindra, maruti-suzuki, tata

### Legacy / Old Scrape Images

| Directory | Purpose | Count |
|-----------|---------|-------|
| `public/data/brand-model-images/{brandId}/` (root-level, NOT under 2w/3w/4w) | Old scraping run with different brand ID naming | 154 brand dirs, 812 images |

These are NOT organized by vehicle category. Many overlap with the `2w/` subdirectory but use different brand folder names (e.g., `honda-scooter/` vs `honda-hmsi/` in `2w/`). **12 directories are completely empty.**

---

## 3. Brand Assets

| Directory | Purpose | Count |
|-----------|---------|-------|
| `public/assets/logos/` | Brand logos (PNG/SVG) — primary set | ~50 files |
| `public/assets/logos/2w/` | 2W-specific brand logos | subset |
| `public/data/brand-logos/` | Another set of brand logos (4.6MB) | duplicate |
| `public/brands/` | Yet another set of brand PNGs | 28 files |
| `public/assets/hero/` | Full-width brand banner/hero images for brand listing pages | 33 images |
| `public/assets/hero-images/` | Only maruti-suzuki.jpg and tata-motors.jpg | 2 images |

---

## 4. App / UI Assets

| File / Directory | Purpose |
|-----------------|---------|
| `public/assets/templates/` | 5 dealer website template previews: family, luxury, modern, professional, sporty |
| `public/images/dealer-type-*.png` | 3 dealer type illustrations: hybrid, new, used |
| `public/images/template-*.png` | 4 template preview thumbnails |
| `public/patterns/*.svg` | 4 background patterns: camo, tire-tread, topographic-map, wood-grain |
| `public/favicon.svg` | Site favicon |
| `public/manifest.json` | PWA manifest |
| `public/sw.js` | Service worker for offline support |

---

## 5. Dev / Debug / Scraping Artifacts

| File / Directory | Purpose |
|-----------------|---------|
| `public/brand-colors-preview.html` | HTML preview page for brand color schemes |
| `public/model-images-preview.html` | HTML preview page for model images |
| `public/images/scrape-results.json` | Log of scraping results |
| `public/scraped/trucks-cardekho/` | Raw scraped data from TrucksDekho (brand-logos, electric-vehicles, news, segments, spotlight, videos) |
| `public/assets/logos/check_logos.py` | Python script to verify logo files |
| `public/assets/logos/remove_bg.py` | Python script to remove logo backgrounds |

---

## 6. Image Resolution Logic

### How image URLs are resolved per category

**2W (`/api/bikes`):**
```
getVehicleImageUrls('2w', brandId, model)
→ /data/brand-model-images/2w/{brandId}/{slug}.[jpg|png|webp]
→ Supabase storage fallback
```

**3W (`/api/autos`):**
```
get3wVehicleImageUrls(brandId, model)  — server-side filesystem scan
→ /images/3w/{brandId}/{slug}.[jpg|png|webp]           (priority — 100% coverage)
→ /data/brand-model-images/3w/{brandId}/{slug}.[ext]   (fallback)
→ getVehicleImageUrls('3w', ...) heuristic fallback    (if neither found)
```

**4W (`car-service.ts`):**
```
getVehicleImageUrls('4w', brandId, model, dbImageUrl)
→ /assets/cars/{brandId}/{slug}.[jpg|png|webp]         (curated — priority)
→ dbImageUrl (CardDekho CDN)                           (if not placeholder)
→ /data/brand-model-images/4w/{brandId}/{slug}.[ext]   (scraped fallback)
```

### Brand ID mapping

Brand display names from JSON/DB don't always match folder names. The mapping is in `lib/utils/brand-model-images.ts`:

- `BRAND_FOLDER_MAP_2W` — e.g., "Honda" → `honda-hmsi`, "TVS" → `tvs-motor`
- `BRAND_FOLDER_MAP_3W` — e.g., "Piaggio" → `piaggio-ape`, "TVS" → `tvs-king`
- `BRAND_FOLDER_MAP_4W` — e.g., "Maruti Suzuki" → `maruti-suzuki`, "Mercedes-Benz" → `mercedes-benz`

### Slug generation

`modelToSlug(model)` in `lib/utils/brand-model-images.ts`:
- Lowercase
- Remove periods
- Replace spaces/special chars with hyphens
- Trim leading/trailing hyphens

Example: "Splendor Plus Xtec 2.0" → `splendor-plus-xtec-20`

---

## 7. Total File Counts

| Category | Files | Size |
|----------|-------|------|
| 2W images | 872 | 79 MB |
| 2W color images | 1,977 | 71 MB |
| 3W images (images/3w) | ~250 | part of 41 MB |
| 3W images (brand-model-images/3w) | 192 | 27 MB |
| 4W curated images | 312 | 10 MB |
| 4W scraped images | 286 | 58 MB |
| 4W gallery images | 2,348 | 52 MB |
| Legacy root-level images | 812 | varies |
| Brand logos/assets | ~130 | ~10 MB |
| JSON data files | ~130 | ~2 MB |
| **Total** | **~7,610** | **396 MB** |
