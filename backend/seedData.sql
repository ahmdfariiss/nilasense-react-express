-- Sample data untuk testing integrasi frontend-backend
-- Jalankan script ini setelah menjalankan schema.sql

-- Insert sample users (password: "password123" - sudah di-hash)
INSERT INTO users (name, email, password, role) VALUES 
('Admin Demo', 'admin@demo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('User Demo', 'user@demo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer')
ON CONFLICT (email) DO NOTHING;

-- Insert sample ponds (menggunakan admin user ID = 1)
INSERT INTO ponds (user_id, name, location) VALUES 
(1, 'Kolam Utama A', 'Blok A - Sektor 1'),
(1, 'Kolam Utama B', 'Blok A - Sektor 2'),
(1, 'Kolam Pembesaran', 'Blok B - Sektor 1')
ON CONFLICT DO NOTHING;

-- Insert sample water quality logs untuk testing
-- Data untuk 7 hari terakhir dengan variasi realistis
DO $$
DECLARE
    pond_id_var INTEGER := 1;
    base_date TIMESTAMP := NOW() - INTERVAL '7 days';
    i INTEGER;
    current_time TIMESTAMP;
    temp_val DECIMAL;
    ph_val DECIMAL;
    oxygen_val DECIMAL;
    turbidity_val DECIMAL;
BEGIN
    -- Generate data untuk 7 hari, setiap 2 jam
    FOR i IN 0..83 LOOP -- 7 days * 12 readings per day
        current_time := base_date + (i * INTERVAL '2 hours');
        
        -- Generate realistic values dengan sedikit variasi
        temp_val := 26.5 + (RANDOM() * 3); -- 26.5-29.5°C
        ph_val := 7.0 + (RANDOM() * 1.0); -- 7.0-8.0
        oxygen_val := 5.5 + (RANDOM() * 2.0); -- 5.5-7.5 mg/L
        turbidity_val := 8 + (RANDOM() * 12); -- 8-20 NTU
        
        INSERT INTO water_quality_logs (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, logged_at)
        VALUES (pond_id_var, temp_val, ph_val, oxygen_val, turbidity_val, current_time);
    END LOOP;
    
    -- Tambahkan beberapa data untuk kolam lain juga
    FOR pond_id_var IN 2..3 LOOP
        FOR i IN 0..20 LOOP -- Data lebih sedikit untuk kolam lain
            current_time := base_date + (i * INTERVAL '6 hours');
            
            temp_val := 26.0 + (RANDOM() * 4); 
            ph_val := 6.8 + (RANDOM() * 1.2); 
            oxygen_val := 5.0 + (RANDOM() * 2.5); 
            turbidity_val := 10 + (RANDOM() * 15); 
            
            INSERT INTO water_quality_logs (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, logged_at)
            VALUES (pond_id_var, temp_val, ph_val, oxygen_val, turbidity_val, current_time);
        END LOOP;
    END LOOP;
END $$;

-- Insert sample feed schedules
INSERT INTO feed_schedules (pond_id, feed_time, amount_kg, feed_type, status, is_done, feed_date) VALUES 
(1, '06:00:00', 5.0, 'Pelet Protein Tinggi', 'completed', true, CURRENT_DATE),
(1, '12:00:00', 5.0, 'Pelet Protein Tinggi', 'completed', true, CURRENT_DATE),
(1, '18:00:00', 5.0, 'Pelet Protein Tinggi', 'pending', false, CURRENT_DATE),
(2, '06:30:00', 4.0, 'Pelet Protein Sedang', 'completed', true, CURRENT_DATE),
(2, '12:30:00', 4.0, 'Pelet Protein Sedang', 'completed', true, CURRENT_DATE),
(2, '18:30:00', 4.0, 'Pelet Protein Sedang', 'pending', false, CURRENT_DATE),
(3, '07:00:00', 3.0, 'Pelet Starter', 'completed', true, CURRENT_DATE),
(3, '13:00:00', 3.0, 'Pelet Starter', 'completed', true, CURRENT_DATE),
(3, '19:00:00', 3.0, 'Pelet Starter', 'pending', false, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, stock, category, image_url) VALUES 
('Pelet Protein Tinggi 32%', 'Pakan ikan nila dengan kandungan protein tinggi untuk pertumbuhan optimal', 85000, 50, 'Pakan Ikan', '/images/pelet-protein-tinggi.jpg'),
('Pelet Protein Sedang 28%', 'Pakan ikan nila dengan kandungan protein sedang untuk pemeliharaan', 75000, 75, 'Pakan Ikan', '/images/pelet-protein-sedang.jpg'),
('Pelet Starter 35%', 'Pakan khusus untuk benih ikan nila', 95000, 30, 'Pakan Ikan', '/images/pelet-starter.jpg'),
('Vitamin Ikan Premium', 'Suplemen vitamin untuk meningkatkan daya tahan tubuh ikan', 45000, 25, 'Suplemen', '/images/vitamin-ikan.jpg'),
('Probiotik Kolam', 'Bakteri baik untuk menjaga kualitas air kolam', 65000, 40, 'Perawatan Air', '/images/probiotik-kolam.jpg')
ON CONFLICT DO NOTHING;

COMMIT;