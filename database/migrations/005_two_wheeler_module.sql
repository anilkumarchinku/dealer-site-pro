-- ============================================================
-- Migration 005: Two-Wheeler Dealership Module
-- Creates 5 tables for 2W inventory, used vehicles, leads,
-- service bookings and booking payments with full RLS.
-- Run in Supabase SQL editor or via: supabase db push
-- ============================================================

-- ── 1. tw_vehicles (New 2W inventory) ────────────────────────

CREATE TABLE IF NOT EXISTS tw_vehicles (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id               uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    type                    text NOT NULL CHECK (type IN ('bike','scooter','moped','electric')),
    brand                   text NOT NULL,
    model                   text NOT NULL,
    variant                 text,
    year                    int  NOT NULL,

    engine_cc               int,
    battery_kwh             numeric,
    fuel_type               text NOT NULL CHECK (fuel_type IN ('petrol','electric')),
    mileage_kmpl            numeric,
    range_km                int,
    top_speed_kmph          int,

    colors                  jsonb    NOT NULL DEFAULT '[]',   -- [{name, hex}]

    ex_showroom_price_paise bigint   NOT NULL,
    on_road_price_paise     bigint,
    emi_starting_paise      bigint,

    stock_status            text NOT NULL DEFAULT 'available'
                                CHECK (stock_status IN ('available','booking_open','out_of_stock')),

    images                  text[]  NOT NULL DEFAULT '{}',
    brochure_url            text,

    bs6_compliant           boolean NOT NULL DEFAULT true,
    fame_subsidy_eligible   boolean NOT NULL DEFAULT false,
    charging_time_hours     numeric,
    battery_warranty_years  int,

    description             text,
    features                text[]  NOT NULL DEFAULT '{}',

    status                  text NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active','inactive')),
    views                   int  NOT NULL DEFAULT 0,

    created_at              timestamptz NOT NULL DEFAULT now(),
    updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ── 2. tw_used_vehicles (Used / 2nd-hand 2W stock) ───────────

CREATE TABLE IF NOT EXISTS tw_used_vehicles (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id               uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    type                    text NOT NULL CHECK (type IN ('bike','scooter','moped','electric')),
    brand                   text NOT NULL,
    model                   text NOT NULL,
    variant                 text,
    year                    int  NOT NULL,
    fuel_type               text NOT NULL CHECK (fuel_type IN ('petrol','electric')),

    km_driven               int  NOT NULL,
    no_of_owners            int  NOT NULL DEFAULT 1,
    condition_grade         text CHECK (condition_grade IN ('A','B','C')),
    rc_status               text CHECK (rc_status IN ('clear','hypothecation','pending')),
    insurance_valid_until   date,
    inspection_report_url   text,
    certified_pre_owned     boolean NOT NULL DEFAULT false,

    price_paise             bigint  NOT NULL,
    negotiable              boolean NOT NULL DEFAULT false,

    images                  text[]  NOT NULL DEFAULT '{}',
    description             text,

    status                  text NOT NULL DEFAULT 'available'
                                CHECK (status IN ('available','sold','reserved')),

    created_at              timestamptz NOT NULL DEFAULT now(),
    updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ── 3. tw_leads (All customer inquiries) ────────────────────

CREATE TABLE IF NOT EXISTS tw_leads (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id           uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    vehicle_id          uuid REFERENCES tw_vehicles(id) ON DELETE SET NULL,
    used_vehicle_id     uuid REFERENCES tw_used_vehicles(id) ON DELETE SET NULL,

    lead_type           text NOT NULL CHECK (lead_type IN (
                            'test_ride','best_price','finance','exchange',
                            'callback','inspection','offer','service','parts'
                        )),

    name                text NOT NULL,
    phone               text NOT NULL,
    email               text,
    preferred_date      date,
    message             text,
    offer_price_paise   bigint,

    status              text NOT NULL DEFAULT 'new'
                            CHECK (status IN ('new','contacted','converted','lost')),

    created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── 4. tw_service_bookings ────────────────────────────────────

CREATE TABLE IF NOT EXISTS tw_service_bookings (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id           uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    customer_name       text NOT NULL,
    phone               text NOT NULL,
    vehicle_make        text,
    vehicle_model       text,
    vehicle_year        int,
    km_reading          int,

    service_type        text NOT NULL CHECK (service_type IN (
                            'general_service','oil_change','tyre',
                            'battery','repair','amc'
                        )),

    preferred_date      date NOT NULL,
    preferred_slot      text NOT NULL,

    status              text NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','confirmed','completed','cancelled')),

    created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── 5. tw_bookings (Razorpay booking payments) ───────────────

CREATE TABLE IF NOT EXISTS tw_bookings (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id               uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    vehicle_id              uuid REFERENCES tw_vehicles(id) ON DELETE SET NULL,
    used_vehicle_id         uuid REFERENCES tw_used_vehicles(id) ON DELETE SET NULL,

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

-- ── Indexes ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_tw_vehicles_dealer     ON tw_vehicles(dealer_id);
CREATE INDEX IF NOT EXISTS idx_tw_vehicles_status     ON tw_vehicles(status);
CREATE INDEX IF NOT EXISTS idx_tw_vehicles_type       ON tw_vehicles(type);
CREATE INDEX IF NOT EXISTS idx_tw_vehicles_brand      ON tw_vehicles(brand);

CREATE INDEX IF NOT EXISTS idx_tw_used_dealer         ON tw_used_vehicles(dealer_id);
CREATE INDEX IF NOT EXISTS idx_tw_used_status         ON tw_used_vehicles(status);

CREATE INDEX IF NOT EXISTS idx_tw_leads_dealer        ON tw_leads(dealer_id);
CREATE INDEX IF NOT EXISTS idx_tw_leads_status        ON tw_leads(status);

CREATE INDEX IF NOT EXISTS idx_tw_svc_dealer          ON tw_service_bookings(dealer_id);
CREATE INDEX IF NOT EXISTS idx_tw_svc_status          ON tw_service_bookings(status);

CREATE INDEX IF NOT EXISTS idx_tw_bookings_dealer     ON tw_bookings(dealer_id);
CREATE INDEX IF NOT EXISTS idx_tw_bookings_idem_key   ON tw_bookings(idempotency_key);

-- ── updated_at triggers ──────────────────────────────────────
-- Reuses the set_updated_at function if it already exists,
-- otherwise creates it.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tw_vehicles_updated_at     ON tw_vehicles;
CREATE TRIGGER tw_vehicles_updated_at
    BEFORE UPDATE ON tw_vehicles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS tw_used_vehicles_updated_at ON tw_used_vehicles;
CREATE TRIGGER tw_used_vehicles_updated_at
    BEFORE UPDATE ON tw_used_vehicles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Enable RLS on all 5 tables ────────────────────────────────

ALTER TABLE tw_vehicles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_used_vehicles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_leads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tw_bookings         ENABLE ROW LEVEL SECURITY;

-- ── RLS: tw_vehicles ─────────────────────────────────────────

-- Dealer owns their vehicles
DROP POLICY IF EXISTS "tw_vehicles_owner" ON tw_vehicles;
CREATE POLICY "tw_vehicles_owner" ON tw_vehicles
    FOR ALL USING (
        dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    );

-- Public can read active vehicles (for dealer sites)
DROP POLICY IF EXISTS "tw_vehicles_public_read" ON tw_vehicles;
CREATE POLICY "tw_vehicles_public_read" ON tw_vehicles
    FOR SELECT USING (status = 'active');

-- ── RLS: tw_used_vehicles ─────────────────────────────────────

DROP POLICY IF EXISTS "tw_used_owner" ON tw_used_vehicles;
CREATE POLICY "tw_used_owner" ON tw_used_vehicles
    FOR ALL USING (
        dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "tw_used_public_read" ON tw_used_vehicles;
CREATE POLICY "tw_used_public_read" ON tw_used_vehicles
    FOR SELECT USING (status = 'available');

-- ── RLS: tw_leads ─────────────────────────────────────────────

-- Public (anon) can insert leads via the public form
DROP POLICY IF EXISTS "tw_leads_anon_insert" ON tw_leads;
CREATE POLICY "tw_leads_anon_insert" ON tw_leads
    FOR INSERT WITH CHECK (true);

-- Dealer reads their own leads
DROP POLICY IF EXISTS "tw_leads_owner_read" ON tw_leads;
CREATE POLICY "tw_leads_owner_read" ON tw_leads
    FOR SELECT USING (
        dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    );

-- Dealer updates lead status
DROP POLICY IF EXISTS "tw_leads_owner_update" ON tw_leads;
CREATE POLICY "tw_leads_owner_update" ON tw_leads
    FOR UPDATE USING (
        dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    );

-- ── RLS: tw_service_bookings ─────────────────────────────────

DROP POLICY IF EXISTS "tw_svc_anon_insert" ON tw_service_bookings;
CREATE POLICY "tw_svc_anon_insert" ON tw_service_bookings
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "tw_svc_owner_read" ON tw_service_bookings;
CREATE POLICY "tw_svc_owner_read" ON tw_service_bookings
    FOR SELECT USING (
        dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "tw_svc_owner_update" ON tw_service_bookings;
CREATE POLICY "tw_svc_owner_update" ON tw_service_bookings
    FOR UPDATE USING (
        dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    );

-- ── RLS: tw_bookings ─────────────────────────────────────────

-- Anon can insert (payment flow creates the booking)
DROP POLICY IF EXISTS "tw_bookings_anon_insert" ON tw_bookings;
CREATE POLICY "tw_bookings_anon_insert" ON tw_bookings
    FOR INSERT WITH CHECK (true);

-- Anon can read their own booking by idempotency_key (for payment verify)
DROP POLICY IF EXISTS "tw_bookings_anon_read_own" ON tw_bookings;
CREATE POLICY "tw_bookings_anon_read_own" ON tw_bookings
    FOR SELECT USING (true);   -- API validates idempotency_key server-side

-- Anon can update status (payment verify callback)
DROP POLICY IF EXISTS "tw_bookings_anon_update" ON tw_bookings;
CREATE POLICY "tw_bookings_anon_update" ON tw_bookings
    FOR UPDATE USING (true);   -- API validates idempotency_key server-side

-- Dealer reads their bookings
DROP POLICY IF EXISTS "tw_bookings_owner_read" ON tw_bookings;
CREATE POLICY "tw_bookings_owner_read" ON tw_bookings
    FOR SELECT USING (
        dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    );

-- ── Helper RPC: increment view count ─────────────────────────

CREATE OR REPLACE FUNCTION increment_tw_vehicle_view(vehicle_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE tw_vehicles SET views = views + 1 WHERE id = vehicle_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Verify (uncomment to check) ───────────────────────────────
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public' AND tablename LIKE 'tw_%'
-- ORDER BY tablename;
