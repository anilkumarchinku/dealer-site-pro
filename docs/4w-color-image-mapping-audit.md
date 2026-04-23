# 4W Color Image Mapping Audit

Updated: 2026-04-23

Scope:
- Models in `lib/data/car-colors.ts` that already have 4W color text entries.
- Verification checks whether each model resolves to a local gallery in `public/data/brand-model-images/4w-galleries`.

Totals:
- Direct gallery mapping: `194`
- Explicit alias gallery mapping: `4`
- Missing gallery mapping: `29`

Explicit alias mappings now covered in code:
- `Bentley Continental GT` -> `bentley/continental`
- `Bentley Continental GTC` -> `bentley/continental`
- `Mahindra XUV400` -> `mahindra/xuv400-ev`
- `Hyundai Creta EV` -> `hyundai/creta-electric`

Brands with missing gallery mapping:

| Brand | Missing models |
| --- | --- |
| Audi | `A8 L`, `SQ8` |
| BMW | `6 Series GT`, `M8`, `X4` |
| BYD | `e6` |
| Honda | `WR-V` |
| Hyundai | `Prime HB`, `Prime SD` |
| Mahindra | `Scorpio Classic`, `XUV300` |
| Maruti Suzuki | `WagonR` |
| Mercedes-Benz | `AMG CLE 53`, `AMG E 53 Cabriolet`, `AMG EQS`, `AMG GT Coupe`, `AMG S 63`, `CLE`, `CLE Cabriolet`, `V-Class` |
| Skoda | `Octavia`, `Superb` |
| Toyota | `Fortuner`, `Urban Cruiser Hyryder`, `Rumion` |
| VinFast | `VF 6`, `VF 7`, `VF 8`, `VF 9` |

Brands fully covered in this audit:
- `Aston Martin`
- `Bentley`
- `Jeep`
- `Kia`
- `Lamborghini`
- `Land Rover`
- `Lexus`
- `MG`
- `Nissan`
- `Porsche`
- `Renault`
- `Volkswagen`
- `Volvo`

Notes:
- This audit checks local 4W gallery mapping, not whether every missing model is scrapeable today.
- The Bentley-style bug is fixed for models that already have a local gallery but previously lost color images because of alias mismatch or text-color merge order.
- Remaining models above need either:
  1. a real gallery scrape, or
  2. a verified model alias mapping, if they already share a gallery with another model.
