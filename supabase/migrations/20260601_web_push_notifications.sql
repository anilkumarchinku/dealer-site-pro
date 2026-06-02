CREATE TABLE IF NOT EXISTS web_push_subscriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    endpoint        TEXT NOT NULL UNIQUE,
    subscription    JSONB NOT NULL,
    categories      TEXT[] NOT NULL DEFAULT ARRAY['new_listings', 'price_drops', 'announcements'],
    filters         JSONB NOT NULL DEFAULT '{}'::jsonb,
    user_agent      TEXT,
    status          TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'disabled', 'failed')),
    last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_dealer
    ON web_push_subscriptions(dealer_id, status);

CREATE TABLE IF NOT EXISTS web_push_broadcasts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    body            TEXT NOT NULL,
    category        TEXT NOT NULL DEFAULT 'announcements',
    target_url      TEXT,
    sent_count      INTEGER NOT NULL DEFAULT 0,
    failed_count    INTEGER NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'queued'
                        CHECK (status IN ('queued', 'sent', 'partial', 'failed')),
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_web_push_broadcasts_dealer_created
    ON web_push_broadcasts(dealer_id, created_at DESC);

DROP TRIGGER IF EXISTS web_push_subscriptions_updated_at ON web_push_subscriptions;
CREATE TRIGGER web_push_subscriptions_updated_at
    BEFORE UPDATE ON web_push_subscriptions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE web_push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_push_broadcasts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS web_push_subscriptions_owner_read ON web_push_subscriptions;
CREATE POLICY web_push_subscriptions_owner_read
    ON web_push_subscriptions FOR SELECT
    USING (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS web_push_broadcasts_owner_all ON web_push_broadcasts;
CREATE POLICY web_push_broadcasts_owner_all
    ON web_push_broadcasts FOR ALL
    USING (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()))
    WITH CHECK (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));

COMMENT ON TABLE web_push_subscriptions IS 'Device-based web push opt-ins for public dealer-site visitors.';
COMMENT ON TABLE web_push_broadcasts IS 'Admin-created push notification broadcasts and delivery counts.';
