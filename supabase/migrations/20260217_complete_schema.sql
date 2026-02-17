-- ============================================================
-- DealerSite Pro — Complete PostgreSQL Database Schema
-- Supabase / PostgreSQL
-- Covers: Onboarding → Dashboard → CRM → Analytics → Billing
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 0. EXTENSIONS
-- ──────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- trigram search on names

-- ──────────────────────────────────────────────────────────
-- 0. SHARED TRIGGER: auto-update updated_at
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ══════════════════════════════════════════════════════════
-- 1. DEALERS
--    Core table. One row per dealership.
--    Linked to auth.users via user_id (Supabase Auth).
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS dealers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

    -- ── Step 1: About Your Dealership ──────────────────────
    dealership_name     TEXT NOT NULL,
    tagline             TEXT,                         -- "Driven by Trust"
    location            TEXT NOT NULL,                -- City / area
    full_address        TEXT,                         -- Full postal address
    map_link            TEXT,                         -- Google Maps URL
    years_in_business   SMALLINT,
    phone               TEXT NOT NULL,
    whatsapp            TEXT,
    email               TEXT NOT NULL,
    gstin               TEXT,                         -- Indian GST number
    logo_url            TEXT,                         -- Uploaded logo

    -- ── Step 2: Inventory Type ─────────────────────────────
    sells_new_cars      BOOLEAN NOT NULL DEFAULT FALSE,
    sells_used_cars     BOOLEAN NOT NULL DEFAULT FALSE,
    inventory_system    TEXT                          -- vauto | dealersocket | manual | other
                            CHECK (inventory_system IN (
                                'vauto','dealersocket','dealertrack',
                                'vinsolutions','manual','other'
                            )),

    -- ── Step 4: Website Style ──────────────────────────────
    style_template      TEXT NOT NULL DEFAULT 'family'
                            CHECK (style_template IN ('luxury','family','sporty','professional')),

    -- ── Computed / Meta ────────────────────────────────────
    dealer_type         TEXT
                            CHECK (dealer_type IN ('single_oem','multi_oem','used_only','hybrid')),
    subdomain           TEXT UNIQUE,                  -- auto-generated slug
    slug                TEXT UNIQUE,                  -- URL-safe identifier
    onboarding_step     SMALLINT NOT NULL DEFAULT 1,  -- 1-5, where user left off
    onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    role                TEXT NOT NULL DEFAULT 'dealer'
                            CHECK (role IN ('dealer','admin')),

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dealers_user_id     ON dealers(user_id);
CREATE INDEX idx_dealers_slug        ON dealers(slug);
CREATE INDEX idx_dealers_subdomain   ON dealers(subdomain);
CREATE INDEX idx_dealers_active      ON dealers(is_active);

CREATE TRIGGER dealers_updated_at
    BEFORE UPDATE ON dealers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ──────────────────────────────────────────────────────────
-- 1a. DEALER BRANDS  (Step 2 — multi-select)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dealer_brands (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id   UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    brand_name  TEXT NOT NULL,
    is_primary  BOOLEAN NOT NULL DEFAULT FALSE,   -- first selected brand
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (dealer_id, brand_name)
);

CREATE INDEX idx_dealer_brands_dealer ON dealer_brands(dealer_id);

-- ──────────────────────────────────────────────────────────
-- 1b. DEALER SERVICES  (Step 3 — multi-select)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dealer_services (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id    UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL
                     CHECK (service_name IN (
                         'new_car_sales','used_car_sales','financing',
                         'service_maintenance','parts_accessories','body_shop',
                         'express_service','insurance','fleet_sales',
                         'home_test_drives','extended_warranties','trade_in',
                         'get_callback','buy_accessories'
                     )),
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (dealer_id, service_name)
);

CREATE INDEX idx_dealer_services_dealer ON dealer_services(dealer_id);

-- ──────────────────────────────────────────────────────────
-- 1c. DEALER TEMPLATE CONFIG  (Step 5 — customization)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dealer_template_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       UUID NOT NULL UNIQUE REFERENCES dealers(id) ON DELETE CASCADE,

    -- Hero section
    hero_title      TEXT,
    hero_subtitle   TEXT,
    hero_cta_text   TEXT DEFAULT 'View Inventory',
    features_title  TEXT DEFAULT 'Why Choose Us',

    -- Social media
    facebook_url    TEXT,
    instagram_url   TEXT,
    twitter_url     TEXT,
    youtube_url     TEXT,
    linkedin_url    TEXT,

    -- Operations
    working_hours   TEXT,   -- "Mon-Sat 9AM-7PM, Sun 10AM-5PM"

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER dealer_template_configs_updated_at
    BEFORE UPDATE ON dealer_template_configs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ══════════════════════════════════════════════════════════
-- 2. VEHICLES (Inventory)
--    Dealer's car stock — both new catalog & used listings
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS vehicles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    -- Identity
    vin             TEXT,                -- Vehicle Identification Number
    make            TEXT NOT NULL,       -- Maruti Suzuki, Honda, BMW ...
    model           TEXT NOT NULL,       -- City, Creta, X5 ...
    variant         TEXT,                -- VX, ZX, Standard ...
    year            SMALLINT NOT NULL,

    -- Pricing (INR, stored as paise to avoid floats)
    price_paise     BIGINT NOT NULL,     -- ex-showroom price in paise
    on_road_price_paise BIGINT,

    -- Physical
    mileage_km      INTEGER,             -- odometer (used cars)
    color           TEXT,
    body_type       TEXT
                        CHECK (body_type IN (
                            'Sedan','Hatchback','SUV','MUV','Coupe',
                            'Convertible','Pickup','Van','Wagon','Crossover'
                        )),
    transmission    TEXT
                        CHECK (transmission IN (
                            'Manual','Automatic','AMT','CVT','DCT','iMT'
                        )),
    fuel_type       TEXT
                        CHECK (fuel_type IN (
                            'Petrol','Diesel','CNG','Electric','Hybrid','LPG'
                        )),
    seating_capacity SMALLINT,
    engine_cc       SMALLINT,

    -- Content
    features        TEXT[]  DEFAULT '{}',
    description     TEXT,

    -- Status
    condition       TEXT NOT NULL DEFAULT 'used'
                        CHECK (condition IN ('new','used','certified_pre_owned')),
    status          TEXT NOT NULL DEFAULT 'available'
                        CHECK (status IN ('available','reserved','sold','inactive')),

    -- Analytics
    views           INTEGER NOT NULL DEFAULT 0,
    leads_count     INTEGER NOT NULL DEFAULT 0,

    -- Meta
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_dealer       ON vehicles(dealer_id);
CREATE INDEX idx_vehicles_status       ON vehicles(status);
CREATE INDEX idx_vehicles_make_model   ON vehicles(make, model);
CREATE INDEX idx_vehicles_featured     ON vehicles(dealer_id, is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_vehicles_search       ON vehicles USING GIN (
    to_tsvector('english', make || ' ' || model || ' ' || COALESCE(variant,''))
);

CREATE TRIGGER vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ──────────────────────────────────────────────────────────
-- 2a. VEHICLE PHOTOS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicle_photos (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id    UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    storage_path  TEXT NOT NULL,         -- Supabase Storage path
    url           TEXT NOT NULL,         -- Public CDN URL
    is_hero       BOOLEAN NOT NULL DEFAULT FALSE,  -- main/thumbnail image
    display_order SMALLINT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_photos_vehicle   ON vehicle_photos(vehicle_id);
-- Only one hero per vehicle
CREATE UNIQUE INDEX idx_vehicle_photos_hero
    ON vehicle_photos(vehicle_id) WHERE is_hero = TRUE;

-- ══════════════════════════════════════════════════════════
-- 3. LEADS (CRM)
--    All customer inquiries regardless of channel
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS leads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    vehicle_id      UUID REFERENCES vehicles(id) ON DELETE SET NULL,

    -- Customer
    customer_name   TEXT NOT NULL,
    customer_email  TEXT,
    customer_phone  TEXT NOT NULL,

    -- Lead detail
    lead_type       TEXT NOT NULL
                        CHECK (lead_type IN (
                            'inquiry','test_drive','quote','service',
                            'trade_in','financing','get_callback','buy_accessories'
                        )),
    priority        TEXT NOT NULL DEFAULT 'cold'
                        CHECK (priority IN ('hot','warm','cold')),
    status          TEXT NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new','contacted','qualified','converted','lost')),

    -- Content
    message         TEXT,
    notes           TEXT,
    vehicle_interest TEXT,   -- free-text if no vehicle_id (e.g. "looking for SUV under 15L")

    -- Attribution
    source          TEXT NOT NULL DEFAULT 'website'
                        CHECK (source IN (
                            'website','whatsapp','phone','walk_in','referral','social_media'
                        )),
    utm_source      TEXT,
    utm_medium      TEXT,
    utm_campaign    TEXT,

    -- Follow-up
    follow_up_date  DATE,
    contacted_at    TIMESTAMPTZ,
    converted_at    TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_dealer         ON leads(dealer_id);
CREATE INDEX idx_leads_status         ON leads(dealer_id, status);
CREATE INDEX idx_leads_priority       ON leads(dealer_id, priority);
CREATE INDEX idx_leads_created        ON leads(dealer_id, created_at DESC);
CREATE INDEX idx_leads_phone          ON leads(customer_phone);

CREATE TRIGGER leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ──────────────────────────────────────────────────────────
-- 3a. TEST DRIVE BOOKINGS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_drive_bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    lead_id         UUID REFERENCES leads(id) ON DELETE SET NULL,
    vehicle_id      UUID REFERENCES vehicles(id) ON DELETE SET NULL,

    customer_name   TEXT NOT NULL,
    customer_phone  TEXT NOT NULL,
    preferred_date  DATE,
    preferred_time  TEXT,          -- "10:00 AM", "2:30 PM"

    status          TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','confirmed','completed','cancelled','no_show')),
    notes           TEXT,

    confirmed_at    TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    cancelled_at    TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_test_drives_dealer  ON test_drive_bookings(dealer_id);
CREATE INDEX idx_test_drives_status  ON test_drive_bookings(dealer_id, status);
CREATE INDEX idx_test_drives_date    ON test_drive_bookings(preferred_date);

CREATE TRIGGER test_drives_updated_at
    BEFORE UPDATE ON test_drive_bookings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ══════════════════════════════════════════════════════════
-- 4. REVIEWS
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    vehicle_id      UUID REFERENCES vehicles(id) ON DELETE SET NULL,

    -- Reviewer
    customer_name   TEXT NOT NULL,
    customer_email  TEXT,

    -- Content
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title           TEXT,
    content         TEXT,

    -- Moderation
    status          TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','published','rejected')),
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    admin_reply     TEXT,
    replied_at      TIMESTAMPTZ,

    -- Attribution
    source          TEXT NOT NULL DEFAULT 'website'
                        CHECK (source IN ('website','google','facebook','justdial','cardekho')),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_dealer    ON reviews(dealer_id);
CREATE INDEX idx_reviews_status    ON reviews(dealer_id, status);
CREATE INDEX idx_reviews_rating    ON reviews(dealer_id, rating);
CREATE INDEX idx_reviews_featured  ON reviews(dealer_id, is_featured) WHERE is_featured = TRUE;

CREATE TRIGGER reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ══════════════════════════════════════════════════════════
-- 5. MESSAGES  (Website contact form submissions)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id       UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    sender_name     TEXT NOT NULL,
    sender_email    TEXT,
    sender_phone    TEXT,
    subject         TEXT,
    content         TEXT NOT NULL,

    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    is_starred      BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived     BOOLEAN NOT NULL DEFAULT FALSE,

    read_at         TIMESTAMPTZ,
    replied_at      TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_dealer  ON messages(dealer_id);
CREATE INDEX idx_messages_unread  ON messages(dealer_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_messages_created ON messages(dealer_id, created_at DESC);

-- ══════════════════════════════════════════════════════════
-- 6. DOMAINS  (replaces/extends 001_domains_schema.sql)
-- ══════════════════════════════════════════════════════════
-- Note: if you've already run 001_domains_schema.sql, skip
-- this block and run only the ALTER TABLE below.

CREATE TABLE IF NOT EXISTS dealer_domains (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id               UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,

    -- Free subdomain
    subdomain               TEXT UNIQUE,           -- "ram-motors"
    subdomain_url           TEXT UNIQUE,           -- "ram-motors.dealersitepro.com"

    -- Custom domain (Phase 2)
    custom_domain           TEXT UNIQUE,           -- "ramcars.in"
    domain_type             TEXT NOT NULL DEFAULT 'subdomain'
                                CHECK (domain_type IN ('subdomain','custom','managed')),

    -- Status
    status                  TEXT NOT NULL DEFAULT 'active'
                                CHECK (status IN ('pending','active','failed','expired','suspended')),
    ssl_status              TEXT NOT NULL DEFAULT 'active'
                                CHECK (ssl_status IN ('pending','provisioning','active','expired','failed')),
    is_primary              BOOLEAN NOT NULL DEFAULT TRUE,

    -- Verification (Phase 2)
    verification_token      TEXT,
    dns_verified            BOOLEAN NOT NULL DEFAULT FALSE,
    dns_verified_at         TIMESTAMPTZ,
    ssl_provisioned_at      TIMESTAMPTZ,
    ssl_expires_at          TIMESTAMPTZ,
    last_checked_at         TIMESTAMPTZ,

    -- Managed domain registration (Phase 3)
    registrar               TEXT,
    registration_expires_at TIMESTAMPTZ,
    auto_renew              BOOLEAN DEFAULT TRUE,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dealer_domains_dealer    ON dealer_domains(dealer_id);
CREATE INDEX idx_dealer_domains_subdomain ON dealer_domains(subdomain);
CREATE INDEX idx_dealer_domains_custom    ON dealer_domains(custom_domain);
CREATE INDEX idx_dealer_domains_status    ON dealer_domains(status) WHERE status = 'active';

CREATE TRIGGER dealer_domains_updated_at
    BEFORE UPDATE ON dealer_domains
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ──────────────────────────────────────────────────────────
-- 6a. DOMAIN SUBSCRIPTIONS  (Phase 2 — Custom Domain paid plan)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS domain_subscriptions (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id                   UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    domain_id                   UUID NOT NULL REFERENCES dealer_domains(id) ON DELETE CASCADE,

    plan                        TEXT NOT NULL CHECK (plan IN ('free','pro','premium','enterprise')),
    price_paise                 INTEGER NOT NULL DEFAULT 0,  -- 0 for free, 49900 for ₹499
    billing_cycle               TEXT NOT NULL DEFAULT 'monthly'
                                    CHECK (billing_cycle IN ('monthly','yearly')),

    -- Razorpay
    razorpay_subscription_id    TEXT,
    razorpay_plan_id            TEXT,
    razorpay_customer_id        TEXT,

    status                      TEXT NOT NULL DEFAULT 'active'
                                    CHECK (status IN ('active','cancelled','past_due','expired','trialing')),
    current_period_start        TIMESTAMPTZ,
    current_period_end          TIMESTAMPTZ,
    cancelled_at                TIMESTAMPTZ,
    cancel_reason               TEXT,

    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_domain_subscriptions_dealer   ON domain_subscriptions(dealer_id);
CREATE INDEX idx_domain_subscriptions_status   ON domain_subscriptions(status);
CREATE INDEX idx_domain_subscriptions_razorpay ON domain_subscriptions(razorpay_subscription_id);

CREATE TRIGGER domain_subscriptions_updated_at
    BEFORE UPDATE ON domain_subscriptions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ══════════════════════════════════════════════════════════
-- 7. ANALYTICS  (daily aggregates per dealer)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS analytics_daily (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id           UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    date                DATE NOT NULL,

    -- Traffic
    page_views          INTEGER NOT NULL DEFAULT 0,
    unique_visitors     INTEGER NOT NULL DEFAULT 0,
    bounce_rate         NUMERIC(5,2),       -- percentage 0-100

    -- Conversions
    leads_count         INTEGER NOT NULL DEFAULT 0,
    test_drives_count   INTEGER NOT NULL DEFAULT 0,
    calls_count         INTEGER NOT NULL DEFAULT 0,
    whatsapp_count      INTEGER NOT NULL DEFAULT 0,

    -- Traffic sources
    organic_traffic     INTEGER NOT NULL DEFAULT 0,
    social_traffic      INTEGER NOT NULL DEFAULT 0,
    direct_traffic      INTEGER NOT NULL DEFAULT 0,
    referral_traffic    INTEGER NOT NULL DEFAULT 0,

    -- Top pages (JSONB array: [{page, views}])
    top_pages           JSONB DEFAULT '[]',

    -- Device split
    mobile_pct          NUMERIC(5,2),
    desktop_pct         NUMERIC(5,2),
    tablet_pct          NUMERIC(5,2),

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (dealer_id, date)
);

CREATE INDEX idx_analytics_dealer_date ON analytics_daily(dealer_id, date DESC);

-- ══════════════════════════════════════════════════════════
-- 8. NOTIFICATION SETTINGS
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notification_settings (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id               UUID NOT NULL UNIQUE REFERENCES dealers(id) ON DELETE CASCADE,

    -- Email notification toggles
    new_leads               BOOLEAN NOT NULL DEFAULT TRUE,
    test_drives             BOOLEAN NOT NULL DEFAULT TRUE,
    service_bookings        BOOLEAN NOT NULL DEFAULT TRUE,
    reviews                 BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_report           BOOLEAN NOT NULL DEFAULT TRUE,

    -- Channels
    email_enabled           BOOLEAN NOT NULL DEFAULT TRUE,
    whatsapp_enabled        BOOLEAN NOT NULL DEFAULT FALSE,
    sms_enabled             BOOLEAN NOT NULL DEFAULT FALSE,

    -- Frequency
    digest_frequency        TEXT NOT NULL DEFAULT 'realtime'
                                CHECK (digest_frequency IN ('realtime','hourly','daily','weekly')),

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER notification_settings_updated_at
    BEFORE UPDATE ON notification_settings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ══════════════════════════════════════════════════════════
-- 9. PAYMENTS / TRANSACTION LOG
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS payment_transactions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id               UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    subscription_id         UUID REFERENCES domain_subscriptions(id) ON DELETE SET NULL,

    -- Razorpay identifiers
    razorpay_order_id       TEXT,
    razorpay_payment_id     TEXT UNIQUE,
    razorpay_signature      TEXT,

    amount_paise            INTEGER NOT NULL,    -- in paise: 49900 = ₹499
    currency                TEXT NOT NULL DEFAULT 'INR',
    status                  TEXT NOT NULL
                                CHECK (status IN ('created','authorized','captured','failed','refunded')),
    method                  TEXT,                -- upi, card, netbanking, wallet
    description             TEXT,

    paid_at                 TIMESTAMPTZ,
    refunded_at             TIMESTAMPTZ,
    refund_amount_paise     INTEGER,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_dealer    ON payment_transactions(dealer_id);
CREATE INDEX idx_payments_razorpay  ON payment_transactions(razorpay_payment_id);
CREATE INDEX idx_payments_status    ON payment_transactions(status);

-- ══════════════════════════════════════════════════════════
-- 10. ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════

ALTER TABLE dealers                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_brands            ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_template_configs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_photos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drive_bookings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_domains           ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions     ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user the owner of a dealer row?
CREATE OR REPLACE FUNCTION is_dealer_owner(p_dealer_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM dealers WHERE id = p_dealer_id AND user_id = auth.uid()
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ── dealers ───────────────────────────────────────────────
CREATE POLICY dealers_select ON dealers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY dealers_insert ON dealers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY dealers_update ON dealers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY dealers_delete ON dealers FOR DELETE USING (user_id = auth.uid());

-- ── dealer_brands ─────────────────────────────────────────
CREATE POLICY dealer_brands_all ON dealer_brands
    FOR ALL USING (is_dealer_owner(dealer_id));

-- ── dealer_services ───────────────────────────────────────
CREATE POLICY dealer_services_all ON dealer_services
    FOR ALL USING (is_dealer_owner(dealer_id));

-- ── dealer_template_configs ───────────────────────────────
CREATE POLICY dealer_template_configs_all ON dealer_template_configs
    FOR ALL USING (is_dealer_owner(dealer_id));

-- ── vehicles ──────────────────────────────────────────────
-- Dealer CRUD; public can read available vehicles
CREATE POLICY vehicles_dealer_all ON vehicles
    FOR ALL USING (is_dealer_owner(dealer_id));
CREATE POLICY vehicles_public_read ON vehicles
    FOR SELECT USING (status = 'available');

-- ── vehicle_photos ────────────────────────────────────────
CREATE POLICY vehicle_photos_dealer ON vehicle_photos
    FOR ALL USING (
        EXISTS (SELECT 1 FROM vehicles v WHERE v.id = vehicle_id AND is_dealer_owner(v.dealer_id))
    );
CREATE POLICY vehicle_photos_public ON vehicle_photos
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM vehicles v WHERE v.id = vehicle_id AND v.status = 'available')
    );

-- ── leads ─────────────────────────────────────────────────
CREATE POLICY leads_dealer_all ON leads
    FOR ALL USING (is_dealer_owner(dealer_id));
-- Allow anonymous inserts (website visitors submitting a lead)
CREATE POLICY leads_public_insert ON leads
    FOR INSERT WITH CHECK (TRUE);

-- ── test_drive_bookings ───────────────────────────────────
CREATE POLICY test_drives_dealer ON test_drive_bookings
    FOR ALL USING (is_dealer_owner(dealer_id));
CREATE POLICY test_drives_public_insert ON test_drive_bookings
    FOR INSERT WITH CHECK (TRUE);

-- ── reviews ───────────────────────────────────────────────
CREATE POLICY reviews_dealer ON reviews
    FOR ALL USING (is_dealer_owner(dealer_id));
CREATE POLICY reviews_public_read ON reviews
    FOR SELECT USING (status = 'published');
CREATE POLICY reviews_public_insert ON reviews
    FOR INSERT WITH CHECK (TRUE);

-- ── messages ──────────────────────────────────────────────
CREATE POLICY messages_dealer ON messages
    FOR ALL USING (is_dealer_owner(dealer_id));
CREATE POLICY messages_public_insert ON messages
    FOR INSERT WITH CHECK (TRUE);

-- ── dealer_domains ────────────────────────────────────────
CREATE POLICY dealer_domains_all ON dealer_domains
    FOR ALL USING (is_dealer_owner(dealer_id));

-- ── domain_subscriptions ──────────────────────────────────
CREATE POLICY domain_subscriptions_dealer ON domain_subscriptions
    FOR ALL USING (is_dealer_owner(dealer_id));

-- ── analytics_daily ───────────────────────────────────────
CREATE POLICY analytics_dealer ON analytics_daily
    FOR ALL USING (is_dealer_owner(dealer_id));

-- ── notification_settings ─────────────────────────────────
CREATE POLICY notification_settings_dealer ON notification_settings
    FOR ALL USING (is_dealer_owner(dealer_id));

-- ── payment_transactions ──────────────────────────────────
CREATE POLICY payment_transactions_dealer ON payment_transactions
    FOR ALL USING (is_dealer_owner(dealer_id));

-- ══════════════════════════════════════════════════════════
-- 11. AUTO-PROVISION DEFAULT ROWS (via DB trigger)
--     When a new dealer is created, auto-create related
--     configuration and settings rows.
-- ══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION provision_dealer_defaults()
RETURNS TRIGGER AS $$
BEGIN
    -- Template config
    INSERT INTO dealer_template_configs (dealer_id)
    VALUES (NEW.id)
    ON CONFLICT (dealer_id) DO NOTHING;

    -- Notification settings
    INSERT INTO notification_settings (dealer_id)
    VALUES (NEW.id)
    ON CONFLICT (dealer_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_dealer_insert
    AFTER INSERT ON dealers
    FOR EACH ROW EXECUTE FUNCTION provision_dealer_defaults();

-- ══════════════════════════════════════════════════════════
-- 12. USEFUL VIEWS
-- ══════════════════════════════════════════════════════════

-- Dashboard summary per dealer
CREATE OR REPLACE VIEW dealer_dashboard_summary AS
SELECT
    d.id                                        AS dealer_id,
    d.dealership_name,
    d.subdomain,
    d.style_template,
    d.onboarding_complete,

    -- Inventory counts
    (SELECT COUNT(*) FROM vehicles v
     WHERE v.dealer_id = d.id AND v.status = 'available')::INT  AS vehicles_available,
    (SELECT COUNT(*) FROM vehicles v
     WHERE v.dealer_id = d.id AND v.status = 'sold')::INT       AS vehicles_sold,

    -- Lead counts
    (SELECT COUNT(*) FROM leads l
     WHERE l.dealer_id = d.id AND l.status = 'new')::INT        AS leads_new,
    (SELECT COUNT(*) FROM leads l
     WHERE l.dealer_id = d.id
       AND l.created_at >= NOW() - INTERVAL '30 days')::INT     AS leads_30d,

    -- Review summary
    (SELECT COUNT(*) FROM reviews r
     WHERE r.dealer_id = d.id AND r.status = 'published')::INT  AS reviews_count,
    (SELECT ROUND(AVG(rating), 1) FROM reviews r
     WHERE r.dealer_id = d.id AND r.status = 'published')       AS avg_rating,

    -- Analytics last 30 days
    (SELECT COALESCE(SUM(page_views), 0) FROM analytics_daily a
     WHERE a.dealer_id = d.id
       AND a.date >= NOW() - INTERVAL '30 days')                AS visitors_30d,
    (SELECT COALESCE(SUM(leads_count), 0) FROM analytics_daily a
     WHERE a.dealer_id = d.id
       AND a.date >= NOW() - INTERVAL '30 days')                AS analytics_leads_30d,

    d.created_at
FROM dealers d;

-- Top performing vehicles per dealer
CREATE OR REPLACE VIEW top_performing_vehicles AS
SELECT
    v.dealer_id,
    v.id         AS vehicle_id,
    v.make,
    v.model,
    v.variant,
    v.year,
    v.price_paise,
    v.views,
    v.leads_count,
    v.status
FROM vehicles v
ORDER BY v.dealer_id, (v.views + v.leads_count * 5) DESC;

-- ══════════════════════════════════════════════════════════
-- 13. HELPFUL COMMENTS
-- ══════════════════════════════════════════════════════════
COMMENT ON TABLE dealers                  IS 'Core dealer profiles — one row per dealership';
COMMENT ON TABLE dealer_brands            IS 'Brands the dealer sells (Step 2 onboarding)';
COMMENT ON TABLE dealer_services          IS 'Services the dealer offers (Step 3 onboarding)';
COMMENT ON TABLE dealer_template_configs  IS 'Website customization options (Step 5 onboarding)';
COMMENT ON TABLE vehicles                 IS 'Dealer inventory — new catalog & used listings';
COMMENT ON TABLE vehicle_photos           IS 'Photos for each vehicle, stored in Supabase Storage';
COMMENT ON TABLE leads                    IS 'Customer inquiries from the dealer website (CRM)';
COMMENT ON TABLE test_drive_bookings      IS 'Test drive appointments linked to leads';
COMMENT ON TABLE reviews                  IS 'Customer reviews with moderation workflow';
COMMENT ON TABLE messages                 IS 'Contact form submissions from dealer website';
COMMENT ON TABLE dealer_domains           IS 'Subdomains and custom domains per dealer';
COMMENT ON TABLE domain_subscriptions     IS 'Paid domain/plan subscriptions (Phase 2)';
COMMENT ON TABLE analytics_daily          IS 'Daily aggregated traffic and conversion metrics';
COMMENT ON TABLE notification_settings    IS 'Per-dealer email/WhatsApp notification toggles';
COMMENT ON TABLE payment_transactions     IS 'Razorpay payment log for subscriptions';
COMMENT ON COLUMN vehicles.price_paise    IS 'Ex-showroom price in paise (divide by 100 for INR)';
COMMENT ON COLUMN payment_transactions.amount_paise IS 'Amount in paise (divide by 100 for INR)';
