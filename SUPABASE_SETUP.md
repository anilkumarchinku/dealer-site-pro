# Supabase Setup Guide

This guide will help you set up Supabase for DealerSite Pro to fix the "Failed to initiate domain connection" error.

## Why You're Seeing This Error

The domain connection feature requires a database to store domain information. Currently, your `.env.local` file has placeholder Supabase credentials, so the app cannot connect to a database.

## Step-by-Step Setup

### 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign Up"
3. Sign up with GitHub, Google, or email

### 2. Create a New Project

1. Once logged in, click "New Project"
2. Fill in the details:
   - **Name**: DealerSite Pro (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is fine for development
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be provisioned

### 3. Get Your API Credentials

1. In your Supabase project dashboard, click on "Settings" (gear icon in the sidebar)
2. Click on "API" in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://abcdefghijklmnop.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`

### 4. Update Your `.env.local` File

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your real credentials:

```env
# Replace these lines:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# With your actual values:
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (your actual anon key)
```

### 5. Create the Database Schema

You need to create the `domains` table in your Supabase database:

1. In Supabase dashboard, click on "SQL Editor" in the sidebar
2. Click "New query"
3. Copy and paste this SQL:

```sql
-- Create domains table
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id TEXT NOT NULL,
    domain TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('subdomain', 'custom', 'managed')),
    template_id TEXT DEFAULT 'family' CHECK (template_id IN ('luxury', 'family', 'sporty', 'professional')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'active', 'failed', 'expired')),
    ssl_status TEXT NOT NULL DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'provisioning', 'active', 'expired', 'failed')),
    is_primary BOOLEAN NOT NULL DEFAULT false,
    dns_verified_at TIMESTAMP WITH TIME ZONE,
    ssl_provisioned_at TIMESTAMP WITH TIME ZONE,
    ssl_expires_at TIMESTAMP WITH TIME ZONE,
    last_checked_at TIMESTAMP WITH TIME ZONE,
    registrar TEXT,
    registration_expires_at TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_domains_dealer_id ON domains(dealer_id);
CREATE INDEX IF NOT EXISTS idx_domains_domain ON domains(domain);
CREATE INDEX IF NOT EXISTS idx_domains_slug ON domains(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can make this more restrictive later)
CREATE POLICY "Allow all operations on domains" ON domains
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_domains_updated_at
    BEFORE UPDATE ON domains
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create domain_verifications table (for DNS verification tracking)
CREATE TABLE IF NOT EXISTS domain_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL CHECK (record_type IN ('A', 'CNAME', 'TXT')),
    record_name TEXT NOT NULL,
    expected_value TEXT NOT NULL,
    actual_value TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for domain_verifications
CREATE INDEX IF NOT EXISTS idx_domain_verifications_domain_id ON domain_verifications(domain_id);

-- Enable RLS on domain_verifications
ALTER TABLE domain_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy for domain_verifications
CREATE POLICY "Allow all operations on domain_verifications" ON domain_verifications
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

4. Click "Run" or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
5. You should see "Success. No rows returned" message

### 6. Restart Your Development Server

1. Stop your Next.js development server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### 7. Test the Domain Connection

1. Go to your app and try to connect a custom domain again
2. You should now see proper DNS instructions instead of the error

## Troubleshooting

### Error: "Database table not found"
- Make sure you ran the SQL script from Step 5
- Check that the table was created by going to "Table Editor" in Supabase

### Error: "Database permission denied"
- The RLS policy might not be set correctly
- Go to "Authentication" > "Policies" and verify the policy exists
- You can temporarily disable RLS for testing (not recommended for production)

### Error: "Database connection failed"
- Double-check your credentials in `.env.local`
- Make sure there are no extra spaces or quotes around the values
- Verify your Project URL is correct (should start with `https://`)

### Still having issues?
- Check the browser console (F12) for more detailed error messages
- Check the terminal where `npm run dev` is running for server-side errors
- Make sure you restarted the development server after updating `.env.local`

## Security Note

**Important**: The `.env.local` file contains sensitive credentials and is already in `.gitignore`. Never commit this file to version control or share it publicly.

## Next Steps

Once Supabase is configured:
1. The custom domain connection will work properly
2. You can manage domains through the Supabase dashboard
3. Consider setting up more restrictive RLS policies for production
4. Set up database backups in Supabase dashboard

---

Need more help? Check the [Supabase Documentation](https://supabase.com/docs) or create an issue in the repository.
