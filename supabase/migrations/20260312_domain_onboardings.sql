-- =====================================================
-- Domain Onboarding Tables
-- Migration: 20260312_domain_onboardings
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Main Table: domain_onboardings
-- =====================================================

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

    CONSTRAINT unique_user_domain UNIQUE (user_id, domain_name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_domain_onboardings_user_id ON domain_onboardings(user_id);
CREATE INDEX IF NOT EXISTS idx_domain_onboardings_domain_name ON domain_onboardings(domain_name);
CREATE INDEX IF NOT EXISTS idx_domain_onboardings_current_state ON domain_onboardings(current_state);
CREATE INDEX IF NOT EXISTS idx_domain_onboardings_created_at ON domain_onboardings(created_at DESC);

-- =====================================================
-- Audit Table: verification_attempts
-- =====================================================

CREATE TABLE IF NOT EXISTS verification_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_id UUID NOT NULL REFERENCES domain_onboardings(id) ON DELETE CASCADE,

    method TEXT NOT NULL CHECK (method IN ('dns_txt', 'html_file', 'email')),
    status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'pending')),

    result_data JSONB,
    error_message TEXT,

    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_attempts_onboarding ON verification_attempts(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_attempted_at ON verification_attempts(attempted_at DESC);

-- =====================================================
-- Audit Table: dns_scan_results
-- =====================================================

CREATE TABLE IF NOT EXISTS dns_scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_id UUID NOT NULL REFERENCES domain_onboardings(id) ON DELETE CASCADE,

    domain_name TEXT NOT NULL,
    scan_data JSONB NOT NULL,
    recommended_route TEXT,

    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dns_scan_results_onboarding ON dns_scan_results(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_dns_scan_results_scanned_at ON dns_scan_results(scanned_at DESC);

-- =====================================================
-- Configuration Table: registrar_templates
-- =====================================================

CREATE TABLE IF NOT EXISTS registrar_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,

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

CREATE INDEX IF NOT EXISTS idx_registrar_templates_name ON registrar_templates(name);
CREATE INDEX IF NOT EXISTS idx_registrar_templates_active ON registrar_templates(is_active);

-- =====================================================
-- Deployment Table: deployment_history
-- =====================================================

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

CREATE INDEX IF NOT EXISTS idx_deployment_history_onboarding ON deployment_history(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_deployment_history_status ON deployment_history(status);
CREATE INDEX IF NOT EXISTS idx_deployment_history_started_at ON deployment_history(started_at DESC);

-- =====================================================
-- Analytics Table: onboarding_analytics
-- =====================================================

CREATE TABLE IF NOT EXISTS onboarding_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_id UUID NOT NULL REFERENCES domain_onboardings(id) ON DELETE CASCADE,

    time_to_verification_seconds INTEGER,
    time_to_dns_propagation_seconds INTEGER,
    time_to_deployment_seconds INTEGER,
    total_time_seconds INTEGER,

    verification_attempts INTEGER DEFAULT 0,
    propagation_checks INTEGER DEFAULT 0,
    deployment_attempts INTEGER DEFAULT 0,

    dropped_at_step TEXT,
    completed BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_analytics_onboarding ON onboarding_analytics(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_analytics_completed ON onboarding_analytics(completed);

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
DROP TRIGGER IF EXISTS update_domain_onboardings_updated_at ON domain_onboardings;
CREATE TRIGGER update_domain_onboardings_updated_at
    BEFORE UPDATE ON domain_onboardings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for registrar_templates
DROP TRIGGER IF EXISTS update_registrar_templates_updated_at ON registrar_templates;
CREATE TRIGGER update_registrar_templates_updated_at
    BEFORE UPDATE ON registrar_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function: Calculate analytics on completion
CREATE OR REPLACE FUNCTION calculate_onboarding_analytics()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_state = 'live' AND OLD.current_state != 'live' THEN
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
            EXTRACT(EPOCH FROM ((NEW.verification->>'verified_at')::timestamp - NEW.created_at))::INTEGER,
            EXTRACT(EPOCH FROM ((NEW.configuration->>'propagated_at')::timestamp - NEW.created_at))::INTEGER,
            EXTRACT(EPOCH FROM (NEW.completed_at - NEW.created_at))::INTEGER,
            EXTRACT(EPOCH FROM (NEW.completed_at - NEW.created_at))::INTEGER,
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
DROP TRIGGER IF EXISTS calculate_analytics_on_completion ON domain_onboardings;
CREATE TRIGGER calculate_analytics_on_completion
    AFTER UPDATE ON domain_onboardings
    FOR EACH ROW
    EXECUTE FUNCTION calculate_onboarding_analytics();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE domain_onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dns_scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrar_templates ENABLE ROW LEVEL SECURITY;

-- domain_onboardings policies
DROP POLICY IF EXISTS "Users can view own onboardings" ON domain_onboardings;
CREATE POLICY "Users can view own onboardings"
    ON domain_onboardings FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own onboardings" ON domain_onboardings;
CREATE POLICY "Users can insert own onboardings"
    ON domain_onboardings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own onboardings" ON domain_onboardings;
CREATE POLICY "Users can update own onboardings"
    ON domain_onboardings FOR UPDATE
    USING (auth.uid() = user_id);

-- verification_attempts policies
DROP POLICY IF EXISTS "Users can view own verification attempts" ON verification_attempts;
CREATE POLICY "Users can view own verification attempts"
    ON verification_attempts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM domain_onboardings
            WHERE id = verification_attempts.onboarding_id
            AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "System can insert verification attempts" ON verification_attempts;
CREATE POLICY "System can insert verification attempts"
    ON verification_attempts FOR INSERT
    WITH CHECK (true);

-- registrar_templates: publicly readable (active only)
DROP POLICY IF EXISTS "Registrar templates are publicly readable" ON registrar_templates;
CREATE POLICY "Registrar templates are publicly readable"
    ON registrar_templates FOR SELECT
    USING (is_active = true);
