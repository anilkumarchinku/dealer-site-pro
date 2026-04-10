-- Dealer offers table: replaces hardcoded offers on dealer sites
CREATE TABLE IF NOT EXISTS dealer_offers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id   UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    tag         TEXT,             -- "Finance", "Exchange", "Service", "Electric", "Offer", "Referral"
    valid_until DATE,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dealer_offers_dealer_id ON dealer_offers(dealer_id);

ALTER TABLE dealer_offers ENABLE ROW LEVEL SECURITY;

-- Anyone can read active offers for any dealer
CREATE POLICY "Public read active offers"
    ON dealer_offers FOR SELECT
    USING (is_active = TRUE);

-- Authenticated dealers can manage their own offers
CREATE POLICY "Dealers manage own offers"
    ON dealer_offers FOR ALL
    TO authenticated
    USING (dealer_id = auth.uid())
    WITH CHECK (dealer_id = auth.uid());
