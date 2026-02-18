# Multi-Tenant Architecture — Dealer Site Pro

## Overview

One repo, one Vercel deployment, unlimited dealer domains.

```
bharat-hyundai.com  ──┐
rk-hyundai.com      ──┤──→  Vercel (dealer-site-pro)  ──→  Supabase DB
techno-hyundai.com  ──┘      ONE project, ONE deploy       (all dealer data)
```

Every dealer domain hits the **same Vercel deployment**. The middleware figures out which dealer to show based on the incoming domain. No individual repos, no individual deployments.

---

## The Three-Part Flow

### Part 1 — GoDaddy (Dealer's DNS)

The dealer goes to GoDaddy and adds **one CNAME record**:

```
Type:  CNAME
Host:  @  (or www)
Value: cname.vercel-dns.com
TTL:   600
```

The domain now points at Vercel. No server IP needed.

---

### Part 2 — Vercel (Add Domain to Main Project)

Call the Vercel API **once per dealer** to register their custom domain on the main project:

```
POST /v10/projects/dealer-site-pro/domains
{ "name": "bharat-hyundai.com" }
```

After this:
- Vercel issues a free SSL certificate automatically
- Vercel routes requests for `bharat-hyundai.com` to the `dealer-site-pro` project

> **Important:** `addDomainToProject()` in `lib/services/vercel-service.ts` must target
> the **main project** (`dealer-site-pro`), NOT individual per-dealer projects.

---

### Part 3 — Middleware (Domain → Dealer Slug Lookup)

When a custom domain like `bharat-hyundai.com` hits the middleware, it must:

1. Detect it is not a subdomain of `dealersitepro.com`
2. Query DB: `SELECT slug FROM dealers WHERE custom_domain = 'bharat-hyundai.com'`
3. Get back slug: `bharat-hyundai`
4. Rewrite request to: `/sites/bharat-hyundai`
5. `/sites/[slug]/page.tsx` renders the correct dealer site

The in-memory `domainCache` in `middleware.ts` (line 13) is already wired for this — it just needs the DB lookup implemented.

**Current bug (line 77 in middleware.ts):**
```ts
// BROKEN — sends full hostname as slug
url.pathname = `/sites/${hostname}${pathname}`
// → /sites/bharat-hyundai.com → fetchDealerBySlug returns null → ComingSoon page
```

**Fix needed:**
```
hostname → DB lookup by custom_domain → slug → /sites/{slug}
```

---

## Database Change Required

Add `custom_domain` column to the `dealers` table:

```sql
ALTER TABLE dealers ADD COLUMN custom_domain TEXT UNIQUE;
```

Dealers set this from their dashboard settings page.

---

## End-to-End Flow (Once Fixed)

```
1. Dealer completes onboarding
2. Dealer enters custom domain in dashboard: bharat-hyundai.com
3. Dashboard instructs: "Add CNAME → cname.vercel-dns.com in GoDaddy"
4. System calls Vercel API: adds bharat-hyundai.com to dealer-site-pro project
5. System saves custom_domain = 'bharat-hyundai.com' to dealers table in Supabase

When a visitor opens bharat-hyundai.com:
  → GoDaddy DNS resolves to Vercel
  → middleware reads host header: 'bharat-hyundai.com'
  → DB lookup: slug = 'bharat-hyundai'  (cached for 60s)
  → rewrite to /sites/bharat-hyundai
  → fetchDealerBySlug() fetches all dealer data from Supabase
  → renders correct template (e.g. FamilyTemplate) with Bharat Hyundai branding ✓
```

---

## Component Status

| Component | Status | Notes |
|---|---|---|
| `/sites/[slug]/page.tsx` | ✅ Works | Renders any dealer from DB |
| `lib/db/dealers.ts` | ✅ Works | `fetchDealerBySlug` fetches all dealer data |
| `middleware.ts` — subdomain routing | ✅ Works | `bharat-hyundai.dealersitepro.com` → slug `bharat-hyundai` |
| `middleware.ts` — custom domain routing | ❌ Broken | Sends full hostname as slug, needs DB lookup |
| `vercel-service.ts` `addDomainToProject()` | ⚠️ Wrong target | Adds to per-dealer project, must target main project |
| `github-service.ts` / per-dealer repos | ❌ Not needed | Per-dealer-repo approach — not compatible with multi-tenant |

---

## What to Keep vs Remove

### Keep (needed for multi-tenant)
- `middleware.ts` — fix the custom domain lookup
- `lib/services/vercel-service.ts` — keep only `addDomainToProject()` (retarget to main project)
- `app/sites/[slug]/page.tsx` — rendering layer, already correct
- `lib/db/dealers.ts` — data layer, already correct

### Remove / Ignore (per-dealer-repo approach, not needed)
- `createRepoFromTemplate()` — no individual repos needed
- `createVercelProject()` — no individual Vercel projects needed
- `triggerDeployment()` — one deploy handles all dealers
- `lib/services/github-service.ts` — entire file (only needed for per-dealer repos)

---

## Why Not Individual Repos Per Dealer?

| Problem | Individual Repos | Multi-Tenant |
|---|---|---|
| Bug fix | Push to N repos | Deploy once, all dealers fixed |
| New feature | Propagate everywhere | All dealers get it instantly |
| Cost | ~$20/mo per Vercel project | One project |
| Onboarding a new dealer | Minutes of DevOps | One row in DB + one API call |
| Custom domain | Manual per dealer | Vercel API call, automated |

---

## Subdomain Alternative

For dealers who don't have their own domain yet, subdomains work automatically:

```
bharat-hyundai.dealersitepro.com
→ middleware extracts slug: 'bharat-hyundai'
→ /sites/bharat-hyundai
→ renders dealer site ✓
```

This requires a wildcard DNS record: `*.dealersitepro.com → Vercel`

Both subdomain and custom domain routing can coexist in the same middleware.

---

## Files to Implement Next

1. **`middleware.ts`** — add custom domain → slug DB lookup (use existing `domainCache`)
2. **`lib/services/vercel-service.ts`** — fix `addDomainToProject` to target main project
3. **Supabase migration** — add `custom_domain TEXT UNIQUE` to `dealers` table
4. **Dashboard settings page** — UI for dealer to enter and verify their custom domain
