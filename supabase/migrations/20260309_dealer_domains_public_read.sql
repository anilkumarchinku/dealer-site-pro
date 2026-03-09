-- Allow public (unauthenticated) reads on dealer_domains so the edge-runtime
-- resolve endpoint can look up custom domains without a user session.
-- Without this, the anon key is blocked by RLS and no domain ever resolves.
CREATE POLICY dealer_domains_public_read ON dealer_domains
    FOR SELECT
    USING (status IN ('active', 'pending'));
