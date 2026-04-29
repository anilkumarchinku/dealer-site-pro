-- Align Supabase migrations with the 3W service booking form/type.

ALTER TABLE IF EXISTS thw_service_bookings
    ADD COLUMN IF NOT EXISTS vehicle_reg_no TEXT;
