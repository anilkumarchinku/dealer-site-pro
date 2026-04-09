-- Add colors column to tw_catalog for storing available color options per variant
ALTER TABLE tw_catalog ADD COLUMN IF NOT EXISTS colors text[] DEFAULT NULL;
