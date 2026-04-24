# 4W Ex-Showroom Price Sync Checklist

Generated: 2026-04-24T10:27:47.042Z

This checklist is grouped make-wise, then model-wise, so we can fix one model at a time from the live Cardekho variants page.

Priority order:
- `MISMATCH`: local price exists but does not equal current Cardekho price
- `NO_PRICE_PARSED`: current Cardekho variants page exists, but our audit could not reliably parse the live price
- `ERROR`: fetch / parsing / model resolution issue
- `LOCAL_ONLY_VARIANT`: local variant is not matching the current Cardekho feed
- `CARDEKHO_ONLY_VARIANT`: current Cardekho variant is not present locally

Actionable rows: 5408
Makes with pending work: 31

## Audi

Pending models: 5
Pending rows: 32

### A8 L

Cardekho variants: https://www.cardekho.com/audi/a8-l/variants.htm
Rows to review: 2
Status mix: LOCAL_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Technology` (₹1,62,57,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Technology BSVI` (₹1,62,57,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed

### Q3

Cardekho variants: https://www.cardekho.com/audi/q3/variants.htm
Rows to review: 12
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=10

- [ ] LOCAL_ONLY_VARIANT: local `40 TFSI Premium Plus` (₹43,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `40 TFSI Technology` (₹50,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Bold Edition` (₹52,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Bold Edition` (₹52,99,999)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium` (₹43,67,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium` (₹48,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium Plus` (₹48,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium Plus` (₹52,31,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Line` (₹52,31,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Line` (₹52,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Technology` (₹52,99,999)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Technology` (₹43,67,000)
  Note: Current Cardekho variant not found locally

### Q3 Sportback

Cardekho variants: https://www.cardekho.com/audi/q3-sportback/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `40 TFSI Premium Plus` (₹46,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `40 TFSI Technology` (₹53,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `40TFSI Quattro` (₹53,71,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `40TFSI Quattro` (₹52,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Bold Edition` (₹52,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Line` (₹53,55,000)
  Note: Current Cardekho variant not found locally

### Q8 e-tron

Cardekho variants: https://www.cardekho.com/audi/q8-e-tron/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `55 quattro Premium Plus` (₹1,14,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `55 quattro Technology` (₹1,26,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SQ8 e-tron` (₹1,73,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `50 Quattro` (₹1,14,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `50 Quattro` (₹1,27,13,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `55 Quattro` (₹1,27,13,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `55 Quattro` (₹1,14,73,000)
  Note: Current Cardekho variant not found locally

### Q8 Sportback e-tron

Cardekho variants: https://www.cardekho.com/audi/q8-sportback-e-tron/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `55 quattro Premium Plus` (₹1,18,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `55 quattro Technology` (₹1,30,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SQ8 Sportback e-tron` (₹1,79,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `50 Quattro` (₹1,19,23,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `55 Quattro` (₹1,31,63,000)
  Note: Current Cardekho variant not found locally

## Bentley

Pending models: 3
Pending rows: 16

### Continental GT

Cardekho variants: https://www.cardekho.com/bentley/continental-gt/variants.htm
Rows to review: 3
Status mix: NO_PRICE_PARSED=3

- [ ] NO_PRICE_PARSED: local `Mulliner V8` (₹6,95,07,527) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Speed` (₹6,45,96,706) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `V8` (₹5,22,93,489) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Continental GTC

Cardekho variants: https://www.cardekho.com/bentley/continental-gtc/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Mulliner W12` (₹8,44,95,434) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Flying Spur

Cardekho variants: https://www.cardekho.com/bentley/flying-spur/variants.htm
Rows to review: 12
Status mix: CARDEKHO_ONLY_VARIANT=12

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Hybrid Azure` (₹6,57,70,194)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Hybrid Azure` (₹6,63,31,750)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Mulliner V8` (₹7,30,64,045)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S Hybrid` (₹6,39,65,265)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S V8` (₹6,34,90,103)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S V8` (₹6,39,65,265)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Speed Edition 12` (₹6,99,90,827)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V8 Azure` (₹6,63,31,750)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V8 Azure` (₹6,82,17,181)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V8 Hybrid` (₹5,67,45,059)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V8 Hybrid` (₹6,34,90,103)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `W12 Speed` (₹6,82,17,181)
  Note: Current Cardekho variant not found locally

## BMW

Pending models: 7
Pending rows: 19

### 3 Series Gran Limousine

Cardekho variants: https://www.cardekho.com/bmw/3-series-gran-limousine/variants.htm
Rows to review: 3
Status mix: NO_PRICE_PARSED=3

- [ ] NO_PRICE_PARSED: local `330Li M Sport` (₹61,50,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `M340i 50 Jahre Edition` (₹72,85,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `M340i xDrive` (₹75,40,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### 6 Series GT

Cardekho variants: https://www.cardekho.com/bmw/6-series-gt/variants.htm
Rows to review: 4
Status mix: NO_PRICE_PARSED=4

- [ ] NO_PRICE_PARSED: local `620d M Sport` (₹75,50,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `620d M Sport Signature` (₹78,90,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `630d M Sport` (₹79,90,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `630i M Sport` (₹73,50,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### 8 Series Gran Coupe

Cardekho variants: https://www.cardekho.com/bmw/8-series-gran-coupe/variants.htm
Rows to review: 2
Status mix: NO_PRICE_PARSED=2

- [ ] NO_PRICE_PARSED: local `840i M Sport` (₹1,29,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `M850i xDrive` (₹1,69,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### M340i

Cardekho variants: https://www.cardekho.com/bmw/3-series/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `50 Jahre Edition` (₹72,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `xDrive` (₹75,40,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `M340i 50 Jahre Edition` (₹72,85,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `M340i 50 Jahre Edition` (₹75,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `M340i xDrive` (₹75,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `M340i xDrive` (₹72,85,000)
  Note: Current Cardekho variant not found locally

### M4

Cardekho variants: https://www.cardekho.com/bmw/m4/variants.htm
Rows to review: 2
Status mix: NO_PRICE_PARSED=2

- [ ] NO_PRICE_PARSED: local `Competition xDrive` (₹1,55,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `CS xDrive` (₹1,79,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### M8

Cardekho variants: https://www.cardekho.com/bmw/m8/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `50 Jahre M Edition` (₹2,38,40,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### X5 M Competition

Cardekho variants: https://www.cardekho.com/bmw/x5-m-competition/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Competition` (₹2,07,90,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

## BYD

Pending models: 3
Pending rows: 20

### eMAX 7

Cardekho variants: https://www.cardekho.com/byd/emax-7/variants.htm
Rows to review: 12
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Premium 6-Seater` (₹29,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Premium 7-Seater` (₹29,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Superior 6-Seater` (₹26,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Superior 7-Seater` (₹26,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium 6Str` (₹26,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium 6Str` (₹27,50,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium 7Str` (₹27,50,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium 7Str` (₹29,30,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Superior 6Str` (₹29,30,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Superior 6Str` (₹29,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Superior 7Str` (₹29,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Superior 7Str` (₹26,90,000)
  Note: Current Cardekho variant not found locally

### Seal

Cardekho variants: https://www.cardekho.com/byd/seal/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Dynamic` (₹41,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Premium` (₹47,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Dynamic Range` (₹41,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Dynamic Range` (₹45,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium Range` (₹45,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium Range` (₹53,15,000)
  Note: Current Cardekho variant not found locally

### Sealion 7

Cardekho variants: https://www.cardekho.com/byd/sealion-7/variants.htm
Rows to review: 2
Status mix: CARDEKHO_ONLY_VARIANT=2

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Performance Anniversary Edition` (₹54,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium Anniversary Edition` (₹49,40,000)
  Note: Current Cardekho variant not found locally

## Citroën

Pending models: 5
Pending rows: 40

### Aircross

Rows to review: 7
Status mix: NO_SOURCE_URL=7

- [ ] NO_SOURCE_URL: local `X Plus` (₹9,77,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X Turbo Max 7 Seater` (₹13,19,600) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X Turbo Max 7 Seater DT` (₹13,39,600) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X Turbo Max AT 7 Seater` (₹14,36,600) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X Turbo Max AT 7 Seater DT` (₹14,56,600) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X Turbo Plus 7 Seater` (₹11,99,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X You` (₹8,29,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL

### Basalt

Rows to review: 10
Status mix: NO_SOURCE_URL=10

- [ ] NO_SOURCE_URL: local `Max Turbo` (₹12,00,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Max Turbo AT` (₹13,10,500) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Max Turbo X` (₹11,88,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Max Turbo X AT` (₹13,74,500) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Max Turbo X AT DT` (₹13,95,500) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Max Turbo X DT` (₹12,09,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Plus` (₹9,95,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Plus Turbo` (₹10,85,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Plus Turbo AT` (₹12,07,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `You` (₹8,55,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL

### C3

Rows to review: 16
Status mix: NO_SOURCE_URL=16

- [ ] NO_SOURCE_URL: local `Feel` (₹5,85,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Feel CNG` (₹8,45,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Feel Optional` (₹6,80,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Feel Optional CNG` (₹7,58,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Live` (₹4,95,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Live CNG` (₹5,73,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Shine Dark Edition` (₹8,38,300) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Shine Dark Edition CNG` (₹9,31,300) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Shine Turbo Dark Edition` (₹9,58,300) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Shine Turbo Dark Edition AT` (₹10,19,300) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Turbo Shine DT AT` (₹10,14,800) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Turbo Shine Sport Edition AT` (₹10,20,801) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X Shine` (₹7,63,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X Shine CNG` (₹8,16,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X Shine Turbo` (₹8,74,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `X Shine Turbo AT` (₹9,45,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL

### C5 Aircross

Rows to review: 2
Status mix: NO_SOURCE_URL=2

- [ ] NO_SOURCE_URL: local `Shine` (₹37,32,400) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Shine Pack` (₹39,22,400) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL

### eC3

Rows to review: 5
Status mix: NO_SOURCE_URL=5

- [ ] NO_SOURCE_URL: local `Feel` (₹12,90,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Feel DT` (₹13,06,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Live` (₹12,90,000) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Shine` (₹13,26,300) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL
- [ ] NO_SOURCE_URL: local `Shine DT` (₹13,41,300) -> Cardekho `—` (—)
  Note: NO_SOURCE_URL

## Ferrari

Pending models: 1
Pending rows: 3

### 12Cilindri

Cardekho variants: https://www.cardekho.com/ferrari/12cilindri/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `V12` (₹8,50,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Coupe` (₹8,50,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Coupe` (₹9,15,00,000)
  Note: Current Cardekho variant not found locally

## Force Motors

Pending models: 9
Pending rows: 9

### Force Gurkha 3-Door 4x4

Cardekho variants: https://www.cardekho.com/force/force-gurkha-3-door-4x4/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Force Gurkha 3-Door 4x4` (₹0) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Force Gurkha 5-Door 4x4

Cardekho variants: https://www.cardekho.com/force/force-gurkha-5-door-4x4/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Force Gurkha 5-Door 4x4` (₹0) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Force Trax Cruiser 12 STR

Cardekho variants: https://www.cardekho.com/force/force-trax-cruiser-12-str/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Force Trax Cruiser 12 STR` (₹0) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Force Trax Cruiser 12 STR AC

Cardekho variants: https://www.cardekho.com/force/force-trax-cruiser-12-str-ac/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Force Trax Cruiser 12 STR AC` (₹0) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Force Trax Cruiser 9 STR

Cardekho variants: https://www.cardekho.com/force/force-trax-cruiser-9-str/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Force Trax Cruiser 9 STR` (₹0) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Force Trax Cruiser 9 STR AC

Cardekho variants: https://www.cardekho.com/force/force-trax-cruiser-9-str-ac/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Force Trax Cruiser 9 STR AC` (₹0) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Force Urbania 10-Seater

Cardekho variants: https://www.cardekho.com/force/force-urbania-10-seater/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Force Urbania 10-Seater` (₹0) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Force Urbania 13-Seater

Cardekho variants: https://www.cardekho.com/force/force-urbania-13-seater/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Force Urbania 13-Seater` (₹0) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Force Urbania 17-Seater

Cardekho variants: https://www.cardekho.com/force/force-urbania-17-seater/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Force Urbania 17-Seater` (₹0) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

## Honda

Pending models: 1
Pending rows: 12

### Elevate

Cardekho variants: https://www.cardekho.com/honda/elevate/variants.htm
Rows to review: 12
Status mix: CARDEKHO_ONLY_VARIANT=12

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ADV Edition` (₹15,38,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ADV Edition` (₹15,49,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ADV Edition CVT` (₹16,56,790)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ADV Edition CVT Dual Tone` (₹16,66,801)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ADV Edition Dual Tone` (₹15,49,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ADV Edition Dual Tone` (₹16,15,590)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V CVT` (₹13,22,090)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V CVT` (₹13,74,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZX Black Edition` (₹15,07,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZX Black Edition` (₹15,38,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZX Black Edition CVT` (₹16,25,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZX Black Edition CVT` (₹16,56,790)
  Note: Current Cardekho variant not found locally

## Hyundai

Pending models: 12
Pending rows: 407

### Alcazar

Cardekho variants: https://www.cardekho.com/hyundai/alcazar/variants.htm
Rows to review: 27
Status mix: LOCAL_ONLY_VARIANT=11, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Executive Diesel Matte` (₹16,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Executive Matte` (₹15,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Platinum 6Str DCT Matte` (₹21,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Platinum DCT Matte` (₹21,06,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Platinum Diesel MT` (₹19,56,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Platinum Matte` (₹19,71,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Prestige Diesel Matte` (₹18,33,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Prestige Matte` (₹17,33,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Signature 6Str DCT Matte` (₹21,70,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Signature DCT Matte` (₹21,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Signature Diesel AT Matte` (₹21,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum 6Str Diesel AT DT` (₹20,45,634)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum 6Str DT DCT` (₹20,45,634)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum 6Str DT DCT` (₹20,87,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum Diesel` (₹18,92,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum Diesel` (₹19,06,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum Diesel AT DT` (₹20,36,945)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum DT` (₹19,06,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum DT DCT` (₹20,36,945)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum DT Diesel` (₹19,06,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum DT Diesel` (₹20,22,462)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Prestige DCT` (₹17,99,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature 6Str DT DCT` (₹21,20,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature DCT Knight` (₹21,01,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel AT DT` (₹21,01,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel AT Knight` (₹21,01,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature DT DCT` (₹21,01,000)
  Note: Current Cardekho variant not found locally

### Aura

Cardekho variants: https://www.cardekho.com/hyundai/aura/variants.htm
Rows to review: 18
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `S (O) MT` (₹7,20,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S MT` (₹6,75,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX (O) MT` (₹8,45,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX MT` (₹7,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E CNG` (₹6,90,432)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E CNG` (₹7,38,821)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹6,85,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹6,90,432)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S Corporate` (₹6,84,386)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S Corporate` (₹6,85,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S Corporate CNG` (₹7,85,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S Corporate CNG` (₹8,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX` (₹7,64,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX` (₹7,76,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Option` (₹8,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Option` (₹8,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Plus AMT` (₹8,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Plus AMT` (₹8,54,000)
  Note: Current Cardekho variant not found locally

### Creta

Cardekho variants: https://www.cardekho.com/hyundai/creta/variants.htm
Rows to review: 123
Status mix: LOCAL_ONLY_VARIANT=25, CARDEKHO_ONLY_VARIANT=98

- [ ] LOCAL_ONLY_VARIANT: local `E Diesel MT` (₹12,25,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `E MT` (₹10,73,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `EX (O) CVT` (₹13,88,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `EX (O) Diesel MT` (₹14,06,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `EX Diesel MT` (₹13,44,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `EX MT` (₹11,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `King CVT` (₹18,68,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `King Knight CVT` (₹18,82,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `King Limited Edition CVT` (₹18,97,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) CVT` (₹15,44,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) Diesel MT` (₹15,52,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) Knight CVT` (₹15,56,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) Knight Diesel MT` (₹15,64,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) Knight MT` (₹14,11,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) MT` (₹13,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S MT` (₹13,07,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX (O) CVT` (₹18,27,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX (O) Knight CVT` (₹18,41,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX (O) Knight Diesel MT` (₹18,53,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX (O) Knight MT` (₹17,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX (O) MT` (₹16,86,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX MT` (₹14,94,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX Premium CVT` (₹17,23,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX Premium MT` (₹15,78,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX Tech CVT` (₹17,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹10,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹12,05,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E Diesel` (₹12,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E Diesel` (₹13,07,016)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX` (₹12,05,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX` (₹12,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX (O) Diesel` (₹14,69,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX (O) Diesel` (₹15,03,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX (O) Diesel AT Summer Edition` (₹16,04,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX (O) Diesel Summer Edition` (₹14,69,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX (O) iVT Summer Edition` (₹14,48,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX Diesel` (₹13,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX Diesel` (₹14,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX Diesel Summer Edition` (₹13,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX Summer Edition` (₹12,05,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EX(O) iVT` (₹14,48,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King Diesel AT DT` (₹19,86,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King Diesel AT DT` (₹19,90,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King Diesel DT` (₹18,94,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King DT` (₹17,41,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King iVT` (₹18,68,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King iVT` (₹18,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King iVT DT` (₹18,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King iVT DT` (₹18,94,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King Knight Diesel AT DT` (₹20,20,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King Knight iVT` (₹18,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King Knight iVT DT` (₹18,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King Knight iVT DT` (₹19,30,931)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King Limited Edition iVT` (₹18,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `King Turbo DCT DT` (₹20,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹13,07,016)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹13,13,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O)` (₹14,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O)` (₹14,25,871)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Diesel` (₹15,80,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Diesel` (₹15,84,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Diesel AT Summer Edition` (₹17,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Diesel Summer Edition` (₹15,80,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) iVT` (₹15,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) iVT` (₹15,69,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) iVT Summer Editon` (₹15,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight` (₹14,38,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight` (₹14,48,261)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight Diesel` (₹15,99,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight Diesel` (₹16,04,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight Diesel AT DT` (₹17,23,539)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight Diesel DT` (₹15,78,712)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight Diesel Summer Edition` (₹15,99,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight DT` (₹14,25,871)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight iVT` (₹15,56,215)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Knight iVT DT` (₹15,70,698)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S (O) Summer Edition` (₹14,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S(O) Knight Summer Edition` (₹14,38,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX` (₹15,03,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX` (₹15,18,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O)` (₹16,86,077)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O)` (₹17,00,463)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Diesel AT DT` (₹19,45,414)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Diesel AT DT` (₹19,49,276)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Diesel DT` (₹18,53,497)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) DT` (₹17,00,560)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) iVT` (₹18,27,042)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) iVT` (₹18,39,014)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) iVT DT` (₹18,41,525)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight` (₹17,00,463)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight` (₹17,00,560)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight Diesel` (₹18,53,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight Diesel` (₹18,53,497)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight Diesel AT DT` (₹19,79,110)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight Diesel DT` (₹18,67,883)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight Diesel DT` (₹18,68,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight DT` (₹17,14,946)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight DT` (₹17,22,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight iVT` (₹18,41,428)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight iVT` (₹18,41,525)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Knight iVT DT` (₹18,55,911)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX (O) Turbo DCT DT` (₹19,63,759)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX DT` (₹15,18,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX DT` (₹15,56,215)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium` (₹16,33,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium` (₹16,48,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium Diesel Summer Edition` (₹17,88,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium DT` (₹16,48,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium DT` (₹16,86,077)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium DT Diesel` (₹18,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium DT Diesel` (₹18,27,042)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium iVT` (₹17,77,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium iVT DT` (₹17,92,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium iVT Summer Edition` (₹17,77,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Premium Summer Edition` (₹16,33,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Summer Edition` (₹15,03,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Tech Diesel DT` (₹17,37,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Tech Diesel DT` (₹17,41,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Tech DT` (₹15,84,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Tech iVT` (₹17,14,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Tech iVT` (₹17,14,946)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Tech iVT DT` (₹17,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SX Tech iVT DT` (₹17,37,000)
  Note: Current Cardekho variant not found locally

### Creta EV

Cardekho variants: https://www.cardekho.com/hyundai/creta-electric/variants.htm
Rows to review: 3
Status mix: NO_PRICE_PARSED=3

- [ ] NO_PRICE_PARSED: local `Excellence LR` (₹24,69,500) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Executive` (₹18,02,200) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Smart` (₹19,99,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Creta N Line

Cardekho variants: https://www.cardekho.com/hyundai/creta-n-line/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=5

- [ ] LOCAL_ONLY_VARIANT: local `N6 DCT` (₹18,73,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `N6 MT` (₹17,83,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `N8 MT` (₹18,89,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N10` (₹19,02,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N10 DCT Dual Tone` (₹20,09,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N10 Dual Tone` (₹19,17,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N8 DCT Dual Tone` (₹17,97,110)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N8 DCT Dual Tone` (₹19,02,500)
  Note: Current Cardekho variant not found locally

### Exter

Cardekho variants: https://www.cardekho.com/hyundai/exter/variants.htm
Rows to review: 47
Status mix: LOCAL_ONLY_VARIANT=14, CARDEKHO_ONLY_VARIANT=33

- [ ] LOCAL_ONLY_VARIANT: local `EX` (₹5,73,500) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `EX (O) MT` (₹6,65,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) AMT` (₹8,33,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) CNG` (₹8,68,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) Knight MT` (₹7,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S (O) MT` (₹7,83,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S CNG` (₹8,28,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S MT` (₹7,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX (O) AMT` (₹9,45,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX (O) Knight MT` (₹9,07,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX (O) MT` (₹8,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX AMT` (₹8,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX CNG` (₹9,38,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `SX MT` (₹8,45,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX10 AMT` (₹9,41,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX10 AMT` (₹9,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX10 AMT DT` (₹9,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX2` (₹5,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX2` (₹6,90,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX2 CNG` (₹6,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX2 CNG` (₹7,43,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX3` (₹7,43,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX3 AMT` (₹6,90,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX3 AMT` (₹6,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX3 CNG` (₹7,43,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX3 CNG` (₹8,05,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX4` (₹8,26,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX4 CNG` (₹8,26,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX4 CNG` (₹8,54,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX4 Plus AMT` (₹8,05,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX4 Plus AMT` (₹8,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6` (₹8,93,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 AMT` (₹8,54,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 AMT` (₹8,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 AMT DT` (₹8,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 AMT DT` (₹8,93,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 CNG` (₹8,93,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 CNG` (₹9,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 CNG DT` (₹9,08,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 CNG DT` (₹9,40,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 DT` (₹8,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 DT` (₹8,26,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8` (₹9,40,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 AMT` (₹9,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 AMT` (₹9,08,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 CNG` (₹9,40,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 CNG` (₹9,41,900)
  Note: Current Cardekho variant not found locally

### Grand i10 Nios

Cardekho variants: https://www.cardekho.com/hyundai/grand-i10-nios/variants.htm
Rows to review: 20
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Asta MT` (₹7,79,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Era AMT` (₹5,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Magna MT` (₹6,32,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sportz (O) MT` (₹7,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta` (₹7,50,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta` (₹7,58,945)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta VIBE Edition` (₹7,50,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta VIBE Edition AMT` (₹8,02,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Corporate` (₹6,51,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Corporate` (₹6,83,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Corporate AMT` (₹7,12,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Corporate AMT` (₹7,22,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Magna` (₹6,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Magna` (₹6,51,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Duo CNG` (₹7,72,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Opt` (₹7,08,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Opt AMT` (₹7,62,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Opt VIBE Edition AMT` (₹7,73,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz VIBE Edition` (₹7,09,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz VIBE Edition AMT` (₹7,61,400)
  Note: Current Cardekho variant not found locally

### i20

Cardekho variants: https://www.cardekho.com/hyundai/i20/variants.htm
Rows to review: 38
Status mix: LOCAL_ONLY_VARIANT=13, CARDEKHO_ONLY_VARIANT=25

- [ ] LOCAL_ONLY_VARIANT: local `Asta (O) CVT` (₹10,34,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Asta (O) CVT DT` (₹10,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Asta (O) CVT Knight` (₹10,44,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Asta (O) DT MT` (₹9,30,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Asta (O) MT` (₹9,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Magna CVT` (₹8,89,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Magna Executive MT` (₹6,74,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Magna MT` (₹7,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sportz (O) CVT` (₹10,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sportz (O) DT MT` (₹9,20,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sportz (O) MT` (₹9,05,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sportz CVT` (₹9,25,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sportz MT` (₹8,30,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta Opt` (₹9,15,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta Opt` (₹9,20,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta Opt DT` (₹9,31,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta Opt DT` (₹10,34,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta Opt IVT` (₹10,34,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta Opt IVT` (₹10,42,691)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta Opt IVT DT` (₹10,42,691)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta Opt IVT DT` (₹10,43,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Asta Opt iVT Knight` (₹10,43,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Magna` (₹6,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Magna` (₹7,74,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Magna Executive` (₹6,73,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Magna Executive` (₹6,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Magna IVT` (₹8,13,005)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Magna IVT` (₹8,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz` (₹7,74,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz` (₹7,83,734)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz IVT` (₹8,75,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz IVT` (₹9,15,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Opt` (₹8,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Opt` (₹8,37,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Opt IVT` (₹9,20,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Opt IVT` (₹9,31,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Opt Knight` (₹8,37,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportz Opt Knight` (₹8,61,500)
  Note: Current Cardekho variant not found locally

### i20 N Line

Cardekho variants: https://www.cardekho.com/hyundai/i20-n-line/variants.htm
Rows to review: 12
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=11

- [ ] LOCAL_ONLY_VARIANT: local `i20 N Line 1.0 Turbo GDi DCT` (₹12,47,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N6 DCT` (₹10,23,391)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N6 DCT Dual Tone` (₹10,37,111)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N6 DCT Dual Tone` (₹10,52,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N6 Dual Tone` (₹9,32,468)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N6 Dual Tone` (₹10,23,391)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N8` (₹10,52,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N8` (₹10,66,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N8 DCT` (₹11,53,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N8 DCT Dual Tone` (₹11,67,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N8 Dual Tone` (₹10,66,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N8 Dual Tone` (₹11,53,000)
  Note: Current Cardekho variant not found locally

### Tucson

Cardekho variants: https://www.cardekho.com/hyundai/tucson/variants.htm
Rows to review: 21
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=18

- [ ] LOCAL_ONLY_VARIANT: local `Executive Diesel MT` (₹28,55,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Executive MT` (₹27,55,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Signature Diesel AT` (₹35,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum AT BSVI` (₹29,79,273)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum AT BSVI` (₹31,10,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum Diesel AT BSVI` (₹32,06,258)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Platinum Diesel AT BSVI` (₹32,20,258)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature AT BSVI` (₹31,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature AT BSVI` (₹32,06,258)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature AT DT` (₹31,12,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature AT DT` (₹31,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature AT DT BSVI` (₹32,06,258)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature AT DT BSVI` (₹29,53,793)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel 4WD AT` (₹33,63,897)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel 4WD AT BSVI` (₹35,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel 4WD AT DT` (₹33,79,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel 4WD AT DT BSVI` (₹27,31,661)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel 4WD AT DT BSVI` (₹28,63,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel AT BSVI` (₹33,94,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel AT DT` (₹33,49,897)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Diesel AT DT BSVI` (₹35,31,400)
  Note: Current Cardekho variant not found locally

### Venue

Cardekho variants: https://www.cardekho.com/hyundai/venue/variants.htm
Rows to review: 57
Status mix: LOCAL_ONLY_VARIANT=9, CARDEKHO_ONLY_VARIANT=48

- [ ] LOCAL_ONLY_VARIANT: local `HX 2 Diesel MT` (₹9,70,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX 2 Turbo MT` (₹8,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX 4 MT` (₹8,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX 5 Diesel MT` (₹10,64,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX 5 MT` (₹9,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX 5 Turbo MT` (₹9,74,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX 6 MT` (₹10,43,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX 7 Diesel MT` (₹12,51,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX 8 Turbo MT` (₹11,81,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 10 Diesel AT Dual Tone` (₹15,82,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 10 Knight Turbo DCT` (₹14,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 10 Turbo DCT Dual Tone` (₹14,82,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 10 Turbo DCT Dual Tone` (₹15,64,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 2 Diesel` (₹9,87,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 2 Diesel` (₹9,89,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 2 Turbo` (₹8,89,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 2 Turbo` (₹8,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 4` (₹8,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 4` (₹9,54,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5` (₹9,54,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5` (₹9,69,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Diesel` (₹10,86,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Diesel` (₹10,88,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Knight` (₹9,69,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Knight` (₹9,87,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Knight Diesel` (₹11,11,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Knight Diesel` (₹11,81,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Plus` (₹9,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Plus` (₹10,17,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Plus Dual Tone` (₹10,17,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Plus Dual Tone` (₹10,42,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Turbo` (₹9,89,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 5 Turbo` (₹9,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6` (₹10,42,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6` (₹10,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6 Dual Tone` (₹10,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6 Dual Tone` (₹10,86,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6 Turbo DCT DT` (₹12,34,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6 Turbo DCT DT` (₹12,69,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6T Dual Tone` (₹11,06,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6T Dual Tone` (₹11,11,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6T Knight` (₹11,03,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 6T Knight` (₹11,06,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 7 Diesel` (₹12,69,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 7 Diesel` (₹12,87,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 7 Diesel Dual Tone` (₹12,87,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 7 Diesel Dual Tone` (₹12,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Diesel AT` (₹13,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Diesel AT Dual Tone` (₹13,87,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Diesel AT Dual Tone` (₹14,64,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Knight Diesel AT` (₹13,84,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Turbo` (₹11,90,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Turbo` (₹12,08,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Turbo DCT Dual Tone` (₹13,17,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Turbo DCT Dual Tone` (₹13,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Turbo Dual Tone` (₹12,08,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX 8 Turbo Dual Tone` (₹12,16,799)
  Note: Current Cardekho variant not found locally

### Verna

Cardekho variants: https://www.cardekho.com/hyundai/verna/variants.htm
Rows to review: 33
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=29

- [ ] LOCAL_ONLY_VARIANT: local `EX` (₹10,79,500) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX6 Plus CVT` (₹15,02,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX6 Plus MT` (₹13,81,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HX8 Turbo MT` (₹16,28,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX10 iVT DT` (₹17,30,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX10 iVT DT` (₹17,62,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX10 Turbo DCT DT` (₹18,40,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 DT` (₹13,34,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 DT` (₹13,81,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 iVT DT` (₹14,55,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 iVT DT` (₹14,88,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 Plus` (₹13,81,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 Plus` (₹13,96,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 Plus DT` (₹13,96,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 Plus DT` (₹14,40,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 Plus iVT` (₹15,02,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 Plus iVT` (₹15,03,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 Plus iVT DT` (₹15,17,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX6 Plus iVT DT` (₹16,09,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8` (₹14,88,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8` (₹15,02,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 DT` (₹15,03,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 DT` (₹15,17,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 iVT` (₹16,09,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 iVT` (₹16,24,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 iVT DT` (₹16,24,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 iVT DT` (₹16,28,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 Turbo` (₹16,28,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 Turbo` (₹16,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 Turbo DCT DT` (₹17,77,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 Turbo DCT DT` (₹18,25,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 Turbo DT` (₹16,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HX8 Turbo DT` (₹17,15,400)
  Note: Current Cardekho variant not found locally

## Isuzu

Pending models: 14
Pending rows: 14

### D-Max CBC HR 2.0

Cardekho variants: https://www.cardekho.com/isuzu/d-max-cbc-hr-20/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `D-Max CBC HR 2.0` (₹10,50,060) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### D-Max Flat Deck HR

Cardekho variants: https://www.cardekho.com/isuzu/d-max-flat-deck-hr/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `D-Max Flat Deck HR` (₹11,90,270) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### D-Max Flat Deck HR 2.0

Cardekho variants: https://www.cardekho.com/isuzu/d-max-flat-deck-hr-20/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `D-Max Flat Deck HR 2.0` (₹12,00,010) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### D-Max Flat Deck HR AC 1.2

Cardekho variants: https://www.cardekho.com/isuzu/d-max-flat-deck-hr-ac-12/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `D-Max Flat Deck HR AC 1.2` (₹12,27,150) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### D-Max Flat Deck HR AC 2.0

Cardekho variants: https://www.cardekho.com/isuzu/d-max-flat-deck-hr-ac-20/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `D-Max Flat Deck HR AC 2.0` (₹12,50,390) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Hi-Lander 4x2 MT

Cardekho variants: https://www.cardekho.com/isuzu/hi-lander-4x2-mt/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Hi-Lander 4x2 MT` (₹20,34,580) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### MU-X 4x2 AT

Cardekho variants: https://www.cardekho.com/isuzu/mu-x-4x2-at/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `MU-X 4x2 AT` (₹34,53,240) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### MU-X 4x4 AT

Cardekho variants: https://www.cardekho.com/isuzu/mu-x-4x4-at/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `MU-X 4x4 AT` (₹39,53,240) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### S-CAB Standard

Cardekho variants: https://www.cardekho.com/isuzu/s-cab-standard/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `S-CAB Standard` (₹11,50,240) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### S-CAB Z 4x2 MT

Cardekho variants: https://www.cardekho.com/isuzu/s-cab-z-4x2-mt/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `S-CAB Z 4x2 MT` (₹15,89,500) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### V-Cross 4x2 Z AT

Cardekho variants: https://www.cardekho.com/isuzu/v-cross-4x2-z-at/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `V-Cross 4x2 Z AT` (₹24,26,580) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### V-Cross 4x4 Z

Cardekho variants: https://www.cardekho.com/isuzu/v-cross-4x4-z/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `V-Cross 4x4 Z` (₹24,98,260) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### V-Cross 4x4 Z Prestige

Cardekho variants: https://www.cardekho.com/isuzu/v-cross-4x4-z-prestige/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `V-Cross 4x4 Z Prestige` (₹26,05,590) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### V-Cross 4x4 Z Prestige AT

Cardekho variants: https://www.cardekho.com/isuzu/v-cross-4x4-z-prestige-at/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `V-Cross 4x4 Z Prestige AT` (₹29,36,640) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

## Jaguar

Pending models: 2
Pending rows: 2

### Jaguar F-Pace 2.0 R-Dynamic S (Petrol)

Cardekho variants: https://www.cardekho.com/jaguar/jaguar-f-pace-20-r-dynamic-s-petrol/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Jaguar F-Pace 2.0 R-Dynamic S (Petrol)` (₹72,90,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Jaguar F-Pace 2.0 R-Dynamic S Diesel

Cardekho variants: https://www.cardekho.com/jaguar/jaguar-f-pace-20-r-dynamic-s-diesel/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Jaguar F-Pace 2.0 R-Dynamic S Diesel` (₹72,90,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

## Jeep

Pending models: 1
Pending rows: 25

### Meridian

Cardekho variants: https://www.cardekho.com/jeep/meridian/variants.htm
Rows to review: 25
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=22

- [ ] LOCAL_ONLY_VARIANT: local `Limited` (₹23,33,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Limited (O) 4x4 AT` (₹37,82,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Limited (O) AT` (₹29,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Limited Opt 4x2` (₹30,01,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Limited Opt 4x2` (₹32,86,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Limited Opt 4x2 AT` (₹33,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Limited Opt 4x2 AT` (₹35,61,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Limited Opt 4x4 AT` (₹35,61,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Longitude 4x2` (₹23,33,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Longitude 4x2` (₹25,95,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Longitude 4x2 AT` (₹27,18,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Longitude 4x2 AT` (₹29,04,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Longitude Plus 4x2` (₹25,95,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Longitude Plus 4x2` (₹27,18,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Longitude Plus 4x2 AT` (₹29,04,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Longitude Plus 4x2 AT` (₹29,12,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Overland 4x2 AT` (₹35,61,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Overland 4x2 AT` (₹37,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Overland 4x4 AT` (₹37,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Overland 4x4 AT` (₹37,82,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Track Edition 4x4 AT` (₹37,82,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Trail Edition` (₹29,12,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Trail Edition` (₹30,01,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Trail Edition AT` (₹32,86,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Trail Edition AT` (₹33,75,000)
  Note: Current Cardekho variant not found locally

## Kia

Pending models: 6
Pending rows: 234

### Carens

Cardekho variants: https://www.cardekho.com/kia/carens/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Carens Premium Opt` (₹10,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Carens Premium Opt CNG` (₹11,77,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium Opt` (₹10,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium Opt` (₹11,77,058)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium Opt CNG` (₹11,77,058)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Premium Opt CNG` (₹12,85,900)
  Note: Current Cardekho variant not found locally

### Carens Clavis

Cardekho variants: https://www.cardekho.com/kia/carens-clavis/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=33

- [ ] LOCAL_ONLY_VARIANT: local `HTE (O) Petrol MT` (₹12,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HTE Petrol MT` (₹11,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HTX Plus Diesel AT` (₹21,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `HTX Turbo DCT` (₹18,40,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX Plus Turbo 6Str DCT` (₹21,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX Plus Turbo DCT` (₹21,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX Turbo 6Str DCT` (₹19,80,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE` (₹11,20,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE` (₹12,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE (O)` (₹12,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE (O)` (₹12,67,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Diesel` (₹13,13,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE EX` (₹12,67,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE EX Diesel` (₹14,65,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE EX Turbo` (₹13,54,899)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Diesel` (₹16,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Turbo` (₹16,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Turbo 6Str DCT` (₹17,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Turbo DCT` (₹17,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus 6Str Diesel AT` (₹18,91,448)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Diesel` (₹13,41,103)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Turbo` (₹15,17,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Turbo 6Str DCT` (₹16,62,899)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX (O) A Turbo 6Str DCT` (₹19,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX (O) A Turbo DCT` (₹19,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX (O) Turbo 6Str DCT` (₹19,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX (O) Turbo DCT` (₹19,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel` (₹18,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Plus Turbo` (₹18,68,914)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Plus Turbo 6Str` (₹18,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Plus Turbo DCT 6Str` (₹18,91,448)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Plus Turbo iMT` (₹19,10,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Plus Turbo iMT 6Str` (₹19,10,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Turbo` (₹17,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Turbo iMT` (₹18,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-Line Turbo 6Str DCT` (₹17,28,275)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-Line Turbo DCT` (₹21,56,900)
  Note: Current Cardekho variant not found locally

### Carens Clavis EV

Cardekho variants: https://www.cardekho.com/kia/carens-clavis-ev/variants.htm
Rows to review: 26
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=23

- [ ] LOCAL_ONLY_VARIANT: local `Carens Clavis EV HTX E` (₹17,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Carens Clavis EV HTX E LR` (₹24,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Carens Clavis EV HTX E Plus` (₹20,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX ER` (₹22,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX ER 6Str` (₹22,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX Plus ER` (₹24,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX Plus ER 6Str` (₹24,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus` (₹17,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX` (₹20,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX` (₹21,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX 6Str` (₹20,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX E` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX E` (₹20,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX E 6Str` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX E ER` (₹21,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX E ER` (₹22,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX E ER 6Str` (₹21,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX ER` (₹22,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX ER` (₹22,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX ER 6Str` (₹22,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Plus ER` (₹24,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Plus ER` (₹24,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Plus ER 6Str` (₹24,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-Line ER` (₹24,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-Line ER 6Str` (₹24,99,000)
  Note: Current Cardekho variant not found locally

### Seltos

Cardekho variants: https://www.cardekho.com/kia/seltos/variants.htm
Rows to review: 75
Status mix: LOCAL_ONLY_VARIANT=5, CARDEKHO_ONLY_VARIANT=70

- [ ] LOCAL_ONLY_VARIANT: local `Seltos GTX A iVT` (₹19,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Seltos HTE` (₹10,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Seltos HTE Diesel` (₹12,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Seltos HTK` (₹13,09,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Seltos HTX` (₹15,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX A Diesel AT` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX A iVT` (₹19,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX A iVT` (₹19,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX A TGDi DCT` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX Diesel AT` (₹19,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX Diesel AT` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX iVT` (₹18,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX iVT` (₹18,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX TGDi DCT` (₹19,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX TGDi DCT` (₹19,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE` (₹10,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE` (₹12,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Diesel` (₹12,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Diesel` (₹12,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt` (₹12,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt` (₹12,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt Diesel` (₹13,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt Diesel` (₹13,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt Diesel AT` (₹14,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt Diesel AT` (₹15,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt iVT` (₹13,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt iVT` (₹13,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt TGDi iMT` (₹12,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt TGDi iMT` (₹13,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK` (₹13,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK` (₹13,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Diesel` (₹14,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Diesel` (₹14,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Diesel AT` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Diesel AT` (₹16,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK iVT` (₹14,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK iVT` (₹14,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt` (₹14,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt` (₹14,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt Diesel` (₹15,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt Diesel` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt Diesel AT` (₹17,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt Diesel AT` (₹17,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt iVT` (₹15,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt iVT` (₹15,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt TGDi DCT` (₹16,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt TGDi DCT` (₹16,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Opt TGDi iMT` (₹14,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK TGDi iMT` (₹13,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK TGDi iMT` (₹14,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX` (₹15,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX` (₹15,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A` (₹16,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A` (₹16,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A Diesel` (₹18,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A Diesel` (₹18,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A Diesel AT` (₹19,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A Diesel AT` (₹19,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A iVT` (₹17,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A iVT` (₹18,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A TGDi DCT` (₹18,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX A TGDi DCT` (₹19,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel` (₹17,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel` (₹17,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel AT` (₹18,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel AT` (₹18,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX iVT` (₹16,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX iVT` (₹17,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX TGDi DCT` (₹17,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX TGDi DCT` (₹17,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-Line A Diesel AT` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-Line A iVT` (₹19,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-Line A TGDi DCT` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-Line iVT` (₹18,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-Line TGDi DCT` (₹19,19,000)
  Note: Current Cardekho variant not found locally

### Sonet

Cardekho variants: https://www.cardekho.com/kia/sonet/variants.htm
Rows to review: 55
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=52

- [ ] LOCAL_ONLY_VARIANT: local `Sonet HTE` (₹7,30,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sonet HTK Plus` (₹9,10,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sonet HTX Diesel` (₹11,25,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX Plus Turbo DCT` (₹13,50,652)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTX Plus Turbo DCT` (₹13,65,214)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE` (₹7,30,138)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE` (₹7,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE (O)` (₹7,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE (O)` (₹8,40,951)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE (O) Diesel` (₹8,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE (O) Diesel` (₹9,10,125)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE (O) Diesel AT` (₹9,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE (O) Diesel AT` (₹9,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK` (₹8,40,951)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK` (₹8,75,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O)` (₹8,75,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O)` (₹8,79,179)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O) Diesel` (₹9,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O) Diesel` (₹10,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O) Diesel AT` (₹10,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O) Diesel AT` (₹10,80,328)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O) Turbo DCT` (₹9,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O) Turbo DCT` (₹9,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O) Turbo iMT` (₹9,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK (O) Turbo iMT` (₹9,46,532)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus` (₹9,10,125)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus` (₹9,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O)` (₹9,62,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O)` (₹9,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Diesel` (₹10,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Diesel` (₹10,89,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Diesel AT` (₹11,65,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Diesel AT` (₹12,02,575)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Turbo DCT` (₹10,89,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Turbo DCT` (₹11,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Turbo iMT` (₹10,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus (O) Turbo iMT` (₹10,29,748)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Diesel` (₹10,29,748)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Diesel` (₹10,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Diesel AT` (₹11,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Diesel AT` (₹11,24,669)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Turbo iMT` (₹9,46,532)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Turbo iMT` (₹9,62,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Turbo iMT` (₹8,79,179)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Turbo iMT` (₹8,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel` (₹11,24,669)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel` (₹11,59,514)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel AT` (₹12,02,575)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel AT` (₹13,50,652)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Turbo DCT` (₹11,59,514)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Turbo DCT` (₹11,65,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Turbo iMT` (₹10,80,328)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Turbo iMT` (₹10,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-line Turbo DCT` (₹13,65,214)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `X-line Turbo DCT` (₹14,00,475)
  Note: Current Cardekho variant not found locally

### Syros

Cardekho variants: https://www.cardekho.com/kia/syros/variants.htm
Rows to review: 35
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=32

- [ ] LOCAL_ONLY_VARIANT: local `Syros HTK Plus Diesel` (₹11,46,160) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Syros HTK Turbo` (₹8,67,053) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Syros HTX Plus Opt Diesel AT` (₹15,93,898) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt Diesel` (₹9,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt Diesel` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt Turbo` (₹9,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Opt Turbo` (₹9,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Turbo` (₹8,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTE Turbo` (₹9,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK EX Diesel` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK EX Diesel` (₹10,73,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK EX Turbo` (₹9,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK EX Turbo` (₹9,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Diesel` (₹11,53,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Diesel` (₹11,93,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Diesel AT` (₹12,73,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Diesel AT` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Opt Diesel` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Opt Diesel` (₹13,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Opt Diesel AT` (₹13,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Opt Turbo` (₹11,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Opt Turbo` (₹12,73,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Opt Turbo DCT` (₹13,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Opt Turbo DCT` (₹13,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Turbo` (₹10,73,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Turbo` (₹11,53,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Turbo DCT` (₹11,93,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTK Plus Turbo DCT` (₹11,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel AT` (₹14,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Diesel AT` (₹14,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Opt Diesel AT` (₹15,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Opt Turbo DCT` (₹14,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Opt Turbo DCT` (₹15,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Turbo DCT` (₹13,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `HTX Turbo DCT` (₹14,79,900)
  Note: Current Cardekho variant not found locally

## Lamborghini

Pending models: 1
Pending rows: 9

### Urus

Cardekho variants: https://www.cardekho.com/lamborghini/urus/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Urus Performante` (₹4,57,00,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Urus S` (₹4,18,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Urus SE Plugin Hybrid` (₹4,57,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Performante` (₹4,22,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Performante` (₹4,57,00,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹4,18,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹4,22,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SE Plugin Hybrid` (₹4,57,00,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `SE Plugin Hybrid` (₹4,18,00,000)
  Note: Current Cardekho variant not found locally

## Land Rover

Pending models: 5
Pending rows: 27

### Defender

Cardekho variants: https://www.cardekho.com/land-rover/defender/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `2.0 l Petrol 110 PHEV Sedona Red Edition` (₹1,60,40,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `3.0 l Diesel 110 Sedona Edition` (₹1,32,53,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `3.0 l Diesel 90 X-Dynamic HSE` (₹1,19,46,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `5.0 l V8 Petrol 110 V8` (₹1,67,06,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  5.0 l V8 Petrol 130` (₹1,82,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  5.0 l V8 Petrol 130` (₹1,82,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  5.0 l V8 Petrol 90` (₹1,62,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  5.0 l V8 Petrol 90` (₹1,62,90,000)
  Note: Current Cardekho variant not found locally

### Range Rover

Cardekho variants: https://www.cardekho.com/land-rover/range-rover/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `3.0 l Diesel LWB HSE` (₹2,31,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `3.0 l LWB Autobiography` (₹2,56,66,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `3.0 I Diesel LWB HSE` (₹2,31,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `3.0 I Diesel LWB HSE` (₹2,31,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `3.0 I LWB Autobiography` (₹2,56,66,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `3.0 I LWB Autobiography` (₹2,56,66,000)
  Note: Current Cardekho variant not found locally

### Range Rover Evoque

Cardekho variants: https://www.cardekho.com/land-rover/range-rover-evoque/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Autobiography (Petrol)` (₹64,86,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Autobiography` (₹64,86,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Autobiography` (₹64,86,000)
  Note: Current Cardekho variant not found locally

### Range Rover Sport

Cardekho variants: https://www.cardekho.com/land-rover/range-rover-sport/variants.htm
Rows to review: 4
Status mix: CARDEKHO_ONLY_VARIANT=4

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `3.0l Autobiography Petrol` (₹1,59,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `3.0l Autobiography Petrol` (₹1,59,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  3.0l Autobiography Diesel` (₹1,59,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  3.0l Autobiography Diesel` (₹1,59,90,000)
  Note: Current Cardekho variant not found locally

### Range Rover Velar

Cardekho variants: https://www.cardekho.com/land-rover/range-rover-velar/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `2.0 l Diesel Autobiography` (₹83,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `2.0 l Petrol Autobiography` (₹83,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  2.0 l Diesel Autobiography` (₹85,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  2.0 l Diesel Autobiography` (₹85,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  2.0 l Petrol Autobiography` (₹85,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Land Rover  2.0 l Petrol Autobiography` (₹85,90,000)
  Note: Current Cardekho variant not found locally

## Lexus

Pending models: 3
Pending rows: 18

### ES

Cardekho variants: https://www.cardekho.com/lexus/es/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `300h Exquisite` (₹62,65,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `300h Luxury` (₹68,23,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `350h` (₹70,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `500e` (₹89,99,000)
  Note: Current Cardekho variant not found locally

### LX

Cardekho variants: https://www.cardekho.com/lexus/lx/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `LX 500d` (₹2,80,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `LX 500d Overtrail` (₹2,91,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `LX 500d Ultra Luxury` (₹2,91,20,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `500d` (₹2,80,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `500d` (₹2,91,20,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `500d Overtrail` (₹2,91,20,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `500d Overtrail` (₹2,80,00,000)
  Note: Current Cardekho variant not found locally

### RX

Cardekho variants: https://www.cardekho.com/lexus/rx/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `350h Exquisite` (₹89,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `350h Luxury Premium System` (₹96,13,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `500h F-SPORT Premium System` (₹1,18,46,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `350h Luxury Lexus Premium System` (₹89,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `350h Luxury Lexus Premium System` (₹1,09,46,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `500h F SPORT Lexus Premium System` (₹1,09,46,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `500h F SPORT Lexus Premium System` (₹89,99,000)
  Note: Current Cardekho variant not found locally

## Mahindra

Pending models: 13
Pending rows: 186

### BE 6

Cardekho variants: https://www.cardekho.com/mahindra/be-6/variants.htm
Rows to review: 48
Status mix: LOCAL_ONLY_VARIANT=16, CARDEKHO_ONLY_VARIANT=32

- [ ] LOCAL_ONLY_VARIANT: local `Pack One (Base)` (₹18,90,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack One 11.2 kW Charger` (₹19,65,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack One 7.2 kW Charger` (₹19,40,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack One Above 11.2 kW Charger` (₹21,25,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack One Above 7.2 kW Charger` (₹21,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Three (Base)` (₹26,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Three 79 kWh 11.2 kW Charger` (₹27,65,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Three 79 kWh 7.2 kW Charger` (₹27,40,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Three Select 11.2 kW Charger` (₹25,25,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Three Select 7.2 kW Charger` (₹25,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two (Base)` (₹21,90,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 11.2 kW Charger` (₹22,65,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 7.2 kW Charger` (₹22,40,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 79 kWh` (₹23,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 79 kWh 11.2 kW Charger` (₹24,25,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 79 kWh 7.2 kW Charger` (₹24,00,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Batman Edition` (₹28,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Batman Edition` (₹18,90,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One` (₹18,90,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One` (₹19,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One 11.2kw Charger` (₹19,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One 11.2kw Charger` (₹20,50,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One 7.2kw Charger` (₹19,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One 7.2kw Charger` (₹19,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One Above 11.2kw Charger` (₹21,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One Above 11.2kw Charger` (₹21,90,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One Above 7.2kw Charger` (₹21,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One Above 7.2kw Charger` (₹21,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three` (₹26,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three` (₹27,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three 79kwh 11.2kw Charger` (₹27,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three 79kwh 11.2kw Charger` (₹28,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three 79kwh 7.2kw Charger` (₹27,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three Select 11.2kw Charger` (₹25,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three Select 11.2kw Charger` (₹26,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three Select 7.2kw Charger` (₹25,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two` (₹21,90,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two` (₹22,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 11.2kw Charger` (₹22,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 11.2kw Charger` (₹23,50,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 7.2kw Charger` (₹22,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 7.2kw Charger` (₹22,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kwh` (₹23,50,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kwh` (₹23,68,998)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kwh 11.2kw Charger` (₹24,25,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kwh 11.2kw Charger` (₹24,48,998)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kwh 7.2kw Charger` (₹24,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kwh 7.2kw Charger` (₹24,25,001)
  Note: Current Cardekho variant not found locally

### Bolero Neo Plus

Cardekho variants: https://www.cardekho.com/mahindra/bolero-neo-plus/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `P10 2.2 Diesel MT` (₹11,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `P4 2.2 Diesel MT` (₹10,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `P10` (₹11,99,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `P4` (₹10,99,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `P4` (₹11,99,500)
  Note: Current Cardekho variant not found locally

### Bolero Pik-Up

Cardekho variants: https://www.cardekho.com/mahindra/bolero-pik-up/variants.htm
Rows to review: 14
Status mix: LOCAL_ONLY_VARIANT=6, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `4WD 1.3T` (₹9,58,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `FB 1.3T` (₹9,63,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `FB AC 1.3T` (₹9,86,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `MS CBC 1.3T` (₹9,05,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `MS CBC 4WD 1.3T` (₹9,35,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `MS FB 1.3T` (₹9,56,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.3 T` (₹9,62,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.3 T` (₹9,85,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.3 T AC` (₹9,85,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.3 T CBC MS` (₹9,04,599)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.3 T MS` (₹9,56,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.3 T MS` (₹9,58,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4WD` (₹9,58,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4WD` (₹9,62,800)
  Note: Current Cardekho variant not found locally

### Scorpio Classic

Cardekho variants: https://www.cardekho.com/mahindra/scorpio/price-in-hyderabad/variants.htm
Rows to review: 4
Status mix: NO_PRICE_PARSED=4

- [ ] NO_PRICE_PARSED: local `S` (₹12,97,701) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `S 11` (₹16,70,498) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `S 11 7CC` (₹16,70,498) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `S 9 Seater` (₹13,19,398) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Scorpio N

Cardekho variants: https://www.cardekho.com/mahindra/scorpio-n/variants.htm
Rows to review: 47
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=43

- [ ] LOCAL_ONLY_VARIANT: local `Z2 Diesel MT` (₹13,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Z2 E Diesel MT` (₹13,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Z4 Diesel MT` (₹15,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Z4 Petrol AT` (₹17,39,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z2 Diesel E` (₹13,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z2 Diesel E` (₹15,43,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z2 E` (₹13,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z4 AT` (₹17,02,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z4 AT` (₹17,24,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z4 Diesel E` (₹15,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z4 Diesel E 4x4` (₹18,02,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z4 E` (₹15,43,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z6 Diesel AT` (₹18,51,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Carbon Edition` (₹19,33,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Carbon Edition AT` (₹20,67,299)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Carbon Edition Diesel` (₹19,71,099)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Carbon Edition Diesel` (₹19,86,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Carbon Edition Diesel 4x4` (₹21,70,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Carbon Edition Diesel AT` (₹21,11,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Carbon Edition Diesel AT 4x4` (₹23,17,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Diesel AT` (₹20,80,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Select` (₹17,24,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Select AT` (₹18,68,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8 Select Diesel AT` (₹19,17,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L` (₹20,75,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L 6 Str` (₹21,13,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L 6 Str` (₹21,23,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L 6 Str AT` (₹22,45,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L 6 Str Diesel` (₹21,67,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L 6 Str Diesel AT` (₹22,98,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L AT` (₹22,27,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L Carbon Edition` (₹20,33,399)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L Carbon Edition AT` (₹21,67,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L Carbon Edition Diesel` (₹20,71,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L Carbon Edition Diesel` (₹20,75,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L Carbon Edition Diesel 4x4` (₹22,70,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L Carbon Edition Diesel AT` (₹22,11,701)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L Carbon Edition Diesel AT 4x4` (₹24,17,399)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L Diesel 4x4` (₹23,41,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8L Diesel AT` (₹22,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8T` (₹19,86,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8T` (₹19,99,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8T AT` (₹21,23,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8T Diesel` (₹19,99,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8T Diesel 4x4` (₹22,37,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8T Diesel 4x4 AT` (₹23,87,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Z8T Diesel AT` (₹21,76,500)
  Note: Current Cardekho variant not found locally

### Thar

Cardekho variants: https://www.cardekho.com/mahindra/thar/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `LXT RWD AT (Petrol)` (₹13,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXT RWD AT` (₹14,49,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXT RWD AT` (₹15,26,500)
  Note: Current Cardekho variant not found locally

### Thar Roxx

Cardekho variants: https://www.cardekho.com/mahindra/thar-roxx/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Star Edition Diesel (RWD)` (₹16,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `AX3L RWD Diesel` (₹16,79,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Star Edition Diesel` (₹17,19,500)
  Note: Current Cardekho variant not found locally

### XEV 9e

Cardekho variants: https://www.cardekho.com/mahindra/xev-9e/variants.htm
Rows to review: 33
Status mix: LOCAL_ONLY_VARIANT=11, CARDEKHO_ONLY_VARIANT=22

- [ ] LOCAL_ONLY_VARIANT: local `Pack One 11.2 kW Charger` (₹22,65,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack One 7.2 kW Charger` (₹22,40,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Three 11.2 kW Charger` (₹31,25,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Three 7.2 kW Charger` (₹31,00,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Three Select 11.2 kW Charger` (₹28,65,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Three Select 7.2 kW Charger` (₹28,40,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 11.2 kW Charger` (₹25,65,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 7.2 kW Charger` (₹25,40,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 79 kWh` (₹26,50,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 79 kWh 11.2 kW Charger` (₹27,25,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Pack Two 79 kWh 7.2 kW Charger` (₹27,00,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Cineluxe Edition` (₹29,35,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Cineluxe Edition` (₹30,50,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One 11.2kw Charger` (₹22,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One 11.2kw Charger` (₹24,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One 7.2kw Charger` (₹22,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack One 7.2kw Charger` (₹22,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three 11.2kw Charger` (₹31,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three 11.2kw Charger` (₹21,90,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three 7.2kw Charger` (₹31,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three 7.2kw Charger` (₹31,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three Select 11.2kw Charger` (₹28,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three Select 11.2kw Charger` (₹29,35,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three Select 7.2kw Charger` (₹28,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 11.2kw Charger` (₹25,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 11.2kw Charger` (₹26,50,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 7.2kw Charger` (₹25,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 7.2kw Charger` (₹25,65,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kWh` (₹26,50,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kWh` (₹27,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kwh 11.2kw Charger` (₹27,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kwh 11.2kw Charger` (₹27,90,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two 79kwh 7.2kw Charger` (₹27,00,000)
  Note: Current Cardekho variant not found locally

### XEV 9S

Cardekho variants: https://www.cardekho.com/mahindra/xev-9s/variants.htm
Rows to review: 4
Status mix: CARDEKHO_ONLY_VARIANT=4

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three 79kWh` (₹27,34,999)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Three 79kWh` (₹29,44,998)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two Above 70kWh` (₹24,44,998)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pack Two Above 70kWh` (₹25,44,999)
  Note: Current Cardekho variant not found locally

### XUV 3XO EV

Cardekho variants: https://www.cardekho.com/mahindra/xuv-3xo-ev/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `AX7 L` (₹14,96,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `AX7L` (₹14,96,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `AX7L` (₹13,89,000)
  Note: Current Cardekho variant not found locally

### XUV 7XO

Cardekho variants: https://www.cardekho.com/mahindra/xuv-7xo/variants.htm
Rows to review: 1
Status mix: CARDEKHO_ONLY_VARIANT=1

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `AX7L Diesel AT` (₹23,92,000)
  Note: Current Cardekho variant not found locally

### XUV400 EV

Cardekho variants: https://www.cardekho.com/mahindra/xuv400-ev/variants.htm
Rows to review: 2
Status mix: CARDEKHO_ONLY_VARIANT=2

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EL Pro DT 34.5 kWh` (₹16,94,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `EL Pro DT 34.5 kWh` (₹17,49,000)
  Note: Current Cardekho variant not found locally

### XUV700

Cardekho variants: https://www.cardekho.com/mahindra/xuv700/price-in-hyderabad/variants.htm
Rows to review: 19
Status mix: NO_PRICE_PARSED=19

- [ ] NO_PRICE_PARSED: local `AX5 7Str` (₹17,28,800) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX5 7Str Diesel` (₹17,94,799) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX5 E 7Str` (₹17,76,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX5 S 7Str` (₹15,92,100) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX5 S 7Str AT` (₹17,57,100) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX5 S 7Str Diesel` (₹16,72,300) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX5 S 7Str Diesel AT` (₹18,13,701) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX5 S E 7Str` (₹16,39,200) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX7 7Str` (₹18,37,299) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX7 7Str Diesel` (₹18,84,400) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX7 7Str Diesel AT` (₹20,44,700) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX7 7Str Diesel AT AWD` (₹21,57,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX7 Ebony Edition 7Str` (₹18,51,401) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX7 Ebony Edition 7Str Diesel` (₹18,98,600) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `AX7L 7Str Diesel AT AWD` (₹23,71,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `MX 7Str` (₹13,65,800) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `MX 7Str Diesel` (₹14,13,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `MX E 7Str` (₹14,12,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `MX E 7Str Diesel` (₹14,60,100) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

## Maruti Suzuki

Pending models: 187
Pending rows: 2976

### Maruti Alto K10 LXI

Cardekho variants: https://www.cardekho.com/maruti/alto-k10/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto K10 LXI` (₹3,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹3,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI S-CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹4,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus AT` (₹5,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI S-CNG` (₹5,31,900)
  Note: Current Cardekho variant not found locally

### Maruti Alto K10 LXI S-CNG

Cardekho variants: https://www.cardekho.com/maruti/alto-k10/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto K10 LXI S-CNG` (₹4,81,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹3,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI S-CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹4,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus AT` (₹5,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI S-CNG` (₹5,31,900)
  Note: Current Cardekho variant not found locally

### Maruti Alto K10 STD

Cardekho variants: https://www.cardekho.com/maruti/alto-k10/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto K10 STD` (₹3,69,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹3,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI S-CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹4,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus AT` (₹5,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI S-CNG` (₹5,31,900)
  Note: Current Cardekho variant not found locally

### Maruti Alto K10 VXI

Cardekho variants: https://www.cardekho.com/maruti/alto-k10/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto K10 VXI` (₹4,49,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹3,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI S-CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹4,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus AT` (₹5,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI S-CNG` (₹5,31,900)
  Note: Current Cardekho variant not found locally

### Maruti Alto K10 VXI AT

Cardekho variants: https://www.cardekho.com/maruti/alto-k10/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto K10 VXI AT` (₹4,81,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹3,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI S-CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹4,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus AT` (₹5,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI S-CNG` (₹5,31,900)
  Note: Current Cardekho variant not found locally

### Maruti Alto K10 VXI Plus

Cardekho variants: https://www.cardekho.com/maruti/alto-k10/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto K10 VXI Plus` (₹4,99,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹3,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI S-CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹4,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus AT` (₹5,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI S-CNG` (₹5,31,900)
  Note: Current Cardekho variant not found locally

### Maruti Alto K10 VXI Plus AT

Cardekho variants: https://www.cardekho.com/maruti/alto-k10/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto K10 VXI Plus AT` (₹5,44,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹3,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI S-CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹4,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus AT` (₹5,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI S-CNG` (₹5,31,900)
  Note: Current Cardekho variant not found locally

### Maruti Alto K10 VXI S-CNG

Cardekho variants: https://www.cardekho.com/maruti/alto-k10/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto K10 VXI S-CNG` (₹5,31,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹3,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI S-CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹4,94,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Plus AT` (₹5,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI S-CNG` (₹5,31,900)
  Note: Current Cardekho variant not found locally

### Maruti Alto Tour H1 CNG

Cardekho variants: https://www.cardekho.com/maruti/alto-tour-h1/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto Tour H1 CNG` (₹4,81,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol` (₹3,99,900)
  Note: Current Cardekho variant not found locally

### Maruti Alto Tour H1 Petrol

Cardekho variants: https://www.cardekho.com/maruti/alto-tour-h1/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Alto Tour H1 Petrol` (₹3,99,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `CNG` (₹4,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol` (₹3,99,900)
  Note: Current Cardekho variant not found locally

### Maruti Baleno Alpha

Cardekho variants: https://www.cardekho.com/maruti/baleno/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Baleno Alpha` (₹8,59,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹8,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹9,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹6,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹8,59,900)
  Note: Current Cardekho variant not found locally

### Maruti Baleno Alpha AMT

Cardekho variants: https://www.cardekho.com/maruti/baleno/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Baleno Alpha AMT` (₹9,09,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹8,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹9,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹6,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹8,59,900)
  Note: Current Cardekho variant not found locally

### Maruti Baleno Delta

Cardekho variants: https://www.cardekho.com/maruti/baleno/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Baleno Delta` (₹6,89,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹8,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹9,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹6,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹8,59,900)
  Note: Current Cardekho variant not found locally

### Maruti Baleno Delta AMT

Cardekho variants: https://www.cardekho.com/maruti/baleno/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Baleno Delta AMT` (₹7,39,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹8,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹9,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹6,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹8,59,900)
  Note: Current Cardekho variant not found locally

### Maruti Baleno Delta CNG

Cardekho variants: https://www.cardekho.com/maruti/baleno/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Baleno Delta CNG` (₹7,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹8,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹9,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹6,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹8,59,900)
  Note: Current Cardekho variant not found locally

### Maruti Baleno Sigma

Cardekho variants: https://www.cardekho.com/maruti/baleno/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Baleno Sigma` (₹5,98,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹8,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹9,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹6,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹8,59,900)
  Note: Current Cardekho variant not found locally

### Maruti Baleno Zeta

Cardekho variants: https://www.cardekho.com/maruti/baleno/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Baleno Zeta` (₹7,89,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹8,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹9,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹6,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹8,59,900)
  Note: Current Cardekho variant not found locally

### Maruti Baleno Zeta AMT

Cardekho variants: https://www.cardekho.com/maruti/baleno/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Baleno Zeta AMT` (₹8,39,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹8,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹9,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹6,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹8,59,900)
  Note: Current Cardekho variant not found locally

### Maruti Baleno Zeta CNG

Cardekho variants: https://www.cardekho.com/maruti/baleno/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Baleno Zeta CNG` (₹8,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹8,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹9,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹6,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹7,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹8,59,900)
  Note: Current Cardekho variant not found locally

### Maruti Brezza LXI

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza LXI` (₹8,26,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Brezza LXI CNG

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza LXI CNG` (₹9,26,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Brezza VXI

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza VXI` (₹9,26,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Brezza VXI AT

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza VXI AT` (₹10,26,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Brezza VXI CNG

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza VXI CNG` (₹10,26,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Brezza ZXI

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza ZXI` (₹10,76,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Brezza ZXI AT

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza ZXI AT` (₹11,76,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Brezza ZXI CNG

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza ZXI CNG` (₹11,76,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Brezza ZXI Plus

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza ZXI Plus` (₹12,01,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Brezza ZXI Plus AT

Cardekho variants: https://www.cardekho.com/maruti/brezza/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Brezza ZXI Plus AT` (₹13,01,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi CNG` (₹9,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi` (₹9,25,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi AT` (₹10,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Vxi CNG` (₹10,16,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,39,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT` (₹11,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi AT DT` (₹11,90,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG` (₹11,30,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi CNG DT` (₹11,46,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi DT` (₹10,55,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus` (₹11,50,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT` (₹12,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus AT DT` (₹13,01,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi Plus DT` (₹11,66,300)
  Note: Current Cardekho variant not found locally

### Maruti Celerio LXI

Cardekho variants: https://www.cardekho.com/maruti/celerio/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Celerio LXI` (₹4,69,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹4,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹5,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹5,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹5,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹6,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹6,27,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹6,72,900)
  Note: Current Cardekho variant not found locally

### Maruti Celerio VXI

Cardekho variants: https://www.cardekho.com/maruti/celerio/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Celerio VXI` (₹5,29,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹4,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹5,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹5,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹5,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹6,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹6,27,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹6,72,900)
  Note: Current Cardekho variant not found locally

### Maruti Celerio VXI AMT

Cardekho variants: https://www.cardekho.com/maruti/celerio/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Celerio VXI AMT` (₹5,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹4,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹5,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹5,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹5,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹6,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹6,27,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹6,72,900)
  Note: Current Cardekho variant not found locally

### Maruti Celerio VXI CNG

Cardekho variants: https://www.cardekho.com/maruti/celerio/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Celerio VXI CNG` (₹5,89,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹4,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹5,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹5,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹5,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹6,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹6,27,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹6,72,900)
  Note: Current Cardekho variant not found locally

### Maruti Celerio ZXI

Cardekho variants: https://www.cardekho.com/maruti/celerio/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Celerio ZXI` (₹5,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹4,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹5,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹5,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹5,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹6,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹6,27,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹6,72,900)
  Note: Current Cardekho variant not found locally

### Maruti Celerio ZXI AMT

Cardekho variants: https://www.cardekho.com/maruti/celerio/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Celerio ZXI AMT` (₹6,29,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹4,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹5,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹5,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹5,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹6,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹6,27,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹6,72,900)
  Note: Current Cardekho variant not found locally

### Maruti Celerio ZXI Plus

Cardekho variants: https://www.cardekho.com/maruti/celerio/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Celerio ZXI Plus` (₹6,29,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹4,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹5,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹5,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹5,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹6,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹6,27,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹6,72,900)
  Note: Current Cardekho variant not found locally

### Maruti Celerio ZXI Plus AMT

Cardekho variants: https://www.cardekho.com/maruti/celerio/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Celerio ZXI Plus AMT` (₹6,72,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹4,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹5,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹5,60,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹5,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹6,15,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹6,27,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹6,72,900)
  Note: Current Cardekho variant not found locally

### Maruti Ciaz Alpha

Cardekho variants: https://www.cardekho.com/maruti/ciaz/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=7

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ciaz Alpha` (₹11,39,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹10,82,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹11,88,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹9,65,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹10,72,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹9,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹10,05,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹11,11,700)
  Note: Current Cardekho variant not found locally

### Maruti Ciaz Alpha AT

Cardekho variants: https://www.cardekho.com/maruti/ciaz/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=7

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ciaz Alpha AT` (₹11,89,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹10,82,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹11,88,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹9,65,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹10,72,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹9,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹10,05,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹11,11,700)
  Note: Current Cardekho variant not found locally

### Maruti Ciaz Delta

Cardekho variants: https://www.cardekho.com/maruti/ciaz/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=7

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ciaz Delta` (₹9,89,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹10,82,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹11,88,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹9,65,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹10,72,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹9,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹10,05,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹11,11,700)
  Note: Current Cardekho variant not found locally

### Maruti Ciaz Delta AT

Cardekho variants: https://www.cardekho.com/maruti/ciaz/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=7

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ciaz Delta AT` (₹10,39,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹10,82,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹11,88,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹9,65,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹10,72,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹9,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹10,05,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹11,11,700)
  Note: Current Cardekho variant not found locally

### Maruti Ciaz Sigma

Cardekho variants: https://www.cardekho.com/maruti/ciaz/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=7

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ciaz Sigma` (₹9,09,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹10,82,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹11,88,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹9,65,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹10,72,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹9,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹10,05,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹11,11,700)
  Note: Current Cardekho variant not found locally

### Maruti Ciaz Zeta

Cardekho variants: https://www.cardekho.com/maruti/ciaz/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=7

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ciaz Zeta` (₹10,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹10,82,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹11,88,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹9,65,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹10,72,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹9,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹10,05,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹11,11,700)
  Note: Current Cardekho variant not found locally

### Maruti Ciaz Zeta AT

Cardekho variants: https://www.cardekho.com/maruti/ciaz/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=7

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ciaz Zeta AT` (₹11,09,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹10,82,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹11,88,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹9,65,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹10,72,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹9,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹10,05,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹11,11,700)
  Note: Current Cardekho variant not found locally

### Maruti Dzire LXI

Cardekho variants: https://www.cardekho.com/maruti/dzire/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire LXI` (₹6,26,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹6,25,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹7,17,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹7,62,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹8,03,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹8,17,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹8,62,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹9,03,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹8,86,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹9,31,300)
  Note: Current Cardekho variant not found locally

### Maruti Dzire Tour S CNG

Cardekho variants: https://www.cardekho.com/maruti/dzire-tour-s/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire Tour S CNG` (₹7,09,800) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `CNG` (₹7,09,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹6,23,800)
  Note: Current Cardekho variant not found locally

### Maruti Dzire Tour S STD

Cardekho variants: https://www.cardekho.com/maruti/dzire-tour-s/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire Tour S STD` (₹6,23,800) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `CNG` (₹7,09,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹6,23,800)
  Note: Current Cardekho variant not found locally

### Maruti Dzire VXI

Cardekho variants: https://www.cardekho.com/maruti/dzire/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire VXI` (₹7,26,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹6,25,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹7,17,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹7,62,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹8,03,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹8,17,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹8,62,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹9,03,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹8,86,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹9,31,300)
  Note: Current Cardekho variant not found locally

### Maruti Dzire VXI AMT

Cardekho variants: https://www.cardekho.com/maruti/dzire/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire VXI AMT` (₹7,76,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹6,25,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹7,17,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹7,62,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹8,03,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹8,17,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹8,62,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹9,03,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹8,86,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹9,31,300)
  Note: Current Cardekho variant not found locally

### Maruti Dzire VXI CNG

Cardekho variants: https://www.cardekho.com/maruti/dzire/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire VXI CNG` (₹8,26,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹6,25,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹7,17,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹7,62,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹8,03,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹8,17,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹8,62,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹9,03,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹8,86,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹9,31,300)
  Note: Current Cardekho variant not found locally

### Maruti Dzire ZXI

Cardekho variants: https://www.cardekho.com/maruti/dzire/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire ZXI` (₹8,31,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹6,25,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹7,17,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹7,62,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹8,03,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹8,17,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹8,62,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹9,03,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹8,86,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹9,31,300)
  Note: Current Cardekho variant not found locally

### Maruti Dzire ZXI AMT

Cardekho variants: https://www.cardekho.com/maruti/dzire/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire ZXI AMT` (₹8,81,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹6,25,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹7,17,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹7,62,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹8,03,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹8,17,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹8,62,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹9,03,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹8,86,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹9,31,300)
  Note: Current Cardekho variant not found locally

### Maruti Dzire ZXI CNG

Cardekho variants: https://www.cardekho.com/maruti/dzire/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire ZXI CNG` (₹9,31,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹6,25,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹7,17,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹7,62,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹8,03,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹8,17,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹8,62,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹9,03,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹8,86,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹9,31,300)
  Note: Current Cardekho variant not found locally

### Maruti Dzire ZXI Plus

Cardekho variants: https://www.cardekho.com/maruti/dzire/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire ZXI Plus` (₹8,81,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹6,25,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹7,17,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹7,62,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹8,03,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹8,17,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹8,62,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹9,03,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹8,86,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹9,31,300)
  Note: Current Cardekho variant not found locally

### Maruti Dzire ZXI Plus AMT

Cardekho variants: https://www.cardekho.com/maruti/dzire/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Dzire ZXI Plus AMT` (₹9,31,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹6,25,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹7,17,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AMT` (₹7,62,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹8,03,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹8,17,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AMT` (₹8,62,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹9,03,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹8,86,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AMT` (₹9,31,300)
  Note: Current Cardekho variant not found locally

### Maruti e Vitara Alpha

Cardekho variants: https://www.cardekho.com/maruti/e-vitara/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Maruti e Vitara Alpha` (₹19,79,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹19,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹20,01,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹17,49,000)
  Note: Current Cardekho variant not found locally

### Maruti e Vitara Alpha Dual Tone

Cardekho variants: https://www.cardekho.com/maruti/e-vitara/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Maruti e Vitara Alpha Dual Tone` (₹20,01,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹19,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹20,01,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹17,49,000)
  Note: Current Cardekho variant not found locally

### Maruti e Vitara Delta

Cardekho variants: https://www.cardekho.com/maruti/e-vitara/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Maruti e Vitara Delta` (₹15,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹19,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹20,01,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹17,49,000)
  Note: Current Cardekho variant not found locally

### Maruti e Vitara Zeta

Cardekho variants: https://www.cardekho.com/maruti/e-vitara/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Maruti e Vitara Zeta` (₹17,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹19,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹20,01,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹17,49,000)
  Note: Current Cardekho variant not found locally

### Maruti Eeco 5 Seater AC

Cardekho variants: https://www.cardekho.com/maruti/eeco/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Eeco 5 Seater AC` (₹5,71,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater AC` (₹5,53,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater AC CNG` (₹6,35,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater STD` (₹5,20,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `6 Seater STD` (₹5,47,400)
  Note: Current Cardekho variant not found locally

### Maruti Eeco 5 Seater AC CNG

Cardekho variants: https://www.cardekho.com/maruti/eeco/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Eeco 5 Seater AC CNG` (₹6,36,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater AC` (₹5,53,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater AC CNG` (₹6,35,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater STD` (₹5,20,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `6 Seater STD` (₹5,47,400)
  Note: Current Cardekho variant not found locally

### Maruti Eeco 5 Seater STD

Cardekho variants: https://www.cardekho.com/maruti/eeco/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Eeco 5 Seater STD` (₹5,21,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater AC` (₹5,53,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater AC CNG` (₹6,35,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater STD` (₹5,20,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `6 Seater STD` (₹5,47,400)
  Note: Current Cardekho variant not found locally

### Maruti Eeco 6 Seater STD

Cardekho variants: https://www.cardekho.com/maruti/eeco/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Eeco 6 Seater STD` (₹5,36,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater AC` (₹5,53,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater AC CNG` (₹6,35,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `5 Seater STD` (₹5,20,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `6 Seater STD` (₹5,47,400)
  Note: Current Cardekho variant not found locally

### Maruti Eeco Cargo STD

Cardekho variants: https://www.cardekho.com/maruti/eeco-cargo/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Eeco Cargo STD` (₹5,38,800) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹5,38,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD AC CNG` (₹6,60,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD CNG` (₹6,20,800)
  Note: Current Cardekho variant not found locally

### Maruti Eeco Cargo STD AC CNG

Cardekho variants: https://www.cardekho.com/maruti/eeco-cargo/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Eeco Cargo STD AC CNG` (₹6,60,500) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹5,38,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD AC CNG` (₹6,60,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD CNG` (₹6,20,800)
  Note: Current Cardekho variant not found locally

### Maruti Eeco Cargo STD CNG

Cardekho variants: https://www.cardekho.com/maruti/eeco-cargo/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Eeco Cargo STD CNG` (₹6,21,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹5,38,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD AC CNG` (₹6,60,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD CNG` (₹6,20,800)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga LXI

Cardekho variants: https://www.cardekho.com/maruti/ertiga/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga LXI` (₹8,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹9,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹11,20,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹10,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,91,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹12,26,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹11,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹11,59,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹12,94,100)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga Tour STD

Cardekho variants: https://www.cardekho.com/maruti/ertiga-tour/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga Tour STD` (₹9,67,820) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹9,67,820)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD CNG` (₹10,58,820)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga Tour STD CNG

Cardekho variants: https://www.cardekho.com/maruti/ertiga-tour/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga Tour STD CNG` (₹10,58,820) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹9,67,820)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD CNG` (₹10,58,820)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga VXI

Cardekho variants: https://www.cardekho.com/maruti/ertiga/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga VXI` (₹9,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹9,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹11,20,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹10,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,91,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹12,26,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹11,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹11,59,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹12,94,100)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga VXI AT

Cardekho variants: https://www.cardekho.com/maruti/ertiga/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga VXI AT` (₹10,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹9,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹11,20,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹10,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,91,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹12,26,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹11,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹11,59,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹12,94,100)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga VXI CNG

Cardekho variants: https://www.cardekho.com/maruti/ertiga/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga VXI CNG` (₹10,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹9,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹11,20,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹10,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,91,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹12,26,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹11,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹11,59,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹12,94,100)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga ZXI

Cardekho variants: https://www.cardekho.com/maruti/ertiga/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga ZXI` (₹10,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹9,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹11,20,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹10,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,91,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹12,26,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹11,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹11,59,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹12,94,100)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga ZXI AT

Cardekho variants: https://www.cardekho.com/maruti/ertiga/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga ZXI AT` (₹11,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹9,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹11,20,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹10,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,91,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹12,26,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹11,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹11,59,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹12,94,100)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga ZXI CNG

Cardekho variants: https://www.cardekho.com/maruti/ertiga/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga ZXI CNG` (₹11,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹9,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹11,20,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹10,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,91,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹12,26,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹11,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹11,59,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹12,94,100)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga ZXI Plus

Cardekho variants: https://www.cardekho.com/maruti/ertiga/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga ZXI Plus` (₹11,94,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹9,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹11,20,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹10,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,91,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹12,26,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹11,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹11,59,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹12,94,100)
  Note: Current Cardekho variant not found locally

### Maruti Ertiga ZXI Plus AT

Cardekho variants: https://www.cardekho.com/maruti/ertiga/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ertiga ZXI Plus AT` (₹12,94,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lxi` (₹8,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹9,85,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹11,20,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹10,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zxi` (₹10,91,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹12,26,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹11,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹11,59,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹12,94,100)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Alpha Turbo

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Alpha Turbo` (₹10,98,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Alpha Turbo AT

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Alpha Turbo AT` (₹11,48,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Delta

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Delta` (₹7,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Delta AMT

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Delta AMT` (₹8,35,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Delta CNG

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Delta CNG` (₹8,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Delta Plus

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Delta Plus` (₹8,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Delta Plus AMT

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Delta Plus AMT` (₹9,35,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Delta Plus Turbo

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Delta Plus Turbo` (₹9,35,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Sigma

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Sigma` (₹6,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Sigma CNG

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Sigma CNG` (₹7,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Zeta Turbo

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Zeta Turbo` (₹10,35,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Fronx Zeta Turbo AT

Cardekho variants: https://www.cardekho.com/maruti/fronx/variants.htm
Rows to review: 17
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Fronx Zeta Turbo AT` (₹10,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo` (₹10,55,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo AT` (₹11,83,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT` (₹10,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Turbo DT AT` (₹11,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹7,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹8,14,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹8,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt` (₹8,04,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Opt AMT` (₹8,54,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Turbo` (₹8,91,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma CNG` (₹7,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo` (₹9,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Turbo AT` (₹10,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha` (₹15,20,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha AT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha AT` (₹16,55,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha AT DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha AT DT` (₹16,70,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha AWD AT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha AWD AT` (₹18,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha AWD AT DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha AWD AT DT` (₹18,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha AWD Opt AT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha AWD Opt AT` (₹18,58,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha AWD Opt AT DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha AWD Opt AT DT` (₹18,73,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha DT` (₹15,35,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha Opt

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha Opt` (₹15,78,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha Opt AT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha Opt AT` (₹17,13,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha Opt AT DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha Opt AT DT` (₹17,28,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha Opt DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha Opt DT` (₹15,93,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha Plus Hybrid CVT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha Plus Hybrid CVT` (₹19,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha Plus Hybrid CVT DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha Plus Hybrid CVT DT` (₹19,66,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Alpha Plus Opt Hybrid CVT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Alpha Plus Opt Hybrid CVT` (₹19,57,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Delta

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Delta` (₹12,10,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Delta AT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Delta AT` (₹13,45,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Delta CNG

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Delta CNG` (₹13,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Delta Plus Hybrid CVT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Delta Plus Hybrid CVT` (₹16,63,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Sigma

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Sigma` (₹10,77,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta` (₹13,70,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta AT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta AT` (₹15,05,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta AT DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta AT DT` (₹15,20,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta CNG

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta CNG` (₹14,60,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta DT` (₹13,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta Opt

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta Opt` (₹14,28,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta Opt AT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta Opt AT` (₹15,63,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta Opt AT DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta Opt AT DT` (₹15,78,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta Opt DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta Opt DT` (₹14,43,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta Plus Hybrid CVT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta Plus Hybrid CVT` (₹17,92,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta Plus Hybrid CVT DT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta Plus Hybrid CVT DT` (₹18,07,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Grand Vitara Zeta Plus Opt Hybrid CVT

Cardekho variants: https://www.cardekho.com/maruti/grand-vitara/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=35

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Grand Vitara Zeta Plus Opt Hybrid CVT` (₹18,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹15,19,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹16,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT DT` (₹16,70,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT` (₹17,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD AT DT` (₹18,15,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT` (₹18,57,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AWD Opt AT DT` (₹18,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha DT` (₹15,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt` (₹15,77,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT` (₹17,12,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt AT DT` (₹17,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Opt DT` (₹15,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT` (₹19,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Hybrid CVT DT` (₹19,65,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT` (₹19,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Opt Hybrid CVT DT` (₹19,72,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹12,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AT` (₹13,44,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta CNG` (₹12,99,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Plus Hybrid CVT` (₹16,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹10,76,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹13,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹15,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT DT` (₹15,20,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹14,60,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG DT` (₹14,75,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta DT` (₹13,85,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt` (₹14,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT` (₹15,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt AT DT` (₹15,78,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Opt DT` (₹14,43,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT` (₹17,91,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Hybrid CVT DT` (₹18,07,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT` (₹18,50,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus Opt Hybrid CVT DT` (₹18,65,700)
  Note: Current Cardekho variant not found locally

### Maruti Ignis Alpha

Cardekho variants: https://www.cardekho.com/maruti/ignis/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=12

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ignis Alpha` (₹7,04,700) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹6,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹7,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹7,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AMT` (₹7,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹5,84,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Dual Tone AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹6,37,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹6,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone` (₹6,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone AMT` (₹6,95,200)
  Note: Current Cardekho variant not found locally

### Maruti Ignis Alpha AMT

Cardekho variants: https://www.cardekho.com/maruti/ignis/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=12

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ignis Alpha AMT` (₹7,54,700) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹6,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹7,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹7,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AMT` (₹7,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹5,84,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Dual Tone AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹6,37,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹6,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone` (₹6,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone AMT` (₹6,95,200)
  Note: Current Cardekho variant not found locally

### Maruti Ignis Delta

Cardekho variants: https://www.cardekho.com/maruti/ignis/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=12

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ignis Delta` (₹5,89,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹6,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹7,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹7,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AMT` (₹7,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹5,84,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Dual Tone AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹6,37,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹6,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone` (₹6,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone AMT` (₹6,95,200)
  Note: Current Cardekho variant not found locally

### Maruti Ignis Delta AMT

Cardekho variants: https://www.cardekho.com/maruti/ignis/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=12

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ignis Delta AMT` (₹6,39,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹6,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹7,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹7,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AMT` (₹7,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹5,84,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Dual Tone AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹6,37,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹6,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone` (₹6,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone AMT` (₹6,95,200)
  Note: Current Cardekho variant not found locally

### Maruti Ignis Sigma

Cardekho variants: https://www.cardekho.com/maruti/ignis/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=12

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ignis Sigma` (₹5,35,100) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹6,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹7,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹7,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AMT` (₹7,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹5,84,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Dual Tone AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹6,37,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹6,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone` (₹6,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone AMT` (₹6,95,200)
  Note: Current Cardekho variant not found locally

### Maruti Ignis Zeta

Cardekho variants: https://www.cardekho.com/maruti/ignis/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=12

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ignis Zeta` (₹6,49,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹6,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹7,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹7,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AMT` (₹7,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹5,84,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Dual Tone AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹6,37,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹6,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone` (₹6,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone AMT` (₹6,95,200)
  Note: Current Cardekho variant not found locally

### Maruti Ignis Zeta AMT

Cardekho variants: https://www.cardekho.com/maruti/ignis/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=12

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Ignis Zeta AMT` (₹6,99,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹6,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AMT` (₹7,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹7,09,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AMT` (₹7,54,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta` (₹5,84,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Delta Dual Tone AMT` (₹6,29,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sigma` (₹5,35,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹6,37,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AMT` (₹6,82,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone` (₹6,50,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Dual Tone AMT` (₹6,95,200)
  Note: Current Cardekho variant not found locally

### Maruti Invicto Alpha Plus 7Str

Cardekho variants: https://www.cardekho.com/maruti/invicto/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Invicto Alpha Plus 7Str` (₹28,61,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus 7Str` (₹28,60,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus 7Str` (₹24,97,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus 8Str` (₹25,02,300)
  Note: Current Cardekho variant not found locally

### Maruti Invicto Zeta Plus 7Str

Cardekho variants: https://www.cardekho.com/maruti/invicto/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Invicto Zeta Plus 7Str` (₹24,97,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus 7Str` (₹28,60,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus 7Str` (₹24,97,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus 8Str` (₹25,02,300)
  Note: Current Cardekho variant not found locally

### Maruti Invicto Zeta Plus 8Str

Cardekho variants: https://www.cardekho.com/maruti/invicto/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Invicto Zeta Plus 8Str` (₹24,97,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus 7Str` (₹28,60,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus 7Str` (₹24,97,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta Plus 8Str` (₹25,02,300)
  Note: Current Cardekho variant not found locally

### Maruti Jimny Alpha

Cardekho variants: https://www.cardekho.com/maruti/jimny/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Jimny Alpha` (₹13,61,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹13,23,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹14,29,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹13,38,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AT` (₹14,44,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹12,31,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹13,37,500)
  Note: Current Cardekho variant not found locally

### Maruti Jimny Alpha AT

Cardekho variants: https://www.cardekho.com/maruti/jimny/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Jimny Alpha AT` (₹14,11,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹13,23,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹14,29,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹13,38,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AT` (₹14,44,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹12,31,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹13,37,500)
  Note: Current Cardekho variant not found locally

### Maruti Jimny Alpha Dual Tone

Cardekho variants: https://www.cardekho.com/maruti/jimny/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Jimny Alpha Dual Tone` (₹13,76,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹13,23,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹14,29,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹13,38,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AT` (₹14,44,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹12,31,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹13,37,500)
  Note: Current Cardekho variant not found locally

### Maruti Jimny Alpha Dual Tone AT

Cardekho variants: https://www.cardekho.com/maruti/jimny/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Jimny Alpha Dual Tone AT` (₹14,45,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹13,23,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹14,29,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹13,38,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AT` (₹14,44,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹12,31,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹13,37,500)
  Note: Current Cardekho variant not found locally

### Maruti Jimny Zeta

Cardekho variants: https://www.cardekho.com/maruti/jimny/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Jimny Zeta` (₹12,31,500) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹13,23,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹14,29,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹13,38,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AT` (₹14,44,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹12,31,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹13,37,500)
  Note: Current Cardekho variant not found locally

### Maruti Jimny Zeta AT

Cardekho variants: https://www.cardekho.com/maruti/jimny/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Jimny Zeta AT` (₹12,81,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹13,23,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹14,29,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone` (₹13,38,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Dual Tone AT` (₹14,44,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹12,31,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹13,37,500)
  Note: Current Cardekho variant not found locally

### Maruti S-Presso LXI

Cardekho variants: https://www.cardekho.com/maruti/s-presso/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti S-Presso LXI` (₹3,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹3,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹4,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,11,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AT` (₹4,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus` (₹4,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus Opt AT` (₹5,24,900)
  Note: Current Cardekho variant not found locally

### Maruti S-Presso LXI CNG

Cardekho variants: https://www.cardekho.com/maruti/s-presso/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti S-Presso LXI CNG` (₹4,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹3,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹4,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,11,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AT` (₹4,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus` (₹4,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus Opt AT` (₹5,24,900)
  Note: Current Cardekho variant not found locally

### Maruti S-Presso STD

Cardekho variants: https://www.cardekho.com/maruti/s-presso/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti S-Presso STD` (₹3,49,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹3,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹4,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,11,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AT` (₹4,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus` (₹4,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus Opt AT` (₹5,24,900)
  Note: Current Cardekho variant not found locally

### Maruti S-Presso VXI

Cardekho variants: https://www.cardekho.com/maruti/s-presso/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti S-Presso VXI` (₹4,29,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹3,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹4,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,11,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AT` (₹4,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus` (₹4,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus Opt AT` (₹5,24,900)
  Note: Current Cardekho variant not found locally

### Maruti S-Presso VXI CNG

Cardekho variants: https://www.cardekho.com/maruti/s-presso/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti S-Presso VXI CNG` (₹5,24,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹3,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹4,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,11,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AT` (₹4,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus` (₹4,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus Opt AT` (₹5,24,900)
  Note: Current Cardekho variant not found locally

### Maruti S-Presso VXI Opt AT

Cardekho variants: https://www.cardekho.com/maruti/s-presso/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti S-Presso VXI Opt AT` (₹4,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹3,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹4,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,11,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AT` (₹4,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus` (₹4,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus Opt AT` (₹5,24,900)
  Note: Current Cardekho variant not found locally

### Maruti S-Presso VXI Plus

Cardekho variants: https://www.cardekho.com/maruti/s-presso/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti S-Presso VXI Plus` (₹4,69,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹3,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹4,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,11,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AT` (₹4,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus` (₹4,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus Opt AT` (₹5,24,900)
  Note: Current Cardekho variant not found locally

### Maruti S-Presso VXI Plus Opt AT

Cardekho variants: https://www.cardekho.com/maruti/s-presso/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Maruti S-Presso VXI Plus Opt AT` (₹5,24,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹3,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹4,61,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹3,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹4,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹5,11,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AT` (₹4,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus` (₹4,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Plus Opt AT` (₹5,24,900)
  Note: Current Cardekho variant not found locally

### Maruti Swift LXI

Cardekho variants: https://www.cardekho.com/maruti/swift/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Swift LXI` (₹5,78,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹5,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹6,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi AMT` (₹7,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹7,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt CNG` (₹7,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi` (₹7,52,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi AMT` (₹7,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi CNG` (₹8,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT` (₹8,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT DT` (₹8,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus DT` (₹8,34,900)
  Note: Current Cardekho variant not found locally

### Maruti Swift VXI

Cardekho variants: https://www.cardekho.com/maruti/swift/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Swift VXI` (₹6,54,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹5,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹6,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi AMT` (₹7,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹7,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt CNG` (₹7,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi` (₹7,52,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi AMT` (₹7,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi CNG` (₹8,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT` (₹8,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT DT` (₹8,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus DT` (₹8,34,900)
  Note: Current Cardekho variant not found locally

### Maruti Swift VXI AMT

Cardekho variants: https://www.cardekho.com/maruti/swift/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Swift VXI AMT` (₹7,04,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹5,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹6,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi AMT` (₹7,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹7,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt CNG` (₹7,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi` (₹7,52,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi AMT` (₹7,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi CNG` (₹8,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT` (₹8,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT DT` (₹8,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus DT` (₹8,34,900)
  Note: Current Cardekho variant not found locally

### Maruti Swift VXI CNG

Cardekho variants: https://www.cardekho.com/maruti/swift/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Swift VXI CNG` (₹7,34,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹5,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹6,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi AMT` (₹7,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹7,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt CNG` (₹7,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi` (₹7,52,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi AMT` (₹7,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi CNG` (₹8,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT` (₹8,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT DT` (₹8,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus DT` (₹8,34,900)
  Note: Current Cardekho variant not found locally

### Maruti Swift ZXI

Cardekho variants: https://www.cardekho.com/maruti/swift/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Swift ZXI` (₹7,29,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹5,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹6,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi AMT` (₹7,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹7,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt CNG` (₹7,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi` (₹7,52,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi AMT` (₹7,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi CNG` (₹8,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT` (₹8,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT DT` (₹8,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus DT` (₹8,34,900)
  Note: Current Cardekho variant not found locally

### Maruti Swift ZXI AMT

Cardekho variants: https://www.cardekho.com/maruti/swift/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Swift ZXI AMT` (₹7,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹5,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹6,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi AMT` (₹7,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹7,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt CNG` (₹7,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi` (₹7,52,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi AMT` (₹7,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi CNG` (₹8,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT` (₹8,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT DT` (₹8,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus DT` (₹8,34,900)
  Note: Current Cardekho variant not found locally

### Maruti Swift ZXI CNG

Cardekho variants: https://www.cardekho.com/maruti/swift/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Swift ZXI CNG` (₹8,09,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹5,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹6,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi AMT` (₹7,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹7,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt CNG` (₹7,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi` (₹7,52,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi AMT` (₹7,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi CNG` (₹8,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT` (₹8,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT DT` (₹8,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus DT` (₹8,34,900)
  Note: Current Cardekho variant not found locally

### Maruti Swift ZXI Plus

Cardekho variants: https://www.cardekho.com/maruti/swift/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Swift ZXI Plus` (₹8,09,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹5,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹6,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi AMT` (₹7,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹7,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt CNG` (₹7,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi` (₹7,52,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi AMT` (₹7,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi CNG` (₹8,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT` (₹8,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT DT` (₹8,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus DT` (₹8,34,900)
  Note: Current Cardekho variant not found locally

### Maruti Swift ZXI Plus AMT

Cardekho variants: https://www.cardekho.com/maruti/swift/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=14

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Swift ZXI Plus AMT` (₹8,49,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXi` (₹5,78,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi` (₹6,58,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi AMT` (₹7,03,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi CNG` (₹7,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt` (₹6,84,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt AMT` (₹7,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXi Opt CNG` (₹7,70,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi` (₹7,52,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi AMT` (₹7,97,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi CNG` (₹8,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus` (₹8,19,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT` (₹8,64,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus AMT DT` (₹8,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXi Plus DT` (₹8,34,900)
  Note: Current Cardekho variant not found locally

### Maruti Victoris LXI

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris LXI` (₹10,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris VXI

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris VXI` (₹11,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris VXI AT

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris VXI AT` (₹12,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris VXI CNG

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris VXI CNG` (₹12,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris VXI Strong Hybrid

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris VXI Strong Hybrid` (₹15,79,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris ZXI

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris ZXI` (₹13,56,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris ZXI AT

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris ZXI AT` (₹14,56,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris ZXI CNG

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris ZXI CNG` (₹14,56,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris ZXI Plus

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris ZXI Plus` (₹15,56,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris ZXI Plus (O) Strong Hybrid

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris ZXI Plus (O) Strong Hybrid` (₹19,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris ZXI Plus AT

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris ZXI Plus AT` (₹17,18,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris ZXI Plus Strong Hybrid

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris ZXI Plus Strong Hybrid` (₹18,99,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Victoris ZXI Strong Hybrid

Cardekho variants: https://www.cardekho.com/maruti/victoris/variants.htm
Rows to review: 37
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=36

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Victoris ZXI Strong Hybrid` (₹16,99,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `LXI CNG` (₹11,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI` (₹11,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI AT` (₹13,35,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI CNG` (₹12,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VXI Strong Hybrid` (₹16,37,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI` (₹13,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O)` (₹14,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT` (₹15,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) AT DT` (₹15,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) DT` (₹14,23,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid` (₹18,38,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI (O) Strong Hybrid DT` (₹18,54,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT` (₹15,12,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI AT DT` (₹15,28,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG` (₹14,56,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI CNG DT` (₹14,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI DT` (₹13,72,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus` (₹15,23,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O)` (₹15,81,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT` (₹17,76,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT AWD` (₹19,21,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AT DT` (₹17,92,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) AWD AT DT` (₹19,37,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) DT` (₹15,97,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus (O) Strong Hybrid DT` (₹19,98,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT` (₹17,18,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT AWD` (₹18,63,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AT DT` (₹17,34,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus AWD AT DT` (₹18,79,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus DT` (₹15,39,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid` (₹19,46,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Plus Strong Hybrid DT` (₹19,62,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid` (₹17,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZXI Strong Hybrid DT` (₹17,95,300)
  Note: Current Cardekho variant not found locally

### Maruti Wagon R Tour H3 CNG

Cardekho variants: https://www.cardekho.com/maruti/wagon-r-tour/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Wagon R Tour H3 CNG` (₹5,88,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `H3 CNG` (₹5,88,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `H3 PETROL` (₹4,98,900)
  Note: Current Cardekho variant not found locally

### Maruti Wagon R Tour H3 Petrol

Cardekho variants: https://www.cardekho.com/maruti/wagon-r-tour/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Maruti Wagon R Tour H3 Petrol` (₹4,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `H3 CNG` (₹5,88,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `H3 PETROL` (₹4,98,900)
  Note: Current Cardekho variant not found locally

### Maruti WagonR LXI

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR LXI` (₹4,98,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR LXI CNG

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR LXI CNG` (₹5,98,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR VXI

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR VXI` (₹5,54,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR VXI AT

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR VXI AT` (₹6,04,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR VXI CNG

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR VXI CNG` (₹6,54,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR ZXI

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR ZXI` (₹5,89,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR ZXI AT

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR ZXI AT` (₹6,39,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR ZXI Plus

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR ZXI Plus` (₹6,39,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR ZXI Plus AT

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR ZXI Plus AT` (₹6,64,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR ZXI Plus AT Dual Tone

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR ZXI Plus AT Dual Tone` (₹6,94,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti WagonR ZXI Plus Dual Tone

Cardekho variants: https://www.cardekho.com/maruti/wagon-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Maruti WagonR ZXI Plus Dual Tone` (₹6,54,900) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Maruti XL6 Alpha

Cardekho variants: https://www.cardekho.com/maruti/xl6/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti XL6 Alpha` (₹12,52,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹12,48,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹13,83,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus` (₹12,97,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT` (₹14,32,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT Dual Tone` (₹14,47,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Dual Tone` (₹13,12,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹11,52,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹12,87,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹12,43,300)
  Note: Current Cardekho variant not found locally

### Maruti XL6 Alpha AT

Cardekho variants: https://www.cardekho.com/maruti/xl6/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti XL6 Alpha AT` (₹13,52,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹12,48,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹13,83,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus` (₹12,97,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT` (₹14,32,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT Dual Tone` (₹14,47,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Dual Tone` (₹13,12,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹11,52,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹12,87,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹12,43,300)
  Note: Current Cardekho variant not found locally

### Maruti XL6 Alpha Plus

Cardekho variants: https://www.cardekho.com/maruti/xl6/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti XL6 Alpha Plus` (₹13,52,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹12,48,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹13,83,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus` (₹12,97,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT` (₹14,32,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT Dual Tone` (₹14,47,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Dual Tone` (₹13,12,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹11,52,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹12,87,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹12,43,300)
  Note: Current Cardekho variant not found locally

### Maruti XL6 Alpha Plus AT

Cardekho variants: https://www.cardekho.com/maruti/xl6/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti XL6 Alpha Plus AT` (₹14,48,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹12,48,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹13,83,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus` (₹12,97,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT` (₹14,32,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT Dual Tone` (₹14,47,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Dual Tone` (₹13,12,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹11,52,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹12,87,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹12,43,300)
  Note: Current Cardekho variant not found locally

### Maruti XL6 Zeta

Cardekho variants: https://www.cardekho.com/maruti/xl6/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti XL6 Zeta` (₹11,52,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹12,48,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹13,83,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus` (₹12,97,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT` (₹14,32,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT Dual Tone` (₹14,47,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Dual Tone` (₹13,12,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹11,52,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹12,87,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹12,43,300)
  Note: Current Cardekho variant not found locally

### Maruti XL6 Zeta AT

Cardekho variants: https://www.cardekho.com/maruti/xl6/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti XL6 Zeta AT` (₹12,52,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹12,48,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹13,83,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus` (₹12,97,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT` (₹14,32,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT Dual Tone` (₹14,47,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Dual Tone` (₹13,12,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹11,52,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹12,87,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹12,43,300)
  Note: Current Cardekho variant not found locally

### Maruti XL6 Zeta CNG

Cardekho variants: https://www.cardekho.com/maruti/xl6/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `Maruti XL6 Zeta CNG` (₹12,52,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha` (₹12,48,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha AT` (₹13,83,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus` (₹12,97,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT` (₹14,32,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus AT Dual Tone` (₹14,47,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Alpha Plus Dual Tone` (₹13,12,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta` (₹11,52,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta AT` (₹12,87,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Zeta CNG` (₹12,43,300)
  Note: Current Cardekho variant not found locally

## Maserati

Pending models: 5
Pending rows: 33

### GranCabrio

Cardekho variants: https://www.cardekho.com/maserati/grancabrio/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `Sport` (₹2,46,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Trofeo` (₹2,69,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4.7 V8` (₹2,69,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Maserati Gran Cabrio MC Diesel` (₹2,69,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Maserati Gran Cabrio Sport Diesel` (₹2,46,00,000)
  Note: Current Cardekho variant not found locally

### GranTurismo

Cardekho variants: https://www.cardekho.com/maserati/granturismo/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Modena` (₹2,25,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Trofeo` (₹2,75,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Maserati Gran Turismo 4.7 MC` (₹2,51,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Maserati Gran Turismo 4.7 V8` (₹2,25,00,000)
  Note: Current Cardekho variant not found locally

### Grecale

Cardekho variants: https://www.cardekho.com/maserati/grecale/variants.htm
Rows to review: 2
Status mix: CARDEKHO_ONLY_VARIANT=2

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Modena` (₹1,53,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Modena` (₹2,05,00,000)
  Note: Current Cardekho variant not found locally

### Levante

Cardekho variants: https://www.cardekho.com/maserati/levante/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=11

- [ ] LOCAL_ONLY_VARIANT: local `Diesel` (₹1,49,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `S` (₹1,75,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `350 GranLusso` (₹1,52,68,646)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `350 GranLusso` (₹1,54,28,807)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `350 GranSport` (₹1,49,36,448)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `350 GranSport` (₹1,50,96,610)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `430 GranLusso` (₹1,64,15,782)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `430 GranSport` (₹1,60,29,115)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `430 GranSport` (₹1,64,15,782)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GranLusso Diesel` (₹1,54,28,807)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GranLusso Diesel` (₹1,60,29,115)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GranSport Diesel` (₹1,50,96,610)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GranSport Diesel` (₹1,52,68,646)
  Note: Current Cardekho variant not found locally

### Quattroporte

Cardekho variants: https://www.cardekho.com/maserati/quattroporte/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Diesel` (₹1,67,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `GranLusso` (₹1,71,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `GranSport` (₹1,85,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `350 GranLusso` (₹1,71,31,299)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `350 GranSport` (₹1,77,30,783)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `430 GranLusso` (₹1,79,78,568)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `430 GranSport` (₹1,85,78,051)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GranLusso Diesel` (₹1,71,85,615)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GranSport Diesel` (₹1,77,85,098)
  Note: Current Cardekho variant not found locally

## Mercedes-Benz

Pending models: 18
Pending rows: 80

### A-Class

Cardekho variants: https://www.cardekho.com/mercedes-benz/a-class/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=11

- [ ] LOCAL_ONLY_VARIANT: local `A 200` (₹44,46,207) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `A 200d` (₹45,92,568) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A180 Sport` (₹30,94,146)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A180 Sport` (₹26,19,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A180 Sport` (₹26,95,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A180 Sport Edition` (₹25,95,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A180 Sport Edition` (₹26,19,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A180 Sport Edition` (₹26,95,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A180 Sport Edition` (₹29,89,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A200 CDI Sport` (₹29,89,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A200 CDI Sport` (₹30,94,146)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A200 D Sport` (₹25,95,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `A200 D Sport Edition` (₹28,45,000)
  Note: Current Cardekho variant not found locally

### AMG A 45 S

Cardekho variants: https://www.cardekho.com/mercedes-benz/amg-a-45-s/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `AMG A 45 S 4MATIC+` (₹94,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4MATIC Plus` (₹94,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Aero Track Edition` (₹87,00,000)
  Note: Current Cardekho variant not found locally

### AMG E 63 S

Cardekho variants: https://www.cardekho.com/mercedes-benz/amg-e-63-s/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `AMG E 63 S 4MATIC+` (₹1,90,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### AMG GLA 35

Cardekho variants: https://www.cardekho.com/mercedes-benz/amg-gla-35/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `AMG GLA 35 4MATIC` (₹60,07,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4MATIC` (₹58,50,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4MATIC` (₹63,50,000)
  Note: Current Cardekho variant not found locally

### AMG GLE 53

Cardekho variants: https://www.cardekho.com/mercedes-benz/amg-gle-53/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `AMG GLE 53 4MATIC+ Coupe` (₹1,87,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Coupe` (₹1,87,50,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Coupe Performance Edition` (₹1,52,00,000)
  Note: Current Cardekho variant not found locally

### AMG GT Coupe

Cardekho variants: https://www.cardekho.com/mercedes-benz/amg-gt-coupe/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `AMG GT 55 4MATIC+` (₹3,05,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `AMG GT 63 4MATIC+` (₹3,65,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `63 4MATIC Plus` (₹3,05,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `63 Pro 4MATIC Plus` (₹3,65,00,000)
  Note: Current Cardekho variant not found locally

### AMG GT R

Cardekho variants: https://www.cardekho.com/mercedes-benz/amg-gt-r/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `AMG GT R` (₹24,75,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### C-Class

Cardekho variants: https://www.cardekho.com/mercedes-benz/c-class/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Mercedes-Benz C-Class C 200` (₹58,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Mercedes-Benz C-Class C 220d` (₹58,65,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `C 200` (₹58,89,655)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `C 200` (₹64,32,432)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `C 220d` (₹58,64,865)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `C 220d` (₹58,89,655)
  Note: Current Cardekho variant not found locally

### CLE

Cardekho variants: https://www.cardekho.com/mercedes-benz/cle/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Mercedes-Benz AMG CLE 53 4Matic` (₹1,28,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### E-Class

Cardekho variants: https://www.cardekho.com/mercedes-benz/e-class/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Mercedes-Benz E-Class E 200` (₹78,51,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Mercedes-Benz E-Class E 220d` (₹80,41,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E 200` (₹78,51,351)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E 200` (₹80,40,541)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E 220d` (₹80,40,541)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E 220d` (₹91,66,216)
  Note: Current Cardekho variant not found locally

### EQS

Cardekho variants: https://www.cardekho.com/mercedes-benz/eqs/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `EQS 450+` (₹1,30,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `EQS 580 4MATIC` (₹1,57,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `580 4Matic` (₹1,62,70,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `580 4Matic` (₹1,30,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `580 4MATIC Celebration Edition` (₹1,30,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `580 4MATIC Celebration Edition` (₹1,62,70,000)
  Note: Current Cardekho variant not found locally

### EQS SUV

Cardekho variants: https://www.cardekho.com/mercedes-benz/eqs-suv/variants.htm
Rows to review: 3
Status mix: CARDEKHO_ONLY_VARIANT=3

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450 Celebration Edition` (₹1,34,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450 Celebration Edition` (₹1,47,50,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `580 Celebration Edition` (₹1,48,00,000)
  Note: Current Cardekho variant not found locally

### G-Class

Cardekho variants: https://www.cardekho.com/mercedes-benz/g-class/variants.htm
Rows to review: 7
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=5

- [ ] LOCAL_ONLY_VARIANT: local `G 400d` (₹2,55,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `G 500` (₹2,75,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `400d Adventure Edition` (₹2,55,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `400d AMG Line` (₹2,55,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450d Mild Hybrid` (₹2,90,00,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450d Mild Hybrid` (₹3,59,35,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `AMG G 63 Collector's Edition` (₹4,30,00,001)
  Note: Current Cardekho variant not found locally

### GLA

Cardekho variants: https://www.cardekho.com/mercedes-benz/gla/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Mercedes-Benz GLA 200` (₹50,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `200` (₹50,80,001)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `200` (₹52,00,000)
  Note: Current Cardekho variant not found locally

### GLE

Cardekho variants: https://www.cardekho.com/mercedes-benz/gle/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Mercedes-Benz GLE 300d 4Matic AMG Line` (₹96,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Mercedes-Benz GLE 450 4Matic` (₹1,07,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `300d 4Matic AMG Line` (₹96,14,486)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `300d 4Matic AMG Line` (₹1,07,33,333)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450 4Matic` (₹1,07,33,333)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450 4Matic` (₹1,12,00,000)
  Note: Current Cardekho variant not found locally

### GLS

Cardekho variants: https://www.cardekho.com/mercedes-benz/gls/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Mercedes-Benz GLS 450 4MATIC AMG Line` (₹1,32,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Mercedes-Benz GLS 450d 4MATIC AMG Line` (₹1,34,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450 4MATIC AMG Line` (₹1,32,06,667)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450 4MATIC AMG Line` (₹1,34,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450d 4MATIC AMG Line` (₹1,34,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `450d 4MATIC AMG Line` (₹1,34,40,000)
  Note: Current Cardekho variant not found locally

### Maybach EQS SUV

Cardekho variants: https://www.cardekho.com/mercedes-benz/maybach-eqs-suv/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Maybach EQS 680 SUV` (₹2,28,20,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `680` (₹2,28,20,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Night Series` (₹2,63,00,001)
  Note: Current Cardekho variant not found locally

### V-Class

Cardekho variants: https://www.cardekho.com/mercedes-benz/v-class/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `V-Class V 260 Extra Long` (₹1,40,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `V-Class V 300d Extra Long` (₹1,40,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V300` (₹1,40,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V300d` (₹1,40,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V300d` (₹1,40,00,000)
  Note: Current Cardekho variant not found locally

## MG

Pending models: 3
Pending rows: 31

### Comet EV

Cardekho variants: https://www.cardekho.com/mg/comet-ev/variants.htm
Rows to review: 12
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=10

- [ ] LOCAL_ONLY_VARIANT: local `Play` (₹8,49,800) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Xplore` (₹9,56,100) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Blackstorm Edition` (₹7,63,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Blackstorm Edition` (₹8,56,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Excite` (₹8,56,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Excite` (₹8,96,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Excite FC` (₹8,96,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Excite FC` (₹9,56,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Exclusive` (₹9,56,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Exclusive` (₹7,49,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Exclusive FC` (₹7,60,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Exclusive FC` (₹7,63,300)
  Note: Current Cardekho variant not found locally

### Hector Plus

Cardekho variants: https://www.cardekho.com/mg/hector-plus/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `Savvy Pro 7-Str CVT` (₹19,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sharp Pro 7-Str` (₹17,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sharp Pro 7-Str CVT` (₹18,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Savvy Pro 7Str CVT` (₹19,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sharp Pro 7Str` (₹17,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sharp Pro 7Str CVT` (₹18,79,000)
  Note: Current Cardekho variant not found locally

### ZS EV

Cardekho variants: https://www.cardekho.com/mg/zs-ev/variants.htm
Rows to review: 13
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=11

- [ ] LOCAL_ONLY_VARIANT: local `Exclusive Pro` (₹20,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Standard` (₹17,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `100 Year Limited Edition` (₹19,49,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Essence` (₹20,49,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Essence DT` (₹20,49,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Essence DT` (₹17,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Excite Pro` (₹18,49,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Excite Pro` (₹19,49,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Exclusive Plus` (₹19,49,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Exclusive Plus DT` (₹19,49,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Exclusive Plus DT` (₹20,49,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Executive` (₹17,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Executive` (₹18,49,800)
  Note: Current Cardekho variant not found locally

## Mini

Pending models: 10
Pending rows: 10

### Cooper Convertible S

Cardekho variants: https://www.cardekho.com/mini/cooper-convertible/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Cooper Convertible S` (₹58,50,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Cooper S Classic Pack

Cardekho variants: https://www.cardekho.com/mini/cooper-s/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Cooper S Classic Pack` (₹49,15,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Cooper S Favoured Pack

Cardekho variants: https://www.cardekho.com/mini/cooper-s/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Cooper S Favoured Pack` (₹52,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Cooper S JCW Pack

Cardekho variants: https://www.cardekho.com/mini/cooper-s/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Cooper S JCW Pack` (₹54,40,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Cooper S STD

Cardekho variants: https://www.cardekho.com/mini/cooper-s/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Cooper S STD` (₹43,70,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Cooper SE Electric Premium

Cardekho variants: https://www.cardekho.com/mini/cooper-se/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Cooper SE Electric Premium` (₹55,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Cooper SE Electric Standard

Cardekho variants: https://www.cardekho.com/mini/cooper-se/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Cooper SE Electric Standard` (₹53,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Countryman Electric Favoured Pack

Cardekho variants: https://www.cardekho.com/mini/countryman-electric/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Countryman Electric Favoured Pack` (₹59,95,001) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Countryman Electric S

Cardekho variants: https://www.cardekho.com/mini/countryman-electric/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Countryman Electric S` (₹54,90,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### Countryman JCW

Cardekho variants: https://www.cardekho.com/mini/countryman/specs/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Countryman JCW` (₹64,90,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

## Nissan

Pending models: 1
Pending rows: 10

### Gravite

Cardekho variants: https://www.cardekho.com/nissan/gravite/variants.htm
Rows to review: 10
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=9

- [ ] LOCAL_ONLY_VARIANT: local `N-Trek` (₹8,45,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N-Connecta` (₹7,20,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N-Connecta` (₹7,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N-Connecta EZ Shift` (₹7,80,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `N-Connecta EZ Shift` (₹7,91,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Tekna EZ Shift` (₹8,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Tekna Launch Edition` (₹8,35,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Tekna Launch Edition` (₹8,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Tekna Launch Edition EZ Shift` (₹8,93,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Tekna Launch Edition EZ Shift` (₹9,40,000)
  Note: Current Cardekho variant not found locally

## Porsche

Pending models: 7
Pending rows: 48

### 911

Cardekho variants: https://www.cardekho.com/porsche/911/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Carrera S` (₹2,32,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `GT3` (₹3,50,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Turbo` (₹3,25,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Turbo 50 Years` (₹3,77,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Turbo 50 Years` (₹3,80,35,000)
  Note: Current Cardekho variant not found locally

### Cayenne

Cardekho variants: https://www.cardekho.com/porsche/cayenne/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Cayenne` (₹1,38,69,001) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Cayenne Coupe` (₹1,52,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Cayenne GTS` (₹1,94,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Cayenne S` (₹1,75,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTS` (₹1,94,17,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTS` (₹1,38,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹1,38,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹1,94,17,000)
  Note: Current Cardekho variant not found locally

### Cayenne Coupe

Cardekho variants: https://www.cardekho.com/porsche/cayenne-coupe/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Cayenne Coupe` (₹1,44,41,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Cayenne Coupe GTS` (₹1,95,41,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTS` (₹1,95,41,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTS` (₹1,44,41,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹1,44,41,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹1,95,41,000)
  Note: Current Cardekho variant not found locally

### Cayenne Electric

Cardekho variants: https://www.cardekho.com/porsche/cayenne-electric/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=3

- [ ] LOCAL_ONLY_VARIANT: local `Cayenne Electric` (₹1,75,68,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Cayenne Electric S` (₹2,25,92,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Standard` (₹1,76,18,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Standard` (₹2,26,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Turbo` (₹2,26,42,000)
  Note: Current Cardekho variant not found locally

### Macan EV

Cardekho variants: https://www.cardekho.com/porsche/macan-ev/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Macan Electric` (₹1,21,62,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Macan Electric 4S` (₹1,45,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Macan Electric Turbo` (₹1,68,62,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4S` (₹1,58,45,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4S` (₹1,73,27,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Standard` (₹1,21,62,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Standard` (₹1,58,45,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Turbo` (₹1,73,27,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Turbo` (₹1,21,62,000)
  Note: Current Cardekho variant not found locally

### Panamera

Cardekho variants: https://www.cardekho.com/porsche/panamera/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Panamera` (₹1,70,57,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Panamera GTS` (₹2,33,37,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTS` (₹2,33,37,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GTS` (₹1,70,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD Hybrid` (₹1,70,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD Hybrid` (₹2,33,37,000)
  Note: Current Cardekho variant not found locally

### Taycan

Cardekho variants: https://www.cardekho.com/porsche/taycan/variants.htm
Rows to review: 9
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Taycan` (₹1,69,78,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taycan 4S` (₹1,95,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taycan Turbo` (₹2,55,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4S` (₹1,96,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4S` (₹2,69,96,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹1,70,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹1,96,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Turbo` (₹2,69,96,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Turbo` (₹1,70,28,000)
  Note: Current Cardekho variant not found locally

## Renault

Pending models: 4
Pending rows: 94

### Duster

Cardekho variants: https://www.cardekho.com/renault/duster/variants.htm
Rows to review: 28
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=25

- [ ] LOCAL_ONLY_VARIANT: local `Duster Journey TCe 100 MT` (₹10,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Duster Techroad Plus TCe 160 CVT` (₹18,69,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Duster Techroad TCe 130 CVT` (₹13,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Authentic 1.0 Turbo` (₹10,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Authentic 1.0 Turbo` (₹11,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution 1.0 Turbo` (₹11,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution 1.0 Turbo` (₹12,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution 1.3 Turbo` (₹12,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution 1.3 Turbo` (₹13,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution 1.3 Turbo DCT` (₹14,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Iconic 1.3 Turbo` (₹16,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Iconic 1.3 Turbo DCT` (₹18,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Iconic 1.3 Turbo DT` (₹17,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Iconic 1.3 Turbo DT DCT` (₹18,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Iconic Launch Edition` (₹16,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Iconic Launch Edition` (₹17,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Iconic Launch Edition DCT` (₹18,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno 1.0 Turbo` (₹13,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno 1.3 Turbo` (₹14,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno 1.3 Turbo` (₹14,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno 1.3 Turbo DCT` (₹15,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno 1.3 Turbo DT` (₹14,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno 1.3 Turbo DT DCT` (₹16,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno Plus 1.3 Turbo` (₹15,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno Plus 1.3 Turbo DCT` (₹16,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno Plus 1.3 Turbo DT` (₹15,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno Plus 1.3 Turbo DT DCT` (₹16,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno Plus 1.3 Turbo DT DCT` (₹16,99,000)
  Note: Current Cardekho variant not found locally

### Kiger

Cardekho variants: https://www.cardekho.com/renault/kiger/variants.htm
Rows to review: 27
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=25

- [ ] LOCAL_ONLY_VARIANT: local `Kiger RXE 1.0 MT` (₹5,76,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kiger RXT 1.0 Turbo AMT` (₹7,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Authentic` (₹5,80,875)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Authentic` (₹6,54,075)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion` (₹8,41,575)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion` (₹8,62,575)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion DT` (₹8,62,575)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion DT` (₹9,33,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion Turbo` (₹9,33,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion Turbo CVT` (₹10,33,600)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion Turbo DT` (₹9,33,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion Turbo DT` (₹9,36,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution` (₹6,54,075)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution` (₹6,99,775)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution AMT` (₹6,99,775)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution AMT` (₹7,54,675)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno` (₹7,54,675)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno` (₹7,75,675)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno AMT` (₹8,00,375)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno AMT` (₹8,21,375)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno DT` (₹7,75,675)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno DT` (₹8,00,375)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno DT AMT` (₹8,21,375)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno DT AMT` (₹8,41,575)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno Turbo CVT` (₹9,36,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno Turbo DT CVT` (₹9,36,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno Turbo DT CVT` (₹10,33,600)
  Note: Current Cardekho variant not found locally

### Kwid

Cardekho variants: https://www.cardekho.com/renault/kwid/variants.htm
Rows to review: 23
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=20

- [ ] LOCAL_ONLY_VARIANT: local `Kwid Climber 1.0 AMT` (₹5,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kwid RXE 1.0` (₹4,29,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kwid RXT 1.0` (₹4,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0 CLIMBER` (₹5,47,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0 CLIMBER` (₹5,48,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0 CLIMBER AMT` (₹5,88,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0 CLIMBER AMT` (₹5,99,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0 CLIMBER DT` (₹5,58,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0 CLIMBER DT` (₹5,63,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0 CLIMBER DT AMT` (₹5,99,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Anniversary Edition` (₹5,14,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Anniversary Edition` (₹5,47,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Anniversary Edition AMT` (₹5,63,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Anniversary Edition AMT` (₹5,88,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Authentic` (₹4,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Authentic` (₹4,66,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution` (₹4,66,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution AMT` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno` (₹4,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno` (₹5,14,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno AMT` (₹5,48,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno AMT` (₹5,58,000)
  Note: Current Cardekho variant not found locally

### Triber

Cardekho variants: https://www.cardekho.com/renault/triber/variants.htm
Rows to review: 16
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=13

- [ ] LOCAL_ONLY_VARIANT: local `Triber RXE 1.0` (₹5,76,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Triber RXT 1.0` (₹6,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Triber RXZ 1.0 CVT` (₹8,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Authentic` (₹5,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Authentic` (₹6,63,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion` (₹7,91,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion` (₹8,12,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion AMT` (₹8,38,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion AMT` (₹8,59,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion AMT Dual Tone` (₹8,59,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion Dual Tone` (₹8,12,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Emotion Dual Tone` (₹8,38,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution` (₹6,63,200)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Evolution` (₹7,31,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno` (₹7,31,800)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Techno` (₹7,91,200)
  Note: Current Cardekho variant not found locally

## Rolls-Royce

Pending models: 3
Pending rows: 9

### Cullinan

Cardekho variants: https://www.cardekho.com/rolls-royce/cullinan/variants.htm
Rows to review: 4
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Base` (₹10,50,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Black Badge` (₹12,25,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Black Badge Series II` (₹12,25,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Series II` (₹10,50,00,000)
  Note: Current Cardekho variant not found locally

### Ghost Series II

Cardekho variants: https://www.cardekho.com/rolls-royce/ghost-series-ii/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Standard Wheelbase` (₹8,95,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Black Badge` (₹10,52,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Standard` (₹8,95,00,000)
  Note: Current Cardekho variant not found locally

### Phantom

Cardekho variants: https://www.cardekho.com/rolls-royce/phantom/variants.htm
Rows to review: 2
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=1

- [ ] LOCAL_ONLY_VARIANT: local `Standard Wheelbase` (₹8,99,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Series II` (₹8,99,00,001)
  Note: Current Cardekho variant not found locally

## Skoda

Pending models: 4
Pending rows: 81

### Kodiaq

Cardekho variants: https://www.cardekho.com/skoda/kodiaq/variants.htm
Rows to review: 11
Status mix: LOCAL_ONLY_VARIANT=5, CARDEKHO_ONLY_VARIANT=6

- [ ] LOCAL_ONLY_VARIANT: local `Kodiaq L&K 2.0 TSI DSG` (₹45,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kodiaq Lounge` (₹39,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kodiaq Selection 2.0 TSI DSG` (₹39,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kodiaq Selection L&K` (₹45,96,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kodiaq Sportline` (₹43,76,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lounge` (₹39,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Lounge` (₹43,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Selection L&K` (₹46,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Selection L&K` (₹39,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportline` (₹43,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Sportline` (₹46,49,000)
  Note: Current Cardekho variant not found locally

### Kushaq

Cardekho variants: https://www.cardekho.com/skoda/kushaq/variants.htm
Rows to review: 26
Status mix: LOCAL_ONLY_VARIANT=5, CARDEKHO_ONLY_VARIANT=21

- [ ] LOCAL_ONLY_VARIANT: local `Kushaq Active 1.0 TSI MT` (₹10,69,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kushaq Ambition 1.0 TSI AT` (₹13,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kushaq Ambition 1.0 TSI MT` (₹12,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kushaq Prestige 1.5 TSI DSG` (₹18,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kushaq Style 1.5 TSI MT` (₹15,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Classic Plus` (₹10,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Classic Plus` (₹12,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Classic Plus AT` (₹12,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Classic Plus AT` (₹14,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Monte Carlo AT` (₹17,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Monte Carlo AT` (₹18,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Prestige` (₹16,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Prestige` (₹17,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Prestige AT` (₹17,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Prestige AT` (₹17,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Signature` (₹14,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Signature` (₹14,74,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Signature AT` (₹15,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Signature AT` (₹15,74,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Sportline` (₹14,74,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Sportline` (₹15,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Sportline AT` (₹15,74,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Sportline AT` (₹16,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.5L Monte Carlo DSG` (₹18,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.5L Prestige DSG` (₹18,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.5L Prestige DSG` (₹18,99,000)
  Note: Current Cardekho variant not found locally

### Kylaq

Cardekho variants: https://www.cardekho.com/skoda/kylaq/variants.htm
Rows to review: 25
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=21

- [ ] LOCAL_ONLY_VARIANT: local `Kylaq Classic 1.0 TSI MT` (₹7,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kylaq Prestige 1.0 TSI AT` (₹12,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kylaq Signature 1.0 TSI MT` (₹8,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Kylaq Signature Plus 1.0 TSI AT` (₹10,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Classic` (₹7,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Classic` (₹8,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Classic Plus` (₹8,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Classic Plus` (₹9,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Classic Plus AT` (₹9,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Classic Plus AT` (₹9,43,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Prestige` (₹11,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Prestige` (₹11,77,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Prestige AT` (₹12,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Prestige AT` (₹12,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Prestige Plus` (₹11,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Prestige Plus` (₹12,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Prestige Plus AT` (₹12,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature` (₹9,43,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature` (₹10,43,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature AT` (₹10,43,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature AT` (₹10,77,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Plus` (₹10,77,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Plus` (₹11,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Plus AT` (₹11,77,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Signature Plus AT` (₹11,99,000)
  Note: Current Cardekho variant not found locally

### Slavia

Cardekho variants: https://www.cardekho.com/skoda/slavia/variants.htm
Rows to review: 19
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Slavia Active 1.0 TSI MT` (₹9,99,900) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Slavia Ambition 1.0 TSI AT` (₹12,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Slavia Sportline 1.5 TSI DSG` (₹17,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Classic` (₹9,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Classic` (₹13,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Monte Carlo` (₹14,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Monte Carlo AT` (₹16,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Prestige` (₹14,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Prestige AT` (₹16,43,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Signature` (₹13,28,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Signature` (₹13,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Signature AT` (₹14,34,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Sportline` (₹13,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Sportline` (₹14,34,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Sportline AT` (₹14,55,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.0L Sportline AT` (₹14,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.5L Monte Carlo DSG` (₹17,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.5L Prestige DSG` (₹17,93,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1.5L Sportline DSG` (₹16,19,000)
  Note: Current Cardekho variant not found locally

## Tata

Pending models: 18
Pending rows: 754

### Altroz

Cardekho variants: https://www.cardekho.com/tata/altroz/variants.htm
Rows to review: 63
Status mix: LOCAL_ONLY_VARIANT=21, CARDEKHO_ONLY_VARIANT=42

- [ ] LOCAL_ONLY_VARIANT: local `Altroz Accomplished S` (₹9,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Accomplished S CNG` (₹10,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Accomplished S DCA` (₹10,28,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Accomplished S Diesel` (₹10,17,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Creative` (₹7,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Creative AMT` (₹8,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Creative CNG` (₹8,96,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Creative S` (₹8,28,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Creative S AMT` (₹8,83,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Creative S CNG` (₹9,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Creative S DCA` (₹9,42,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Creative S Diesel` (₹9,32,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Pure` (₹7,04,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Pure AMT` (₹7,58,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Pure CNG` (₹8,04,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Pure Diesel` (₹8,10,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Pure S` (₹7,36,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Pure S AMT` (₹7,91,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Pure S CNG` (₹8,37,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Smart` (₹6,30,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Altroz Smart CNG` (₹7,22,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S` (₹9,21,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S` (₹9,26,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S CNG` (₹10,21,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S CNG` (₹10,26,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S DCA` (₹10,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S DCA` (₹10,61,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Diesel` (₹10,26,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Diesel` (₹10,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative` (₹8,01,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative` (₹8,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative AMT` (₹8,56,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative AMT` (₹8,91,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative CNG` (₹9,01,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative CNG` (₹9,21,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S` (₹8,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S` (₹8,41,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S AMT` (₹8,91,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S AMT` (₹9,01,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S CNG` (₹9,26,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S CNG` (₹9,41,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S DCA` (₹9,51,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S DCA` (₹10,21,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S Diesel` (₹9,41,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S Diesel` (₹9,51,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure` (₹7,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure` (₹7,29,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure AMT` (₹7,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure AMT` (₹7,96,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure CNG` (₹8,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure CNG` (₹8,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Diesel` (₹8,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Diesel` (₹8,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure S` (₹7,41,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure S` (₹7,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure S AMT` (₹7,96,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure S AMT` (₹8,01,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure S CNG` (₹8,41,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure S CNG` (₹8,56,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹6,29,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹7,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart CNG` (₹7,29,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart CNG` (₹7,41,990)
  Note: Current Cardekho variant not found locally

### Curvv

Cardekho variants: https://www.cardekho.com/tata/curvv/variants.htm
Rows to review: 70
Status mix: LOCAL_ONLY_VARIANT=10, CARDEKHO_ONLY_VARIANT=60

- [ ] LOCAL_ONLY_VARIANT: local `Curvv Accomplished Plus A Dark Diesel DCT` (₹18,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv Accomplished Plus A Diesel DCT` (₹18,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv Accomplished Plus A Petrol DCT` (₹17,20,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv Creative Diesel DCT` (₹14,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv Creative Petrol DCT` (₹13,30,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv Creative Plus S Petrol DCT` (₹14,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv Smart Diesel MT` (₹11,10,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv Smart Petrol MT` (₹9,66,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv Smart Plus Diesel MT` (₹11,60,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv Smart Plus Petrol MT` (₹10,10,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus A Dark Diesel` (₹17,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus A Dark Diesel DCA` (₹19,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus A Diesel` (₹17,44,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus A Diesel DCA` (₹18,89,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus A Hyperion` (₹17,24,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus A Hyperion Dark` (₹17,44,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus A Hyperion Dark DCA` (₹18,94,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus A Hyperion DCA` (₹18,74,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S` (₹14,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S` (₹14,84,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Dark Diesel` (₹16,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Dark Diesel DCA` (₹17,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S DCA` (₹16,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Diesel` (₹16,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Diesel DCA` (₹17,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Hyperion` (₹15,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Hyperion Dark` (₹15,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Hyperion Dark` (₹16,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Hyperion Dark DCA` (₹17,49,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished S Hyperion DCA` (₹17,29,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative` (₹12,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative` (₹12,49,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative DCA` (₹13,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Diesel` (₹13,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S` (₹13,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S` (₹13,84,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S DCA` (₹16,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Diesel` (₹15,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Diesel DCA` (₹16,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Hyperion` (₹14,84,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Hyperion` (₹15,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Hyperion DCA` (₹15,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Hyperion DCA` (₹15,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S` (₹12,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S` (₹13,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S DCA` (₹14,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S Diesel` (₹14,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S Diesel` (₹14,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S Diesel DCA` (₹15,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S Diesel DCA` (₹15,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S Hyperion` (₹13,84,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative S Hyperion` (₹13,94,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus` (₹10,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus` (₹11,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus DCA` (₹12,49,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus Diesel` (₹12,49,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus Diesel` (₹12,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus Diesel DCA` (₹13,94,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus Diesel DCA` (₹14,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S` (₹11,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S` (₹12,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S DCA` (₹13,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S DCA` (₹13,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S Diesel` (₹13,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S Diesel DCA` (₹14,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S Diesel DCA` (₹14,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹9,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹10,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Diesel` (₹11,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Diesel` (₹11,64,990)
  Note: Current Cardekho variant not found locally

### Curvv EV

Cardekho variants: https://www.cardekho.com/tata/curvv-ev/variants.htm
Rows to review: 24
Status mix: LOCAL_ONLY_VARIANT=8, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Curvv EV Accomplished 45` (₹18,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv EV Accomplished 55` (₹19,25,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv EV Accomplished Plus S 45` (₹19,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv EV Accomplished Plus S 55` (₹19,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv EV Creative 45` (₹17,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv EV Empowered Plus 55` (₹21,25,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv EV Empowered Plus A 55` (₹21,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Curvv EV Empowered Plus A 55 Dark` (₹22,24,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished 45` (₹18,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished 45` (₹19,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished 55` (₹19,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished 55` (₹19,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S 45` (₹19,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S 45` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S 55` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S 55` (₹21,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative 45` (₹17,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative 45` (₹18,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus 55` (₹21,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus 55` (₹21,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus A 55` (₹21,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus A 55` (₹22,24,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus A 55 Dark` (₹22,24,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus A 55 Dark` (₹17,49,000)
  Note: Current Cardekho variant not found locally

### Harrier

Cardekho variants: https://www.cardekho.com/tata/harrier/variants.htm
Rows to review: 69
Status mix: LOCAL_ONLY_VARIANT=5, CARDEKHO_ONLY_VARIANT=64

- [ ] LOCAL_ONLY_VARIANT: local `Harrier Petrol Adventure X Plus` (₹17,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier Petrol Pure X` (₹16,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier Petrol Pure X DARK` (₹16,63,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier Petrol Smart` (₹12,89,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier Smart` (₹14,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X` (₹18,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X` (₹18,44,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X AT` (₹19,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X AT` (₹19,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Dark` (₹18,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Dark AT` (₹20,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Plus` (₹18,44,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Plus AT` (₹19,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Plus Dark` (₹18,94,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Plus Dark` (₹19,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Plus Dark AT` (₹20,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X` (₹21,24,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X` (₹21,78,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X AT` (₹22,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X AT` (₹23,24,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X Dark` (₹21,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X Dark AT` (₹23,39,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X Plus` (₹23,24,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X Plus AT` (₹24,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X Plus Dark` (₹23,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X Plus Dark AT` (₹25,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless X Plus Stealth` (₹23,94,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X AT` (₹18,47,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X AT` (₹18,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X DARK` (₹17,38,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X DARK` (₹17,53,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X DARK AT` (₹18,89,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus` (₹17,13,590)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus` (₹17,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus AT` (₹18,74,390)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus DARK` (₹17,65,590)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus DARK` (₹17,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus DARK AT` (₹19,26,390)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus DARK AT` (₹19,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless Ultra` (₹22,71,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless Ultra` (₹22,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless Ultra AT` (₹24,13,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless Ultra Red DARK` (₹23,26,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless Ultra Red DARK AT` (₹24,68,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X` (₹19,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X AT` (₹21,78,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X AT` (₹21,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X DARK` (₹20,65,390)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X DARK` (₹21,24,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X DARK AT` (₹22,30,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X Plus` (₹22,11,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X Plus AT` (₹23,53,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X Plus DARK` (₹22,63,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Fearless X Plus DARK AT` (₹24,05,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X` (₹15,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X` (₹16,63,390)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X AT` (₹17,53,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X DARK` (₹16,63,390)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X DARK` (₹16,86,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X DARK AT` (₹17,91,090)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X DARK AT` (₹18,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Smart` (₹12,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Smart` (₹13,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure X AT` (₹18,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure X AT` (₹18,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure X Dark` (₹17,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure X Dark AT` (₹19,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹13,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹15,99,990)
  Note: Current Cardekho variant not found locally

### Harrier EV

Cardekho variants: https://www.cardekho.com/tata/harrier-ev/variants.htm
Rows to review: 39
Status mix: LOCAL_ONLY_VARIANT=7, CARDEKHO_ONLY_VARIANT=32

- [ ] LOCAL_ONLY_VARIANT: local `Harrier EV Adventure 65` (₹21,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier EV Adventure Plus 65` (₹22,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier EV Empowered 75` (₹26,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier EV Empowered Plus QWD 75` (₹30,23,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier EV Empowered QWD 75` (₹28,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier EV Fearless 75` (₹25,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Harrier EV Fearless Plus 75` (₹24,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure 65` (₹21,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure 65` (₹21,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure 65 ACFC` (₹21,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure 65 ACFC` (₹21,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S 65` (₹21,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S 65` (₹22,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S 65 ACFC` (₹22,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S 65 ACFC` (₹23,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered 75` (₹27,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered 75` (₹27,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered 75 ACFC` (₹27,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered 75 ACFC` (₹28,24,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered 75 Stealth` (₹28,24,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered 75 Stealth ACFC` (₹28,73,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered 75 Stealth ACFC` (₹28,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered QWD 75` (₹28,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered QWD 75` (₹29,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered QWD 75 ACFC` (₹29,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered QWD 75 Stealth` (₹29,74,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered QWD 75 Stealth ACFC` (₹30,23,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered QWD 75 Stealth ACFC` (₹21,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus 65` (₹23,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus 65` (₹24,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus 65 ACFC` (₹24,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus 65 ACFC` (₹24,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus 75` (₹24,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus 75` (₹25,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus 75 ACFC` (₹25,48,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus 75 ACFC` (₹26,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus QWD 75` (₹26,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus QWD 75 ACFC` (₹26,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus QWD 75 ACFC` (₹27,49,000)
  Note: Current Cardekho variant not found locally

### Nexon

Cardekho variants: https://www.cardekho.com/tata/nexon/variants.htm
Rows to review: 135
Status mix: LOCAL_ONLY_VARIANT=40, CARDEKHO_ONLY_VARIANT=95

- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative` (₹10,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative AMT` (₹11,30,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative Diesel` (₹11,89,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative Plus DCT` (₹12,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative Plus S` (₹11,10,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative Plus S DCT` (₹12,30,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative Plus S Diesel DCT` (₹13,69,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative S` (₹11,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative S CNG` (₹11,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative S Diesel` (₹12,39,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Creative S Diesel AMT` (₹13,19,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Fearless CNG` (₹13,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Fearless DCT` (₹13,10,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Fearless Diesel AMT` (₹13,89,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Fearless Plus CNG` (₹13,70,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Fearless Plus DCT` (₹13,40,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Fearless Plus PS DCT` (₹13,82,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Fearless Plus PS Diesel AMT` (₹14,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Fearless Plus PS Diesel AMT Red Dark` (₹14,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Fearless Plus PS Red Dark DCT` (₹14,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Pure Plus` (₹8,87,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Pure Plus AMT` (₹9,87,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Pure Plus CNG` (₹10,07,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Pure Plus Diesel` (₹10,57,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Pure Plus Diesel AMT` (₹11,37,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Pure Plus S` (₹9,37,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Pure Plus S AMT` (₹10,37,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Pure Plus S Diesel` (₹11,07,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Pure Plus S Diesel AMT` (₹11,87,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart` (₹7,32,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart AMT` (₹8,32,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart CNG` (₹8,23,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart Diesel` (₹9,01,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart Plus` (₹8,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart Plus AMT` (₹8,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart Plus CNG` (₹8,93,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart Plus Diesel` (₹9,70,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart Plus Diesel AMT` (₹10,60,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart Plus S` (₹8,43,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon Smart Plus S AMT` (₹9,33,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative` (₹9,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative` (₹10,27,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative AMT` (₹10,74,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative AMT` (₹10,76,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative DCA` (₹11,24,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Diesel` (₹11,24,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Diesel` (₹11,25,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS Dark` (₹11,71,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS Dark` (₹11,84,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS Dark CNG` (₹12,53,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS Dark CNG` (₹12,81,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS Dark DCA` (₹12,81,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS Dark Diesel` (₹12,81,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS Dark Diesel AMT` (₹13,46,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS DT` (₹11,25,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS DT` (₹11,46,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS DT CNG` (₹12,16,690)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS DT CNG` (₹12,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS DT DCA` (₹12,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS DT Diesel` (₹12,41,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS DT Diesel` (₹12,44,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS DT Diesel AMT` (₹13,06,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus PS DT Diesel AMT` (₹13,08,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S` (₹10,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S` (₹10,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S AMT` (₹11,04,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S AMT` (₹11,24,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S CNG` (₹11,25,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Dark` (₹10,76,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Dark` (₹11,04,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Dark AMT` (₹11,46,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Dark AMT` (₹11,49,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Dark CNG` (₹11,61,790)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Dark CNG` (₹11,71,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Dark Diesel` (₹11,86,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Dark Diesel AMT` (₹12,51,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Diesel` (₹11,49,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Diesel` (₹11,61,790)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Diesel AMT` (₹12,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus S Diesel AMT` (₹12,16,690)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus A PS Dark DCA` (₹14,01,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus A PS DT DCA` (₹13,53,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus A PS Red Dark DCA` (₹13,81,790)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Dark` (₹12,46,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Dark CNG` (₹13,26,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Dark DCA` (₹13,44,790)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Dark Diesel` (₹13,56,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Dark Diesel AMT` (₹14,21,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS DT` (₹13,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS DT CNG` (₹13,08,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS DT CNG` (₹13,24,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS DT DCA` (₹13,26,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS DT DCA` (₹13,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS DT Diesel` (₹13,24,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS DT Diesel` (₹13,26,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS DT Diesel AMT` (₹14,01,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Red Dark` (₹12,44,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Red Dark` (₹12,46,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Red Dark CNG` (₹13,41,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Red Dark CNG` (₹13,44,790)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Red Dark Diesel` (₹13,52,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus PS Red Dark Diesel AMT` (₹14,15,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus` (₹8,94,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus` (₹8,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus AMT` (₹9,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus AMT` (₹9,84,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus CNG` (₹9,84,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus CNG` (₹9,87,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus Diesel` (₹9,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus Diesel AMT` (₹10,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus Diesel AMT` (₹10,74,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S` (₹9,22,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S` (₹9,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S AMT` (₹9,87,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S AMT` (₹9,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S Diesel` (₹10,27,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S Diesel` (₹10,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹7,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹8,06,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart CNG` (₹8,29,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart CNG` (₹8,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus` (₹8,06,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus` (₹8,29,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus AMT` (₹8,81,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus AMT` (₹8,94,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus CNG` (₹9,14,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus CNG` (₹9,22,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus Diesel` (₹8,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus Diesel` (₹9,14,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus S` (₹8,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus S` (₹8,81,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus S CNG` (₹9,42,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus S CNG` (₹9,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus S Diesel` (₹9,36,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus S Diesel` (₹9,42,290)
  Note: Current Cardekho variant not found locally

### Nexon EV

Cardekho variants: https://www.cardekho.com/tata/nexon-ev/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=14, CARDEKHO_ONLY_VARIANT=22

- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Creative 45` (₹14,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Creative MR` (₹11,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Creative Plus 45` (₹14,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Creative Plus MR` (₹12,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Creative Plus S MR` (₹12,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Empowered 45` (₹15,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Empowered MR` (₹14,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Empowered Plus A 45` (₹16,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Empowered Plus A 45 Red Dark` (₹17,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Empowered Plus MR` (₹15,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Fearless 45` (₹14,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Fearless MR` (₹13,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Fearless Plus S 45` (₹15,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Nexon EV Fearless Plus S MR` (₹14,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative 45` (₹13,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative 45` (₹14,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus MR` (₹12,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Creative Plus MR` (₹13,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered LR` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered LR` (₹16,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered MR` (₹14,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered MR` (₹14,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus 45 Red Dark` (₹17,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus A 45` (₹17,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus A 45` (₹17,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus A 45 Dark` (₹17,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus A 45 Red Dark` (₹17,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus A 45 Red Dark` (₹12,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless 45` (₹14,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless 45` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless MR` (₹13,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless MR` (₹13,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus MR` (₹13,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus MR` (₹13,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus S MR` (₹14,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Fearless Plus S MR` (₹14,79,000)
  Note: Current Cardekho variant not found locally

### Punch

Cardekho variants: https://www.cardekho.com/tata/punch/variants.htm
Rows to review: 72
Status mix: LOCAL_ONLY_VARIANT=24, CARDEKHO_ONLY_VARIANT=48

- [ ] LOCAL_ONLY_VARIANT: local `Punch Accomplished AMT` (₹8,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Accomplished CNG` (₹9,30,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Accomplished Plus S` (₹9,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Accomplished Plus S AMT` (₹9,55,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Accomplished Plus S Turbo` (₹9,80,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Adventure` (₹7,60,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Adventure AMT` (₹8,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Adventure CNG` (₹8,60,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Adventure CNG AMT` (₹9,15,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Adventure S` (₹7,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Adventure S CNG` (₹8,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Adventure S CNG AMT` (₹9,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Adventure Turbo` (₹8,30,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Pure` (₹6,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Pure CNG` (₹7,50,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Pure Plus` (₹7,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Pure Plus AMT` (₹7,55,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Pure Plus CNG` (₹8,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Pure Plus CNG AMT` (₹8,55,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Pure Plus S` (₹7,35,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Pure Plus S AMT` (₹7,90,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Pure Plus S CNG` (₹8,35,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Smart` (₹5,60,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch Smart CNG` (₹6,70,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished AMT` (₹8,89,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished AMT` (₹8,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished CNG` (₹9,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished CNG` (₹9,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S` (₹9,04,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S` (₹9,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S AMT` (₹9,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S AMT` (₹9,84,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S Turbo` (₹9,84,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus S Turbo` (₹10,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure` (₹7,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure` (₹7,94,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure AMT` (₹8,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure AMT` (₹8,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure CNG` (₹8,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure CNG` (₹8,89,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure CNG AMT` (₹9,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure CNG AMT` (₹9,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S` (₹7,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S` (₹8,04,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S CNG` (₹8,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S CNG` (₹9,04,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S CNG AMT` (₹9,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure S CNG AMT` (₹9,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Turbo` (₹8,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Turbo` (₹8,39,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure` (₹6,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure` (₹6,74,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure CNG` (₹7,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure CNG` (₹7,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus` (₹7,04,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus` (₹7,39,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus AMT` (₹7,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus AMT` (₹7,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus CNG` (₹8,04,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus CNG` (₹8,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus CNG AMT` (₹8,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus CNG AMT` (₹8,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S` (₹7,39,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S` (₹7,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S AMT` (₹7,94,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S AMT` (₹7,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S CNG` (₹8,39,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus S CNG` (₹8,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹5,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart` (₹6,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart CNG` (₹6,74,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart CNG` (₹7,04,990)
  Note: Current Cardekho variant not found locally

### Punch EV

Cardekho variants: https://www.cardekho.com/tata/punch-ev/variants.htm
Rows to review: 18
Status mix: LOCAL_ONLY_VARIANT=6, CARDEKHO_ONLY_VARIANT=12

- [ ] LOCAL_ONLY_VARIANT: local `Punch EV Adventure 40` (₹11,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch EV Adventure Plus 40` (₹11,79,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch EV Empowered Plus 40` (₹12,39,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch EV Empowered Plus S 40` (₹12,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch EV Smart 30` (₹9,69,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Punch EV Smart Plus 30` (₹9,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure 40kWh` (₹11,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure 40kWh` (₹12,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered 40kWh` (₹12,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered 40kWh` (₹12,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus S 40kWh` (₹12,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Empowered Plus S 40kWh` (₹9,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart 30kWh` (₹9,69,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart 30kWh` (₹10,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus 30kWh` (₹10,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus 30kWh` (₹10,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus 40kWh` (₹10,89,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus 40kWh` (₹11,59,000)
  Note: Current Cardekho variant not found locally

### Safari

Cardekho variants: https://www.cardekho.com/tata/safari/variants.htm
Rows to review: 63
Status mix: LOCAL_ONLY_VARIANT=9, CARDEKHO_ONLY_VARIANT=54

- [ ] LOCAL_ONLY_VARIANT: local `Safari Accomplished Plus Diesel AT` (₹22,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Safari Accomplished Plus Petrol AT` (₹20,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Safari Accomplished Ultra 6S Diesel AT` (₹25,96,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Safari Accomplished X Plus 6S Petrol AT` (₹21,79,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Safari Adventure Diesel AT` (₹19,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Safari Adventure Petrol AT` (₹17,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Safari Adventure X Plus Petrol AT` (₹18,79,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Safari Smart Plus Diesel MT` (₹15,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Safari Smart Plus Petrol MT` (₹13,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X` (₹21,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X AT` (₹23,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Dark` (₹22,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Dark AT` (₹24,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus` (₹23,89,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus 6S` (₹23,99,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus 6S AT` (₹25,44,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus 6S Dark` (₹24,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus 6S Dark AT` (₹25,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus 6S Stealth AT` (₹26,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus AT` (₹25,34,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus Dark` (₹24,24,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus Dark AT` (₹25,69,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus Stealth` (₹24,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished X Plus Stealth AT` (₹26,04,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Plus AT` (₹20,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Plus Dark` (₹19,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure X Plus Dark AT` (₹21,14,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished Ultra` (₹23,33,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished Ultra 6S` (₹23,42,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished Ultra 6S AT` (₹24,84,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished Ultra AT` (₹24,75,390)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished Ultra Red DARK` (₹23,68,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished Ultra Red DARK 6S` (₹23,77,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished Ultra Red DARK 6S AT` (₹25,19,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished Ultra Red DARK AT` (₹25,10,390)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X` (₹20,84,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X AT` (₹22,49,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X DARK` (₹21,36,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X DARK AT` (₹23,01,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X Plus` (₹22,73,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X Plus 6S` (₹22,82,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X Plus 6S AT` (₹24,24,890)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X Plus 6S DARK` (₹23,16,090)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X Plus 6S DARK AT` (₹24,57,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X Plus AT` (₹24,15,390)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X Plus DARK` (₹23,06,590)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Accomplished X Plus DARK AT` (₹24,48,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus` (₹17,75,090)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus AT` (₹19,35,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus DARK` (₹18,27,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Adventure X Plus DARK AT` (₹19,88,090)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X` (₹16,49,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X AT` (₹17,91,090)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X AT` (₹18,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X DARK` (₹17,01,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X DARK` (₹17,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Pure X DARK AT` (₹18,52,590)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Smart` (₹13,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol Smart` (₹14,74,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure X` (₹17,64,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure X AT` (₹19,09,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure X Dark` (₹18,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure X Dark AT` (₹19,69,990)
  Note: Current Cardekho variant not found locally

### Sierra

Cardekho variants: https://www.cardekho.com/tata/sierra/variants.htm
Rows to review: 36
Status mix: LOCAL_ONLY_VARIANT=5, CARDEKHO_ONLY_VARIANT=31

- [ ] LOCAL_ONLY_VARIANT: local `Sierra Adventure` (₹15,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sierra Pure` (₹12,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sierra Pure Diesel` (₹14,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sierra Smart Plus` (₹11,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Sierra Smart Plus Diesel` (₹12,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished` (₹17,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Diesel` (₹18,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Diesel AT` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus Diesel` (₹20,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Plus Turbo` (₹20,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Accomplished Turbo` (₹19,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure` (₹15,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure DCA` (₹16,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure DCA` (₹17,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Diesel` (₹16,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Diesel` (₹16,79,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Plus` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Plus Diesel` (₹17,19,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Plus Diesel` (₹17,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Plus Diesel AT` (₹18,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Plus Diesel AT` (₹18,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Adventure Plus Turbo` (₹17,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure` (₹12,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure` (₹14,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Diesel` (₹14,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Diesel` (₹15,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Diesel AT` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Diesel AT` (₹16,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus DCA` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus DIesel` (₹15,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus Diesel AT` (₹17,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Pure Plus Diesel AT` (₹17,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus` (₹11,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus` (₹12,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Smart Plus Diesel` (₹12,99,000)
  Note: Current Cardekho variant not found locally

### Tiago

Cardekho variants: https://www.cardekho.com/tata/tiago/variants.htm
Rows to review: 38
Status mix: LOCAL_ONLY_VARIANT=13, CARDEKHO_ONLY_VARIANT=25

- [ ] LOCAL_ONLY_VARIANT: local `Tiago XE` (₹4,57,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XE CNG` (₹5,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XM` (₹5,31,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XM CNG` (₹6,22,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XT` (₹5,81,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XT CNG` (₹6,72,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XTA AMT` (₹6,31,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XTA AMT CNG` (₹7,23,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XZ` (₹6,40,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XZ CNG` (₹7,32,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XZ Plus` (₹6,77,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XZA AMT` (₹6,91,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago XZA AMT CNG` (₹7,82,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XE` (₹4,59,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XE` (₹5,35,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XE CNG` (₹5,53,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XE CNG` (₹5,85,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XM` (₹5,35,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XM` (₹5,53,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XM CNG` (₹6,29,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XM CNG` (₹6,37,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT` (₹5,85,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT` (₹6,29,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT CNG` (₹6,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT CNG` (₹6,82,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XTA AMT` (₹6,37,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XTA AMT` (₹6,45,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XTA AMT CNG` (₹7,31,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XTA AMT CNG` (₹7,39,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ` (₹6,45,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ` (₹6,79,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ CNG` (₹7,39,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ CNG` (₹7,82,190)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus` (₹6,82,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus` (₹6,90,790)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT` (₹6,90,790)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT` (₹7,31,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT CNG` (₹7,82,190)
  Note: Current Cardekho variant not found locally

### Tiago EV

Cardekho variants: https://www.cardekho.com/tata/tiago-ev/variants.htm
Rows to review: 15
Status mix: LOCAL_ONLY_VARIANT=7, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Tiago EV XE MR` (₹7,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago EV XT LR` (₹9,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago EV XT MR` (₹8,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago EV XZ MR` (₹9,79,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago EV XZ Plus LR` (₹10,69,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago EV XZ Plus Tech LUX LR` (₹11,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago EV XZ Plus Tech LUX MR` (₹10,79,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XE MR` (₹7,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XE MR` (₹8,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT LR` (₹10,14,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT LR` (₹11,14,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT MR` (₹8,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT MR` (₹10,14,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus Tech LUX LR` (₹11,14,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus Tech LUX LR` (₹7,99,000)
  Note: Current Cardekho variant not found locally

### Tiago NRG

Cardekho variants: https://www.cardekho.com/tata/tiago-nrg/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=5

- [ ] LOCAL_ONLY_VARIANT: local `Tiago NRG XZ iCNG MT` (₹7,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago NRG XZA iCNG AMT` (₹8,10,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tiago NRG XZA Petrol AMT` (₹7,18,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ CNG` (₹7,67,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ CNG` (₹8,19,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT` (₹7,25,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT` (₹7,67,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT CNG` (₹8,19,990)
  Note: Current Cardekho variant not found locally

### Tigor

Cardekho variants: https://www.cardekho.com/tata/tigor/variants.htm
Rows to review: 41
Status mix: LOCAL_ONLY_VARIANT=14, CARDEKHO_ONLY_VARIANT=27

- [ ] LOCAL_ONLY_VARIANT: local `Tigor XM` (₹5,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XT` (₹6,22,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XT CNG` (₹7,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XTA AMT` (₹6,72,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZ` (₹6,77,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZ CNG` (₹7,68,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZ Plus` (₹7,32,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZ Plus CNG` (₹8,23,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZ Plus Lux` (₹7,78,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZ Plus Lux CNG` (₹8,69,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZA AMT` (₹7,27,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZA AMT CNG` (₹8,19,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZA Plus AMT` (₹7,82,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor XZA Plus AMT CNG` (₹8,74,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XM` (₹5,54,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XM` (₹6,27,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT` (₹6,27,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT` (₹6,72,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT CNG` (₹7,21,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT CNG` (₹7,27,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XTA AMT` (₹6,72,490)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XTA AMT` (₹6,82,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ` (₹6,82,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ` (₹7,21,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ CNG` (₹7,76,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ CNG` (₹7,82,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus` (₹7,37,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus` (₹7,76,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus CNG` (₹8,31,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus CNG` (₹8,76,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus Lux` (₹7,82,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus Lux` (₹7,89,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus Lux CNG` (₹8,76,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus Lux CNG` (₹8,83,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT` (₹7,27,290)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT` (₹7,37,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT CNG` (₹8,28,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA AMT CNG` (₹8,31,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA Plus AMT` (₹7,89,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA Plus AMT` (₹8,28,990)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZA Plus AMT CNG` (₹8,83,990)
  Note: Current Cardekho variant not found locally

### Tigor EV

Cardekho variants: https://www.cardekho.com/tata/tigor-ev/variants.htm
Rows to review: 12
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Tigor EV XE` (₹12,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor EV XT` (₹12,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor EV XZ Plus` (₹13,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Tigor EV XZ Plus LUX` (₹13,75,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XE` (₹12,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XE` (₹12,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT` (₹12,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XT` (₹13,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus` (₹13,49,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus` (₹13,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus LUX` (₹13,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `XZ Plus LUX` (₹12,49,000)
  Note: Current Cardekho variant not found locally

### Xpres

Cardekho variants: https://www.cardekho.com/tata/xpres/variants.htm
Rows to review: 3
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=2

- [ ] LOCAL_ONLY_VARIANT: local `Xpres Petrol` (₹5,59,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol` (₹5,59,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Petrol` (₹6,49,000)
  Note: Current Cardekho variant not found locally

### Yodha Pickup

Cardekho variants: https://www.cardekho.com/tata/yodha-pickup/variants.htm
Rows to review: 12
Status mix: LOCAL_ONLY_VARIANT=4, CARDEKHO_ONLY_VARIANT=8

- [ ] LOCAL_ONLY_VARIANT: local `Yodha Pickup 1200` (₹9,51,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Yodha Pickup 1700` (₹9,55,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Yodha Pickup Crew Cabin 4x2` (₹9,52,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Yodha Pickup Crew Cabin 4x4` (₹10,71,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1500` (₹7,10,160)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `1500` (₹7,49,548)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4x4` (₹7,49,548)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4x4` (₹6,94,637)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Crew Cabin` (₹7,09,348)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Crew Cabin` (₹7,10,160)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Eco` (₹6,94,637)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Eco` (₹7,09,348)
  Note: Current Cardekho variant not found locally

## Toyota

Pending models: 10
Pending rows: 147

### Fortuner

Cardekho variants: https://www.cardekho.com/toyota/fortuner/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Fortuner 4X2 Diesel AT` (₹36,96,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Fortuner 4X4 Diesel` (₹38,68,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4X2 Diesel AT` (₹37,61,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4X2 Diesel AT` (₹39,35,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4X4 Diesel` (₹39,35,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `4X4 Diesel` (₹43,12,000)
  Note: Current Cardekho variant not found locally

### Glanza

Cardekho variants: https://www.cardekho.com/toyota/glanza/variants.htm
Rows to review: 24
Status mix: LOCAL_ONLY_VARIANT=8, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Glanza E` (₹6,46,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Glanza G` (₹8,29,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Glanza G AMT` (₹8,86,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Glanza G CNG` (₹9,14,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Glanza S` (₹7,34,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Glanza S AMT` (₹7,91,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Glanza S CNG` (₹8,17,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Glanza V` (₹9,12,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹6,46,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹7,34,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G` (₹8,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G` (₹8,86,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G AMT` (₹8,86,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G AMT` (₹9,12,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G CNG` (₹9,14,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G CNG` (₹9,64,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹7,34,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹7,91,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S AMT` (₹7,91,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S AMT` (₹8,17,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S CNG` (₹8,17,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S CNG` (₹8,29,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V` (₹9,12,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V` (₹9,14,000)
  Note: Current Cardekho variant not found locally

### Hilux

Cardekho variants: https://www.cardekho.com/toyota/hilux/variants.htm
Rows to review: 8
Status mix: LOCAL_ONLY_VARIANT=3, CARDEKHO_ONLY_VARIANT=5

- [ ] LOCAL_ONLY_VARIANT: local `Hilux High` (₹34,67,300) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Hilux High AT` (₹35,37,300) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Hilux STD` (₹28,02,400) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `High` (₹35,30,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `High` (₹36,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `High AT` (₹36,00,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹28,52,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `STD` (₹35,30,000)
  Note: Current Cardekho variant not found locally

### Innova Crysta

Cardekho variants: https://www.cardekho.com/toyota/innova-crysta/variants.htm
Rows to review: 23
Status mix: LOCAL_ONLY_VARIANT=7, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Innova Crysta 2.4 GX 7-Str` (₹18,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Innova Crysta 2.4 GX 8-Str` (₹18,85,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Innova Crysta 2.4 GX Plus 7-Str` (₹20,47,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Innova Crysta 2.4 GX Plus 8-Str` (₹20,52,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Innova Crysta 2.4 VX 7-Str` (₹23,95,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Innova Crysta 2.4 VX 8-Str` (₹24,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Innova Crysta 2.4 Zx 7-Str` (₹25,53,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 GX 7Str` (₹19,18,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 GX 7Str` (₹19,23,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 GX 7Str Platinum White Pearl` (₹18,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 GX 8Str` (₹19,23,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 GX 8Str Platinum White Pearl` (₹18,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 GX Plus 7Str` (₹20,83,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 GX Plus 7Str Platinum White Pearl` (₹20,61,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 GX Plus 8Str` (₹20,88,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 GX Plus 8Str Platinum White Pearl` (₹20,66,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 VX 7Str` (₹24,37,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 VX 7Str` (₹24,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 VX 7Str Platinum White Pearl` (₹24,09,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 VX 8Str` (₹24,42,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 VX 8Str Platinum White Pearl` (₹24,14,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 Zx 7Str` (₹25,98,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `2.4 Zx 7Str Platinum White Pearl` (₹25,67,000)
  Note: Current Cardekho variant not found locally

### Innova Hycross

Cardekho variants: https://www.cardekho.com/toyota/innova-hycross/variants.htm
Rows to review: 7
Status mix: CARDEKHO_ONLY_VARIANT=7

- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G Fleet 8STR` (₹18,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GX (O) 7STR` (₹20,97,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GX (O) 8STR` (₹20,84,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GX 8STR` (₹19,58,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VX 8STR Hybrid` (₹26,81,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VX(O) 7STR Hybrid` (₹28,77,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VX(O) 8STR Hybrid` (₹28,82,000)
  Note: Current Cardekho variant not found locally

### Land Cruiser 300

Cardekho variants: https://www.cardekho.com/toyota/land-cruiser-300/variants.htm
Rows to review: 5
Status mix: LOCAL_ONLY_VARIANT=1, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Land Cruiser 300 ZX` (₹2,15,60,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GR-S` (₹2,24,93,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GR-S` (₹2,17,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZX` (₹2,17,75,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `ZX` (₹2,24,93,300)
  Note: Current Cardekho variant not found locally

### Rumion

Cardekho variants: https://www.cardekho.com/toyota/rumion/variants.htm
Rows to review: 22
Status mix: LOCAL_ONLY_VARIANT=7, CARDEKHO_ONLY_VARIANT=15

- [ ] LOCAL_ONLY_VARIANT: local `Rumion G` (₹11,64,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Rumion G AT` (₹13,11,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Rumion S` (₹10,51,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Rumion S AT` (₹12,05,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Rumion S CNG` (₹11,40,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Rumion V` (₹12,39,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Rumion V AT` (₹13,86,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹9,55,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹10,51,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G` (₹11,64,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G` (₹12,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G AT` (₹13,11,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G AT` (₹13,86,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹10,51,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹11,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S AT` (₹12,05,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S AT` (₹12,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S CNG` (₹11,40,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S CNG` (₹11,64,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V` (₹12,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V` (₹13,11,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V AT` (₹13,86,000)
  Note: Current Cardekho variant not found locally

### Taisor

Cardekho variants: https://www.cardekho.com/toyota/taisor/variants.htm
Rows to review: 28
Status mix: LOCAL_ONLY_VARIANT=5, CARDEKHO_ONLY_VARIANT=23

- [ ] LOCAL_ONLY_VARIANT: local `Taisor E` (₹7,25,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taisor E CNG` (₹8,24,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taisor G Turbo` (₹10,00,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taisor S` (₹8,13,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taisor V Turbo AT` (₹12,23,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹7,25,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹8,13,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E CNG` (₹8,24,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E CNG` (₹8,47,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G Turbo` (₹10,20,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G Turbo` (₹11,08,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G Turbo AT` (₹11,57,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G Turbo AT` (₹12,47,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹8,13,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹8,24,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S AMT` (₹8,72,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S AMT` (₹9,06,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S Plus` (₹8,47,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S Plus` (₹8,72,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S Plus AMT` (₹9,06,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S Plus AMT` (₹10,20,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V Turbo` (₹11,08,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V Turbo` (₹11,24,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V Turbo AT` (₹12,47,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V Turbo AT` (₹12,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V Turbo AT Dual Tone` (₹12,63,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V Turbo Dual Tone` (₹11,24,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V Turbo Dual Tone` (₹11,57,000)
  Note: Current Cardekho variant not found locally

### Urban Cruiser Hyryder

Cardekho variants: https://www.cardekho.com/toyota/hyryder/variants.htm
Rows to review: 18
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=16

- [ ] LOCAL_ONLY_VARIANT: local `Urban Cruiser Hyryder E` (₹10,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Urban Cruiser Hyryder S CNG` (₹13,38,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹10,99,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `E` (₹12,51,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G CNG` (₹15,34,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `G CNG` (₹15,39,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S` (₹13,38,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S AT` (₹14,23,100)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `S CNG` (₹13,77,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Toyota Hyryder G Opt HYBRID` (₹18,44,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Toyota Hyryder G Opt HYBRID Dual Tone` (₹18,63,700)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Toyota Hyryder V AWD Dual Tone AT` (₹18,47,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Toyota Hyryder V Dual Tone` (₹15,92,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Toyota Hyryder V Dual Tone AT` (₹17,07,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Toyota Hyryder V HYBRID Dual Tone` (₹19,76,300)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V` (₹16,02,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V AT` (₹17,24,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `V AT` (₹18,28,600)
  Note: Current Cardekho variant not found locally

### Vellfire

Cardekho variants: https://www.cardekho.com/toyota/vellfire/variants.htm
Rows to review: 6
Status mix: LOCAL_ONLY_VARIANT=2, CARDEKHO_ONLY_VARIANT=4

- [ ] LOCAL_ONLY_VARIANT: local `Vellfire Hi` (₹1,19,73,400) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Vellfire VIP Executive Lounge` (₹1,29,72,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Hi` (₹1,19,73,400)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Hi` (₹1,29,72,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VIP Executive Lounge` (₹1,29,72,000)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `VIP Executive Lounge` (₹1,19,73,400)
  Note: Current Cardekho variant not found locally

## VinFast

Pending models: 6
Pending rows: 13

### Limo Green

Cardekho variants: https://www.cardekho.com/vinfast/limo-green/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Standard` (₹19,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### VF 3

Cardekho variants: https://www.cardekho.com/vinfast/vf-3/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Standard` (₹10,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### VF 6

Cardekho variants: https://www.cardekho.com/vinfast/vf-6/variants.htm
Rows to review: 3
Status mix: NO_PRICE_PARSED=3

- [ ] NO_PRICE_PARSED: local `Earth` (₹17,29,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Wind` (₹18,69,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Wind Infinity` (₹19,19,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### VF 7

Cardekho variants: https://www.cardekho.com/vinfast/vf-7/variants.htm
Rows to review: 6
Status mix: NO_PRICE_PARSED=6

- [ ] NO_PRICE_PARSED: local `Earth` (₹21,89,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Plus (AWD)` (₹26,79,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Sky` (₹26,19,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Sky Infinity` (₹26,79,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Wind` (₹24,69,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED
- [ ] NO_PRICE_PARSED: local `Wind Infinity` (₹25,19,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### VF 8

Cardekho variants: https://www.cardekho.com/vinfast/vf-8/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Eco` (₹50,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

### VF 9

Cardekho variants: https://www.cardekho.com/vinfast/vf-9/variants.htm
Rows to review: 1
Status mix: NO_PRICE_PARSED=1

- [ ] NO_PRICE_PARSED: local `Plus` (₹65,00,000) -> Cardekho `—` (—)
  Note: NO_PRICE_PARSED

## Volkswagen

Pending models: 2
Pending rows: 49

### Taigun

Cardekho variants: https://www.cardekho.com/volkswagen/taigun/variants.htm
Rows to review: 24
Status mix: LOCAL_ONLY_VARIANT=6, CARDEKHO_ONLY_VARIANT=18

- [ ] LOCAL_ONLY_VARIANT: local `Taigun Comfortline 1.0 TSI AT` (₹12,42,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taigun Comfortline 1.0 TSI MT` (₹11,42,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taigun GT 1.5 TSI EVO DSG` (₹19,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taigun Highline 1.0 TSI AT` (₹14,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taigun Highline 1.0 TSI MT` (₹13,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Taigun Topline 1.5 TSI EVO MT` (₹16,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Comfortline` (₹10,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Comfortline` (₹12,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Line` (₹14,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Line AT` (₹15,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Line AT` (₹15,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Plus Chrome DSG` (₹18,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Plus Sport DSG` (₹19,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline` (₹12,69,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline` (₹13,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline AT` (₹13,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline AT` (₹14,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline Plus` (₹14,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline Plus` (₹14,59,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline Plus AT` (₹15,44,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline Plus AT` (₹15,74,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Topline` (₹15,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Topline` (₹17,17,500)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Topline AT` (₹17,17,500)
  Note: Current Cardekho variant not found locally

### Virtus

Cardekho variants: https://www.cardekho.com/volkswagen/virtus/variants.htm
Rows to review: 25
Status mix: LOCAL_ONLY_VARIANT=6, CARDEKHO_ONLY_VARIANT=19

- [ ] LOCAL_ONLY_VARIANT: local `Virtus Comfortline 1.0 TSI AT` (₹11,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Virtus Comfortline 1.0 TSI MT` (₹10,49,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Virtus GT 1.5 TSI EVO DSG` (₹18,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Virtus Highline 1.0 TSI AT` (₹13,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Virtus Highline 1.0 TSI MT` (₹12,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] LOCAL_ONLY_VARIANT: local `Virtus Topline 1.5 TSI EVO MT` (₹15,99,000) -> Cardekho `—` (—)
  Note: Local variant not found on current Cardekho variants feed
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Comfortline` (₹10,49,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Comfortline` (₹13,45,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Line` (₹14,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Line` (₹14,65,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Line AT` (₹14,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Line AT` (₹15,10,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Plus DSG ES` (₹18,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `GT Plus Sport DSG` (₹18,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline` (₹13,45,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline` (₹13,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline AT` (₹14,65,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline Plus` (₹13,85,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline Plus` (₹14,09,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline Plus AT` (₹14,90,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Highline Plus AT` (₹14,99,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Topline AT ES` (₹16,29,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Topline AT ES` (₹18,79,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Topline ES` (₹15,10,900)
  Note: Current Cardekho variant not found locally
- [ ] CARDEKHO_ONLY_VARIANT: local `—` (—) -> Cardekho `Topline ES` (₹16,29,900)
  Note: Current Cardekho variant not found locally

