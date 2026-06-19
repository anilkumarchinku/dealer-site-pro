# Gotchas

> Local fallback copy. The canonical Gotchas doc lives in the Obsidian vault
> (`dealer-site-pro/Gotchas.md`) per `CLAUDE.md`, but the `obsidian-vault` MCP was
> not connected when this was written. Sync these entries to Obsidian when it's back.

## Admin-client API routes fail with a generic message if `SUPABASE_SERVICE_ROLE_KEY` is unset

**Symptom:** A route that uses `createAdminClient()` (e.g. `/api/auth/registration-availability`)
returns `500` with a vague message. On the registration form this shows as
*"Could not validate registration details. Please try again."* even when every field is valid.

**Root cause:** `createAdminClient()` in `lib/supabase-server.ts` calls
`getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')`, which **throws** (`[ENV] ... is not set`) when the
key is missing from `.env`. The route's `catch` block then masks the real cause behind a generic
error. The homepage and login work fine because they only use the **anon** key — registration is
often the first feature to exercise the service-role key, so a missing key surfaces here first.

**How to diagnose:** Check the server log for `[ENV] SUPABASE_SERVICE_ROLE_KEY env var is not set`.
The browser only ever shows the generic message.

**Fix:** Add the service-role secret to `.env` (Supabase Dashboard → Project Settings → API →
`service_role`), then **restart** the dev server — env changes are not hot-reloaded.
Never expose this key to the client; it bypasses RLS.

**Hardened (2026-06-19):** `/api/auth/registration-availability` now returns `503` (not `500`) with
a "server configuration issue" message when the error is an `[ENV]` config error, so the cause is
no longer silently masked. Other admin-client routes (`/api/reviews`, `/api/vehicles/rc-lookup`)
do **not** yet have this guard and will still fail generically if the key is missing.

## `npm run dev` may hang with a blank page when the dev environment is CPU-starved

**Symptom:** Browser shows an endless blank/loading page on every route; even static routes never
respond. The Next server logs `✓ Ready` but no route ever finishes compiling.

**Root cause:** Webpack compilation is CPU-starved. Seen when multiple `next dev` servers run for
the same project at once, plus a runaway `node` process pinning cores, plus a corrupted `.next`
webpack cache (`ENOENT: rename '*.pack.gz_'` errors at startup).

**Fix:** Kill duplicate/runaway node processes, `Remove-Item -Recurse -Force .next` to clear the
corrupted cache, then start a single dev server. On Windows, excluding the project dir from
Defender real-time scanning prevents the `.pack.gz` rename failures.

## Middleware + homepage call Supabase with no timeout

`middleware.ts` (`supabase.auth.getUser()`) and `app/page.tsx` (`getLatestCars()`) call Supabase on
every request to `/` with no timeout. The `try/catch` blocks only catch *errors* — a network call
that **hangs** (e.g. a paused Supabase project) blocks the request forever rather than failing fast,
which would make every route hang. Consider wrapping these in `AbortSignal.timeout()`.
