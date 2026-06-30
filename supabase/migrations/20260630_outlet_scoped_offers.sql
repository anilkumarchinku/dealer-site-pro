-- Outlet-scoped offers: allow dealers to target promotions to specific outlets/branches.

-- ── 1. Add scoping & content columns to dealer_offers ─────────────────────────
ALTER TABLE public.dealer_offers
  ADD COLUMN IF NOT EXISTS brand_id       UUID REFERENCES public.dealer_brands(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS branch_city    TEXT,
  ADD COLUMN IF NOT EXISTS image_url      TEXT,
  ADD COLUMN IF NOT EXISTS promotion_type TEXT DEFAULT 'offer';

CREATE INDEX IF NOT EXISTS idx_dealer_offers_brand_id ON public.dealer_offers(brand_id);

-- ── 2. Public view for anonymous access on public sites ───────────────────────
CREATE VIEW public.public_dealer_site_offers
WITH (security_barrier = true)
AS
SELECT
    o.id,
    o.dealer_id,
    o.title,
    o.description,
    o.tag,
    o.valid_until,
    o.image_url,
    o.promotion_type,
    o.brand_id,
    o.branch_city,
    o.created_at,
    b.brand_name  AS outlet_name,
    b.vehicle_type AS outlet_vehicle_type
FROM public.dealer_offers o
LEFT JOIN public.dealer_brands b ON b.id = o.brand_id
JOIN public.dealers d ON d.id = o.dealer_id
WHERE o.is_active = true
  AND (o.valid_until IS NULL OR o.valid_until >= CURRENT_DATE)
  AND d.onboarding_complete = true
  AND d.is_active = true;

REVOKE ALL ON public.public_dealer_site_offers FROM PUBLIC;
GRANT SELECT ON public.public_dealer_site_offers TO anon, authenticated, service_role;

COMMENT ON VIEW public.public_dealer_site_offers IS
    'Active, non-expired dealer offers with optional outlet scoping for public site rendering.';
