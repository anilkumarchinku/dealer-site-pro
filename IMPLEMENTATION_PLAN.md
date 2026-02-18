# Code Gen + GitHub + Vercel Deploy — Implementation Plan

## Overview
Every time a dealer completes onboarding (or changes settings), we:
1. **Generate** a `dealer.config.ts` file from their DB data
2. **Push** it to a new private GitHub repo (created from a template)
3. **Vercel** auto-imports the repo, builds it, and serves it on a subdomain

Result: each dealer gets their own isolated Next.js site at
`https://{dealer-slug}.dealersitepro.app`

---

## Architecture

```
Dashboard (settings save)
        │
        ▼
POST /api/deploy
        │
   ┌────┴────────────────────────────────────┐
   │  1. Generate dealer.config.ts           │
   │  2. GitHub: create repo from template   │
   │  3. GitHub: push dealer.config.ts       │
   │  4. Vercel: create project (link repo)  │
   │  5. Vercel: set env vars                │
   │  6. Vercel: trigger build               │
   │  7. Vercel: add domain alias            │
   │  8. Save deployment record in Supabase  │
   └────────────────────────────────────────┘
        │
        ▼
GET /api/deploy/status/[id]  ← polls Vercel build state
        │
        ▼
Dashboard Deployment Page (live build progress UI)
```

---

## Files Created / Modified

### New Service Files
| File | Purpose |
|------|---------|
| `lib/services/code-generator.ts` | Generates `dealer.config.ts` from DB data |
| `lib/services/github-service.ts` | GitHub REST API wrapper (create repo, push file) |
| `lib/services/vercel-service.ts` | Vercel REST API wrapper (create project, deploy, add domain) |

### New API Routes
| Route | Purpose |
|-------|---------|
| `POST /api/deploy` | Orchestrates full pipeline (GitHub + Vercel) |
| `GET /api/deploy/status/[id]` | Polls Vercel deployment status |

### New Dashboard Page
| File | Purpose |
|------|---------|
| `app/dashboard/deployment/page.tsx` | Live deploy status UI with progress steps |

### Supabase Migration
```sql
CREATE TABLE dealer_deployments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id       UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
  github_repo     TEXT,
  vercel_project  TEXT,
  vercel_deploy_id TEXT,
  domain          TEXT,
  status          TEXT DEFAULT 'queued',   -- queued | building | ready | error
  error_message   TEXT,
  site_url        TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

### External Template Repo (manual setup required)
Create a separate GitHub repo: `{GITHUB_ORG}/dealer-site-template`
- Standard Next.js 15 app
- Reads `dealer.config.ts` at build time to render all pages
- Has the 4 templates (family, luxury, modern, sporty) already inside
- Connected to Supabase via env vars (reads vehicles, reviews, etc.)

---

## Required Environment Variables

```env
# GitHub
GITHUB_TOKEN=ghp_xxxx           # Personal Access Token (repo + read:org scope)
GITHUB_ORG=dealersitepro        # GitHub org or user that owns the repos
GITHUB_TEMPLATE_REPO=dealer-site-template  # Template repo name

# Vercel
VERCEL_TOKEN=xxxx               # Vercel API Token (Account Settings → Tokens)
VERCEL_TEAM_ID=team_xxxx        # Optional — team ID if using Vercel Teams
VERCEL_BASE_DOMAIN=dealersitepro.app  # Base domain for dealer subdomains
```

---

## Implementation Phases

### Phase 1 — Services (Done)
- [x] `lib/services/code-generator.ts`
- [x] `lib/services/github-service.ts`
- [x] `lib/services/vercel-service.ts`

### Phase 2 — API Routes (In Progress)
- [ ] `app/api/deploy/route.ts`
- [ ] `app/api/deploy/status/[id]/route.ts`

### Phase 3 — Database
- [ ] Supabase migration: `dealer_deployments` table

### Phase 4 — Dashboard UI
- [ ] `app/dashboard/deployment/page.tsx`
- [ ] Add "Deployment" link to sidebar nav

### Phase 5 — Auto-redeploy Webhook
- [ ] Trigger redeploy on template/settings change in dashboard
- [ ] Webhook from GitHub → Vercel (already built-in once linked)

### Phase 6 — Template Repo (Manual Step)
- [ ] Create `dealer-site-template` GitHub repo
- [ ] Add all 4 templates
- [ ] Test full pipeline end-to-end

---

## Timeline
| Phase | Effort |
|-------|--------|
| Services + API routes | 1 day |
| Dashboard UI | 0.5 day |
| Template repo creation | 2–3 days |
| DNS + domain setup | 0.5 day |
| Testing end-to-end | 1 day |
| **Total** | **~5–6 days** |
