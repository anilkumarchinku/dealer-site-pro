-- Add hero_image_url column to dealers table for dealer-uploaded hero/banner images
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
