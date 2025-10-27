-- Migration: Add description column to ponds table
-- Date: 2025-10-24

-- Add description column if it doesn't exist
ALTER TABLE ponds 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add comment
COMMENT ON COLUMN ponds.description IS 'Optional description for the pond';




