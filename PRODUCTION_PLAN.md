# Dealer Site Pro — Production-Grade Fix Plan
> Generated: 2026-03-12 | Full codebase audit by 6 parallel agents

## LEGEND
- [ ] Not started
- [x] ✅ Completed
- [~] 🔄 In progress
- [!] ❌ Blocked / needs input

---

## PHASE 1 — Security Fixes (Auth Gaps)
> Must be done before any real users. All independent — can ship each separately.

- [x] ✅ **1.1** `app/api/admin/deploy-template/route.ts` — Add `requireAuth()` + `requireDealerOwnership()`. Derive dealerId from session, not request body. Replace module-level supabase client with in-handler `createAdminClient()`.
- [x] ✅ **1.2** `app/api/domains/stats/route.ts` — Add `requireAuth()`. Derive dealerId from session via `getDealerForUser()`. Ignore client-supplied `dealer_id` query param.
- [x] ✅ **1.3** `app/api/payments/create-subscription/route.ts` — Add `requireAuth()` + verify `domainId` belongs to the authenticated dealer before calling `createDomainSubscription`.
- [x] ✅ **1.4** `app/api/domain/start-onboarding/route.ts` — Add auth. Uncomment and implement DB insert into `domain_onboardings`. Source `user_id` from session.
- [x] ✅ **1.5** `app/api/domain/dns-scan/[id]/route.ts` — Replace mock data with real DB reads. Add auth. Uncomment the update at lines 92–104.
- [x] ✅ **1.6** `next.config.ts` — Removed `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`. TypeScript errors resolved (0 remaining).

---

## PHASE 2 — Build System Hardening
> Sequential — each step unblocks the next.

- [x] ✅ **2.1** `lib/database.types.ts` — Manually rewrote with all 25 tables + `Relationships: []` on each (required by `@supabase/supabase-js@2.95.3`). Added `car_catalog`, `notification_settings`, `domain_verifications`, `payment_idempotency_log` + RPC functions.
- [x] ✅ **2.2** Multiple files — Fixed 249 TS errors across all files. Root cause: missing `Relationships: []` in DB types + DB generic not on server client. All services, routes, and pages now type-safe.
- [x] ✅ **2.3** `tsconfig.json` — `noImplicitAny: true` enabled.
- [x] ✅ **2.4** `.eslintrc.json` — `no-explicit-any: warn`, `no-unused-vars: ["warn", argsIgnorePattern: "^_"]`, `no-console: ["warn", allow: error/warn]`.
- [x] ✅ **2.5** `.github/workflows/ci.yml` — CI pipeline created: typecheck + lint + test + build on push/PR to main.
- [x] ✅ **1.6↑** Executed — build error suppression removed. Zero TS errors confirmed.

---

## PHASE 3 — Performance & Caching
> Independent tasks — can be done in parallel after Phase 2.

- [x] ✅ **3.1** `lib/utils/rate-limiter.ts` — Upgraded to `@upstash/ratelimit` + `@upstash/redis`. Auto-detects `UPSTASH_REDIS_REST_URL/TOKEN` at startup and uses distributed sliding-window limiter when available. Falls back silently to in-memory Map when credentials are absent. All 16 call sites updated to `await rateLimitOrNull(...)`.
- [x] ✅ **3.2** `app/sites/[slug]/page.tsx` — Added `export const revalidate = 300`. Removed all 5 debug `console.log` statements (kept `console.error`).
- [x] ✅ **3.3** `app/api/admin/deploy-template/route.ts` — Added `revalidatePath('/sites/${slug}')` after successful DB update so template/brand changes reflect immediately. (Background cron part remains future work.)

---

## PHASE 4 — Production Observability
> 4.1 → 4.2 → 4.3 sequential (Sentry first).

- [x] ✅ **4.1** `sentry.{client,server,edge}.config.ts` created. `next.config.ts` wrapped with `withSentryConfig` (no-op when `SENTRY_DSN` is unset). `tracesSampleRate: 0.1`, source maps deleted after upload. Add `SENTRY_DSN` + `SENTRY_ORG` + `SENTRY_PROJECT` to env to activate.
- [x] ✅ **4.2** New `lib/utils/logger.ts` + targeted files — Logger wrapper: drops `console.log` in production. Replaced console calls in `cyepro-service.ts`, `email-service.ts`, `payments/verify/route.ts`, `leads/route.ts`, `reviews/route.ts`.
- [x] ✅ **4.3** `app/api/health/route.ts` — Health check now runs a live `SELECT id FROM dealers LIMIT 1` against Supabase and returns HTTP 503 on DB failure. Dropped `runtime = 'edge'` (incompatible with Node.js `createAdminClient`).

---

## PHASE 5 — Hardcoded Data Cleanup
> All independent. Any order, any time.

- [x] ✅ **5.1** `app/dashboard/help/page.tsx` lines 240, 322 — Replace fake number `919999999999` with `NEXT_PUBLIC_SUPPORT_WHATSAPP` env var. Hide button if var missing.
- [x] ✅ **5.2** `domains/page.tsx`, `settings/page.tsx`, `vercel-service.ts`, `dns-verification-service.ts` (5 files) — Replace hardcoded `cname.vercel-dns.com` with `NEXT_PUBLIC_CNAME_TARGET` env var.
- [x] ✅ **5.3** `lib/db/analytics.ts` lines 90–91 — Return `null` instead of `65`/`28`. Update analytics dashboard to show "No data yet" state.
- [x] ✅ **5.4** `lib/env.ts` — Make `NEXT_PUBLIC_BASE_DOMAIN` required in production. Keep `localhost:3000` only for `NODE_ENV !== 'production'`.
- [x] ✅ **5.5** `lib/data/two-wheelers.ts`, `lib/data/three-wheelers.ts` — Replace `year: 2024` with `new Date().getFullYear()`.

---

## PHASE 6 — Final Hardening
> 6.1–6.3 independent. 6.4 after 5.4.

- [x] ✅ **6.1** `next.config.ts` — Add CSP (Report-Only first), HSTS, Referrer-Policy, Permissions-Policy, X-XSS-Protection. Test Razorpay flow.
- [x] ✅ **6.2** `app/auth/register/page.tsx` line 39 — Change password minimum from 6 → 12 characters.
- [x] ✅ **6.3** `package.json` — Verify Puppeteer unused (`grep -r "puppeteer" app/ lib/`), then `npm uninstall puppeteer`.
- [x] ✅ **6.4** `middleware.ts` — Replace `Access-Control-Allow-Origin: *` with dynamic origin check against `BASE_DOMAIN` allowlist.

---

## NEEDS USER INPUT
> Tasks blocked on external accounts or config decisions.

- [ ] **3.1-BLOCKED** Upstash Redis account — needs `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
- [ ] **4.1-BLOCKED** Sentry account — needs `SENTRY_DSN` + `SENTRY_AUTH_TOKEN`
- [ ] **5.1-BLOCKED** Real WhatsApp support number for `NEXT_PUBLIC_SUPPORT_WHATSAPP`

---

## PROGRESS SUMMARY
| Phase | Tasks | Done | Status |
|-------|-------|------|--------|
| 1 – Security | 6 | 6 | 🟢 Done |
| 2 – Build | 6 | 6 | 🟢 Done |
| 3 – Performance | 3 | 3 | 🟢 Done |
| 4 – Observability | 3 | 3 | 🟢 Done |
| 5 – Hardcoding | 5 | 5 | 🟢 Done |
| 6 – Hardening | 4 | 4 | 🟢 Done |
| **TOTAL** | **27** | **27** | ✅ 100% |
