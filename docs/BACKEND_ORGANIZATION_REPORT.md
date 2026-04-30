# Backend Organization Report

Date: April 29, 2026

This document explains, in simple language, what was changed in the backend, why it was changed, and what it means for the product. It is written so that non-technical team members can understand the work without needing to read code.

## Short Summary

The backend has been cleaned up and organized without changing how the product is supposed to work for customers, dealers, or admins.

Before this work, some backend logic had been repeated in multiple places. That made the system harder to maintain, harder to test, and riskier to change. The work completed so far moves repeated logic into shared service files, adds stronger safety checks, improves payment reliability, and makes future production issues easier to diagnose.

The main goal was:

- Keep the same user-facing functionality.
- Reduce repeated backend code.
- Make important flows safer in production.
- Add tests so future changes are less likely to break existing behavior.
- Make configuration and provider integrations easier to manage.

## What Stayed The Same

The important point: this was an organization and safety improvement, not a product redesign.

The following were intentionally kept stable:

| Area | What stayed the same |
|---|---|
| Website pages | Existing customer and dealer pages are still expected to work the same way. |
| API routes | Existing backend endpoint paths were not intentionally changed. |
| Response formats | Existing JSON response shapes were kept compatible. |
| Dealer workflows | Dealer login, dealer site flows, leads, bookings, and domain flows were preserved. |
| Payment flow | Payment creation, verification, and webhook handling still follow the same business flow. |
| Vehicle catalog behavior | Existing 2-wheeler, 3-wheeler, and car catalog behavior was preserved. |

## Why This Work Was Needed

The project had signs of a common issue in fast AI-assisted development: the same kind of backend logic can get written more than once in different files.

That is not always visible to users immediately, but it creates long-term problems:

| Problem | Why it matters in production |
|---|---|
| Same logic written in multiple places | A bug may be fixed in one place but remain broken somewhere else. |
| Different error handling per route | Users may see inconsistent failures for similar actions. |
| Scattered environment variables | Missing or wrong secrets may only be discovered after a real user hits a route. |
| Provider calls handled differently | Third-party API failures become harder to debug. |
| Payment webhook memory-only duplicate handling | Duplicate payment events can be processed again after a server restart. |
| Multi-step domain/deploy flows not tracked clearly | Partial failures become harder to recover from. |
| Weak tests around critical backend behavior | Future cleanup could accidentally change existing functionality. |

This cleanup reduces those risks.

## Main Changes Completed

## 1. Dealer Login And Protected Access Were Organized

### What changed

Backend routes that require a logged-in dealer now use a more consistent shared access pattern.

Instead of every route deciding on its own how to check the current dealer, the backend now uses shared helper logic for dealer-aware authentication.

### Why this matters

This reduces the chance that one route accidentally allows access differently from another route.

### Plain-English example

Before:

One room in a building checked ID at the door, another room checked ID differently, and another room had its own custom rule.

After:

The building uses one security desk rule for protected rooms.

### Production impact

| Before | After |
|---|---|
| Dealer access checks could drift across files. | Dealer access is more centralized and predictable. |
| Future auth changes required editing many routes. | Future auth changes can be made in fewer places. |
| Higher chance of inconsistent error responses. | More consistent behavior across protected backend routes. |

## 2. Environment And Secret Handling Were Centralized

### What changed

Backend configuration now goes through a central environment layer instead of many files directly reading sensitive values.

Important production secrets are checked earlier. If required secrets are missing or still set to placeholder values, the backend fails fast instead of waiting until a real customer action fails.

### Why this matters

Production systems should not silently start with fake keys, missing secrets, or incomplete configuration.

### Plain-English example

Before:

The system might only discover a missing payment secret when a customer tries to pay.

After:

The system warns immediately during startup if a required production secret is missing or unsafe.

### Production impact

| Before | After |
|---|---|
| Missing secrets could hide until runtime. | Missing or placeholder production secrets are caught early. |
| Configuration was spread across multiple backend files. | Configuration is more centralized and easier to review. |
| Provider setup mistakes were harder to diagnose. | Startup and health checks give clearer signals. |

## 3. External Provider Calls Were Organized

### What changed

Backend calls to third-party services were moved toward shared provider patterns.

This includes services such as:

- Payment provider
- Domain provider
- DNS provider
- Deployment provider
- SMS provider
- AI/provider services
- Social/provider services
- Internal Cyepro-related services

### Why this matters

Third-party services can fail, timeout, reject requests, or return unexpected responses. The backend now has a more consistent pattern for handling these cases.

### Plain-English example

Before:

Every department called outside vendors in its own style, with its own timeout rules and error messages.

After:

There is a standard vendor communication process.

### Production impact

| Before | After |
|---|---|
| Provider errors could be handled differently in each route. | Provider errors are more predictable internally. |
| Timeouts and failed responses were harder to standardize. | Timeout and non-success handling is more organized. |
| Debugging third-party failures was harder. | Failures are easier to locate and explain. |

## 4. Payments And Webhooks Were Made Safer

### What changed

The Razorpay payment and webhook flow was hardened.

The most important improvement is database-backed webhook duplicate protection.

### What is a webhook?

A webhook is a message sent by an external service to the backend. For example, after a payment succeeds, the payment provider sends a message to the website backend saying, "This payment was completed."

### Why duplicate protection matters

Payment providers may send the same webhook more than once. This is normal behavior. The backend must be able to safely ignore duplicate events that were already processed.

Before this work, duplicate protection relied more on in-memory handling. That can be lost when the server restarts.

Now, webhook events are recorded in the database, which is more reliable.

### Production impact

| Before | After |
|---|---|
| Duplicate webhook tracking could be lost after restart. | Duplicate webhook tracking is stored in the database. |
| Repeated webhook events were riskier. | Repeated webhook events are safer to handle. |
| Payment event history was less visible. | Payment event processing is easier to trace. |

## 5. Domain And Deployment Workflows Were Organized

### What changed

Domain connection, domain removal, and deployment-related provider steps are now organized behind service boundaries.

The backend also has a new way to record multi-step domain/deployment operations.

### Why this matters

Domain and deployment actions usually involve several external systems. If one step succeeds and another step fails, the backend needs a clear record of what happened.

### Plain-English example

Connecting a custom domain is not one action. It can involve:

- Checking the domain
- Updating DNS
- Updating deployment settings
- Verifying provider response
- Saving final status

If step 3 fails, the team needs to know that steps 1 and 2 already happened.

### Production impact

| Before | After |
|---|---|
| Multi-step failures were harder to trace. | Domain/deployment actions have clearer operation records. |
| Provider orchestration lived closer to route files. | Provider orchestration is moved into service logic. |
| Recovery from partial failures was harder. | Partial failures are easier to understand and recover from. |

## 6. Vehicle Booking Logic Was Organized

### What changed

Similar booking logic across vehicle types was moved into shared backend service logic.

This covers important flows such as:

- Creating booking payment orders
- Verifying payment information
- Preserving vehicle booking behavior across 2-wheeler and 3-wheeler flows

### Why this matters

When two flows are almost the same, maintaining separate copies increases the chance that one gets fixed while the other remains outdated.

### Production impact

| Before | After |
|---|---|
| Similar booking logic existed in multiple places. | Booking logic is more centralized. |
| Fixes could be missed in one vehicle category. | Shared fixes can apply consistently. |
| Harder to test repeated behavior. | Easier to test the common behavior once. |

## 7. Vehicle Inventory, Leads, And Service Booking Logic Were Cleaned Up

### What changed

Backend logic around vehicle inventory, customer leads, and service bookings was organized into clearer shared service areas.

This reduces repeated route-level code and keeps route files focused on request/response handling.

### Why this matters

Routes should ideally answer simple questions:

- Who is calling?
- What data did they send?
- Which backend service should handle this?
- What response should be returned?

The detailed business logic should live in shared backend services.

### Production impact

| Before | After |
|---|---|
| Some route files had too much business logic. | More business logic lives in shared services. |
| Duplicate handling could appear across similar routes. | Similar routes now reuse common backend logic. |
| Harder to review route behavior quickly. | Route behavior is easier to scan and maintain. |

## 8. Catalog Parsing Was Made More Type-Safe

### What changed

The vehicle catalog parsing logic now has stronger typing and additional tests.

### Why this matters

Vehicle catalog data is important because it feeds user-facing vehicle pages and APIs. Stronger typing reduces the chance of hidden data-shape mistakes.

### Production impact

| Before | After |
|---|---|
| Catalog parsing had less direct test coverage. | Added tests for typed catalog parsing behavior. |
| Data-shape mistakes could be easier to miss. | More validation exists around expected catalog behavior. |

## 9. Database Changes Were Added And Applied

### What changed

New database support was added for safer backend behavior.

### Database additions

| Database area | Purpose |
|---|---|
| Webhook event records | Tracks payment webhook events so duplicates are handled safely. |
| Domain/deployment operation records | Tracks multi-step domain and deployment actions. |
| Google review fields | Supports storing Google review-related dealer information. |
| 3-wheeler vehicle registration number | Supports vehicle registration number data for 3-wheeler service bookings. |

### Why this matters

These database changes make important production workflows more traceable and reliable.

## 10. Test Coverage Was Expanded

### What changed

Tests were added around the backend areas that were cleaned up.

The test suite now covers important behavior such as:

- Dealer authentication success and failure cases
- Environment validation when secrets are missing or unsafe
- External provider timeout and failure handling
- Payment order creation and verification behavior
- Razorpay webhook duplicate handling
- Invalid webhook signature handling
- Payment activation, cancellation, and failure scenarios
- Domain provider failure behavior
- Typed catalog parsing behavior

### Final verification result

| Check | Result |
|---|---|
| Type checking | Passed |
| Automated tests | Passed, 841 tests |
| Production build | Passed |
| Local smoke check | Passed with safe temporary payment test values |
| Database migration check | Passed |

## Important Note About Real Production Secrets

The backend now intentionally refuses unsafe production configuration.

During smoke testing, the system correctly detected that Razorpay values were still placeholders. This is not a code failure. It means the safety check is working.

For a real staging or production smoke test, the following must be set to real values:

| Required value | Why it is needed |
|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Allows the frontend and backend to identify the Razorpay account. |
| `RAZORPAY_KEY_SECRET` | Allows the backend to securely create and verify payment operations. |
| `RAZORPAY_WEBHOOK_SECRET` | Allows the backend to verify that webhook messages really came from Razorpay. |

Once real values are added, a full staging smoke test should be run again.

## Business-Level Before And After

| Area | Before | After |
|---|---|---|
| Backend organization | Logic repeated across multiple files. | Shared logic moved into service files. |
| Auth/dealer access | Similar checks repeated in routes. | More centralized dealer-aware access handling. |
| Environment variables | Sensitive config read in many places. | Centralized environment validation. |
| Provider integrations | Each provider call could behave differently. | More consistent provider call and error handling. |
| Payments | Webhook duplicate handling was less durable. | Webhook duplicate handling is stored in the database. |
| Domain/deploy flows | Partial failures were harder to track. | Operation records make failures easier to diagnose. |
| Catalog handling | Less direct parser test coverage. | Added typed parser tests. |
| Release confidence | Harder to prove behavior stayed stable. | Tests, build, and smoke checks passed. |

## What This Means For Customers

Customers should not see a different product experience because of this cleanup.

The expected customer-facing result is:

- Same website behavior
- Same booking behavior
- Same payment flow
- Same dealer site behavior
- Same catalog behavior
- Fewer future production surprises

## What This Means For Dealers

Dealers should continue using the system the same way.

The expected dealer-facing result is:

- Same login behavior
- Same dashboard behavior
- Same lead and booking behavior
- Same domain and dealer site workflows
- Better backend reliability behind the scenes

## What This Means For Developers

Future backend changes should now be easier and safer.

Developers should benefit from:

- Less duplicate code to maintain
- Shared service files for common backend behavior
- More predictable provider error handling
- Centralized environment checks
- Better payment webhook safety
- Better tests around critical flows

## Release Readiness Status

| Item | Status |
|---|---|
| Backend organization | Complete |
| Database migrations | Applied |
| Payment webhook safety | Improved |
| Domain/deployment tracking | Added |
| Tests | Passing |
| Type checking | Passing |
| Build | Passing |
| Local smoke test | Passing with temporary safe payment values |
| True staging smoke test | Waiting for real Razorpay secrets |

## Remaining Production Action

Only one meaningful production-readiness action remains:

Replace placeholder Razorpay values with real staging or production values, then run a final smoke test against the real environment.

This is an environment setup step, not a backend code organization problem.

## Final Conclusion

The backend is now much more organized than before.

The cleanup focused on reducing repeated logic, improving payment and provider safety, centralizing configuration, tracking important multi-step operations, and adding tests around risky areas.

The product behavior was preserved, while the internal backend structure became easier to maintain and safer for production.
