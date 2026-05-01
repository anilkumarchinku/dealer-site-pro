-- Keep older/manual migration flow aligned with Supabase migrations.

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
