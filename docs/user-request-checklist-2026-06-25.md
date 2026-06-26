# User Request Checklist - 2026-06-25

Scope: DealerSite Pro landing, onboarding, vehicle search, generated dealer templates, auth, dashboard, and public site behavior.

## In Progress / Implemented In This Pass

- [x] Vehicle search listing: add an in-filter `2W / 3W / 4W` toggle.
- [x] Vehicle search listing: make brand filters dynamic to the selected `2W / 3W / 4W` category.
- [x] Vehicle search listing: keep compact vehicle cards after the category toggle change.
- [x] Social links: make saved dealer social links open correctly on generated template pages.
- [x] Onboarding service selection: remove `parts_accessories` / parts & accessories from selectable services.
- [x] Template inventory page: remove the word "Our" from "Our Inventory".
- [x] Forgot password: accept email or mobile number, resolve the linked account, and send a password reset link.
- [x] Browser support research: target modern Chrome, Safari, Edge, Firefox, Chrome Android, Safari iOS, and Samsung Internet; use MDN Baseline/core-browser support as the feature standard.

## Ready To Implement Next

- [ ] Vehicle search: harden search so make, model, variant, body, fuel, dealer/location, and category all search consistently.
- [ ] Template nav: Home should scroll to the hero section on every template.
- [ ] Template nav: when a nav item targets a section with a form, focus the first fillable field after scroll.
- [ ] Template filters: add a two-handle price range control where the current price filter only behaves like a one-sided dot.
- [ ] First-hand website filters: hide the year filter.
- [ ] Template filters: keep a separate scroll area for filters.
- [ ] Template filters: clear filter should auto-apply immediately without requiring refresh.
- [ ] Model page: Overview tab should scroll/show the hero portion.
- [ ] Model page: hide image count like `1/7` when the hero gallery is not visible.
- [ ] Landing builder brand marquee: remove Ashok Leyland if it is not a real available brand in the current data.
- [ ] Remove visible/developer-facing `CarDekho` naming from code/project surfaces where possible.
- [ ] Onboarding services: add optional review field/section.
- [ ] Cursor behavior: only show pointer hand on clickable controls across templates.

## Needs Product/Data/API Details Before Honest Completion

- [ ] Email notifications: send one email to the dealer/lead owner and one thank-you email to the customer. Needs the exact template/copy from the user.
- [ ] Offers: add offer section to every template and dashboard controls for showing/managing offers. Need to confirm if existing `offers` table/API covers all vehicle/template types or needs migration.
- [ ] EV section: use viewer location and show nearby EV charging stations. Needs location permission UX and a charging-station data source/API.
- [ ] Google reviews: show existing selected dealer reviews from Google Maps. Needs Google Places API key, dealer place ID mapping, and policy-compliant caching/display.
- [ ] Remove customer plan at the end of each template: need exact template/page reference if multiple pricing/plan sections exist.
- [ ] Brand-specific starting/ending range and available colors: need to confirm source of canonical brand/model colors and whether it is DB-only or static catalog fallback.

## Notes

- Keep edits behavior-preserving and scoped because the worktree already has many unrelated modified/untracked files.
- Do not mark API-dependent items complete unless the real API/data flow exists and is verified.
