-- ================================================
-- NilaSense - Complete Database Schema
-- Compatible with Backend Controllers
-- Jalankan di Supabase SQL Editor
-- ================================================

-- ================================================
-- CLEANUP: Drop existing tables and types (if any)
-- Run this section if you want to reset the database
-- ================================================

-- Drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS feed_logs CASCADE;
DROP TABLE IF EXISTS feed_schedules CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS water_quality CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS ponds CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- ================================================
-- 1. ENUM TYPES
-- ================================================

-- User role enum
CREATE TYPE user_role AS ENUM ('admin', 'petambak', 'buyer');

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');

-- ================================================
-- 2. USERS TABLE
-- ================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'buyer',
    pond_id INTEGER,  -- FK will be added after ponds table is created
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ================================================
-- 3. PONDS TABLE (Kolam Ikan)
-- ================================================

CREATE TABLE ponds (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Owner (admin)
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    size_m2 DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key from users.pond_id to ponds.id
ALTER TABLE users ADD CONSTRAINT fk_users_pond FOREIGN KEY (pond_id) REFERENCES ponds(id) ON DELETE SET NULL;

-- Index for faster pond lookups by owner
CREATE INDEX idx_ponds_user ON ponds(user_id);

-- ================================================
-- 4. WATER QUALITY MONITORING TABLE
-- ================================================

CREATE TABLE water_quality (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER REFERENCES ponds(id) ON DELETE CASCADE,
    temperature DECIMAL(5,2),        -- Suhu dalam Celsius
    ph_level DECIMAL(4,2),           -- pH air
    dissolved_oxygen DECIMAL(5,2),   -- Oksigen terlarut (mg/L)
    turbidity DECIMAL(6,2),          -- Kekeruhan (NTU)
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_water_quality_pond ON water_quality(pond_id);
CREATE INDEX idx_water_quality_recorded ON water_quality(recorded_at);

-- ================================================
-- 5. PRODUCTS TABLE
-- ================================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,  -- Owner (admin/petambak)
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,           -- Price per kg
    stock_kg DECIMAL(10,2) DEFAULT 0,       -- Stock in kg
    category VARCHAR(100) DEFAULT 'Ikan Konsumsi',
    image_url VARCHAR(500),
    pond_id INTEGER REFERENCES ponds(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_pond ON products(pond_id);
CREATE INDEX idx_products_user ON products(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- ================================================
-- 6. FEED SCHEDULES TABLE (Jadwal Pakan)
-- ================================================

CREATE TABLE feed_schedules (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER REFERENCES ponds(id) ON DELETE CASCADE,
    feed_time TIME NOT NULL,
    feed_amount_kg DECIMAL(6,2) NOT NULL,
    feed_type VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_feed_schedules_pond ON feed_schedules(pond_id);

-- ================================================
-- 7. FEED LOGS TABLE (Log Pemberian Pakan)
-- ================================================

CREATE TABLE feed_logs (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER REFERENCES ponds(id) ON DELETE CASCADE,
    schedule_id INTEGER REFERENCES feed_schedules(id) ON DELETE SET NULL,
    fed_at TIMESTAMPTZ DEFAULT NOW(),
    amount_kg DECIMAL(6,2),
    fed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT
);

-- Indexes
CREATE INDEX idx_feed_logs_pond ON feed_logs(pond_id);
CREATE INDEX idx_feed_logs_fed_at ON feed_logs(fed_at);

-- ================================================
-- 8. CART TABLE (Keranjang Belanja)
-- ================================================

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Index
CREATE INDEX idx_cart_user ON cart(user_id);

-- ================================================
-- 9. ORDERS TABLE (Pesanan)
-- ================================================

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Shipping info
    shipping_name VARCHAR(255),
    shipping_phone VARCHAR(20),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_postal_code VARCHAR(10),

    -- Amounts
    subtotal DECIMAL(12,2) DEFAULT 0,
    shipping_cost DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,

    -- Status
    status order_status DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50) DEFAULT 'manual',

    -- Midtrans fields
    midtrans_order_id VARCHAR(100),
    midtrans_transaction_id VARCHAR(100),
    snap_token VARCHAR(255),

    -- Timestamps
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Notes
    notes TEXT,
    admin_notes TEXT,

    -- Cancellation info
    cancelled_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at);

-- ================================================
-- 10. ORDER ITEMS TABLE (Item Pesanan)
-- ================================================

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    pond_id INTEGER REFERENCES ponds(id) ON DELETE SET NULL,

    -- Product snapshot (stored at time of order)
    product_name VARCHAR(255),
    product_image VARCHAR(500),
    product_price DECIMAL(10,2) NOT NULL,

    -- Quantity and total
    quantity DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL
);

-- Index
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_pond ON order_items(pond_id);

-- ================================================
-- 11. PASSWORD RESET TOKENS TABLE
-- ================================================

CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_user ON password_reset_tokens(user_id);

-- ================================================
-- 12. DEFAULT DATA
-- ================================================

-- Insert default admin user (password: admin123)
-- Hash generated with bcrypt, 10 rounds
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin NilaSense', 'admin@nilasense.com', '$2b$10$rICvqo5gPDsxPmNVHliMOuGPmhHqZxepeS/VISBCgVqd6pVqvQjku', 'admin');

-- ================================================
-- VERIFICATION (uncomment to test)
-- ================================================

-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- ================================================
-- SCHEMA COMPLETE!
-- ================================================
