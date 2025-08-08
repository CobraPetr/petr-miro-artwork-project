const { sequelize } = require('../config/database');
const Artwork = require('./Artwork');
const Movement = require('./Movement');

// Define associations
Artwork.hasMany(Movement, {
  foreignKey: 'artwork_id',
  as: 'movements',
});

Movement.belongsTo(Artwork, {
  foreignKey: 'artwork_id',
  as: 'artwork',
});

// Sync database models
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database models synchronized successfully.');
    return true;
  } catch (error) {
    console.error('❌ Error synchronizing database models:', error);
    return false;
  }
};

// Seed initial data
const seedDatabase = async () => {
  try {
    // Check if data already exists
    const artworkCount = await Artwork.count();
    if (artworkCount > 0) {
      console.log('📊 Database already contains data, skipping seed.');
      return true;
    }

    // Load enhanced artworks data
    const fs = require('fs');
    const path = require('path');
    const artworksPath = path.join(__dirname, '../../public/artworks-enhanced.json');
    
    if (fs.existsSync(artworksPath)) {
      const artworksData = JSON.parse(fs.readFileSync(artworksPath, 'utf8'));
      
      // Transform JSON data to match database schema
      const transformedData = artworksData.map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist,
        category: artwork.category,
        year: artwork.year,
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        value: artwork.value,
        condition: artwork.condition,
        status: artwork.status,
        image_url: artwork.image_url,
        warehouse: artwork.warehouse,
        floor: artwork.floor,
        shelf: artwork.shelf,
        box: artwork.box,
        folder: artwork.folder,
        date_added: artwork.dateAdded,
        last_moved: artwork.lastMoved,
        tags: artwork.tags,
        description: artwork.description,
        provenance: artwork.provenance,
        notes: artwork.notes,
      }));

      await Artwork.bulkCreate(transformedData);
      console.log(`✅ Seeded ${transformedData.length} artworks into database.`);
      return true;
    } else {
      console.log('⚠️ No seed data file found.');
      return false;
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  Artwork,
  Movement,
  syncDatabase,
  seedDatabase,
};