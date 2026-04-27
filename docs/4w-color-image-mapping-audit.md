# 4W Color Image Mapping Audit

Updated: 2026-04-23

Scope:
- Models in `lib/data/car-colors.ts` that already have 4W color text entries.
- Verification checks whether each model resolves to a local gallery in `public/data/brand-model-images/4w-galleries`.

Totals:
- Direct gallery mapping: `205`
- Explicit alias gallery mapping: `13`
- Missing gallery mapping: `9`

Explicit alias mappings now covered in code:
- `Bentley Continental GT` -> `bentley/continental`
- `Bentley Continental GTC` -> `bentley/continental`
- `BMW M8` -> `bmw/m8-coupe-competition`
- `Mahindra XUV400` -> `mahindra/xuv400-ev`
- `Mahindra Scorpio Classic` -> `mahindra/scorpio`
- `Maruti Suzuki WagonR` -> `maruti-suzuki/wagon-r`
- `Hyundai Creta EV` -> `hyundai/creta-electric`
- `Mercedes-Benz AMG GT Coupe` -> `mercedes-benz/amg-gt-4-door-coupe`
- `Toyota Fortuner` -> `toyota/Toyota_Fortuner`
- `Toyota Urban Cruiser Hyryder` -> `toyota/hyryder`
- `Toyota Rumion` -> `toyota/Toyota_Rumion`
- `VinFast VF 6` -> `vinfast/vf6`
- `VinFast VF 7` -> `vinfast/vf7`

Brands with missing gallery mapping:

| Brand | Missing models |
| --- | --- |
| BMW | `6 Series GT` |
| Honda | `WR-V` |
| Hyundai | `Prime HB`, `Prime SD` |
| Mercedes-Benz | `AMG CLE 53`, `CLE`, `V-Class` |
| VinFast | `VF 8`, `VF 9` |

Brands fully covered in this audit:
- `Aston Martin`
- `Audi`
- `Bentley`
- `BYD`
- `Jeep`
- `Kia`
- `Lamborghini`
- `Land Rover`
- `Lexus`
- `Mahindra`
- `Maruti Suzuki`
- `Skoda`
- `MG`
- `Nissan`
- `Porsche`
- `Renault`
- `Toyota`
- `Volkswagen`
- `Volvo`

Notes:
- This audit checks local 4W gallery mapping, not whether every missing model is scrapeable today.
- The Bentley-style bug is fixed for models that already have a local gallery but previously lost color images because of alias mismatch or text-color merge order.
- Remaining models above need either:
  1. a real gallery scrape, or
  2. a verified model alias mapping, if they already share a gallery with another model.
