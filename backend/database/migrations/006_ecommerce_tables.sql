-- Migration: E-Commerce Tables (Cart, Orders, Order Items)
-- Date: 2025-10-25
-- Description: Create tables for persistent cart and order management

-- ============================================
-- 1. CART TABLE (Persistent Shopping Cart)
-- ============================================
CREATE TABLE IF NOT EXISTS cart (
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

CREATE TABLE IF NOT EXISTS orders (
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
CREATE TABLE IF NOT EXISTS order_items (
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
-- 6. SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample cart items (if users and products exist)
-- INSERT INTO cart (user_id, product_id, quantity) VALUES (2, 1, 5);
-- INSERT INTO cart (user_id, product_id, quantity) VALUES (2, 2, 3);

-- ============================================
-- NOTES:
-- ============================================
-- 1. Cart is persistent - items remain until user removes them or orders
-- 2. Orders store snapshot of product data (name, price, image) at time of order
-- 3. Order status workflow: pending → paid → processing → shipped → delivered
-- 4. Payment is manual (transfer) for now, but schema supports future payment gateways
-- 5. Shipping cost is free (default 0) for now
-- 6. Stock management will be handled in application logic (orderController)
-- 7. pond_id in order_items helps track which admin/petambak owns the product
-- 8. cancelled_by tracks who cancelled (buyer or admin/petambak)

-- ============================================
-- TO RUN THIS MIGRATION:
-- ============================================
-- 1. Copy this entire file content
-- 2. Open pgAdmin
-- 3. Connect to your database
-- 4. Open Query Tool
-- 5. Paste and Execute (F5)
-- 6. Verify tables created successfully


