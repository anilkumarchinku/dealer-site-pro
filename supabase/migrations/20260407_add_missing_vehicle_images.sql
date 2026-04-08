-- Add image URLs for 6 previously missing vehicle models
-- These images were scraped and stored locally in public/data/brand-model-images/

-- Update Honda Activa 6G (2W motorcycle)
UPDATE tw_vehicles
SET image_urls = ARRAY['/data/brand-model-images/2w/honda-hmsi/activa-6g.jpg']
WHERE LOWER(TRIM(brand)) = 'honda'
  AND LOWER(TRIM(model)) = 'activa 6g'
  AND (image_urls IS NULL OR image_urls = '{}');

-- Update Ola Electric S1 Pro (2W motorcycle)
UPDATE tw_vehicles
SET image_urls = ARRAY['/data/brand-model-images/2w/ola-electric/s1-pro.jpg']
WHERE LOWER(TRIM(brand)) = 'ola'
  AND LOWER(TRIM(model)) = 's1 pro'
  AND (image_urls IS NULL OR image_urls = '{}');

-- Update Royal Enfield Classic 350 (2W motorcycle)
UPDATE tw_vehicles
SET image_urls = ARRAY['/data/brand-model-images/2w/royal-enfield/classic-350.jpg']
WHERE LOWER(TRIM(brand)) = 'royal enfield'
  AND LOWER(TRIM(model)) = 'classic 350'
  AND (image_urls IS NULL OR image_urls = '{}');

-- Update Bajaj RE Compact (3W auto-rickshaw)
UPDATE thw_vehicles
SET image_urls = ARRAY['/data/brand-model-images/3w/bajaj-auto-3w/compact-re-cng.jpg']
WHERE LOWER(TRIM(brand)) = 'bajaj'
  AND LOWER(TRIM(model)) = 're compact'
  AND (image_urls IS NULL OR image_urls = '{}');

-- Update Mahindra Treo Zor (3W auto-rickshaw)
UPDATE thw_vehicles
SET image_urls = ARRAY['/data/brand-model-images/3w/mahindra-3w/treo-zor.jpg']
WHERE LOWER(TRIM(brand)) = 'mahindra'
  AND LOWER(TRIM(model)) = 'treo zor'
  AND (image_urls IS NULL OR image_urls = '{}');

-- Update TVS King EV (3W auto-rickshaw)
UPDATE thw_vehicles
SET image_urls = ARRAY['/data/brand-model-images/3w/tvs-king/king-ev-max.jpg']
WHERE LOWER(TRIM(brand)) = 'tvs'
  AND LOWER(TRIM(model)) = 'king ev'
  AND (image_urls IS NULL OR image_urls = '{}');
