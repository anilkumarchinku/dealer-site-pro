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

## Public Platform Pages

- [x] Checked: `/`, `/about`, `/contact`, `/dealers`, `/privacy`, `/terms`, `/disclaimer`, `/sitemap`
- [x] Checked: `/vehicles`, `/marketplace`, `/cars`, `/autos`, `/bikes`, `/brands`, `/brands-accordion`
- [x] Checked: `/body-type`, `/budget`, `/ev`, `/upcoming`, `/compare`, `/sell`
- [x] Checked: `/tools/emi-calculator`, `/tools/on-road-price`, `/tools/insurance-estimator`, `/tools/car-valuation`
- [x] Fixed: `/autos` card symmetry now uses equal-height cards, stable 2x2 spec slots, two-line model text, and bottom-pinned CTA.
- [x] Fixed: `/tools/emi-calculator` range controls now have enough vertical height and no longer clip in desktop/mobile checks.
- [x] Fixed: `/cars-demo` now loads a lighter 24-car sample and resolves the Mercedes brand data alias, removing the focused timeout/404 issue.
- [x] Fixed: `/brands-accordion` brand logos now keep explicit image dimensions and no longer trigger the Next image sizing warning in focused checks.

## Auth And Account Pages

- [x] Checked: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/update-password`, `/reset`
- [x] Fixed earlier in this workstream: register page no longer shows the extra left security panel.
- [ ] Pending: normalize validation message wording across auth, onboarding, and public lead forms.

## Dealer Dashboard Pages

- [x] Auth gated: `/dashboard`, `/dashboard/leads`, `/dashboard/sell-requests`, `/dashboard/messages`, `/dashboard/reviews`, `/dashboard/analytics`
- [x] Auth gated: `/dashboard/inventory`, `/dashboard/inventory/add`, `/dashboard/inventory/[id]/edit`, `/dashboard/used-vehicles`
- [x] Auth gated: `/dashboard/offers`, `/dashboard/service`, `/dashboard/insurance`, `/dashboard/push-notifications`
- [x] Auth gated: `/dashboard/catalog`, `/dashboard/deployment`, `/dashboard/domains`, `/dashboard/settings`, `/dashboard/help`
- [x] Auth gated: `/dashboard/two-wheelers/*` and `/dashboard/three-wheelers/*`
- [x] Fixed: `/dashboard/leads` filter controls now use a responsive grid instead of cramped fixed-width controls.
- [ ] Pending: full dashboard visual QA inside an authenticated dealer session.

## Onboarding Pages

- [x] Source-reviewed: `/onboarding` and 4W/2W/3W onboarding layouts and shared components.
- [x] Fixed earlier in this workstream: vehicle type selection is single-select instead of multi-select.
- [x] Fixed: website image/logo upload fields have more stable symmetric preview dimensions.
- [ ] Pending: screenshot pass through all onboarding steps with an authenticated session.

## Public Dealer Website Routes

- [x] Checked: `/sites/[slug]`, `/sites/[slug]/about`, `/sites/[slug]/contact`, `/sites/[slug]/privacy`, `/sites/[slug]/terms`, `/sites/[slug]/sell`, `/sites/[slug]/service`
- [x] Checked: `/sites/[slug]/cars`
- [x] Checked: `/sites/[slug]/two-wheelers`, `/new`, `/used`, `/bikes`, `/scooters`, `/electric`, `/offers`, `/compare`, `/emi-calculator`, `/service`, `/contact`, `/about`, and one catalog detail route.
- [x] Checked: `/sites/[slug]/three-wheelers`, `/new`, `/used`, `/passenger`, `/cargo`, `/electric`, `/offers`, `/compare`, `/emi-calculator`, `/fleet-roi`, `/service`, `/contact`, `/about`
- [x] Fixed: 2W and 3W cards now allow two-line model names and two-line spec values with stable spec-cell height.
- [x] Fixed: 2W and 3W native filter selects now force readable foreground color.
- [x] Fixed: 2W/3W template empty states now say `No bikes...` / `No autos...` based on vehicle type instead of falling back to car copy.
- [x] Fixed earlier in this workstream: public lead modals no longer require email where email is optional or absent.
- [x] Fixed earlier in this workstream: catalog lead submissions no longer fail by saving `cat-*` IDs into UUID columns.
- [x] Fixed earlier in this workstream: 2W on-road price dialog displays State and Variant text clearly.
- [ ] Pending: route-specific 4W car detail and used-car detail screenshots with a dealer slug that has matching 4W inventory.

## Template Surfaces

- [x] Source-reviewed: `ModernTemplate`, `LuxuryTemplate`, `SportyTemplate`, `FamilyTemplate`
- [x] Source-reviewed: `PremiumUsedDealerTemplate`, `PremiumUsedInventoryPage`
- [x] Source-reviewed: template sections for offers, FAQ, exchange, finance, trust badges, sell vehicle, service booking, locations, on-road price, and video.
- [x] Fixed: premium used dealer cards now use equal-height flex layout, clamped title/variant text, stable spec text height, and bottom-pinned CTA row.
- [x] Fixed: premium used inventory filters now use a less cramped responsive grid with visible compact labels.
- [x] Fixed: Modern, Luxury, Sporty, and Family templates pass vehicle-type-specific empty-state copy into shared vehicle grids.
- [ ] Pending: screenshot each template with controlled sample data, including long dealer names and long model/variant names.

## Preview And Demo Pages

- [x] Checked: `/preview`, `/design-previews`, `/full-design-previews`, `/five-landing-previews`
- [x] Checked: `/clean-design-preview`, `/clean-enhanced-preview`, `/clean-design-full`, `/clean-design-full-v2`, `/clean-design-full-v3`, `/clean-design-full-v4`, `/clean-design-same-images`
- [x] Checked: `/demo/templates`, `/demo/next-level-templates`
- [x] Fixed: `/cars-demo` passed focused desktop/mobile checks after reducing payload size and adding the missing brand file alias.

## Verification Completed

- [x] Broad Puppeteer sweep: 80 routes x desktop/mobile, screenshots saved to `/tmp/dealersite-ui-audit/screenshots`.
- [x] Post-fix sweep: `/autos`, `/sites/bharat-bhai/cars`, `/sites/bharat-bhai/two-wheelers`, `/sites/bharat-bhai/two-wheelers/new?brand=royal-enfield`, `/sites/bharat-bhai/three-wheelers`, `/tools/emi-calculator`.
- [x] Post-fix sweep 2: `/marketplace`, `/dashboard/leads`, `/autos`, `/sites/bharat-bhai/two-wheelers`, `/sites/bharat-bhai/three-wheelers`, `/tools/emi-calculator`.
- [x] Device compatibility sweep: 80 routes across mobile `390x900`, tablet `820x1000`, and desktop `1440x1000`; results saved to `/tmp/dealersite-ui-audit/device-compat-3vp`.
- [x] Focused rerun: `/sites/bharat-bhai` tablet transient dev-overlay failure did not reproduce and rendered cleanly.
- [x] Focused rerun: `/sites/bharat-bhai/two-wheelers/scooters` redirected cleanly and now shows `No bikes found matching your criteria.`
- [x] `npx tsc --noEmit --pretty false --incremental false`
- [x] `git diff --check`

## Current Open Risks

- Dashboard and onboarding cannot be fully judged from a clean browser because protected routes redirect to login.
- The broad audit captured layout/readability signals, but not every possible data state, modal state, dropdown, empty state, or long-content variant.
- Some remaining console warnings are performance hints such as LCP image priority, not direct symmetry/readability failures.
