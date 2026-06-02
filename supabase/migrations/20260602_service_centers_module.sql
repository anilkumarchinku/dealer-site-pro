CREATE TABLE IF NOT EXISTS service_centers (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    name            text NOT NULL,
    address         text NOT NULL,
    city            text,
    phone           text,
    maps_url        text,
    referral_url    text,
    working_hours   text,
    description     text,
    image_urls      text[] NOT NULL DEFAULT '{}',
    is_active       boolean NOT NULL DEFAULT true,
    display_order   integer NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_pricing_tiers (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    service_center_id uuid REFERENCES service_centers(id) ON DELETE CASCADE,
    name            text NOT NULL,
    description     text,
    price_paise     bigint NOT NULL DEFAULT 0,
    duration        text,
    is_active       boolean NOT NULL DEFAULT true,
    display_order   integer NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_center_reviews (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    service_center_id uuid NOT NULL REFERENCES service_centers(id) ON DELETE CASCADE,
    reviewer_name   text NOT NULL,
    rating          integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text     text,
    is_approved     boolean NOT NULL DEFAULT false,
    moderation_status text NOT NULL DEFAULT 'pending'
        CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
    show_on_homepage boolean NOT NULL DEFAULT true,
    display_order   integer NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE car_service_bookings
    ADD COLUMN IF NOT EXISTS service_center_id uuid REFERENCES service_centers(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS service_pricing_tier_id uuid REFERENCES service_pricing_tiers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_service_centers_dealer ON service_centers(dealer_id, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_service_pricing_dealer ON service_pricing_tiers(dealer_id, service_center_id, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_service_center_reviews_center ON service_center_reviews(service_center_id, moderation_status, show_on_homepage, display_order);
CREATE INDEX IF NOT EXISTS idx_car_service_bookings_center ON car_service_bookings(service_center_id);

DROP TRIGGER IF EXISTS service_centers_updated_at ON service_centers;
CREATE TRIGGER service_centers_updated_at
    BEFORE UPDATE ON service_centers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS service_pricing_tiers_updated_at ON service_pricing_tiers;
CREATE TRIGGER service_pricing_tiers_updated_at
    BEFORE UPDATE ON service_pricing_tiers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS service_center_reviews_updated_at ON service_center_reviews;
CREATE TRIGGER service_center_reviews_updated_at
    BEFORE UPDATE ON service_center_reviews
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE service_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_center_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_centers_public_read ON service_centers;
CREATE POLICY service_centers_public_read
    ON service_centers FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS service_centers_owner_all ON service_centers;
CREATE POLICY service_centers_owner_all
    ON service_centers FOR ALL
    USING (is_dealer_owner(dealer_id))
    WITH CHECK (is_dealer_owner(dealer_id));

DROP POLICY IF EXISTS service_pricing_public_read ON service_pricing_tiers;
CREATE POLICY service_pricing_public_read
    ON service_pricing_tiers FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS service_pricing_owner_all ON service_pricing_tiers;
CREATE POLICY service_pricing_owner_all
    ON service_pricing_tiers FOR ALL
    USING (is_dealer_owner(dealer_id))
    WITH CHECK (is_dealer_owner(dealer_id));

DROP POLICY IF EXISTS service_center_reviews_public_read ON service_center_reviews;
CREATE POLICY service_center_reviews_public_read
    ON service_center_reviews FOR SELECT
    USING (is_approved = true AND moderation_status = 'approved' AND show_on_homepage = true);

DROP POLICY IF EXISTS service_center_reviews_public_insert ON service_center_reviews;
CREATE POLICY service_center_reviews_public_insert
    ON service_center_reviews FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS service_center_reviews_owner_all ON service_center_reviews;
CREATE POLICY service_center_reviews_owner_all
    ON service_center_reviews FOR ALL
    USING (is_dealer_owner(dealer_id))
    WITH CHECK (is_dealer_owner(dealer_id));

COMMENT ON TABLE service_centers IS 'Dealer service centers shown on public service pages.';
COMMENT ON TABLE service_pricing_tiers IS 'Dealer-configured public service packages and prices.';
COMMENT ON TABLE service_center_reviews IS 'Moderated customer feedback for a specific service center.';
