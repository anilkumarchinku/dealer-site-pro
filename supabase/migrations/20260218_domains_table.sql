-- ============================================================
-- domains — dashboard-facing domain records
-- Used by: domain-service.ts, /api/domains/*, save-dealer.ts
-- (Separate from dealer_domains which is used for middleware routing)
-- ============================================================

CREATE TABLE IF NOT EXISTS domains (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id               UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    -- Domain identity
    domain                  TEXT NOT NULL,         -- e.g. "abc-motors.dealersitepro.com" or "abcmotors.com"
    slug                    TEXT NOT NULL,          -- e.g. "abc-motors"
    type                    TEXT NOT NULL DEFAULT 'subdomain'
                                CHECK (type IN ('subdomain', 'custom', 'managed')),
    template_id             TEXT
                                CHECK (template_id IN ('luxury', 'family', 'sporty', 'professional')),

    -- Status
    status                  TEXT NOT NULL DEFAULT 'active'
                                CHECK (status IN ('pending', 'verifying', 'active', 'failed', 'expired')),
    ssl_status              TEXT NOT NULL DEFAULT 'active'
                                CHECK (ssl_status IN ('pending', 'provisioning', 'active', 'expired', 'failed')),
    is_primary              BOOLEAN NOT NULL DEFAULT TRUE,

    -- Verification timestamps
    dns_verified_at         TIMESTAMPTZ,
    ssl_provisioned_at      TIMESTAMPTZ,
    ssl_expires_at          TIMESTAMPTZ,
    last_checked_at         TIMESTAMPTZ,

    -- Domain registration (managed domains)
    registrar               TEXT,
    registration_expires_at TIMESTAMPTZ,
    auto_renew              BOOLEAN NOT NULL DEFAULT FALSE,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One primary free subdomain per dealer (upsert target in save-dealer)
CREATE UNIQUE INDEX IF NOT EXISTS idx_domains_dealer_id
    ON domains(dealer_id);

CREATE INDEX IF NOT EXISTS idx_domains_domain   ON domains(domain);
CREATE INDEX IF NOT EXISTS idx_domains_slug     ON domains(slug);
CREATE INDEX IF NOT EXISTS idx_domains_status   ON domains(status) WHERE status = 'active';

CREATE TRIGGER domains_updated_at
    BEFORE UPDATE ON domains
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

-- Dealers can manage their own domain records
CREATE POLICY domains_dealer_all ON domains
    FOR ALL USING (is_dealer_owner(dealer_id));

-- Public read for active domains (needed by middleware resolve API)
CREATE POLICY domains_public_read ON domains
    FOR SELECT USING (status = 'active');

-- ── Missing index on dealer_domains for faster middleware lookups ────────────
-- (dealer_domains already exists from 20260217_complete_schema.sql)
CREATE INDEX IF NOT EXISTS idx_dealer_domains_subdomain_url
    ON dealer_domains(subdomain_url)
    WHERE subdomain_url IS NOT NULL;
