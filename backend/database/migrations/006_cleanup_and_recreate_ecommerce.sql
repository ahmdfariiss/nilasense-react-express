-- ============================================
-- CLEANUP SCRIPT: Drop Existing E-Commerce Tables
-- ============================================
-- CAUTION: This will delete all data in cart, orders, order_items tables!
-- Only run this if you're in development/testing phase.

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart CASCADE;

-- Drop existing ENUM type
DROP TYPE IF EXISTS order_status CASCADE;

-- Drop existing triggers
DROP TRIGGER IF EXISTS trigger_cart_updated_at ON cart;
DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_cart_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_orders_updated_at() CASCADE;

-- ============================================
-- NOW RECREATE TABLES WITH CORRECT STRUCTURE
-- ============================================

-- ============================================
-- 1. CART TABLE (Persistent Shopping Cart)
-- ============================================
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id) -- User can only have one entry per product
);

-- ============================================
-- 2. ORDERS TABLE
-- ============================================
CREATE TYPE order_status AS ENUM (
  'pending',        -- Menunggu pembayaran
  'paid',           -- Sudah dibayar
  'processing',     -- Sedang diproses
  'shipped',        -- Dikirim
  'delivered',      -- Selesai/Terkirim
  'cancelled'       -- Dibatalkan
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL, -- Format: ORD-20251025-0001
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Shipping Info
  shipping_name VARCHAR(255) NOT NULL,
  shipping_phone VARCHAR(20) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_postal_code VARCHAR(10) NOT NULL,
  
  -- Order Summary
  subtotal DECIMAL(12, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount >= 0),
  
  -- Payment Info
  payment_method VARCHAR(50) NOT NULL DEFAULT 'manual_transfer', -- manual_transfer, cod, etc.
  payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid', -- unpaid, paid, refunded
  payment_proof TEXT, -- URL to payment proof image
  paid_at TIMESTAMP,
  
  -- Order Status & Tracking
  status order_status NOT NULL DEFAULT 'pending',
  notes TEXT, -- Catatan pembeli
  admin_notes TEXT, -- Catatan admin/petambak
  cancelled_reason TEXT, -- Alasan pembatalan
  cancelled_at TIMESTAMP,
  cancelled_by INTEGER REFERENCES users(id), -- User yang membatalkan (buyer atau admin)
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. ORDER_ITEMS TABLE (Detail Items in Order)
-- ============================================
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT, -- Don't delete if in order
  pond_id INTEGER REFERENCES ponds(id) ON DELETE SET NULL, -- Track which pond (for multi-admin)
  
  -- Product Snapshot (at time of order)
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  product_price DECIMAL(12, 2) NOT NULL CHECK (product_price >= 0),
  
  -- Quantity & Total
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(12, 2) NOT NULL CHECK (subtotal >= 0), -- price * quantity
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. INDEXES FOR PERFORMANCE
-- ============================================

-- Cart indexes
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_product_id ON cart(product_id);
CREATE INDEX idx_cart_created_at ON cart(created_at);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order Items indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_pond_id ON order_items(pond_id);

-- ============================================
-- 5. UPDATE TRIGGER FOR updated_at
-- ============================================

-- Trigger for cart
CREATE OR REPLACE FUNCTION update_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cart_updated_at
BEFORE UPDATE ON cart
FOR EACH ROW
EXECUTE FUNCTION update_cart_updated_at();

-- Trigger for orders
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_updated_at();

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify tables are created:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('cart', 'orders', 'order_items');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ E-Commerce tables created successfully!';
  RAISE NOTICE '✅ Tables: cart, orders, order_items';
  RAISE NOTICE '✅ ENUM: order_status';
  RAISE NOTICE '✅ Indexes created';
  RAISE NOTICE '✅ Triggers created';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Next: Restart your backend server';
END $$;


