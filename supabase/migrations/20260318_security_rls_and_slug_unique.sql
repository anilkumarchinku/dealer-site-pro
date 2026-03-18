-- ── Security: RLS policies on domains table ──────────────────────────────────
-- The domains table stores per-dealer subdomain and custom domain records.
-- Without RLS, any authenticated user could read or modify other dealers' domains.

-- Enable RLS on domains table (safe to run even if already enabled)
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

-- Allow public read (needed for middleware domain resolution via anon key)
DROP POLICY IF EXISTS "Public can read domains" ON domains;
CREATE POLICY "Public can read domains"
    ON domains FOR SELECT
    USING (true);

-- Dealers can only insert domains for their own dealer account
DROP POLICY IF EXISTS "Dealers can insert their own domains" ON domains;
CREATE POLICY "Dealers can insert their own domains"
    ON domains FOR INSERT
    WITH CHECK (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Dealers can only update their own domains
DROP POLICY IF EXISTS "Dealers can update their own domains" ON domains;
CREATE POLICY "Dealers can update their own domains"
    ON domains FOR UPDATE
    USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Dealers can only delete their own domains
DROP POLICY IF EXISTS "Dealers can delete their own domains" ON domains;
CREATE POLICY "Dealers can delete their own domains"
    ON domains FOR DELETE
    USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- ── Security: Unique constraint on dealers(slug) ──────────────────────────────
-- Without this, two dealers could end up with the same slug via different code
-- paths (e.g. direct DB insert vs saveDealer action), causing routing conflicts.

ALTER TABLE dealers
    ADD CONSTRAINT dealers_slug_unique UNIQUE (slug);
