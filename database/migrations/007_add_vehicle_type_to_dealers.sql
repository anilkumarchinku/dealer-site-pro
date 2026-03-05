-- Migration 007: Add vehicle_type column to dealers table
-- Tracks whether the dealer sells cars, two-wheelers, or three-wheelers.
-- Populated at the end of onboarding (step-5) by the saveDealer action.

ALTER TABLE dealers
    ADD COLUMN IF NOT EXISTS vehicle_type TEXT
        CHECK (vehicle_type IN ('car', 'two-wheeler', 'three-wheeler'))
        DEFAULT 'car';

COMMENT ON COLUMN dealers.vehicle_type IS
    'Vehicle category this dealer operates in: car | two-wheeler | three-wheeler';
