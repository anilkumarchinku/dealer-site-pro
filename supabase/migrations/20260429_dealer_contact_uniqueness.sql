-- Keep dealer registration contact details unique.
-- Auth already enforces unique email addresses for login, and these indexes
-- protect the dealer profile table that is created after email verification.

CREATE UNIQUE INDEX IF NOT EXISTS dealers_email_unique_ci_idx
    ON dealers (LOWER(BTRIM(email)))
    WHERE email IS NOT NULL AND BTRIM(email) <> '';

CREATE UNIQUE INDEX IF NOT EXISTS dealers_mobile_unique_10_digit_idx
    ON dealers ((RIGHT(REGEXP_REPLACE(phone, '\D', '', 'g'), 10)))
    WHERE phone IS NOT NULL
      AND LENGTH(REGEXP_REPLACE(phone, '\D', '', 'g')) >= 10;
