const { Artwork, sequelize } = require('../models/index');

async function updateArtworkLocations() {
  try {
    console.log('🚀 Starting location data update...');
    
    // Get all artworks
    const artworks = await Artwork.findAll();
    console.log(`📦 Found ${artworks.length} artworks to update`);

    let updateCount = 0;

    for (const artwork of artworks) {
      // Generate random but realistic location data (matching database constraints)
      const warehouse = Math.floor(Math.random() * 4) + 1; // 1-4
      const floor = Math.floor(Math.random() * 3) + 1; // 1-3
      const shelf = Math.floor(Math.random() * 30) + 1; // 1-30
      const box = Math.floor(Math.random() * 10) + 1; // 1-10
      const folder = Math.floor(Math.random() * 5) + 1; // 1-5

      // Update the artwork location
      await artwork.update({
        warehouse: warehouse,
        floor: floor,
        shelf: shelf,
        box: box,
        folder: folder
      });

      updateCount++;
      console.log(`✅ Updated ${artwork.title} → Lager ${warehouse}, Etage ${floor}, Regal ${shelf}, Box ${box}, Ordner ${folder}`);
    }

    console.log(`🎉 Successfully updated ${updateCount} artworks with hierarchical location data!`);
    console.log('📍 Locations distributed across:');
    console.log('   - 4 Warehouses (Lagerhäuser)');
    console.log('   - 3 Floors per warehouse (Etagen)');
    console.log('   - 30 Shelves per floor (Regale)');
    console.log('   - 10 Boxes per shelf (Boxen)');
    console.log('   - 5 Folders per box (Ordner)');

  } catch (error) {
    console.error('❌ Error updating location data:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the update
updateArtworkLocations();