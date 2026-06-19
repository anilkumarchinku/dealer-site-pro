ALTER TABLE dealers
    ADD COLUMN IF NOT EXISTS booking_amount_paise bigint NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS four_wheeler_booking_amount_paise bigint NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS two_wheeler_booking_amount_paise bigint NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS three_wheeler_booking_amount_paise bigint NOT NULL DEFAULT 0;

ALTER TABLE dealers
    DROP CONSTRAINT IF EXISTS dealers_booking_amount_non_negative,
    ADD CONSTRAINT dealers_booking_amount_non_negative
        CHECK (
            booking_amount_paise >= 0
            AND four_wheeler_booking_amount_paise >= 0
            AND two_wheeler_booking_amount_paise >= 0
            AND three_wheeler_booking_amount_paise >= 0
        );

COMMENT ON COLUMN dealers.booking_amount_paise IS
    'Dealer-wide default booking token amount in paise. Zero means no dealer-level override is configured.';
COMMENT ON COLUMN dealers.four_wheeler_booking_amount_paise IS
    '4W category booking token amount in paise. Zero falls back to dealer-wide amount or existing route behavior.';
COMMENT ON COLUMN dealers.two_wheeler_booking_amount_paise IS
    '2W category booking token amount in paise. Zero falls back to dealer-wide amount or existing route behavior.';
COMMENT ON COLUMN dealers.three_wheeler_booking_amount_paise IS
    '3W category booking token amount in paise. Zero falls back to dealer-wide amount or existing route behavior.';
