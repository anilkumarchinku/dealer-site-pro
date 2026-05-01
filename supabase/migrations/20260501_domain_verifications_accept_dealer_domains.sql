-- Domain verification rows are written for dealer_domains custom domains.
-- Older domain payment migrations created this table against the separate
-- domains table, which makes custom-domain verification history fail when
-- the API writes dealer_domains.id. Keep domain_id as the history grouping key
-- and allow both legacy and current domain tables at the policy layer.

ALTER TABLE IF EXISTS domain_verifications
    DROP CONSTRAINT IF EXISTS domain_verifications_domain_id_fkey;

DROP POLICY IF EXISTS domain_verifications_dealer_read ON domain_verifications;

CREATE POLICY domain_verifications_dealer_read
    ON domain_verifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM dealer_domains dd
            WHERE dd.id = domain_verifications.domain_id
              AND is_dealer_owner(dd.dealer_id)
        )
        OR EXISTS (
            SELECT 1 FROM domains d
            WHERE d.id = domain_verifications.domain_id
              AND is_dealer_owner(d.dealer_id)
        )
    );
