-- Offer-price overrides for pre-owned vehicle cards.
-- Keeps original inventory prices unchanged while letting dealer sites show a
-- temporary offer price per used listing.

CREATE TABLE IF NOT EXISTS used_vehicle_price_offers (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id          UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    vehicle_category   TEXT NOT NULL CHECK (vehicle_category IN ('2w', '3w', '4w')),
    source_type        TEXT NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual', 'cyepro')),
    source_vehicle_id  TEXT NOT NULL,
    offer_price_paise  INTEGER NOT NULL CHECK (offer_price_paise >= 0),
    offer_label        TEXT DEFAULT 'Offer price',
    valid_until        DATE,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (dealer_id, vehicle_category, source_type, source_vehicle_id)
);

CREATE INDEX IF NOT EXISTS idx_used_vehicle_price_offers_dealer
    ON used_vehicle_price_offers(dealer_id);

CREATE INDEX IF NOT EXISTS idx_used_vehicle_price_offers_lookup
    ON used_vehicle_price_offers(dealer_id, vehicle_category, source_type, source_vehicle_id)
    WHERE is_active = TRUE;

CREATE TRIGGER used_vehicle_price_offers_updated_at
    BEFORE UPDATE ON used_vehicle_price_offers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE used_vehicle_price_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY used_vehicle_price_offers_owner
    ON used_vehicle_price_offers
    FOR ALL
    USING (is_dealer_owner(dealer_id));

CREATE POLICY used_vehicle_price_offers_public_read
    ON used_vehicle_price_offers
    FOR SELECT
    USING (is_active = TRUE);
