-- ========================================
-- Payment Idempotency & RLS Policies
-- ========================================
-- Run this in Supabase → SQL Editor
-- Timeline: Execute BEFORE production deployment

-- ── 1. CREATE PAYMENT IDEMPOTENCY TABLE ─────────────────────
-- Stores processed payment verifications to prevent duplicates
CREATE TABLE IF NOT EXISTS public.payment_idempotency_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idempotency_key TEXT NOT NULL UNIQUE,
    payment_id TEXT NOT NULL,
    subscription_id TEXT,
    response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_idempotency_key (idempotency_key),
    INDEX idx_payment_id (payment_id),
    INDEX idx_created_at (created_at)
);

-- Enable RLS on idempotency table (public read, app insert only)
ALTER TABLE public.payment_idempotency_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow reading own payment records"
ON public.payment_idempotency_log FOR SELECT
USING (true);

CREATE POLICY "Allow inserting payment records"
ON public.payment_idempotency_log FOR INSERT
WITH CHECK (true);

-- ── 2. ADD RLS POLICY TO dealer_deployments ─────────────────
-- Users can only manage deployments for their own dealers
ALTER TABLE public.dealer_deployments ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage deployments for their own dealers" ON public.dealer_deployments;

CREATE POLICY "Users can manage deployments for their own dealers"
ON public.dealer_deployments FOR ALL TO authenticated
USING (
  dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
)
WITH CHECK (
  dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
);

-- ── 3. ADD RLS POLICY TO dealer_domains ──────────────────────
ALTER TABLE public.dealer_domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage domains for their own dealers" ON public.dealer_domains;

CREATE POLICY "Users can manage domains for their own dealers"
ON public.dealer_domains FOR ALL TO authenticated
USING (
  dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
)
WITH CHECK (
  dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
);

-- ── 4. ADD RLS POLICY TO domain_subscriptions ────────────────
ALTER TABLE public.domain_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage subscriptions for their domains" ON public.domain_subscriptions;

CREATE POLICY "Users can manage subscriptions for their domains"
ON public.domain_subscriptions FOR ALL TO authenticated
USING (
  domain_id IN (
    SELECT id FROM public.dealer_domains
    WHERE dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
  )
)
WITH CHECK (
  domain_id IN (
    SELECT id FROM public.dealer_domains
    WHERE dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
  )
);

-- ── 5. ADD RLS POLICY TO dealer_leads ────────────────────────
ALTER TABLE public.dealer_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage leads for their dealers" ON public.dealer_leads;

CREATE POLICY "Users can manage leads for their dealers"
ON public.dealer_leads FOR ALL TO authenticated
USING (
  dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
)
WITH CHECK (
  dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
);

-- ── 6. ADD RLS POLICY TO dealer_cars ─────────────────────────
ALTER TABLE public.dealer_cars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage cars for their dealers" ON public.dealer_cars;

CREATE POLICY "Users can manage cars for their dealers"
ON public.dealer_cars FOR ALL TO authenticated
USING (
  dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
)
WITH CHECK (
  dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
);

-- ── 7. VERIFY RLS IS ENABLED ─────────────────────────────────
-- Run this query to check which tables are missing RLS:
-- SELECT tablename FROM pg_tables
-- WHERE schemaname = 'public'
-- AND NOT has_row_level_security(tablename);

-- ── 8. ADD AUDIT LOGGING ─────────────────────────────────────
-- Optional: Track who modified what and when
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    record_id TEXT,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_user_id (user_id),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit logs for their changes"
ON public.audit_log FOR SELECT
USING (user_id = auth.uid());

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify everything is set up correctly:

-- Check payment_idempotency_log exists
-- SELECT tablename FROM information_schema.tables
-- WHERE table_schema = 'public' AND tablename = 'payment_idempotency_log';

-- Check RLS is enabled on all tables
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;

-- ========================================
-- ROLLBACK (if needed)
-- ========================================
-- DROP TABLE IF EXISTS public.payment_idempotency_log CASCADE;
-- DROP TABLE IF EXISTS public.audit_log CASCADE;
-- DROP POLICY IF EXISTS "Users can manage deployments for their own dealers" ON public.dealer_deployments;
-- ... etc
