-- Enum untuk role pengguna
CREATE TYPE user_role AS ENUM ('admin', 'buyer');

-- Tabel untuk menyimpan data pengguna (users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Simpan hash password, bukan plain text!
    role user_role NOT NULL DEFAULT 'buyer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel untuk kolam ikan (ponds)
CREATE TABLE ponds (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Milik siapa kolam ini
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel untuk mencatat data kualitas air (water_quality_logs)
CREATE TABLE water_quality_logs (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER REFERENCES ponds(id) ON DELETE CASCADE,
    temperature DECIMAL(5, 2), -- Suhu, misal: 28.50
    ph_level DECIMAL(4, 2),    -- pH, misal: 7.20
    dissolved_oxygen DECIMAL(5, 2), -- Oksigen terlarut (mg/L)
    turbidity DECIMAL(5, 2),   -- Kekeruhan (NTU)
    logged_at TIMESTAMPTZ DEFAULT NOW() -- Waktu pencatatan
);

-- Tabel untuk jadwal pemberian pakan (feed_schedules)
CREATE TABLE feed_schedules (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER REFERENCES ponds(id) ON DELETE CASCADE,
    feed_time TIME NOT NULL, -- Hanya waktu, misal: '08:00:00'
    amount_kg DECIMAL(5, 2) NOT NULL, -- Jumlah pakan dalam kg
    is_done BOOLEAN DEFAULT FALSE,
    feed_date DATE DEFAULT CURRENT_DATE
);

-- Tabel untuk produk yang dijual
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Siapa penjualnya (admin)
    pond_id INTEGER REFERENCES ponds(id), -- Asal kolam produk (opsional)
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- Harga per kg atau per ekor
    stock_kg DECIMAL(7, 2), -- Stok dalam kg
    category VARCHAR(50), -- Misal: "Ikan Konsumsi", "Bibit Ikan"
    image_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel untuk pesanan (orders)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER REFERENCES users(id), -- Siapa pembelinya
    order_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'Menunggu Pembayaran', -- Misal: "Diproses", "Dikirim", "Selesai"
    total_amount INTEGER
);

-- Tabel untuk detail item dalam setiap pesanan (order_items)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity_kg DECIMAL(7, 2) NOT NULL,
    price_per_kg INTEGER NOT NULL
);