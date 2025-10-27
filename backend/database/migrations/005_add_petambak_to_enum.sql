-- Migration 005: Add 'petambak' to user_role enum
-- Date: 24 Oktober 2025
-- Purpose: Allow petambak role in users table

-- Add 'petambak' to the user_role enum type
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'petambak';

-- Verify the enum values
-- You can check with: SELECT enum_range(NULL::user_role);


