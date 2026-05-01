# Public Launch Smoke Checklist

Date: 2026-05-01
Project: DealerSite Pro / indrav.in

Use this checklist before calling the project ready for a full public launch.

## Launch Decision Rules

- Full launch is allowed only when every Critical item passes.
- Soft launch is allowed when automated checks pass and any remaining manual checks are clearly owned.
- If any payment, auth, onboarding, or live webpage check fails, do not launch publicly until fixed and re-tested.

## Automated Checks

| Check | Expected result | Status | Notes |
|---|---|---:|---|
| TypeScript check | `npm run typecheck` passes | Pass | Completed locally |
| Unit/integration tests | `npm test` passes | Pass | 36 test files, 929 tests passed |
| Production build | `npm run build` passes | Pass | Build completed and generated 140 static pages |
| Lint | `npm run lint` exits 0 | Pass with warnings | Existing lint warnings remain; command exited 0 |
| Code map impact | Impact of launch fixes is known | Pass | Checked domain listing, DNS verification, subscription, and dealer ownership areas |
| Live health endpoint | `/api/health` returns `status: ok` | Pending deploy smoke | Health route now reports full launch env status after deploy |
| Live Supabase schema | Required launch tables/columns exist | Pending migration | New domain verification migration is committed but still needs to be applied live |

## Smoke Audit Fixes Completed

| Area | Issue found | Fix status |
|---|---|---:|
| 2W/3W live model pages | Generated `cat-*` catalog IDs could return `Vehicle not found` | Fixed and tested |
| 3W brand pages | Slugged brand names like `bajaj-auto-3w` could miss DB make `Bajaj` | Fixed and tested |
| Domain DNS verification | Root and `www` records were not both enforced | Fixed and tested |
| Domain verification logs | History insert could fail because old FK expected `domains.id` | Made non-blocking and added migration |
| Custom domain removal | Used-domain dealers could remove from the wrong Vercel project | Fixed and tested |
| Health check | Did not show all launch-critical env/provider readiness | Expanded |
| Domain dashboard records | Current `dealer_domains` records were not visible in all domain dashboard/service paths | Fixed and tested |
| Domain onboarding verification | Ownership/progress endpoints could return `501` and block the wizard | Fixed and tested |
| Payment subscription lookup | Subscription creation needed to accept current `dealer_domains` records | Fixed and tested |
| Payment idempotency/review ownership | Launch audit required regression coverage for admin idempotency and cross-dealer review updates | Covered by tests |
| RC lookup production fallback | Production could return demo RC data when provider config was missing | Covered by tests |

## Manual End-to-End Smoke Checks

| Critical? | Flow | Steps | Expected result | Status |
|---:|---|---|---|---:|
| Yes | New dealer registration | Register with a fresh email and 10 digit mobile number | Account is created, duplicate email/mobile is blocked, password min is 8 | Pass in tests, pending live |
| Yes | Onboarding selections | Complete onboarding with 2W, 3W, and 4W selected | Dashboard shows all selected business areas | Pass in tests, pending live |
| Yes | Webpage generation | Generate selected new, used, and hybrid webpages | Every selected 2W/3W/4W page appears in My Webpages | Code fixed, pending live |
| Yes | Dashboard preview | Open each generated page in dashboard preview | Preview renders and can be edited, no blank iframe | Pending live |
| Yes | Live webpages | Open each generated live page | Page returns 200 and shows inventory/catalog content | Code fixed, pending live |
| Yes | Model detail pages | Open 2W, 3W, and 4W model pages from live sites | Model pages render; variants/specs are not empty | Pass in tests, pending live |
| Yes | Enquiry capture | Submit one enquiry from a live page | Lead appears in the correct dealer dashboard | Pending live |
| Yes | On-road price enquiry | Open 2W on-road price popup and click enquiry/find dealer | Intent is captured or routed correctly | Pending live |
| Yes | Booking/payment test | Start one booking/payment in test mode | Razorpay opens, verify endpoint handles success/failure | Pass in tests, pending live |
| Yes | Razorpay webhook | Send duplicate and valid webhook test events | Duplicate is ignored; valid event updates status | Pass in tests, pending live |
| Yes | Domain connect/verify | Connect or verify one test domain | Operation is tracked; partial failure is recoverable | Pass in tests, pending migration/live |
| No | Mobile responsive pass | Check dashboard and live site on mobile viewport | No overlapping controls or hidden important actions | Pending |
| No | Browser console pass | Check dashboard/live pages in browser console | No repeated runtime errors | Pending |

## Production Data Safety

- Use a clearly named test dealer account.
- Do not use a real customer phone/email for smoke testing.
- Use Razorpay test mode for payment smoke.
- Use a disposable or controlled test domain for domain smoke.
- Keep a note of test dealer slug, email, and domain used.

## Go/No-Go Summary

| Area | Status | Launch impact |
|---|---:|---|
| Automated checks | Pass | Code is deployable |
| Registration/onboarding | Pass in tests, pending live | Full public launch should wait for real account smoke |
| Generated webpages | Code fixed, pending live | Deploy and open real generated pages before launch |
| Lead capture | Pending live | Must confirm one real enquiry reaches dashboard |
| Payment/webhooks | Pass in tests, pending live | Use Razorpay test mode before public launch |
| Domain flow | Pass in tests, pending migration/live | Apply migration, then verify a test domain |
| Cleanup warnings | Non-blocking | Lint exits 0; warnings can be cleaned after launch unless tied to runtime failures |

## Final Launch Call

The code is deployable and the automated launch gates pass. Do not call it fully public-launch-ready until the new migration is applied and the live logged-in smoke is completed on the deployed build.
