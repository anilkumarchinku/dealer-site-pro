-- Migration 010: Add sells_* boolean flags to dealers table
-- These flags track which vehicle categories a dealer sells.
-- Referenced in onboarding (save-dealer.ts), dashboard layout,
-- settings page, and webpage builder — but were never added via migration.

ALTER TABLE dealers
    ADD COLUMN IF NOT EXISTS sells_four_wheelers  BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS sells_two_wheelers   BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS sells_three_wheelers BOOLEAN NOT NULL DEFAULT false;

-- Back-fill from existing vehicle_type column where possible
UPDATE dealers
SET
    sells_four_wheelers  = (vehicle_type = 'car'           OR vehicle_type IS NULL),
    sells_two_wheelers   = (vehicle_type = 'two-wheeler'),
    sells_three_wheelers = (vehicle_type = 'three-wheeler')
WHERE vehicle_type IS NOT NULL;

COMMENT ON COLUMN dealers.sells_four_wheelers  IS 'True when dealer sells cars / SUVs (4-wheelers)';
COMMENT ON COLUMN dealers.sells_two_wheelers   IS 'True when dealer sells bikes / scooters (2-wheelers)';
COMMENT ON COLUMN dealers.sells_three_wheelers IS 'True when dealer sells autos / cargo 3-wheelers';
