# UI Readability Checklist

## Fixed

- [x] Marketing EMI result panel: force readable text, amount, suffix, breakdown values, and the eligibility CTA on the dark result surface.
- [x] Shared brand color utilities: use contrast ratio instead of luminance-only checks.
- [x] Generated website sections: offers, finance, service booking, exchange, trust badges, FAQ, video, and on-road calculator accents now use readable text colors on light cards.
- [x] Generated vehicle cards and drawers: car, two-wheeler, three-wheeler cards, wishlist drawer, reviews, EV tools, navbar EMI modal, quick views, and on-road dialogs now avoid raw low-contrast brand text.
- [x] Generated detail pages: two-wheeler, three-wheeler, and contact pages now use readable accent colors for price labels, icons, and secondary actions.
- [x] Main generated templates: Modern and Family template inline text accents now use readable accent colors while filled CTAs keep real brand colors.
- [x] Dedicated 2W/3W generated templates: hero badges, stat values, card icons, contact icons, outline actions, footer credits, service chips, and fallback logo initials now use readable foregrounds instead of raw brand accents.
- [x] Premium used dealer template: light-card gold labels/icons, used-car offer badges, verified chips, spec icons, and contact/form accents now inherit readable accent variables while gold-filled CTAs retain computed foreground text.
- [x] Static vehicle explorer: budget/body headings, offer CTAs, badges, brand rails, listing/trust backgrounds, and EMI result text now expose readable foreground/background pairs.
- [x] Homepage marketing iframe: cache-busted to the current readability build so the corrected finance/EMI styles are served instead of stale preview assets.
- [x] Shared footer: moved from token-muted text on a dark/transparent surface to explicit dark footer colors with readable section headings, links, and legal text.
- [x] Brand color contrast utility: `getContrastText` now chooses pure black or white by measured contrast ratio, so filled brand surfaces stay readable across all configured brand colors.
- [x] Premium used inventory cards: light-surface gold labels/icons now use readable brown accents; remaining bright gold usage is limited to dark header surfaces.
- [x] Generated fallback states: new-car no-stock, two-wheeler portal, and three-wheeler portal footer credits and CTA colors now use readable foregrounds on their light/dark surfaces.
- [x] Premium used dealer hero/search area: the hero now has a solid dark fallback behind the overlay, the search panel is solid white, and used-card spec labels use readable slate text.
- [x] Generated offer pages: 2W and 3W offer descriptions and validity text now use stronger slate text on pastel offer cards.
- [x] Shared generated chatbot badge: unread notification uses a darker red surface for readable white text.
- [x] Shared service booking section: duplicate service-location names now render with stable unique keys, removing the used-site dev issue badge.

## Verification Targets

- [x] Browser check: current rendered static vehicle explorer at `/design-system-handoff/ui_kits/marketing/index.html?v=design-system-20260630-readability-v85#finance` passed the computed finance contrast audit with 0 failures and no console errors.
- [x] Homepage iframe check: `/` now serves the marketing iframe with `design-system-20260630-readability-v85`, and the static file references `marketing.compiled.js?v=readability-v24`.
- [x] Finance panel proof: rendered `.vrf-emi-result-amount` computes to `rgb(255, 253, 247)` on `rgb(11, 14, 18)`, with `/mo`, labels, breakdown rows, and `Check eligibility` CTA also on explicit readable foreground/background colors.
- [x] Browser interaction check: changing the finance tenure chip from 5 to 7 years updated the EMI amount and kept the amount color at `rgb(255, 253, 247)`.
- [x] Local rendered audit: `/tools/emi-calculator`, `/cars`, `/bikes`, `/autos`, `/brands`, `/budget`, `/body-type`, `/tools/on-road-price`, `/tools/insurance-estimator`, `/demo/templates`, `/preview?template=luxury&brand=Toyota`, and the static marketing finance route all returned 0 visible contrast failures at 1440x900.
- [x] Local rendered audit: 23 targets covering public browse/tools routes, the static marketing finance route, and six generated template samples returned 0 visible contrast failures after rerunning `/ev` with a body wait.
- [x] Local interaction proof: editing `/tools/emi-calculator` vehicle price from `1000000` to `1200000` updated monthly EMI from `₹16,801` to `₹21,002`, with the post-change viewport captured at `/tmp/dealersite-emi-interaction-after.png`.
- [x] Source/CSS check: marketing EMI calculator result panel has explicit high-contrast text rules and cache-busted bundle references.
- [x] Source contrast matrix: 46 dynamic 2W/3W/used accent samples resolve to >= 4.5:1 foregrounds on the relevant light/dark backgrounds.
- [x] Source contrast matrix: all 110 configured brand primary entries, representing 46 unique brand colors, now resolve to readable filled foregrounds and light/dark accent fallbacks with 0 failures.
- [x] Browser/Puppeteer check: 22 route/viewport passes over `/`, live Lamborghini, live Tesla no-stock fallback, two used-site examples, 2W hub, KTM-flavored 2W new page, 2W offers, 3W hub, 3W new page, and 3W offers found the remaining generated-site contrast issues; a follow-up 8 route/viewport rerun over the patched used-site, 2W hub, and 3W hub pages returned 0 failures.
- [x] Browser availability note: live public dealer data covered Lamborghini, Tesla, and KTM examples; Ather Energy and Kawasaki were not available as live generated-site slugs in the current local data snapshot.
- [x] Console proof: `/sites/singh-auto-dealers-used` now renders with 0 filtered console warnings/errors and no visible Next.js dev issue badge after the service-location key fix.
- [x] Static check: `npx tsc --noEmit --pretty false --incremental false`, `git diff --check`, and raw brand-color text scan passed.

## Notes

- The in-app browser route-audit call timed out during the final broad pass, so the final multi-route contrast passes used the repo's installed Puppeteer fallback. Earlier in-app browser checks had already verified the static marketing finance route and a generated Lamborghini page directly.
- `/bikes` still logs a non-readability fetch error in the local console (`Failed to fetch cars`) and occasional Next.js LCP image priority warnings. The rendered text contrast audit for that route is clean.
