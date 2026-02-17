-- ============================================
-- DealerSite Pro - Domain & Hosting Module
-- Database Schema - Phase 1: FREE Subdomain
-- ============================================

-- Create custom types/enums
CREATE TYPE domain_type AS ENUM ('subdomain', 'custom', 'managed');
CREATE TYPE domain_status AS ENUM ('pending', 'verifying', 'active', 'failed', 'expired');
CREATE TYPE ssl_status AS ENUM ('pending', 'provisioning', 'active', 'expired', 'failed');

-- ============================================
-- Table: domains
-- Stores all dealer domains (subdomains & custom)
-- ============================================
CREATE TABLE IF NOT EXISTS domains (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key (assumes dealers table exists)
  dealer_id UUID NOT NULL,
  -- Uncomment when dealers table is created:
  -- dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
  
  -- Domain information
  domain VARCHAR(255) NOT NULL,          -- Full domain: abc-motors.dealersitepro.com
  slug VARCHAR(63) NOT NULL,             -- Short slug: abc-motors
  type domain_type NOT NULL DEFAULT 'subdomain',

  -- Template/Style selection
  template_id VARCHAR(20) DEFAULT 'family',  -- 'luxury', 'family', 'sporty', 'professional'

  -- Status fields
  status domain_status NOT NULL DEFAULT 'active',
  ssl_status ssl_status NOT NULL DEFAULT 'active',
  is_primary BOOLEAN NOT NULL DEFAULT false,  -- One primary domain per dealer
  
  -- Verification timestamps
  dns_verified_at TIMESTAMPTZ,
  ssl_provisioned_at TIMESTAMPTZ,
  ssl_expires_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  
  -- For managed domains (Phase 3)
  registrar VARCHAR(50),                 -- 'cloudflare', 'godaddy', etc.
  registration_expires_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  
  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Unique Constraints
-- ============================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_domains_domain ON domains(domain);
CREATE UNIQUE INDEX IF NOT EXISTS idx_domains_slug ON domains(slug);

-- Only one primary domain per dealer
CREATE UNIQUE INDEX IF NOT EXISTS idx_domains_primary 
  ON domains(dealer_id) 
  WHERE is_primary = true;

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_domains_dealer ON domains(dealer_id);
CREATE INDEX IF NOT EXISTS idx_domains_status ON domains(status);
CREATE INDEX IF NOT EXISTS idx_domains_type ON domains(type);
CREATE INDEX IF NOT EXISTS idx_domains_slug_lookup ON domains(slug) WHERE status = 'active';

-- ============================================
-- Table: domain_verifications
-- Tracks DNS verification attempts
-- ============================================
CREATE TABLE IF NOT EXISTS domain_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL,
  -- Uncomment when ready:
  -- domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  
  -- Verification details
  record_type VARCHAR(10) NOT NULL,      -- 'A', 'CNAME', 'TXT'
  record_name VARCHAR(255) NOT NULL,     -- '@', 'www', '_verification'
  expected_value VARCHAR(255) NOT NULL,
  actual_value VARCHAR(255),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  
  -- Audit
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verifications_domain ON domain_verifications(domain_id);
CREATE INDEX IF NOT EXISTS idx_verifications_checked ON domain_verifications(checked_at DESC);

-- ============================================
-- Table: domain_subscriptions
-- Manages PRO/PREMIUM subscriptions (Phase 2/3)
-- ============================================
CREATE TABLE IF NOT EXISTS domain_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL,
  dealer_id UUID NOT NULL,
  -- Uncomment when ready:
  -- domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  -- dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
  
  -- Subscription details
  plan VARCHAR(20) NOT NULL,             -- 'pro', 'premium'
  price_monthly INTEGER NOT NULL,        -- in paise: 49900 = ₹499.00
  billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'annual'
  
  -- Razorpay integration
  razorpay_subscription_id VARCHAR(100),
  razorpay_plan_id VARCHAR(100),
  razorpay_customer_id VARCHAR(100),
  
  -- Status tracking
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'past_due', 'expired'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_dealer ON domain_subscriptions(dealer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_domain ON domain_subscriptions(domain_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON domain_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay ON domain_subscriptions(razorpay_subscription_id);

-- ============================================
-- Trigger: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER domains_updated_at
  BEFORE UPDATE ON domains
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON domain_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- Enable RLS for security
-- ============================================

-- Enable RLS
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Dealers can only see their own domains
CREATE POLICY domains_dealer_access ON domains
  FOR ALL
  USING (dealer_id = auth.uid());

-- Policy: Admins can see all domains
CREATE POLICY domains_admin_access ON domains
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM dealers 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Similar policies for other tables
CREATE POLICY verifications_dealer_access ON domain_verifications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM domains 
      WHERE domains.id = domain_verifications.domain_id 
      AND domains.dealer_id = auth.uid()
    )
  );

CREATE POLICY subscriptions_dealer_access ON domain_subscriptions
  FOR ALL
  USING (dealer_id = auth.uid());

-- ============================================
-- Seed Data (Optional - for development)
-- ============================================
-- Uncomment to add sample domains for testing
/*
INSERT INTO domains (dealer_id, domain, slug, type, status, ssl_status, is_primary)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'abc-motors.dealersitepro.com', 'abc-motors', 'subdomain', 'active', 'active', true),
  ('00000000-0000-0000-0000-000000000002', 'xyz-auto.dealersitepro.com', 'xyz-auto', 'subdomain', 'active', 'active', true);
*/

-- ============================================
-- Useful Queries (for reference)
-- ============================================

-- Get all active domains
-- SELECT * FROM domains WHERE status = 'active';

-- Get domain by slug
-- SELECT * FROM domains WHERE slug = 'abc-motors' AND status = 'active';

-- Get dealer's primary domain
-- SELECT * FROM domains WHERE dealer_id = ? AND is_primary = true;

-- Check slug availability
-- SELECT EXISTS(SELECT 1 FROM domains WHERE slug = 'abc-motors');

-- Get domains expiring soon (30 days)
-- SELECT * FROM domains 
-- WHERE registration_expires_at IS NOT NULL 
-- AND registration_expires_at <= NOW() + INTERVAL '30 days';
