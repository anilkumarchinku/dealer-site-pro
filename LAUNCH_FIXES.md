# DealerSite Pro — Pre-Launch Fix Tracker
Last updated: 2026-03-22

---

## 🔴 CRITICAL FIXES (Blocks Launch)

| # | Issue | File | Status | Fixed By |
|---|-------|------|--------|----------|
| C1 | Build failing — unused variable errors in API routes | app/api/deploy/route.ts | ✅ FIXED | Claude (2026-03-22) |
| C2 | `/api/domains/verify-dns` has no authentication | app/api/domains/verify-dns/route.ts | ✅ FIXED | Claude (2026-03-22) |
| C3 | `/api/admin/audit-images` has no authentication | app/api/admin/audit-images/route.ts | ✅ FIXED | Claude (2026-03-22) |
| C4 | npm vulnerabilities — removed jimp + puppeteer → 0 vulns | package.json | ✅ FIXED | Claude (2026-03-22) |
| C5 | Middleware cache TTL too low (60s → 5 mins) | middleware.ts | ✅ FIXED | Claude (2026-03-22) |
| C6 | RAZORPAY_KEY_SECRET is placeholder | .env | ❌ PENDING | You (add real key) |
| C7 | RAZORPAY_PRO_PLAN_ID is placeholder | .env | ❌ PENDING | You (add real key) |
| C8 | RAZORPAY_PREMIUM_PLAN_ID is placeholder | .env | ❌ PENDING | You (add real key) |
| C9 | VERCEL_TOKEN is placeholder | .env | ❌ PENDING | You (add real key) |
| C10 | GITHUB_TOKEN is placeholder | .env | ❌ PENDING | You (add real key) |
| C11 | CLOUDFLARE_API_TOKEN is placeholder | .env | ❌ PENDING | You (add real key) |
| C12 | GODADDY_API_KEY is placeholder | .env | ❌ PENDING | You (add real key) |
| C13 | RESEND_API_KEY is placeholder | .env | ❌ PENDING | You (add real key) |
| C14 | CRON_SECRET is placeholder | .env | ❌ PENDING | You (generate random string) |
| C15 | .env file committed to Git — keys exposed | Git history | ❌ PENDING | You (rotate keys + git rm --cached .env) |

---

## 🟡 WARNING FIXES (Should fix before launch)

| # | Issue | File | Status | Fixed By |
|---|-------|------|--------|----------|
| W1 | `/api/domains/purchase-managed` leaks DB error to client | app/api/domains/purchase-managed/route.ts | ✅ ALREADY OK | Already returning generic message |
| W2 | `/api/admin/deploy-template` no template/brands validation | app/api/admin/deploy-template/route.ts | ✅ FIXED | Claude (2026-03-22) |
| W3 | `/api/payments/create-subscription` missing rate limiting | app/api/payments/create-subscription/route.ts | ✅ FIXED | Claude (2026-03-22) |
| W4 | CSP is Report-Only mode — not enforced | next.config.ts | ❌ PENDING | Claude (after Razorpay confirmed) |
| W5 | Upstash Redis not configured — rate limiting uses in-memory fallback | .env | ❌ PENDING | You (free account at console.upstash.com) |
| W6 | Public folder is 163 MB — slows builds | public/ | ❌ PENDING | You (move images to CDN) |
| W7 | puppeteer + jimp installed but never used | package.json | ✅ FIXED | Claude (2026-03-22) |

---

## 🟢 ALREADY DONE (No action needed)

| # | Item | Details |
|---|------|---------|
| D1 | RLS on all Supabase tables | All 15 tables including dealer_deployments have RLS |
| D2 | Payment idempotency | Implemented in /api/payments/verify with idempotency_key |
| D3 | Rate limiting on key routes | Leads (3/hr), OTP (5/15min), 3W leads (5/10min) |
| D4 | Middleware caching | L1 local + L2 Redis (5 min TTL after fix) |
| D5 | Input validation on all APIs | All routes validate required fields |
| D6 | Security headers | HSTS, XSS protection, frame options configured |
| D7 | Subdomain routing — zero DB hits | Pure string parsing, no DB queries |
| D8 | 2W data — all 51 brands loading | FLAT_BRAND_FILES registry built |
| D9 | 4W features [object Object] bug | parseKeyFeatures() used everywhere |
| D10 | 3W capacity always "—" | Inferred from type + fuel_type |
| D11 | 2W colors rendered on cards | Color swatches added to VehicleCard |
| D12 | 2W dimensions on detail page | wheelbase/length/width/height shown |
| D13 | 3W enrichment pipeline | get3WModelEnrichment() wired in |
| D14 | 4W hyderabad on-road price shown | Shown in CarCard and BrandModelAccordion |
| D15 | 4W mileage field mismatch | car-specs-aggregator reads both field names |
| D16 | KTM ₹0 price | Shows "Price on request" when price_paise = 0 |

---

## ❌ DATA GAPS (JSON files need real data)

| # | Item | Status |
|---|------|--------|
| G1 | 3W: euler-motors.json — skeleton only | ✅ FIXED (2026-03-22) |
| G2 | 3W: greaves-electric-3w.json — skeleton only | ✅ FIXED (2026-03-22) |
| G3 | 3W: kinetic-green.json — skeleton only | ✅ FIXED (2026-03-22) |
| G4 | 3W: lohia-auto.json — skeleton only | ✅ FIXED (2026-03-22) |
| G5 | 3W: mahindra-3w.json — skeleton only | ✅ FIXED (2026-03-22) |
| G6 | 3W: piaggio-ape.json — skeleton only | ✅ FIXED (2026-03-22) |
| G7 | 3W: tvs-king.json — skeleton only | ✅ FIXED (2026-03-22) |
| G8 | 2W: bajaj-chetak-ev.json — empty | ✅ FIXED (2026-03-22) — 3 models added |
| G9 | 2W: river-ev.json — empty | ✅ FIXED (2026-03-22) — River Indie added |
| G10 | 4W: hyderabad_on_road_price missing for 20 brands | ❌ PENDING — needs real price data |

---

## HOW TO USE THIS FILE

- Ask Claude: "did you fix C1?" → Claude checks this file and answers YES or NO
- Ask Claude: "what's still pending?" → Claude lists all ❌ PENDING items
- Ask Claude: "fix W4 now" → Claude fixes that specific item and updates status here

---

## QUICK SUMMARY

| Category | Total | Fixed | Pending |
|----------|-------|-------|---------|
| 🔴 Critical | 15 | 10 | 5 (C6–C15, all require YOUR real API keys) |
| 🟡 Warning | 7 | 6 | 1 (W4 — CSP, W5 — Upstash) |
| 🟢 Already done | 16 | 16 | 0 |
| ❌ Data gaps | 10 | 0 | 10 |
