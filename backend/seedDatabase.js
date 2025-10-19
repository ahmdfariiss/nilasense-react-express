const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'nilasense_db', // Fixed: DB_DATABASE instead of DB_NAME
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Read the seed SQL file
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seedData.sql'), 'utf8');
    
    // Execute the seed SQL
    await pool.query(seedSQL);
    
    console.log('✅ Database seeded successfully!');
    console.log('📊 Sample data added:');
    console.log('   - 2 users (admin@demo.com, user@demo.com)');
    console.log('   - 3 ponds with sample names');
    console.log('   - 7 days of water quality logs');
    console.log('   - Feed schedules for all ponds');
    console.log('   - 5 sample products');
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Admin: admin@demo.com / password123');
    console.log('   User:  user@demo.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };