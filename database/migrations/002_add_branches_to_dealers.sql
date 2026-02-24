-- Add branches column to dealers table for multi-location support
ALTER TABLE public.dealers
ADD COLUMN IF NOT EXISTS branches jsonb DEFAULT NULL;

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_dealers_branches ON public.dealers USING GIN (branches);
