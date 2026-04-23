# 4W Body Type Audit

Date: 2026-04-21

This is a local-only audit of the existing 4W catalog/data files in this workspace. No source catalog files were modified as part of this audit.

## Files Inspected

- `supabase/seeds/001_car_catalog.sql`
- `lib/data/cars.ts`
- `scripts/scraping/run-scraper.js`
- `lib/data/vinfast-catalog.ts`
- `lib/data/catalog-db.ts` (checked for 4W usage; it is 2W/3W-only and has no 4W source rows)

## Summary

- The primary 4W seed catalog in `supabase/seeds/001_car_catalog.sql` contains `213` rows.
- I did **not** find any rows with a blank or `NULL` `body_type` in that seed file.
- I did find a large set of rows whose `body_type` looks obviously wrong or over-defaulted. The strongest pattern is many non-hatchbacks being stored as `Hatchback`.
- The runtime/scraper pipeline still contains fallback defaults that can hide missing source data:
  - `lib/data/cars.ts:257` hardcodes `bodyType: 'SUV'` for JSON-derived fallback rows.
  - `lib/data/cars.ts:309` maps DB rows with missing `row.body_type` to `'SUV'`.
  - `scripts/scraping/run-scraper.js:257` falls back to `getSpec(['body type']) || "Hatchback"`.
- `lib/data/vinfast-catalog.ts` looks healthy for this specific audit. Every static VinFast entry already has an explicit body type.

## Why This Matters

The filter UI only works as well as the normalized `body_type` values. Right now the seed data has no blanks, but it does have a lot of likely misclassifications. That means the filters can still be wrong even when the field is technically present.

## Row-Level Findings In `supabase/seeds/001_car_catalog.sql`

These are the rows that most likely need review or correction. "Likely body type" is based on the model itself, not on live Cardekho re-checking.

### Current `Hatchback` Looks Wrong

| Line | ID | Model | Current | Likely Body Type | Notes |
| --- | --- | --- | --- | --- | --- |
| 44 | `bmw-xm` | BMW XM | Hatchback | SUV | Performance SUV, not a hatchback |
| 45 | `bmw-z4` | BMW Z4 | Hatchback | Convertible / Roadster | Sports roadster |
| 46 | `byd-atto-3` | BYD Atto 3 | Hatchback | SUV | Compact SUV/crossover |
| 47 | `byd-e6` | BYD e6 | Hatchback | MPV | MPV/people mover |
| 51 | `byd-sealion-7` | BYD Sealion 7 | Hatchback | SUV | Electric SUV/crossover |
| 53 | `citroen-basalt` | Citroen Basalt | Hatchback | SUV / Coupe-SUV | Not a standard hatchback |
| 54 | `force-gurkha` | Force Gurkha | Hatchback | SUV | Off-road SUV |
| 62 | `honda-elevate` | Honda Elevate | Hatchback | SUV | Compact SUV |
| 63 | `hyundai-alcazar` | Hyundai Alcazar | Hatchback | SUV | 3-row SUV |
| 74 | `isuzu-d-max` | Isuzu D-Max | Hatchback | Pickup | Utility pickup |
| 76 | `jaguar-f-pace` | Jaguar F-Pace | Hatchback | SUV | Luxury SUV |
| 81 | `kia-carens` | Kia Carens | Hatchback | MPV | MPV/MUV |
| 84 | `kia-ev9` | Kia EV9 | Hatchback | SUV | Large electric SUV |
| 87 | `kia-syros` | Kia Syros | Hatchback | SUV | SUV/crossover positioning |
| 98 | `lexus-es` | Lexus ES | Hatchback | Sedan | Executive sedan |
| 100 | `lexus-lm` | Lexus LM | Hatchback | MPV | Luxury MPV/van |
| 101 | `lexus-ls` | Lexus LS | Hatchback | Sedan | Flagship sedan |
| 105 | `mahindra-be-6` | Mahindra BE 6 | Hatchback | SUV / Coupe-SUV | Not a hatchback |
| 114 | `mahindra-xev-9e` | Mahindra XEV 9e | Hatchback | SUV / Coupe-SUV | Not a hatchback |
| 127 | `maruti-suzuki-fronx` | Maruti Suzuki Fronx | Hatchback | SUV / Crossover | Marketed as crossover/SUV |
| 130 | `maruti-suzuki-invicto` | Maruti Suzuki Invicto | Hatchback | MPV | MPV |
| 134 | `maruti-suzuki-victoris` | Maruti Suzuki Victoris | Hatchback | Review required | Model itself looks suspicious; body type likely placeholder too |
| 143 | `mercedes-benz-cle` | Mercedes-Benz CLE | Hatchback | Coupe / Convertible | Not a hatchback |
| 168 | `mini-countryman` | MINI Countryman | Hatchback | SUV / Crossover | Crossover SUV |
| 170 | `nissan-x-trail` | Nissan X-Trail | Hatchback | SUV | SUV |
| 176 | `renault-kiger` | Renault Kiger | Hatchback | SUV | Compact SUV |
| 178 | `renault-triber` | Renault Triber | Hatchback | MPV | MPV |
| 186 | `tata-curvv` | Tata Curvv | Hatchback | SUV / Coupe-SUV | Not a standard hatchback |
| 187 | `tata-curvv-ev` | Tata Curvv EV | Hatchback | SUV / Coupe-SUV | Not a standard hatchback |
| 196 | `tata-sierra` | Tata Sierra | Hatchback | SUV | SUV |
| 208 | `toyota-rumion` | Toyota Rumion | Hatchback | MPV | MPV |
| 210 | `toyota-urban-cruiser-hyryder` | Toyota Urban Cruiser Hyryder | Hatchback | SUV | SUV |
| 211 | `toyota-vellfire` | Toyota Vellfire | Hatchback | MPV | Luxury MPV |
| 212 | `volkswagen-taigun` | Volkswagen Taigun | Hatchback | SUV | SUV |
| 213 | `volkswagen-tiguan` | Volkswagen Tiguan | Hatchback | SUV | SUV |
| 218 | `volvo-s90` | Volvo S90 | Hatchback | Sedan | Luxury sedan |

### Current `Sedan` Looks Wrong

| Line | ID | Model | Current | Likely Body Type | Notes |
| --- | --- | --- | --- | --- | --- |
| 22 | `bentley-continental` | Bentley Continental | Sedan | Coupe / Convertible | Grand tourer, not sedan |
| 33 | `bmw-m2` | BMW M2 | Sedan | Coupe | Coupe |
| 36 | `bmw-m4-competition` | BMW M4 Competition | Sedan | Coupe | Coupe |
| 38 | `bmw-m8-coupe-competition` | BMW M8 Coupe Competition | Sedan | Coupe | Coupe |
| 50 | `byd-sealion-6` | BYD Sealion 6 | Sedan | SUV | SUV/crossover |
| 52 | `citroen-aircross` | Citroen Aircross | Sedan | SUV | SUV/crossover |
| 215 | `volvo-ec40` | Volvo EC40 | Sedan | SUV / Crossover | Electric crossover, not sedan |

### Current `SUV` Looks Wrong

| Line | ID | Model | Current | Likely Body Type | Notes |
| --- | --- | --- | --- | --- | --- |
| 82 | `kia-carnival` | Kia Carnival | SUV | MPV | MPV |
| 109 | `mahindra-marazzo` | Mahindra Marazzo | SUV | MPV | MPV |
| 126 | `maruti-suzuki-ertiga` | Maruti Suzuki Ertiga | SUV | MPV | MPV |
| 136 | `maruti-suzuki-xl6` | Maruti Suzuki XL6 | SUV | MPV | MPV / crossover MPV |
| 204 | `toyota-hilux` | Toyota Hilux | SUV | Pickup | Pickup truck, not SUV |
| 205 | `toyota-innova-crysta` | Toyota Innova Crysta | SUV | MPV | MPV |
| 206 | `toyota-innova-hycross` | Toyota Innova Hycross | SUV | MPV | MPV |

## Observations About Taxonomy

- The seed file only uses four body types: `Coupe`, `Hatchback`, `SUV`, `Sedan`.
- That is probably too narrow for the actual catalog. Several models above would be better represented as `MPV`, `Pickup`, `Convertible`, `Roadster`, `Crossover`, or `Coupe SUV`.
- Even if the product wants a smaller final filter set, the current source values still look over-defaulted rather than intentionally normalized.

## Source Of Likely Bad Defaults

### `lib/data/cars.ts`

- `lib/data/cars.ts:257`:
  - JSON-derived fallback rows are created with `bodyType: 'SUV'` regardless of the real model.
- `lib/data/cars.ts:309`:
  - Any DB row with missing `body_type` becomes `'SUV'`.

### `scripts/scraping/run-scraper.js`

- `scripts/scraping/run-scraper.js:257`:
  - The scraper uses `getSpec(['body type']) || "Hatchback"`.
  - This is a likely reason so many non-hatchback rows ended up classified as `Hatchback`.

## Recommended Cleanup Order

1. Remove or tighten the fallback default in `scripts/scraping/run-scraper.js` so missing specs do not silently become `Hatchback`.
2. Revisit the 44 suspicious rows in `supabase/seeds/001_car_catalog.sql`.
3. Decide on a canonical 4W body-type taxonomy before re-scraping or patching rows:
   - minimum likely set: `Hatchback`, `Sedan`, `SUV`, `MPV`, `Pickup`, `Coupe`, `Convertible`
4. After cleanup, avoid runtime defaults like `'SUV'` in `lib/data/cars.ts` unless the UI explicitly needs a presentation fallback that does not contaminate filtering logic.
