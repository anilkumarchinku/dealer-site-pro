-- ============================================================
-- SEED: Demo Dealer + Reviews + Leads + Analytics
-- Run in Supabase SQL Editor (runs as service role, bypasses RLS)
-- ============================================================

-- ── 1. Demo Dealer ────────────────────────────────────────────
-- NOTE: user_id is NULL (no Auth account). This is intentional for
-- testing the dashboard without going through onboarding.
-- After you sign up, update user_id = auth.uid() via the app.

INSERT INTO dealers (
    id, user_id,
    dealership_name, tagline, location, full_address,
    phone, whatsapp, email,
    sells_new_cars, sells_used_cars,
    style_template, dealer_type,
    subdomain, slug,
    onboarding_step, onboarding_complete, is_active
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,
    'Ram Motors',
    'Driven by Trust',
    'Hyderabad, Telangana',
    'Plot 45, Jubilee Hills, Hyderabad - 500033',
    '+91 99887 76655',
    '+91 99887 76655',
    'info@rammotors.in',
    TRUE, TRUE,
    'family', 'hybrid',
    'ram-motors', 'ram-motors',
    5, TRUE, TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Brands for demo dealer
INSERT INTO dealer_brands (dealer_id, brand_name, is_primary) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Maruti Suzuki', TRUE),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Hyundai',       FALSE),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Tata Motors',   FALSE)
ON CONFLICT (dealer_id, brand_name) DO NOTHING;

-- Services for demo dealer
INSERT INTO dealer_services (dealer_id, service_name) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'new_car_sales'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'used_car_sales'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'financing'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'service_maintenance'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'trade_in'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'home_test_drives')
ON CONFLICT (dealer_id, service_name) DO NOTHING;

-- Template config
INSERT INTO dealer_template_configs (
    dealer_id, hero_title, hero_subtitle, hero_cta_text,
    features_title, instagram_url, facebook_url, working_hours
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Your Dream Car Awaits',
    'Best deals on new & used cars in Hyderabad',
    'Explore Inventory',
    'Why Choose Ram Motors',
    'https://instagram.com/rammotors',
    'https://facebook.com/rammotors',
    'Mon–Sat 9:00 AM – 7:00 PM, Sun 10:00 AM – 5:00 PM'
)
ON CONFLICT (dealer_id) DO NOTHING;

-- Domain
INSERT INTO dealer_domains (dealer_id, subdomain, subdomain_url, domain_type, status, ssl_status, is_primary) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ram-motors', 'ram-motors.dealersitepro.com', 'subdomain', 'active', 'active', TRUE)
ON CONFLICT DO NOTHING;


-- ── 2. Demo Inventory ─────────────────────────────────────────
INSERT INTO vehicles (
    dealer_id, make, model, variant, year,
    price_paise, on_road_price_paise,
    mileage_km, color, body_type, transmission, fuel_type,
    seating_capacity, engine_cc, condition, status,
    views, leads_count, is_featured, description
) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890','Maruti Suzuki','Baleno','Zeta',2024,  74900000, 84500000, NULL,  'Pearl Arctic White','Hatchback','Automatic','Petrol', 5, 1197,'new',  'available', 142, 8, TRUE,  'Top-selling premium hatchback with SmartPlay Studio.'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890','Maruti Suzuki','Ertiga','ZXi+',2024,  112000000,126000000,NULL,  'Magma Grey',        'MUV',      'Automatic','Petrol', 7, 1462,'new',  'available',  89, 5, FALSE, 'Family MPV with Smart Hybrid technology.'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890','Hyundai',      'Creta', 'SX',  2024,  165000000,187000000,NULL,  'Fiery Red',         'SUV',      'Automatic','Petrol', 5, 1497,'new',  'available', 210,12, TRUE,  'India''s best-selling SUV with panoramic sunroof.'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890','Tata Motors',  'Nexon', 'XZ+', 2024,  155000000,174000000,NULL,  'Daytona Grey',      'SUV',      'Manual',   'Petrol', 5, 1497,'new',  'available',  76, 4, FALSE, 'India''s safest car (5-star NCAP).'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890','Maruti Suzuki','Swift', 'ZXi', 2023,  68000000,  76000000, 18500,'Solid Red',         'Hatchback','Manual',   'Petrol', 5, 1197,'used', 'available',  55, 3, FALSE, 'Single owner, well maintained, full service history.'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890','Hyundai',      'Venue', 'SX',  2022,  118000000,133000000,32000,'Typhoon Silver',    'SUV',      'Manual',   'Diesel', 5, 1493,'certified_pre_owned','available',93,6,TRUE,'CPO with 1-year warranty. Diesel SUV in excellent condition.'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890','Tata Motors',  'Nexon EV','XZ+',2024,175000000,194000000,NULL,  'Fearless Purple',   'SUV',      'Automatic','Electric',5, NULL,'new', 'available', 168,10, TRUE,  'Electric SUV with 465 km real-world range.'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890','Maruti Suzuki','Fronx', 'Alpha',2024, 121000000,136000000,NULL,  'Nexa Blue',         'Crossover','Automatic','Petrol', 5, 1197,'new', 'reserved',   47, 2, FALSE, 'Sporty crossover with turbo-petrol engine.')
ON CONFLICT DO NOTHING;


-- ── 3. Demo Reviews ───────────────────────────────────────────
INSERT INTO reviews (
    dealer_id, customer_name, customer_email,
    rating, title, content,
    status, is_featured, admin_reply, replied_at, source
) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'Rahul Sharma',  'rahul@email.com',
     5, 'Excellent experience!',
     'Great experience! The team was very friendly and helped me get a fantastic deal on the Creta. Highly recommend Ram Motors!',
     'published', TRUE,
     'Thank you Rahul! We''re thrilled you love your new Creta. Do visit us for your first service!',
     NOW() - INTERVAL '3 days', 'google'),

    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'Priya Patel', 'priya@email.com',
     5, 'Best car buying experience',
     'Bought my first car here – a Maruti Baleno. The team was very patient, explained everything clearly, and got me a great EMI deal.',
     'published', FALSE,
     'Thank you Priya! Enjoy your Baleno. We''re always here for you!',
     NOW() - INTERVAL '6 days', 'google'),

    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'Amit Kumar', 'amit@email.com',
     4, 'Good service, slight wait time',
     'Good service overall. The showroom is well-maintained and staff is knowledgeable. Minor wait time on delivery day but otherwise a very good experience.',
     'published', FALSE,
     NULL, NULL, 'facebook'),

    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'Sneha Reddy', 'sneha@email.com',
     5, 'Smooth EV purchase!',
     'Bought the Nexon EV from here. The team helped me understand the charging setup and even helped with government subsidy paperwork. Excellent customer service!',
     'published', TRUE,
     'Thank you Sneha! Great choice going electric. We''re happy to support you through your EV journey!',
     NOW() - INTERVAL '12 days', 'google'),

    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'Vikram Singh', 'vikram@email.com',
     3, 'Decent but can improve',
     'The car selection is good but waiting period for test drive was a bit long. Staff was helpful once they attended. Would suggest booking in advance.',
     'published', FALSE,
     NULL, NULL, 'justdial'),

    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'Kavya Nair', 'kavya@email.com',
     5, 'Amazing staff!',
     'Brilliant experience top to bottom. Bought a certified pre-owned Venue and got 1 year warranty. Will refer all my friends to Ram Motors.',
     'published', FALSE,
     'Thank you Kavya! Your referrals mean the world to us!',
     NOW() - INTERVAL '20 days', 'google')

ON CONFLICT DO NOTHING;


-- ── 4. Demo Leads ─────────────────────────────────────────────
INSERT INTO leads (
    dealer_id, customer_name, customer_email, customer_phone,
    lead_type, priority, status, vehicle_interest, source
) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Arjun Mehta',   'arjun@email.com',  '+91 98765 43210', 'test_drive', 'hot',  'new',       'Hyundai Creta',    'website'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deepa Iyer',    'deepa@email.com',  '+91 87654 32109', 'quote',      'hot',  'new',       'Maruti Baleno',    'whatsapp'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Suresh Raju',   'suresh@email.com', '+91 76543 21098', 'inquiry',    'warm', 'contacted', 'Tata Nexon EV',    'website'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Meena Gupta',   'meena@email.com',  '+91 65432 10987', 'financing',  'hot',  'new',       'Hyundai Venue',    'social_media'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kiran Babu',    'kiran@email.com',  '+91 54321 09876', 'trade_in',   'warm', 'qualified', 'Maruti Ertiga',    'phone'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pooja Sharma',  'pooja@email.com',  '+91 43210 98765', 'test_drive', 'cold', 'new',       'Tata Nexon',       'website'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rohit Das',     'rohit@email.com',  '+91 32109 87654', 'quote',      'warm', 'contacted', 'Maruti Fronx',     'website'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ananya Pillai', 'ananya@email.com', '+91 21098 76543', 'inquiry',    'hot',  'new',       'Looking for SUV under ₹20L', 'whatsapp')
ON CONFLICT DO NOTHING;


-- ── 5. Demo Analytics (last 30 days) ─────────────────────────
INSERT INTO analytics_daily (
    dealer_id, date,
    page_views, unique_visitors, bounce_rate,
    leads_count, test_drives_count, calls_count, whatsapp_count,
    organic_traffic, social_traffic, direct_traffic, referral_traffic,
    mobile_pct, desktop_pct, tablet_pct,
    top_pages
)
SELECT
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    CURRENT_DATE - (s.n || ' days')::INTERVAL,
    -- Realistic traffic pattern (weekends higher)
    CASE WHEN EXTRACT(DOW FROM CURRENT_DATE - (s.n || ' days')::INTERVAL) IN (0,6)
         THEN 280 + (random() * 80)::INT
         ELSE 180 + (random() * 60)::INT END,
    CASE WHEN EXTRACT(DOW FROM CURRENT_DATE - (s.n || ' days')::INTERVAL) IN (0,6)
         THEN 210 + (random() * 60)::INT
         ELSE 130 + (random() * 40)::INT END,
    42.5 + (random() * 10)::NUMERIC(5,2),
    (2 + (random() * 4))::INT,
    (1 + random())::INT,
    (3 + (random() * 5))::INT,
    (2 + (random() * 4))::INT,
    (100 + (random() * 40))::INT,
    (40 + (random() * 20))::INT,
    (30 + (random() * 15))::INT,
    (10 + (random() * 8))::INT,
    65 + (random() * 5)::NUMERIC(5,2),
    28 + (random() * 4)::NUMERIC(5,2),
    7.0,
    '[{"page":"home","views":85},{"page":"inventory","views":62},{"page":"contact","views":28}]'
FROM generate_series(0, 29) AS s(n)
ON CONFLICT (dealer_id, date) DO NOTHING;
