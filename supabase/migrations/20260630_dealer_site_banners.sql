-- Website-scoped responsive banners shown above the services section.
CREATE TABLE IF NOT EXISTS public.dealer_site_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES public.dealers(id) ON DELETE CASCADE,
    site_slug TEXT,
    title TEXT,
    desktop_image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dealer_site_banners_dealer_site
    ON public.dealer_site_banners(dealer_id, site_slug, sort_order)
    WHERE is_active = TRUE;

ALTER TABLE public.dealer_site_banners ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.dealer_site_banners TO anon;
GRANT SELECT ON public.dealer_site_banners TO authenticated;

DROP POLICY IF EXISTS "Public can read active dealer site banners" ON public.dealer_site_banners;
CREATE POLICY "Public can read active dealer site banners"
    ON public.dealer_site_banners
    FOR SELECT
    TO anon, authenticated
    USING (is_active = TRUE);
