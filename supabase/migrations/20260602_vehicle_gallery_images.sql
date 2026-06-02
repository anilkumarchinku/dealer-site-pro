ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN vehicles.image_urls IS 'Ordered public image URLs for manual 4W inventory listings. First item is the main listing image.';
