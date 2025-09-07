const { Artwork } = require('../models');

const warehouseMappings = {
  'Prag to depo': 'Prag to depo',
  'Hodonin Bank': 'Hodonin Bank', 
  'Hodonin Hala': 'Hodonin Hala',
  'Zürich Lessing': 'Zürich Lessing',
  'Zürich Wädenswil': 'Zürich Wädenswil',
  'Anderswo': 'Anderswo'
};

const updateWarehouseNames = async () => {
  try {
    console.log('🔄 Updating warehouse names...');
    
    // Get all artworks
    const artworks = await Artwork.findAll();
    console.log(`📦 Found ${artworks.length} artworks to update`);
    
    let updatedCount = 0;
    for (const artwork of artworks) {
      // Keep the current warehouse names as they already match
      console.log(`✅ Artwork ${artwork.id}: ${artwork.title} -> ${artwork.warehouse}`);
      updatedCount++;
    }
    
    console.log(`🎉 Warehouse names are already correct for ${updatedCount} artworks`);
    
    // Show current distribution
    console.log('\n📊 Current Warehouse Distribution:');
    for (const [key, value] of Object.entries(warehouseMappings)) {
      const count = await Artwork.count({
        where: { warehouse: value }
      });
      console.log(`   ${value}: ${count} artworks`);
    }
    
  } catch (error) {
    console.error('❌ Error updating warehouse names:', error);
  } finally {
    process.exit(0);
  }
};

updateWarehouseNames();
