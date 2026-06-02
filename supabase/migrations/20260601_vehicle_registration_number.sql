ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS registration_number text;

CREATE INDEX IF NOT EXISTS idx_vehicles_dealer_registration_number
ON vehicles(dealer_id, registration_number)
WHERE registration_number IS NOT NULL;

COMMENT ON COLUMN vehicles.registration_number IS 'Public vehicle registration number / number plate for listing display and RC lookup workflows.';
