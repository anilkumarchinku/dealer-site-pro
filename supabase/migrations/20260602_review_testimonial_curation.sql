ALTER TABLE dealer_reviews
    ADD COLUMN IF NOT EXISTS show_on_homepage boolean NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_dealer_reviews_testimonials
    ON dealer_reviews(dealer_id, show_on_homepage, display_order, created_at DESC)
    WHERE is_approved = true AND moderation_status = 'approved';

COMMENT ON COLUMN dealer_reviews.show_on_homepage IS 'Controls whether an approved review appears in public Customer Testimonials sections.';
COMMENT ON COLUMN dealer_reviews.display_order IS 'Admin-controlled display order for public Customer Testimonials.';
