-- API Credit Tracking System
-- Tracks usage and costs for dealer API calls (RC lookup, etc.)

-- Dealer credit tracking (usage monitoring)
CREATE TABLE IF NOT EXISTS dealer_credits (
    dealer_id UUID PRIMARY KEY REFERENCES dealers(id) ON DELETE CASCADE,
    total_calls INTEGER NOT NULL DEFAULT 0,
    total_spent_inr DECIMAL(10, 2) NOT NULL DEFAULT 0,
    plan_type TEXT NOT NULL DEFAULT 'plan_1' CHECK (plan_type IN ('plan_1', 'plan_2', 'plan_3')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API usage logs (every RC lookup call)
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    api_type TEXT NOT NULL, -- 'rc_verification', 'rc_challan', etc.
    request_params JSONB, -- Store RC number, request details
    response_success BOOLEAN NOT NULL,
    cost_inr DECIMAL(10, 2) NOT NULL,
    error_message TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_dealer_credits_dealer ON dealer_credits(dealer_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_dealer_created ON api_usage_logs(dealer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_api_type ON api_usage_logs(api_type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON api_usage_logs(created_at DESC);

-- Function to update dealer credits after API call
CREATE OR REPLACE FUNCTION log_api_usage(
    p_dealer_id UUID,
    p_cost DECIMAL
) RETURNS VOID AS $$
BEGIN
    -- Insert or update dealer_credits
    INSERT INTO dealer_credits (dealer_id, total_calls, total_spent_inr, updated_at)
    VALUES (p_dealer_id, 1, p_cost, NOW())
    ON CONFLICT (dealer_id)
    DO UPDATE SET
        total_calls = dealer_credits.total_calls + 1,
        total_spent_inr = dealer_credits.total_spent_inr + p_cost,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE dealer_credits IS 'Tracks total API usage and costs per dealer';
COMMENT ON TABLE api_usage_logs IS 'Detailed log of every API call with request/response data';
COMMENT ON COLUMN api_usage_logs.cost_inr IS 'Cost in INR per API call (Plan 1: RC=₹3, Challan=₹5)';
