CREATE TABLE IF NOT EXISTS sell_requests (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id           uuid REFERENCES dealers(id) ON DELETE SET NULL,

    seller_name         text NOT NULL,
    seller_phone        text NOT NULL,
    seller_email        text,

    make                text NOT NULL,
    model               text,
    variant             text,
    year                smallint NOT NULL,
    fuel_type           text NOT NULL,
    transmission        text,
    registration_number text,
    mileage_km          integer NOT NULL DEFAULT 0,
    owner_count         text,
    expected_price_paise bigint,
    city                text,
    address             text,
    preferred_date      date,
    preferred_slot      text,
    estimated_low_paise bigint,
    estimated_high_paise bigint,
    photo_urls          text[] NOT NULL DEFAULT '{}',
    notes               text,

    status              text NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'reviewing', 'contacted', 'approved', 'rejected', 'listed')),
    admin_notes         text,
    approved_vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,

    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sell_requests_dealer ON sell_requests(dealer_id);
CREATE INDEX IF NOT EXISTS idx_sell_requests_status ON sell_requests(status);
CREATE INDEX IF NOT EXISTS idx_sell_requests_created ON sell_requests(created_at DESC);

DROP TRIGGER IF EXISTS sell_requests_updated_at ON sell_requests;
CREATE TRIGGER sell_requests_updated_at
    BEFORE UPDATE ON sell_requests
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sell_requests_public_insert ON sell_requests;
CREATE POLICY sell_requests_public_insert
    ON sell_requests FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS sell_requests_owner_read ON sell_requests;
CREATE POLICY sell_requests_owner_read
    ON sell_requests FOR SELECT
    USING (dealer_id IS NULL OR is_dealer_owner(dealer_id));

DROP POLICY IF EXISTS sell_requests_owner_update ON sell_requests;
CREATE POLICY sell_requests_owner_update
    ON sell_requests FOR UPDATE
    USING (dealer_id IS NULL OR is_dealer_owner(dealer_id))
    WITH CHECK (dealer_id IS NULL OR is_dealer_owner(dealer_id));

COMMENT ON TABLE sell_requests IS 'No-login seller enquiries submitted from Sell Your Car flows before admin review and optional listing approval.';
