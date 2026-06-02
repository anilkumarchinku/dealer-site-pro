ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS image_url text,
    ADD COLUMN IF NOT EXISTS video_url text;

COMMENT ON COLUMN vehicles.image_url IS 'Primary public image URL for manual 4W inventory listings.';
COMMENT ON COLUMN vehicles.video_url IS 'Optional YouTube video URL for vehicle walkaround/review.';
