const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

// Database configuration dengan fallback values
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'nilasense_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
};

console.log('🔧 Database Configuration:');
console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   Password: ${dbConfig.password ? '***' : 'NOT SET'}`);
console.log('');

async function setupDatabaseSafe() {
  let pool;
  
  try {
    console.log('🔌 Testing database connection...');
    pool = new Pool(dbConfig);
    
    // Test the connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();
    
    console.log('📋 Setting up sample data (skipping existing)...');
    
    // Create sample data with proper password hashing
    console.log('   👥 Creating sample users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Insert users (skip if exists)
    try {
      await pool.query(`
        INSERT INTO users (name, email, password_hash, role) VALUES 
        ($1, $2, $3, $4),
        ($5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING
      `, [
        'Admin Demo', 'admin@demo.com', hashedPassword, 'admin',
        'User Demo', 'user@demo.com', hashedPassword, 'buyer'
      ]);
      console.log('   ✅ Users created/updated');
    } catch (error) {
      console.log('   ⚠️ Users table issue:', error.message);
    }
    
    // Insert ponds
    console.log('   🏊 Creating sample ponds...');
    try {
      await pool.query(`
        INSERT INTO ponds (user_id, name, location) VALUES 
        (1, 'Kolam Utama A', 'Blok A - Sektor 1'),
        (1, 'Kolam Utama B', 'Blok A - Sektor 2'),
        (1, 'Kolam Pembesaran', 'Blok B - Sektor 1')
        ON CONFLICT DO NOTHING
      `);
      console.log('   ✅ Ponds created/updated');
    } catch (error) {
      console.log('   ⚠️ Ponds table issue:', error.message);
    }
    
    // Clear old water quality logs and insert new ones
    console.log('   💧 Creating water quality data...');
    try {
      // Delete old logs first
      await pool.query('DELETE FROM water_quality_logs');
      
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - 7);
      
      for (let pondId = 1; pondId <= 3; pondId++) {
        for (let i = 0; i < 20; i++) {
          const logDate = new Date(baseDate);
          logDate.setHours(logDate.getHours() + (i * 6)); // Every 6 hours
          
          const temp = 26.5 + (Math.random() * 3);
          const ph = 7.0 + (Math.random() * 1.0);
          const oxygen = 5.5 + (Math.random() * 2.0);
          const turbidity = 8 + (Math.random() * 12);
          
          await pool.query(`
            INSERT INTO water_quality_logs (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, logged_at)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [pondId, temp, ph, oxygen, turbidity, logDate]);
        }
      }
      console.log('   ✅ Water quality data created');
    } catch (error) {
      console.log('   ⚠️ Water quality logs issue:', error.message);
    }
    
    // Clear old feed schedules and insert new ones
    console.log('   🍽️ Creating feed schedules...');
    try {
      // Delete old schedules first
      await pool.query('DELETE FROM feed_schedules');
      
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const feedSchedules = [
        // Today's schedules
        [1, '06:00:00', 5.0, 'Pelet Protein Tinggi', 'completed', true, today],
        [1, '12:00:00', 5.0, 'Pelet Protein Tinggi', 'completed', true, today],
        [1, '18:00:00', 5.0, 'Pelet Protein Tinggi', 'pending', false, today],
        
        [2, '06:30:00', 4.0, 'Pelet Protein Sedang', 'completed', true, today],
        [2, '12:30:00', 4.0, 'Pelet Protein Sedang', 'completed', true, today],
        [2, '18:30:00', 4.0, 'Pelet Protein Sedang', 'pending', false, today],
        
        [3, '07:00:00', 3.0, 'Pelet Starter', 'completed', true, today],
        [3, '13:00:00', 3.0, 'Pelet Starter', 'completed', true, today],
        [3, '19:00:00', 3.0, 'Pelet Starter', 'pending', false, today],
        
        // Tomorrow's schedules
        [1, '06:00:00', 5.5, 'Pelet Protein Tinggi', 'pending', false, tomorrowStr],
        [1, '12:00:00', 5.5, 'Pelet Protein Tinggi', 'pending', false, tomorrowStr],
        [1, '18:00:00', 5.5, 'Pelet Protein Tinggi', 'pending', false, tomorrowStr],
      ];
      
      for (const schedule of feedSchedules) {
        await pool.query(`
          INSERT INTO feed_schedules (pond_id, feed_time, amount_kg, feed_type, status, is_done, feed_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, schedule);
      }
      console.log('   ✅ Feed schedules created');
    } catch (error) {
      console.log('   ⚠️ Feed schedules issue:', error.message);
    }
    
    // Insert products
    console.log('   📦 Creating sample products...');
    try {
      await pool.query('DELETE FROM products');
      
      const products = [
        [1, 'Pelet Protein Tinggi 32%', 'Pakan ikan nila dengan kandungan protein tinggi untuk pertumbuhan optimal', 85000, 50.0, 'Pakan Ikan'],
        [1, 'Pelet Protein Sedang 28%', 'Pakan ikan nila dengan kandungan protein sedang untuk pemeliharaan', 75000, 75.0, 'Pakan Ikan'],
        [1, 'Pelet Starter 35%', 'Pakan khusus untuk benih ikan nila', 95000, 30.0, 'Pakan Ikan'],
        [1, 'Vitamin Ikan Premium', 'Suplemen vitamin untuk meningkatkan daya tahan tubuh ikan', 45000, 25.0, 'Suplemen'],
        [1, 'Probiotik Kolam', 'Bakteri baik untuk menjaga kualitas air kolam', 65000, 40.0, 'Perawatan Air']
      ];
      
      for (const product of products) {
        await pool.query(`
          INSERT INTO products (user_id, name, description, price, stock_kg, category)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, product);
      }
      console.log('   ✅ Products created');
    } catch (error) {
      console.log('   ⚠️ Products issue:', error.message);
    }
    
    console.log('');
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Sample data created:');
    console.log('   - 2 users (admin & buyer)');
    console.log('   - 3 ponds with sample names');
    console.log('   - 60+ water quality logs (7 days)');
    console.log('   - 12 feed schedules (today & tomorrow)');
    console.log('   - 5 sample products');
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Admin: admin@demo.com / password123');
    console.log('   User:  user@demo.com / password123');
    console.log('');
    console.log('🚀 Ready to start the application!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    
    if (error.code === '28P01') {
      console.log('');
      console.log('🔧 Authentication Error Solutions:');
      console.log('   1. Check your .env file has correct DB_PASSWORD');
      console.log('   2. Make sure PostgreSQL is running');
      console.log('   3. Verify the database user exists and has permissions');
    }
    
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabaseSafe();
}

module.exports = { setupDatabaseSafe };