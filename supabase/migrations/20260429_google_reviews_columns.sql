-- Keep Supabase migrations aligned with the Google reviews sync route.
-- The same migration also exists in database/migrations for older deploy flows.

ALTER TABLE dealers
    ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
    ADD COLUMN IF NOT EXISTS google_place_id TEXT;

ALTER TABLE dealer_reviews
    ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'website',
    ADD COLUMN IF NOT EXISTS external_id TEXT;

ALTER TABLE dealer_reviews
    DROP CONSTRAINT IF EXISTS dealer_reviews_dealer_external_uq;

ALTER TABLE dealer_reviews
    ADD CONSTRAINT dealer_reviews_dealer_external_uq
    UNIQUE (dealer_id, external_id);
