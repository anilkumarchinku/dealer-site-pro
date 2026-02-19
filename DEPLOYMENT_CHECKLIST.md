# Deployment Checklist

Track every step needed before dealer sites can deploy end-to-end.

---

## Code Fixes (done in codebase)

- [x] **Fix import path in `code-generator.ts`**
  - Was: `'./types/dealer-config'`
  - Fixed to: `'@/lib/types/dealer-config'`
  - File: `lib/services/code-generator.ts:54`

- [x] **Remove `puppeteer` from template `package.json`**
  - Was causing build crash on Vercel (300 MB+ Chromium download)
  - File: `dealer-custom-site-dist/package.json`

- [x] **Remove `cheerio`, `axios`, `dotenv` from template `package.json`**
  - All three were unused in template source code
  - File: `dealer-custom-site-dist/package.json`

- [x] **Regenerate template `package-lock.json`**
  - Synced with cleaned-up `package.json`

- [x] **Move `autoprefixer`, `tailwindcss`, `postcss`, `typescript` to `dependencies`**
  - Vercel runs `NODE_ENV=production` → skips devDependencies → build crashed with "Cannot find module 'autoprefixer'"
  - Fixed by moving build-time tools to `dependencies` in `dealer-custom-site-dist/package.json`

- [x] **Fix RLS error on `dealer_deployments` upsert**
  - `dealer_deployments` has no `user_id` column — RLS is enforced via the `dealer_id → dealers → user_id` join
  - **You must run this SQL in Supabase → SQL Editor:**
    ```sql
    ALTER TABLE dealer_deployments ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can manage deployments for their own dealers"
    ON dealer_deployments FOR ALL TO authenticated
    USING (
      dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    )
    WITH CHECK (
      dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    );
    ```
  - Without this policy, all inserts/updates to `dealer_deployments` fail with code `42501`

- [x] **Fix null deployment ID polling (`/api/deploy/status/null` 404 spam)**
  - Status route now accepts both Supabase record UUID and Vercel deployment UID
  - Client uses `buildId` as fallback if `deployId` is null; stops polling immediately if both are null

- [x] **Sync `package.json` to dealer repo on every deploy**
  - Added step 4b in `app/api/deploy/route.ts`: reads `dealer-custom-site-dist/package.json` and pushes it to the dealer repo via `upsertFile`
  - Fixes builds from repos created before the autoprefixer fix was pushed to the template
  - Non-fatal: if the push fails, deployment continues

- [x] **Fix corrupted hero images (5 HTML files saved as .jpg)**
  - Deleted `citroen.jpg`, `mahindra.jpg`, `nissan.jpg`, `renault.jpg`, `volkswagen.jpg` from both `public/assets/hero/` and `dealer-custom-site-dist/public/assets/hero/`
  - Removed these brands from `brand-hero.ts` map → they now fall back to default `toyota.jpg`

---

## GitHub — One-Time Setup

- [x] **`wearecyepro-hue/dealer-custom-site` template repo exists** (confirmed)

- [x] **"Template repository" is enabled** (confirmed — dealer repos generate from it)

- [ ] **Push latest `dealer-custom-site-dist/` contents to the template repo**
  - Required after every code fix to the template
  - The existing dealer repos were built from the OLD template (without the build dep fix)
  - You must push the updated files to `wearecyepro-hue/dealer-custom-site` then redeploy
  - Commands:
    ```bash
    cd dealer-custom-site-dist
    git init
    git remote add origin https://github.com/wearecyepro-hue/dealer-custom-site.git
    git add .
    git commit -m "fix: move build deps to dependencies, remove corrupt hero images"
    git push origin main --force
    ```
  - The `dealer-custom-site-dist/` folder IS the template
  - Push all its files to `wearecyepro-hue/dealer-custom-site` on GitHub
  - Commands:
    ```bash
    cd dealer-custom-site-dist
    git init
    git remote add origin https://github.com/wearecyepro-hue/dealer-custom-site.git
    git add .
    git commit -m "chore: update template (remove puppeteer, fix imports)"
    git push origin main --force
    ```

- [ ] **Enable "Template repository" on `wearecyepro-hue/dealer-custom-site`**
  - GitHub → repo → Settings → tick "Template repository"
  - Without this, `createRepoFromTemplate` API call will fail

- [ ] **Install Vercel GitHub App on `wearecyepro-hue` org**
  - Go to: https://github.com/apps/vercel → Install
  - Grant access to **all repositories** (or at minimum repos starting with `dealer-`)
  - Without this, Vercel cannot read the private repos it deploys from

---

## Vercel — One-Time Setup

- [ ] **Run schema migration for commit-style deploy history**
  - Run in Supabase → SQL Editor:
    ```sql
    -- Allow multiple deployments per dealer (removes 1-per-dealer limit)
    ALTER TABLE dealer_deployments DROP CONSTRAINT dealer_deployments_dealer_id_key;

    -- Add version tracking columns
    ALTER TABLE dealer_deployments
      ADD COLUMN IF NOT EXISTS version_number INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS commit_message TEXT,
      ADD COLUMN IF NOT EXISTS is_current     BOOLEAN DEFAULT FALSE;

    -- RLS policy (if not already created)
    ALTER TABLE dealer_deployments ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage deployments for their own dealers"
    ON dealer_deployments FOR ALL TO authenticated
    USING  (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()))
    WITH CHECK (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));
    ```

- [ ] **Get `VERCEL_TEAM_ID` and add to `.env`**
  - Go to: https://vercel.com → Settings → Team Settings → copy Team ID
  - Looks like: `team_xxxxxxxxxxxxxxxxxxxxxxxx`
  - Add to `.env`:
    ```
    VERCEL_TEAM_ID=team_xxxxxxxxxxxxxxxxxxxxxxxx
    ```
  - Required because the token (`vcp_...`) is team-scoped

---

## End-to-End Test

- [ ] **Trigger a test deployment from the dashboard**
  - Dashboard → Deploy Site button
  - Expected flow:
    1. GitHub repo `dealer-{slug}` created from template ✓
    2. `dealer.config.ts` pushed to that repo ✓
    3. Vercel project `dealer-{slug}` created and linked to repo
    4. Env vars set on Vercel project
    5. Deployment triggered → build passes
    6. Site live at `dealer-{slug}.vercel.app`

- [ ] **Confirm build passes on Vercel** (no TypeScript errors, no missing deps)

- [ ] **Confirm site loads at `dealer-{slug}.vercel.app`**

---

## Optional (after basic deploy works)

- [ ] Custom domain flow: test connecting a dealer's own domain
- [ ] Set `NEXT_PUBLIC_BASE_DOMAIN` in `.env` to actual production domain
- [ ] Set real values for `RAZORPAY_KEY_SECRET`, `RESEND_API_KEY`, `CRON_SECRET` in production
