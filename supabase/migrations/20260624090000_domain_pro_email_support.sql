-- PRO custom-domain billing compatibility and email support requests.

ALTER TABLE public.domain_subscriptions
    ADD COLUMN IF NOT EXISTS tier TEXT CHECK (tier IS NULL OR tier IN ('pro', 'premium')),
    ADD COLUMN IF NOT EXISTS price_paise INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
    ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

UPDATE public.domain_subscriptions
SET
    tier = CASE
        WHEN tier IS NULL AND plan IN ('pro', 'premium') THEN plan
        ELSE tier
    END,
    price_paise = CASE
        WHEN price_paise = 0 AND plan = 'pro' THEN 49900
        WHEN price_paise = 0 AND plan = 'premium' THEN 99900
        ELSE price_paise
    END;

CREATE INDEX IF NOT EXISTS idx_domain_subscriptions_dealer_domain_status
    ON public.domain_subscriptions(dealer_id, domain_id, status);

CREATE TABLE IF NOT EXISTS public.domain_email_support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES public.dealers(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES public.dealer_domains(id) ON DELETE SET NULL,
    domain TEXT NOT NULL,
    requester_user_id UUID,
    requester_email TEXT,
    mx_status TEXT NOT NULL DEFAULT 'not_checked'
        CHECK (mx_status IN ('not_checked', 'found', 'missing', 'error')),
    mx_records JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_domain_email_support_requests_dealer
    ON public.domain_email_support_requests(dealer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_domain_email_support_requests_status
    ON public.domain_email_support_requests(status, created_at DESC);

DROP TRIGGER IF EXISTS domain_email_support_requests_updated_at
    ON public.domain_email_support_requests;

CREATE TRIGGER domain_email_support_requests_updated_at
    BEFORE UPDATE ON public.domain_email_support_requests
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.domain_email_support_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS domain_email_support_requests_owner_select
    ON public.domain_email_support_requests;
DROP POLICY IF EXISTS domain_email_support_requests_owner_insert
    ON public.domain_email_support_requests;
DROP POLICY IF EXISTS domain_email_support_requests_owner_update
    ON public.domain_email_support_requests;

CREATE POLICY domain_email_support_requests_owner_select
    ON public.domain_email_support_requests
    FOR SELECT
    TO authenticated
    USING (public.is_dealer_owner(dealer_id));

CREATE POLICY domain_email_support_requests_owner_insert
    ON public.domain_email_support_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_dealer_owner(dealer_id));

CREATE POLICY domain_email_support_requests_owner_update
    ON public.domain_email_support_requests
    FOR UPDATE
    TO authenticated
    USING (public.is_dealer_owner(dealer_id))
    WITH CHECK (public.is_dealer_owner(dealer_id));
