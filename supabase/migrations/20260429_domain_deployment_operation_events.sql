-- domain_deployment_operation_events - audit trail for provider-backed domain/deploy flows

CREATE TABLE IF NOT EXISTS domain_deployment_operation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
    domain_id UUID REFERENCES dealer_domains(id) ON DELETE SET NULL,
    domain TEXT,
    operation TEXT NOT NULL CHECK (
        operation IN ('custom_domain_connect', 'custom_domain_remove', 'multi_tenant_deploy')
    ),
    status TEXT NOT NULL CHECK (
        status IN ('started', 'provider_pending', 'provider_succeeded', 'provider_failed', 'completed', 'failed')
    ),
    provider_step TEXT NOT NULL CHECK (
        provider_step IN ('database', 'vercel', 'dns', 'deployment')
    ),
    details JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_domain_deployment_operation_events_dealer
    ON domain_deployment_operation_events (dealer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_domain_deployment_operation_events_domain
    ON domain_deployment_operation_events (domain_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_domain_deployment_operation_events_status
    ON domain_deployment_operation_events (operation, status, created_at DESC);

ALTER TABLE domain_deployment_operation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on domain_deployment_operation_events"
    ON domain_deployment_operation_events
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

COMMENT ON TABLE domain_deployment_operation_events IS 'Append-only status events for domain and deployment provider operations.';
