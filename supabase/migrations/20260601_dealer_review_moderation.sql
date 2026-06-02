ALTER TABLE dealer_reviews
    ADD COLUMN IF NOT EXISTS moderation_status text
        CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
    ADD COLUMN IF NOT EXISTS admin_reply text,
    ADD COLUMN IF NOT EXISTS replied_at timestamptz,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE dealer_reviews
SET moderation_status = CASE WHEN is_approved THEN 'approved' ELSE 'pending' END
WHERE moderation_status IS NULL;

ALTER TABLE dealer_reviews
    ALTER COLUMN moderation_status SET DEFAULT 'pending',
    ALTER COLUMN moderation_status SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dealer_reviews_moderation_status
    ON dealer_reviews(dealer_id, moderation_status);

COMMENT ON COLUMN dealer_reviews.moderation_status IS 'Admin moderation workflow for public customer reviews.';
COMMENT ON COLUMN dealer_reviews.admin_reply IS 'Dealer response shown with approved reviews.';
