const { testConnection } = require('../config/database');
const { syncDatabase, seedDatabase } = require('../models');

const setupDatabase = async () => {
  console.log('🚀 Starting database setup...');
  
  try {
    // Test connection
    console.log('📡 Testing PostgreSQL connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Database connection failed. Please check your PostgreSQL configuration.');
      process.exit(1);
    }

    // Sync models
    console.log('🔄 Synchronizing database models...');
    const isSynced = await syncDatabase();
    
    if (!isSynced) {
      console.error('❌ Database synchronization failed.');
      process.exit(1);
    }

    // Seed data
    console.log('🌱 Seeding initial data...');
    const isSeeded = await seedDatabase();
    
    if (!isSeeded) {
      console.log('⚠️ Seeding completed with warnings.');
    }

    console.log('✅ Database setup completed successfully!');
    console.log('📊 Your artwork management system is now using PostgreSQL.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;