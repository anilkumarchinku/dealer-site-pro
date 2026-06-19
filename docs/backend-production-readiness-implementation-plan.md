# Backend Production Readiness Implementation Plan

Date: 2026-06-18

Source of truth: live Supabase project `dealer-website` (`llsvbyeumrfngjvbedbz`), not local migration history.

## Goals

- Keep the current shared multi-tenant hosting model.
- Preserve working dealer/customer flows.
- Add a real super-admin foundation for platform visibility.
- Lock down direct Supabase Data API access where it can expose cross-tenant data.
- Keep Cyepro as the live inventory source for configured dealers.

## Implementation Checklist

### 1. Super-admin foundation

- [x] Add `platform_admins` table keyed to `auth.users.id`.
- [x] Store super-admin authorization in trusted server-controlled data, not client-editable metadata.
- [x] Seed the initial platform admin account for Ravi Abhinav.
- [x] Allow the existing `/admin` tooling to accept either the legacy admin session or a Supabase super-admin session.
- [x] Add a platform insights API for total dealers, onboarding, domains, inventory, leads, bookings, billing, and Cyepro usage.

Why required: dealer admin and platform super admin are different roles. A dealer admin should only see one dealership; the platform team needs aggregated tenant visibility.

### 2. RLS hardening for public tables

- [x] Enable RLS on `dealer_reviews`, `tw_catalog`, and `thw_catalog`.
- [x] Preserve public read for catalog rows and approved homepage reviews.
- [x] Preserve public review submission through existing API validation/rate limiting.

Why required: Supabase exposes the `public` schema through the Data API. Tables in that schema should have RLS even if some rows are intentionally public.

### 3. Remove unsafe public mutation policies

- [x] Replace unrestricted `dealer_deployments` policy with dealer-owner access.
- [x] Replace `domain_subscriptions` public insert/update with dealer-owner policies.
- [x] Remove public read/update policies on `tw_bookings` and `thw_bookings`.
- [x] Keep public booking creation possible through the server API path.

Why required: booking, deployment, and subscription data contains customer or operational state. Public inserts may be acceptable for lead forms; public reads/updates are not.

### 4. View and function hardening

- [x] Recreate dashboard/reporting views with `security_invoker = true`.
- [x] Set stable `search_path` on project functions.
- [x] Revoke direct anon/authenticated execution for trigger-only and service-only `SECURITY DEFINER` functions.
- [x] Skip dealer auto-provisioning for platform-admin Auth users.

Why required: security-definer views/functions can bypass RLS or become public RPC endpoints if left exposed.

### 5. Super-admin insights UI/API

- [x] Add `/api/admin/insights`.
- [x] Show high-level platform metrics in `/admin`.
- [x] Avoid exposing API keys, raw customer PII, or secrets in aggregate reporting.

Why required: the platform team needs operational insight without browsing raw tables or customer records.

### 6. Booking amount configuration

- [x] Keep default booking amount at zero when no dealer config exists.
- [x] Support dealer-level and vehicle-category-level booking amount settings.
- [x] Use configured amount server-side so customers cannot change the booking amount from the browser.

Why required: amount configuration belongs to the dealership admin, and payment amounts must be trusted server-side values.

### 7. Cyepro live inventory model

- [x] Keep Cyepro as the live inventory source for dealers with a Cyepro key.
- [x] Use short in-process cache for repeated page loads.
- [x] Use stale fallback for temporary Cyepro failures.
- [x] Log provider failures without breaking customer page loads.

Why required: Cyepro remains the paid source of inventory truth, while Supabase remains the tenant/config/lead/auth system.

## Deployment Notes

- Do not apply destructive table rewrites.
- Applied database hardening in reviewed migrations:
  - `20260618114338_super_admin_security_hardening`
  - `20260618114728_booking_amount_config`
  - `20260618115000_skip_platform_admin_dealer_provisioning`
- Verified Supabase advisors after the migrations.
- Verified typecheck, test suite, and production build.
- Do not store the initial super-admin password in source control.

## Follow-up Work

- Replace the legacy env-password admin login after Supabase super-admin access is verified in production.
- Move `is_dealer_owner` into a private schema and rewrite policies to remove public RPC exposure.
- Add captcha or equivalent abuse protection for public insert endpoints.
- Add database-level audit events for super-admin actions.
- Tighten remaining public form insert policies that currently use `WITH CHECK (true)`.
- Move `pg_trgm` out of the `public` schema.
- Remove duplicate dealer slug indexes and remaining unindexed foreign keys reported by the performance advisor.
