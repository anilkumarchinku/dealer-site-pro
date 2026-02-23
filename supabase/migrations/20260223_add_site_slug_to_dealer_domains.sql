-- Add site_slug to dealer_domains so a custom domain can point to a
-- specific brand/site (e.g. "shiv-motors-mahindra") instead of always
-- landing on the dealer's main hub page.

ALTER TABLE dealer_domains
    ADD COLUMN IF NOT EXISTS site_slug TEXT;
