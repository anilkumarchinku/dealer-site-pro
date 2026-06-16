# DealerSite Pro — Edge Cases Explained

> A deep-dive into every defensive edge case in the codebase: **what** the code does, **why** it exists, a **real-life example**, and the **step-by-step process** to actually hit each case.
>
> File/line references are clickable. They were accurate at the time of writing — verify before relying on a specific line number.

---

## Table of Contents

1. [Validation & Input](#1-validation--input)
2. [Slugs & Multi-Tenancy](#2-slugs--multi-tenancy)
3. [Vehicle Data & Fallbacks](#3-vehicle-data--fallbacks)
4. [Images & Assets](#4-images--assets)
5. [Services & Integrations](#5-services--integrations)
6. [DNS & Domains](#6-dns--domains)
7. [Onboarding](#7-onboarding)
8. [Auth](#8-auth)
9. [Deployment](#9-deployment)

---

## 1. Validation & Input

### 1.1 Indian Phone — strict vs. flexible

**File:** [schemas.ts:13](../lib/validations/schemas.ts#L13)

**What it does**
There are two validators. `indianPhone` is strict — exactly 10 digits, first digit 6–9 (`/^[6-9]\d{9}$/`). `flexPhone` is lenient — 10–15 chars, optional `+`, allows spaces/dashes (`/^[+]?[\d\s-]{10,15}$/`). Lead forms and test-drive bookings use the strict one so the database stores clean numbers; UI-facing inputs that may already carry formatting use the flexible one.

**Why it exists**
Indian mobile numbers always start with 6/7/8/9 and are 10 digits. Storing `+91 98765 43210` and `9876543210` as different strings would break dedupe, SMS dispatch, and lead matching. Strict-on-store, flexible-on-input is the compromise.

**Real-life example**
A customer types `+91 98765-43210` into a contact widget. The widget accepts it (`flexPhone`), but when the lead is persisted the system normalizes/validates against `indianPhone` and stores `9876543210`.

**Step-by-step to trigger**
1. Open a lead/test-drive form.
2. Enter `+91 9876543210` (with the country code and a space).
3. The strict `indianPhone` schema rejects it → "Invalid Indian phone number (must be 10 digits starting with 6-9)".
4. Enter `9876543210` → passes.
5. Enter `5876543210` (starts with 5) → rejected by both.

---

### 1.2 RC Date parsing — DD/MM/YYYY & DD-MM-YYYY with current-year fallback

**File:** [rc-mapper.ts:85](../lib/utils/rc-mapper.ts#L85)

**What it does**
`parseIndianDate()` splits on either `/` or `-`, expects exactly 3 parts, range-checks day (1–31), month (1–12), year (1900–2100), and returns ISO `YYYY-MM-DD`. If parsing fails, `extractYearFromRegistrationDate()` returns `new Date().getFullYear()` instead of throwing.

**Why it exists**
RC (Registration Certificate) data comes from OCR / third-party lookups and is frequently malformed. Rejecting the whole vehicle draft over a bad date would block legitimate inventory. Defaulting to the current year keeps the flow alive with a conservative guess.

**Real-life example**
An RC lookup returns `registrationDate: "XX/XX/XXXX"` (OCR couldn't read it). Instead of erroring, the vehicle is created with the year set to 2026 (current year), and the dealer can correct it later.

**Step-by-step to trigger**
1. Submit an RC with `registration_date = "15/06/2020"` → stored as `2020-06-15`.
2. Submit `15-06-2020` → also `2020-06-15` (dash separator works).
3. Submit `32/06/2020` (invalid day) → `parseIndianDate` returns `null` → year falls back to `2026`.
4. Submit `""` or garbage → same current-year fallback.

---

### 1.3 Two-word manufacturers — parsed before splitting on space

**File:** [rc-mapper.ts:54](../lib/utils/rc-mapper.ts#L54)

**What it does**
`parseMakeModel()` first checks the input against a whitelist (`TWO_WORD_MANUFACTURERS = ["Maruti Suzuki", "Tata Motors", "Mercedes-Benz", "Land Rover", "Force Motors"]`). If the string starts with one of those, that becomes the `make` and the remainder becomes the `model`. Only if no whitelist entry matches does it fall back to splitting on the first space.

**Why it exists**
RC data concatenates make + model as one string: `"Maruti Suzuki Swift"`. A naive split on the first space would give `make: "Maruti", model: "Suzuki Swift"` — a broken brand. The whitelist protects multi-word OEM names.

**Real-life example**
`"Maruti Suzuki Swift"` → `{ make: "Maruti Suzuki", model: "Swift" }`. Without the whitelist it would wrongly become `{ make: "Maruti", model: "Suzuki Swift" }`, and brand-filtered pages (`/maruti-suzuki`) would show nothing.

**Step-by-step to trigger**
1. Feed `"Maruti Suzuki Swift"` → correct two-word make.
2. Feed `"Hyundai Creta"` (single-word brand) → splits on space → `{ make: "Hyundai", model: "Creta" }`.
3. Feed `"Tata Motors"` alone (no model) → `{ make: "Tata Motors", model: "Tata Motors" }` (fallback to full string as model).

---

### 1.4 RC blacklist — blacklisted vehicles rejected

**File:** [rc-mapper.ts:150](../lib/utils/rc-mapper.ts#L150)

**What it does**
`validateRCDataForDraft()` checks `rcData.blacklisted`. If `true`, it returns `{ valid: false, error: "Cannot add blacklisted vehicle to inventory" }` before any other processing.

**Why it exists**
External RC APIs flag vehicles that are stolen, have unpaid dues, or are legally forfeited. Listing such a vehicle exposes the dealer to legal liability — so it's blocked at draft creation.

**Real-life example**
A dealer scans the RC of a used car bought from a walk-in seller. The lookup returns `blacklisted: true` (reported stolen). The system refuses to create the inventory draft.

**Step-by-step to trigger**
1. Submit RC data with `blacklisted: true` → rejected with the blacklist error.
2. Submit the same with `blacklisted: false` (or omitted) → passes the blacklist gate and proceeds to other validation (RC number required, make/model required).

---

### 1.5 Insurance status — derived from expiry date

**File:** [rc-mapper.ts:109](../lib/utils/rc-mapper.ts#L109)

**What it does**
`deriveInsuranceStatus(validUntil, fallback="unknown")` computes days until expiry. `< 0` → `expired`; `<= 30` → `expiring_soon`; otherwise `active`. If `validUntil` is null, returns the `fallback` (`unknown`).

**Why it exists**
Insurance validity is time-sensitive and a strong buying signal. The 30-day window flags vehicles that need renewal so the dealer/buyer can plan. `unknown` keeps data honest when no policy date exists.

**Real-life example** (today = 2026-06-16)
- Policy valid until `2026-05-01` → `expired` (−46 days).
- Valid until `2026-07-10` → `expiring_soon` (24 days).
- Valid until `2026-12-31` → `active`.
- No date → `unknown`.

**Step-by-step to trigger**
1. Set a vehicle's insurance expiry within the next 30 days → badge shows "Expiring soon".
2. Set it to a past date → "Expired".
3. Clear the date → "Unknown".

---

### 1.6 GSTIN — strict 15-char regex, only if provided

**File:** [onboarding.ts:112](../lib/validations/onboarding.ts#L112)

**What it does**
`ONBOARDING_GSTIN_REGEX` enforces the canonical 15-char GSTIN shape (`2 digits + 5 letters + 4 digits + letter + alnum + Z + alnum`). It is only checked when `input.gstin?.trim()` is truthy — empty/null GSTIN is allowed (input is uppercased before testing).

**Why it exists**
Not every dealer is GST-registered, so GSTIN is optional. But a *malformed* GSTIN should never be stored. "Validate only if present" satisfies both.

**Real-life example**
A small used-car dealer leaves GSTIN blank → onboarding proceeds. A registered dealer types `27aapdu0055k1z0` → uppercased to `27AAPDU0055K1Z0` and accepted.

**Step-by-step to trigger**
1. Leave GSTIN empty → no error.
2. Enter `27AAPDU00` (too short) → "Enter a valid 15-character GSTIN".
3. Enter a valid 15-char GSTIN in lowercase → uppercased and accepted.

---

### 1.7 Empty/null variant data — filter, dedupe, fallback only if empty

**File:** [two-wheeler-variants.ts:37](../lib/utils/two-wheeler-variants.ts#L37)

**What it does**
`normalizeTwoWheelerVariants()` (1) drops variants whose name is empty after trim; (2) if the result is empty *and* a `fallback` variant is given, pushes the fallback; (3) dedupes by a normalized key (lowercased, punctuation→spaces), and when two share a key it keeps the one that actually has a price (`existing.price_paise <= 0 && row.price_paise > 0`).

**Why it exists**
Catalog/scraped data has duplicate variants in mixed casing ("Standard" vs "standard") and rows with missing prices. The dealer should never see a model with zero variants, hence the fallback; and never a priced/unpriced duplicate pair, hence the price-preferring dedupe.

**Real-life example**
Input `[{name:"Standard", price:"50000"}, {name:"standard", price:null}, {name:"Premium", price:"60000"}]` → `[{Standard, 5000000}, {Premium, 6000000}]`. The unpriced "standard" duplicate is dropped in favor of the priced "Standard".

**Step-by-step to trigger**
1. Pass a list where every variant name is empty + a valid `fallback` → output is just the fallback.
2. Pass duplicates differing only in case, one with price and one without → single deduped entry with the price.
3. Pass `[]` with no fallback → `[]`.

---

### 1.8 Price parsing — "5 lakh"/"crore"/numbers/null → paise

**File:** [two-wheeler-variants.ts:22](../lib/utils/two-wheeler-variants.ts#L22)

**What it does**
`parseTwoWheelerVariantPriceToPaise()` returns 0 for null/empty. Numbers are `Math.round(n*100)`. Strings are stripped of `₹`, commas, spaces, then matched against `^([\d.]+)\s*lakh$` (×100,000×100) and `crore$` (×10,000,000×100). Plain numeric strings are treated as rupees ×100. Anything unparseable → 0.

**Why it exists**
Prices arrive as structured numbers, formatted strings (`"₹5 lakh"`), or manual entry. Normalizing everything to integer paise avoids floating-point money bugs and gives one comparable unit.

**Real-life example**
`"5 lakh"` → `50000000` paise (₹5,00,000). `"2.5 crore"` → `2500000000`. `"85,000"` → `8500000`. `"abc"` → `0`.

**Step-by-step to trigger**
1. Enter `5 lakh` as a variant price → stored as 50000000 paise.
2. Enter `₹85,000` → 8500000 paise.
3. Enter gibberish → 0 (safe default, shows as "price on request" downstream).

---

## 2. Slugs & Multi-Tenancy

### 2.1 Slug generation — 63-char DNS limit + normalization + reserved words

**File:** [slug.ts:25](../lib/utils/slug.ts#L25)

**What it does**
`generateSlug()` lowercases, converts spaces/underscores to hyphens, strips non-`[a-z0-9-]`, collapses consecutive hyphens, trims leading/trailing hyphens, and truncates to 63 chars. `validateSlug()` rejects a reserved list: `admin, api, www, mail, ftp, localhost, dashboard, billing`.

**Why it exists**
Slugs become subdomains. DNS labels are capped at 63 chars (RFC 1035) and must be URL-safe. Reserved words would collide with infrastructure routes (`api.`, `www.`, the admin dashboard).

**Real-life example**
`"Raj's Car & Bike World"` → `rajs-car-bike-world`. A dealer trying to grab the slug `admin` is blocked.

**Step-by-step to trigger**
1. Name a dealership `"ABC___Motors   Ltd"` → slug `abc-motors-ltd`.
2. Use a 90-char business name → slug truncated at 63.
3. Try slug `admin` → "This slug is reserved and cannot be used".

---

### 2.2 Slug conflicts — city → numeric suffix → timestamp

**File:** [slug.ts:25](../lib/utils/slug.ts#L25) (see `makeSlugUnique`)

**What it does**
`makeSlugUnique(base, city, existing)`: if `base` is free, use it. Else append the city slug (`abc-motors-chennai`). If that's taken too, append a numeric counter `-2, -3, …`. If the counter exceeds 1000, fall back to `${base}-${Date.now()}`. Result is truncated to 63 chars.

**Why it exists**
Two "ABC Motors" in different cities is common. City suffixing keeps URLs human-readable before resorting to ugly numbers; the 1000-iteration timestamp backstop prevents an infinite loop in pathological cases.

**Real-life example**
A second "ABC Motors" registers in Chennai → gets `abc-motors-chennai`. A third in Chennai → `abc-motors-2`.

**Step-by-step to trigger**
1. Register `abc-motors` twice with different cities → second becomes `abc-motors-<city>`.
2. Register a third with the same base and same city → `abc-motors-2`.
3. (Synthetic) Pass 1000+ existing variants → timestamp suffix.

---

### 2.3 Slug resolution — `{dealer}`, `{dealer}-{brand}`, `{dealer}-used`, dynamic parent fallback

**File:** [dealers.ts:155](../lib/db/dealers.ts#L155)

**What it does**
Resolves a URL slug to a dealer + optional brand filter: (1) exact match; (2) `-used` suffix; (3) known-brand suffix — strips a brand slug (longest-first), finds the parent dealer, resolves the brand via `dealer_brands`; (4) **dynamic fallback** — progressively shortens the slug on `-` until a parent dealer exists, then treats the remainder as a brand suffix.

**Why it exists**
Multi-brand dealers need multiple URL shapes: `abhi-motors`, `abhi-motors-used`, `abhi-motors-tata`, `abhi-motors-maruti-suzuki`. The dynamic fallback handles brand names not in the static known-brand list.

**Real-life example**
Visiting `/abhi-motors-tata` → exact match fails → `-used` fails → brand-suffix strip finds parent `abhi-motors` + brand "Tata Motors" → page renders the Tata-filtered inventory.

**Step-by-step to trigger**
1. Hit `/abhi-motors` → exact dealer.
2. Hit `/abhi-motors-used` → used-inventory view.
3. Hit `/abhi-motors-tata` → brand-filtered via known-brand suffix.
4. Hit `/abhi-motors-<obscure-brand>` → dynamic shortening locates the parent and looks up the brand.

---

### 2.4 Brand-specific config fallback — falls back to main config

**File:** [dealers.ts:260](../lib/db/dealers.ts#L260)

**What it does**
For a brand page it queries `dealer_site_configs` by `brand_slug`. If that row is missing, `cfg = siteConfigResult.data ?? mainConfigResult.data` falls back to the dealer's main `dealer_template_configs`. Same fallback applies to `tagline`, `hero_title`, `hero_subtitle`, `hero_cta_text`.

**Why it exists**
A dealer can customize per-brand hero text but usually hasn't. Rather than render blanks, the brand page reuses the main site config until the dealer overrides it.

**Real-life example**
"Abhi Motors" set a main hero title "Find Your Perfect Car" but never customized the Tata sub-page → `/abhi-motors-tata` shows the same hero title.

**Step-by-step to trigger**
1. Configure only the main `dealer_template_configs` (no per-brand row).
2. Open a brand page → it inherits the main hero/tagline.
3. Add a `dealer_site_configs` row for that brand → page now shows brand-specific content.

---

### 2.5 Legacy vs new domain tables — both supported during migration

**File:** [domain-service.ts:35](../lib/services/domain-service.ts#L35)

**What it does**
The system reads/writes both the legacy `domains` table and the new `dealer_domains` table. Status values are normalized (`suspended` → `failed`). Slug-uniqueness checks query both tables; `getDealerDomains()` merges and dedupes by domain name. New writes go to `dealer_domains` and *also* mirror into `domains` for backward compatibility.

**Why it exists**
A live migration from `domains` to `dealer_domains`. Until every record is migrated, both must be readable so existing domains keep resolving.

**Real-life example**
A dealer onboarded before the migration has their domain only in `domains`. A uniqueness check for a new subdomain must scan both tables or it could hand out a duplicate.

**Step-by-step to trigger**
1. Seed a domain only in the legacy `domains` table.
2. Try to create the same subdomain via the new flow → blocked because the legacy check catches it.
3. Call `getDealerDomains()` → returns the legacy + new rows, deduped.

---

### 2.6 Missing domain schema — falls back to legacy `domains` for subdomain creation

**File:** [domain-service.ts:213](../lib/services/domain-service.ts#L213)

**What it does**
`createSubdomainForDealer()` inserts into `dealer_domains` first. If that insert errors or returns null (e.g., the table doesn't exist on an older deployment), it falls back to inserting into the legacy `domains` table.

**Why it exists**
Older Supabase environments may not yet have the `dealer_domains` schema. The fallback guarantees subdomain creation still succeeds rather than hard-failing onboarding.

**Real-life example**
On a freshly provisioned environment without `dealer_domains`, the first dealer's subdomain insert throws a schema error; the code retries against `domains` and onboarding completes.

**Step-by-step to trigger**
1. Run against a DB where `dealer_domains` is absent/broken.
2. Create a subdomain → primary insert fails → legacy insert succeeds → success returned.

---

## 3. Vehicle Data & Fallbacks

### 3.1 Empty spec values — `-`, `tbd`, `n/a`, `0 bhp`, etc. treated as missing

**File:** [vehicle-detail-fallbacks.ts:5](../lib/utils/vehicle-detail-fallbacks.ts#L5)

**What it does**
`EMPTY_SPEC_VALUES` holds placeholders: `-`, `—`, `tbd`, `n/a`, `na`, `null`, `undefined`, `0`, `0 bhp`, `0 nm`, `0 cc`. `isMeaningfulSpec()` returns false for any of these (case-insensitive); numbers must be finite and > 0.

**Why it exists**
CSV imports and APIs use placeholder text for unknown specs. Displaying "Power: 0 bhp" or "Torque: -" looks broken, so these are treated as absent and routed to fallback inference.

**Real-life example**
A scraped car has `{ power: "0 bhp", torque: "-" }`. Both are treated as missing; the detail page either hides them or fills sensible defaults instead of printing "0 bhp".

**Step-by-step to trigger**
1. Import a vehicle with `power: "0 bhp"` → spec treated as missing.
2. Import with `transmission: "tbd"` → triggers transmission fallback.
3. Import with `displacement: "1200 cc"` → kept (meaningful).

---

### 3.2 Spec defaults — fuel/transmission/seating inferred per 2W/3W/4W & EV

**File:** [vehicle-detail-fallbacks.ts:5](../lib/utils/vehicle-detail-fallbacks.ts#L5)

**What it does**
When a spec is missing, defaults are inferred from `vehicleCategory` + `bodyType`: fuel defaults to "Petrol" for 2W/3W; transmission is "Automatic" for scooters/EVs and "Manual" for bikes; seating is 2 (2W), 1 (3W cargo), 4 (3W passenger), 5 (4W).

**Why it exists**
Vehicle categories have predictable physical defaults. A 2-wheeler is always 2-seater; a cargo 3-wheeler carries 1; an EV is automatic. Inferring beats showing blanks.

**Real-life example**
A 2W bike row missing transmission → defaults to "Manual". A 3W electric cargo missing seating → defaults to 1.

**Step-by-step to trigger**
1. Create a 2W bike with no transmission → page shows "Manual".
2. Create a 3W "Cargo" with no seating → shows 1 seat.
3. Create a scooter/EV with no transmission → "Automatic".

---

### 3.3 Variant price fallback — car min → max → 0

**File:** [on-road-price.ts:244](../lib/utils/on-road-price.ts#L244)

**What it does**
`buildCarOnRoadVariantOptions()` keeps variants with `price > 0`. If none qualify, it synthesizes one "default" option priced as `pricing.exShowroom.min ?? pricing.exShowroom.max ?? 0`.

**Why it exists**
Some car records have only a min, only a max, or neither. The chain produces *some* price so on-road calculators don't crash; `0` is the explicit "data incomplete" signal.

**Real-life example**
A car with no variants and only `max: 2500000` → single option priced ₹25,00,000. With neither min nor max → priced 0 (renders as price-on-request).

**Step-by-step to trigger**
1. Add a car with empty variants and only a min price → calculator uses min.
2. Remove the min, keep max → uses max.
3. Remove both → price 0.

---

### 3.4 Tax slabs — 37 states/UTs, price-tiered, fuel-dependent, default if unknown

**File:** [on-road-price.ts:85](../lib/utils/on-road-price.ts#L85)

**What it does**
`INDIAN_STATE_PROFILES` defines road-tax slabs for all 37 states/UTs. Some (Delhi, Karnataka, Maharashtra) are price-tiered via `upto` thresholds and fuel-dependent (petrol/diesel/ev rates). `resolveRoadTaxPercent()` picks the slab whose `upto` covers the ex-showroom price, else the last (highest) slab. Unknown state codes default to **Delhi (DL)**.

**Why it exists**
Indian road tax genuinely varies by state, vehicle price band, and fuel type. A default keeps the calculator functional for unrecognized/missing state codes.

**Real-life example**
A ₹10L petrol car in Delhi hits the `upto: 1000000` slab → 7%. A ₹25L car exceeds all Delhi thresholds → falls to the last slab (10%). State code `"XX"` → Delhi rates.

**Step-by-step to trigger**
1. Compute on-road price for Delhi at ₹10,00,000 → 7% road tax.
2. Same at ₹25,00,000 → 10% (last slab).
3. Pass an invalid state code → Delhi profile used.

---

### 3.5 Empty 2W inventory — merge DB rows with static catalog (`cat-2w-` prefix)

**File:** [two-wheelers/new/page.tsx:186](../app/sites/[slug]/two-wheelers/new/page.tsx#L186)

**What it does**
The new-2W page fetches DB inventory and, per brand, also fetches the DB catalog + static catalog. Catalog IDs are prefixed `cat-2w-` to avoid collisions. It builds a `brand__model` key set from DB rows and filters the catalog to only models *not* already in DB — so the catalog fills gaps without duplicating uploaded inventory.

**Why it exists**
A dealer who hasn't uploaded any 2W inventory should still show the full brand catalog (so the site isn't empty). Once they upload specific models, those take priority over catalog entries.

**Real-life example**
"Raj Two-Wheelers" has no Hero inventory → the page shows the entire Hero catalog. After they upload "HF Deluxe", the page shows their uploaded HF Deluxe plus the remaining catalog models (no duplicate HF Deluxe).

**Step-by-step to trigger**
1. View the new-2W page for a brand with zero DB inventory → full catalog shown.
2. Upload one model in that brand → that model now comes from DB; the duplicate catalog entry is filtered out.

---

### 3.6 Brand name mapping — display names → DB names, normalized partial match fallback

**File:** [catalog-db.ts:43](../lib/data/catalog-db.ts#L43)

**What it does**
`TW_MAKE_MAP` maps display names ("Hero MotoCorp") to DB names ("Hero"). `resolveTwCatalogMake()` does (1) exact lookup, (2) normalized partial-match fallback (strip punctuation, check substring both directions), (3) return the input unchanged if nothing matches. Same pattern for 3W.

**Why it exists**
Dealers use formal brand names ("TVS Motor Company", "Bajaj Auto") while the catalog DB stores short names ("TVS", "Bajaj"). The mapping + fuzzy fallback reconciles the two so brand filters actually return rows.

**Real-life example**
`"Hero MotoCorp"` → exact map hit → `"Hero"`. `"Bajaj"` (not a map key) → normalized substring match against `"Bajaj Auto"` → resolves to `"Bajaj"`. An unknown brand passes through unchanged.

**Step-by-step to trigger**
1. Filter by `"Hero MotoCorp"` → queries DB with `"Hero"`.
2. Filter by a partial like `"Bajaj"` → fuzzy-matched.
3. Filter by an unmapped brand → used verbatim (may return nothing).

---

## 4. Images & Assets

### 4.1 Color resolution — exact → keyword family → grey fallback

**File:** [resolve-vehicle-color.ts:1](../lib/utils/resolve-vehicle-color.ts#L1)

**What it does**
Resolves a color *name* to a hex: (1) exact lowercase match in `SPECIFIC_COLORS` (~200 brand colors); (2) `startsWith` match (handles edition/variant suffixes); (3) regex keyword families (`pearl.*white`, `matte black`, …), ordered most-specific-first; (4) fallback `#808080` grey.

**Why it exists**
Catalog data gives color names without hex codes, and brand nomenclature is wildly inconsistent ("Black Tornado Grey", "Matte Axis Grey Metallic"). The tiered match maximizes hits; grey guarantees the swatch always renders.

**Real-life example**
`"Black Tornado Grey Variant"` → `startsWith "black tornado grey"` → `#3A3A3A`. `"Weird Custom Color"` → no match → `#808080`.

**Step-by-step to trigger**
1. Use a known brand color → exact hex.
2. Append a suffix ("… Edition") → still matched via `startsWith`.
3. Use a never-seen color → grey fallback.

---

### 4.2 Hero image precedence — DB → local file → remote URL → any usable → empty

**File:** [car-service.ts:100](../lib/services/car-service.ts#L100)

**What it does**
`chooseFallbackHero()` prefers a URL that is usable *and* exists locally (`/data/brand-model-images/4w-galleries/…`), then the first usable remote URL, then any usable URL, else returns null/empty. `isUsableImageUrl()` filters empty strings, `placeholder`/`blank`/`no-image` paths, and malformed URLs.

**Why it exists**
Images come from DB references (may be stale), bundled local assets (fastest/most reliable), and remote URLs (Supabase). Preferring local avoids broken/slow images; placeholder filtering avoids showing obviously broken art.

**Real-life example**
DB hero is `/placeholder-car.jpg` (filtered out) but a local `…/swift-hero.jpg` exists → the local file wins. If only a remote Supabase URL is usable, that's used. If nothing is usable, hero is `""`.

**Step-by-step to trigger**
1. Set DB hero to a placeholder + provide a real local file → local file chosen.
2. Provide only remote URLs → first usable remote chosen.
3. Provide none/all placeholders → empty hero.

---

### 4.3 3W image fuzzy matching — exact stem → prefix → reverse prefix, two-dir disk scan

**File:** [resolve-3w-images.ts:73](../lib/utils/resolve-3w-images.ts#L73)

**What it does**
Scans two disk dirs (`/public/images/3w` priority, then `/public/data/brand-model-images/3w`) for image stems, then matches a model slug in stages: exact → slug-as-prefix (`treo` → `treo-yaari-hrt`) → stem-as-prefix-of-slug (`neev` → `neev-high-deck`) → strip known brand prefixes → progressive shortening from the end → first-segment fallback → substring containment. Returns `[]` if all fail.

**Why it exists**
3W models have variant-heavy names and scraped filenames rarely match exactly. Fuzzy matching surfaces a close image instead of none.

**Real-life example**
Model `"treo"`, disk has `treo-yaari-hrt.jpg` and `treo-sport.jpg` → prefix match returns both. Model `"yc-electric-yatri"`, disk has `yatri-high-deck.jpg` → brand-prefix strip yields `yatri`, then prefix match hits.

**Step-by-step to trigger**
1. Add a 3W model with an exact-name image → exact match.
2. Add a model whose image has a variant suffix → prefix match.
3. Add a model with a brand-prefixed name but un-prefixed image → brand-strip stage matches.
4. Add a model with no related image → `[]` (no image shown).

---

### 4.4 Logo fallback — dealer logo → brand logo → initials

**File:** [three-wheelers/[id]/page.tsx:87](../app/sites/[slug]/three-wheelers/[id]/page.tsx#L87)

**What it does**
`logoSrc` is `dealerInfo?.logoUrl` if present, else `brandLogoUrl(vehicle.brand, '3w')`, else null. When null (or the image `onError` fires), the `<Image>` doesn't render — the UI shows the initials/text fallback instead of a broken image.

**Why it exists**
Some dealers upload a logo, some don't; brand logos are a universal fallback; initials prevent layout shift from a broken `<img>`.

**Real-life example**
Dealer with no uploaded logo selling a Mahindra 3W → shows the Mahindra brand logo. Dealer with no logo and an unknown brand → shows initials.

**Step-by-step to trigger**
1. Set a dealer logo → it's used.
2. Clear the dealer logo, keep a known brand → brand logo used.
3. Clear both → initials/no image.

---

## 5. Services & Integrations

### 5.1 SMS graceful degradation — skip silently, Flow vs OTP fallback, never break leads

**File:** [sms-service.ts:40](../lib/services/sms-service.ts#L40)

**What it does**
If `MSG91_AUTH_KEY` is unset, it logs and returns silently (no throw). If a template ID exists, it sends via the MSG91 **Flow API** (DLT-compliant); otherwise it sends a plain message via the **OTP API**. All errors are caught and logged — SMS failure never breaks lead submission.

**Why it exists**
SMS notifications are nice-to-have; lead capture is critical. Dev/staging often lack MSG91 keys, and production network blips shouldn't lose leads.

**Real-life example**
A customer submits a lead in staging (no MSG91 key) → lead saved, SMS skipped silently. In prod with a template, the dealer gets a branded SMS; if MSG91 is down, the lead is still saved.

**Step-by-step to trigger**
1. Unset `MSG91_AUTH_KEY` and submit a lead → lead saved, SMS skipped.
2. Set the key but no template → plain SMS via OTP API.
3. Set key + template → branded Flow SMS.

---

### 5.2 External API errors — `ExternalApiError` captures status/body, caught without breaking flow

**File:** [external-api-fetch.ts](../lib/services/external-api-fetch.ts)

**What it does**
`externalApiFetch()` wraps every failure in `ExternalApiError`, capturing `status`, `bodyText`, `bodyJson`, `providerName`, and `path`. Non-OK responses, 30s timeouts (`AbortController`), and network errors all become this one error type so callers can branch consistently.

**Why it exists**
Third-party APIs (MSG91, Razorpay, Supabase) fail in many shapes. A single error type with full context lets callers decide retry/fallback/deny without parsing raw fetch errors.

**Real-life example**
MSG91 returns 401 (bad key) → `ExternalApiError { status: 401, bodyJson: { error: "Invalid authentication key" }, providerName: "MSG91" }`. A 30s hang → `ExternalApiError` with a "timed out after 30s" message.

**Step-by-step to trigger**
1. Call with an invalid auth key → 401 captured with body.
2. Point at an unreachable host → network-error variant.
3. Hit a slow endpoint > 30s → timeout variant.

---

### 5.3 Rate limiting — Redis with in-memory fallback, Sentry warning in prod

**File:** [rate-limiter.ts:8](../lib/utils/rate-limiter.ts#L8)

**What it does**
Uses Upstash Redis when `UPSTASH_REDIS_REST_URL` + `_TOKEN` are set. Otherwise falls back to a per-process in-memory `Map`. In production *without* Redis it captures a Sentry warning ("Rate limits are NOT distributed"). Returns a 429 response when over the limit, else null.

**Why it exists**
Rate limits must survive across serverless instances (Redis) but still function offline (in-memory). The in-memory fallback is per-process, so it's not shared — production misconfig is flagged via Sentry rather than crashing.

**Real-life example**
With Redis, 10 req/60s is enforced globally. Without Redis in prod, an attacker hitting instance A then instance B effectively doubles their allowance (counters aren't shared) — and Sentry records the warning so ops can fix it.

**Step-by-step to trigger**
1. Configure Redis → exceed the limit → 429, enforced across instances.
2. Remove Redis in dev → in-memory limiting, no Sentry warning.
3. Remove Redis in prod → in-memory limiting **+ Sentry warning**; limits not distributed.

---

### 5.4 Razorpay signature — empty/invalid/tampered → false

**File:** [payment-service.ts:94](../lib/services/payment-service.ts#L94)

**What it does**
`verifyPaymentSignature()` runs HMAC-SHA256 over the payment + subscription IDs and compares to the provided signature. Empty, invalid, or tampered signatures return `false` (no exception) — the caller decides to deny/log.

**Why it exists**
Webhook/callback signatures must be verified to prevent forged payment confirmations. Returning false (not throwing) lets the caller log a fraud attempt and deny access cleanly.

**Real-life example**
A forged webhook arrives with `signature: "tampered_signature"` → verification returns false → the system ignores the "payment success" and doesn't activate the subscription.

**Step-by-step to trigger**
1. Send a valid Razorpay callback → verifies true.
2. Alter one character of the signature → false.
3. Send an empty signature → false.

---

### 5.5 Mock payment mode — mock IDs in dev, error in prod when unconfigured

**File:** [payment-service.ts:37](../lib/services/payment-service.ts#L37)

**What it does**
If Razorpay isn't configured (`isRazorpayConfigured()` false): in production it returns `{ success: false, error: "Payment service is not configured" }`; in development it returns a mock subscription (`mock_sub_…`). A dummy plan ID (`plan_xxx`) is similarly mocked in dev / errored in prod.

**Why it exists**
Developers must test subscription flows without real Razorpay credentials, but production must never fake a transaction.

**Real-life example**
A dev runs the upgrade flow with no `RAZORPAY_KEY_ID` → gets `mock_sub_1718…` and the UI proceeds. The same misconfig in production returns a hard error.

**Step-by-step to trigger**
1. Unset Razorpay env in dev → mock subscription returned.
2. Unset it in prod → "Payment service is not configured".
3. Set a dummy plan `plan_xxx` in prod → "Payment plan is not configured".

---

## 6. DNS & Domains

### 6.1 DNS error codes — ENOTFOUND / ENODATA / generic, user-friendly messages

**File:** [domain-verification.ts:83](../lib/services/domain-verification.ts#L83)

**What it does**
`verifyDNSTXT()` queries TXT records (after stripping `https://`/`www.`) and maps DNS errors to friendly text: `ENOTFOUND` → "Domain not found. Please check the domain name."; `ENODATA`/`ENOTEXTUAL` → "No TXT records found. The record may not have propagated yet."; anything else → "DNS lookup failed: {message}".

**Why it exists**
Raw DNS error codes are meaningless to dealers. Friendly messages distinguish "you typed the wrong domain" from "your record just needs time to propagate".

**Real-life example**
A dealer enters `exmaple.com` (typo) → ENOTFOUND → "Domain not found." A dealer who just added the TXT record → ENODATA → "may not have propagated yet."

**Step-by-step to trigger**
1. Verify a non-existent domain → ENOTFOUND message.
2. Verify a real domain with no TXT record yet → ENODATA message.
3. Verify the domain after adding the correct TXT record → success.

---

### 6.2 HTML verification — 4 URLs (http/https × www/non-www), 10s timeout each

**File:** [domain-verification.ts:127](../lib/services/domain-verification.ts#L127)

**What it does**
`verifyHTMLFile()` tries `https/http` × `www/non-www` of `/dealersite-verify.html` (4 URLs), each with a 10s timeout. The first response containing the token wins. If none match, returns "Verification file not found or token mismatch".

**Why it exists**
A verification file may only be reachable on one scheme/host variant (e.g., HTTPS not set up on staging, or only `www` redirects). Trying all four maximizes success; per-URL timeout stops one slow host from blocking the whole check.

**Real-life example**
A dealer uploads the file but their HTTPS cert isn't ready; verification still succeeds via `http://www.dealer-site.com/dealersite-verify.html`.

**Step-by-step to trigger**
1. Host the file on `https://domain` → first URL succeeds.
2. Host it only on `http://www.domain` → third/fourth URL succeeds.
3. Don't host it anywhere → all 4 fail → token-mismatch error.

---

## 7. Onboarding

### 7.1 Multiple branches — only validated if `hasMultipleBranches`

**File:** [onboarding.ts:130](../lib/validations/onboarding.ts#L130)

**What it does**
Branch fields (city/state/address/phone) are validated *only* when `input.hasMultipleBranches` is true. Single-location dealers skip branch validation entirely.

**Why it exists**
Single-branch dealers never fill branch data; validating it would produce false errors and block onboarding.

**Real-life example**
A solo showroom toggles off "multiple branches" → no branch errors. A chain toggles it on with a blank branch city → "City is required" + "Please fix branch errors".

**Step-by-step to trigger**
1. Leave `hasMultipleBranches` false → branch validation skipped.
2. Enable it with an incomplete branch → per-field branch errors.
3. Fill all branch fields → passes.

---

### 7.2 At least one service required

**File:** [onboarding.ts:154](../lib/validations/onboarding.ts#L154)

**What it does**
`validateOnboardingServices()` returns "Please select at least one service" if the services array is empty, else "".

**Why it exists**
A dealer with zero services produces a non-functional storefront — at least one category (sales/finance/trade-in/etc.) is mandatory.

**Real-life example**
A dealer clicks Next without picking any service → blocked with the error.

**Step-by-step to trigger**
1. Submit the services step with none selected → error.
2. Select one → passes.

---

### 7.3 Completion gate — name/location/phone/email/slug + ≥1 brand (if new cars) + valid social URLs

**File:** [onboarding.ts:169](../lib/validations/onboarding.ts#L169)

**What it does**
`validateOnboardingReadyForSave()` aggregates required fields (dealership name, location, phone, valid email, slug, ≥1 service, style template). It requires ≥1 authorised brand **only** if the dealer sells new cars (`sellsNewCars` or category `new`/`both`). It also rejects invalid social media URLs.

**Why it exists**
This is the final gate before "setup complete". Brands are mandatory for new-car dealers (franchise/authorised), but a used-car-only dealer shouldn't be forced to pick a brand.

**Real-life example**
A used-car-only dealer with no brands selected → completes successfully. A new-car dealer with no brand → "Please select at least one authorised brand before completing setup."

**Step-by-step to trigger**
1. As a used-car dealer (category `used`), leave brands empty → completion allowed.
2. As a new-car dealer (category `new`/`both`), leave brands empty → blocked.
3. Enter a malformed Facebook URL → "Please fix invalid social media links."

---

## 8. Auth

### 8.1 OTP brute-force — failed-attempt counter

**File:** [auth.ts:60](../lib/db/auth.ts#L60)

**What it does**
On a failed OTP verification, `incrementOtpAttempt(email, code, purpose)` records the attempt before returning the error, feeding a brute-force counter (limit enforced in the OTP service layer).

**Why it exists**
A 6-digit OTP is brute-forceable (10⁶ combos). Counting failed attempts enables lockout/throttling to prevent automated guessing.

**Real-life example**
An attacker scripts guesses against `dealer@example.com` → each wrong code increments the counter → after the threshold further attempts are rejected/locked.

**Step-by-step to trigger**
1. Request an OTP, then submit a wrong code → attempt counter increments, "Invalid OTP code".
2. Repeat past the threshold → throttled/locked.
3. Submit the correct code (within limits) → succeeds.

---

### 8.2 Legacy login fallback — falls back to legacy DB if Supabase auth fails

**File:** [auth.ts:113](../lib/db/auth.ts#L113)

**What it does**
After OTP success, it tries Supabase admin (`getUser`). If Supabase auth is unavailable, the error is caught and the flow continues with the existing/legacy user context rather than failing the login. A missing account on a `login` purpose still errors ("No account found. Please register first.").

**Why it exists**
If Supabase auth has a transient outage but the OTP was already verified, the dealer should still get a session. It separates "auth service health" from "is this a real user".

**Real-life example**
Supabase auth has a blip during login; because the OTP verified, the catch path returns the existing user and the dealer logs in (possibly with limited profile data until the DB recovers).

**Step-by-step to trigger**
1. Verify a valid OTP while Supabase auth is reachable → normal login.
2. Simulate a Supabase auth outage with a valid OTP → fallback path keeps the session.
3. Attempt login for a non-existent account → "No account found. Please register first."

---

## 9. Deployment

### 9.1 Null deploy ID — buildId fallback, stop polling if both null

**File:** [DEPLOYMENT_CHECKLIST.md:48](../DEPLOYMENT_CHECKLIST.md#L48)

**What it does**
When a deployment returns no deploy ID, the status poller uses the `buildId` as a fallback. If both deploy ID and buildId are null, it stops polling — this fixed a bug where the client spammed `/status/null` (404s).

**Why it exists**
A null ID produced an invalid status URL (`/status/null`) that 404'd forever, hammering the server. The fallback + stop condition ends the loop cleanly.

**Real-life example**
A deploy is triggered but the provider hasn't returned an ID yet; the poller uses `buildId`. If neither materializes, polling stops instead of looping on 404s.

**Step-by-step to trigger**
1. Trigger a deploy that returns a deploy ID → polls `/status/{deployId}`.
2. Trigger one returning only a buildId → polls using buildId.
3. Both null → polling halts (no `/status/null` spam).

---

### 9.2 Build deps in prod — autoprefixer/tailwind/postcss/typescript moved to dependencies

**File:** [DEPLOYMENT_CHECKLIST.md:25](../DEPLOYMENT_CHECKLIST.md#L25)

**What it does**
Build-time tools (`autoprefixer`, `tailwindcss`, `postcss`, `typescript`) were moved from `devDependencies` to `dependencies` so production installs (which skip dev deps) can still build.

**Why it exists**
Production builds with `NODE_ENV=production` / `--omit=dev` don't install devDependencies. If the build runs in that environment, missing Tailwind/PostCSS/TS breaks the build.

**Real-life example**
A CI/CD pipeline runs `npm ci --omit=dev` then `next build` → previously failed on "cannot find tailwindcss"; after the move, the build succeeds.

**Step-by-step to trigger**
1. Run a production install that omits dev deps, then build → succeeds because build tools are in `dependencies`.
2. (Pre-fix) Move them back to `devDependencies` and repeat → build fails on missing PostCSS/Tailwind.

---

*Generated for DealerSite Pro — a multi-tenant SaaS website builder for Indian automotive dealers (Next.js 15 App Router).*
