-- =====================================================
-- DealerSite Pro - Domain Onboarding Database Schema
-- Database: Supabase (PostgreSQL)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Main Tables
-- =====================================================

-- Domain Onboardings Table
-- Tracks the complete lifecycle of domain onboarding
CREATE TABLE IF NOT EXISTS domain_onboardings (
    -- Primary identifiers
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Domain information
    domain_name TEXT NOT NULL,
    registrar TEXT,
    access_level TEXT CHECK (access_level IN ('full', 'limited')),

    -- Complex data stored as JSONB
    verification JSONB DEFAULT '{
        "status": "pending",
        "method": null,
        "token": null,
        "expires_at": null,
        "attempts": 0,
        "verified_at": null
    }'::jsonb,

    dns_analysis JSONB DEFAULT NULL,

    configuration JSONB DEFAULT NULL,

    ssl JSONB DEFAULT '{
        "status": "pending",
        "certificate_authority": null,
        "provisioned_at": null,
        "expires_at": null
    }'::jsonb,

    deployment JSONB DEFAULT '{
        "status": "pending",
        "started_at": null,
        "completed_at": null,
        "server_ip": null,
        "cdn_url": null
    }'::jsonb,

    test_results JSONB DEFAULT '[]'::jsonb,

    -- State tracking
    current_state TEXT NOT NULL DEFAULT 'domain_collection' CHECK (
        current_state IN (
            'domain_collection',
            'verification_pending',
            'verification_complete',
            'dns_analysis',
            'route_selection',
            'configuration_pending',
            'configuration_complete',
            'ssl_provisioning',
            'deployment',
            'testing',
            'live',
            'failed'
        )
    ),

    error_message TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Indexes
    CONSTRAINT unique_user_domain UNIQUE (user_id, domain_name)
);

-- Create indexes for performance
CREATE INDEX idx_domain_onboardings_user_id ON domain_onboardings(user_id);
CREATE INDEX idx_domain_onboardings_domain_name ON domain_onboardings(domain_name);
CREATE INDEX idx_domain_onboardings_current_state ON domain_onboardings(current_state);
CREATE INDEX idx_domain_onboardings_created_at ON domain_onboardings(created_at DESC);

-- =====================================================
-- Audit Tables
-- =====================================================

-- Verification Attempts Table
-- Logs all verification attempts for debugging and analytics
CREATE TABLE IF NOT EXISTS verification_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_id UUID NOT NULL REFERENCES domain_onboardings(id) ON DELETE CASCADE,

    method TEXT NOT NULL CHECK (method IN ('dns_txt', 'html_file', 'email')),
    status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'pending')),

    -- Result details
    result_data JSONB,
    error_message TEXT,

    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_verification_attempts_onboarding ON verification_attempts(onboarding_id);
CREATE INDEX idx_verification_attempts_attempted_at ON verification_attempts(attempted_at DESC);

-- DNS Scan Results Table
-- Historical DNS scan data for analysis
CREATE TABLE IF NOT EXISTS dns_scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_id UUID NOT NULL REFERENCES domain_onboardings(id) ON DELETE CASCADE,

    domain_name TEXT NOT NULL,
    scan_data JSONB NOT NULL,
    recommended_route TEXT,

    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dns_scan_results_onboarding ON dns_scan_results(onboarding_id);
CREATE INDEX idx_dns_scan_results_scanned_at ON dns_scan_results(scanned_at DESC);

-- =====================================================
-- Configuration Tables
-- =====================================================

-- Registrar Templates Table
-- Store instructions for different domain registrars
CREATE TABLE IF NOT EXISTS registrar_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,

    -- Instructions stored as JSONB
    dns_instructions JSONB NOT NULL,
    nameserver_instructions JSONB,

    screenshots JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,

    estimated_time_minutes INTEGER,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),

    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_registrar_templates_name ON registrar_templates(name);
CREATE INDEX idx_registrar_templates_active ON registrar_templates(is_active);

-- =====================================================
-- Deployment Tables
-- =====================================================

-- Deployment History Table
-- Track all deployment attempts
CREATE TABLE IF NOT EXISTS deployment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_id UUID NOT NULL REFERENCES domain_onboardings(id) ON DELETE CASCADE,

    deployment_type TEXT NOT NULL CHECK (deployment_type IN ('initial', 'update', 'rollback')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'success', 'failed')),

    deployment_data JSONB,
    error_message TEXT,

    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_deployment_history_onboarding ON deployment_history(onboarding_id);
CREATE INDEX idx_deployment_history_status ON deployment_history(status);
CREATE INDEX idx_deployment_history_started_at ON deployment_history(started_at DESC);

-- =====================================================
-- Analytics Tables
-- =====================================================

-- Onboarding Analytics Table
-- Track metrics and performance
CREATE TABLE IF NOT EXISTS onboarding_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_id UUID NOT NULL REFERENCES domain_onboardings(id) ON DELETE CASCADE,

    -- Time metrics
    time_to_verification_seconds INTEGER,
    time_to_dns_propagation_seconds INTEGER,
    time_to_deployment_seconds INTEGER,
    total_time_seconds INTEGER,

    -- Attempt metrics
    verification_attempts INTEGER DEFAULT 0,
    propagation_checks INTEGER DEFAULT 0,
    deployment_attempts INTEGER DEFAULT 0,

    -- User behavior
    dropped_at_step TEXT,
    completed BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_onboarding_analytics_onboarding ON onboarding_analytics(onboarding_id);
CREATE INDEX idx_onboarding_analytics_completed ON onboarding_analytics(completed);

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at for domain_onboardings
CREATE TRIGGER update_domain_onboardings_updated_at
    BEFORE UPDATE ON domain_onboardings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for registrar_templates
CREATE TRIGGER update_registrar_templates_updated_at
    BEFORE UPDATE ON registrar_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function: Calculate analytics on completion
CREATE OR REPLACE FUNCTION calculate_onboarding_analytics()
RETURNS TRIGGER AS $$
DECLARE
    analytics_record RECORD;
    time_to_verification INTEGER;
    time_to_propagation INTEGER;
    time_to_deployment INTEGER;
    total_time INTEGER;
BEGIN
    -- Only calculate when state changes to 'live'
    IF NEW.current_state = 'live' AND OLD.current_state != 'live' THEN
        -- Calculate time metrics
        time_to_verification := EXTRACT(EPOCH FROM (
            (NEW.verification->>'verified_at')::timestamp - NEW.created_at
        ));

        time_to_propagation := EXTRACT(EPOCH FROM (
            (NEW.configuration->>'propagated_at')::timestamp - NEW.created_at
        ));

        time_to_deployment := EXTRACT(EPOCH FROM (
            NEW.completed_at - NEW.created_at
        ));

        total_time := EXTRACT(EPOCH FROM (NEW.completed_at - NEW.created_at));

        -- Insert or update analytics
        INSERT INTO onboarding_analytics (
            onboarding_id,
            time_to_verification_seconds,
            time_to_dns_propagation_seconds,
            time_to_deployment_seconds,
            total_time_seconds,
            verification_attempts,
            completed
        ) VALUES (
            NEW.id,
            time_to_verification,
            time_to_propagation,
            time_to_deployment,
            total_time,
            (NEW.verification->>'attempts')::integer,
            true
        )
        ON CONFLICT (onboarding_id) DO UPDATE SET
            time_to_verification_seconds = EXCLUDED.time_to_verification_seconds,
            time_to_dns_propagation_seconds = EXCLUDED.time_to_dns_propagation_seconds,
            time_to_deployment_seconds = EXCLUDED.time_to_deployment_seconds,
            total_time_seconds = EXCLUDED.total_time_seconds,
            completed = true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Calculate analytics when onboarding completes
CREATE TRIGGER calculate_analytics_on_completion
    AFTER UPDATE ON domain_onboardings
    FOR EACH ROW
    EXECUTE FUNCTION calculate_onboarding_analytics();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE domain_onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dns_scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own onboardings
CREATE POLICY "Users can view own onboardings"
    ON domain_onboardings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboardings"
    ON domain_onboardings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboardings"
    ON domain_onboardings FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can view verification attempts for their onboardings
CREATE POLICY "Users can view own verification attempts"
    ON verification_attempts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM domain_onboardings
            WHERE id = verification_attempts.onboarding_id
            AND user_id = auth.uid()
        )
    );

-- Policy: System can insert verification attempts
CREATE POLICY "System can insert verification attempts"
    ON verification_attempts FOR INSERT
    WITH CHECK (true);

-- Registrar templates are publicly readable
CREATE POLICY "Registrar templates are publicly readable"
    ON registrar_templates FOR SELECT
    USING (is_active = true);

-- =====================================================
-- Seed Data
-- =====================================================

-- Insert popular registrar templates
INSERT INTO registrar_templates (name, display_name, dns_instructions, estimated_time_minutes, difficulty_level)
VALUES
    (
        'godaddy',
        'GoDaddy',
        '{"steps": ["Log in to GoDaddy", "Go to DNS Management", "Click Add Record", "Select record type", "Enter values", "Save"]}',
        15,
        'easy'
    ),
    (
        'namecheap',
        'Namecheap',
        '{"steps": ["Log in to Namecheap", "Go to Advanced DNS", "Click Add New Record", "Select record type", "Enter values", "Save"]}',
        15,
        'easy'
    ),
    (
        'bigrock',
        'BigRock',
        '{"steps": ["Log in to BigRock", "Go to Manage DNS", "Click Add Record", "Select record type", "Enter values", "Save"]}',
        20,
        'medium'
    )
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- Helpful Views
-- =====================================================

-- View: Active onboardings with latest status
CREATE OR REPLACE VIEW active_onboardings AS
SELECT
    o.*,
    u.email as user_email,
    (o.verification->>'status') as verification_status,
    (o.ssl->>'status') as ssl_status,
    (o.deployment->>'status') as deployment_status
FROM domain_onboardings o
JOIN auth.users u ON o.user_id = u.id
WHERE o.current_state NOT IN ('live', 'failed')
ORDER BY o.created_at DESC;

-- View: Completed onboardings with metrics
CREATE OR REPLACE VIEW completed_onboardings AS
SELECT
    o.*,
    a.total_time_seconds,
    a.verification_attempts,
    a.propagation_checks
FROM domain_onboardings o
JOIN onboarding_analytics a ON o.id = a.onboarding_id
WHERE o.current_state = 'live'
ORDER BY o.completed_at DESC;

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON TABLE domain_onboardings IS 'Main table tracking domain onboarding lifecycle';
COMMENT ON TABLE verification_attempts IS 'Audit log of all domain verification attempts';
COMMENT ON TABLE registrar_templates IS 'Instructions for different domain registrars';
COMMENT ON TABLE deployment_history IS 'History of all deployment attempts';
COMMENT ON TABLE onboarding_analytics IS 'Performance metrics and analytics';
