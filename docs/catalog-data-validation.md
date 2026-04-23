# Catalog Data Validation

Generated on: 2026-04-21

This document is generated from the current repository data to support brand, model, variant, and colour validation.

## Method

- 4W counts come from `public/data/*.json` detailed car files, with colour counts from `lib/data/car-colors.ts`.
- 3W counts come from `public/data/brand-models.json` plus raw model files in `public/data/3w/*.json`, with colour counts from `lib/data/3w-model-colors.ts`.
- 2W counts come directly from `public/data/2w/*.json`, where model-level variants and colours are already stored.
- If a brand exists in the catalog list but does not have a matching raw detail file yet, the document keeps the brand visible and shows source coverage clearly.

## Summary

| Category | Brands | Models | Variants |
| --- | ---: | ---: | ---: |
| 4W | 22 | 199 | 994 |
| 3W | 17 | 89 | 137 |
| 2W | 68 | 540 | 923 |

## Coverage Notes

- 4W catalog brand list in `brand-models.json`: 33
- 4W brands with detailed per-model JSON currently available: 22
- 4W catalog brands still missing detailed model files: Maruti Suzuki, Honda, Jeep, Citroen, Force Motors, Isuzu, Mercedes-Benz, Lamborghini, Jaguar, Lexus, Mini
- 3W catalog brands in `brand-models.json`: 17
- 3W brands with raw source files currently available: 13
- 3W catalog brands missing raw source files: Force Motors, Numeros Motors, VLF, Yo Electric
- 2W catalog brands in `brand-models.json`: 60
- 2W brands with detailed JSON currently available: 68

## 4W Brands

**Totals:** 22 brands, 199 models, 994 variants

### Aston Martin

Source: `public/data/aston_martin.json`

Brand totals: 6 models, 8 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| DB11 | 1 | 0 | V8 |
| DB12 | 2 | 14 | V8, Volante |
| DBS Superleggera | 1 | 0 | V12 |
| DBX | 2 | 9 | DBX707, V8 |
| Vanquish | 1 | 10 | V12 |
| Vantage | 1 | 9 | V8 |

### Audi

Source: `public/data/audi.json`

Brand totals: 15 models, 34 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| A4 | 4 | 5 | Premium, Premium Plus, Signature Edition, Technology |
| A6 | 2 | 5 | 45 TFSI Premium Plus, 45 TFSI Technology |
| A8 L | 1 | 8 | 55 TFSI |
| e-tron GT | 1 | 9 | e-tron GT Quattro |
| Q3 | 2 | 5 | 40 TFSI Premium Plus, 40 TFSI Technology |
| Q3 Sportback | 2 | 5 | 40 TFSI Premium Plus, 40 TFSI Technology |
| Q5 | 4 | 5 | Bold Edition, Premium Plus, Signature Line, Technology |
| Q7 | 4 | 5 | Bold Edition, Premium Plus, Signature Edition, Technology |
| Q8 | 2 | 6 | 55 TFSI Premium Plus, 55 TFSI Technology |
| Q8 e-tron | 3 | 9 | 55 quattro Premium Plus, 55 quattro Technology, SQ8 e-tron |
| Q8 Sportback e-tron | 3 | 9 | 55 quattro Premium Plus, 55 quattro Technology, SQ8 Sportback e-tron |
| RS e-tron GT | 1 | 9 | RS e-tron GT Quattro |
| RS Q8 | 2 | 8 | Performance, RS Q8 |
| S5 Sportback | 2 | 7 | 3.0L TFSI, Platinum Edition |
| SQ8 | 1 | 7 | TFSI |

### Bentley

Source: `public/data/bentley.json`

Brand totals: 4 models, 12 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Bentayga | 5 | 7 | Azure, EWB, EWB Azure First Edition, S, V8 |
| Continental GT | 3 | 10 | Mulliner V8, Speed, V8 |
| Continental GTC | 1 | 10 | Mulliner W12 |
| Flying Spur | 3 | 10 | Mulliner W12, V6 Hybrid, V8 |

### BMW

Source: `public/data/bmw.json`

Brand totals: 27 models, 42 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 2 Series Gran Coupe | 2 | 4 | 218 M Sport, 218 M Sport Pro |
| 3 Series | 2 | 5 | M340i 50 Jahre Edition, M340i xDrive |
| 3 Series Gran Limousine | 3 | 4 | 330Li M Sport, M340i 50 Jahre Edition, M340i xDrive |
| 5 Series | 1 | 5 | 530Li |
| 6 Series GT | 4 | 4 | 620d M Sport, 620d M Sport Signature, 630d M Sport, 630i M Sport |
| 7 Series | 2 | 6 | 740d M Sport, 740i M Sport |
| 8 Series Gran Coupe | 2 | 0 | 840i M Sport, M850i xDrive |
| i4 | 1 | 3 | eDrive35 M Sport |
| i5 | 1 | 11 | M60 xDrive |
| i7 | 2 | 7 | eDrive50 M Sport, M70 xDrive |
| iX | 1 | 7 | xDrive50 |
| iX1 | 1 | 5 | LWB |
| M2 | 3 | 8 | Coupe, Coupe Manual, CS |
| M4 | 2 | 10 | Competition xDrive, CS xDrive |
| M4 Competition | 1 | 0 | xDrive |
| M5 | 1 | 7 | xDrive |
| M8 | 1 | 9 | Coupe Competition 50 Jahre |
| M8 Coupe Competition | 1 | 0 | Coupe Competition 50 Jahre |
| M340i | 2 | 0 | 50 Jahre Edition, xDrive |
| X1 | 2 | 6 | sDrive18d M Sport, sDrive18i M Sport |
| X3 | 1 | 4 | xDrive 20 M Sport |
| X4 | 1 | 2 | M40i |
| X5 | 1 | 6 | xDrive40i xLine |
| X5 M Competition | 1 | 0 | Competition |
| X7 | 1 | 6 | xDrive40i M Sport Signature |
| XM | 1 | 7 | xDrive |
| Z4 | 1 | 6 | M40i |

### BYD

Source: `public/data/byd.json`

Brand totals: 4 models, 12 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Atto 3 | 3 | 4 | Dynamic, Premium, Superior |
| eMAX 7 | 4 | 4 | Premium 6-Seater, Premium 7-Seater, Superior 6-Seater, Superior 7-Seater |
| Seal | 3 | 4 | Dynamic, Performance, Premium |
| Sealion 7 | 2 | 4 | Performance, Premium |

### Ferrari

Source: `public/data/ferrari.json`

Brand totals: 8 models, 8 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 12Cilindri | 1 | 0 | V12 |
| 296 GTB | 1 | 0 | Assetto Fiorano |
| 849 Testarossa | 1 | 0 | PHEV |
| Amalfi | 1 | 0 | V8 |
| F8 Tributo | 1 | 0 | V8 Turbo |
| Purosangue | 1 | 0 | V12 |
| Roma | 1 | 0 | V8 |
| SF90 Stradale | 1 | 0 | Assetto Fiorano |

### Hyundai

Source: `public/data/hyundai.json`

Brand totals: 16 models, 174 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Alcazar | 27 | 9 | Corporate Diesel AT, Corporate Diesel MT, Executive, Executive Diesel, Executive Diesel Matte, Executive Matte, Platinum, Platinum 6Str DCT, Platinum 6Str DCT Matte, Platinum 6Str Diesel AT, Platinum DCT, Platinum DCT Matte, Platinum Diesel AT, Platinum Diesel MT, Platinum Matte, Prestige, Prestige Diesel, Prestige Diesel Matte, Prestige Matte, Signature 6Str DCT, Signature 6Str DCT Matte, Signature 6Str Diesel AT, Signature 6Str Diesel AT DT, Signature DCT, Signature DCT Matte, Signature Diesel AT, Signature Diesel AT Matte |
| Aura | 8 | 6 | E, S (O) MT, S AMT, S CNG, S MT, SX (O) MT, SX CNG, SX MT |
| Creta | 43 | 10 | E Diesel MT, E MT, EX (O) CVT, EX (O) Diesel AT, EX (O) Diesel MT, EX (O) MT, EX Diesel MT, EX MT, King CVT, King Diesel AT, King Diesel MT, King Knight CVT, King Knight Diesel AT, King Limited Edition CVT, King Limited Edition Diesel AT, King MT, King Turbo DCT, S (O) CVT, S (O) Diesel AT, S (O) Diesel MT, S (O) Knight CVT, S (O) Knight Diesel AT, S (O) Knight Diesel MT, S (O) Knight MT, S (O) MT, S Diesel MT, S MT, SX (O) CVT, SX (O) Diesel AT, SX (O) Diesel MT, SX (O) Knight CVT, SX (O) Knight Diesel AT, SX (O) Knight Diesel MT, SX (O) Knight MT, SX (O) MT, SX (O) Turbo DCT, SX MT, SX Premium CVT, SX Premium Diesel MT, SX Premium MT, SX Tech CVT, SX Tech Diesel MT, SX Tech MT |
| Creta EV | 3 | 12 | Excellence LR, Executive, Smart |
| Creta N Line | 5 | 7 | N6 DCT, N6 MT, N8 DCT, N8 MT, N10 DCT |
| Exter | 14 | 12 | EX, EX (O) MT, S (O) AMT, S (O) CNG, S (O) Knight MT, S (O) MT, S CNG, S MT, SX (O) AMT, SX (O) Knight MT, SX (O) MT, SX AMT, SX CNG, SX MT |
| Grand i10 Nios | 12 | 10 | Asta AMT, Asta MT, Era, Era AMT, Magna AMT, Magna CNG, Magna MT, Sportz (O) MT, Sportz AMT, Sportz CNG, Sportz DT MT, Sportz MT |
| i20 | 16 | 8 | Asta (O) CVT, Asta (O) CVT DT, Asta (O) CVT Knight, Asta (O) DT MT, Asta (O) MT, Asta MT, Era, Magna CVT, Magna Executive MT, Magna MT, Sportz (O) CVT, Sportz (O) DT MT, Sportz (O) MT, Sportz CVT, Sportz DT MT, Sportz MT |
| i20 N Line | 2 | 7 | i20 N Line 1.0 Turbo GDi DCT, i20 N Line 1.0 Turbo GDi MT |
| Ioniq 5 | 2 | 4 | Long Range AWD, Long Range RWD |
| Prime HB | 1 | 3 | Prime HB |
| Prime SD | 1 | 3 | Prime SD |
| Tucson | 6 | 7 | Executive Diesel MT, Executive MT, Platinum AT, Platinum Diesel AT, Signature AT, Signature Diesel AT |
| Venue | 17 | 8 | HX 2, HX 2 Diesel MT, HX 2 Turbo MT, HX 4 MT, HX 5 Diesel AT, HX 5 Diesel MT, HX 5 MT, HX 5 Turbo DCT, HX 5 Turbo MT, HX 6 MT, HX 6 Turbo DCT, HX 6T MT, HX 7 Diesel MT, HX 8 Turbo DCT, HX 8 Turbo MT, HX 10 Diesel AT, HX 10 Turbo DCT |
| Venue N Line | 6 | 8 | N6, N6 DCT, N6 DCT Dual Tone, N6 Dual Tone, N10 DCT, N10 DCT Dual Tone |
| Verna | 11 | 7 | EX, HX2 MT, HX4 MT, HX6 CVT, HX6 MT, HX6 Plus CVT, HX6 Plus MT, HX8 Turbo DCT, HX8 Turbo MT, HX10 Turbo CVT, HX10 Turbo DCT |

### Kia

Source: `public/data/kia.json`

Brand totals: 9 models, 31 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Carens | 3 | 9 | Carens Premium Opt, Carens Premium Opt CNG, Carens Premium Opt Diesel |
| Carens Clavis | 9 | 7 | HTE (O) Diesel MT, HTE (O) Petrol MT, HTE (O) Turbo Petrol MT, HTE Petrol MT, HTK Plus Diesel AT, HTK Plus Turbo DCT, HTX Plus Diesel AT, HTX Plus Turbo DCT, HTX Turbo DCT |
| Carens Clavis EV | 3 | 7 | Carens Clavis EV HTX E, Carens Clavis EV HTX E LR, Carens Clavis EV HTX E Plus |
| Carnival | 1 | 2 | Carnival Limousine Plus |
| EV6 | 1 | 5 | EV6 AWD |
| EV9 | 1 | 5 | EV9 GT-Line AWD |
| Seltos | 6 | 12 | Seltos GTX A iVT, Seltos HTE, Seltos HTE Diesel, Seltos HTK, Seltos HTX, Seltos X-Line Diesel AT |
| Sonet | 4 | 9 | Sonet GTX Plus Diesel AT, Sonet HTE, Sonet HTK Plus, Sonet HTX Diesel |
| Syros | 3 | 8 | Syros HTK Plus Diesel, Syros HTK Turbo, Syros HTX Plus Opt Diesel AT |

### Land Rover

Source: `public/data/land_rover.json`

Brand totals: 7 models, 34 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Defender | 16 | 10 | 2.0 l Petrol 110 PHEV Sedona Red Edition, 2.0 l Petrol 110 X-Dynamic HSE, 3.0 l Diesel 90 X-Dynamic HSE, 3.0 l Diesel 110 Sedona Edition, 3.0 l Diesel 110 X, 3.0 l Diesel 110 X-Dynamic HSE, 3.0 l Diesel 130 X, 3.0 l Diesel 130 X-Dynamic HSE, 4.4 l V8 Petrol 110 OCTA, 4.4 l V8 Petrol 110 OCTA Edition One, 5.0 l V8 Petrol 90 X, 5.0 l V8 Petrol 110 V8, 5.0 l V8 Petrol 110 X, 5.0 l V8 Petrol 110 X-Dynamic HSE, 5.0 l V8 Petrol 130 X, 5.0 l V8 Petrol 130 X-Dynamic HSE |
| Discovery | 3 | 11 | 3.0 Diesel Dynamic HSE, 3.0 Diesel Metropolitan Edition, 3.0 Diesel S |
| Discovery Sport | 2 | 5 | Dynamic SE (Petrol), Dynamic SE Diesel |
| Range Rover | 4 | 9 | 3.0 l Diesel LWB HSE, 3.0 l Diesel LWB SV, 3.0 l LWB Autobiography, 4.4 l Petrol LWB SV |
| Range Rover Evoque | 2 | 5 | Autobiography (Petrol), Autobiography Diesel |
| Range Rover Sport | 5 | 12 | 3.0 l Diesel Dynamic HSE, 3.0 l Petrol Dynamic HSE, 3.0 l PHEV Autobiography, 4.4 l Autobiography, 4.4 l SV Edition Two |
| Range Rover Velar | 2 | 7 | 2.0 l Diesel Autobiography, 2.0 l Petrol Autobiography |

### Mahindra

Source: `public/data/mahindra.json`

Brand totals: 18 models, 191 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| BE 6 | 20 | 9 | FE2, FE3, Pack One (Base), Pack One 7.2 kW Charger, Pack One 11.2 kW Charger, Pack One Above, Pack One Above 7.2 kW Charger, Pack One Above 11.2 kW Charger, Pack Three (Base), Pack Three 79 kWh 7.2 kW Charger, Pack Three 79 kWh 11.2 kW Charger, Pack Three Select, Pack Three Select 7.2 kW Charger, Pack Three Select 11.2 kW Charger, Pack Two (Base), Pack Two 7.2 kW Charger, Pack Two 11.2 kW Charger, Pack Two 79 kWh, Pack Two 79 kWh 7.2 kW Charger, Pack Two 79 kWh 11.2 kW Charger |
| Bolero | 4 | 5 | B4, B6, B6 Opt, B8 |
| Bolero Camper | 7 | 1 | 2WD Non-AC, 4WD Diesel, 4WD Non-AC, GOLD RX, GOLD RX 4WD, GOLD ZX, ZX |
| Bolero Neo | 6 | 9 | N4, N8, N10, N10 Opt, N10 R, N11 |
| Bolero Neo Plus | 2 | 3 | P4 2.2 Diesel MT, P10 2.2 Diesel MT |
| Bolero Pik-Up | 6 | 1 | 4WD 1.3T, FB 1.3T, FB AC 1.3T, MS CBC 1.3T, MS CBC 4WD 1.3T, MS FB 1.3T |
| Marazzo | 6 | 4 | M2, M2 8Str, M4 Plus, M4 Plus 8Str, M6 Plus, M6 Plus 8Str |
| Scorpio Classic | 4 | 5 | S, S 9 Seater, S 11, S 11 7CC |
| Scorpio N | 10 | 7 | Z2 Diesel MT, Z2 E Diesel MT, Z4 Diesel AT, Z4 Diesel MT, Z4 Petrol AT, Z6 Diesel MT, Z8 Diesel MT, Z8 Select Diesel MT, Z8L Diesel 4x4 AT, Z8L Diesel MT |
| Thar | 7 | 5 | AXT RWD Diesel, LXT 4WD (Petrol), LXT 4WD AT (Petrol), LXT 4WD Diesel, LXT 4WD Diesel AT, LXT RWD AT (Petrol), LXT RWD Diesel |
| Thar Roxx | 20 | 8 | AX5L 4WD Diesel AT, AX5L RWD Diesel AT, AX7L 4WD Diesel, AX7L 4WD Diesel AT, AX7L RWD AT (Petrol), AX7L RWD Diesel, AX7L RWD Diesel AT, MX1 RWD (Petrol), MX1 RWD Diesel, MX3 RWD AT (Petrol), MX3 RWD Diesel, MX3 RWD Diesel AT, MX5 4WD Diesel, MX5 RWD (Petrol), MX5 RWD AT (Petrol), MX5 RWD Diesel, MX5 RWD Diesel AT, Star Edition AT (Petrol), Star Edition Diesel (RWD), Star Edition Diesel AT |
| XEV 9e | 15 | 9 | Pack One, Pack One 7.2 kW Charger, Pack One 11.2 kW Charger, Pack Three, Pack Three 7.2 kW Charger, Pack Three 11.2 kW Charger, Pack Three Select, Pack Three Select 7.2 kW Charger, Pack Three Select 11.2 kW Charger, Pack Two, Pack Two 7.2 kW Charger, Pack Two 11.2 kW Charger, Pack Two 79 kWh, Pack Two 79 kWh 7.2 kW Charger, Pack Two 79 kWh 11.2 kW Charger |
| XEV 9S | 4 | 6 | Pack One Above 59kWh, Pack One Above 79kWh, Pack Three Above 79kWh, Pack Two Above 79kWh |
| XUV 3XO | 29 | 16 | AX5, AX5 AT, AX5 Diesel, AX5 Diesel AMT, AX5 L Turbo, AX5 L Turbo AT, AX7 Diesel, AX7 Diesel AMT, AX7 L Diesel, AX7 L Turbo, AX7 L Turbo AT, AX7 Turbo, AX7 Turbo AT, MX1, MX2 Diesel, MX2 Pro, MX2 Pro AT, MX2 Pro Diesel, MX3, MX3 AT, MX3 Diesel, MX3 Diesel AMT, MX3 Pro, MX3 Pro AT, MX3 Pro Diesel, REVX A Turbo, REVX A Turbo AT, REVX M, REVX M (O) |
| XUV 3XO EV | 2 | 6 | AX5, AX7 L |
| XUV 7XO | 26 | 11 | AX, AX Diesel, AX3, AX3 AT, AX3 Diesel, AX3 Diesel AT, AX5, AX5 AT, AX5 Diesel, AX5 Diesel AT, AX7, AX7 AT, AX7 Diesel, AX7 Diesel AT, AX7L 6Str AT, AX7L 6Str Diesel AT, AX7L AT, AX7L Diesel, AX7L Diesel AWD AT, AX7T 6Str AT, AX7T 6Str Diesel, AX7T 6Str Diesel AT, AX7T AT, AX7T Diesel, AX7T Diesel AT, AX7T Diesel AWD AT |
| XUV400 EV | 4 | 12 | EC Pro 34.5 kWh, EL Pro 34.5 kWh, EL Pro 39.4 kWh, EL Pro DT 39.4 kWh |
| XUV700 | 19 | 9 | AX5 7Str, AX5 7Str Diesel, AX5 E 7Str, AX5 S 7Str, AX5 S 7Str AT, AX5 S 7Str Diesel, AX5 S 7Str Diesel AT, AX5 S E 7Str, AX7 7Str, AX7 7Str Diesel, AX7 7Str Diesel AT, AX7 7Str Diesel AT AWD, AX7 Ebony Edition 7Str, AX7 Ebony Edition 7Str Diesel, AX7L 7Str Diesel AT AWD, MX 7Str, MX 7Str Diesel, MX E 7Str, MX E 7Str Diesel |

### Maserati

Source: `public/data/maserati.json`

Brand totals: 5 models, 11 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| GranCabrio | 2 | 0 | Sport, Trofeo |
| GranTurismo | 2 | 0 | Modena, Trofeo |
| Grecale | 2 | 0 | GT, Trofeo |
| Levante | 2 | 0 | Diesel, S |
| Quattroporte | 3 | 0 | Diesel, GranLusso, GranSport |

### MG

Source: `public/data/mg.json`

Brand totals: 9 models, 39 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Astor | 8 | 6 | Savvy Pro CVT, Savvy Pro Sangria CVT, Select, Select CVT, Sharp Pro, Sharp Pro CVT, Shine, Sprint |
| Comet EV | 3 | 5 | Executive, Play, Xplore |
| Cyberster | 1 | 5 | Dual Motor AWD |
| Gloster | 9 | 5 | Black Storm 4x2 6Str, Black Storm 4x2 7Str, Black Storm 4x4 6Str, Black Storm 4x4 7Str, Savvy 4x2 6Str, Savvy 4x2 7Str, Savvy 4x4 6Str, Savvy 4x4 7Str, Sharp 4x2 7Str |
| Hector | 7 | 5 | Savvy Pro 5Str CVT, Select Pro 5Str, Sharp Pro 5Str, Sharp Pro 5Str CVT, Smart Pro 5Str, Smart Pro 5Str CVT, Style 5Str |
| Hector Plus | 3 | 7 | Savvy Pro 7-Str CVT, Sharp Pro 7-Str, Sharp Pro 7-Str CVT |
| M9 | 1 | 3 | M9 |
| Windsor EV | 5 | 7 | Essence, Essence Pro, Excite, Exclusive, Exclusive Pro |
| ZS EV | 2 | 5 | Exclusive Pro, Standard |

### Nissan

Source: `public/data/nissan.json`

Brand totals: 3 models, 33 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Gravite | 4 | 5 | Acenta, N-Trek, Tekna, Visia |
| Magnite | 28 | 12 | Acenta, Acenta AMT, Acenta CNG, Acenta Turbo CVT, KURO Edition, KURO Edition AMT, KURO Edition Turbo, KURO Edition Turbo CVT, N Connecta, N Connecta AMT, N Connecta CNG, N Connecta Turbo, N Connecta Turbo CVT, Tekna, Tekna AMT, Tekna CNG, Tekna Plus, Tekna Plus AMT, Tekna Plus CNG, Tekna Plus Turbo, Tekna Plus Turbo CVT, Tekna Turbo, Tekna Turbo CVT, Visia, Visia AMT, Visia CNG, Visia Plus, Visia Plus CNG |
| X-Trail | 1 | 5 | X-Trail |

### Porsche

Source: `public/data/porsche.json`

Brand totals: 8 models, 24 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 911 | 6 | 15 | Carrera, Carrera 4 GTS, Carrera S, GT3, Turbo, Turbo S |
| Cayenne | 4 | 10 | Cayenne, Cayenne Coupe, Cayenne GTS, Cayenne S |
| Cayenne Coupe | 2 | 11 | Cayenne Coupe, Cayenne Coupe GTS |
| Cayenne Electric | 2 | 7 | Cayenne Electric, Cayenne Electric S |
| Macan | 2 | 9 | Macan, Macan S |
| Macan EV | 3 | 13 | Macan Electric, Macan Electric 4S, Macan Electric Turbo |
| Panamera | 2 | 11 | Panamera, Panamera GTS |
| Taycan | 3 | 14 | Taycan, Taycan 4S, Taycan Turbo |

### Renault

Source: `public/data/renault.json`

Brand totals: 4 models, 12 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Duster | 3 | 10 | Duster Journey TCe 100 MT, Duster Techroad Plus TCe 160 CVT, Duster Techroad TCe 130 CVT |
| Kiger | 3 | 10 | Kiger Emotion Turbo DT CVT, Kiger RXE 1.0 MT, Kiger RXT 1.0 Turbo AMT |
| Kwid | 3 | 12 | Kwid Climber 1.0 AMT, Kwid RXE 1.0, Kwid RXT 1.0 |
| Triber | 3 | 9 | Triber RXE 1.0, Triber RXT 1.0, Triber RXZ 1.0 CVT |

### Rolls-Royce

Source: `public/data/rolls_royce.json`

Brand totals: 4 models, 7 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Cullinan | 2 | 0 | Base, Black Badge |
| Ghost Series II | 2 | 0 | Extended Wheelbase, Standard Wheelbase |
| Phantom | 2 | 0 | Extended Wheelbase, Standard Wheelbase |
| Spectre | 1 | 0 | Base |

### Skoda

Source: `public/data/skoda.json`

Brand totals: 5 models, 18 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Kodiaq | 5 | 8 | Kodiaq L&K 2.0 TSI DSG, Kodiaq Lounge, Kodiaq Selection 2.0 TSI DSG, Kodiaq Selection L&K, Kodiaq Sportline |
| Kushaq | 5 | 6 | Kushaq Active 1.0 TSI MT, Kushaq Ambition 1.0 TSI AT, Kushaq Ambition 1.0 TSI MT, Kushaq Prestige 1.5 TSI DSG, Kushaq Style 1.5 TSI MT |
| Kylaq | 4 | 6 | Kylaq Classic 1.0 TSI MT, Kylaq Prestige 1.0 TSI AT, Kylaq Signature 1.0 TSI MT, Kylaq Signature Plus 1.0 TSI AT |
| Octavia RS | 1 | 5 | Octavia RS 2.0 TSI DSG |
| Slavia | 3 | 18 | Slavia Active 1.0 TSI MT, Slavia Ambition 1.0 TSI AT, Slavia Sportline 1.5 TSI DSG |

### Tata

Source: `public/data/tata.json`

Brand totals: 19 models, 215 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Altroz | 22 | 8 | Altroz Accomplished Plus S DCA, Altroz Accomplished S, Altroz Accomplished S CNG, Altroz Accomplished S DCA, Altroz Accomplished S Diesel, Altroz Creative, Altroz Creative AMT, Altroz Creative CNG, Altroz Creative S, Altroz Creative S AMT, Altroz Creative S CNG, Altroz Creative S DCA, Altroz Creative S Diesel, Altroz Pure, Altroz Pure AMT, Altroz Pure CNG, Altroz Pure Diesel, Altroz Pure S, Altroz Pure S AMT, Altroz Pure S CNG, Altroz Smart, Altroz Smart CNG |
| Curvv | 10 | 13 | Curvv Accomplished Plus A Dark Diesel DCT, Curvv Accomplished Plus A Diesel DCT, Curvv Accomplished Plus A Petrol DCT, Curvv Creative Diesel DCT, Curvv Creative Petrol DCT, Curvv Creative Plus S Petrol DCT, Curvv Smart Diesel MT, Curvv Smart Petrol MT, Curvv Smart Plus Diesel MT, Curvv Smart Plus Petrol MT |
| Curvv EV | 8 | 11 | Curvv EV Accomplished 45, Curvv EV Accomplished 55, Curvv EV Accomplished Plus S 45, Curvv EV Accomplished Plus S 55, Curvv EV Creative 45, Curvv EV Empowered Plus 55, Curvv EV Empowered Plus A 55, Curvv EV Empowered Plus A 55 Dark |
| Harrier | 8 | 6 | Harrier Fearless X Plus Stealth AT, Harrier Petrol Adventure X, Harrier Petrol Adventure X Plus, Harrier Petrol Pure X, Harrier Petrol Pure X DARK, Harrier Petrol Smart, Harrier Pure X, Harrier Smart |
| Harrier EV | 7 | 5 | Harrier EV Adventure 65, Harrier EV Adventure Plus 65, Harrier EV Empowered 75, Harrier EV Empowered Plus QWD 75, Harrier EV Empowered QWD 75, Harrier EV Fearless 75, Harrier EV Fearless Plus 75 |
| Nexon | 43 | 9 | Nexon Creative, Nexon Creative AMT, Nexon Creative CNG, Nexon Creative Diesel, Nexon Creative Diesel AMT, Nexon Creative Plus DCT, Nexon Creative Plus S, Nexon Creative Plus S DCT, Nexon Creative Plus S Diesel DCT, Nexon Creative S, Nexon Creative S CNG, Nexon Creative S Diesel, Nexon Creative S Diesel AMT, Nexon Fearless CNG, Nexon Fearless DCT, Nexon Fearless Diesel AMT, Nexon Fearless Plus CNG, Nexon Fearless Plus DCT, Nexon Fearless Plus PS DCT, Nexon Fearless Plus PS Diesel AMT, Nexon Fearless Plus PS Diesel AMT Red Dark, Nexon Fearless Plus PS Red Dark DCT, Nexon Pure Plus, Nexon Pure Plus AMT, Nexon Pure Plus CNG, Nexon Pure Plus Diesel, Nexon Pure Plus Diesel AMT, Nexon Pure Plus S, Nexon Pure Plus S AMT, Nexon Pure Plus S CNG, Nexon Pure Plus S Diesel, Nexon Pure Plus S Diesel AMT, Nexon Smart, Nexon Smart AMT, Nexon Smart CNG, Nexon Smart Diesel, Nexon Smart Plus, Nexon Smart Plus AMT, Nexon Smart Plus CNG, Nexon Smart Plus Diesel, Nexon Smart Plus Diesel AMT, Nexon Smart Plus S, Nexon Smart Plus S AMT |
| Nexon EV | 15 | 6 | Nexon EV Creative 45, Nexon EV Creative MR, Nexon EV Creative Plus 45, Nexon EV Creative Plus MR, Nexon EV Creative Plus S MR, Nexon EV Empowered 45, Nexon EV Empowered MR, Nexon EV Empowered Plus 45, Nexon EV Empowered Plus A 45, Nexon EV Empowered Plus A 45 Red Dark, Nexon EV Empowered Plus MR, Nexon EV Fearless 45, Nexon EV Fearless MR, Nexon EV Fearless Plus S 45, Nexon EV Fearless Plus S MR |
| Punch | 26 | 12 | Punch Accomplished, Punch Accomplished AMT, Punch Accomplished CNG, Punch Accomplished Plus S, Punch Accomplished Plus S AMT, Punch Accomplished Plus S CNG AMT, Punch Accomplished Plus S Turbo, Punch Adventure, Punch Adventure AMT, Punch Adventure CNG, Punch Adventure CNG AMT, Punch Adventure S, Punch Adventure S CNG, Punch Adventure S CNG AMT, Punch Adventure Turbo, Punch Pure, Punch Pure CNG, Punch Pure Plus, Punch Pure Plus AMT, Punch Pure Plus CNG, Punch Pure Plus CNG AMT, Punch Pure Plus S, Punch Pure Plus S AMT, Punch Pure Plus S CNG, Punch Smart, Punch Smart CNG |
| Punch EV | 6 | 6 | Punch EV Adventure 40, Punch EV Adventure Plus 40, Punch EV Empowered Plus 40, Punch EV Empowered Plus S 40, Punch EV Smart 30, Punch EV Smart Plus 30 |
| Safari | 12 | 6 | Safari Accomplished Plus Diesel AT, Safari Accomplished Plus Petrol AT, Safari Accomplished Ultra 6S Diesel AT, Safari Accomplished X Plus 6S Petrol AT, Safari Adventure Diesel AT, Safari Adventure Petrol AT, Safari Adventure X Plus Diesel AT, Safari Adventure X Plus Petrol AT, Safari Smart Diesel MT, Safari Smart Petrol MT, Safari Smart Plus Diesel MT, Safari Smart Plus Petrol MT |
| Sierra | 8 | 6 | Sierra Accomplished Plus Diesel AT, Sierra Adventure, Sierra Pure, Sierra Pure DCA, Sierra Pure Diesel, Sierra Pure Plus, Sierra Smart Plus, Sierra Smart Plus Diesel |
| Tiago | 13 | 7 | Tiago XE, Tiago XE CNG, Tiago XM, Tiago XM CNG, Tiago XT, Tiago XT CNG, Tiago XTA AMT, Tiago XTA AMT CNG, Tiago XZ, Tiago XZ CNG, Tiago XZ Plus, Tiago XZA AMT, Tiago XZA AMT CNG |
| Tiago EV | 7 | 5 | Tiago EV XE MR, Tiago EV XT LR, Tiago EV XT MR, Tiago EV XZ MR, Tiago EV XZ Plus LR, Tiago EV XZ Plus Tech LUX LR, Tiago EV XZ Plus Tech LUX MR |
| Tiago NRG | 4 | 4 | Tiago NRG XZ iCNG MT, Tiago NRG XZ Petrol MT, Tiago NRG XZA iCNG AMT, Tiago NRG XZA Petrol AMT |
| Tigor | 14 | 6 | Tigor XM, Tigor XT, Tigor XT CNG, Tigor XTA AMT, Tigor XZ, Tigor XZ CNG, Tigor XZ Plus, Tigor XZ Plus CNG, Tigor XZ Plus Lux, Tigor XZ Plus Lux CNG, Tigor XZA AMT, Tigor XZA AMT CNG, Tigor XZA Plus AMT, Tigor XZA Plus AMT CNG |
| Tigor EV | 4 | 5 | Tigor EV XE, Tigor EV XT, Tigor EV XZ Plus, Tigor EV XZ Plus LUX |
| Xpres | 2 | 1 | Xpres CNG, Xpres Petrol |
| Xpres-T EV | 2 | 5 | Xpres-T EV XM Plus, Xpres-T EV XT Plus |
| Yodha Pickup | 4 | 1 | Yodha Pickup 1200, Yodha Pickup 1700, Yodha Pickup Crew Cabin 4x2, Yodha Pickup Crew Cabin 4x4 |

### Toyota

Source: `public/data/toyota.json`

Brand totals: 12 models, 56 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Camry | 2 | 6 | Camry Elegance, Camry Sprint Edition |
| Fortuner | 8 | 7 | Fortuner 4X2 AT, Fortuner 4X2 Diesel, Fortuner 4X2 Diesel AT, Fortuner 4X4 Diesel, Fortuner GR S 4X4 Diesel AT, Fortuner Leader Edition 4x2 Diesel, Fortuner Leader Edition 4x2 Diesel AT, Fortuner Neo Drive |
| Fortuner Legender | 3 | 4 | Fortuner Legender 4x2 AT, Fortuner Legender 4x4, Fortuner Legender Neo Drive |
| Glanza | 9 | 5 | Glanza E, Glanza G, Glanza G AMT, Glanza G CNG, Glanza S, Glanza S AMT, Glanza S CNG, Glanza V, Glanza V AMT |
| Hilux | 3 | 5 | Hilux High, Hilux High AT, Hilux STD |
| Innova Crysta | 7 | 5 | Innova Crysta 2.4 GX 7-Str, Innova Crysta 2.4 GX 8-Str, Innova Crysta 2.4 GX Plus 7-Str, Innova Crysta 2.4 GX Plus 8-Str, Innova Crysta 2.4 VX 7-Str, Innova Crysta 2.4 VX 8-Str, Innova Crysta 2.4 Zx 7-Str |
| Innova Hycross | 5 | 0 | Innova Hycross G Fleet 7STR, Innova Hycross GX 7STR, Innova Hycross VX 7STR Hybrid, Innova Hycross ZX Hybrid, Innova Hycross ZX(O) Hybrid |
| Land Cruiser 300 | 1 | 2 | Land Cruiser 300 ZX |
| Rumion | 7 | 5 | Rumion G, Rumion G AT, Rumion S, Rumion S AT, Rumion S CNG, Rumion V, Rumion V AT |
| Taisor | 5 | 9 | Taisor E, Taisor E CNG, Taisor G Turbo, Taisor S, Taisor V Turbo AT |
| Urban Cruiser Hyryder | 4 | 11 | Urban Cruiser Hyryder E, Urban Cruiser Hyryder S CNG, Urban Cruiser Hyryder S HYBRID, Urban Cruiser Hyryder V HYBRID |
| Vellfire | 2 | 3 | Vellfire Hi, Vellfire VIP Executive Lounge |

### VinFast

Source: `public/data/vinfast.json`

Brand totals: 6 models, 13 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Limo Green | 1 | 0 | Standard |
| VF 3 | 1 | 0 | Standard |
| VF 6 | 3 | 6 | Earth, Wind, Wind Infinity |
| VF 7 | 6 | 6 | Earth, Plus (AWD), Sky, Sky Infinity, Wind, Wind Infinity |
| VF 8 | 1 | 6 | Eco |
| VF 9 | 1 | 6 | Plus |

### Volkswagen

Source: `public/data/volkswagen.json`

Brand totals: 5 models, 15 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Golf GTI | 1 | 4 | Golf GTI 2.0 TSI DSG |
| Taigun | 6 | 8 | Taigun Comfortline 1.0 TSI AT, Taigun Comfortline 1.0 TSI MT, Taigun GT 1.5 TSI EVO DSG, Taigun Highline 1.0 TSI AT, Taigun Highline 1.0 TSI MT, Taigun Topline 1.5 TSI EVO MT |
| Tayron R-Line | 1 | 7 | Tayron R-Line 2.0 TSI 4MOTION DSG |
| Tiguan R-Line | 1 | 6 | Tiguan R-Line 2.0 TSI 7DCT |
| Virtus | 6 | 8 | Virtus Comfortline 1.0 TSI AT, Virtus Comfortline 1.0 TSI MT, Virtus GT 1.5 TSI EVO DSG, Virtus Highline 1.0 TSI AT, Virtus Highline 1.0 TSI MT, Virtus Topline 1.5 TSI EVO MT |

### Volvo

Source: `public/data/volvo.json`

Brand totals: 5 models, 5 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| EC40 | 1 | 6 | EC40 Recharge Twin Motor |
| EX30 | 1 | 5 | EX30 Single Motor Extended Range |
| EX40 | 1 | 6 | EX40 Recharge Twin Motor |
| XC60 | 1 | 7 | XC60 B5 Ultimate |
| XC90 | 1 | 6 | XC90 B6 Ultimate |


## 3W Brands

**Totals:** 17 brands, 89 models, 137 variants

### Altigreen

Source: `public/data/3w/altigreen.json`

Brand totals: 1 models, 0 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Electric 3W and LCV | 0 | 0 | None |

### Atul Auto

Source: `public/data/3w/atul-auto.json`

Brand totals: 5 models, 10 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| GEM Cargo | 2 | 0 | GEM Cargo/Diesel, GEM Cargo/CNG |
| Gem Paxx | 5 | 3 | Gem Paxx 3-Seater/CNG, Gem Paxx 3-Seater/CNG Aqua 3P, Gem Paxx 3-Seater/Petrol, Gem Paxx 3-Seater/Diesel, Gem Paxx 3-Seater/LPG |
| Rik Electric | 0 | 3 | None |
| Shakti Cargo | 2 | 2 | Shakti Cargo/Diesel, Shakti Cargo XD/Diesel |
| Smart Cargo | 1 | 0 | Smart Cargo/CNG |

### Bajaj Auto (3W)

Source: `public/data/3w/bajaj-auto-3w.json`

Brand totals: 17 models, 18 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Compact RE CNG | 0 | 2 | None |
| GoGo P5009 | 1 | 0 | GoGo P5009/Electric |
| GoGo P5012 | 1 | 0 | GoGo P5012/Electric |
| GoGo P7012 | 1 | 0 | GoGo P7012/Electric |
| Maxima C CNG | 2 | 3 | Maxima C/CNG, Maxima C/Diesel |
| Maxima X Wide | 3 | 0 | Maxima X Wide/CNG, Maxima X Wide/LPG, Maxima X Wide/Diesel |
| Maxima X Wide Diesel | 3 | 2 | Maxima X Wide/CNG, Maxima X Wide/LPG, Maxima X Wide/Diesel |
| Maxima XL Electric | 0 | 3 | None |
| Maxima Z | 3 | 0 | Maxima Z/CNG, Maxima Z/LPG, Maxima Z/Diesel |
| Maxima Z CNG | 3 | 3 | Maxima Z/CNG, Maxima Z/LPG, Maxima Z/Diesel |
| RE CNG | 0 | 3 | None |
| RE Diesel | 0 | 3 | None |
| RE E-TEC 9.0 | 1 | 0 | RE E-TEC 9.0/Electric |
| RE Electric | 0 | 3 | None |
| RE LPG | 0 | 2 | None |
| Riki C40 05 E Cart | 0 | 0 | None |
| Riki P40 | 0 | 2 | None |

### Euler Motors

Source: `public/data/3w/euler-motors.json`

Brand totals: 5 models, 11 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| HiLoad DV EV | 0 | 2 | None |
| HiLoad EV 120 | 3 | 3 | HiLoad EV PV (Open Body), HiLoad EV DV (Container Body), HiLoad EV HD (High Deck) |
| HiLoad EV 170 | 3 | 3 | HiLoad EV PV (Open Body), HiLoad EV DV (Container Body), HiLoad EV HD (High Deck) |
| NEO HiCITY | 2 | 3 | NEO HiCity MAXX, NEO HiCity PLUS |
| NEO HiRange | 3 | 2 | NEO HiRANGE (Base), NEO HiRANGE PLUS, NEO HiRANGE MAXX |

### Force Motors

Source: `Missing raw source`

Brand totals: 1 models, 0 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Force Motors has shifted focus to LCVs (Urbania, Gurkha, Trax). No current 3W production. | 0 | 0 | None |

### Greaves Electric Mobility

Source: `public/data/3w/greaves-electric-3w.json`

Brand totals: 3 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Eltra City | 2 | 3 | Eltra City 3 Seater/Electric, Eltra City Xtra 3 Seater/Electric |
| Eltra City XTRA | 1 | 2 | Eltra City Xtra 3 Seater/Electric |
| Xargo | 1 | 3 | Xargo EV/Electric |

### Kinetic Green

Source: `public/data/3w/kinetic-green.json`

Brand totals: 4 models, 5 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Safar Jumbo Ranger | 2 | 3 | Safar Jumbo/Electric, Safar Jumbo Ranger/Electric |
| Safar Shakti | 1 | 3 | Safar Shakti/Electric |
| Safar Smart | 1 | 4 | Safar Smart/Electric |
| Super DX | 1 | 3 | Super DX/Electric |

### Lohia Auto

Source: `public/data/3w/lohia-auto.json`

Brand totals: 8 models, 1 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Comfort F2F+ | 1 | 3 | Comfort F2F Plus/Electric |
| Humsafar L5 Cargo | 0 | 3 | None |
| Humsafar L5 Passenger | 0 | 3 | None |
| Narain DX | 0 | 3 | None |
| Narain ICE L3 | 0 | 2 | None |
| Youdha E5 Cargo | 0 | 3 | None |
| Youdha E5 Passenger | 0 | 3 | None |
| YOUDHA EPOD L5 | 0 | 0 | None |

### Mahindra (3W)

Source: `public/data/3w/mahindra-3w.json`

Brand totals: 14 models, 29 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Alfa DX | 3 | 0 | Alfa DX/Diesel, Alfa DX/CNG, Alfa DX Duo/CNG+Petrol |
| Alfa Load | 0 | 3 | None |
| Alfa Passenger | 0 | 3 | None |
| E-Alfa Mini | 1 | 2 | e-Alfa Mini/Electric |
| E-Alfa Plus | 2 | 3 | Alfa Plus/Diesel, e-Alfa Plus/Electric |
| Treo | 5 | 3 | Treo Yaari/Electric, Treo Yaari Cargo/Electric, Treo/Electric, Treo Plus/Electric, Treo Zor/Electric |
| Treo Plus | 2 | 3 | Treo/Electric, Treo Plus/Electric |
| Treo Yaari Cargo | 3 | 0 | Treo Yaari/Electric, Treo Yaari Cargo/Electric, Treo/Electric |
| Treo Yaari HRT | 2 | 2 | Treo Yaari/Electric, Treo/Electric |
| Treo Yaari SFT | 2 | 2 | Treo Yaari/Electric, Treo/Electric |
| Treo Zor | 2 | 3 | Treo/Electric, Treo Zor/Electric |
| Treo Zor Grand Range Plus | 4 | 0 | Treo/Electric, Treo Zor/Electric, Zor Grand/Electric, Zor Grand Range Plus/Electric |
| UDO | 1 | 3 | UDO/Electric |
| Zor Grand | 2 | 3 | Zor Grand/Electric, Zor Grand Range Plus/Electric |

### Numeros Motors

Source: `Missing raw source`

Brand totals: 1 models, 0 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Electric 3W manufacturer | 0 | 0 | None |

### Omega Seiki Mobility

Source: `public/data/3w/omega-seiki-mobility.json`

Brand totals: 1 models, 0 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Electric cargo 3W | 0 | 0 | None |

### Piaggio Ape

Source: `public/data/3w/piaggio-ape.json`

Brand totals: 18 models, 25 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Auto Classic | 0 | 3 | None |
| Auto DX | 3 | 3 | 3-Seater/1920/Diesel, 3-Seater/1920/CNG, 3-Seater/1920/LPG |
| Auto Plus | 1 | 0 | 5-Seater/2100/Diesel |
| City Plus | 2 | 0 | 3-Seater/1920/CNG, 3-Seater/1920/LPG |
| E-City | 1 | 3 | 1920/Electric |
| E-City FX | 1 | 0 | 1920/Electric |
| E-City FX Max | 1 | 0 | 1920/Electric |
| E-City Ultra | 1 | 0 | 1920/Electric |
| E-Xtra FX | 1 | 3 | 2100/Electric |
| E-Xtra FX Max | 1 | 2 | 2100/Electric |
| Metro | 1 | 3 | 3-Seater/1920/CNG |
| NXT+ | 3 | 4 | 3-Seater/1920/CNG, 3-Seater/1920/LPG, 3-Seater/1920/Petrol |
| Xtra 600 | 1 | 0 | Diesel |
| Xtra Bada 700 | 1 | 0 | Diesel |
| Xtra Classic | 1 | 0 | 2100/Diesel |
| Xtra LDX CNG | 2 | 2 | 2100/Diesel, 2100/CNG |
| Xtra LDX Diesel | 2 | 3 | 2100/Diesel, 2100/CNG |
| Xtra LDX Plus | 2 | 0 | 2100/Diesel, 2100/CNG |

### Saera Electric

Source: `public/data/3w/saera-ev.json`

Brand totals: 1 models, 0 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Electric 3W and 4W manufacturer | 0 | 0 | None |

### TVS King

Source: `public/data/3w/tvs-king.json`

Brand totals: 7 models, 34 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| King Deluxe | 3 | 3 | King Deluxe/Petrol, King Deluxe/LPG, King Deluxe/CNG |
| King Duramax | 4 | 3 | King Duramax/Petrol, King Duramax/CNG, King Duramax Plus/Petrol, King Duramax Plus/CNG |
| King Duramax Plus | 4 | 3 | King Duramax/Petrol, King Duramax/CNG, King Duramax Plus/Petrol, King Duramax Plus/CNG |
| King EV Max | 1 | 3 | King EV MAX/Electric |
| King Kargo | 10 | 3 | King Kargo/CNG PF, King Kargo/CNG Deck, King Kargo CNG HD/FSD, King Kargo CNG HD/PF, King Kargo CNG HD/Container, King Kargo CNG HD/CBC, King Kargo HD EV/FSD, King Kargo HD EV/PF, King Kargo HD EV/Container, King Kargo HD EV/CBC |
| King Kargo CNG HD | 6 | 0 | King Kargo/CNG PF, King Kargo/CNG Deck, King Kargo CNG HD/FSD, King Kargo CNG HD/PF, King Kargo CNG HD/Container, King Kargo CNG HD/CBC |
| King Kargo HD EV | 6 | 3 | King Kargo/CNG PF, King Kargo/CNG Deck, King Kargo HD EV/FSD, King Kargo HD EV/PF, King Kargo HD EV/Container, King Kargo HD EV/CBC |

### VLF

Source: `Missing raw source`

Brand totals: 1 models, 0 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Electric 3W rickshaw manufacturer | 0 | 0 | None |

### YC Electric

Source: `public/data/3w/yc-ev.json`

Brand totals: 1 models, 0 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Electric 3W manufacturer | 0 | 0 | None |

### Yo Electric

Source: `Missing raw source`

Brand totals: 1 models, 0 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Electric 3W manufacturer | 0 | 0 | None |


## 2W Brands

**Totals:** 68 brands, 540 models, 923 variants

### Ampere

Source: `public/data/2w/ampere-greaves.json`

Brand totals: 12 models, 18 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Magnus | 1 | 0 | NEO |
| Magnus Grand | 2 | 0 | Max, Standard |
| Magnus LT | 1 | 0 | Standard |
| Magnus Pro | 2 | 0 | Lead Acid Battery, Pro - Li Battery |
| Nexus | 2 | 0 | EX, ST |
| Primus | 1 | 0 | Standard |
| Reo | 1 | 0 | 80 |
| REO [2019-2023] | 2 | 0 | Lead Acid Battery, Li Battery |
| Reo Elite | 2 | 0 | Lead Acid Battery, Li Battery |
| V 48 | 2 | 0 | Lead Acid Battery, Li Battery |
| Zeal | 1 | 0 | Ex - Li Battery |
| Zeal EX | 1 | 0 | Standard |

### Aprilia

Source: `public/data/2w/aprilia-india.json`

Brand totals: 34 models, 52 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Caponord 1200 ABS | 1 | 0 | Standard |
| Caponord 1200 ABS Travel | 1 | 0 | Standard |
| Caponord 1200 Rally | 1 | 0 | Standard |
| Dorsoduro 900 | 1 | 0 | Standard |
| Dorsoduro 1200 ABS | 1 | 0 | Standard |
| Mana 850 | 1 | 0 | Standard |
| Mana 850 ABS | 1 | 0 | Standard |
| Mana 850 GT ABS | 1 | 0 | Standard |
| RS 457 | 2 | 0 | GP Replica, Standard |
| RS 457 [2023-2026] | 2 | 0 | Quickshifter, Standard |
| RS 660 | 1 | 0 | Standard |
| RS 660 [2020-2023] | 1 | 0 | Standard |
| RSV4 1100 Factory | 1 | 0 | Standard |
| RSV4 1100 Factory - [2020-2023] | 1 | 0 | Standard |
| RSV4 RF | 1 | 0 | Standard |
| RSV4 RR | 1 | 0 | Standard |
| Shiver 900 | 1 | 0 | Standard |
| SR 125 | 2 | 0 | hp.e, Premium |
| SR 150 | 9 | 0 | Carbon, Carbon-ABS - BS IV, Carbon-ABS - BS VI - Fi, Facelift, Facelift-ABS - BS IV, Facelift-ABS - BS VI - Fi, Race, Race-ABS - BS IV, Race-ABS - BS VI - Fi |
| SR 160 | 3 | 0 | Carbon, Premium, Race |
| SR 175 | 2 | 0 | GP Replica, hp.e |
| SR150 [2017-2018] | 2 | 0 | Race, Standard |
| SRV 850 ABS ATC | 1 | 0 | Standard |
| Storm 125 | 1 | 0 | Front Disc |
| SXR 125 | 1 | 0 | Premium |
| SXR 160 | 1 | 0 | Premium |
| Tuareg 457 | 1 | 0 | Standard |
| Tuareg 660 | 2 | 0 | Evocative Dakar Podium, Standard |
| Tuono 457 | 1 | 0 | Standard |
| Tuono 660 | 1 | 0 | Standard |
| Tuono 660 [2020-2023] | 1 | 0 | Standard |
| Tuono Factory | 1 | 0 | Standard |
| Tuono V4 1100 [2018-2019] | 2 | 0 | Factory, RR |
| Tuono V4 APRC | 2 | 0 | Standard, V4 R |

### Ather

Source: `public/data/2w/ather-energy.json`

Brand totals: 4 models, 9 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 450 Apex | 1 | 2 | 450 Apex 3.7 kWh |
| 450S | 2 | 4 | 450S 2.9 kWh, 450S 3.7 kWh |
| 450X | 2 | 5 | 450X 2.9 kWh, 450X 3.7 kWh |
| Rizta | 4 | 5 | Rizta S 2.9 kWh, Rizta S 3.7 kWh, Rizta Z 2.9 kWh, Rizta Z 3.7 kWh |

### Bajaj

Source: `public/data/2w/bajaj-auto.json`

Brand totals: 23 models, 42 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Avenger Cruise 220 | 1 | 2 | Standard |
| Avenger Street 160 | 1 | 3 | Standard |
| Chetak | 4 | 9 | 2801, 3501, 3502, 3503 |
| Chetak C25 | 1 | 6 | Standard |
| CT 100 | 1 | 3 | Standard |
| CT 110 | 1 | 4 | Standard |
| CT 110X | 1 | 3 | Standard |
| Dominar 250 | 1 | 3 | Standard |
| Dominar 400 | 1 | 2 | Standard |
| Freedom 125 CNG | 4 | 7 | Disc, Disc LED, Drum, Drum LED |
| Platina 100 | 1 | 4 | Standard |
| Platina 110 | 2 | 4 | Disc CBS, Standard |
| Pulsar 125 | 4 | 4 | Carbon, Neon, Split Seat, Standard Disc |
| Pulsar 150 | 3 | 4 | Single Disc, Split Seat, Twin Disc |
| Pulsar 220 F | 1 | 4 | Standard |
| Pulsar N125 | 2 | 5 | Carbon, Standard |
| Pulsar N160 | 4 | 6 | Bluetooth, Carbon Bluetooth, Dual Channel ABS, Single Channel ABS |
| Pulsar N250 | 1 | 3 | Standard |
| Pulsar NS125 | 3 | 6 | Bluetooth, Carbon, Standard |
| Pulsar NS160 | 1 | 4 | Standard |
| Pulsar NS200 | 2 | 4 | Bluetooth, Standard |
| Pulsar NS400Z | 1 | 4 | Standard |
| Pulsar RS 200 | 1 | 3 | Standard |

### Bajaj Chetak

Source: `public/data/2w/bajaj-chetak-ev.json`

Brand totals: 4 models, 5 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Chetak Leadr | 1 | 6 | Chetak Leadr 5.0 kWh |
| Chetak Legacy | 1 | 4 | Chetak Legacy 3.8 kWh |
| Chetak Premium | 2 | 9 | Chetak Premium 3.2 kWh, Chetak Premium 3.8 kWh |
| Chetak Urbane | 1 | 5 | Chetak Urbane 2.9 kWh |

### Battre Electric

Source: `public/data/2w/battre-ev.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| EM | 1 | 4 | EM |
| One | 1 | 4 | One |
| Smart | 1 | 4 | Smart |
| Yelo | 1 | 4 | Yelo |

### Benelli

Source: `public/data/2w/benelli-india.json`

Brand totals: 23 models, 27 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 302R | 1 | 0 | Standard |
| 502C | 1 | 0 | Standard |
| 752S | 1 | 0 | Standard |
| Imperiale 400 | 2 | 0 | Dual Channel ABS, Standard |
| Leoncino 250 [2020] | 1 | 0 | Standard |
| Leoncino 500 | 1 | 0 | Standard |
| Leoncino 500 BS4 | 1 | 0 | Standard |
| Leoncino 800 | 1 | 0 | Standard |
| TNT 25 | 2 | 0 | Premium, Standard |
| TNT 300 | 1 | 0 | Standard |
| TNT 300 [2020] | 1 | 0 | Standard |
| TNT 600GT | 1 | 0 | Standard |
| TNT 899 | 1 | 0 | Standard |
| TNT R | 1 | 0 | Standard |
| TNT600i | 1 | 0 | Standard |
| TNT600i [2020] | 2 | 0 | ABS, Standard |
| TRK 251 | 1 | 0 | Standard |
| TRK 502 | 1 | 0 | Standard |
| TRK 502 [2020-2024] | 1 | 0 | Standard |
| TRK 502 BS4 | 1 | 0 | Standard |
| TRK 502X | 2 | 0 | Limited Edition, Standard |
| TRK 502X [2020-2024] | 1 | 0 | Standard |
| TRK 502X BS4 | 1 | 0 | Standard |

### BGauss

Source: `public/data/2w/bgauss.json`

Brand totals: 3 models, 3 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| BG RUV 350 | 1 | 5 | BG RUV 350 Standard |
| C12 | 1 | 5 | C12 Standard |
| Oowah | 1 | 4 | Oowah Standard |

### BMW Motorrad

Source: `public/data/2w/bmw-motorrad-india.json`

Brand totals: 19 models, 29 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| C 400 GT | 1 | 1 | C 400 GT Standard |
| CE 02 | 1 | 2 | CE 02 Standard |
| CE 04 | 1 | 1 | CE 04 Standard |
| F 450 GS | 1 | 0 | F 450 GS |
| F 900 GS | 1 | 2 | F 900 GS Standard |
| F 900 GS Adventure | 2 | 2 | F 900 GS Adventure Pro, F 900 GS Adventure Standard |
| G310 RR | 3 | 5 | G310 RR LE, G310 RR Standard, G310 RR Urban GS Edition |
| K 1600 | 2 | 4 | K 1600 B, K 1600 GTL |
| M 1000 R | 1 | 3 | M 1000 R Standard |
| M 1000 XR | 1 | 1 | M 1000 XR Standard |
| R 12 | 1 | 1 | R 12 Standard |
| R 12 nine T | 1 | 1 | R 12 nine T Standard |
| R 1250 RT | 1 | 2 | R 1250 RT Standard |
| R 1300 GS | 2 | 2 | R 1300 GS Standard, R 1300 GS Triple Black |
| R 1300 GS Adventure | 4 | 4 | R 1300 GS Adventure Option 719, R 1300 GS Adventure Standard, R 1300 GS Adventure Style HP, R 1300 GS Adventure Triple Black |
| R18 | 1 | 5 | R18 Standard |
| S 1000 R | 1 | 3 | S 1000 R Standard |
| S 1000 XR | 1 | 3 | S 1000 XR Standard |
| S1000RR | 3 | 3 | S1000RR M Package, S1000RR M Sport, S1000RR Standard |

### Bounce

Source: `public/data/2w/bounce-infinity.json`

Brand totals: 1 models, 3 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Infinity E1 | 3 | 5 | E1 Limited Edition, E1 Plus, E1 Standard |

### Brixton Motorcycles

Source: `public/data/2w/brixton-motorcycles.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Cromwell 1200 | 1 | 3 | Cromwell 1200 Standard |
| Cromwell 1200 X | 1 | 3 | Cromwell 1200 X Standard |
| Crossfire 500 X | 1 | 3 | Crossfire 500 X Standard |
| Crossfire 500 XC | 1 | 3 | Crossfire 500 XC Standard |

### BSA

Source: `public/data/2w/bsa.json`

Brand totals: 3 models, 8 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Gold Star 650 | 6 | 4 | Dawn Silver, Highland Green, Insignia Red, Legacy Edition, Midnight Black, Shadow Black |
| Scrambler 650 | 1 | 0 | Scrambler 650 |
| Thunderbolt | 1 | 0 | Thunderbolt |

### CFMoto

Source: `public/data/2w/cfmoto-india.json`

Brand totals: 5 models, 5 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 300NK | 1 | 0 | 300NK |
| 450 MT | 1 | 0 | 450 MT |
| 650GT | 1 | 0 | 650GT |
| 650MT | 1 | 0 | 650MT |
| 650NK | 1 | 0 | 650NK |

### Ducati

Source: `public/data/2w/ducati-india.json`

Brand totals: 20 models, 37 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| DesertX | 3 | 4 | DesertX Discovery, DesertX Rally, DesertX Standard |
| Desmo450 MX | 1 | 1 | Desmo450 MX Standard |
| Diavel V4 | 1 | 2 | Diavel V4 Standard |
| Hypermotard 698 Mono | 1 | 1 | Hypermotard 698 Mono Standard |
| Hypermotard 950 | 2 | 3 | Hypermotard 950 SP, Hypermotard 950 Standard |
| Monster | 3 | 7 | Monster Plus, Monster SP, Monster Standard |
| Multistrada V2 | 3 | 3 | Multistrada V2 S (Red), Multistrada V2 S (Storm Green), Multistrada V2 Standard |
| Multistrada V4 | 3 | 4 | Multistrada V4 S, Multistrada V4 S Grand Tour, Multistrada V4 Standard |
| Multistrada V4 RS | 1 | 2 | Multistrada V4 RS Standard |
| Panigale V2 | 2 | 2 | Panigale V2 S, Panigale V2 Standard |
| Panigale V4 | 3 | 3 | Panigale V4 S, Panigale V4 SP2, Panigale V4 Standard |
| Panigale V4 R | 1 | 1 | Panigale V4 R Standard |
| Scrambler Full Throttle | 1 | 1 | Scrambler Full Throttle Standard |
| Scrambler Icon | 3 | 4 | Scrambler Icon S, Scrambler Icon Standard, Scrambler Icon Urban |
| Scrambler Icon Dark | 1 | 1 | Scrambler Icon Dark Standard |
| Scrambler Nightshift | 1 | 1 | Scrambler Nightshift Standard |
| Streetfighter V2 | 2 | 2 | Streetfighter V2 S, Streetfighter V2 Standard |
| Streetfighter V4 | 2 | 1 | Streetfighter V4 S, Streetfighter V4 Standard |
| SuperSport | 2 | 3 | SuperSport S, SuperSport Standard |
| XDiavel V4 | 1 | 2 | XDiavel V4 Standard |

### Evolet

Source: `public/data/2w/evolet.json`

Brand totals: 3 models, 3 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Derby | 1 | 5 | Derby Standard |
| Polo | 1 | 0 | Polo |
| Pony | 1 | 4 | Pony Standard |

### Ferrato

Source: `public/data/2w/ferrato.json`

Brand totals: 1 models, 1 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Disruptor | 1 | 3 | Disruptor Standard |

### Gemopai

Source: `public/data/2w/gemopai.json`

Brand totals: 3 models, 5 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Astrid Lite | 3 | 5 | Astrid Lite 1.7 kWh, Astrid Lite 2.16 kWh, Astrid Lite 2.88 kWh |
| Ryder | 1 | 3 | Ryder Standard |
| Ryder SuperMax | 1 | 4 | Ryder SuperMax Standard |

### Harley-Davidson

Source: `public/data/2w/harley-davidson-india.json`

Brand totals: 13 models, 25 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Breakout | 2 | 5 | Breakout Custom, Breakout Standard |
| CVO Road Glide | 1 | 3 | CVO Road Glide Standard |
| CVO Street Glide | 1 | 3 | CVO Street Glide Standard |
| Fat Boy | 2 | 4 | Fat Boy 30th Anniversary, Fat Boy Standard |
| Heritage Classic | 2 | 5 | Heritage Classic 3 Standard, Heritage Classic Standard |
| Nightster | 2 | 3 | Nightster S, Nightster Standard |
| Nightster Special | 2 | 3 | Nightster Special S, Nightster Special Standard |
| PAN America 1250 Special | 2 | 4 | PAN America 1250 Special S, PAN America 1250 Special Standard |
| Road Glide | 2 | 7 | Road Glide Custom, Road Glide Standard |
| Sportster S | 2 | 4 | Sportster S Custom, Sportster S Standard |
| Street Bob | 2 | 5 | Street Bob Custom, Street Bob Standard |
| Street Glide | 2 | 7 | Street Glide Custom, Street Glide Standard |
| X440 | 3 | 6 | X440 Standard, X440 T, X440 Vivid |

### Hero Electric

Source: `public/data/2w/hero-electric.json`

Brand totals: 4 models, 7 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Atria LX | 1 | 5 | Atria LX Standard |
| NYX HX | 2 | 4 | NYX E5, NYX HX |
| Optima CX | 2 | 4 | Optima CX HX, Optima CX Standard |
| Photon HX | 2 | 4 | Photon HX, Photon Standard |

### Hero MotoCorp

Source: `public/data/2w/hero-motocorp.json`

Brand totals: 24 models, 54 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Destini 125 | 3 | 5 | LX, VX, ZX |
| Glamour | 2 | 4 | Disc, Drum |
| Glamour X 125 | 2 | 5 | Disc, Drum |
| HF 100 | 1 | 3 | Standard |
| HF Deluxe | 4 | 7 | i3S, i3S IBS, Kick, Self |
| Karizma XMR | 2 | 4 | Combat Edition, Standard |
| Maestro Edge 125 | 3 | 5 | Disc, Drum, Xtec |
| Mavrick 440 | 3 | 5 | Base, Mid, Top |
| Passion Plus | 2 | 3 | Standard, Xtec |
| Pleasure Plus | 2 | 7 | Standard, Xtec |
| Splendor Plus | 3 | 7 | OBD2B, Standard, Xtec |
| Splendor Plus Xtec | 2 | 7 | Connected, Standard |
| Splendor Plus Xtec 2.0 | 1 | 4 | Standard |
| Super Splendor | 2 | 4 | Disc, Drum |
| Super Splendor Xtec | 1 | 4 | Standard |
| Xoom 110 | 3 | 6 | Standard, VX, ZX |
| Xoom 125 | 3 | 4 | Disc, Drum, ZX Disc |
| Xoom 160 | 1 | 4 | Standard |
| Xpulse 200 4V | 3 | 7 | Pro, Rally Kit, Standard |
| Xpulse 210 | 2 | 4 | Pro, Standard |
| Xtreme 125R | 4 | 6 | Connected Navigator, Connected OBD2, Single Seat, Standard |
| Xtreme 160R | 1 | 2 | Standard |
| Xtreme 160R 4V | 3 | 5 | Connected, Connected Navigator, Standard |
| Xtreme 250R | 1 | 3 | Standard |

### Honda Motorcycle & Scooter India

Source: `public/data/2w/honda.json`

Brand totals: 24 models, 45 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Activa 6G | 4 | 6 | Anniversary Edition, Deluxe, Premium, Standard |
| Activa 125 | 3 | 6 | Disc, Drum, H-Smart |
| Activa e | 2 | 5 | Premium, Standard |
| CB 125 Hornet | 1 | 4 | Standard |
| CB300F Flex-Fuel | 1 | 3 | Standard |
| CB350 | 2 | 5 | DLX, DLX Pro |
| CB350C | 3 | 5 | DLX, DLX Pro, Standard |
| CB350RS | 2 | 5 | DLX, DLX Pro |
| CB750 Hornet | 1 | 2 | Standard |
| CB1000 Hornet | 1 | 1 | Standard |
| Dio | 2 | 5 | Deluxe, Standard |
| Dio 125 | 3 | 6 | Deluxe, H-Smart, Standard |
| Goldwing Tour | 1 | 1 | DCT with Airbag |
| H'ness CB350 | 2 | 4 | DLX, DLX Pro |
| Hornet 2.0 | 1 | 4 | Standard |
| Livo | 2 | 3 | Disc, Drum |
| NX200 | 1 | 3 | Standard |
| QC1 | 1 | 5 | Standard |
| Shine | 3 | 6 | Disc, Drum, Limited Edition |
| Shine 100 | 2 | 9 | DX, Standard |
| SP 125 | 3 | 5 | Anniversary Edition, Disc, Drum |
| SP160 | 2 | 4 | Double Disc, Single Disc |
| Transalp XL750 | 1 | 2 | Standard |
| Unicorn | 1 | 3 | Standard |

### Hop Electric

Source: `public/data/2w/hop-electric.json`

Brand totals: 3 models, 3 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| LEO | 1 | 4 | LEO Standard |
| LYF | 1 | 0 | LYF |
| OXO | 1 | 4 | OXO Standard |

### Husqvarna

Source: `public/data/2w/husqvarna-india.json`

Brand totals: 2 models, 2 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Svartpilen 401 | 1 | 1 | Svartpilen 401 Standard |
| Vitpilen 250 | 1 | 1 | Vitpilen 250 Standard |

### Indian

Source: `public/data/2w/indian-motorcycle.json`

Brand totals: 27 models, 28 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 101 Scout | 1 | 0 | Standard |
| Chief Bobber Dark Horse | 1 | 0 | Standard |
| Chief Classic | 1 | 0 | Standard |
| Chief Dark Horse | 1 | 0 | Standard |
| Chief Dark Horse [2019-2020] | 1 | 0 | Standard |
| Chief Vintage | 1 | 0 | Standard |
| Chieftain | 1 | 0 | Standard |
| Chieftain Dark Horse | 1 | 0 | Standard |
| Chieftain Elite | 1 | 0 | Standard |
| FTR 1200 | 1 | 0 | Standard |
| FTR 1200 [2019-2020] | 2 | 0 | Race Replica, S |
| Roadmaster | 1 | 0 | Standard |
| Roadmaster Classic | 1 | 0 | Standard |
| Roadmaster Elite | 1 | 0 | Standard |
| Roadmaster Elite [2018-2019] | 1 | 0 | Standard |
| Scout | 1 | 0 | Standard |
| Scout Bobber | 1 | 0 | Standard |
| Scout Bobber [2017-2020] | 1 | 0 | Standard |
| Scout Classic | 1 | 0 | Standard |
| Scout Sixty | 1 | 0 | Standard |
| Scout Sixty Bobber | 1 | 0 | Standard |
| Scout Sixty Classic | 1 | 0 | Limited |
| Sport Scout | 1 | 0 | Standard |
| Sport Scout Sixty | 1 | 0 | Limited |
| Springfield | 1 | 0 | Standard |
| Super Chief Limited | 1 | 0 | Standard |
| Super Scout | 1 | 0 | Standard |

### iVOOMi

Source: `public/data/2w/ivoomi-energy.json`

Brand totals: 2 models, 2 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Jeet X | 1 | 5 | Jeet X Standard |
| S1 | 1 | 4 | S1 Standard |

### Jawa

Source: `public/data/2w/jawa-motorcycles.json`

Brand totals: 5 models, 13 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 42 | 3 | 8 | 42 Dual Channel ABS, 42 Special Edition, 42 Standard |
| 42 Bobber | 5 | 5 | 42 Bobber Black Mirror and Red Sheen - Alloy Wheel, 42 Bobber Jasper Red - Spoke Wheel, 42 Bobber Moonstone White - Spoke Wheel, 42 Bobber Mystic Copper - Alloy Wheel, 42 Bobber Mystic Copper - Spoke Wheel |
| 42 FJ | 2 | 5 | 42 FJ Dual Channel ABS, 42 FJ Standard |
| 350 | 2 | 5 | 350 Dual Channel ABS, 350 Standard |
| Perak | 1 | 3 | Perak Standard |

### Joy e-bike

Source: `public/data/2w/joy-e-bike.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Gen Nxt | 1 | 3 | Gen Nxt Standard |
| Glob | 1 | 3 | Glob Standard |
| Mihos | 1 | 3 | Mihos Standard |
| Wolf | 1 | 3 | Wolf Standard |

### Kabira Mobility

Source: `public/data/2w/kabira-mobility.json`

Brand totals: 8 models, 10 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Hermes 75 | 1 | 1 | Hermes 75 Standard |
| Intercity FS | 1 | 4 | Intercity FS 5 kWh |
| Intercity Neo | 1 | 4 | Intercity Neo 4 kWh |
| KM3000 | 1 | 4 | KM3000 3.5 kWh |
| KM3000 Mark 2 | 2 | 4 | KM3000 Mark 2 4.1 kWh, KM3000 Mark 2 5.15 kWh |
| KM4000 | 1 | 4 | KM4000 4 kWh |
| KM4000 Mark 2 | 2 | 4 | KM4000 Mark 2 4.1 kWh, KM4000 Mark 2 5.15 kWh |
| KM5000 | 1 | 4 | KM5000 5 kWh |

### Kawasaki

Source: `public/data/2w/kawasaki-india.json`

Brand totals: 22 models, 26 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Eliminator | 1 | 1 | Eliminator Standard |
| KLX230 | 1 | 2 | KLX230 Standard |
| KLX230R | 1 | 1 | KLX230R Standard |
| Ninja 300 | 1 | 2 | Ninja 300 Standard |
| Ninja 500 | 1 | 1 | Ninja 500 Standard |
| Ninja 650 | 1 | 1 | Ninja 650 Standard |
| Ninja 1100SX | 1 | 1 | Ninja 1100SX Standard |
| Ninja H2 SX SE | 1 | 1 | Ninja H2 SX SE Standard |
| Ninja ZX-4R | 2 | 3 | SE, Standard |
| Ninja ZX-6R | 1 | 1 | Ninja ZX-6R Standard |
| Ninja ZX-10R | 1 | 2 | Ninja ZX-10R Standard |
| Versys 650 | 1 | 1 | Versys 650 Standard |
| Versys 1100 | 1 | 1 | Versys 1100 Standard |
| Versys-X 300 | 1 | 1 | Versys-X 300 Standard |
| Vulcan S | 1 | 1 | Vulcan S Standard |
| W175 | 4 | 6 | W175 Cafe, W175 SE, W175 Standard, W175 Street |
| Z H2 | 1 | 1 | Z H2 Standard |
| Z650 | 1 | 1 | Z650 Standard |
| Z650RS | 1 | 1 | Z650RS Standard |
| Z900 | 1 | 2 | Standard |
| Z900RS | 1 | 3 | Standard |
| Z1100 | 1 | 1 | Z1100 Standard |

### Keeway

Source: `public/data/2w/keeway-india.json`

Brand totals: 8 models, 8 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| K-Light 250V | 1 | 3 | K-Light 250V Standard |
| K300 SF | 1 | 3 | K300 SF Standard |
| RR300 | 1 | 3 | RR300 Standard |
| Sixties 300i | 1 | 4 | Sixties 300i Standard |
| SR125 | 1 | 3 | SR125 Standard |
| SR250 | 1 | 3 | SR250 Standard |
| V302C | 1 | 3 | V302C Standard |
| Vieste 300 | 1 | 3 | Vieste 300 Standard |

### Kinetic Green

Source: `public/data/2w/kinetic.json`

Brand totals: 2 models, 3 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| DX | 2 | 4 | DX Standard, DX+ |
| E Luna | 1 | 4 | E Luna Standard |

### Komaki

Source: `public/data/2w/komaki.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Ranger | 1 | 4 | Ranger 96V 32Ah |
| TN-95 | 1 | 4 | TN-95 72V 28Ah |
| Venice | 1 | 5 | Venice 72V 36Ah |
| XGT K5 | 1 | 4 | XGT K5 96V 40Ah |

### KTM

Source: `public/data/2w/ktm-india.json`

Brand totals: 11 models, 15 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 160 Duke | 2 | 3 | Special, Standard |
| 160 Duke TFT | 1 | 3 | Standard |
| 200 Duke | 2 | 4 | Special, Standard |
| 250 Adventure | 1 | 2 | Standard |
| 250 Duke | 1 | 4 | Standard |
| 390 Adventure | 1 | 2 | Standard |
| 390 Adventure X | 1 | 2 | Standard |
| 390 Duke | 1 | 3 | Standard |
| RC 160 | 1 | 3 | Standard |
| RC 200 | 2 | 4 | Special, Standard |
| RC 390 | 2 | 3 | GP Edition, Standard |

### Lectrix

Source: `public/data/2w/lectrix-ev.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| LXS 2.0 | 1 | 4 | LXS 2.0 Standard |
| LXS 3.0 | 1 | 4 | LXS 3.0 Standard |
| Nduro | 1 | 5 | Nduro Standard |
| SX25 | 1 | 4 | SX25 Standard |

### Mahindra

Source: `public/data/2w/mahindra-two-wheelers.json`

Brand totals: 3 models, 3 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Centuro N1 | 1 | 0 | Centuro N1 |
| Gusto 125 | 1 | 0 | Gusto 125 |
| Mojo XT300 | 1 | 0 | Mojo XT300 |

### Matter

Source: `public/data/2w/matter-ev.json`

Brand totals: 1 models, 2 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| AERA | 2 | 4 | AERA 5000, AERA 5000+ |

### Moto Guzzi

Source: `public/data/2w/moto-guzzi.json`

Brand totals: 7 models, 7 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Audace | 1 | 0 | Audace |
| California 1400 | 1 | 0 | California 1400 |
| Eldorado | 1 | 0 | Eldorado |
| Griso 1200 8V SE | 1 | 0 | Griso 1200 8V SE |
| V9 Bobber | 1 | 0 | V9 Bobber |
| V9 Roamer | 1 | 0 | V9 Roamer |
| V85 TT | 1 | 4 | V85 TT Standard |

### Moto Morini

Source: `public/data/2w/motomorini.json`

Brand totals: 2 models, 3 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Seiemmezzo | 2 | 3 | Seiemmezzo SCR, Seiemmezzo STR |
| X-Cape | 1 | 3 | X-Cape Standard |

### Norton

Source: `public/data/2w/norton-motorcycles.json`

Brand totals: 7 models, 7 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Atlas | 1 | 0 | Standard |
| Atlas GT | 1 | 0 | Standard |
| Commando 961 | 1 | 0 | Sport MK II |
| Dominator | 1 | 0 | Standard |
| Manx | 1 | 0 | Standard |
| Manx R | 1 | 0 | Standard |
| V4 | 1 | 0 | Standard |

### Numeros

Source: `public/data/2w/numeros.json`

Brand totals: 2 models, 2 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Diplos | 1 | 4 | Diplos Standard |
| n-First | 1 | 4 | n-First Standard |

### Oben

Source: `public/data/2w/oben-electric.json`

Brand totals: 3 models, 3 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Rorr | 1 | 5 | Rorr Standard |
| Rorr EZ | 1 | 3 | Rorr EZ Standard |
| Rorr EZ Sigma | 1 | 4 | Rorr EZ Sigma Standard |

### Odysse

Source: `public/data/2w/odysse-electric.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| E2Go | 1 | 3 | E2Go Standard |
| Evoqis | 1 | 3 | Evoqis Standard |
| Hawk | 1 | 4 | Hawk Standard |
| Vader | 1 | 4 | Vader Standard |

### Okaya EV

Source: `public/data/2w/okaya-ev.json`

Brand totals: 6 models, 6 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Classiq Pro | 1 | 4 | Classiq Pro |
| Faast F2B | 1 | 4 | Faast F2B |
| Faast F4 | 1 | 4 | Faast F4 |
| Ferrato Connect | 1 | 4 | Ferrato Connect |
| Hunk H1 | 1 | 4 | Hunk H1 |
| Motofaast | 1 | 4 | Motofaast |

### Okinawa

Source: `public/data/2w/okinawa-autotech.json`

Brand totals: 8 models, 8 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Dual 100 | 1 | 4 | Dual 100 Standard |
| i-Praise | 1 | 4 | i-Praise Standard |
| Lite | 1 | 4 | Lite Standard |
| OKHI-90 | 1 | 5 | OKHI-90 Standard |
| Praise | 1 | 5 | Praise Standard |
| R30 | 1 | 4 | R30 Standard |
| Ridge 100 | 1 | 4 | Ridge 100 Standard |
| Ridge Plus | 1 | 3 | Ridge Plus Standard |

### OLA Electric

Source: `public/data/2w/ola-electric.json`

Brand totals: 8 models, 21 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Roadster | 3 | 5 | Roadster 3.5 kWh, Roadster 4.5 kWh, Roadster 5.6 kWh |
| Roadster Pro | 2 | 1 | Roadster Pro Max, Roadster Pro Standard |
| Roadster X | 3 | 5 | Roadster X 2 kWh, Roadster X 3 kWh, Roadster X 4 kWh |
| Roadster X Plus | 2 | 6 | Roadster X Plus 4.5 kWh, Roadster X Plus 11 kWh |
| S1 Pro | 4 | 6 | S1 Pro 4 kWh, S1 Pro 5.3 kWh, S1 Pro 6.3 kWh, S1 Pro Plus 8.5 kWh |
| S1 X | 4 | 5 | S1 X 2 kWh, S1 X 3 kWh, S1 X 4 kWh, S1 X Plus |
| S1 Z | 2 | 4 | S1 Z 1.5 kWh, S1 Z 3 kWh |
| S1 Z Plus | 1 | 4 | S1 Z Plus 3 kWh |

### OPG Mobility

Source: `public/data/2w/opg-mobility.json`

Brand totals: 8 models, 8 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Classiq | 1 | 4 | Classiq Standard |
| Faast F2B | 1 | 4 | Faast F2B Standard |
| Faast F2F | 1 | 4 | Faast F2F Standard |
| Faast F2T | 1 | 3 | Faast F2T Standard |
| Faast F3 | 1 | 5 | Faast F3 Standard |
| Faast F4 | 1 | 5 | Faast F4 Standard |
| Freedum | 1 | 4 | Freedum Standard |
| Motofaast | 1 | 4 | Motofaast Standard |

### Pure EV

Source: `public/data/2w/pure-ev.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| EcoDryft | 1 | 3 | EcoDryft Standard |
| EPluto 7G | 1 | 3 | EPluto 7G Standard |
| ETrance Neo | 1 | 3 | ETrance Neo Standard |
| Etryst 350 | 1 | 3 | Etryst 350 Standard |

### QJ Motor India

Source: `public/data/2w/qj-motor-india.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| SRC 250 | 1 | 3 | SRC 250 Standard |
| SRC 500 | 1 | 3 | SRC 500 Standard |
| SRK 400 | 1 | 3 | SRK 400 Standard |
| SRV 300 | 1 | 4 | SRV 300 Standard |

### Quantum Energy

Source: `public/data/2w/quantum-energy.json`

Brand totals: 3 models, 3 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Bziness | 1 | 4 | Bziness Standard |
| Milan | 1 | 3 | Milan Standard |
| Plasma | 1 | 4 | Plasma Standard |

### Raptee HV

Source: `public/data/2w/raptee.json`

Brand totals: 1 models, 1 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| T30 | 1 | 3 | T30 Standard |

### Revolt

Source: `public/data/2w/revolt-motors.json`

Brand totals: 4 models, 5 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| RV BlazeX | 1 | 2 | RV BlazeX Standard |
| RV1 | 1 | 2 | RV1 Standard |
| RV1+ | 1 | 2 | RV1+ Standard |
| RV400 | 2 | 3 | RV400 BRZ Edition, RV400 Standard |

### River

Source: `public/data/2w/river-ev.json`

Brand totals: 1 models, 1 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Indie | 1 | 4 | Indie Standard |

### Royal Enfield

Source: `public/data/2w/royal-enfield.json`

Brand totals: 14 models, 54 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Bear 650 | 5 | 5 | Boardwalk White, Golden Shadow, Petrol Green, Two Four Nine, Wild Honey |
| Bullet 350 | 4 | 5 | Battalion Black, Black Gold, Military Black, Standard |
| Classic 350 | 7 | 9 | Chrome Bronze, Chrome Red, Dark, Halcyon, Signals, Special Edition, Standard |
| Classic 650 | 4 | 4 | Chrome, Limited, Special, Standard |
| Continental GT 650 | 3 | 5 | Chrome, Special Edition, Standard |
| Goan Classic 350 | 2 | 4 | Special, Standard |
| Guerrilla 450 | 3 | 8 | Flash, S, Trailblazer |
| Himalayan 450 | 5 | 6 | Base, Explore, Pack, Sherpa, Summit |
| Hunter 350 | 3 | 7 | Metro, Metro Rebel, Retro |
| Interceptor 650 | 4 | 6 | Chrome, Mark 2, Special Edition, Standard |
| Meteor 350 | 5 | 8 | Aurora, Fireball, Limited Edition, Stellar, Supernova |
| Scram 440 | 2 | 5 | Special, Standard |
| Shotgun 650 | 3 | 4 | Limited, Special, Standard |
| Super Meteor 650 | 4 | 6 | Astral, Celestial, Interstellar, Special Edition |

### Simple Energy

Source: `public/data/2w/simple-energy.json`

Brand totals: 2 models, 2 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| One Gen 2 | 1 | 5 | One Gen 2 Standard |
| One S Gen 2 | 1 | 4 | One S Gen 2 Standard |

### Suzuki

Source: `public/data/2w/suzuki-motorcycle.json`

Brand totals: 12 models, 26 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Access 125 | 6 | 6 | Bluetooth, Bluetooth Special Edition, Disc CBS, Disc CBS Special Edition, Drum, Ride Connect |
| Avenis 125 | 3 | 6 | Limited Edition, Special, Standard |
| Burgman Street 125 | 4 | 5 | Bluetooth, EX, EX Bluetooth, Standard |
| E Access | 1 | 4 | Standard |
| Gixxer | 2 | 4 | Special Edition, Standard |
| Gixxer 250 | 2 | 5 | Special Edition, Standard |
| Gixxer SF | 2 | 6 | Special Edition, Standard |
| Gixxer SF 250 | 2 | 5 | Special Edition, Standard |
| Gixxer SF 250 Flex Fuel | 1 | 2 | Standard |
| GSX-8R | 1 | 3 | Standard |
| Hayabusa | 1 | 3 | Standard |
| V-Strom SX | 1 | 5 | Standard |

### Tork Motors

Source: `public/data/2w/tork-motors.json`

Brand totals: 1 models, 1 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Kratos R | 1 | 3 | Kratos R Standard |

### Triumph

Source: `public/data/2w/triumph-india.json`

Brand totals: 21 models, 29 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Bonneville Bobber | 1 | 5 | Bonneville Bobber Standard |
| Bonneville Speedmaster | 1 | 4 | Bonneville Speedmaster Standard |
| Bonneville T100 | 1 | 4 | Bonneville T100 Standard |
| Bonneville T120 | 1 | 4 | Bonneville T120 Standard |
| Daytona 660 | 1 | 3 | Daytona 660 Standard |
| Rocket 3 | 2 | 5 | Rocket 3 GT, Rocket 3 R |
| Scrambler 400 X | 1 | 4 | Scrambler 400 X Standard |
| Scrambler 400 XC | 1 | 3 | Scrambler 400 XC Standard |
| Scrambler 1200 | 1 | 3 | Scrambler 1200 Standard |
| Speed 400 | 1 | 4 | Speed 400 Standard |
| Speed T4 | 1 | 5 | Speed T4 Standard |
| Speed Triple 1200 RS | 2 | 4 | Speed Triple 1200 RS Carbon, Speed Triple 1200 RS Standard |
| Speed Twin 900 | 1 | 3 | Speed Twin 900 Standard |
| Speed Twin 1200 | 3 | 5 | Speed Twin 1200 RS, Speed Twin 1200 S, Speed Twin 1200 Standard |
| Street Triple R | 1 | 3 | Street Triple R Standard |
| Street Triple RS | 1 | 5 | Street Triple RS Standard |
| Thruxton 400 | 1 | 4 | Thruxton 400 Standard |
| Tiger 900 | 2 | 6 | Tiger 900 GT, Tiger 900 Rally |
| Tiger 1200 | 4 | 4 | Tiger 1200 Explorer, Tiger 1200 Pro, Tiger 1200 Rally Explorer, Tiger 1200 Rally Pro |
| Tiger Sport 660 | 1 | 3 | Tiger Sport 660 Standard |
| Trident 660 | 1 | 4 | Trident 660 Standard |

### TVS

Source: `public/data/2w/tvs-iqube.json`

Brand totals: 1 models, 6 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| iQube | 6 | 8 | iQube 2.2 kWh, iQube S 2.2 kWh, iQube S 3.0 kWh, iQube ST 3.0 kWh, iQube ST 3.5 kWh, iQube ST 3.5 kWh Plus |

### TVS

Source: `public/data/2w/tvs-motor.json`

Brand totals: 18 models, 72 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Apache RR 310 | 4 | 4 | BTO S, BTO Special, BTO Standard, Standard |
| Apache RTR 160 | 5 | 7 | Bluetooth, Race Edition, Race Edition Bluetooth, Special Edition, Standard |
| Apache RTR 160 4V | 6 | 7 | Black Champagne Dual ABS, Dual Channel ABS, Race Edition Dual ABS, Race Edition Single ABS, Single Channel ABS, Special Edition |
| Apache RTR 200 4V | 4 | 6 | Black Champagne, Dual Channel ABS, Race Edition, Single Channel ABS |
| Apache RTR 310 | 3 | 4 | Premium, Special, Standard |
| Apache RTX | 3 | 5 | Premium, Special, Standard |
| iQube | 6 | 8 | Premium (3.5 kWh), S (2.2 kWh), ST (3.1 kWh), ST+ (3.5 kWh), STX (3.5 kWh), STX Plus (3.5 kWh) |
| Jupiter | 5 | 6 | SmartXonnect, SmartXonnect Disc, Standard, ZX, ZX Disc |
| Jupiter 125 | 4 | 8 | Disc, Drum, ZX, ZX Disc |
| Ntorq 125 | 5 | 8 | Race Edition, Super Squad Edition, XT, XT 125 Connected, XT 125 Race Edition |
| Ntorq 150 | 3 | 4 | Connected, Race Edition, Standard |
| Orbiter | 2 | 6 | Connect, Standard |
| Radeon | 4 | 6 | Disc, Disc i-TOUCHstart, Drum, Drum i-TOUCHstart |
| Raider 125 | 7 | 5 | Disc, Drum, SmartConnect Disc, SmartConnect Drum, SuperSquad Edition, XT Disc, XT SmartConnect |
| Ronin | 6 | 7 | Bluetooth Dual ABS, Bluetooth Single ABS, Dual Channel ABS, Matt Bluetooth Dual ABS, Matt Dual ABS, Single Channel ABS |
| Sport | 2 | 8 | Disc, Drum |
| Star City Plus | 2 | 4 | Disc, Drum |
| X | 1 | 1 | Standard |

### Ultraviolette

Source: `public/data/2w/ultraviolette.json`

Brand totals: 6 models, 6 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| F77 Mach 2 | 1 | 3 | F77 Mach 2 Standard |
| F77 Mach 2 Recon | 1 | 6 | F77 Mach 2 Recon Standard |
| F77 SuperStreet | 1 | 3 | F77 SuperStreet Standard |
| Shockwave | 1 | 3 | Shockwave Standard |
| Tesseract | 1 | 3 | Tesseract Standard |
| X47 Crossover | 1 | 3 | X47 Crossover Standard |

### Vespa

Source: `public/data/2w/vespa-india.json`

Brand totals: 22 models, 60 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 125 | 3 | 0 | Qala Edition, Standard, Tech 125 |
| 150 | 2 | 0 | Standard, Tech 150 |
| 946 | 1 | 0 | Standard |
| 946 Dragon | 1 | 0 | Standard |
| Elegante 125 | 3 | 0 | BS VI, CBS, Standard |
| Elegante 150 | 3 | 0 | BS IV - Carb, BS VI - FI, Connectivity |
| LX | 1 | 0 | 125 |
| LX 125 | 2 | 0 | BS VI, Standard |
| Notte | 2 | 0 | BS VI, Standard |
| Officina 8 | 1 | 0 | Standard |
| RED | 1 | 0 | Standard |
| S | 1 | 0 | Standard |
| S 125 | 2 | 0 | Standard, Tech 125 |
| S 150 | 2 | 0 | Standard, Tech 150 |
| SXL 125 | 8 | 0 | BS IV - Carb, BS VI - FI, Candy Red - BS - VI - FI, Dual, Premium, Racing Sixties, Sport, Standard |
| SXL 150 | 10 | 0 | BS - IV - Carb, BS VI - FI, Candy Red - ABS - BS - VI, Connectivity, Dual, Matt Red - ABS - BS - IV, Matt Red - Connectivity, Premium, Racing Sixties, Sport |
| Urban Club | 2 | 0 | BS IV, BS VI |
| VX 125 | 1 | 0 | Standard |
| VXL 125 | 6 | 0 | 75th Anniversary Limited Edition, BS VI, CBS, Dual, Premium, Standard |
| VXL 150 | 6 | 0 | 75th Anniversary Limited Edition, BS VI, Connectivity, Connectivity - ABS, Dual, Premium |
| VXL 150 Anniversary Edition | 1 | 0 | Standard |
| ZX 125 | 1 | 0 | Premium |

### VIDA

Source: `public/data/2w/vida-hero.json`

Brand totals: 2 models, 6 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| V2 | 2 | 6 | V2 Plus, V2 Pro |
| VX2 | 4 | 7 | VX2 2 kWh, VX2 2.5 kWh, VX2 3 kWh, VX2 3.4 kWh |

### VLF

Source: `public/data/2w/vlf.json`

Brand totals: 2 models, 2 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Mobster | 1 | 4 | Mobster Standard |
| Tennis 1500 | 1 | 4 | Tennis 1500 Standard |

### Yamaha

Source: `public/data/2w/yamaha-india.json`

Brand totals: 16 models, 38 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Aerox 155 | 2 | 4 | S, Standard |
| EC 06 | 1 | 1 | Standard |
| Fascino 125 | 6 | 7 | Deluxe, Disc, Drum, Hybrid Disc, Hybrid Drum, Saree Guard Drum |
| FZ FI V3 | 1 | 2 | Standard |
| FZ Rave | 1 | 2 | Standard |
| FZ S Hybrid | 1 | 3 | Standard |
| FZ X | 2 | 2 | Connected, Standard |
| FZ X Hybrid | 1 | 1 | Standard |
| FZS FI V4 | 3 | 7 | DLX, Special Edition, Standard |
| MT 03 | 1 | 3 | Standard |
| MT 15 V2 | 3 | 5 | DLX, Special, Standard |
| R3 | 1 | 3 | Standard |
| R15 V4 | 6 | 9 | Dark Knight, Icon Performance, MotoGP Edition, Special Edition, Standard, V4 M |
| R15S | 1 | 3 | Standard |
| Ray ZR 125 | 4 | 9 | Disc, Disc Street Rally, Drum, Drum Street Rally |
| XSR 155 | 4 | 5 | DLX, Matte, Special, Standard |

### Yezdi

Source: `public/data/2w/yezdi-motorcycles.json`

Brand totals: 3 models, 8 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Adventure | 4 | 6 | Adventure Dual Channel ABS, Adventure Standard, Adventure STD BS6 Phase 2B, Adventure Top Variant |
| Roadster | 2 | 5 | Roadster Dual Channel ABS, Roadster Standard |
| Scrambler | 2 | 7 | Scrambler Dual Channel ABS, Scrambler Standard |

### Yo

Source: `public/data/2w/yo.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Drift | 1 | 5 | Drift Standard |
| Edge | 1 | 4 | Edge Standard |
| EXL | 1 | 0 | YO EXL |
| Xplor | 1 | 0 | YO Xplor |

### Yulu

Source: `public/data/2w/yulu.json`

Brand totals: 3 models, 5 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| Bike D | 1 | 3 | Bike D Standard |
| Miracle GR | 2 | 4 | Miracle GR (Without Battery), Miracle GR Swappable |
| Wynn | 2 | 5 | Wynn (Without Battery), Wynn Swappable |

### Zontes

Source: `public/data/2w/zontes-india.json`

Brand totals: 4 models, 4 variants

| Model | Variants | Colours | Variant Names |
| --- | ---: | ---: | --- |
| 350R | 1 | 3 | 350R Standard |
| 350T | 1 | 3 | 350T Standard |
| 350X | 1 | 3 | 350X Standard |
| GK350 | 1 | 3 | GK350 Standard |

