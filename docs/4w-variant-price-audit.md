# 4W Variant Price Audit

Generated: 2026-04-24T07:03:43.104Z

Mode: audit

Audited brand files: 33
Brand-model groups checked: 482
Checklist rows: 6023
Price mismatches: 0
Local-only variants: 719
Cardekho-only variants: 4638
Fetch / parse errors: 145
Updated local rows: 0

## Brand Summary

| Brand | Total Local Variants | Matches | Price Mismatches | Local-Only | Cardekho-Only | Errors |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Aston Martin | 8 | 7 | 0 | 1 | 2 | 0 |
| Audi | 34 | 23 | 0 | 11 | 25 | 0 |
| Bentley | 12 | 8 | 0 | 0 | 12 | 4 |
| BMW | 42 | 27 | 0 | 2 | 21 | 13 |
| BYD | 12 | 6 | 0 | 6 | 14 | 0 |
| Citroën | 40 | 0 | 0 | 0 | 0 | 40 |
| Ferrari | 8 | 7 | 0 | 1 | 2 | 0 |
| Force Motors | 9 | 0 | 0 | 0 | 0 | 9 |
| Honda | 23 | 23 | 0 | 0 | 12 | 0 |
| Hyundai | 174 | 73 | 0 | 98 | 334 | 3 |
| Isuzu | 14 | 0 | 0 | 0 | 0 | 14 |
| Jaguar | 2 | 0 | 0 | 0 | 0 | 2 |
| Jeep | 20 | 17 | 0 | 3 | 22 | 0 |
| Kia | 31 | 11 | 0 | 20 | 215 | 0 |
| Lamborghini | 9 | 6 | 0 | 3 | 6 | 0 |
| Land Rover | 34 | 25 | 0 | 9 | 13 | 0 |
| Lexus | 14 | 6 | 0 | 8 | 10 | 0 |
| Mahindra | 191 | 127 | 0 | 41 | 126 | 23 |
| Maruti Suzuki | 187 | 0 | 0 | 176 | 2789 | 11 |
| Maserati | 11 | 2 | 0 | 9 | 24 | 0 |
| Mercedes-Benz | 63 | 36 | 0 | 24 | 56 | 3 |
| MG | 39 | 32 | 0 | 7 | 24 | 0 |
| Mini | 10 | 0 | 0 | 0 | 0 | 10 |
| Nissan | 33 | 32 | 0 | 1 | 9 | 0 |
| Porsche | 24 | 5 | 0 | 19 | 29 | 0 |
| Renault | 12 | 1 | 0 | 11 | 87 | 0 |
| Rolls-Royce | 7 | 3 | 0 | 4 | 5 | 0 |
| Skoda | 18 | 1 | 0 | 17 | 64 | 0 |
| Tata | 215 | 17 | 0 | 198 | 588 | 0 |
| Toyota | 56 | 18 | 0 | 38 | 111 | 0 |
| VinFast | 13 | 0 | 0 | 0 | 0 | 13 |
| Volkswagen | 15 | 3 | 0 | 12 | 38 | 0 |
| Volvo | 5 | 5 | 0 | 0 | 0 | 0 |

## Output Files

- JSON: `outputs/catalog-validation-4w-variant-prices/4w-variant-price-audit.json`
- CSV checklist: `outputs/catalog-validation-4w-variant-prices/4w-variant-price-checklist.csv`

## Notes

- This audit compares local 4W brand JSON variant prices against the current Cardekho variants pages.
- Main public `/cars` listings still read DB-backed `car_catalog` prices, so JSON fixes alone do not automatically update that separate source.
- `LOCAL_ONLY_VARIANT` means the local variant row did not match the current Cardekho variants feed for that model.
- `CARDEKHO_ONLY_VARIANT` means Cardekho currently lists a variant we do not currently have as a local variant row.
