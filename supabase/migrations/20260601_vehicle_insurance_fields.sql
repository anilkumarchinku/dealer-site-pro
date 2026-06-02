ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS insurance_status text
        CHECK (insurance_status IN ('unknown', 'active', 'expired', 'expiring_soon')),
    ADD COLUMN IF NOT EXISTS insurance_provider text,
    ADD COLUMN IF NOT EXISTS insurance_valid_until date,
    ADD COLUMN IF NOT EXISTS insurance_quote_url text,
    ADD COLUMN IF NOT EXISTS insurance_last_checked_at timestamptz;

UPDATE vehicles
SET insurance_status = 'unknown'
WHERE insurance_status IS NULL;

ALTER TABLE vehicles
    ALTER COLUMN insurance_status SET DEFAULT 'unknown';

CREATE INDEX IF NOT EXISTS idx_vehicles_insurance_valid_until
    ON vehicles(dealer_id, insurance_valid_until)
    WHERE status <> 'inactive';

CREATE INDEX IF NOT EXISTS idx_vehicles_insurance_status
    ON vehicles(dealer_id, insurance_status)
    WHERE status <> 'inactive';

COMMENT ON COLUMN vehicles.insurance_status IS 'Dealer-visible insurance status for the listing.';
COMMENT ON COLUMN vehicles.insurance_provider IS 'Current insurer name, if known from dealer entry or plate lookup.';
COMMENT ON COLUMN vehicles.insurance_valid_until IS 'Current insurance expiry date, if known.';
COMMENT ON COLUMN vehicles.insurance_quote_url IS 'Optional partner quote comparison URL for this listing.';
COMMENT ON COLUMN vehicles.insurance_last_checked_at IS 'Timestamp for the latest manual/API insurance check.';
