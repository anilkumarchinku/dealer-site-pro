-- Add reviewer_email and reviewer_phone for verified-customer-only reviews
ALTER TABLE public.dealer_reviews
    ADD COLUMN IF NOT EXISTS reviewer_email text,
    ADD COLUMN IF NOT EXISTS reviewer_phone text;

ALTER TABLE public.service_center_reviews
    ADD COLUMN IF NOT EXISTS reviewer_email text,
    ADD COLUMN IF NOT EXISTS reviewer_phone text;

CREATE INDEX IF NOT EXISTS idx_dealer_reviews_email ON public.dealer_reviews(reviewer_email);
