-- ============================================================
-- Migration 004: Ensure complete RLS on all dealer-scoped tables
-- Run this in your Supabase SQL editor.
-- ============================================================

-- ── Enable RLS on any table that might be missing it ─────────

ALTER TABLE IF EXISTS dealers                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dealer_brands            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dealer_site_configs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dealer_deployments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dealer_domains           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dealer_cars              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dealer_leads             ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vehicles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leads                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS analytics_daily          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS domain_subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_idempotency_log  ENABLE ROW LEVEL SECURITY;

-- ── dealers ──────────────────────────────────────────────────

DROP POLICY IF EXISTS "dealers_owner" ON dealers;
CREATE POLICY "dealers_owner" ON dealers
    FOR ALL USING (auth.uid() = user_id);

-- ── dealer_brands ────────────────────────────────────────────

DROP POLICY IF EXISTS "dealer_brands_owner" ON dealer_brands;
CREATE POLICY "dealer_brands_owner" ON dealer_brands
    FOR ALL USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- ── dealer_site_configs ───────────────────────────────────────

DROP POLICY IF EXISTS "dealer_site_configs_owner" ON dealer_site_configs;
CREATE POLICY "dealer_site_configs_owner" ON dealer_site_configs
    FOR ALL USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- ── dealer_deployments ────────────────────────────────────────

DROP POLICY IF EXISTS "dealer_deployments_owner" ON dealer_deployments;
CREATE POLICY "dealer_deployments_owner" ON dealer_deployments
    FOR ALL USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- ── vehicles (unified inventory table) ───────────────────────

DROP POLICY IF EXISTS "vehicles_owner" ON vehicles;
CREATE POLICY "vehicles_owner" ON vehicles
    FOR ALL USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Public read for active vehicles (dealer sites show inventory)
DROP POLICY IF EXISTS "vehicles_public_read" ON vehicles;
CREATE POLICY "vehicles_public_read" ON vehicles
    FOR SELECT USING (status = 'active');

-- ── leads ────────────────────────────────────────────────────

-- Dealers read their own leads
DROP POLICY IF EXISTS "leads_owner_read" ON leads;
CREATE POLICY "leads_owner_read" ON leads
    FOR SELECT USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Dealers update their own leads (status changes)
DROP POLICY IF EXISTS "leads_owner_update" ON leads;
CREATE POLICY "leads_owner_update" ON leads
    FOR UPDATE USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Anonymous insert (visitors submit enquiries — public API handles validation)
DROP POLICY IF EXISTS "leads_anon_insert" ON leads;
CREATE POLICY "leads_anon_insert" ON leads
    FOR INSERT WITH CHECK (true);

-- ── messages ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "messages_owner" ON messages;
CREATE POLICY "messages_owner" ON messages
    FOR ALL USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- ── reviews ──────────────────────────────────────────────────

DROP POLICY IF EXISTS "reviews_owner_all" ON reviews;
CREATE POLICY "reviews_owner_all" ON reviews
    FOR ALL USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Public read for approved reviews (dealer sites display them)
DROP POLICY IF EXISTS "reviews_public_read" ON reviews;
CREATE POLICY "reviews_public_read" ON reviews
    FOR SELECT USING (status = 'approved');

-- ── analytics_daily ──────────────────────────────────────────

DROP POLICY IF EXISTS "analytics_owner" ON analytics_daily;
CREATE POLICY "analytics_owner" ON analytics_daily
    FOR ALL USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- ── domain_subscriptions ─────────────────────────────────────

DROP POLICY IF EXISTS "domain_subscriptions_owner" ON domain_subscriptions;
CREATE POLICY "domain_subscriptions_owner" ON domain_subscriptions
    FOR ALL USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- ── payment_idempotency_log ───────────────────────────────────
-- Only service role can insert/read — regular users cannot touch payment logs

DROP POLICY IF EXISTS "payment_log_deny_all" ON payment_idempotency_log;
CREATE POLICY "payment_log_deny_all" ON payment_idempotency_log
    FOR ALL USING (false);  -- All access via service-role only

-- ── Verify RLS is active (run this to check) ─────────────────
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
