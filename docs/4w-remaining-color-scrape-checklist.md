# 4W Remaining Color Scrape Checklist

Updated: 2026-04-23

Goal:
- Capture all available 4W color images for the remaining models that still have color text but no resolved local gallery mapping.
- After scrape, map each successful gallery back into the live model path.

Status legend:
- `pending`: not yet rechecked in this pass
- `scraped`: local gallery metadata exists and color images were saved
- `alias_mapped`: existing local gallery reused through verified alias mapping
- `blocked`: still not safely scrapeable or not enough source data yet

## Batch A

| Brand | Model | Status | Notes |
| --- | --- | --- | --- |
| Audi | A8 L | scraped | `10` colors saved |
| Audi | SQ8 | scraped | `8` colors saved |
| BMW | 6 Series GT | blocked | Source returned no downloadable color images |
| BMW | M8 | alias_mapped | Uses `bmw/m8-coupe-competition` |
| BMW | X4 | scraped | `3` colors saved |
| BYD | e6 | scraped | `4` colors saved |
| Honda | WR-V | blocked | Source returned no downloadable color images |
| Hyundai | Prime HB | blocked | Source returned no downloadable color images |
| Hyundai | Prime SD | blocked | Source returned no downloadable color images |
| Mahindra | Scorpio Classic | alias_mapped | Uses `mahindra/scorpio` |
| Mahindra | XUV300 | scraped | `11` colors saved |
| Maruti Suzuki | WagonR | alias_mapped | Uses `maruti-suzuki/wagon-r` |

## Batch B

| Brand | Model | Status | Notes |
| --- | --- | --- | --- |
| Mercedes-Benz | AMG CLE 53 | blocked | Source returned no downloadable color images |
| Mercedes-Benz | AMG E 53 Cabriolet | scraped | `5` colors saved |
| Mercedes-Benz | AMG EQS | scraped | `7` colors saved |
| Mercedes-Benz | AMG GT Coupe | alias_mapped | Uses `mercedes-benz/amg-gt-4-door-coupe` |
| Mercedes-Benz | AMG S 63 | scraped | `9` colors saved |
| Mercedes-Benz | CLE | blocked | No clean standalone source target confirmed |
| Mercedes-Benz | CLE Cabriolet | scraped | `4` colors saved |
| Mercedes-Benz | V-Class | blocked | Source returned no downloadable color images |
| Skoda | Octavia | scraped | `5` colors saved |
| Skoda | Superb | scraped | `3` colors saved |
| Toyota | Fortuner | alias_mapped | Uses `toyota/Toyota_Fortuner` |
| Toyota | Urban Cruiser Hyryder | alias_mapped | Uses `toyota/hyryder` |
| Toyota | Rumion | alias_mapped | Uses `toyota/Toyota_Rumion` |

## Batch C

| Brand | Model | Status | Notes |
| --- | --- | --- | --- |
| VinFast | VF 6 | alias_mapped | Uses `vinfast/vf6` |
| VinFast | VF 7 | alias_mapped | Uses `vinfast/vf7` |
| VinFast | VF 8 | blocked | Source returned no downloadable color images |
| VinFast | VF 9 | blocked | Source returned no downloadable color images |

## Already Alias-Mapped In Code

| Brand | Model | Status | Notes |
| --- | --- | --- | --- |
| Bentley | Continental GT | alias_mapped | Uses `bentley/continental` |
| Bentley | Continental GTC | alias_mapped | Uses `bentley/continental` |
| Mahindra | XUV400 | alias_mapped | Uses `mahindra/xuv400-ev` |
| Hyundai | Creta EV | alias_mapped | Uses `hyundai/creta-electric` |
