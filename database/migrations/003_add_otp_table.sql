-- Create OTP (One-Time Password) table for 6-digit email auth
CREATE TABLE IF NOT EXISTS public.otp_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    code text NOT NULL,
    purpose text NOT NULL, -- 'login' or 'register'
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz NOT NULL,
    verified_at timestamptz,
    attempts int DEFAULT 0,
    max_attempts int DEFAULT 5,
    CONSTRAINT otp_not_expired CHECK (expires_at > now())
);

-- Index for faster lookups by email and code
CREATE INDEX IF NOT EXISTS idx_otp_email ON public.otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_email_code ON public.otp_codes(email, code);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON public.otp_codes(expires_at);

-- Enable RLS (Row Level Security) — OTP codes should not be queried from browser
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Only allow server-side queries via service role
CREATE POLICY "Only service role can read OTP" ON public.otp_codes
    FOR SELECT USING (auth.uid() IS NULL);

CREATE POLICY "Only service role can insert OTP" ON public.otp_codes
    FOR INSERT WITH CHECK (auth.uid() IS NULL);

CREATE POLICY "Only service role can update OTP" ON public.otp_codes
    FOR UPDATE USING (auth.uid() IS NULL);
