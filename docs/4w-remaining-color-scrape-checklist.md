# 4W Remaining Color Scrape Checklist

Updated: 2026-04-27

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
| BMW | 6 Series GT | scraped | `13` colors saved from the exact legacy `BMW 6 Series` Cardekho colors page; `Space Grey` is still named on-page but has no downloadable image URL in current HTML |
| BMW | M8 | alias_mapped | Uses `bmw/m8-coupe-competition` |
| BMW | X4 | scraped | `3` colors saved |
| BYD | e6 | scraped | `4` colors saved |
| Honda | WR-V | scraped | `8` colors saved |
| Hyundai | Prime HB | scraped | `3` exact color images mapped from Hyundai's official taxi page |
| Hyundai | Prime SD | scraped | `3` exact color images mapped from Hyundai's official taxi page |
| Mahindra | Scorpio Classic | alias_mapped | Uses `mahindra/scorpio` |
| Mahindra | XUV300 | scraped | `11` colors saved |
| Maruti Suzuki | WagonR | alias_mapped | Uses `maruti-suzuki/wagon-r` |

## Batch B

| Brand | Model | Status | Notes |
| --- | --- | --- | --- |
| Mercedes-Benz | AMG CLE 53 | scraped | `6` exact color images mapped from CarWale's live AMG CLE colour page |
| Mercedes-Benz | AMG E 53 Cabriolet | scraped | `5` colors saved |
| Mercedes-Benz | AMG EQS | scraped | `7` colors saved |
| Mercedes-Benz | AMG GT Coupe | alias_mapped | Uses `mercedes-benz/amg-gt-4-door-coupe` |
| Mercedes-Benz | AMG S 63 | scraped | `9` colors saved |
| Mercedes-Benz | CLE | scraped | Current project `CLE` row is AMG CLE 53-based; reused the same verified `6` AMG CLE color images |
| Mercedes-Benz | CLE Cabriolet | scraped | `4` colors saved |
| Mercedes-Benz | V-Class | scraped | `5` exact color images mapped from CarWale's live V-Class colour page |
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
| VinFast | VF 8 | scraped | `8` exact color images mapped from VinFast's official color page |
| VinFast | VF 9 | scraped | `8` exact color images mapped from VinFast's official color page |

## Already Alias-Mapped In Code

| Brand | Model | Status | Notes |
| --- | --- | --- | --- |
| Bentley | Continental GT | alias_mapped | Uses `bentley/continental` |
| Bentley | Continental GTC | alias_mapped | Uses `bentley/continental` |
| Mahindra | XUV400 | alias_mapped | Uses `mahindra/xuv400-ev` |
| Hyundai | Creta EV | alias_mapped | Uses `hyundai/creta-electric` |
