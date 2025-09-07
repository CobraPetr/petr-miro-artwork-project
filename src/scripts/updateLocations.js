const { Artwork } = require('../models');

const locations = [
  { warehouse: 'Prag to depo', floor: 1, shelf: 1, box: 1, folder: 1 },
  { warehouse: 'Hodonin Bank', floor: 1, shelf: 2, box: 1, folder: 1 },
  { warehouse: 'Hodonin Hala', floor: 1, shelf: 3, box: 1, folder: 1 },
  { warehouse: 'Zürich Lessing', floor: 1, shelf: 4, box: 1, folder: 1 },
  { warehouse: 'Zürich Wädenswil', floor: 1, shelf: 5, box: 1, folder: 1 },
  { warehouse: 'Anderswo', floor: 1, shelf: 6, box: 1, folder: 1 }
];

const updateArtworkLocations = async () => {
  try {
    console.log('🔄 Starting artwork location update...');
    
    // Get all artworks
    const artworks = await Artwork.findAll();
    console.log(`📦 Found ${artworks.length} artworks to update`);
    
    // Randomly assign locations
    let updatedCount = 0;
    for (const artwork of artworks) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      await artwork.update({
        warehouse: randomLocation.warehouse,
        floor: randomLocation.floor,
        shelf: randomLocation.shelf,
        box: randomLocation.box,
        folder: randomLocation.folder,
        last_moved: new Date()
      });
      
      updatedCount++;
      console.log(`✅ Updated artwork ${artwork.id}: ${artwork.title} -> ${randomLocation.warehouse}`);
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} artworks with new locations`);
    
    // Show distribution summary
    console.log('\n📊 Location Distribution:');
    for (const location of locations) {
      const count = await Artwork.count({
        where: { warehouse: location.warehouse }
      });
      console.log(`   ${location.warehouse}: ${count} artworks`);
    }
    
  } catch (error) {
    console.error('❌ Error updating artwork locations:', error);
  } finally {
    process.exit(0);
  }
};

updateArtworkLocations();
