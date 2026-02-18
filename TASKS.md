# DealerSite Pro — Build Task Tracker
> Use this file as the JIRA/sprint board for all agent work.
> Each agent reads this file, picks a task, marks it IN PROGRESS, builds it, then marks DONE.

---

## Legend
```
Status: [ ] TODO | [~] IN PROGRESS | [x] DONE | [!] BLOCKED
Priority: 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | 🟢 LOW
```

---

## Architecture Summary (READ BEFORE WORKING)

```
User visits bharat-hyundai.com
        ↓
middleware.ts detects non-main domain
        ↓
Calls /api/domains/resolve?domain=bharat-hyundai.com  ← MISSING
        ↓
Returns dealer slug "bharat-hyundai"
        ↓
Rewrites to /sites/bharat-hyundai
        ↓
app/sites/[slug]/page.tsx fetches dealer from Supabase
        ↓
Renders LuxuryTemplate / FamilyTemplate / SportyTemplate / ModernTemplate
        ↓
Dealer's branded site with their cars, contact info, services
```

**Two deployment modes:**
1. **Multi-tenant (main app):** `/sites/[slug]` — one app, all dealers. PREFERRED.
2. **Standalone (GitHub + Vercel):** Each dealer gets their own Next.js site deployed separately.

---

## SPRINT 1 — Critical Infrastructure 🔴
> Blocking everything. Fix these first.

---

### T001 — Add dealer_deployments migration
- **Status:** [x] DONE
- **Priority:** 🔴 CRITICAL
- **File:** `supabase/migrations/20260218_dealer_deployments.sql`
- **Why:** The deploy pipeline writes to `dealer_deployments` table but the migration doesn't exist. Every deploy call fails with a DB error.
- **What to build:**
  ```sql
  CREATE TABLE IF NOT EXISTS dealer_deployments (
      id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      dealer_id         UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
      github_repo       TEXT,
      vercel_project    TEXT,
      vercel_deploy_id  TEXT,
      domain            TEXT,
      status            TEXT NOT NULL DEFAULT 'queued'
                            CHECK (status IN ('queued','building','ready','error','cancelled')),
      error_message     TEXT,
      site_url          TEXT,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE INDEX idx_dealer_deployments_dealer ON dealer_deployments(dealer_id);
  CREATE INDEX idx_dealer_deployments_status ON dealer_deployments(status);
  -- RLS
  ALTER TABLE dealer_deployments ENABLE ROW LEVEL SECURITY;
  CREATE POLICY dealer_deployments_own ON dealer_deployments
      FOR ALL USING (
          dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
      );
  -- updated_at trigger
  CREATE TRIGGER dealer_deployments_updated_at
      BEFORE UPDATE ON dealer_deployments
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  ```
- **Acceptance:** File created, SQL is valid, migration applied to Supabase.

---

### T002 — Custom domain resolve API endpoint
- **Status:** [x] DONE
- **Priority:** 🔴 CRITICAL
- **File:** `app/api/domains/resolve/route.ts`
- **Why:** When `bharat-hyundai.com` hits the middleware, it needs to look up which dealer slug maps to that domain. Currently it just uses the hostname as the slug, which fails.
- **What to build:**
  ```
  GET /api/domains/resolve?domain=bharat-hyundai.com

  Response:
  { slug: "bharat-hyundai", dealerId: "uuid" }   ← 200 found
  { error: "Domain not found" }                   ← 404 not found
  ```
  - Query `dealer_domains` table: `WHERE custom_domain = domain AND status = 'active'`
  - Join to `dealers` to get `slug`
  - Also check `subdomain_url` column for subdomain matches
  - Cache-Control: max-age=60 (1 minute cache)
- **Acceptance:** `curl /api/domains/resolve?domain=test.com` returns correct JSON.

---

### T003 — Fix middleware custom domain routing
- **Status:** [x] DONE
- **Priority:** 🔴 CRITICAL
- **File:** `middleware.ts`
- **Why:** Currently when a custom domain like `bharat-hyundai.com` hits the app, middleware rewrites to `/sites/bharat-hyundai.com` (using the raw hostname) instead of the dealer's slug. This shows "Coming Soon" because no dealer has slug `bharat-hyundai.com`.
- **What to build:** In the `!isMainDomain && !USE_SUBDOMAIN` block, replace the current logic with:
  1. Check in-memory cache first
  2. Call `/api/domains/resolve?domain=${hostname}` internally
  3. On success: rewrite to `/sites/{slug}`
  4. On failure: rewrite to `/sites/__domain_not_found` or show 404
  - Must be fast (Edge runtime) — use `fetch` with short timeout
- **Acceptance:** Custom domain visitor sees dealer's site, not "Coming Soon".

---

## SPRINT 2 — Template Quality 🟠
> The actual product. What dealers and their customers see.

---

### T004 — Improve ModernTemplate (Professional)
- **Status:** [x] DONE
- **Priority:** 🟠 HIGH
- **File:** `components/templates/ModernTemplate.tsx`
- **What to improve:**
  - Add proper lead capture form (Name, Phone, Email, Message) that POSTs to `/api/leads`
  - Add SEO-friendly section headings
  - Services section: render `services` prop as cards with icons
  - Working hours in footer from `dealer.workingHours`
  - WhatsApp float button (bottom-right) using dealer's whatsapp number
  - Sticky header with contact CTA
  - Make responsive on mobile (verify all breakpoints)
  - Remove hardcoded "placeholder-car.jpg" fallback — use a proper gradient placeholder
- **Acceptance:** Template looks polished, has lead form, works on mobile, WhatsApp button works.

---

### T005 — Improve LuxuryTemplate
- **Status:** [x] DONE
- **Priority:** 🟠 HIGH
- **File:** `components/templates/LuxuryTemplate.tsx`
- **What to improve:**
  - Same as T004 (lead form, services, WhatsApp, working hours)
  - Luxury-specific: gold/dark color palette, serif font headers
  - Featured vehicles carousel (not just a grid)
  - "Request Private Viewing" CTA instead of generic "Enquire"
  - Testimonials section (placeholder if no reviews)
  - Remove reliance on local logo images (many will be missing)
- **Acceptance:** Template looks luxury-brand quality.

---

### T006 — Improve SportyTemplate
- **Status:** [x] DONE
- **Priority:** 🟠 HIGH
- **File:** `components/templates/SportyTemplate.tsx`
- **What to improve:**
  - Same as T004 (lead form, services, WhatsApp, working hours)
  - Sporty-specific: bold typography, red/dark palette, performance stats
  - Full-width hero with overlay text
  - "Test Drive Today" primary CTA
  - Car specs highlighted (engine, transmission, fuel type)
- **Acceptance:** Template looks performance-brand quality.

---

### T007 — Improve FamilyTemplate
- **Status:** [x] DONE
- **Priority:** 🟠 HIGH
- **File:** `components/templates/FamilyTemplate.tsx`
- **What to improve:**
  - Same as T004 (lead form, services, WhatsApp, working hours)
  - Family-specific: warm, approachable colors (blue/teal), friendly copy
  - EMI calculator section (simple: price × 0.02 for 5yr approximation)
  - "Family-Safe" badges on suitable cars (seatingCapacity >= 6)
  - Trust signals: "Est. X years", Google rating placeholder
- **Acceptance:** Template looks trustworthy and family-friendly.

---

### T008 — Add SEO + metadata to /sites/[slug]
- **Status:** [x] DONE
- **Priority:** 🟠 HIGH
- **File:** `app/sites/[slug]/page.tsx` + `app/sites/[slug]/layout.tsx`
- **What to build:**
  - Export `generateMetadata` function
  - Title: `{dealerName} | {location} | Cars`
  - Description: `{tagline}` or auto-generated from brands + location
  - OG tags: title, description, image (first car image or logo)
  - Canonical URL pointing to the dealer's primary domain
- **Acceptance:** View source shows proper meta tags.

---

## SPRINT 3 — Standalone Template Repo 🟡
> The standalone GitHub + Vercel per-dealer deployment system.

---

### T009 — Create dealer-site-template Next.js project
- **Status:** [x] DONE
- **Priority:** 🟡 MEDIUM
- **Directory:** `dealer-site-template/` (new directory in root, will be a separate Git repo)
- **What to build:** A complete standalone Next.js 15 app that:
  - Reads `dealer.config.ts` in its root (pushed by main app's deploy pipeline)
  - Fetches vehicles from Supabase using `NEXT_PUBLIC_DEALER_SLUG` env var
  - Has 4 template routes: renders based on `config.styleTemplate`
  - Has `types/dealer-config.ts` with the `DealerConfig` type
  - Has `dealer.config.ts` as a placeholder/example in the repo
  - Is deployable: `next build` must succeed
  - Structure:
    ```
    dealer-site-template/
    ├── app/
    │   ├── layout.tsx       # Root layout with metadata from config
    │   ├── page.tsx         # Reads config, renders correct template
    │   └── inventory/
    │       └── page.tsx     # Full inventory listing
    ├── components/
    │   └── templates/       # 4 template components (simplified)
    ├── lib/
    │   ├── supabase.ts      # Supabase client
    │   └── vehicles.ts      # Fetch vehicles by dealer slug
    ├── types/
    │   └── dealer-config.ts # DealerConfig TypeScript interface
    ├── dealer.config.ts     # PLACEHOLDER — replaced per dealer by CI
    ├── package.json
    ├── next.config.ts
    └── tsconfig.json
    ```
- **Acceptance:** `cd dealer-site-template && npm install && npm run build` succeeds.

---

### T010 — Fix deploy status API
- **Status:** [x] DONE (already implemented fully — reads dealer_deployments, polls Vercel, updates status, returns progress)
- **Priority:** 🟡 MEDIUM
- **File:** `app/api/deploy/status/[id]/route.ts`

---

### T014 — Add main-project Vercel domain registration
- **Status:** [x] DONE
- **Priority:** 🔴 CRITICAL (custom domains won't work without this)
- **File:** `lib/services/vercel-service.ts`
- **Why:** Currently `addDomainToProject()` targets `dealer-{slug}` (per-dealer project). For multi-tenant, all domains must be added to the ONE main project. Need a new function.
- **What to build:** Add to vercel-service.ts:
  ```typescript
  /**
   * Register a dealer's custom domain on the main DealerSite Pro Vercel project.
   * VERCEL_MAIN_PROJECT_ID env var must be set to your main project's ID/name.
   */
  export async function registerDomainOnMainProject(domain: string): Promise<VercelDomain>
  export async function removeDomainFromMainProject(domain: string): Promise<void>
  ```
  Also add env var `VERCEL_MAIN_PROJECT_ID` to `.env.example`
- **Acceptance:** Calling `registerDomainOnMainProject('bharat-hyundai.com')` adds the domain to the main Vercel project via API.

---

### T015 — API: POST /api/domains/connect-custom (wire to main project)
- **Status:** [x] DONE
- **Priority:** 🔴 CRITICAL
- **File:** `app/api/domains/connect-custom/route.ts` (already exists — needs updating)
- **Why:** The existing route saves to dealer_domains but does NOT call Vercel to add the domain to the main project. Until Vercel knows about the domain, SSL won't provision and traffic won't route.
- **What to update:**
  1. Read existing file first
  2. After saving to dealer_domains, call `registerDomainOnMainProject(domain)` from T014
  3. Return the Vercel verification/CNAME instructions alongside the DB record
  4. Response should include: `{ success, cname: 'cname.vercel-dns.com', txtRecord: '...', vercelVerified: bool }`
- **Acceptance:** After POST, domain appears in Vercel dashboard under the main project.

---

### T016 — Dashboard: DNS setup instructions UI
- **Status:** [x] DONE
- **Priority:** 🟠 HIGH
- **File:** `app/dashboard/domains/page.tsx` (improve existing page)
- **Why:** After a dealer enters their custom domain, they need clear step-by-step DNS instructions so they can configure GoDaddy/Namecheap themselves.
- **What to build:** Add a "DNS Setup Guide" section to the domains page that shows:
  ```
  Step 1: Log into GoDaddy (or your registrar)
  Step 2: Go to DNS Management for bharat-hyundai.com
  Step 3: Add this record:
    Type: CNAME
    Host: @  (or www)
    Points to: cname.vercel-dns.com
    TTL: 600
  Step 4: Wait up to 24h for propagation
  Step 5: Come back here and click "Verify DNS"
  ```
  - Show a copy button next to `cname.vercel-dns.com`
  - Show current verification status (pending / verified / failed)
  - Show SSL status badge
  - "Verify Now" button calls existing /api/domains/verify-dns
- **Acceptance:** Dealer can follow the steps without needing to call support.

---

## SPRINT 4 — Polish & Security 🟢

---

### T011 — Add /api/leads endpoint
- **Status:** [x] DONE
- **Priority:** 🟠 HIGH (needed by templates for lead capture forms)
- **File:** `app/api/leads/route.ts`
- **What to build:**
  ```
  POST /api/leads
  Body: { dealer_id, name, phone, email?, message?, car_id?, lead_source }

  Inserts into `leads` table
  Response: { success: true, leadId }
  ```
  - Validate required fields
  - No auth required (anonymous visitors submit leads)
  - Rate limit: 3 leads per IP per hour (use simple in-memory or skip for now)
- **Acceptance:** Form submit creates a row in `leads` table visible in dashboard.

---

### T012 — Fix .env security
- **Status:** [x] DONE
- **Priority:** 🟠 HIGH
- **What to do:**
  1. Create `.env.example` with placeholder values
  2. Ensure `.env` is in `.gitignore`
  3. Move real secrets to `.env.local` (git-ignored by default in Next.js)
- **Note:** Don't expose actual key values in any committed file.
- **Acceptance:** `git status` no longer shows `.env` as tracked with real keys.

---

### T013 — WhatsApp float button component
- **Status:** [x] DONE
- **Priority:** 🟡 MEDIUM
- **File:** `components/ui/WhatsAppButton.tsx`
- **What to build:** A fixed bottom-right green WhatsApp button that:
  - Takes `phone` and `message` props
  - Opens `https://wa.me/{phone}?text={encoded message}`
  - Shows on all template pages
  - Pulse animation
- **Acceptance:** Component renders, click opens WhatsApp chat.

---

## Agent Assignment Log
> Agents update this section when they pick up a task.

| Task ID | Agent | Started | Completed |
|---------|-------|---------|-----------|
| T001    | INFRA | 2026-02-18 | 2026-02-18 |
| T002    | INFRA | 2026-02-18 | 2026-02-18 |
| T003    | INFRA | 2026-02-18 | 2026-02-18 |
| T004    | TEMPLATES | 2026-02-18 | 2026-02-18 |
| T005    | TEMPLATES | 2026-02-18 | 2026-02-18 |
| T006    | TEMPLATES | 2026-02-18 | 2026-02-18 |
| T007    | TEMPLATES | 2026-02-18 | 2026-02-18 |
| T008    | POLISH | 2026-02-18 | 2026-02-18 |
| T009    | TEMPLATE-REPO | 2026-02-18 | 2026-02-18 |
| T010    | POLISH | 2026-02-18 | 2026-02-18 |
| T011    | INFRA | 2026-02-18 | 2026-02-18 |
| T012    | POLISH | 2026-02-18 | 2026-02-18 |
| T013    | TEMPLATES | 2026-02-18 | 2026-02-18 |
| T014    | DOMAIN | 2026-02-18 | 2026-02-18 |
| T015    | DOMAIN | 2026-02-18 | 2026-02-18 |
| T016    | DOMAIN | 2026-02-18 | 2026-02-18 |

---

## Known Issues / Decisions Log

| Date | Issue | Decision |
|------|-------|----------|
| 2026-02-18 | Two deployment models exist (multi-tenant /sites/[slug] + standalone GitHub/Vercel) | Keep both. Multi-tenant is primary. Standalone is for dealers who want full isolation. |
| 2026-02-18 | dealer_deployments table missing from migrations | Add T001 migration. |
| 2026-02-18 | Custom domain lookup in middleware is broken | Fix via T002 + T003 |
| 2026-02-18 | External template repo (dealer-site-template) doesn't exist | Build in T009 as a directory that can be pushed to GitHub |
