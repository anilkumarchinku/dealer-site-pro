-- Add vehicle_type column to dealer_brands to separate 2W / 3W / car brands
-- Prevents cross-contamination between vehicle categories

ALTER TABLE dealer_brands
    ADD COLUMN IF NOT EXISTS vehicle_type TEXT NOT NULL DEFAULT 'cars';

-- Backfill existing rows: classify by known brand names
UPDATE dealer_brands SET vehicle_type = '3w'
WHERE brand_name IN (
    'Bajaj Auto (3W)', 'Piaggio Ape', 'TVS King', 'Mahindra (3W)',
    'Atul Auto', 'Kinetic Green', 'Lohia Auto', 'Euler Motors',
    'Greaves Electric Mobility', 'Force Motors'
);

UPDATE dealer_brands SET vehicle_type = '2w'
WHERE vehicle_type = 'cars' AND brand_name IN (
    'Hero MotoCorp', 'Honda Motorcycle & Scooter India', 'TVS Motor Company',
    'Bajaj Auto', 'Royal Enfield', 'Yamaha India', 'Suzuki Motorcycle India',
    'KTM India', 'Husqvarna India', 'Jawa Motorcycles', 'Yezdi Motorcycles',
    'Benelli India', 'Kawasaki India', 'Aprilia India', 'Vespa India',
    'Harley-Davidson India', 'Triumph India', 'Ducati India', 'BMW Motorrad India',
    'Indian Motorcycle', 'Moto Guzzi', 'CFMoto India', 'Keeway India',
    'Zontes India', 'Mahindra Two Wheelers',
    'Ola Electric', 'Ather Energy', 'Bajaj Chetak', 'TVS iQube',
    'Hero Electric', 'Vida (Hero MotoCorp)', 'Revolt Motors', 'Okinawa Autotech',
    'Ampere (Greaves Electric)', 'Tork Motors', 'Ultraviolette Automotive',
    'Simple Energy', 'Kabira Mobility', 'Pure EV', 'Matter', 'Hop Electric',
    'Okaya EV (OPG Mobility)', 'Oben Electric', 'Lectrix EV', 'River',
    'Odysse Electric', 'Joy e-bike', 'Komaki', 'Bounce Infinity',
    'Quantum Energy', 'Yulu'
);

-- Index for fast per-dealer + vehicle_type lookups
CREATE INDEX IF NOT EXISTS idx_dealer_brands_vehicle_type
    ON dealer_brands (dealer_id, vehicle_type);
