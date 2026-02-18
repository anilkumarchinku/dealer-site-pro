# Deployment Pipeline — Build Checklist

> Update this file as you complete each item. Replace `[ ]` with `[x]` when done.

---

## Phase 0 — Prerequisites (You do this manually)

- [ ] Get GitHub Personal Access Token → see `API_KEYS_GUIDE.md`
- [ ] Create GitHub Organisation (e.g. `dealersitepro`) → see `API_KEYS_GUIDE.md`
- [ ] Create `dealer-site-template` GitHub repo inside that org → see `API_KEYS_GUIDE.md`
- [ ] Get Vercel API Token → see `API_KEYS_GUIDE.md`
- [ ] Add all env vars to `.env.local` (see list below)
- [ ] Add all env vars to Vercel project settings (for production)

### Required `.env.local` entries
```env
GITHUB_TOKEN=
GITHUB_ORG=
GITHUB_TEMPLATE_REPO=dealer-site-template
VERCEL_TOKEN=
VERCEL_TEAM_ID=          # leave blank if personal account
```

---

## Phase 1 — Service Files (Code done, needs env vars to work)

- [x] `lib/services/code-generator.ts` — generates `dealer.config.ts` content
- [x] `lib/services/github-service.ts` — GitHub API wrapper
- [x] `lib/services/vercel-service.ts` — Vercel API wrapper

---

## Phase 2 — API Routes

- [ ] `app/api/deploy/route.ts` — POST: orchestrates full pipeline
- [ ] `app/api/deploy/status/[id]/route.ts` — GET: polls Vercel build state

---

## Phase 3 — Database

- [ ] Run Supabase migration: create `dealer_deployments` table
- [ ] Verify table exists in Supabase dashboard → Table Editor

---

## Phase 4 — Dashboard UI

- [ ] `app/dashboard/deployment/page.tsx` — build status page with live progress
- [ ] Add "My Site" / "Deployment" link to sidebar nav
- [ ] Wire "Publish Site" button in dashboard to `POST /api/deploy`
- [ ] Wire status polling (`GET /api/deploy/status/[id]`) to UI

---

## Phase 5 — Template Repo Setup (Manual + Code)

- [ ] Create standalone Next.js 15 app in `dealer-site-template` repo
- [ ] Add `types/dealer-config.ts` — TypeScript interface for config shape
- [ ] Add `dealer.config.ts` — default placeholder config
- [ ] Copy 4 templates (family, luxury, modern, sporty) into template repo
- [ ] Template repo reads `dealer.config.ts` at build time (not from DB)
- [ ] Test: manually edit `dealer.config.ts` and verify site rebuilds correctly
- [ ] Enable "Template repository" toggle on GitHub repo settings

---

## Phase 6 — Auto-Redeploy on Settings Change

- [ ] In dashboard settings save → call `POST /api/deploy` to push new config
- [ ] Vercel detects GitHub push → auto-redeploys (built-in, no extra work)
- [ ] Verify redeploy completes after a settings change

---

## Phase 7 — End-to-End Test

- [ ] Complete onboarding as a test dealer (slug: `test-dealer`)
- [ ] Confirm GitHub repo `dealer-test-dealer` was created
- [ ] Confirm `dealer.config.ts` is in the repo with correct data
- [ ] Confirm Vercel project `dealer-test-dealer` was created
- [ ] Confirm site is live at `https://dealer-test-dealer.vercel.app`
- [ ] Change a setting (e.g. tagline) → confirm site redeploys with new value
- [ ] Delete test dealer → clean up GitHub repo + Vercel project

---

## Notes / Blockers

_Use this space to track issues as you build_

-
