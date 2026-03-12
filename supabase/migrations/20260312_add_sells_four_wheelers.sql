-- Add sells_four_wheelers flag so 2W/3W primary dealers can expand into cars
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS sells_four_wheelers boolean NOT NULL DEFAULT false;
