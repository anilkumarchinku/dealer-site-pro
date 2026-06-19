-- Ensure pre-owned vehicle lead fields exist across 2W and 3W lead tables.
-- The public used-vehicle forms can capture buyer offer amounts, and 3W
-- finance/demo flows can capture requested fleet size.

ALTER TABLE tw_leads
    ADD COLUMN IF NOT EXISTS offer_price_paise INTEGER,
    ADD COLUMN IF NOT EXISTS cyepro_sync_status TEXT NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS cyepro_synced_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cyepro_error TEXT,
    ADD COLUMN IF NOT EXISTS cyepro_lead_id TEXT;

ALTER TABLE thw_leads
    ADD COLUMN IF NOT EXISTS offer_price_paise INTEGER,
    ADD COLUMN IF NOT EXISTS fleet_size INTEGER,
    ADD COLUMN IF NOT EXISTS cyepro_sync_status TEXT NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS cyepro_synced_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cyepro_error TEXT,
    ADD COLUMN IF NOT EXISTS cyepro_lead_id TEXT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'tw_leads_offer_price_paise_nonnegative'
    ) THEN
        ALTER TABLE tw_leads
            ADD CONSTRAINT tw_leads_offer_price_paise_nonnegative
            CHECK (offer_price_paise IS NULL OR offer_price_paise >= 0)
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'tw_leads_cyepro_sync_status_check'
    ) THEN
        ALTER TABLE tw_leads
            ADD CONSTRAINT tw_leads_cyepro_sync_status_check
            CHECK (cyepro_sync_status IN ('pending', 'synced', 'failed', 'skipped'))
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'thw_leads_offer_price_paise_nonnegative'
    ) THEN
        ALTER TABLE thw_leads
            ADD CONSTRAINT thw_leads_offer_price_paise_nonnegative
            CHECK (offer_price_paise IS NULL OR offer_price_paise >= 0)
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'thw_leads_fleet_size_positive'
    ) THEN
        ALTER TABLE thw_leads
            ADD CONSTRAINT thw_leads_fleet_size_positive
            CHECK (fleet_size IS NULL OR fleet_size > 0)
            NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'thw_leads_cyepro_sync_status_check'
    ) THEN
        ALTER TABLE thw_leads
            ADD CONSTRAINT thw_leads_cyepro_sync_status_check
            CHECK (cyepro_sync_status IN ('pending', 'synced', 'failed', 'skipped'))
            NOT VALID;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tw_leads_cyepro_sync_status
    ON tw_leads(dealer_id, cyepro_sync_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_thw_leads_cyepro_sync_status
    ON thw_leads(dealer_id, cyepro_sync_status, created_at DESC);
