-- Migration 009: Add vehicle_type column to dealer_brands table
-- Tracks whether each brand entry is for cars, two-wheelers, or three-wheelers.
-- Populated at the end of onboarding by the saveDealer action.

ALTER TABLE dealer_brands
    ADD COLUMN IF NOT EXISTS vehicle_type TEXT
        CHECK (vehicle_type IN ('cars', '2w', '3w'))
        DEFAULT 'cars';

COMMENT ON COLUMN dealer_brands.vehicle_type IS
    'Vehicle category for this brand: cars | 2w | 3w';
