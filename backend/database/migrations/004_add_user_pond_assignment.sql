-- Migration 004: Add pond assignment for petambak role
-- Date: 24 Oktober 2025
-- Purpose: Allow petambak users to be assigned to specific ponds

-- Add pond_id column to users table
-- This links petambak users to their specific pond
ALTER TABLE users ADD COLUMN IF NOT EXISTS pond_id INTEGER REFERENCES ponds(id) ON DELETE SET NULL;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_pond_id ON users(pond_id);

-- Add index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update role enum if using CHECK constraint (optional, depends on your setup)
-- If you have a CHECK constraint on role column, you might need to update it
-- For now, we'll allow 'admin', 'buyer', and 'petambak' as valid roles

COMMENT ON COLUMN users.pond_id IS 'For petambak role: the pond they are assigned to manage. NULL for admin and buyer roles.';


