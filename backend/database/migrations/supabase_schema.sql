-- ================================================
-- NilaSense - Supabase Schema Migration
-- Berdasarkan nilasense_dump.sql dari PostgreSQL lokal
-- Jalankan di Supabase SQL Editor
-- ================================================

-- ================================================
-- 1. DROP EXISTING (Reset Database)
-- ================================================

DROP TABLE IF EXISTS water_quality_logs CASCADE;
DROP TABLE IF EXISTS feed_schedules CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS ponds CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

DROP FUNCTION IF EXISTS update_cart_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_orders_updated_at() CASCADE;

-- ================================================
-- 2. CREATE ENUM TYPES
-- ================================================

CREATE TYPE order_status AS ENUM (
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);

CREATE TYPE user_role AS ENUM (
    'admin',
    'buyer',
    'petambak'
);

-- ================================================
-- 3. CREATE FUNCTIONS
-- ================================================

CREATE FUNCTION update_cart_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE FUNCTION update_orders_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ================================================
-- 4. CREATE TABLES
-- ================================================

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'buyer' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    pond_id INTEGER
);

COMMENT ON COLUMN users.pond_id IS 'For petambak role: the pond they are assigned to manage. NULL for admin and buyer roles.';

-- Ponds Table
CREATE TABLE ponds (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    pond_id INTEGER,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    stock_kg NUMERIC(7,2),
    category VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Table
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_quantity_check CHECK (quantity > 0),
    UNIQUE(user_id, product_id)
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    shipping_name VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(10) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    shipping_cost NUMERIC(12,2) DEFAULT 0 NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'manual_transfer' NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'unpaid' NOT NULL,
    payment_proof TEXT,
    paid_at TIMESTAMP,
    status order_status DEFAULT 'pending' NOT NULL,
    notes TEXT,
    admin_notes TEXT,
    cancelled_reason TEXT,
    cancelled_at TIMESTAMP,
    cancelled_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(255),
    payment_gateway VARCHAR(50) DEFAULT 'manual',
    CONSTRAINT orders_shipping_cost_check CHECK (shipping_cost >= 0),
    CONSTRAINT orders_subtotal_check CHECK (subtotal >= 0),
    CONSTRAINT orders_total_amount_check CHECK (total_amount >= 0)
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    pond_id INTEGER,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    product_price NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT order_items_product_price_check CHECK (product_price >= 0),
    CONSTRAINT order_items_quantity_check CHECK (quantity > 0),
    CONSTRAINT order_items_subtotal_check CHECK (subtotal >= 0)
);

-- Feed Schedules Table
CREATE TABLE feed_schedules (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER,
    feed_time TIME NOT NULL,
    amount_kg NUMERIC(5,2) NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    feed_date DATE DEFAULT CURRENT_DATE,
    feed_type VARCHAR(100) DEFAULT 'Pelet Standar',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Water Quality Logs Table
CREATE TABLE water_quality_logs (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER,
    temperature NUMERIC(5,2),
    ph_level NUMERIC(4,2),
    dissolved_oxygen NUMERIC(5,2),
    turbidity NUMERIC(5,2),
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 5. CREATE INDEXES
-- ================================================

CREATE INDEX idx_users_pond_id ON users(pond_id);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_product_id ON cart(product_id);
CREATE INDEX idx_cart_created_at ON cart(created_at);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_payment_gateway ON orders(payment_gateway);
CREATE INDEX idx_orders_transaction_id ON orders(transaction_id);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_pond_id ON order_items(pond_id);

CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);

-- ================================================
-- 6. CREATE TRIGGERS
-- ================================================

CREATE TRIGGER trigger_cart_updated_at
    BEFORE UPDATE ON cart
    FOR EACH ROW
    EXECUTE FUNCTION update_cart_updated_at();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

-- ================================================
-- 7. ADD FOREIGN KEY CONSTRAINTS
-- ================================================

-- Users -> Ponds
ALTER TABLE users
    ADD CONSTRAINT users_pond_id_fkey
    FOREIGN KEY (pond_id) REFERENCES ponds(id) ON DELETE SET NULL;

-- Ponds -> Users
ALTER TABLE ponds
    ADD CONSTRAINT ponds_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Products -> Users
ALTER TABLE products
    ADD CONSTRAINT products_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Products -> Ponds
ALTER TABLE products
    ADD CONSTRAINT products_pond_id_fkey
    FOREIGN KEY (pond_id) REFERENCES ponds(id);

-- Cart -> Users
ALTER TABLE cart
    ADD CONSTRAINT cart_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Cart -> Products
ALTER TABLE cart
    ADD CONSTRAINT cart_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Orders -> Users
ALTER TABLE orders
    ADD CONSTRAINT orders_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Orders -> Users (cancelled_by)
ALTER TABLE orders
    ADD CONSTRAINT orders_cancelled_by_fkey
    FOREIGN KEY (cancelled_by) REFERENCES users(id);

-- Order Items -> Orders
ALTER TABLE order_items
    ADD CONSTRAINT order_items_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- Order Items -> Products
ALTER TABLE order_items
    ADD CONSTRAINT order_items_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

-- Order Items -> Ponds
ALTER TABLE order_items
    ADD CONSTRAINT order_items_pond_id_fkey
    FOREIGN KEY (pond_id) REFERENCES ponds(id) ON DELETE SET NULL;

-- Feed Schedules -> Ponds
ALTER TABLE feed_schedules
    ADD CONSTRAINT feed_schedules_pond_id_fkey
    FOREIGN KEY (pond_id) REFERENCES ponds(id) ON DELETE CASCADE;

-- Water Quality Logs -> Ponds
ALTER TABLE water_quality_logs
    ADD CONSTRAINT water_quality_logs_pond_id_fkey
    FOREIGN KEY (pond_id) REFERENCES ponds(id) ON DELETE CASCADE;

-- Password Reset Tokens -> Users
ALTER TABLE password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ================================================
-- 8. INSERT DEFAULT ADMIN USER
-- Password: admin123
-- ================================================

INSERT INTO users (name, email, password_hash, role) VALUES
('Admin NilaSense', 'admin@nilasense.com', '$2b$10$rICvqo5gPDsxPmNVHliMOuGPmhHqZxepeS/VISBCgVqd6pVqvQjku', 'admin');

-- ================================================
-- SCHEMA MIGRATION COMPLETE!
-- ================================================
