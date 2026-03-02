-- ============================================================
-- Migration 006: Three-Wheeler Dealership Module
-- Covers: passenger auto-rickshaws, cargo 3W, electric 3W,
-- school vans — with full RLS, indexes and triggers.
-- ============================================================

-- ── 1. thw_vehicles (New 3W inventory) ───────────────────────

CREATE TABLE IF NOT EXISTS thw_vehicles (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id               uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    type                    text NOT NULL CHECK (type IN ('passenger','cargo','electric','school_van')),
    brand                   text NOT NULL,
    model                   text NOT NULL,
    variant                 text,
    year                    int  NOT NULL,

    fuel_type               text NOT NULL CHECK (fuel_type IN ('petrol','diesel','cng','electric','lpg')),
    engine_cc               int,
    battery_kwh             numeric,
    range_km                int,
    charging_time_hours     numeric,
    battery_warranty_years  int,

    -- Cargo specific
    payload_kg              int,
    body_type               text CHECK (body_type IN ('flatbed','closed_body','tipper','container','tanker','pickup')),

    -- Passenger specific
    passenger_capacity      int,

    -- Performance
    max_speed_kmph          int,
    mileage_kmpl            numeric,       -- for petrol/diesel
    cng_mileage_km_per_kg   numeric,       -- for CNG

    -- Regulatory
    permit_type             text CHECK (permit_type IN ('all_india','state','city','none')),
    gvw_kg                  int,           -- gross vehicle weight
    fame_subsidy_eligible   boolean NOT NULL DEFAULT false,
    bs6_compliant           boolean NOT NULL DEFAULT true,

    -- Pricing (paise)
    ex_showroom_price_paise bigint   NOT NULL,
    on_road_price_paise     bigint,
    emi_starting_paise      bigint,

    stock_status            text NOT NULL DEFAULT 'available'
                                CHECK (stock_status IN ('available','booking_open','out_of_stock')),

    colors                  jsonb    NOT NULL DEFAULT '[]',
    images                  text[]   NOT NULL DEFAULT '{}',
    brochure_url            text,

    description             text,
    features                text[]   NOT NULL DEFAULT '{}',

    status                  text NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active','inactive')),
    views                   int  NOT NULL DEFAULT 0,

    created_at              timestamptz NOT NULL DEFAULT now(),
    updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ── 2. thw_used_vehicles (Used / 2nd-hand 3W stock) ──────────

CREATE TABLE IF NOT EXISTS thw_used_vehicles (
    id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id                   uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    type                        text NOT NULL CHECK (type IN ('passenger','cargo','electric','school_van')),
    brand                       text NOT NULL,
    model                       text NOT NULL,
    variant                     text,
    year                        int  NOT NULL,
    fuel_type                   text NOT NULL CHECK (fuel_type IN ('petrol','diesel','cng','electric','lpg')),

    km_driven                   int  NOT NULL,
    no_of_owners                int  NOT NULL DEFAULT 1,
    condition_grade             text CHECK (condition_grade IN ('A','B','C')),

    -- Regulatory docs
    rc_status                   text CHECK (rc_status IN ('clear','hypothecation','pending')),
    permit_valid_until          date,
    fitness_certificate_valid   date,
    insurance_valid_until       date,
    inspection_report_url       text,
    certified_pre_owned         boolean NOT NULL DEFAULT false,

    -- Cargo specifics
    payload_kg                  int,
    body_type                   text CHECK (body_type IN ('flatbed','closed_body','tipper','container','tanker','pickup')),
    passenger_capacity          int,

    price_paise                 bigint  NOT NULL,
    negotiable                  boolean NOT NULL DEFAULT false,

    images                      text[]  NOT NULL DEFAULT '{}',
    description                 text,

    status                      text NOT NULL DEFAULT 'available'
                                    CHECK (status IN ('available','sold','reserved')),

    created_at                  timestamptz NOT NULL DEFAULT now(),
    updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- ── 3. thw_leads ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS thw_leads (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id           uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    vehicle_id          uuid REFERENCES thw_vehicles(id) ON DELETE SET NULL,
    used_vehicle_id     uuid REFERENCES thw_used_vehicles(id) ON DELETE SET NULL,

    lead_type           text NOT NULL CHECK (lead_type IN (
                            'test_drive','best_price','finance','exchange',
                            'callback','inspection','offer','service','parts','demo'
                        )),

    name                text NOT NULL,
    phone               text NOT NULL,
    email               text,
    preferred_date      date,
    message             text,
    offer_price_paise   bigint,
    fleet_size          int,       -- For fleet/commercial buyers

    status              text NOT NULL DEFAULT 'new'
                            CHECK (status IN ('new','contacted','converted','lost')),

    created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── 4. thw_service_bookings ───────────────────────────────────

CREATE TABLE IF NOT EXISTS thw_service_bookings (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id           uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    customer_name       text NOT NULL,
    phone               text NOT NULL,
    vehicle_make        text,
    vehicle_model       text,
    vehicle_year        int,
    vehicle_reg_no      text,     -- Registration number
    km_reading          int,

    service_type        text NOT NULL CHECK (service_type IN (
                            'general_service','oil_change','tyre',
                            'battery','cng_kit','body_work','electrical','repair','amc'
                        )),

    preferred_date      date NOT NULL,
    preferred_slot      text NOT NULL,

    status              text NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','confirmed','completed','cancelled')),

    created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── 5. thw_bookings (Razorpay booking payments) ───────────────

CREATE TABLE IF NOT EXISTS thw_bookings (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id               uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    vehicle_id              uuid REFERENCES thw_vehicles(id) ON DELETE SET NULL,
    used_vehicle_id         uuid REFERENCES thw_used_vehicles(id) ON DELETE SET NULL,

    customer_name           text NOT NULL,
    phone                   text NOT NULL,
    email                   text,

    booking_amount_paise    bigint NOT NULL,
    razorpay_order_id       text,
    razorpay_payment_id     text,
    idempotency_key         text UNIQUE NOT NULL,

    status                  text NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','paid','failed','refunded')),

    created_at              timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_thw_vehicles_dealer   ON thw_vehicles(dealer_id);
CREATE INDEX IF NOT EXISTS idx_thw_vehicles_status   ON thw_vehicles(status);
CREATE INDEX IF NOT EXISTS idx_thw_vehicles_type     ON thw_vehicles(type);
CREATE INDEX IF NOT EXISTS idx_thw_vehicles_brand    ON thw_vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_thw_vehicles_fuel     ON thw_vehicles(fuel_type);

CREATE INDEX IF NOT EXISTS idx_thw_used_dealer       ON thw_used_vehicles(dealer_id);
CREATE INDEX IF NOT EXISTS idx_thw_used_status       ON thw_used_vehicles(status);
CREATE INDEX IF NOT EXISTS idx_thw_used_type         ON thw_used_vehicles(type);

CREATE INDEX IF NOT EXISTS idx_thw_leads_dealer      ON thw_leads(dealer_id);
CREATE INDEX IF NOT EXISTS idx_thw_leads_status      ON thw_leads(status);

CREATE INDEX IF NOT EXISTS idx_thw_svc_dealer        ON thw_service_bookings(dealer_id);
CREATE INDEX IF NOT EXISTS idx_thw_svc_status        ON thw_service_bookings(status);

CREATE INDEX IF NOT EXISTS idx_thw_bookings_dealer   ON thw_bookings(dealer_id);
CREATE INDEX IF NOT EXISTS idx_thw_bookings_idem     ON thw_bookings(idempotency_key);

-- ── updated_at triggers ───────────────────────────────────────

DROP TRIGGER IF EXISTS thw_vehicles_updated_at ON thw_vehicles;
CREATE TRIGGER thw_vehicles_updated_at
    BEFORE UPDATE ON thw_vehicles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS thw_used_vehicles_updated_at ON thw_used_vehicles;
CREATE TRIGGER thw_used_vehicles_updated_at
    BEFORE UPDATE ON thw_used_vehicles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Enable RLS ────────────────────────────────────────────────

ALTER TABLE thw_vehicles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE thw_used_vehicles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE thw_leads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE thw_service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE thw_bookings         ENABLE ROW LEVEL SECURITY;

-- ── RLS: thw_vehicles ─────────────────────────────────────────

DROP POLICY IF EXISTS "thw_vehicles_owner" ON thw_vehicles;
CREATE POLICY "thw_vehicles_owner" ON thw_vehicles
    FOR ALL USING (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "thw_vehicles_public_read" ON thw_vehicles;
CREATE POLICY "thw_vehicles_public_read" ON thw_vehicles
    FOR SELECT USING (status = 'active');

-- ── RLS: thw_used_vehicles ────────────────────────────────────

DROP POLICY IF EXISTS "thw_used_owner" ON thw_used_vehicles;
CREATE POLICY "thw_used_owner" ON thw_used_vehicles
    FOR ALL USING (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "thw_used_public_read" ON thw_used_vehicles;
CREATE POLICY "thw_used_public_read" ON thw_used_vehicles
    FOR SELECT USING (status = 'available');

-- ── RLS: thw_leads ────────────────────────────────────────────

DROP POLICY IF EXISTS "thw_leads_anon_insert" ON thw_leads;
CREATE POLICY "thw_leads_anon_insert" ON thw_leads
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "thw_leads_owner_read" ON thw_leads;
CREATE POLICY "thw_leads_owner_read" ON thw_leads
    FOR SELECT USING (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "thw_leads_owner_update" ON thw_leads;
CREATE POLICY "thw_leads_owner_update" ON thw_leads
    FOR UPDATE USING (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));

-- ── RLS: thw_service_bookings ─────────────────────────────────

DROP POLICY IF EXISTS "thw_svc_anon_insert" ON thw_service_bookings;
CREATE POLICY "thw_svc_anon_insert" ON thw_service_bookings
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "thw_svc_owner_read" ON thw_service_bookings;
CREATE POLICY "thw_svc_owner_read" ON thw_service_bookings
    FOR SELECT USING (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "thw_svc_owner_update" ON thw_service_bookings;
CREATE POLICY "thw_svc_owner_update" ON thw_service_bookings
    FOR UPDATE USING (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));

-- ── RLS: thw_bookings ─────────────────────────────────────────

DROP POLICY IF EXISTS "thw_bookings_anon_insert" ON thw_bookings;
CREATE POLICY "thw_bookings_anon_insert" ON thw_bookings
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "thw_bookings_anon_read" ON thw_bookings;
CREATE POLICY "thw_bookings_anon_read" ON thw_bookings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "thw_bookings_anon_update" ON thw_bookings;
CREATE POLICY "thw_bookings_anon_update" ON thw_bookings
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "thw_bookings_owner_read" ON thw_bookings;
CREATE POLICY "thw_bookings_owner_read" ON thw_bookings
    FOR SELECT USING (dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()));

-- ── Helper RPC ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_thw_vehicle_view(vehicle_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE thw_vehicles SET views = views + 1 WHERE id = vehicle_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
