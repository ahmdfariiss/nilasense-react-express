-- ================================================
-- NilaSense - Dummy Data Seed Script
-- Compatible with 001_complete_schema.sql
-- Jalankan di Supabase SQL Editor SETELAH migration
-- ================================================

-- ================================================
-- 1. USERS
-- Password: admin123 = $2b$10$rICvqo5gPDsxPmNVHliMOuGPmhHqZxepeS/VISBCgVqd6pVqvQjku
-- Password: password123 = $2b$10$N9qo8uLOickgx2ZMRZoHK.ZS1pBKxZy1Y0kxqJzK5vKjVjZz5v5aq
-- ================================================

-- Admin sudah ada dari migration, tambahkan user lainnya
INSERT INTO users (name, email, password_hash, role) VALUES
-- Petambak (pond_id akan di-update setelah ponds dibuat)
('Budi Santoso', 'budi@nilasense.com', '$2b$10$N9qo8uLOickgx2ZMRZoHK.ZS1pBKxZy1Y0kxqJzK5vKjVjZz5v5aq', 'petambak'),
('Siti Rahayu', 'siti@nilasense.com', '$2b$10$N9qo8uLOickgx2ZMRZoHK.ZS1pBKxZy1Y0kxqJzK5vKjVjZz5v5aq', 'petambak'),
('Ahmad Hidayat', 'ahmad@nilasense.com', '$2b$10$N9qo8uLOickgx2ZMRZoHK.ZS1pBKxZy1Y0kxqJzK5vKjVjZz5v5aq', 'petambak'),
-- Buyer
('Dewi Lestari', 'dewi@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoHK.ZS1pBKxZy1Y0kxqJzK5vKjVjZz5v5aq', 'buyer'),
('Rizky Pratama', 'rizky@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoHK.ZS1pBKxZy1Y0kxqJzK5vKjVjZz5v5aq', 'buyer'),
('Nur Aini', 'nuraini@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoHK.ZS1pBKxZy1Y0kxqJzK5vKjVjZz5v5aq', 'buyer'),
('Fajar Setiawan', 'fajar@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoHK.ZS1pBKxZy1Y0kxqJzK5vKjVjZz5v5aq', 'buyer'),
('Maya Putri', 'maya@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoHK.ZS1pBKxZy1Y0kxqJzK5vKjVjZz5v5aq', 'buyer')
ON CONFLICT (email) DO NOTHING;

-- ================================================
-- 2. PONDS (Kolam Ikan)
-- user_id = 1 (Admin NilaSense owns all ponds)
-- ================================================

INSERT INTO ponds (user_id, name, location, description, size_m2) VALUES
(1, 'Kolam Utama A', 'Bogor, Jawa Barat', 'Kolam budidaya ikan nila utama dengan sistem bioflok', 500.00),
(1, 'Kolam Pembibitan', 'Bogor, Jawa Barat', 'Kolam khusus pembibitan dan pembesaran benih nila', 300.00),
(1, 'Kolam Panen B', 'Sukabumi, Jawa Barat', 'Kolam untuk ikan nila siap panen ukuran konsumsi', 450.00),
(1, 'Kolam Karantina', 'Bogor, Jawa Barat', 'Kolam karantina untuk ikan baru atau sakit', 150.00),
(1, 'Kolam Premium', 'Cianjur, Jawa Barat', 'Kolam khusus ikan nila merah premium', 400.00);

-- Update pond_id untuk petambak users
UPDATE users SET pond_id = 1 WHERE email = 'budi@nilasense.com';
UPDATE users SET pond_id = 2 WHERE email = 'siti@nilasense.com';
UPDATE users SET pond_id = 3 WHERE email = 'ahmad@nilasense.com';

-- ================================================
-- 3. WATER QUALITY (Data Monitoring 7 Hari Terakhir)
-- ================================================

-- Kolam 1 - Data monitoring 7 hari
INSERT INTO water_quality (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, recorded_at) VALUES
-- Hari ini
(1, 28.5, 7.2, 6.8, 25.0, NOW() - INTERVAL '0 hours'),
(1, 28.2, 7.1, 6.5, 26.0, NOW() - INTERVAL '4 hours'),
(1, 27.8, 7.3, 6.9, 24.5, NOW() - INTERVAL '8 hours'),
-- Kemarin
(1, 28.0, 7.0, 6.6, 27.0, NOW() - INTERVAL '1 day'),
(1, 28.3, 7.2, 6.7, 25.5, NOW() - INTERVAL '1 day 4 hours'),
(1, 27.9, 7.1, 6.8, 26.5, NOW() - INTERVAL '1 day 8 hours'),
-- 2 hari lalu
(1, 28.1, 7.4, 7.0, 23.0, NOW() - INTERVAL '2 days'),
(1, 28.4, 7.3, 6.9, 24.0, NOW() - INTERVAL '2 days 4 hours'),
-- 3 hari lalu
(1, 27.5, 7.0, 6.4, 28.0, NOW() - INTERVAL '3 days'),
(1, 27.8, 7.1, 6.6, 27.5, NOW() - INTERVAL '3 days 4 hours'),
-- 4 hari lalu
(1, 28.6, 7.5, 7.2, 22.0, NOW() - INTERVAL '4 days'),
(1, 28.3, 7.4, 7.0, 23.5, NOW() - INTERVAL '4 days 4 hours'),
-- 5 hari lalu
(1, 27.2, 6.9, 6.2, 30.0, NOW() - INTERVAL '5 days'),
(1, 27.6, 7.0, 6.5, 28.5, NOW() - INTERVAL '5 days 4 hours'),
-- 6 hari lalu
(1, 28.0, 7.2, 6.8, 25.0, NOW() - INTERVAL '6 days'),
(1, 28.2, 7.3, 6.9, 24.5, NOW() - INTERVAL '6 days 4 hours');

-- Kolam 2 - Data monitoring
INSERT INTO water_quality (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, recorded_at) VALUES
(2, 27.0, 7.0, 7.2, 20.0, NOW() - INTERVAL '0 hours'),
(2, 26.8, 6.9, 7.0, 21.0, NOW() - INTERVAL '4 hours'),
(2, 27.2, 7.1, 7.3, 19.5, NOW() - INTERVAL '8 hours'),
(2, 26.5, 6.8, 6.8, 22.0, NOW() - INTERVAL '1 day'),
(2, 27.0, 7.0, 7.1, 20.5, NOW() - INTERVAL '1 day 4 hours'),
(2, 26.8, 6.9, 6.9, 21.5, NOW() - INTERVAL '2 days'),
(2, 27.3, 7.2, 7.4, 19.0, NOW() - INTERVAL '3 days'),
(2, 26.6, 6.8, 6.7, 23.0, NOW() - INTERVAL '4 days'),
(2, 27.1, 7.1, 7.2, 20.0, NOW() - INTERVAL '5 days'),
(2, 26.9, 7.0, 7.0, 21.0, NOW() - INTERVAL '6 days');

-- Kolam 3 - Data monitoring
INSERT INTO water_quality (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, recorded_at) VALUES
(3, 29.0, 7.5, 6.5, 30.0, NOW() - INTERVAL '0 hours'),
(3, 28.8, 7.4, 6.3, 31.0, NOW() - INTERVAL '4 hours'),
(3, 29.2, 7.6, 6.6, 29.0, NOW() - INTERVAL '8 hours'),
(3, 28.5, 7.3, 6.2, 32.0, NOW() - INTERVAL '1 day'),
(3, 29.0, 7.5, 6.4, 30.5, NOW() - INTERVAL '2 days'),
(3, 28.7, 7.4, 6.3, 31.5, NOW() - INTERVAL '3 days'),
(3, 29.3, 7.6, 6.7, 28.0, NOW() - INTERVAL '4 days'),
(3, 28.4, 7.2, 6.1, 33.0, NOW() - INTERVAL '5 days'),
(3, 29.1, 7.5, 6.5, 29.5, NOW() - INTERVAL '6 days');

-- Kolam 4 - Data monitoring (Karantina - kondisi lebih terkontrol)
INSERT INTO water_quality (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, recorded_at) VALUES
(4, 26.0, 7.0, 8.0, 15.0, NOW() - INTERVAL '0 hours'),
(4, 26.2, 7.0, 7.8, 16.0, NOW() - INTERVAL '4 hours'),
(4, 25.8, 6.9, 8.2, 14.0, NOW() - INTERVAL '1 day'),
(4, 26.1, 7.1, 7.9, 15.5, NOW() - INTERVAL '2 days'),
(4, 25.9, 7.0, 8.1, 14.5, NOW() - INTERVAL '3 days');

-- Kolam 5 - Data monitoring (Premium)
INSERT INTO water_quality (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, recorded_at) VALUES
(5, 27.5, 7.3, 7.5, 18.0, NOW() - INTERVAL '0 hours'),
(5, 27.3, 7.2, 7.3, 19.0, NOW() - INTERVAL '4 hours'),
(5, 27.7, 7.4, 7.6, 17.5, NOW() - INTERVAL '8 hours'),
(5, 27.0, 7.1, 7.2, 20.0, NOW() - INTERVAL '1 day'),
(5, 27.5, 7.3, 7.4, 18.5, NOW() - INTERVAL '2 days'),
(5, 27.2, 7.2, 7.3, 19.5, NOW() - INTERVAL '3 days'),
(5, 27.8, 7.5, 7.7, 17.0, NOW() - INTERVAL '4 days'),
(5, 27.1, 7.1, 7.1, 20.5, NOW() - INTERVAL '5 days'),
(5, 27.6, 7.4, 7.5, 18.0, NOW() - INTERVAL '6 days');

-- ================================================
-- 4. PRODUCTS (Produk Ikan)
-- user_id = 1 (Admin), price = price per kg
-- ================================================

INSERT INTO products (user_id, name, description, price, stock_kg, category, image_url, pond_id, is_active) VALUES
(1, 'Ikan Nila Segar', 'Ikan nila segar langsung dari kolam, ukuran konsumsi 300-500g per ekor. Cocok untuk digoreng, dibakar, atau dipepes.', 35000.00, 150.00, 'Ikan Konsumsi', '/uploads/products/nila-segar.jpg', 1, true),
(1, 'Ikan Nila Merah Premium', 'Ikan nila merah premium berkualitas tinggi, ukuran jumbo 500-800g per ekor. Daging lebih tebal dan gurih.', 55000.00, 75.00, 'Ikan Premium', '/uploads/products/nila-merah.jpg', 5, true),
(1, 'Ikan Nila Fillet', 'Fillet ikan nila tanpa tulang, siap masak. Praktis untuk berbagai olahan masakan.', 75000.00, 50.00, 'Olahan', '/uploads/products/nila-fillet.jpg', 3, true),
(1, 'Benih Ikan Nila', 'Benih ikan nila ukuran 2-3cm, sehat dan berkualitas untuk budidaya. Minimal pembelian 100 ekor.', 500.00, 5000.00, 'Benih', '/uploads/products/benih-nila.jpg', 2, true),
(1, 'Ikan Nila Asap', 'Ikan nila asap tradisional, diproses dengan kayu pilihan. Tahan lama dan siap santap.', 85000.00, 30.00, 'Olahan', '/uploads/products/nila-asap.jpg', 1, true),
(1, 'Ikan Nila Frozen', 'Ikan nila beku dalam kemasan vacuum, tahan hingga 3 bulan dalam freezer.', 40000.00, 100.00, 'Ikan Konsumsi', '/uploads/products/nila-frozen.jpg', 3, true),
(1, 'Paket Nila Keluarga', 'Paket hemat 5kg ikan nila segar untuk keluarga. Sudah dibersihkan dan siap masak.', 32000.00, 200.00, 'Paket', '/uploads/products/paket-keluarga.jpg', 1, true),
(1, 'Ikan Nila Organik', 'Ikan nila yang dibudidayakan secara organik tanpa bahan kimia. Lebih sehat dan ramah lingkungan.', 65000.00, 40.00, 'Ikan Premium', '/uploads/products/nila-organik.jpg', 5, true);

-- ================================================
-- 5. FEED SCHEDULES (Jadwal Pemberian Pakan)
-- ================================================

INSERT INTO feed_schedules (pond_id, feed_time, feed_amount_kg, feed_type, is_active) VALUES
-- Kolam 1
(1, '06:00:00', 5.0, 'Pelet Apung Hi-Pro', true),
(1, '12:00:00', 4.5, 'Pelet Apung Hi-Pro', true),
(1, '18:00:00', 5.0, 'Pelet Apung Hi-Pro', true),
-- Kolam 2 (Pembibitan - pakan lebih sering, porsi kecil)
(2, '06:00:00', 1.0, 'Pelet Starter', true),
(2, '09:00:00', 0.8, 'Pelet Starter', true),
(2, '12:00:00', 1.0, 'Pelet Starter', true),
(2, '15:00:00', 0.8, 'Pelet Starter', true),
(2, '18:00:00', 1.0, 'Pelet Starter', true),
-- Kolam 3
(3, '07:00:00', 6.0, 'Pelet Apung Premium', true),
(3, '13:00:00', 5.5, 'Pelet Apung Premium', true),
(3, '19:00:00', 6.0, 'Pelet Apung Premium', true),
-- Kolam 4 (Karantina - pakan khusus)
(4, '08:00:00', 0.5, 'Pelet Medicated', true),
(4, '16:00:00', 0.5, 'Pelet Medicated', true),
-- Kolam 5 (Premium)
(5, '06:30:00', 4.0, 'Pelet Organik Premium', true),
(5, '12:30:00', 3.5, 'Pelet Organik Premium', true),
(5, '18:30:00', 4.0, 'Pelet Organik Premium', true);

-- ================================================
-- 6. FEED LOGS (Log Pemberian Pakan 7 Hari Terakhir)
-- Petambak IDs: Budi=2, Siti=3, Ahmad=4
-- ================================================

INSERT INTO feed_logs (pond_id, schedule_id, fed_at, amount_kg, fed_by, notes) VALUES
-- Hari ini - Kolam 1 (Budi)
(1, 1, NOW() - INTERVAL '12 hours', 5.0, 2, 'Pakan pagi normal'),
(1, 2, NOW() - INTERVAL '6 hours', 4.5, 2, 'Pakan siang normal'),
-- Kemarin - Kolam 1
(1, 1, NOW() - INTERVAL '1 day 12 hours', 5.0, 2, 'Pakan pagi normal'),
(1, 2, NOW() - INTERVAL '1 day 6 hours', 4.5, 2, 'Pakan siang normal'),
(1, 3, NOW() - INTERVAL '1 day', 5.0, 2, 'Pakan sore normal'),
-- 2 hari lalu - Kolam 1
(1, 1, NOW() - INTERVAL '2 days 12 hours', 4.8, 2, 'Stok pakan tinggal sedikit'),
(1, 2, NOW() - INTERVAL '2 days 6 hours', 4.5, 2, NULL),
(1, 3, NOW() - INTERVAL '2 days', 5.0, 2, NULL),
-- Kolam 2 (Siti)
(2, 4, NOW() - INTERVAL '12 hours', 1.0, 3, 'Benih makan lahap'),
(2, 5, NOW() - INTERVAL '9 hours', 0.8, 3, NULL),
(2, 6, NOW() - INTERVAL '6 hours', 1.0, 3, NULL),
(2, 4, NOW() - INTERVAL '1 day 12 hours', 1.0, 3, NULL),
(2, 5, NOW() - INTERVAL '1 day 9 hours', 0.8, 3, NULL),
-- Kolam 3 (Ahmad)
(3, 9, NOW() - INTERVAL '11 hours', 6.0, 4, 'Ikan siap panen'),
(3, 10, NOW() - INTERVAL '5 hours', 5.5, 4, NULL),
(3, 9, NOW() - INTERVAL '1 day 11 hours', 6.0, 4, NULL),
(3, 10, NOW() - INTERVAL '1 day 5 hours', 5.5, 4, NULL),
(3, 11, NOW() - INTERVAL '1 day', 6.0, 4, 'Pakan habis, perlu restock');

-- ================================================
-- 7. ORDERS (Pesanan)
-- Buyer IDs: Dewi=5, Rizky=6, Nur Aini=7, Fajar=8, Maya=9
-- ================================================

INSERT INTO orders (order_number, user_id, total_amount, subtotal, shipping_cost, status, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code, notes, payment_method, payment_status, payment_gateway, created_at) VALUES
-- Pesanan selesai
('ORD-20241101-001', 5, 175000.00, 175000.00, 0, 'delivered', 'Dewi Lestari', '081234567890', 'Jl. Merdeka No. 123, Kel. Sukamaju', 'Jakarta Selatan', '12345', 'Tolong ikan dibersihkan', 'manual_transfer', 'paid', 'manual', NOW() - INTERVAL '20 days'),
('ORD-20241105-002', 6, 385000.00, 385000.00, 0, 'delivered', 'Rizky Pratama', '082345678901', 'Jl. Sudirman No. 456, Kel. Menteng', 'Jakarta Pusat', '10110', NULL, 'manual_transfer', 'paid', 'manual', NOW() - INTERVAL '16 days'),
('ORD-20241108-003', 7, 225000.00, 225000.00, 0, 'delivered', 'Nur Aini', '083456789012', 'Jl. Gatot Subroto No. 789', 'Bandung', '40123', 'Kirim pagi hari', 'midtrans', 'paid', 'midtrans', NOW() - INTERVAL '13 days'),
-- Pesanan dikirim
('ORD-20241115-004', 8, 550000.00, 550000.00, 0, 'shipped', 'Fajar Setiawan', '084567890123', 'Jl. Asia Afrika No. 321', 'Bandung', '40112', 'Hubungi sebelum kirim', 'manual_transfer', 'paid', 'manual', NOW() - INTERVAL '6 days'),
('ORD-20241118-005', 9, 160000.00, 160000.00, 0, 'shipped', 'Maya Putri', '085678901234', 'Jl. Dago No. 555', 'Bandung', '40135', NULL, 'cash_on_delivery', 'unpaid', 'manual', NOW() - INTERVAL '3 days'),
-- Pesanan diproses
('ORD-20241120-006', 5, 275000.00, 275000.00, 0, 'processing', 'Dewi Lestari', '081234567890', 'Jl. Merdeka No. 123, Kel. Sukamaju', 'Jakarta Selatan', '12345', 'Pesanan kedua', 'manual_transfer', 'paid', 'manual', NOW() - INTERVAL '1 day'),
('ORD-20241121-007', 6, 425000.00, 425000.00, 0, 'processing', 'Rizky Pratama', '082345678901', 'Jl. Sudirman No. 456, Kel. Menteng', 'Jakarta Pusat', '10110', 'Minta faktur', 'midtrans', 'paid', 'midtrans', NOW() - INTERVAL '12 hours'),
-- Pesanan pending
('ORD-20241122-008', 7, 195000.00, 195000.00, 0, 'pending', 'Nur Aini', '083456789012', 'Jl. Gatot Subroto No. 789', 'Bandung', '40123', NULL, 'manual_transfer', 'unpaid', 'manual', NOW() - INTERVAL '2 hours'),
('ORD-20241122-009', 8, 320000.00, 320000.00, 0, 'pending', 'Fajar Setiawan', '084567890123', 'Jl. Asia Afrika No. 321', 'Bandung', '40112', 'Urgent', 'midtrans', 'unpaid', 'midtrans', NOW() - INTERVAL '1 hour');

-- ================================================
-- 8. ORDER ITEMS (Item Pesanan)
-- Product IDs: 1=Nila Segar, 2=Nila Merah, 3=Fillet, 4=Benih, 5=Asap, 6=Frozen, 7=Paket, 8=Organik
-- ================================================

-- Order 1 (Dewi - Delivered)
INSERT INTO order_items (order_id, product_id, pond_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(1, 1, 1, 'Ikan Nila Segar', '/uploads/products/nila-segar.jpg', 35000.00, 5.0, 175000.00);

-- Order 2 (Rizky - Delivered)
INSERT INTO order_items (order_id, product_id, pond_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(2, 2, 5, 'Ikan Nila Merah Premium', '/uploads/products/nila-merah.jpg', 55000.00, 5.0, 275000.00),
(2, 1, 1, 'Ikan Nila Segar', '/uploads/products/nila-segar.jpg', 35000.00, 3.0, 105000.00);

-- Order 3 (Nur Aini - Delivered)
INSERT INTO order_items (order_id, product_id, pond_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(3, 3, 3, 'Ikan Nila Fillet', '/uploads/products/nila-fillet.jpg', 75000.00, 3.0, 225000.00);

-- Order 4 (Fajar - Shipped)
INSERT INTO order_items (order_id, product_id, pond_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(4, 2, 5, 'Ikan Nila Merah Premium', '/uploads/products/nila-merah.jpg', 55000.00, 6.0, 330000.00),
(4, 3, 3, 'Ikan Nila Fillet', '/uploads/products/nila-fillet.jpg', 75000.00, 2.0, 150000.00),
(4, 1, 1, 'Ikan Nila Segar', '/uploads/products/nila-segar.jpg', 35000.00, 2.0, 70000.00);

-- Order 5 (Maya - Shipped)
INSERT INTO order_items (order_id, product_id, pond_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(5, 7, 1, 'Paket Nila Keluarga', '/uploads/products/paket-keluarga.jpg', 32000.00, 5.0, 160000.00);

-- Order 6 (Dewi - Processing)
INSERT INTO order_items (order_id, product_id, pond_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(6, 8, 5, 'Ikan Nila Organik', '/uploads/products/nila-organik.jpg', 65000.00, 3.0, 195000.00),
(6, 6, 3, 'Ikan Nila Frozen', '/uploads/products/nila-frozen.jpg', 40000.00, 2.0, 80000.00);

-- Order 7 (Rizky - Processing)
INSERT INTO order_items (order_id, product_id, pond_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(7, 5, 1, 'Ikan Nila Asap', '/uploads/products/nila-asap.jpg', 85000.00, 3.0, 255000.00),
(7, 1, 1, 'Ikan Nila Segar', '/uploads/products/nila-segar.jpg', 35000.00, 4.0, 140000.00),
(7, 4, 2, 'Benih Ikan Nila', '/uploads/products/benih-nila.jpg', 500.00, 60.0, 30000.00);

-- Order 8 (Nur Aini - Pending)
INSERT INTO order_items (order_id, product_id, pond_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(8, 1, 1, 'Ikan Nila Segar', '/uploads/products/nila-segar.jpg', 35000.00, 3.0, 105000.00),
(8, 6, 3, 'Ikan Nila Frozen', '/uploads/products/nila-frozen.jpg', 40000.00, 2.0, 80000.00);

-- Order 9 (Fajar - Pending)
INSERT INTO order_items (order_id, product_id, pond_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(9, 7, 1, 'Paket Nila Keluarga', '/uploads/products/paket-keluarga.jpg', 32000.00, 10.0, 320000.00);

-- ================================================
-- 9. CART (Keranjang Belanja Aktif)
-- ================================================

INSERT INTO cart (user_id, product_id, quantity) VALUES
(5, 2, 2.0),   -- Dewi: Nila Merah 2kg
(5, 3, 1.5),   -- Dewi: Nila Fillet 1.5kg
(6, 1, 5.0),   -- Rizky: Nila Segar 5kg
(7, 5, 2.0),   -- Nur Aini: Nila Asap 2kg
(8, 8, 3.0),   -- Fajar: Nila Organik 3kg
(9, 7, 5.0)    -- Maya: Paket Keluarga 5kg
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

-- ================================================
-- VERIFICATION QUERIES (Optional)
-- ================================================

-- Uncomment to verify data:
/*
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'Ponds', COUNT(*) FROM ponds
UNION ALL SELECT 'Water Quality', COUNT(*) FROM water_quality
UNION ALL SELECT 'Products', COUNT(*) FROM products
UNION ALL SELECT 'Feed Schedules', COUNT(*) FROM feed_schedules
UNION ALL SELECT 'Feed Logs', COUNT(*) FROM feed_logs
UNION ALL SELECT 'Orders', COUNT(*) FROM orders
UNION ALL SELECT 'Order Items', COUNT(*) FROM order_items
UNION ALL SELECT 'Cart', COUNT(*) FROM cart;
*/

-- ================================================
-- DONE! Data dummy berhasil di-seed
-- ================================================
