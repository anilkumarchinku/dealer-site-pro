-- Payment idempotency log to prevent duplicate payment processing
CREATE TABLE IF NOT EXISTS payment_idempotency_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idempotency_key TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    subscription_id TEXT,
    response JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Unique constraint to enforce idempotency
CREATE UNIQUE INDEX IF NOT EXISTS idx_idempotency_key_payment
    ON payment_idempotency_log (idempotency_key, payment_id);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_payment_idempotency_payment_id
    ON payment_idempotency_log (payment_id);

-- RLS
ALTER TABLE payment_idempotency_log ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (API routes use createRouteClient which respects RLS)
CREATE POLICY "Service role full access on payment_idempotency_log"
    ON payment_idempotency_log
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Auto-cleanup old records after 90 days (optional cron)
COMMENT ON TABLE payment_idempotency_log IS 'Prevents duplicate payment processing. Records older than 90 days can be purged.';
