const fs = require('fs');
const csv = require('csv-parser');
const { Artwork } = require('../models');

const locations = [
  'Prag to depo',
  'Hodonin Bank', 
  'Hodonin Hala',
  'Zürich Lessing',
  'Zürich Wädenswil',
  'Anderswo'
];

const importCSVArtworks = async () => {
  try {
    console.log('🔄 Starting CSV import...');
    
    // Clear existing artworks
    await Artwork.destroy({ where: {} });
    console.log('🗑️ Cleared existing artworks');
    
    const artworks = [];
    const csvPath = 'C:\\Users\\pterv\\Desktop\\Projects\\art in motion 2\\tichyoceanserverartworks csv\\artworks.exel.6.csv';
    
    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv({ headers: false }))
        .on('data', (row) => {
          const values = Object.values(row);
          if (values.length > 0 && values[0]) {
            // Extract data from CSV columns
            const id = values[0] ? `ART-${values[0]}` : `ART-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
            const title = values[2] ? `Artwork ${values[2]}` : `Untitled ${id}`;
            const artist = values[19] || 'Unknown Artist';
            const value = values[1] ? parseFloat(values[1]) || 0 : 0;
            const dimensions = values[3] && values[4] ? `${values[3]} x ${values[4]}` : 'Unknown';
            const year = values[20] ? new Date(values[20]).getFullYear() : new Date().getFullYear();
            
            // Randomly assign location
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            
            artworks.push({
              id,
              title,
              artist,
              value,
              dimensions,
              year,
              warehouse: randomLocation,
              floor: 1,
              shelf: 1,
              box: 1,
              folder: 1,
              category: 'Painting',
              medium: 'Oil on Canvas',
              condition: 'Excellent',
              status: 'In Storage',
              date_added: new Date(),
              last_moved: new Date()
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`📦 Found ${artworks.length} artworks to import`);
    
    // Import artworks in batches
    const batchSize = 100;
    for (let i = 0; i < artworks.length; i += batchSize) {
      const batch = artworks.slice(i, i + batchSize);
      await Artwork.bulkCreate(batch);
      console.log(`✅ Imported batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(artworks.length/batchSize)}`);
    }
    
    console.log(`🎉 Successfully imported ${artworks.length} artworks`);
    
    // Show distribution
    console.log('\n📊 Location Distribution:');
    for (const location of locations) {
      const count = await Artwork.count({ where: { warehouse: location } });
      console.log(`   ${location}: ${count} artworks`);
    }
    
  } catch (error) {
    console.error('❌ Error importing artworks:', error);
  } finally {
    process.exit(0);
  }
};

importCSVArtworks();
