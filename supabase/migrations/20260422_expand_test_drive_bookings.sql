ALTER TABLE test_drive_bookings
    ADD COLUMN IF NOT EXISTS customer_email TEXT,
    ADD COLUMN IF NOT EXISTS vehicle_interest TEXT,
    ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'website',
    ADD COLUMN IF NOT EXISTS utm_source TEXT;

COMMENT ON COLUMN test_drive_bookings.customer_email IS 'Optional customer email captured during booking';
COMMENT ON COLUMN test_drive_bookings.vehicle_interest IS 'Vehicle/model name when vehicle_id is unavailable';
COMMENT ON COLUMN test_drive_bookings.source IS 'Booking source channel';
COMMENT ON COLUMN test_drive_bookings.utm_source IS 'Page/referrer where the booking originated';
