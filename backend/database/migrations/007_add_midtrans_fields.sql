-- Migration: Add Midtrans Payment Integration Fields
-- Date: 2025-01-XX
-- Description: Add transaction_id and payment_gateway fields to orders table for Midtrans integration

-- Add transaction_id field to store Midtrans transaction ID
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255);

-- Add payment_gateway field to track payment gateway used
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_gateway VARCHAR(50) DEFAULT 'manual';

-- Add index for transaction_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id);

-- Add index for payment_gateway
CREATE INDEX IF NOT EXISTS idx_orders_payment_gateway ON orders(payment_gateway);

-- ============================================
-- NOTES:
-- ============================================
-- 1. transaction_id: Stores Midtrans transaction_id for tracking payments
-- 2. payment_gateway: Values can be 'manual', 'midtrans', etc.
-- 3. These fields allow tracking of payment gateway transactions

-- ============================================
-- TO RUN THIS MIGRATION:
-- ============================================
-- 1. Copy this entire file content
-- 2. Open pgAdmin or psql
-- 3. Connect to your database
-- 4. Execute this migration
-- 5. Verify columns added successfully




















