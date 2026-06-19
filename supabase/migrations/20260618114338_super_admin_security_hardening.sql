-- Production hardening based on live DB inspection on 2026-06-18.
-- Scope:
--   - Add platform super-admin foundation.
--   - Enable RLS on exposed public tables that were missing it.
--   - Remove direct public read/update access for sensitive tenant tables.
--   - Harden views/functions without changing application API behavior.

create schema if not exists app_private;

create table if not exists public.platform_admins (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
    email text not null unique,
    full_name text not null default '',
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.platform_admins enable row level security;

drop trigger if exists platform_admins_updated_at on public.platform_admins;
create trigger platform_admins_updated_at
    before update on public.platform_admins
    for each row execute function public.set_updated_at();

create or replace function app_private.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
    select
        exists (
            select 1
            from public.platform_admins pa
            where pa.user_id = (select auth.uid())
              and pa.is_active = true
        )
        or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'super_admin'
$$;

revoke all on function app_private.is_platform_admin() from public, anon, authenticated;
grant usage on schema app_private to anon, authenticated, service_role;
grant execute on function app_private.is_platform_admin() to anon, authenticated, service_role;

drop policy if exists platform_admins_self_read on public.platform_admins;
create policy platform_admins_self_read
    on public.platform_admins
    for select
    to authenticated
    using (user_id = (select auth.uid()) or app_private.is_platform_admin());

drop policy if exists platform_admins_super_admin_all on public.platform_admins;
create policy platform_admins_super_admin_all
    on public.platform_admins
    for all
    to authenticated
    using (app_private.is_platform_admin())
    with check (app_private.is_platform_admin());

-- Public catalog tables remain public-read, but are protected by RLS.
alter table public.tw_catalog enable row level security;
drop policy if exists tw_catalog_public_read on public.tw_catalog;
create policy tw_catalog_public_read
    on public.tw_catalog
    for select
    to anon, authenticated
    using (true);

alter table public.thw_catalog enable row level security;
drop policy if exists thw_catalog_public_read on public.thw_catalog;
create policy thw_catalog_public_read
    on public.thw_catalog
    for select
    to anon, authenticated
    using (true);

-- Dealer reviews are public only after moderation.
alter table public.dealer_reviews enable row level security;

drop policy if exists dealer_reviews_public_read_approved on public.dealer_reviews;
create policy dealer_reviews_public_read_approved
    on public.dealer_reviews
    for select
    to anon, authenticated
    using (
        is_approved = true
        and moderation_status = 'approved'
        and show_on_homepage = true
    );

drop policy if exists dealer_reviews_public_insert_pending on public.dealer_reviews;
create policy dealer_reviews_public_insert_pending
    on public.dealer_reviews
    for insert
    to anon, authenticated
    with check (
        exists (
            select 1
            from public.dealers d
            where d.id = dealer_reviews.dealer_id
              and d.onboarding_complete = true
        )
        and coalesce(is_approved, false) = false
        and coalesce(moderation_status, 'pending') = 'pending'
        and coalesce(show_on_homepage, false) = false
    );

drop policy if exists dealer_reviews_owner_all on public.dealer_reviews;
create policy dealer_reviews_owner_all
    on public.dealer_reviews
    for all
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin())
    with check (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

-- Deployment records are tenant-owned operational data, not public data.
drop policy if exists "Users can manage deployments for their own dealers" on public.dealer_deployments;
drop policy if exists "dealer can view own deployment" on public.dealer_deployments;
drop policy if exists dealer_deployments_own on public.dealer_deployments;
drop policy if exists dealer_deployments_owner_select on public.dealer_deployments;
drop policy if exists dealer_deployments_owner_insert on public.dealer_deployments;
drop policy if exists dealer_deployments_owner_update on public.dealer_deployments;
drop policy if exists dealer_deployments_owner_delete on public.dealer_deployments;

create policy dealer_deployments_owner_select
    on public.dealer_deployments
    for select
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

create policy dealer_deployments_owner_insert
    on public.dealer_deployments
    for insert
    to authenticated
    with check (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

create policy dealer_deployments_owner_update
    on public.dealer_deployments
    for update
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin())
    with check (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

create policy dealer_deployments_owner_delete
    on public.dealer_deployments
    for delete
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

-- Domain subscriptions are dealer-owned billing records.
drop policy if exists domain_subscriptions_dealer_read on public.domain_subscriptions;
drop policy if exists domain_subscriptions_insert on public.domain_subscriptions;
drop policy if exists domain_subscriptions_update on public.domain_subscriptions;
drop policy if exists domain_subscriptions_owner_select on public.domain_subscriptions;
drop policy if exists domain_subscriptions_owner_insert on public.domain_subscriptions;
drop policy if exists domain_subscriptions_owner_update on public.domain_subscriptions;

create policy domain_subscriptions_owner_select
    on public.domain_subscriptions
    for select
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

create policy domain_subscriptions_owner_insert
    on public.domain_subscriptions
    for insert
    to authenticated
    with check (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

create policy domain_subscriptions_owner_update
    on public.domain_subscriptions
    for update
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin())
    with check (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

-- Booking records can be created by public forms through server routes, but direct
-- Data API reads/updates must be tenant-owned.
drop policy if exists tw_bookings_anon_insert on public.tw_bookings;
drop policy if exists tw_bookings_anon_read_own on public.tw_bookings;
drop policy if exists tw_bookings_anon_update on public.tw_bookings;
drop policy if exists tw_bookings_owner_read on public.tw_bookings;
drop policy if exists tw_bookings_public_insert_pending on public.tw_bookings;
drop policy if exists tw_bookings_owner_select on public.tw_bookings;
drop policy if exists tw_bookings_owner_update on public.tw_bookings;

create policy tw_bookings_public_insert_pending
    on public.tw_bookings
    for insert
    to anon, authenticated
    with check (
        exists (
            select 1
            from public.dealers d
            where d.id = tw_bookings.dealer_id
              and d.onboarding_complete = true
        )
        and status = 'pending'
        and booking_amount_paise > 0
        and razorpay_payment_id is null
    );

create policy tw_bookings_owner_select
    on public.tw_bookings
    for select
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

create policy tw_bookings_owner_update
    on public.tw_bookings
    for update
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin())
    with check (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

drop policy if exists thw_bookings_anon_insert on public.thw_bookings;
drop policy if exists thw_bookings_anon_read on public.thw_bookings;
drop policy if exists thw_bookings_anon_update on public.thw_bookings;
drop policy if exists thw_bookings_owner_read on public.thw_bookings;
drop policy if exists thw_bookings_public_insert_pending on public.thw_bookings;
drop policy if exists thw_bookings_owner_select on public.thw_bookings;
drop policy if exists thw_bookings_owner_update on public.thw_bookings;

create policy thw_bookings_public_insert_pending
    on public.thw_bookings
    for insert
    to anon, authenticated
    with check (
        exists (
            select 1
            from public.dealers d
            where d.id = thw_bookings.dealer_id
              and d.onboarding_complete = true
        )
        and status = 'pending'
        and booking_amount_paise > 0
        and razorpay_payment_id is null
    );

create policy thw_bookings_owner_select
    on public.thw_bookings
    for select
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

create policy thw_bookings_owner_update
    on public.thw_bookings
    for update
    to authenticated
    using (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin())
    with check (public.is_dealer_owner(dealer_id) or app_private.is_platform_admin());

-- Service-role-only operational logs should use role-scoped policies.
drop policy if exists "Service role full access on webhook_events" on public.webhook_events;
drop policy if exists webhook_events_service_role_all on public.webhook_events;
create policy webhook_events_service_role_all
    on public.webhook_events
    for all
    to service_role
    using (true)
    with check (true);

drop policy if exists "Service role full access on domain_deployment_operation_events" on public.domain_deployment_operation_events;
drop policy if exists domain_deployment_operation_events_service_role_all on public.domain_deployment_operation_events;
create policy domain_deployment_operation_events_service_role_all
    on public.domain_deployment_operation_events
    for all
    to service_role
    using (true)
    with check (true);

-- Views should evaluate table RLS as the querying user.
alter view public.dealer_dashboard_summary set (security_invoker = true);
alter view public.top_performing_vehicles set (security_invoker = true);

-- Function search-path hardening. Do not revoke is_dealer_owner yet because
-- existing live policies call it directly.
alter function public.handle_new_user() set search_path = public, auth, pg_temp;
alter function public.on_auth_user_created() set search_path = public, auth, pg_temp;
alter function public.increment_tw_vehicle_view(uuid) set search_path = public, pg_temp;
alter function public.increment_thw_vehicle_view(uuid) set search_path = public, pg_temp;
alter function public.is_dealer_owner(uuid) set search_path = public, auth, pg_temp;
alter function public.log_api_usage(uuid, numeric) set search_path = public, pg_temp;
alter function public.provision_dealer_defaults() set search_path = public, pg_temp;
alter function public.set_updated_at() set search_path = public, pg_temp;
alter function public.set_car_catalog_updated_at() set search_path = public, pg_temp;
alter function public.update_dealer_deployments_updated_at() set search_path = public, pg_temp;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.on_auth_user_created() from public, anon, authenticated;
revoke execute on function public.increment_tw_vehicle_view(uuid) from public, anon, authenticated;
revoke execute on function public.increment_thw_vehicle_view(uuid) from public, anon, authenticated;

-- Low-risk FK indexes from the live advisor output. Current tables are small,
-- but these avoid future delete/update scans as bookings and leads grow.
create index if not exists idx_domain_subscriptions_domain_id on public.domain_subscriptions(domain_id);
create index if not exists idx_payment_transactions_subscription_id on public.payment_transactions(subscription_id);
create index if not exists idx_tw_bookings_vehicle_id on public.tw_bookings(vehicle_id);
create index if not exists idx_tw_bookings_used_vehicle_id on public.tw_bookings(used_vehicle_id);
create index if not exists idx_thw_bookings_vehicle_id on public.thw_bookings(vehicle_id);
create index if not exists idx_thw_bookings_used_vehicle_id on public.thw_bookings(used_vehicle_id);
create index if not exists idx_tw_leads_vehicle_id on public.tw_leads(vehicle_id);
create index if not exists idx_tw_leads_used_vehicle_id on public.tw_leads(used_vehicle_id);
create index if not exists idx_thw_leads_vehicle_id on public.thw_leads(vehicle_id);
create index if not exists idx_thw_leads_used_vehicle_id on public.thw_leads(used_vehicle_id);
create index if not exists idx_leads_vehicle_id on public.leads(vehicle_id);
create index if not exists idx_reviews_vehicle_id on public.reviews(vehicle_id);
create index if not exists idx_test_drive_bookings_lead_id on public.test_drive_bookings(lead_id);
create index if not exists idx_test_drive_bookings_vehicle_id on public.test_drive_bookings(vehicle_id);
