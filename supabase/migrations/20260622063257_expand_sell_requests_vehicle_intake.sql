ALTER TABLE public.sell_requests
    ADD COLUMN IF NOT EXISTS vin text,
    ADD COLUMN IF NOT EXISTS color text,
    ADD COLUMN IF NOT EXISTS body_type text,
    ADD COLUMN IF NOT EXISTS features text[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS insurance_status text NOT NULL DEFAULT 'unknown',
    ADD COLUMN IF NOT EXISTS insurance_provider text,
    ADD COLUMN IF NOT EXISTS insurance_valid_until date,
    ADD COLUMN IF NOT EXISTS insurance_quote_url text,
    ADD COLUMN IF NOT EXISTS video_url text,
    ADD COLUMN IF NOT EXISTS accident_history text,
    ADD COLUMN IF NOT EXISTS flood_damage boolean,
    ADD COLUMN IF NOT EXISTS service_history_available boolean,
    ADD COLUMN IF NOT EXISTS rc_available boolean,
    ADD COLUMN IF NOT EXISTS loan_active boolean;

ALTER TABLE public.sell_requests
    DROP CONSTRAINT IF EXISTS sell_requests_insurance_status_check,
    ADD CONSTRAINT sell_requests_insurance_status_check
        CHECK (insurance_status IN ('unknown', 'active', 'expired', 'expiring_soon')),
    DROP CONSTRAINT IF EXISTS sell_requests_accident_history_check,
    ADD CONSTRAINT sell_requests_accident_history_check
        CHECK (accident_history IS NULL OR accident_history IN ('unknown', 'none', 'minor', 'major'));

DROP POLICY IF EXISTS sell_requests_public_insert ON public.sell_requests;
CREATE POLICY sell_requests_public_insert
    ON public.sell_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS sell_requests_owner_read ON public.sell_requests;
CREATE POLICY sell_requests_owner_read
    ON public.sell_requests
    FOR SELECT
    TO authenticated
    USING (dealer_id IS NULL OR public.is_dealer_owner(dealer_id));

DROP POLICY IF EXISTS sell_requests_owner_update ON public.sell_requests;
CREATE POLICY sell_requests_owner_update
    ON public.sell_requests
    FOR UPDATE
    TO authenticated
    USING (dealer_id IS NULL OR public.is_dealer_owner(dealer_id))
    WITH CHECK (dealer_id IS NULL OR public.is_dealer_owner(dealer_id));

COMMENT ON COLUMN public.sell_requests.vin IS 'Seller-provided VIN or chassis number for admin verification before listing.';
COMMENT ON COLUMN public.sell_requests.features IS 'Seller-selected inventory features to copy into vehicles when approved.';
COMMENT ON COLUMN public.sell_requests.accident_history IS 'Seller-declared accident history: unknown, none, minor, or major.';
