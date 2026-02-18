-- ============================================================
-- dealer_deployments — tracks GitHub + Vercel deploy pipeline
-- ============================================================

CREATE TABLE IF NOT EXISTS dealer_deployments (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id         UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    -- GitHub
    github_repo       TEXT,          -- e.g. "dealer-site-pro/dealer-kumarmotors"

    -- Vercel
    vercel_project    TEXT,          -- Vercel project ID
    vercel_deploy_id  TEXT,          -- Vercel deployment ID (for polling status)

    -- Domain
    domain            TEXT,          -- e.g. "dealer-kumarmotors.vercel.app"
    site_url          TEXT,          -- full https:// URL

    -- Status
    status            TEXT NOT NULL DEFAULT 'queued'
                          CHECK (status IN ('queued','building','ready','error','cancelled')),
    error_message     TEXT,

    -- Timestamps
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dealer_deployments_dealer ON dealer_deployments(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_deployments_status ON dealer_deployments(status);
CREATE INDEX IF NOT EXISTS idx_dealer_deployments_created ON dealer_deployments(created_at DESC);

-- One active deployment per dealer (upsert target)
CREATE UNIQUE INDEX IF NOT EXISTS idx_dealer_deployments_dealer_unique
    ON dealer_deployments(dealer_id);

-- RLS
ALTER TABLE dealer_deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY dealer_deployments_own ON dealer_deployments
    FOR ALL USING (
        dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    );

-- auto updated_at
CREATE TRIGGER dealer_deployments_updated_at
    BEFORE UPDATE ON dealer_deployments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
