const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'nilasense_db', // Fixed: DB_DATABASE instead of DB_NAME
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function updateFeedDatabase() {
  try {
    console.log('🔄 Updating feed schedules database schema and data...');
    
    // Read the update SQL file
    const updateSQL = fs.readFileSync(path.join(__dirname, '../migrations/002_feed_schema_update.sql'), 'utf8');
    
    // Execute the update SQL
    await pool.query(updateSQL);
    
    console.log('✅ Feed schedules database updated successfully!');
    console.log('📊 Updated data:');
    console.log('   - Added feed_type, status, created_at columns');
    console.log('   - Updated existing records for consistency');
    console.log('   - Added sample feed schedules for today, tomorrow, and yesterday');
    console.log('   - 9 schedules for today (3 per pond)');
    console.log('   - 6 schedules for tomorrow (testing)');
    console.log('   - 3 schedules for yesterday (history)');
    console.log('');
    console.log('🎯 Ready for Tahap 3 testing!');
    
  } catch (error) {
    console.error('❌ Error updating feed database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  updateFeedDatabase();
}

module.exports = { updateFeedDatabase };