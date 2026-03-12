-- Fix existing dealer_brands rows that were saved without vehicle_type.
-- Before this fix, save-dealer.ts inserted brands without the vehicle_type column,
-- so they all defaulted to 'cars' even for 2W/3W dealers.
-- This caused the two-wheelers page to fall back to the generic POPULAR_2W_BRANDS
-- list (Hero MotoCorp first) instead of showing the dealer's actual brand.

UPDATE dealer_brands db
SET vehicle_type = CASE
    WHEN d.vehicle_type = 'two-wheeler'   THEN '2w'
    WHEN d.vehicle_type = 'three-wheeler' THEN '3w'
    ELSE 'cars'
END
FROM dealers d
WHERE db.dealer_id = d.id
  AND db.vehicle_type = 'cars'
  AND d.vehicle_type IN ('two-wheeler', 'three-wheeler');
