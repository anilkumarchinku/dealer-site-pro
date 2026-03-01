-- Create reviews table for buyer reviews on dealer sites
CREATE TABLE IF NOT EXISTS dealer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    reviewer_name TEXT NOT NULL,
    reviewer_phone TEXT,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    car_purchased TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast per-dealer lookup
CREATE INDEX IF NOT EXISTS idx_dealer_reviews_dealer_id ON dealer_reviews(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_reviews_approved ON dealer_reviews(dealer_id, is_approved);

-- RLS
ALTER TABLE dealer_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews for any dealer
CREATE POLICY "Public read approved reviews"
    ON dealer_reviews FOR SELECT
    USING (is_approved = TRUE);

-- Anyone can insert a review (rate-limited at API layer)
CREATE POLICY "Public insert reviews"
    ON dealer_reviews FOR INSERT
    WITH CHECK (TRUE);

-- Dealers can read all their own reviews (authenticated)
CREATE POLICY "Dealers read own reviews"
    ON dealer_reviews FOR SELECT
    TO authenticated
    USING (dealer_id = auth.uid());

-- Dealers can approve/delete their own reviews
CREATE POLICY "Dealers update own reviews"
    ON dealer_reviews FOR UPDATE
    TO authenticated
    USING (dealer_id = auth.uid());

COMMENT ON TABLE dealer_reviews IS 'Buyer reviews displayed on dealer sites. New reviews require approval before going public.';
