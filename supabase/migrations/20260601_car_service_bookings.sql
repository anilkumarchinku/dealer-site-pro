CREATE TABLE IF NOT EXISTS car_service_bookings (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id           uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    customer_name       text NOT NULL,
    phone               text NOT NULL,
    email               text,

    vehicle_reg_no      text,
    vehicle_make        text,
    vehicle_model       text,
    vehicle_year        smallint,
    km_reading          integer,

    service_type        text NOT NULL,
    preferred_date      date NOT NULL,
    preferred_slot      text NOT NULL,
    service_location    text,
    notes               text,

    status              text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'assigned', 'completed', 'cancelled')),
    assigned_partner    text,
    referral_url        text,
    admin_notes         text,

    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_car_service_bookings_dealer ON car_service_bookings(dealer_id);
CREATE INDEX IF NOT EXISTS idx_car_service_bookings_status ON car_service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_car_service_bookings_date ON car_service_bookings(preferred_date);

DROP TRIGGER IF EXISTS car_service_bookings_updated_at ON car_service_bookings;
CREATE TRIGGER car_service_bookings_updated_at
    BEFORE UPDATE ON car_service_bookings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE car_service_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS car_service_bookings_public_insert ON car_service_bookings;
CREATE POLICY car_service_bookings_public_insert
    ON car_service_bookings FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS car_service_bookings_owner_read ON car_service_bookings;
CREATE POLICY car_service_bookings_owner_read
    ON car_service_bookings FOR SELECT
    USING (is_dealer_owner(dealer_id));

DROP POLICY IF EXISTS car_service_bookings_owner_update ON car_service_bookings;
CREATE POLICY car_service_bookings_owner_update
    ON car_service_bookings FOR UPDATE
    USING (is_dealer_owner(dealer_id))
    WITH CHECK (is_dealer_owner(dealer_id));

COMMENT ON TABLE car_service_bookings IS '4W service leads captured from dealer sites for admin partner assignment and follow-up.';
