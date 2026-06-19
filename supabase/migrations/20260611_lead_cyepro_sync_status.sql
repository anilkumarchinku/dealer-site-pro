-- Track whether generated website leads reached the dealer's Cyepro CRM.

ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS cyepro_sync_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (cyepro_sync_status IN ('pending', 'synced', 'failed', 'skipped')),
    ADD COLUMN IF NOT EXISTS cyepro_synced_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cyepro_error TEXT,
    ADD COLUMN IF NOT EXISTS cyepro_lead_id TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_cyepro_sync_status
    ON leads(dealer_id, cyepro_sync_status, created_at DESC);
