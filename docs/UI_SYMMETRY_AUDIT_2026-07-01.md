# DealerSite Pro UI Symmetry And Readability Audit

Audit date: 2026-07-01

Scope: current `dealer-site-pro` app routes, public dealer templates, vehicle cards/details, onboarding/auth, dashboard surfaces, and preview/template pages.

Evidence folder: `/tmp/dealersite-ui-audit`

## Checklist Status

Legend:

- `Checked`: rendered or source-reviewed in this pass.
- `Fixed`: changed in this pass and rechecked.
- `Auth gated`: clean-browser audit redirects to login; requires an authenticated dealer session for full visual QA.
- `Pending`: listed for the full audit backlog.

## Public Platform Pages Summary

- [x] Checked: `/`, `/about`, `/contact`, `/dealers`, `/privacy`, `/terms`, `/disclaimer`, `/sitemap`
- [x] Checked: `/vehicles`, `/marketplace`, `/cars`, `/autos`, `/bikes`, `/brands`, `/brands-accordion`
- [x] Checked: `/body-type`, `/budget`, `/ev`, `/upcoming`, `/compare`, `/sell`
- [x] Checked: `/tools/emi-calculator`, `/tools/on-road-price`, `/tools/insurance-estimator`, `/tools/car-valuation`
- [x] Fixed: `/autos` card symmetry now uses equal-height cards, stable 2x2 spec slots, two-line model text, and bottom-pinned CTA.
- [x] Fixed: `/tools/emi-calculator` range controls now have enough vertical height and no longer clip in desktop/mobile checks.
- [x] Fixed: `/cars-demo` now loads a lighter 24-car sample and resolves the Mercedes brand data alias, removing the focused timeout/404 issue.
- [x] Fixed: `/brands-accordion` brand logos now keep explicit image dimensions and no longer trigger the Next image sizing warning in focused checks.
- [x] Fixed: `/bikes` toolbar now stacks filter/count and sort controls on small screens instead of crowding one row.
- [x] Fixed: 4W and 2W detail-page sticky tab bars now wrap symmetrically on mobile/tablet instead of creating wide horizontal strips.
- [x] Fixed: 2W detail key-spec highlights now use a responsive grid instead of a fixed inline strip on mobile.

## Auth And Account Pages Summary

- [x] Checked: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/update-password`, `/reset`
- [x] Fixed earlier in this workstream: register page no longer shows the extra left security panel.
- [x] Fixed: `/auth/update-password` desktop card now uses a bounded grid column and `min-w-0` form container so the reset panel does not protrude past the viewport.
- [x] Source-reviewed: validation wording across auth, onboarding, contact, and public lead forms is now consistent with visible required/optional fields; optional public lead emails validate only when provided.

## Dealer Dashboard Pages Summary

- [x] Auth gated: `/dashboard`, `/dashboard/leads`, `/dashboard/sell-requests`, `/dashboard/messages`, `/dashboard/reviews`, `/dashboard/analytics`
- [x] Auth gated: `/dashboard/inventory`, `/dashboard/inventory/add`, `/dashboard/inventory/[id]/edit`, `/dashboard/used-vehicles`
- [x] Auth gated: `/dashboard/offers`, `/dashboard/service`, `/dashboard/insurance`, `/dashboard/push-notifications`
- [x] Auth gated: `/dashboard/catalog`, `/dashboard/deployment`, `/dashboard/domains`, `/dashboard/settings`, `/dashboard/help`
- [x] Auth gated: `/dashboard/two-wheelers/*` and `/dashboard/three-wheelers/*`
- [x] Fixed: `/dashboard/leads` filter controls now use a responsive grid instead of cramped fixed-width controls.
- [x] Fixed: 2W and 3W dashboard lead tables now keep readable minimum widths with nowrap phone/date/status columns inside horizontal scroll.
- [x] Fixed: shared dashboard `InventoryTable` now uses a stable table min-width and truncates long make/model/variant text.
- [x] Fixed: 2W/3W service, booking, used-vehicle, and insurance review tables now use readable minimum widths, nowrap numeric/date/status cells, and truncation for long names/orders.
- [ ] Pending: full dashboard visual QA inside an authenticated dealer session.

## Onboarding Pages Summary

- [x] Source-reviewed: `/onboarding` and 4W/2W/3W onboarding layouts and shared components.
- [x] Fixed earlier in this workstream: vehicle type selection is single-select instead of multi-select.
- [x] Fixed: website image/logo upload fields have more stable symmetric preview dimensions.
- [x] Fixed: onboarding inventory preview sample rows now use a scroll-safe min-width grid with truncation instead of a fixed four-column phone layout.
- [ ] Pending: screenshot pass through all onboarding steps with an authenticated session.

## Public Dealer Website Routes Summary

- [x] Checked: `/sites/[slug]`, `/sites/[slug]/about`, `/sites/[slug]/contact`, `/sites/[slug]/privacy`, `/sites/[slug]/terms`, `/sites/[slug]/sell`, `/sites/[slug]/service`
- [x] Checked: `/sites/[slug]/cars`
- [x] Checked: `/sites/[slug]/two-wheelers` child routes: `/new`, `/used`, `/bikes`, `/scooters`, `/electric`, `/offers`, `/compare`, `/emi-calculator`, `/service`, `/contact`, `/about`, and one catalog detail route.
- [x] Checked: `/sites/[slug]/three-wheelers` child routes: `/new`, `/used`, `/passenger`, `/cargo`, `/electric`, `/offers`, `/compare`, `/emi-calculator`, `/fleet-roi`, `/service`, `/contact`, `/about`
- [x] Fixed: 2W and 3W cards now allow two-line model names and two-line spec values with stable spec-cell height.
- [x] Fixed: 2W and 3W native filter selects now force readable foreground color.
- [x] Fixed: 2W/3W template empty states now say `No bikes...` / `No autos...` based on vehicle type instead of falling back to car copy.
- [x] Fixed: public dealer festival offer rails now render as responsive grids instead of wide animated marquee tracks, removing mobile/tablet/desktop document overflow on 2W offer-heavy pages.
- [x] Fixed: public 2W/3W compare pages now cap compare IDs to four and use stable minimum vehicle columns.
- [x] Fixed earlier in this workstream: public lead modals no longer require email where email is optional or absent.
- [x] Fixed earlier in this workstream: catalog lead submissions no longer fail by saving `cat-*` IDs into UUID columns.
- [x] Fixed earlier in this workstream: 2W on-road price dialog displays State and Variant text clearly.
- [x] Fixed: 4W detail variant-price table now has a stable mobile minimum width and truncates long variant labels inside a scroll container.
- [x] Checked: route-specific 4W dealer detail samples with matching Singh Auto inventory returned 200 with no page overflow on mobile/tablet/desktop.

## Template Surfaces Summary

- [x] Source-reviewed: `ModernTemplate`, `LuxuryTemplate`, `SportyTemplate`, `FamilyTemplate`
- [x] Source-reviewed: `PremiumUsedDealerTemplate`, `PremiumUsedInventoryPage`
- [x] Source-reviewed: template sections for offers, FAQ, exchange, finance, trust badges, sell vehicle, service booking, locations, on-road price, and video.
- [x] Fixed: premium used dealer cards now use equal-height flex layout, clamped title/variant text, stable spec text height, and bottom-pinned CTA row.
- [x] Fixed: premium used inventory filters now use a less cramped responsive grid with visible compact labels.
- [x] Fixed: Modern, Luxury, Sporty, and Family templates pass vehicle-type-specific empty-state copy into shared vehicle grids.
- [x] Fixed: shared `OffersSection` now keeps dealer-authored and fallback offers inside bounded responsive cards for all template styles.
- [x] Fixed: chatbot panel uses viewport-bounded mobile sizing so it cannot overflow narrow screens.
- [x] Fixed: template footer/contact rows wrap long dealer names, email addresses, phone numbers, and physical addresses.
- [x] Fixed: template desktop nav bars keep dealer names capped/truncated at xl widths so long dealership names do not collide with nav links.
- [x] Fixed: standalone 2W/3W template nav bars keep dealer names capped/truncated and use tighter desktop nav spacing.
- [x] Fixed: 4W test-drive modal is capped to the visible mobile viewport with a flex scroll body and safe-area bottom padding.
- [x] Fixed: full-spec, bulk-upload preview, DNS instruction, and on-road-price breakdown tables now use stable mobile minimum widths with truncation/nowrap for long values.
- [x] Fixed: compare modal, used-vehicle bulk upload preview, 2W detail variants, and 3W detail variants now use stable table widths with truncation/nowrap for long values.
- [x] Fixed: 2W/3W similar and used vehicle cards now clamp long model names, metadata, prices, badges, and CTAs so cards stay symmetric with long content.
- [x] Screenshot evidence: public template/demo/dealer pages were rerun across mobile/tablet/desktop with saved screenshots; source-level long dealer/model/variant hardening is complete.

## Preview And Demo Pages Summary

- [x] Checked: `/preview`, `/design-previews`, `/full-design-previews`, `/five-landing-previews`, `/dealer-flow-demo`, `/dealer-flow-map`
- [x] Checked: `/clean-design-preview`, `/clean-enhanced-preview`, `/clean-design-full`, `/clean-design-full-v2`, `/clean-design-full-v3`, `/clean-design-full-v4`, `/clean-design-same-images`
- [x] Checked: `/demo/templates`, `/demo/next-level-templates`
- [x] Fixed: `/cars-demo` passed focused desktop/mobile checks after reducing payload size and adding the missing brand file alias.
- [x] Fixed: `/demo/next-level-templates` section map and festival offer rail no longer create horizontal overflow; the hero card image minimum height is responsive on mobile.

## Verification Completed

- [x] Broad Puppeteer sweep: 80 routes x desktop/mobile, screenshots saved to `/tmp/dealersite-ui-audit/screenshots`.
- [x] Post-fix sweep: `/autos`, `/sites/bharat-bhai/cars`, `/sites/bharat-bhai/two-wheelers`, `/sites/bharat-bhai/two-wheelers/new?brand=royal-enfield`, `/sites/bharat-bhai/three-wheelers`, `/tools/emi-calculator`.
- [x] Post-fix sweep 2: `/marketplace`, `/dashboard/leads`, `/autos`, `/sites/bharat-bhai/two-wheelers`, `/sites/bharat-bhai/three-wheelers`, `/tools/emi-calculator`.
- [x] Device compatibility sweep: 80 routes across mobile `390x900`, tablet `820x1000`, and desktop `1440x1000`; results saved to `/tmp/dealersite-ui-audit/device-compat-3vp`.
- [x] Focused rerun: `/sites/bharat-bhai` tablet transient dev-overlay failure did not reproduce and rendered cleanly.
- [x] Focused rerun: `/sites/bharat-bhai/two-wheelers/scooters` redirected cleanly and now shows `No bikes found matching your criteria.`
- [x] Additional public sweep: `/tmp/dealersite-ui-audit/additional-public-3vp-fast` covered 82 public/sample routes across mobile/tablet/desktop and identified the offer-rail and reset-card overflow issues fixed above.
- [x] Focused rerun: `/tmp/dealersite-ui-audit/offer-grid-rerun` confirmed `/demo/next-level-templates`, `/auth/update-password`, `/sites/bharat-bhai/two-wheelers/new`, and `/sites/bharat-bhai/two-wheelers/used` have no horizontal overflow after the fixes.
- [x] Direct route checks: `/api/marketplace` returned 200 after fresh dev-server compile, `/brands/Hyundai` returned 200, and `/sites/bharat-bhai/three-wheelers` returned 200 after clearing the stale `.next` dev cache.
- [x] Supervisor coverage agent: verified the detailed inventory covers all current `app/**/page.tsx` routes; cleanup applied for summary wording and missing shared surfaces.
- [x] Audit agent: reported remaining responsive risks in chatbot, dashboard tables, compare tables, template footers, bikes toolbar, and managed-domain modal; scoped fixes applied.
- [x] Supervisor coverage agent second pass: confirmed no missing route patterns in the current route checklist; requested a more exhaustive shared-surface inventory, added below.
- [x] Audit agent second pass: reported remaining table/modal/onboarding/detail/nav risks; scoped source fixes applied.
- [x] Dynamic detail rerun: `/tmp/dealersite-ui-audit/dynamic-detail-rerun` identified detail-tab overflow on mobile/tablet.
- [x] Post-risk-fix rerun: `/tmp/dealersite-ui-audit/post-audit-risk-fixes-fast` and a focused tab rerun confirmed the fixed detail tab bars no longer produce page-level or tab-strip overflow flags.
- [x] Continuation risk rerun: `/tmp/dealersite-ui-audit/continuation-2026-07-01-risk-rerun` checked 30 high-risk routes across mobile/tablet/desktop and identified the 2W detail spec strip plus 4W variant table risks fixed above.
- [x] Post-source-fix rerun: `/tmp/dealersite-ui-audit/continuation-2026-07-01-post-source-fixes` checked the second-pass fix set across mobile/tablet/desktop; the only transient dev-cache 500 recovered, and `/sites/singh-auto-dealers/89999d26-c273-4bcf-a671-8f5aadefcbb3` then returned 200 with no page overflow at all three breakpoints.
- [x] `npx tsc --noEmit --pretty false --incremental false`
- [x] `git diff --check`
- [x] `npm run build` completed successfully and generated all 204 static pages; remaining output was warnings only.
- [x] Repeat table-risk source scan: remaining unbounded shared/detail table matches were reviewed and fixed where they could affect mobile/tablet readability.
- [x] Validation source scan: active auth, onboarding, contact, 2W/3W lead, booking, and legacy lead forms were checked for required/optional email mismatch; no active mismatch remained.
- [x] Public template evidence pass: `/tmp/dealersite-ui-audit/public-template-evidence-2026-07-01-final` checked 22 public/template/detail routes across mobile/tablet/desktop; the only transient `/sites/bharat-bhai` mobile navigation probe error was rerun cleanly at all three breakpoints.
- [x] 4W dealer detail evidence: `/sites/singh-auto-dealers/3cd9896b-f3d1-455c-bfc1-b94335443846` and `/sites/singh-auto-dealers/89999d26-c273-4bcf-a671-8f5aadefcbb3` returned 200 with no page overflow on mobile/tablet/desktop.

## Detailed Route Inventory

This inventory is generated from 167 current `app/**/page.tsx` files. Dynamic routes are listed by pattern and verified with concrete sample URLs when data exists. Auth-gated routes are listed and source-reviewed, but full screenshot QA still needs an authenticated dealer/admin session.

### Public Platform (28)

- [x] `/` — rendered or covered by public/sample sweep
- [x] `/[id]` — dynamic route listed; concrete visual QA depends on a matching vehicle id
- [x] `/about` — rendered or covered by public/sample sweep
- [x] `/autos` — rendered or covered by public/sample sweep
- [x] `/autos/[id]` — dynamic route listed; concrete visual QA depends on a matching 3W id
- [x] `/bikes` — rendered or covered by public/sample sweep
- [x] `/bikes/[id]` — dynamic route listed; concrete visual QA depends on a matching 2W id
- [x] `/body-type` — rendered or covered by public/sample sweep
- [x] `/brands` — rendered or covered by public/sample sweep
- [x] `/brands-accordion` — rendered or covered by public/sample sweep
- [x] `/brands/[brand]` — sample verified with `/brands/Hyundai`
- [x] `/budget` — rendered or covered by public/sample sweep
- [x] `/careers` — rendered or covered by public/sample sweep
- [x] `/cars` — rendered or covered by public/sample sweep
- [x] `/cars/[id]` — dynamic route listed; concrete visual QA depends on a matching 4W id
- [x] `/compare` — rendered or covered by public/sample sweep
- [x] `/contact` — rendered or covered by public/sample sweep
- [x] `/dealers` — rendered or covered by public/sample sweep
- [x] `/disclaimer` — rendered or covered by public/sample sweep
- [x] `/ev` — rendered or covered by public/sample sweep
- [x] `/marketplace` — rendered or covered by public/sample sweep
- [x] `/press` — rendered or covered by public/sample sweep
- [x] `/privacy` — rendered or covered by public/sample sweep
- [x] `/sell` — rendered or covered by public/sample sweep
- [x] `/sitemap` — rendered or covered by public/sample sweep
- [x] `/terms` — rendered or covered by public/sample sweep
- [x] `/upcoming` — rendered or covered by public/sample sweep
- [x] `/vehicles` — redirects to marketplace and is covered by marketplace sweep

### Admin (4)

- [x] `/admin` — auth/admin-gated; source-reviewed/listed
- [x] `/admin/360` — auth/admin-gated; source-reviewed/listed
- [x] `/admin/inventory-audit` — auth/admin-gated; source-reviewed/listed
- [x] `/admin/preview-gallery` — auth/admin-gated; source-reviewed/listed

### Auth And Account (5)

- [x] `/auth/forgot-password` — rendered or covered by public/sample sweep
- [x] `/auth/login` — rendered or covered by public/sample sweep
- [x] `/auth/register` — rendered or covered by public/sample sweep
- [x] `/auth/update-password` — rendered, fixed, and focused-rerun verified
- [x] `/reset` — rendered or covered by public/sample sweep

### Preview And Demo (17)

- [x] `/cars-demo` — rendered, fixed, and focused-rerun verified
- [x] `/clean-design-full` — rendered or covered by public/sample sweep
- [x] `/clean-design-full-v2` — rendered or covered by public/sample sweep
- [x] `/clean-design-full-v3` — rendered or covered by public/sample sweep
- [x] `/clean-design-full-v4` — rendered or covered by public/sample sweep
- [x] `/clean-design-preview` — rendered or covered by public/sample sweep
- [x] `/clean-design-same-images` — rendered or covered by public/sample sweep
- [x] `/clean-enhanced-preview` — rendered or covered by public/sample sweep
- [x] `/demo/next-level-templates` — rendered, fixed, and focused-rerun verified
- [x] `/demo/templates` — rendered or covered by public/sample sweep
- [x] `/dealer-flow-demo` — current onboarding-flow demo route; aliases `/onboarding` and inherits its source-reviewed state
- [x] `/dealer-flow-map` — source-reviewed current flow-map route; vehicle-category copy corrected to one category per website setup
- [x] `/design-previews` — rendered or covered by public/sample sweep
- [x] `/five-landing-previews` — rendered or covered by public/sample sweep
- [x] `/full-design-previews` — rendered or covered by public/sample sweep
- [x] `/preview` — rendered or covered by public/sample sweep
- [x] `/setup-flow-preview` — rendered or covered by public/sample sweep

### Dashboard And Auth-Gated App (42)

- [x] `/dashboard` — auth gated; source-reviewed/listed
- [x] `/dashboard/add-vehicle-type` — auth gated; source-reviewed/listed
- [x] `/dashboard/analytics` — auth gated; source-reviewed/listed
- [x] `/dashboard/catalog` — auth gated; source-reviewed/listed
- [x] `/dashboard/deployment` — auth gated; source-reviewed/listed
- [x] `/dashboard/domains` — auth gated; source-reviewed/listed
- [x] `/dashboard/help` — auth gated; source-reviewed/listed
- [x] `/dashboard/insurance` — auth gated; source-reviewed/listed
- [x] `/dashboard/inventory` — auth gated; source-reviewed/listed
- [x] `/dashboard/inventory/[id]/edit` — auth gated; source-reviewed/listed
- [x] `/dashboard/inventory/add` — auth gated; source-reviewed/listed
- [x] `/dashboard/leads` — auth gated; filter layout fixed and clean-browser redirect checked
- [x] `/dashboard/messages` — auth gated; source-reviewed/listed
- [x] `/dashboard/offers` — auth gated; source-reviewed/listed
- [x] `/dashboard/push-notifications` — auth gated; source-reviewed/listed
- [x] `/dashboard/reviews` — auth gated; source-reviewed/listed
- [x] `/dashboard/sell-requests` — auth gated; source-reviewed/listed
- [x] `/dashboard/service` — auth gated; source-reviewed/listed
- [x] `/dashboard/settings` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers/bookings` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers/inventory` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers/inventory/[id]/edit` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers/inventory/add` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers/leads` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers/service` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers/used` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers/used/[id]/edit` — auth gated; source-reviewed/listed
- [x] `/dashboard/three-wheelers/used/add` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers/bookings` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers/inventory` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers/inventory/[id]/edit` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers/inventory/add` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers/leads` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers/service` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers/used` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers/used/[id]/edit` — auth gated; source-reviewed/listed
- [x] `/dashboard/two-wheelers/used/add` — auth gated; source-reviewed/listed
- [x] `/dashboard/used-vehicles` — auth gated; source-reviewed/listed
- [x] `/dashboard/webpage` — auth gated; source-reviewed/listed
- [x] `/dashboard/webpage/[...siteSlug]` — auth gated; source-reviewed/listed

### Onboarding (22)

- [x] `/onboarding` — auth gated; source-reviewed/listed
- [x] `/onboarding/step-1` — auth gated; source-reviewed/listed
- [x] `/onboarding/step-1b-outlets` — auth gated; source-reviewed/listed
- [x] `/onboarding/step-2-inventory` — auth gated; source-reviewed/listed
- [x] `/onboarding/step-2-inventory/bulk-upload` — auth gated; source-reviewed/listed
- [x] `/onboarding/step-2-used` — auth gated; source-reviewed/listed
- [x] `/onboarding/step-3` — auth gated; source-reviewed/listed
- [x] `/onboarding/step-4` — auth gated; source-reviewed/listed
- [x] `/onboarding/step-5` — auth gated; source-reviewed/listed
- [x] `/onboarding/step-6` — auth gated; source-reviewed/listed
- [x] `/onboarding/three-wheelers` — auth gated; source-reviewed/listed
- [x] `/onboarding/three-wheelers/step-1` — auth gated; source-reviewed/listed
- [x] `/onboarding/three-wheelers/step-2` — auth gated; source-reviewed/listed
- [x] `/onboarding/three-wheelers/step-3` — auth gated; source-reviewed/listed
- [x] `/onboarding/three-wheelers/step-4` — auth gated; source-reviewed/listed
- [x] `/onboarding/three-wheelers/step-5` — auth gated; source-reviewed/listed
- [x] `/onboarding/two-wheelers` — auth gated; source-reviewed/listed
- [x] `/onboarding/two-wheelers/step-1` — auth gated; source-reviewed/listed
- [x] `/onboarding/two-wheelers/step-2` — auth gated; source-reviewed/listed
- [x] `/onboarding/two-wheelers/step-3` — auth gated; source-reviewed/listed
- [x] `/onboarding/two-wheelers/step-4` — auth gated; source-reviewed/listed
- [x] `/onboarding/two-wheelers/step-5` — auth gated; source-reviewed/listed

### Public Dealer Sites (45)

- [x] `/sites/__domain_not_found` — rendered or covered by public/sample sweep
- [x] `/sites/[slug]` — sample verified with `/sites/bharat-bhai`
- [x] `/sites/[slug]/[id]` — dynamic route listed; concrete visual QA depends on matching dealer vehicle id
- [x] `/sites/[slug]/about` — sample verified with `/sites/bharat-bhai/about`
- [x] `/sites/[slug]/cars` — sample verified with `/sites/bharat-bhai/cars`
- [x] `/sites/[slug]/cars/[id]` — dynamic route listed; concrete visual QA depends on matching 4W dealer vehicle id
- [x] `/sites/[slug]/contact` — sample verified with `/sites/bharat-bhai/contact`
- [x] `/sites/[slug]/privacy` — sample verified with `/sites/bharat-bhai/privacy`
- [x] `/sites/[slug]/sell` — sample verified with `/sites/bharat-bhai/sell`
- [x] `/sites/[slug]/service` — sample verified with `/sites/bharat-bhai/service`
- [x] `/sites/[slug]/terms` — sample verified with `/sites/bharat-bhai/terms`
- [x] `/sites/[slug]/three-wheelers` — sample verified with `/sites/bharat-bhai/three-wheelers`
- [x] `/sites/[slug]/three-wheelers/[id]` — dynamic route listed; concrete visual QA depends on matching 3W id
- [x] `/sites/[slug]/three-wheelers/about` — sample verified with `/sites/bharat-bhai/three-wheelers/about`
- [x] `/sites/[slug]/three-wheelers/cargo` — sample verified with `/sites/bharat-bhai/three-wheelers/cargo`
- [x] `/sites/[slug]/three-wheelers/compare` — sample verified with `/sites/bharat-bhai/three-wheelers/compare`
- [x] `/sites/[slug]/three-wheelers/contact` — sample verified with `/sites/bharat-bhai/three-wheelers/contact`
- [x] `/sites/[slug]/three-wheelers/electric` — sample verified with `/sites/bharat-bhai/three-wheelers/electric`
- [x] `/sites/[slug]/three-wheelers/emi-calculator` — sample verified with `/sites/bharat-bhai/three-wheelers/emi-calculator`
- [x] `/sites/[slug]/three-wheelers/fleet-roi` — sample verified with `/sites/bharat-bhai/three-wheelers/fleet-roi`
- [x] `/sites/[slug]/three-wheelers/new` — sample verified with `/sites/bharat-bhai/three-wheelers/new`
- [x] `/sites/[slug]/three-wheelers/offers` — sample verified with `/sites/bharat-bhai/three-wheelers/offers`
- [x] `/sites/[slug]/three-wheelers/passenger` — sample verified with `/sites/bharat-bhai/three-wheelers/passenger`
- [x] `/sites/[slug]/three-wheelers/privacy` — sample verified with `/sites/bharat-bhai/three-wheelers/privacy`
- [x] `/sites/[slug]/three-wheelers/service` — sample verified with `/sites/bharat-bhai/three-wheelers/service`
- [x] `/sites/[slug]/three-wheelers/terms` — sample verified with `/sites/bharat-bhai/three-wheelers/terms`
- [x] `/sites/[slug]/three-wheelers/used` — sample verified with `/sites/bharat-bhai/three-wheelers/used`
- [x] `/sites/[slug]/three-wheelers/used/[id]` — dynamic route listed; concrete visual QA depends on matching used 3W id
- [x] `/sites/[slug]/two-wheelers` — sample verified with `/sites/bharat-bhai/two-wheelers`
- [x] `/sites/[slug]/two-wheelers/[id]` — dynamic route listed; concrete visual QA depends on matching 2W id
- [x] `/sites/[slug]/two-wheelers/about` — sample verified with `/sites/bharat-bhai/two-wheelers/about`
- [x] `/sites/[slug]/two-wheelers/bikes` — sample verified with `/sites/bharat-bhai/two-wheelers/bikes`
- [x] `/sites/[slug]/two-wheelers/compare` — sample verified with `/sites/bharat-bhai/two-wheelers/compare`
- [x] `/sites/[slug]/two-wheelers/contact` — sample verified with `/sites/bharat-bhai/two-wheelers/contact`
- [x] `/sites/[slug]/two-wheelers/electric` — sample verified with `/sites/bharat-bhai/two-wheelers/electric`
- [x] `/sites/[slug]/two-wheelers/emi-calculator` — sample verified with `/sites/bharat-bhai/two-wheelers/emi-calculator`
- [x] `/sites/[slug]/two-wheelers/new` — sample verified with `/sites/bharat-bhai/two-wheelers/new`
- [x] `/sites/[slug]/two-wheelers/offers` — sample verified with `/sites/bharat-bhai/two-wheelers/offers`
- [x] `/sites/[slug]/two-wheelers/privacy` — sample verified with `/sites/bharat-bhai/two-wheelers/privacy`
- [x] `/sites/[slug]/two-wheelers/scooters` — sample verified with `/sites/bharat-bhai/two-wheelers/scooters`
- [x] `/sites/[slug]/two-wheelers/service` — sample verified with `/sites/bharat-bhai/two-wheelers/service`
- [x] `/sites/[slug]/two-wheelers/terms` — sample verified with `/sites/bharat-bhai/two-wheelers/terms`
- [x] `/sites/[slug]/two-wheelers/used` — sample verified with `/sites/bharat-bhai/two-wheelers/used`
- [x] `/sites/[slug]/two-wheelers/used/[id]` — dynamic route listed; concrete visual QA depends on matching used 2W id
- [x] `/sites/[slug]/user` — dynamic route listed; sample/user-state QA depends on customer session

### Tools (4)

- [x] `/tools/car-valuation` — rendered or covered by public/sample sweep
- [x] `/tools/emi-calculator` — rendered, fixed, and focused-rerun verified
- [x] `/tools/insurance-estimator` — rendered or covered by public/sample sweep
- [x] `/tools/on-road-price` — rendered or covered by public/sample sweep

## Template And Shared Surface Inventory

- [x] `ModernTemplate` — source-reviewed; shared offers and empty-state fixes applied
- [x] `LuxuryTemplate` — source-reviewed; shared offers and empty-state fixes applied
- [x] `SportyTemplate` — source-reviewed; shared offers and empty-state fixes applied
- [x] `FamilyTemplate` — source-reviewed; shared offers and empty-state fixes applied
- [x] `PremiumUsedDealerTemplate` — source-reviewed, fixed, and card symmetry rechecked
- [x] `PremiumUsedInventoryPage` — source-reviewed, fixed, and filter responsiveness rechecked
- [x] `OffersSection` — fixed and focused-rerun verified on dealer 2W pages
- [x] `FAQSection`, `ExchangeSection`, `FinanceSection`, `TrustBadgesSection`, `SellVehicleSection`, `ServiceBookingSection`, `LocationsMapSection`, `OnRoadPriceSection`, `VideoSection` — source-reviewed/listed as shared template sections
- [x] `SocialLinks` — active shared template surface rendered by the main public templates
- [x] `TemplateSelector`, `TemplatePreviewCard`, `TemplateWarning`, `TemplatePageLoader` — onboarding template selection surfaces listed/source-reviewed
- [x] `SiteHeader`, `SiteFooter`, `FooterPageShell`, `WelcomeClient` — app shell and public marketing surfaces listed/source-reviewed
- [x] `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `global-error.tsx` — app-level shell/error/loading surfaces listed/source-reviewed
- [x] `EMICalculator`/`EmiCalculator`, `OnRoadPriceSection`, route-level calculator pages — calculator surfaces listed/source-reviewed
- [x] `ReviewsSection`, `WhatsAppFAB`, `DealerChatbot`, `SocialLinks`, `SocialLinksFields` — floating/contact/social shared surfaces listed/source-reviewed
- [x] `MobileFilterDrawer`, `CarFilters`, `two-wheelers/FilterSidebar`, `three-wheelers/FilterSidebar` — filter surfaces listed/source-reviewed
- [x] `SimilarVehicles`, `UsedVehicleCard`, `FullSpecsSection`, 2W/3W used and similar cards — detail-related vehicle surfaces listed/source-reviewed
- [x] `CustomerPanelDashboard`, `/sites/[slug]/user` — customer-session surface listed; full QA depends on customer session state
- [x] `DomainOnboardingWizard`, `PurchaseManagedDomainModal`, dashboard domain flows — domain purchase/onboarding surfaces listed/source-reviewed
- [x] `WebsiteImageFields`, `SocialLinksFields`, onboarding template/image field groups — onboarding form surfaces listed/source-reviewed
- [x] `TwoWheelerTemplate`, `ThreeWheelerTemplate` — present in code; standalone header nav long-name hardening applied even though no active route imports were found in this audit pass
- [x] `CarCard`, `two-wheelers/VehicleCard`, `three-wheelers/VehicleCard` — fixed for text and spec-card readability
- [x] `two-wheelers/FilterSidebar`, `three-wheelers/FilterSidebar` — fixed for native select readability
- [x] `DealerChatbot` — fixed for narrow viewport panel sizing
- [x] `InventoryTable`, 2W/3W leads/service/bookings/used tables, insurance review table — fixed for readable dashboard table geometry
- [x] `PurchaseManagedDomainModal` — fixed for mobile search row and long domain wrapping

## Current Open Risks

- Dashboard and onboarding cannot be fully judged from a clean browser because protected routes redirect to login.
- Full auth-gated dashboard/onboarding completion still requires an authenticated dealer session or test account.
- The broad audit captured layout/readability signals, but not every possible authenticated data state, modal state, or dropdown state.
- Some remaining console warnings are performance hints such as LCP image priority, not direct symmetry/readability failures.
