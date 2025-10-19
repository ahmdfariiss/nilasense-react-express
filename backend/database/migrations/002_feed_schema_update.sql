-- Update schema untuk feed_schedules table
-- Menambahkan kolom yang diperlukan untuk Tahap 3

-- Tambah kolom feed_type jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feed_schedules' AND column_name = 'feed_type') THEN
        ALTER TABLE feed_schedules ADD COLUMN feed_type VARCHAR(100) DEFAULT 'Pelet Standar';
    END IF;
END $$;

-- Tambah kolom status jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feed_schedules' AND column_name = 'status') THEN
        ALTER TABLE feed_schedules ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
    END IF;
END $$;

-- Tambah kolom created_at jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feed_schedules' AND column_name = 'created_at') THEN
        ALTER TABLE feed_schedules ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Update existing records untuk konsistensi
UPDATE feed_schedules 
SET status = CASE 
    WHEN is_done = true THEN 'completed' 
    ELSE 'pending' 
END
WHERE status IS NULL OR status = '';

UPDATE feed_schedules 
SET feed_type = 'Pelet Standar' 
WHERE feed_type IS NULL OR feed_type = '';

-- Hapus data lama dan insert data baru untuk testing
DELETE FROM feed_schedules;

-- Insert sample feed schedules untuk hari ini
INSERT INTO feed_schedules (pond_id, feed_time, amount_kg, feed_type, status, is_done, feed_date) VALUES 
-- Kolam 1 (ID: 1)
(1, '06:00:00', 5.0, 'Pelet Protein Tinggi', 'completed', true, CURRENT_DATE),
(1, '12:00:00', 5.0, 'Pelet Protein Tinggi', 'completed', true, CURRENT_DATE),
(1, '18:00:00', 5.0, 'Pelet Protein Tinggi', 'pending', false, CURRENT_DATE),

-- Kolam 2 (ID: 2)
(2, '06:30:00', 4.0, 'Pelet Protein Sedang', 'completed', true, CURRENT_DATE),
(2, '12:30:00', 4.0, 'Pelet Protein Sedang', 'completed', true, CURRENT_DATE),
(2, '18:30:00', 4.0, 'Pelet Protein Sedang', 'pending', false, CURRENT_DATE),

-- Kolam 3 (ID: 3)
(3, '07:00:00', 3.0, 'Pelet Starter', 'completed', true, CURRENT_DATE),
(3, '13:00:00', 3.0, 'Pelet Starter', 'completed', true, CURRENT_DATE),
(3, '19:00:00', 3.0, 'Pelet Starter', 'pending', false, CURRENT_DATE);

-- Insert jadwal untuk besok (untuk testing date filter)
INSERT INTO feed_schedules (pond_id, feed_time, amount_kg, feed_type, status, is_done, feed_date) VALUES 
(1, '06:00:00', 5.5, 'Pelet Protein Tinggi', 'pending', false, CURRENT_DATE + INTERVAL '1 day'),
(1, '12:00:00', 5.5, 'Pelet Protein Tinggi', 'pending', false, CURRENT_DATE + INTERVAL '1 day'),
(1, '18:00:00', 5.5, 'Pelet Protein Tinggi', 'pending', false, CURRENT_DATE + INTERVAL '1 day'),

(2, '06:30:00', 4.5, 'Pelet Protein Sedang', 'pending', false, CURRENT_DATE + INTERVAL '1 day'),
(2, '12:30:00', 4.5, 'Pelet Protein Sedang', 'pending', false, CURRENT_DATE + INTERVAL '1 day'),
(2, '18:30:00', 4.5, 'Pelet Protein Sedang', 'pending', false, CURRENT_DATE + INTERVAL '1 day');

-- Insert jadwal untuk kemarin (untuk testing history)
INSERT INTO feed_schedules (pond_id, feed_time, amount_kg, feed_type, status, is_done, feed_date) VALUES 
(1, '06:00:00', 4.8, 'Pelet Protein Tinggi', 'completed', true, CURRENT_DATE - INTERVAL '1 day'),
(1, '12:00:00', 4.8, 'Pelet Protein Tinggi', 'completed', true, CURRENT_DATE - INTERVAL '1 day'),
(1, '18:00:00', 4.8, 'Pelet Protein Tinggi', 'completed', true, CURRENT_DATE - INTERVAL '1 day');

COMMIT;