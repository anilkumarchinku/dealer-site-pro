-- Public read models for dealership websites.
--
-- The public site resolver must work with the anon key because local/dev and
-- public website rendering should not require SUPABASE_SERVICE_ROLE_KEY. Do not
-- add a broad anon SELECT policy to dealers: that table contains private fields
-- such as cyepro_api_key. These views expose only fields intended for public
-- website rendering and only for active, onboarded dealers.

ALTER TABLE public.dealers
    ADD COLUMN IF NOT EXISTS sells_two_wheelers boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS sells_three_wheelers boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS sells_four_wheelers boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS vehicle_type text,
    ADD COLUMN IF NOT EXISTS cyepro_api_key text,
    ADD COLUMN IF NOT EXISTS hero_image_urls text[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS branches jsonb;

DROP VIEW IF EXISTS public.public_dealer_site_service_centers;
DROP VIEW IF EXISTS public.public_dealer_site_services;
DROP VIEW IF EXISTS public.public_dealer_site_configs;
DROP VIEW IF EXISTS public.public_dealer_site_template_configs;
DROP VIEW IF EXISTS public.public_dealer_site_brands;
DROP VIEW IF EXISTS public.public_dealer_site_profiles;

CREATE VIEW public.public_dealer_site_profiles
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
    d.hero_image_urls,
    d.branches
FROM public.dealers d
WHERE d.onboarding_complete = true
  AND d.is_active = true
  AND d.slug IS NOT NULL;

CREATE VIEW public.public_dealer_site_brands
WITH (security_barrier = true)
AS
SELECT
    b.dealer_id,
    b.brand_name,
    b.vehicle_type,
    b.is_primary
FROM public.dealer_brands b
JOIN public.dealers d ON d.id = b.dealer_id
WHERE d.onboarding_complete = true
  AND d.is_active = true
  AND d.slug IS NOT NULL;

CREATE VIEW public.public_dealer_site_template_configs
WITH (security_barrier = true)
AS
SELECT
    c.dealer_id,
    c.hero_title,
    c.hero_subtitle,
    c.hero_cta_text,
    c.working_hours,
    c.facebook_url,
    c.instagram_url,
    c.youtube_url,
    c.twitter_url,
    c.linkedin_url
FROM public.dealer_template_configs c
JOIN public.dealers d ON d.id = c.dealer_id
WHERE d.onboarding_complete = true
  AND d.is_active = true
  AND d.slug IS NOT NULL;

CREATE VIEW public.public_dealer_site_configs
WITH (security_barrier = true)
AS
SELECT
    c.dealer_id,
    c.brand_slug,
    c.style_template,
    c.hero_title,
    c.hero_subtitle,
    c.hero_cta_text,
    c.working_hours,
    c.tagline
FROM public.dealer_site_configs c
JOIN public.dealers d ON d.id = c.dealer_id
WHERE d.onboarding_complete = true
  AND d.is_active = true
  AND d.slug IS NOT NULL;

CREATE VIEW public.public_dealer_site_services
WITH (security_barrier = true)
AS
SELECT
    s.dealer_id,
    s.service_name
FROM public.dealer_services s
JOIN public.dealers d ON d.id = s.dealer_id
WHERE d.onboarding_complete = true
  AND d.is_active = true
  AND d.slug IS NOT NULL
  AND s.is_active = true;

CREATE VIEW public.public_dealer_site_service_centers
WITH (security_barrier = true)
AS
SELECT
    sc.id,
    sc.dealer_id,
    sc.name,
    sc.address,
    sc.city,
    sc.phone,
    sc.display_order
FROM public.service_centers sc
JOIN public.dealers d ON d.id = sc.dealer_id
WHERE d.onboarding_complete = true
  AND d.is_active = true
  AND d.slug IS NOT NULL
  AND sc.is_active = true;

REVOKE ALL ON public.public_dealer_site_profiles FROM PUBLIC;
REVOKE ALL ON public.public_dealer_site_brands FROM PUBLIC;
REVOKE ALL ON public.public_dealer_site_template_configs FROM PUBLIC;
REVOKE ALL ON public.public_dealer_site_configs FROM PUBLIC;
REVOKE ALL ON public.public_dealer_site_services FROM PUBLIC;
REVOKE ALL ON public.public_dealer_site_service_centers FROM PUBLIC;

GRANT SELECT ON public.public_dealer_site_profiles TO anon, authenticated, service_role;
GRANT SELECT ON public.public_dealer_site_brands TO anon, authenticated, service_role;
GRANT SELECT ON public.public_dealer_site_template_configs TO anon, authenticated, service_role;
GRANT SELECT ON public.public_dealer_site_configs TO anon, authenticated, service_role;
GRANT SELECT ON public.public_dealer_site_services TO anon, authenticated, service_role;
GRANT SELECT ON public.public_dealer_site_service_centers TO anon, authenticated, service_role;

COMMENT ON VIEW public.public_dealer_site_profiles IS
    'Safe public dealership website fields. Excludes private dealer columns such as cyepro_api_key.';
COMMENT ON VIEW public.public_dealer_site_brands IS
    'Safe public dealer brand read model for website routing and rendering.';
COMMENT ON VIEW public.public_dealer_site_template_configs IS
    'Safe public shared website template configuration for active onboarded dealers.';
COMMENT ON VIEW public.public_dealer_site_configs IS
    'Safe public per-brand website template configuration for active onboarded dealers.';
COMMENT ON VIEW public.public_dealer_site_services IS
    'Safe public service labels for active onboarded dealer websites.';
COMMENT ON VIEW public.public_dealer_site_service_centers IS
    'Safe public service center details for active onboarded dealer websites.';
