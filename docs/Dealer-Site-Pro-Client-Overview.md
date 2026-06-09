# Dealer Site Pro — Client-Facing Overview

---

## What is Dealer Site Pro?

Dealer Site Pro is a website builder platform designed exclusively for Indian automotive dealerships. It allows any dealer — whether they sell cars, bikes, or auto-rickshaws — to launch a fully functional, professional website without writing a single line of code.

---

## The Problem It Solves

Most small and mid-size dealerships in India either have no website at all, or rely on outdated, expensive ones built by agencies. They lose customers to competitors who show up on Google. They manage leads on paper or WhatsApp. They have no online presence for their inventory.

Dealer Site Pro fixes all of this in one platform.

---

## How It Works (Dealer Journey)

1. **Sign up** with email and password
2. **Walk through a guided setup** (5-6 steps) — enter dealership details, pick brands you sell, choose services you offer, select a design template, customize your homepage
3. **Go live** — get a free website instantly at `yourname.indrav.in`
4. **Manage everything** from a single dashboard — inventory, leads, reviews, bookings, analytics

That's it. No developers, no hosting bills, no maintenance headaches.

---

## What Dealers Get

### A. A Professional Public Website

- Vehicle catalog with search and filters (by brand, price, fuel type, body type)
- Individual vehicle pages with full specs, photos, and pricing
- Built-in tools for customers — EMI calculator, on-road price estimator, insurance quotes
- Contact form, test drive booking, service appointment booking
- Customer reviews section
- Fully mobile-responsive and SEO-optimized (shows up on Google)
- 4 design themes to choose from — Sporty, Modern, Family, Luxury
- Official brand colors applied automatically (Maruti blue, Tata teal, etc.)

### B. A Complete Dealer Dashboard

- **Inventory Management** — Add vehicles manually, look up details via RC number, upload photos, save drafts, mark as sold/reserved
- **Lead Management (CRM)** — Every inquiry, test drive request, and quote gets tracked with priority levels (hot/warm/cold) and status (new/contacted/converted/lost)
- **Reviews** — Collect, moderate, and reply to customer reviews. Sync reviews from Google.
- **Messages** — All contact form submissions in one inbox
- **Bookings** — Manage test drive and service appointments
- **Sell/Exchange Requests** — Customers can submit their vehicle for sale or exchange
- **Offers & Promotions** — Create and manage special deals
- **Analytics** — Track page views, unique visitors, leads generated, traffic sources, and conversions
- **Push Notifications** — Send browser notifications to website visitors
- **Domain Management** — Start with a free subdomain, upgrade to your own custom domain anytime

### C. Vehicle Type Support

- **4-Wheelers (Cars)** — New cars, used cars, certified pre-owned
- **2-Wheelers (Bikes & Scooters)** — New, used, electric
- **3-Wheelers (Auto-rickshaws)** — Passenger, cargo, electric
- Each category has its own dedicated pages, catalog data, and management tools

### D. Pre-Loaded Vehicle Data

- Thousands of vehicle models already in the system with specs, images, colors, and pricing
- Dealers just select what they sell — no need to enter data from scratch
- Covers all major Indian brands (Maruti Suzuki, Hyundai, Tata, Mahindra, Honda, Hero, Bajaj, TVS, Piaggio, and many more)

---

## APIs & Integrations — What Powers the Platform

### Vehicle Verification APIs

| API | What It Does |
|---|---|
| **RC Number Lookup** (Surepass) | Enter a vehicle registration number → instantly get owner name, make/model, fuel type, engine/chassis number, insurance status, fitness expiry, and pending challans. Costs ₹3 per lookup, tracked via credit system. Results cached for 24 hours. |
| **VIN Decoder** (NHTSA) | Enter a VIN number → get make, model, year, fuel type decoded automatically |
| **Draft Vehicle Creation** | RC lookup data auto-fills a draft vehicle listing. Dealer just adds photos and price to publish. Duplicate RC detection built in. |

### Inventory Management APIs

| API | What It Does |
|---|---|
| **Manual Vehicle CRUD** | Add, edit, delete vehicles with full details — make, model, variant, year, price, mileage, color, condition, photos |
| **Image Upload** | Upload vehicle photos to cloud storage with CDN delivery |
| **Cyepro DMS Sync** | Import inventory directly from Cyepro dealer management system. Server-side proxy with pagination, filtering, and price mapping. Includes diagnostic/test endpoint. |
| **AI Description Generator** | Uses Claude AI to auto-generate professional vehicle listing descriptions from specs. Rate-limited, input-sanitized. |
| **Used Vehicle Price Offers** | Set custom pricing on used vehicles from any source (manual or Cyepro) |

### Lead & CRM APIs

| API | What It Does |
|---|---|
| **Lead Submission** | Captures inquiries from dealer website. 5-minute duplicate detection. Auto-notifies dealer via SMS and email. Auto-forwards to Cyepro CRM if configured. |
| **Test Drive Booking** | Customers book test drives with preferred date/time. Creates both lead and booking records. |
| **Lead Management** | List, filter, and update lead status (new → contacted → qualified → converted → lost) with priority tracking |

### Service & Booking APIs

| API | What It Does |
|---|---|
| **Car Service Booking** | Customers book service appointments — general service, body repair, AC service, etc. Supports home pickup. Rate-limited. |
| **2W/3W Service Booking** | Dedicated service booking for bikes and autos |
| **Service Centers** | Manage multiple service center locations with working hours, images, and pricing tiers |

### Customer Engagement APIs

| API | What It Does |
|---|---|
| **Review Submission** | Customers submit reviews (rate-limited to 5/day per IP). Auto-approve or manual moderation. |
| **Review Moderation** | Dealers approve/reject/flag reviews, reply to them, feature best ones on homepage |
| **Google Review Sync** | Import reviews from Google Maps/Places automatically using Place ID |
| **Sell/Exchange Requests** | Customers submit their vehicle for sale — with photos, expected price, preferred inspection slot. Auto-emails confirmation. When dealer approves, auto-creates inventory listing. |
| **Customer Panel** | Customers look up their history (inquiries, test drives, sell requests) by phone/email |
| **Push Notifications** | Subscribe visitors to web push. Dealers broadcast notifications (new arrivals, price drops, announcements). |

### Payment & Subscription APIs

| API | What It Does |
|---|---|
| **Razorpay Subscription** | Create subscriptions for Pro/Premium plans. Handles trial periods. |
| **Payment Verification** | Verify Razorpay payments with signature validation. Idempotent — prevents duplicate charges. |
| **Vehicle Booking Payments** | Customers pay booking amounts online for 2W/3W vehicles. Order creation + payment verification. |
| **Razorpay Webhooks** | Handles subscription lifecycle events — activated, charged, cancelled, payment failed. Deduplication built in. |

### Domain Management APIs

| API | What It Does |
|---|---|
| **Subdomain Creation** | Auto-generates a free subdomain from business name + city |
| **Custom Domain Connect** | Connect your own domain. Registers on Vercel. Returns DNS records to configure. |
| **DNS Verification** | Verify A and CNAME records are configured correctly. Saves verification history. |
| **Domain Search** | Search available domains for purchase (Premium tier) |
| **Domain Monitoring** | Cron job checks SSL certificates and domain expiry every 12 hours |
| **Domain Resolution** | Edge middleware resolves subdomain/custom domain to dealer slug with Redis caching |

### Marketplace & Social APIs

| API | What It Does |
|---|---|
| **Cross-Dealer Marketplace** | Search across all dealers' inventory — filter by make, fuel, condition, body type, price, location |
| **Social Media Auto-Post** | Auto-post vehicle listings to Facebook Page, Instagram Business, and Twitter/X |

### Auth & Account APIs

| API | What It Does |
|---|---|
| **OTP Login** | Send OTP to email for passwordless authentication. Rate-limited. |
| **Registration Check** | Verify email/phone availability before signup |
| **Account Deletion** | GDPR-compliant account deletion with PII anonymization |

### Admin & System APIs

| API | What It Does |
|---|---|
| **Admin Dashboard** | List all dealers, manage catalog, deploy templates |
| **Template Deployment** | Push template + brand updates to dealer sites with ISR revalidation |
| **Health Check** | Monitor Supabase, Razorpay, Vercel connectivity |
| **API Credit Tracking** | Track per-dealer API usage and costs (RC lookups, etc.) |

### Utility APIs

| API | What It Does |
|---|---|
| **Finance Pre-Check** | Redirect to finance partner for loan eligibility |
| **FASTag Recharge** | Redirect to FASTag recharge partner |
| **Brand Catalog** | Get models for specific make with preview data |

---

## External Service Integrations

| Service | Purpose |
|---|---|
| **Supabase** | Database (PostgreSQL), Auth, Storage, Edge Functions |
| **Razorpay** | Payments, subscriptions, webhooks |
| **Surepass** | RC number lookup, challan status |
| **Rapidor** | RC lookup fallback provider |
| **NHTSA** | VIN number decoding |
| **Cyepro DMS** | Dealer management system inventory sync |
| **Claude AI (Anthropic)** | Vehicle description generation |
| **Cloudflare** | DNS management, domain verification |
| **GoDaddy** | Domain registration |
| **Vercel** | Hosting, deployment, edge functions |
| **Upstash Redis** | Domain caching, rate limiting |
| **Google Places** | Review sync from Google Maps |
| **Meta Graph API** | Facebook & Instagram posting |
| **Twitter/X API** | Twitter posting |
| **Resend** | Transactional emails |
| **Sentry** | Error monitoring |
| **Google Maps** | Location embedding |

---

## API Statistics

- **85+ API endpoints**
- **3 vehicle categories** with dedicated APIs each
- **12+ external service integrations**
- **Rate limiting** on all critical endpoints
- **Redis caching** for performance
- **Idempotency** on payment operations
- **Credit tracking** for paid API calls
- **JWT authentication** on all protected routes
- **Row-level security** — dealers only access their own data

---

## Payment & Pricing Model

- Dealers can start with a **free plan** (subdomain website with core features)
- Upgrade to **Pro/Premium/Enterprise** for custom domains, advanced analytics, and priority support
- RC lookups charged at **₹3 per call** with usage dashboard
- Vehicle booking payments collected online
- All payments processed securely through **Razorpay** with webhook-based lifecycle management

---

## Why Dealers Should Use This

| Without Dealer Site Pro | With Dealer Site Pro |
|---|---|
| No website or an outdated one | Professional site live in minutes |
| Leads tracked on paper/WhatsApp | Full CRM with priority & status tracking |
| No online inventory | Searchable catalog with filters & photos |
| Customers can't find you on Google | SEO-optimized pages that rank locally |
| Pay agencies lakhs for a basic site | Start free, upgrade when ready |
| Separate tools for everything | One dashboard for inventory, leads, reviews, analytics |
| No customer engagement tools | EMI calculator, test drive booking, push notifications |
| Manual vehicle data entry | RC lookup auto-fills details in seconds |
| Can't verify vehicle history | Surepass shows challans, insurance, fitness status |
| No social media presence | Auto-post listings to Facebook, Instagram, Twitter |
| No analytics | Track views, leads, conversions, traffic sources |

---

## Key Technical Highlights (For Technical Stakeholders)

- Built on modern web stack — Next.js, Supabase, TypeScript
- Multi-tenant architecture — one platform serves unlimited dealers
- Server-rendered pages for fast loading and SEO
- Edge caching for instant domain resolution
- Row-level security — each dealer only sees their own data
- Integrates with Surepass (RC verification), Razorpay (payments), Cloudflare (DNS), and Cyepro (DMS)
- 40+ database tables, 85+ API endpoints, 142 UI components

---

## In One Line

**Dealer Site Pro is the Shopify for Indian car, bike, and auto dealerships — everything a dealer needs to get online, manage inventory, capture leads, and grow their business, all from one platform.**
