# 4W Variant Price Audit

Generated: 2026-04-26T17:46:26.574Z

Mode: audit

Audited brand files: 33
Brand-model groups checked: 438
Checklist rows: 4824
Price mismatches: 0
Local-only variants: 495
Cardekho-only variants: 3425
Fetch / parse errors: 139
Updated local rows: 0

## Brand Summary

| Brand | Total Local Variants | Matches | Price Mismatches | Local-Only | Cardekho-Only | Errors |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Aston Martin | 8 | 8 | 0 | 0 | 0 | 0 |
| Audi | 37 | 25 | 0 | 12 | 20 | 0 |
| Bentley | 12 | 8 | 0 | 0 | 12 | 4 |
| BMW | 53 | 40 | 0 | 2 | 4 | 11 |
| BYD | 12 | 6 | 0 | 6 | 14 | 0 |
| Citroën | 40 | 0 | 0 | 0 | 0 | 40 |
| Ferrari | 8 | 7 | 0 | 1 | 2 | 0 |
| Force Motors | 9 | 3 | 0 | 0 | 0 | 6 |
| Honda | 23 | 23 | 0 | 0 | 12 | 0 |
| Hyundai | 174 | 83 | 0 | 88 | 313 | 3 |
| Isuzu | 14 | 0 | 0 | 0 | 0 | 14 |
| Jaguar | 2 | 1 | 0 | 0 | 0 | 1 |
| Jeep | 20 | 17 | 0 | 3 | 22 | 0 |
| Kia | 31 | 21 | 0 | 10 | 194 | 0 |
| Lamborghini | 9 | 8 | 0 | 1 | 2 | 0 |
| Land Rover | 34 | 25 | 0 | 9 | 17 | 0 |
| Lexus | 14 | 6 | 0 | 8 | 10 | 0 |
| Mahindra | 191 | 150 | 0 | 18 | 79 | 23 |
| Maruti Suzuki | 187 | 61 | 0 | 115 | 1927 | 11 |
| Maserati | 11 | 3 | 0 | 8 | 23 | 0 |
| Mercedes-Benz | 63 | 37 | 0 | 23 | 54 | 3 |
| MG | 39 | 35 | 0 | 4 | 21 | 0 |
| Mini | 10 | 0 | 0 | 0 | 0 | 10 |
| Nissan | 33 | 32 | 0 | 1 | 9 | 0 |
| Porsche | 24 | 7 | 0 | 17 | 25 | 0 |
| Renault | 12 | 2 | 0 | 10 | 85 | 0 |
| Rolls-Royce | 7 | 6 | 0 | 1 | 2 | 0 |
| Skoda | 18 | 10 | 0 | 8 | 47 | 0 |
| Tata | 215 | 88 | 0 | 127 | 433 | 0 |
| Toyota | 56 | 45 | 0 | 11 | 61 | 0 |
| VinFast | 13 | 0 | 0 | 0 | 0 | 13 |
| Volkswagen | 15 | 3 | 0 | 12 | 37 | 0 |
| Volvo | 5 | 5 | 0 | 0 | 0 | 0 |

## Output Files

- JSON: `outputs/catalog-validation-4w-variant-prices/4w-variant-price-audit.json`
- CSV checklist: `outputs/catalog-validation-4w-variant-prices/4w-variant-price-checklist.csv`

## Notes

- This audit compares local 4W brand JSON variant prices against the current Cardekho variants pages.
- Main public `/cars` listings still read DB-backed `car_catalog` prices, so JSON fixes alone do not automatically update that separate source.
- `LOCAL_ONLY_VARIANT` means the local variant row did not match the current Cardekho variants feed for that model.
- `CARDEKHO_ONLY_VARIANT` means Cardekho currently lists a variant we do not currently have as a local variant row.
