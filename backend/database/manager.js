#!/usr/bin/env node

/**
 * Database Manager CLI
 * Centralized database operations untuk NilaSense
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'nilasense_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
};

class DatabaseManager {
  constructor() {
    this.pool = null;
  }

  async connect() {
    if (!this.pool) {
      this.pool = new Pool(dbConfig);
      const client = await this.pool.connect();
      client.release();
    }
    return this.pool;
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async runMigration(filename) {
    try {
      console.log(`📄 Running migration: ${filename}`);
      const migrationPath = path.join(__dirname, '../migrations', filename);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      await this.pool.query(migrationSQL);
      console.log(`✅ Migration completed: ${filename}`);
    } catch (error) {
      console.error(`❌ Migration failed: ${filename}`, error.message);
      throw error;
    }
  }

  async runSeed(filename) {
    try {
      console.log(`🌱 Running seed: ${filename}`);
      const seedPath = path.join(__dirname, '../seeds', filename);
      const seedSQL = fs.readFileSync(seedPath, 'utf8');
      
      await this.pool.query(seedSQL);
      console.log(`✅ Seed completed: ${filename}`);
    } catch (error) {
      console.error(`❌ Seed failed: ${filename}`, error.message);
      throw error;
    }
  }

  async setupFresh() {
    try {
      console.log('🚀 Setting up fresh database...');
      await this.connect();
      
      // Run migrations
      await this.runMigration('001_initial_schema.sql');
      
      // Run seeds
      await this.runSeed('001_initial_data.sql');
      
      console.log('✅ Fresh database setup completed!');
    } catch (error) {
      console.error('❌ Fresh setup failed:', error.message);
      throw error;
    }
  }

  async setupSafe() {
    try {
      console.log('🛡️ Setting up database safely (existing schema)...');
      await this.connect();
      
      // Only insert sample data, skip schema creation
      console.log('👥 Creating sample users...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await this.pool.query(`
        INSERT INTO users (name, email, password_hash, role) VALUES 
        ($1, $2, $3, $4),
        ($5, $6, $7, $8)
        ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role
      `, [
        'Admin Demo', 'admin@demo.com', hashedPassword, 'admin',
        'User Demo', 'user@demo.com', hashedPassword, 'buyer'
      ]);

      console.log('🏊 Creating sample ponds...');
      await this.pool.query(`
        INSERT INTO ponds (user_id, name, location) VALUES 
        (1, 'Kolam Utama A', 'Blok A - Sektor 1'),
        (1, 'Kolam Utama B', 'Blok A - Sektor 2'),
        (1, 'Kolam Pembesaran', 'Blok B - Sektor 1')
        ON CONFLICT DO NOTHING
      `);

      // Clear and recreate monitoring data
      console.log('💧 Refreshing water quality data...');
      await this.pool.query('DELETE FROM water_quality_logs');
      
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - 7);
      
      for (let pondId = 1; pondId <= 3; pondId++) {
        for (let i = 0; i < 20; i++) {
          const logDate = new Date(baseDate);
          logDate.setHours(logDate.getHours() + (i * 6));
          
          const temp = 26.5 + (Math.random() * 3);
          const ph = 7.0 + (Math.random() * 1.0);
          const oxygen = 5.5 + (Math.random() * 2.0);
          const turbidity = 8 + (Math.random() * 12);
          
          await this.pool.query(`
            INSERT INTO water_quality_logs (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, logged_at)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [pondId, temp, ph, oxygen, turbidity, logDate]);
        }
      }

      // Clear and recreate feed schedules
      console.log('🍽️ Refreshing feed schedules...');
      await this.pool.query('DELETE FROM feed_schedules');
      
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const feedSchedules = [
        [1, '06:00:00', 5.0, 'Pelet Protein Tinggi', 'completed', true, today],
        [1, '12:00:00', 5.0, 'Pelet Protein Tinggi', 'completed', true, today],
        [1, '18:00:00', 5.0, 'Pelet Protein Tinggi', 'pending', false, today],
        [2, '06:30:00', 4.0, 'Pelet Protein Sedang', 'completed', true, today],
        [2, '12:30:00', 4.0, 'Pelet Protein Sedang', 'completed', true, today],
        [2, '18:30:00', 4.0, 'Pelet Protein Sedang', 'pending', false, today],
        [3, '07:00:00', 3.0, 'Pelet Starter', 'completed', true, today],
        [3, '13:00:00', 3.0, 'Pelet Starter', 'completed', true, today],
        [3, '19:00:00', 3.0, 'Pelet Starter', 'pending', false, today],
        [1, '06:00:00', 5.5, 'Pelet Protein Tinggi', 'pending', false, tomorrowStr],
        [1, '12:00:00', 5.5, 'Pelet Protein Tinggi', 'pending', false, tomorrowStr],
        [1, '18:00:00', 5.5, 'Pelet Protein Tinggi', 'pending', false, tomorrowStr],
      ];
      
      for (const schedule of feedSchedules) {
        await this.pool.query(`
          INSERT INTO feed_schedules (pond_id, feed_time, amount_kg, feed_type, status, is_done, feed_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, schedule);
      }

      // Clear and recreate products
      console.log('📦 Refreshing products...');
      await this.pool.query('DELETE FROM products');
      
      const products = [
        [1, 'Pelet Protein Tinggi 32%', 'Pakan ikan nila dengan kandungan protein tinggi', 85000, 50.0, 'Pakan Ikan'],
        [1, 'Pelet Protein Sedang 28%', 'Pakan ikan nila dengan kandungan protein sedang', 75000, 75.0, 'Pakan Ikan'],
        [1, 'Pelet Starter 35%', 'Pakan khusus untuk benih ikan nila', 95000, 30.0, 'Pakan Ikan'],
        [1, 'Vitamin Ikan Premium', 'Suplemen vitamin untuk daya tahan ikan', 45000, 25.0, 'Suplemen'],
        [1, 'Probiotik Kolam', 'Bakteri baik untuk kualitas air kolam', 65000, 40.0, 'Perawatan Air']
      ];
      
      for (const product of products) {
        await this.pool.query(`
          INSERT INTO products (user_id, name, description, price, stock_kg, category)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, product);
      }

      console.log('✅ Safe database setup completed!');
      console.log('🔑 Login: admin@demo.com / password123');
      
    } catch (error) {
      console.error('❌ Safe setup failed:', error.message);
      throw error;
    }
  }

  async getStatus() {
    try {
      await this.connect();
      
      const tables = ['users', 'ponds', 'water_quality_logs', 'feed_schedules', 'products'];
      const status = {};
      
      for (const table of tables) {
        const result = await this.pool.query(`SELECT COUNT(*) FROM ${table}`);
        status[table] = parseInt(result.rows[0].count);
      }
      
      return status;
    } catch (error) {
      console.error('Error getting database status:', error.message);
      return null;
    }
  }
}

// CLI Interface
async function main() {
  const command = process.argv[2];
  const manager = new DatabaseManager();
  
  try {
    switch (command) {
      case 'setup':
        await manager.setupFresh();
        break;
      case 'setup-safe':
        await manager.setupSafe();
        break;
      case 'status':
        const status = await manager.getStatus();
        console.log('📊 Database Status:');
        Object.entries(status).forEach(([table, count]) => {
          console.log(`   ${table}: ${count} records`);
        });
        break;
      default:
        console.log('🔧 Database Manager Commands:');
        console.log('   node manager.js setup      - Fresh setup');
        console.log('   node manager.js setup-safe - Safe setup');
        console.log('   node manager.js status     - Show status');
    }
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  } finally {
    await manager.disconnect();
  }
}

// Export for programmatic use
module.exports = DatabaseManager;

// Run CLI if called directly
if (require.main === module) {
  main();
}