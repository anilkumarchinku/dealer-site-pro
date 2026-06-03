-- Add 'draft' status to vehicles table
-- Draft vehicles are incomplete listings that need dealer input before publishing

-- Drop existing constraint
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;

-- Add new constraint with 'draft'
ALTER TABLE vehicles ADD CONSTRAINT vehicles_status_check
    CHECK (status IN ('available', 'reserved', 'sold', 'inactive', 'draft'));

-- Add index for draft filtering
CREATE INDEX IF NOT EXISTS idx_vehicles_status_draft
    ON vehicles(dealer_id, status)
    WHERE status = 'draft';

COMMENT ON COLUMN vehicles.status IS
    'Vehicle status: draft (incomplete), available, reserved, sold, or inactive';
