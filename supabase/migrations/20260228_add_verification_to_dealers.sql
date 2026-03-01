-- Add verification fields to dealers table
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS verification_score INTEGER DEFAULT 0;
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS verification_checklist JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN dealers.is_verified IS 'True when dealer has earned DealerSite Verified badge (score >= 80)';
COMMENT ON COLUMN dealers.verification_score IS 'Score out of 100 based on completed checklist items';
COMMENT ON COLUMN dealers.verification_checklist IS 'Array of completed checklist item IDs';
