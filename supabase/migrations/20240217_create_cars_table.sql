-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id TEXT PRIMARY KEY, -- Using string ID from JSON (e.g., 'audi-a4')
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    variant TEXT NOT NULL DEFAULT 'Standard',
    year INTEGER NOT NULL DEFAULT 2024,
    body_type TEXT,
    segment TEXT,
    price TEXT, -- Display price string
    price_min NUMERIC, -- For sorting/filtering
    price_max NUMERIC,
    currency TEXT DEFAULT 'INR',
    
    -- Key specs for filtering/sorting
    fuel_type TEXT,
    transmission_type TEXT,
    seating_capacity INTEGER,
    fuel_efficiency NUMERIC, -- km/l
    
    -- Detailed nested structures stored as JSONB
    pricing JSONB,      -- {exShowroom: {min, max, currency}, ...}
    engine JSONB,       -- {type, displacement, power, torque, ...}
    transmission JSONB, -- {type, gears, driveType}
    performance JSONB,  -- {fuelEfficiency, topSpeed, ...}
    dimensions JSONB,   -- {length, width, ...}
    features JSONB,     -- {keyFeatures: [], ...}
    images JSONB,       -- {hero, exterior: [], interior: []}
    colors JSONB,       -- [{name, hex, ...}]
    meta JSONB,         -- {scrapedAt, sourceUrl, ...}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common filters
CREATE INDEX IF NOT EXISTS idx_cars_make ON cars(make);
CREATE INDEX IF NOT EXISTS idx_cars_model ON cars(model);
CREATE INDEX IF NOT EXISTS idx_cars_body_type ON cars(body_type);
CREATE INDEX IF NOT EXISTS idx_cars_price_min ON cars(price_min);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_segment ON cars(segment);

-- Enable Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for everyone
CREATE POLICY "Allow public read access" ON cars
    FOR SELECT
    USING (true);

-- Create policy to allow insert/update for service role (or authenticated users if needed)
-- For now, we'll allow all operations for anon if we want simple migration, 
-- but better to restrict write to service role or authenticated. 
-- For this setup, we'll allow public insert for the migration script to work easily with anon key if needed,
-- BUT ideally the user should use the Service Role Key for migration.
-- Let's stick to public read, and we'll assume migration uses a key that bypasses RLS or we add a policy.
-- Adding a policy for insert just in case user uses anon key for migration.
CREATE POLICY "Allow anon insert for migration" ON cars
    FOR INSERT
    WITH CHECK (true);
    
CREATE POLICY "Allow anon update for migration" ON cars
    FOR UPDATE
    USING (true);

-- Auto-update updated_at timestamp
CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
