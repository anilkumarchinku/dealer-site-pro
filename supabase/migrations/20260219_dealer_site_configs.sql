-- ============================================================
-- dealer_site_configs
-- Per-brand template configuration for multi-OEM dealers.
--
-- Multi-OEM example:
--   Abhi Motors sells Tata + Skoda.
--   dealers.slug = "abhi-motors"  (main site — shared dealer config)
--
--   dealer_site_configs rows:
--     brand_slug = "tata"   → config for abhi-motors-tata.indrav.in
--     brand_slug = "skoda"  → config for abhi-motors-skoda.indrav.in
--
-- Single-OEM / used-car dealers: no rows here;
--   their config lives in dealer_template_configs (as before).
-- ============================================================

CREATE TABLE IF NOT EXISTS dealer_site_configs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       UUID        NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    -- which brand this config belongs to (e.g. "tata", "skoda")
    brand_slug      TEXT        NOT NULL,

    -- per-site template override (falls back to dealers.style_template if null)
    style_template  TEXT        CHECK (style_template IN (
                                    'luxury','family','sporty','professional','modern'
                                )),

    -- Hero section
    hero_title      TEXT,
    hero_subtitle   TEXT,
    hero_cta_text   TEXT        DEFAULT 'View Inventory',

    -- Footer / about
    tagline         TEXT,
    working_hours   TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(dealer_id, brand_slug)
);

CREATE INDEX IF NOT EXISTS idx_dealer_site_configs_dealer
    ON dealer_site_configs(dealer_id);

-- auto-update updated_at on every write
CREATE TRIGGER dealer_site_configs_updated_at
    BEFORE UPDATE ON dealer_site_configs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE dealer_site_configs ENABLE ROW LEVEL SECURITY;

-- Dealers can only access their own rows
CREATE POLICY dealer_site_configs_owner
    ON dealer_site_configs
    FOR ALL
    USING (is_dealer_owner(dealer_id));

-- Public sites can read any site config (needed by server-side SSR)
CREATE POLICY dealer_site_configs_public_read
    ON dealer_site_configs
    FOR SELECT
    USING (true);
