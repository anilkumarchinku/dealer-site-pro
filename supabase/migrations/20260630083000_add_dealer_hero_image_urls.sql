-- Allow used-car dealer templates to auto-scroll through dealer-uploaded hero images.
ALTER TABLE public.dealers
    ADD COLUMN IF NOT EXISTS hero_image_urls text[] NOT NULL DEFAULT '{}';

UPDATE public.dealers
SET hero_image_urls = ARRAY[hero_image_url]
WHERE hero_image_url IS NOT NULL
  AND btrim(hero_image_url) <> ''
  AND cardinality(hero_image_urls) = 0;

CREATE OR REPLACE VIEW public.public_dealer_site_profiles
WITH (security_barrier = true)
AS
SELECT
    d.id,
    d.dealership_name,
    d.tagline,
    d.phone,
    d.email,
    d.location,
    d.full_address,
    d.slug,
    d.style_template,
    d.onboarding_complete,
    d.is_active,
    d.sells_new_cars,
    d.sells_used_cars,
    d.sells_two_wheelers,
    d.sells_three_wheelers,
    d.sells_four_wheelers,
    d.vehicle_type,
    d.logo_url,
    d.hero_image_url,
    d.branches,
    d.hero_image_urls
FROM public.dealers d
WHERE d.onboarding_complete = true
  AND d.is_active = true
  AND d.slug IS NOT NULL;

GRANT SELECT ON public.public_dealer_site_profiles TO anon, authenticated, service_role;

COMMENT ON COLUMN public.dealers.hero_image_urls IS
    'Dealer-uploaded hero/banner image URLs for used-site auto-scrolling carousels. The first URL mirrors hero_image_url for legacy templates.';
