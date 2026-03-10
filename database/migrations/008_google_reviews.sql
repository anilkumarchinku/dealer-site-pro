-- ── 008_google_reviews.sql ────────────────────────────────────────────────────
-- Adds Google Reviews sync support:
--   dealers        → google_maps_url, google_place_id
--   dealer_reviews → source, external_id (for deduplication)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. dealers: store the Google Maps URL and resolved Place ID
ALTER TABLE dealers
    ADD COLUMN IF NOT EXISTS google_maps_url  TEXT,
    ADD COLUMN IF NOT EXISTS google_place_id  TEXT;

-- 2. dealer_reviews: track where each review came from
ALTER TABLE dealer_reviews
    ADD COLUMN IF NOT EXISTS source      TEXT NOT NULL DEFAULT 'website',
    ADD COLUMN IF NOT EXISTS external_id TEXT;           -- Google review ID (for upsert dedup)

-- Unique constraint so we never duplicate a Google review
ALTER TABLE dealer_reviews
    DROP CONSTRAINT IF EXISTS dealer_reviews_dealer_external_uq;
ALTER TABLE dealer_reviews
    ADD CONSTRAINT dealer_reviews_dealer_external_uq
    UNIQUE (dealer_id, external_id);
