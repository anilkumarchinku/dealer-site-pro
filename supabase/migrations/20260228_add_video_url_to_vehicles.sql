-- Add video_url column to vehicles table
-- Allows dealers to attach a YouTube walkaround video to each listing
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS video_url TEXT;

COMMENT ON COLUMN vehicles.video_url IS 'YouTube video URL for vehicle walkaround/review';
