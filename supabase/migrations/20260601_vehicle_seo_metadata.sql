ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS meta_title text,
    ADD COLUMN IF NOT EXISTS meta_description text;

COMMENT ON COLUMN vehicles.meta_title IS 'Optional listing-level SEO title controlled by dealer admins.';
COMMENT ON COLUMN vehicles.meta_description IS 'Optional listing-level SEO description controlled by dealer admins.';
