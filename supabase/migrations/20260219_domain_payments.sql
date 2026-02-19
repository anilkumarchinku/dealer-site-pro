-- ============================================================
-- Fix: domains unique index was too broad — blocked custom
-- domain additions when a subdomain row already existed.
-- Replace with a partial unique index (one subdomain per dealer).
-- ============================================================
DROP INDEX IF EXISTS idx_domains_dealer_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_domains_dealer_subdomain
    ON domains(dealer_id)
    WHERE type = 'subdomain';

-- ============================================================
-- domain_verifications
-- Stores per-record DNS check results so dealers can see
-- exactly which record passed or failed, and we keep history.
-- ============================================================
CREATE TABLE IF NOT EXISTS domain_verifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id       UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,

    record_type     TEXT NOT NULL,          -- e.g. CNAME, A, TXT
    record_name     TEXT NOT NULL,          -- e.g. @ or www
    expected_value  TEXT NOT NULL,          -- what we told the dealer to set
    actual_value    TEXT,                   -- what DNS lookup returned (null if no record)
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    error_message   TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_domain_verifications_domain_id
    ON domain_verifications(domain_id);

ALTER TABLE domain_verifications ENABLE ROW LEVEL SECURITY;

-- Dealers can read their own verification records
CREATE POLICY domain_verifications_dealer_read ON domain_verifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM domains d
            WHERE d.id = domain_id
              AND is_dealer_owner(d.dealer_id)
        )
    );

-- Server (service role) writes verification records
CREATE POLICY domain_verifications_service_insert ON domain_verifications
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- domain_subscriptions
-- Tracks Razorpay subscription for each PRO/PREMIUM domain.
-- Created server-side after payment, updated on webhook/verify.
-- ============================================================
CREATE TABLE IF NOT EXISTS domain_subscriptions (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id                   UUID REFERENCES domains(id) ON DELETE SET NULL,
    dealer_id                   UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    tier                        TEXT NOT NULL
                                    CHECK (tier IN ('pro', 'premium')),
    status                      TEXT NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'active', 'cancelled', 'failed')),

    -- Razorpay identifiers
    razorpay_subscription_id    TEXT UNIQUE,
    razorpay_order_id           TEXT,
    razorpay_payment_id         TEXT,

    -- Billing period
    current_period_start        TIMESTAMPTZ,
    current_period_end          TIMESTAMPTZ,

    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_dealer_id
    ON domain_subscriptions(dealer_id);

CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_domain_id
    ON domain_subscriptions(domain_id);

CREATE TRIGGER domain_subscriptions_updated_at
    BEFORE UPDATE ON domain_subscriptions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE domain_subscriptions ENABLE ROW LEVEL SECURITY;

-- Dealers can read their own subscriptions
CREATE POLICY domain_subscriptions_dealer_read ON domain_subscriptions
    FOR SELECT USING (is_dealer_owner(dealer_id));

-- Server (service role) manages subscriptions
CREATE POLICY domain_subscriptions_service_all ON domain_subscriptions
    FOR ALL USING (true) WITH CHECK (true);
