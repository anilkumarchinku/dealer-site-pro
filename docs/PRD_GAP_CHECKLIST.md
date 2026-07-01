# DealerSite Pro PRD Gap Checklist

Audit date: 2026-06-30

PRD reviewed: `/Users/anilkumarkolukulapalli/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/15227964-32A5-471E-A377-7989D40C1062/DealerSitePro_PRD.pdf`

Legend:

- `Implemented`: Present in the repo and mapped to app routes/services/components.
- `Partial`: Present, but needs validation, polish, deeper wiring, or completion.
- `Missing / unclear`: Not found clearly enough in the code audit.
- `External setup`: Code exists, but real behavior depends on provider keys/DNS/webhooks.

## Executive Summary

DealerSite Pro already covers most of the PRD foundation: onboarding, public dealer websites, car/bike/auto catalogues, used inventory, Cyepro hooks, leads, sell requests, service bookings, domains, reviews, push notifications, payments, and a super-admin 360 panel.

The main gaps were not basic screens. The 2026-06-30 implementation pass added public analytics tracking, lead/test-drive conversion counters, realtime lead inbox refresh, buyer transaction links for finance/insurance/FASTag, an interactive 360 gallery viewer, and a super-admin operations health panel.

Remaining work is mostly provider/config validation and deeper end-to-end QA across real dealer data.

## Core Product

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| SaaS platform for dealerships | Implemented | Next.js app with onboarding, dashboard, public dealer sites, admin routes, Supabase schema. |
| Dealer, Buyer, CyePro Admin roles | Implemented | Auth routes, dealer dashboard, public buyer pages, `/admin` and `/admin/360`. |
| 4W, 2W, 3W support | Implemented | Routes and APIs exist for cars, bikes/two-wheelers, autos/three-wheelers. |
| Used vehicles | Implemented | `/dashboard/used-vehicles`, used APIs, premium used dealer template. |
| Custom domains | Implemented / External setup | Domain UI/API, DNS verification, Vercel/Cloudflare/GoDaddy style services exist; production needs keys and DNS validation. |
| Analytics | Implemented / Needs QA | Public site tracker and lead/test-drive conversion writes now feed `analytics_daily`; verify production volume and attribution. |

## Dealer Onboarding

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| Register/login with OTP | Implemented | `/api/auth/send-otp`, OTP services/actions, auth pages. |
| Business info | Implemented | Onboarding saves name, location, address, map link, phone, email, GSTIN, years, branches. |
| Dealer profile types | Implemented | `dealer_type`, new/used flags, 2W/3W/4W flags saved. |
| Inventory setup: selected brands | Implemented | `dealer_brands` saved by vehicle type. |
| Inventory setup: bulk CSV/upload | Implemented | Bulk upload route/page and uploaded vehicles saved to `vehicles`. |
| Inventory setup: Cyepro API key | Implemented / External setup | Key is saved and `/api/inventory/cyepro` exists; actual fetch depends on valid Cyepro endpoint/key. |
| Inventory setup: manual add | Implemented | `/dashboard/inventory/add`, vehicle APIs and upload image APIs. |
| Services selected during onboarding | Implemented | `dealer_services` saved and used in generated dealer templates. |
| Website style templates | Implemented | Luxury, Sporty, Family, Professional/Modern and Premium Used template present. |
| Hero headline, CTA, social links, working hours | Implemented | Saved through `dealer_template_configs`. |
| Logo and hero image upload | Implemented | `brandLogo` and `heroImage` uploaded to Supabase storage and displayed via site asset helpers. |
| Publish to dealer subdomain | Implemented | Save flow registers active subdomain/domain row and site route renders by slug. |

## Public Dealer Website

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| Home page | Implemented | `/sites/[slug]` renders selected template. |
| Catalogue pages | Implemented | `/sites/[slug]/cars`, `/two-wheelers`, `/three-wheelers`. |
| Vehicle detail page | Implemented | `/sites/[slug]/[id]` plus vehicle detail components. |
| About page | Implemented | `/sites/[slug]/about`. Needs content parity QA per template. |
| Contact page | Implemented | `/sites/[slug]/contact`. Needs form/CRM end-to-end QA. |
| Sell/trade-in page | Implemented | `/sites/[slug]/sell`, sell request API and upload API. |
| Service page | Implemented | `/sites/[slug]/service`, car/2W/3W service booking APIs. |
| Sticky nav, hero, CTA, WhatsApp/call | Implemented | Present in templates, especially premium used and existing style templates. |
| Vehicle filters by brand/price/fuel | Implemented / Needs QA | Filters exist in public components/templates; verify all combinations with fetched Cyepro/manual data before release. |
| EMI calculator | Implemented | Shared EMI components and template sections. |
| Reviews/testimonials | Implemented | Reviews APIs, public reviews section, dashboard review moderation. |
| Google Maps embed/contact map | Implemented / Needs QA | Map link/address captured; template rendering should be checked per template. |
| Offers section | Implemented | Dealer offers API/dashboard and template offers section. |

## Lead Management

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| Lead inbox | Implemented | `/dashboard/leads`, `/api/leads`. |
| Website form leads | Implemented | Public lead API maps source/type and saves leads. |
| WhatsApp CTA | Implemented | Public templates include WhatsApp/call actions. |
| Manual walk-in lead capture | Implemented | `/api/dashboard/leads` creates `source='walk_in'`; dashboard dialog exists. |
| Fields: name, phone, vehicle, type, timestamp | Implemented | Lead queries include customer, phone, vehicle interest, lead type, source, created time. |
| Hot/Warm/Cold priority | Implemented | Dashboard priority filters/counts and API validation. |
| Follow-up reminders | Implemented | `follow_up_date`, due banner, snooze, follow-up filter. |
| Contacted/converted/lost statuses | Implemented | Status update API and dashboard actions exist. |
| 2W lead types | Implemented | 2W lead APIs/schemas/routes exist. |
| Cyepro lead sync | Implemented / External setup | Sync status and admin alerts exist; actual CRM push depends on Cyepro API behavior. |

## Inventory

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| Manual vehicle add/edit | Implemented | Dashboard inventory add and vehicle APIs. |
| Multi-photo upload | Implemented | Vehicle upload APIs and gallery/image fields exist. |
| 360-degree gallery | Implemented / Needs content | Detail pages now show an interactive 360 gallery when enough ordered images exist; dealers still need to upload angle coverage. |
| Used listings | Implemented | Manual used inventory and Cyepro used inventory merge. |
| Brand catalog fallback | Implemented | Static 4W/2W/3W catalog services and dashboard catalog. |
| AI description | Implemented / External setup | `/api/ai/generate-description`; depends on configured AI provider. |
| VIN lookup | Implemented / External setup | `/api/vehicles/decode-vin`; external NHTSA call. |
| RC lookup | Implemented / External setup | `/api/vehicles/rc-lookup`, Surepass function/provider config. |
| Cyepro inventory sync | Partial / External setup | Service and test route exist; current production success needs valid Cyepro endpoint/key. |

## Services And Transactions

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| Service booking | Implemented | Car service bookings and 2W/3W service booking APIs/dashboard pages. |
| Sell/trade-in request | Implemented | Sell request form/API/dashboard. |
| EMI calculator | Implemented | Public and tool pages. |
| Finance pre-check | Implemented / External setup | Public finance section links to `/api/finance/precheck`; partner URL must be configured. |
| Insurance quote requests | Implemented / Needs QA | Public finance section links buyers to the insurance estimator/request path; confirm CRM handoff expectations. |
| FASTag recharge | Implemented / External setup | Public finance section links to `/api/fastag/recharge`; partner URL must be configured. |
| Razorpay payments/subscriptions | Implemented / External setup | Subscription, booking orders, verification and webhook code exist; requires live keys/webhook config. |

## Dashboard

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| Overview | Implemented | `/dashboard`. |
| Leads | Implemented | `/dashboard/leads`. |
| Sell requests | Implemented | `/dashboard/sell-requests`. |
| Service | Implemented | `/dashboard/service`. |
| Insurance | Implemented | `/dashboard/insurance`. |
| Push notifications | Implemented | `/dashboard/push-notifications` and push APIs. |
| Inventory | Implemented | `/dashboard/inventory`. |
| Messages | Implemented | `/dashboard/messages`. |
| Analytics | Implemented / Needs QA | UI/read model exists and public tracker now writes page/CTA/conversion metrics. |
| Reviews | Implemented | `/dashboard/reviews`, Google sync route. |
| Catalog performance | Partial | Catalog dashboard exists; performance metrics appear limited compared with PRD wording. |
| 2W dashboard group | Implemented | Overview, inventory, used, leads, service, bookings. |
| 3W dashboard group | Implemented | Overview, inventory, used, leads, service, bookings. |
| 2nd hand used vehicles | Implemented | `/dashboard/used-vehicles`. |
| Webpage editor | Implemented | `/dashboard/webpage`. |
| Domains | Implemented | `/dashboard/domains`. |

## Custom Domains

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| Free subdomain | Implemented | Created on publish and routed by slug. |
| Search/buy managed domain | Implemented / External setup | Domain search/purchase services and UI exist; provider keys required. |
| Connect existing domain | Implemented / External setup | Custom domain prepare/connect/verify APIs exist; DNS/provider config required. |
| DNS instructions | Implemented | Domain onboarding components and email support exist. |
| Auto verification | Implemented / External setup | DNS verify/cron/check APIs exist; depends on DNS propagation/provider config. |
| SSL status | Implemented / External setup | SSL check/status APIs exist; depends on Vercel/domain setup. |

## Super Admin

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| Platform admin auth | Implemented | `/admin` and admin session checks. |
| Dealer/user 360 view | Implemented | `/admin/360` plus `/api/admin/dealers-360`. |
| Dealer KPIs | Implemented | Leads, vehicles, services, subscriptions, reviews, rankings. |
| Cyepro vs non-Cyepro split | Implemented | Admin 360 KPIs include Cyepro split. |
| Inventory audit | Implemented | `/admin/inventory-audit`. |
| Template deploy/admin controls | Implemented | `/api/admin/deploy-template`, preview gallery. |
| Platform-wide operational alerts | Implemented / Needs provider data | `/admin/360` now includes operations health for env config, failed syncs, domains, subscriptions, and webhooks. |

## Tech And Security

| PRD item | Status | Evidence / note |
| --- | --- | --- |
| Next.js + TypeScript | Implemented | App Router codebase. |
| Supabase Auth/PostgreSQL | Implemented | Supabase clients, auth, migrations. |
| RLS | Implemented | Multiple migrations enable RLS and owner/public policies. |
| Zustand | Implemented | Onboarding store and client state. |
| Tailwind/shadcn-style UI | Implemented | Tailwind classes and UI components. |
| Vercel hosting | Implemented / External setup | Vercel services and deployment/domain paths exist. |
| Realtime subscriptions | Implemented / Needs QA | Lead inbox now subscribes to Supabase `postgres_changes` and refreshes on lead mutations. |
| Multi-tenant architecture | Implemented | Public dealer routes render by slug/domain on the shared app. |

## Permission Needed: Recommended Fix Order

1. Configure and test external providers: Cyepro, Razorpay, GoDaddy/domain provider, Vercel domain API, RC lookup provider, AI description provider, finance pre-check, and FASTag.
2. End-to-end QA finance pre-check, insurance quote, FASTag, service booking, sell request, contact/enquiry, WhatsApp, and test-drive flows.
3. QA all public templates against onboarding data: logo, hero, services, offers, contact, map, working hours, social links, filters, 360 image coverage, and mobile layout.
4. Extend realtime refresh to messages/service bookings if the product requires those screens to update without refresh too.
5. Add richer admin alert types over time: stale inventory, high failed Cyepro rate, failing image URLs, and provider latency.
6. Run a PRD acceptance test pass on one 4W new dealer, one used-only dealer, one hybrid dealer, one 2W dealer, and one 3W dealer.
