-- 012_tighten_anon_insert_rls.sql
--
-- PURPOSE
--   Several public tables expose an RLS policy that allows ANY anonymous caller
--   to INSERT rows directly via the Supabase REST API (`WITH CHECK (true)`).
--   Flagged by the Supabase security advisor (lint 0024 "RLS Policy Always True").
--   This lets a script spam-insert leads / reviews / bookings straight into the
--   DB, bypassing the app's Zod validation, dealer-existence check, idempotency,
--   and rate limiting.
--
-- WHY THIS IS SAFE
--   The application NEVER inserts these rows with the anon key. Every write goes
--   through a server route (app/api/*) using the SERVICE-ROLE admin client, which
--   BYPASSES RLS entirely. Removing the anon INSERT policies therefore does not
--   affect the app — it only closes the direct-from-browser spam path.
--   RLS stays ENABLED on every table; with no INSERT policy, the anon/authenticated
--   roles simply can't insert, while the service role continues to work.
--
-- BEFORE APPLYING
--   Confirm no client component inserts into these tables directly via the anon
--   `supabase` client (grep: `supabase.from('<table>').insert`). As of this audit
--   all such writes go through server API routes, so this is safe.
--
-- Apply at publish time (alongside the service-role key rotation).

BEGIN;

DROP POLICY IF EXISTS "leads_public_insert"                  ON public.leads;
DROP POLICY IF EXISTS "messages_public_insert"               ON public.messages;
DROP POLICY IF EXISTS "reviews_public_insert"                ON public.reviews;
DROP POLICY IF EXISTS "service_center_reviews_public_insert" ON public.service_center_reviews;
DROP POLICY IF EXISTS "sell_requests_public_insert"          ON public.sell_requests;
DROP POLICY IF EXISTS "test_drives_public_insert"            ON public.test_drive_bookings;
DROP POLICY IF EXISTS "car_service_bookings_public_insert"   ON public.car_service_bookings;
DROP POLICY IF EXISTS "tw_leads_anon_insert"                 ON public.tw_leads;
DROP POLICY IF EXISTS "thw_leads_anon_insert"                ON public.thw_leads;
DROP POLICY IF EXISTS "tw_svc_anon_insert"                   ON public.tw_service_bookings;
DROP POLICY IF EXISTS "thw_svc_anon_insert"                  ON public.thw_service_bookings;

-- Optional: domain verification rows are also written server-side (dealer
-- dashboard → server route → admin client). Drop only after confirming no
-- public/anon DNS-verify flow inserts directly.
-- DROP POLICY IF EXISTS "domain_verifications_insert" ON public.domain_verifications;

COMMIT;
