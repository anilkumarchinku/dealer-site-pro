-- ============================================================
-- Car Catalog Table
-- Global reference table for all car models (scraped data).
-- NOT tied to any dealer — used for autocomplete & demo fallback.
-- Run this in Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS car_catalog (
    id              TEXT PRIMARY KEY,          -- slug like "maruti-baleno"
    make            TEXT NOT NULL,             -- "Maruti Suzuki"
    model           TEXT NOT NULL,             -- "Baleno"
    variant         TEXT,                      -- "Standard"
    year            SMALLINT NOT NULL,
    body_type       TEXT
                        CHECK (body_type IN (
                            'Sedan','Hatchback','SUV','MUV','Coupe',
                            'Convertible','Pickup','Van','Wagon','Crossover'
                        )),
    fuel_type       TEXT
                        CHECK (fuel_type IN (
                            'Petrol','Diesel','CNG','Electric','Hybrid','LPG'
                        )),
    transmission    TEXT
                        CHECK (transmission IN (
                            'Manual','Automatic','AMT','CVT','DCT','iMT'
                        )),
    seating_capacity SMALLINT,
    engine_cc       SMALLINT,

    -- Pricing in paise (divide by 100 for INR)
    price_min_paise BIGINT NOT NULL DEFAULT 0,
    price_max_paise BIGINT NOT NULL DEFAULT 0,

    -- Media
    image_url       TEXT,
    source_url      TEXT,                      -- cardekho / carwale link
    scraped_at      TIMESTAMPTZ,

    -- Meta
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_car_catalog_make       ON car_catalog(make);
CREATE INDEX idx_car_catalog_body_type  ON car_catalog(body_type);
CREATE INDEX idx_car_catalog_fuel_type  ON car_catalog(fuel_type);
CREATE INDEX idx_car_catalog_search     ON car_catalog USING GIN (
    to_tsvector('english', make || ' ' || model || ' ' || COALESCE(variant,''))
);

CREATE OR REPLACE FUNCTION set_car_catalog_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER car_catalog_updated_at
    BEFORE UPDATE ON car_catalog
    FOR EACH ROW EXECUTE FUNCTION set_car_catalog_updated_at();

-- Public read — anyone can browse the catalog
ALTER TABLE car_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY car_catalog_public_read ON car_catalog FOR SELECT USING (TRUE);
CREATE POLICY car_catalog_admin_all   ON car_catalog FOR ALL USING (
    EXISTS (SELECT 1 FROM dealers WHERE user_id = auth.uid() AND role = 'admin')
);

COMMENT ON TABLE car_catalog IS 'Global reference catalog of car models scraped from cardekho.com';
COMMENT ON COLUMN car_catalog.price_min_paise IS 'Ex-showroom minimum price in paise (÷100 for ₹)';
COMMENT ON COLUMN car_catalog.price_max_paise IS 'Ex-showroom maximum price in paise (÷100 for ₹)';
