-- ============================================================
-- dealer_deployments — add missing columns + fix unique constraint
-- Run this migration after 20260218_dealer_deployments.sql
-- ============================================================

-- Add version_number: tracks which deploy iteration this is for a dealer
ALTER TABLE dealer_deployments
    ADD COLUMN IF NOT EXISTS version_number  INTEGER NOT NULL DEFAULT 1;

-- Add commit_message: human-readable label for the deployment
ALTER TABLE dealer_deployments
    ADD COLUMN IF NOT EXISTS commit_message  TEXT;

-- Add is_current: flags the most recent successful deployment per dealer
ALTER TABLE dealer_deployments
    ADD COLUMN IF NOT EXISTS is_current      BOOLEAN NOT NULL DEFAULT FALSE;

-- The original migration created a UNIQUE index on dealer_id, allowing only
-- one record per dealer. The deploy pipeline intentionally inserts a new row
-- per deployment (version history). Drop the bad constraint.
DROP INDEX IF EXISTS idx_dealer_deployments_dealer_unique;

-- Add a composite index for efficient "latest for this dealer" queries
CREATE INDEX IF NOT EXISTS idx_dealer_deployments_dealer_version
    ON dealer_deployments(dealer_id, version_number DESC);

-- Add index to quickly find the current live deploy per dealer
CREATE INDEX IF NOT EXISTS idx_dealer_deployments_current
    ON dealer_deployments(dealer_id, is_current)
    WHERE is_current = TRUE;
