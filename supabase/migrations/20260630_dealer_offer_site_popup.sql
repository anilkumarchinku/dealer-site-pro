-- Add website-scoped offer images and optional entry popup support.
ALTER TABLE public.dealer_offers
    ADD COLUMN IF NOT EXISTS site_slug TEXT,
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS show_popup BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_dealer_offers_dealer_site
    ON public.dealer_offers(dealer_id, site_slug)
    WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_dealer_offers_popup
    ON public.dealer_offers(dealer_id, site_slug, show_popup)
    WHERE is_active = TRUE AND show_popup = TRUE AND image_url IS NOT NULL;
