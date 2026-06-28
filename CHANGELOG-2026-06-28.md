# Changelog — 28 June 2026

All local changes since commit `48960ec4` (last push to main).

---

## 1. Dashboard KPI Fix

**File:** `app/dashboard/page.tsx`

- **Problem:** Dashboard KPI cards (Leads, Test Drives) showed counts from `fetchAnalyticsSummary()` which returned stale/zero values, not matching actual lead records.
- **Fix:** Leads and Test Drives counts are now computed from the actual `leads` table — active leads (excluding `converted`/`lost`) and leads with `type === "test_drive"`. Visitors still come from `analytics_daily`. All three queries run in a single `Promise.all` for efficiency.

---

## 2. Customer Panel — Service Bookings + Bug Fix

**Files:**
- `app/api/customer-panel/route.ts`
- `app/sites/[slug]/user/page.tsx`

### Service bookings added
- Added `car_service_bookings` as a 6th parallel query in the customer panel API, filtered by email/phone columns.
- Added `ServiceBooking` type, `Wrench` icon, and a 4th summary card ("Service Bookings") to the frontend.
- Service booking history rows show service type, vehicle make/model, preferred date/slot, and registration number.

### Bug fix: `expected_price` → `expected_price_paise`
- The sell requests query selected `expected_price` which doesn't exist — the actual column is `expected_price_paise`.
- Fixed in both the API `select()` and the frontend type/display logic.

---

## 3. Mock OTP for Development

**File:** `lib/services/otp-service.ts`

- Added a development-only OTP bypass: code `998909` always succeeds when `NODE_ENV !== 'production'`.
- Uses the existing timing-safe comparison flow; the bypass is at the top of `verifyOtp()` so it short-circuits before any DB lookup.

---

## 4. Push Notifications — VAPID Keys + Auto Triggers

The push notification infrastructure (Service Worker, APIs, admin UI, user opt-in, DB tables) was already built. Two gaps were filled:

### 4a. VAPID key configuration

**File:** `.env`

- Generated VAPID keys via `npx web-push generate-vapid-keys` and added `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` to `.env`.
- Without these, the entire push system returned "VAPID keys are not configured" errors.

### 4b. Automated push triggers for inventory events

**New files:**
- `lib/services/push-trigger.ts` — Server-side helper with two exports:
  - `triggerNewListingPush(dealerId, vehicle, siteUrl?)` — sends push to all `new_listings` subscribers
  - `triggerPriceDropPush(dealerId, vehicle, oldPricePaise, newPricePaise, siteUrl?)` — sends push to all `price_drops` subscribers
  - Both insert a row into `web_push_broadcasts` for audit trail, then fan out via `web-push` npm package.
- `app/api/push-trigger/route.ts` — Authenticated POST endpoint using Zod discriminated union (`new_listing` | `price_drop`). Bridges client-side vehicle forms to server-side push logic.

**Modified files:**
- `app/dashboard/inventory/add/page.tsx` — After successful vehicle add, fires a `new_listing` push trigger (fire-and-forget, non-fatal on failure).
- `app/dashboard/inventory/[id]/edit/page.tsx` — After successful vehicle update, detects if `price_paise` decreased and fires a `price_drop` push trigger.

### 4c. Subscriber count in admin dashboard

**Files:**
- `app/api/push-subscriptions/route.ts` — Added `GET` handler that returns active subscriber count for the authenticated dealer.
- `app/dashboard/push-notifications/page.tsx` — Fetches and displays subscriber count as a green badge ("X active subscribers") next to the page description.

---

## 5. Verified-Customer-Only Reviews

### Problem
Anyone could submit reviews on dealer sites and service center pages. No identity verification existed.

### Solution
Reviews now require email or phone, which is checked against 4 tables to verify the reviewer has interacted with the dealership. Only verified customers can submit. All reviews go to admin moderation (pending) — only approved reviews appear on the public site.

### 5a. Dealer reviews (`/api/reviews`)

**Files:**
- `app/api/reviews/route.ts`
- `components/ui/ReviewsSection.tsx`

**API changes:**
- Added `isVerifiedCustomer()` function that checks email/phone against `leads`, `test_drive_bookings`, `sell_requests`, and `car_service_bookings` using case-insensitive `ilike` matching and partial phone matching (handles country codes).
- POST now requires `reviewer_email` or `reviewer_phone` — returns 400 if neither provided, 403 if no matching records found.
- Stores `reviewer_email` and `reviewer_phone` in the insert.
- Removed auto-approve logic (`NEXT_PUBLIC_AUTO_APPROVE_REVIEWS` env var) — all reviews saved as `is_approved: false`, `moderation_status: 'pending'`.

**Frontend changes:**
- Added `email` and `phone` fields to the review form state.
- Added email/phone input fields with a verification notice: "We verify your email/phone against our records to ensure only genuine customers can review."
- Sends `reviewer_email` and `reviewer_phone` in the POST body.

### 5b. Service center reviews (`/api/service-center-reviews`)

**Files:**
- `app/api/service-center-reviews/route.ts`
- `components/service/PublicServiceCentersPage.tsx`

**API changes:**
- Added same `isVerifiedCustomer()` function (checks `car_service_bookings` first as most relevant for service reviews, then `leads`, `test_drive_bookings`, `sell_requests`).
- POST now requires `reviewer_email` or `reviewer_phone` — returns 400 if neither provided, 403 for non-customers.
- Stores `reviewer_email` and `reviewer_phone` in the insert.

**Frontend changes:**
- Added `email` and `phone` to the review form state type.
- Added email/phone input fields to the service center review form with verification notice.
- Client-side validation blocks submission if neither email nor phone is provided.
- Sends `reviewer_email` and `reviewer_phone` in the POST body.

### 5c. Database migration

**New file:** `supabase/migrations/20260628_reviewer_email_column.sql`

```sql
ALTER TABLE public.dealer_reviews
    ADD COLUMN IF NOT EXISTS reviewer_email text,
    ADD COLUMN IF NOT EXISTS reviewer_phone text;

ALTER TABLE public.service_center_reviews
    ADD COLUMN IF NOT EXISTS reviewer_email text,
    ADD COLUMN IF NOT EXISTS reviewer_phone text;

CREATE INDEX IF NOT EXISTS idx_dealer_reviews_email ON public.dealer_reviews(reviewer_email);
```

---

## Summary of all files changed

| # | File | Action | Feature |
|---|------|--------|---------|
| 1 | `app/dashboard/page.tsx` | Modified | Dashboard KPI fix |
| 2 | `lib/services/otp-service.ts` | Modified | Dev mock OTP (998909) |
| 3 | `app/api/customer-panel/route.ts` | Modified | Service bookings + price bug fix |
| 4 | `app/sites/[slug]/user/page.tsx` | Modified | Service bookings UI + price bug fix |
| 5 | `.env` | Modified | VAPID keys added |
| 6 | `lib/services/push-trigger.ts` | **New** | Auto push trigger helpers |
| 7 | `app/api/push-trigger/route.ts` | **New** | Push trigger API endpoint |
| 8 | `app/dashboard/inventory/add/page.tsx` | Modified | New listing push trigger |
| 9 | `app/dashboard/inventory/[id]/edit/page.tsx` | Modified | Price drop push trigger |
| 10 | `app/api/push-subscriptions/route.ts` | Modified | GET subscriber count |
| 11 | `app/dashboard/push-notifications/page.tsx` | Modified | Show subscriber count badge |
| 12 | `app/api/reviews/route.ts` | Modified | Verified-customer reviews |
| 13 | `components/ui/ReviewsSection.tsx` | Modified | Email/phone fields in review form |
| 14 | `app/api/service-center-reviews/route.ts` | Modified | Verified-customer service reviews |
| 15 | `components/service/PublicServiceCentersPage.tsx` | Modified | Email/phone fields in service review form |
| 16 | `supabase/migrations/20260628_reviewer_email_column.sql` | **New** | reviewer_email/phone columns |

**Stats:** 15 files changed, 3 new files, ~356 lines added, ~44 lines removed.
