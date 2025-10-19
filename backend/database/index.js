/**
 * Database Management Index
 * Centralized access to all database operations
 */

const { seedDatabase } = require('./scripts/seedDatabase');
const { updateFeedDatabase } = require('./scripts/updateFeedDatabase');
const { setupDatabase } = require('./scripts/setupDatabase');
const { setupDatabaseSafe } = require('./scripts/setupDatabaseSafe');

module.exports = {
  // Seed operations
  seedDatabase,
  
  // Update operations
  updateFeedDatabase,
  
  // Setup operations
  setupDatabase,
  setupDatabaseSafe,
  
  // Migration runner (future enhancement)
  runMigrations: async () => {
    console.log('🔄 Migration runner - Coming soon!');
  },
  
  // Seed runner (future enhancement)
  runSeeds: async () => {
    console.log('🌱 Seed runner - Coming soon!');
  }
};