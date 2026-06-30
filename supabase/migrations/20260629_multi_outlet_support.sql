-- Multi-outlet support: each dealer_brands row can store outlet-level
-- contact details and sub-branches, enabling dealer-group → outlet hierarchy.

-- ── 1. Add outlet columns to dealer_brands ──────────────────────────────────
ALTER TABLE public.dealer_brands
  ADD COLUMN IF NOT EXISTS outlet_name   TEXT,
  ADD COLUMN IF NOT EXISTS phone         TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp      TEXT,
  ADD COLUMN IF NOT EXISTS email         TEXT,
  ADD COLUMN IF NOT EXISTS full_address  TEXT,
  ADD COLUMN IF NOT EXISTS city          TEXT,
  ADD COLUMN IF NOT EXISTS state         TEXT,
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
  ADD COLUMN IF NOT EXISTS branches      JSONB;

-- ── 2. Recreate public view to expose new columns ───────────────────────────
DROP VIEW IF EXISTS public.public_dealer_site_brands;

CREATE VIEW public.public_dealer_site_brands
WITH (security_barrier = true)
AS
SELECT
    b.dealer_id,
    b.brand_name,
    b.vehicle_type,
    b.is_primary,
    b.outlet_name,
    b.phone,
    b.whatsapp,
    b.email,
    b.full_address,
    b.city,
    b.state,
    b.google_maps_url,
    b.branches
FROM public.dealer_brands b
JOIN public.dealers d ON d.id = b.dealer_id
WHERE d.onboarding_complete = true
  AND d.is_active = true
  AND d.slug IS NOT NULL;

REVOKE ALL ON public.public_dealer_site_brands FROM PUBLIC;
GRANT SELECT ON public.public_dealer_site_brands TO anon, authenticated, service_role;

COMMENT ON VIEW public.public_dealer_site_brands IS
    'Safe public dealer brand read model with outlet-level contact details for website routing and rendering.';
