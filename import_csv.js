const fs = require('fs');
const csv = require('csv-parser');
const { Artwork } = require('./src/models');

const locations = [
  'Prag to depo',
  'Hodonin Bank', 
  'Hodonin Hala',
  'Zürich Lessing',
  'Zürich Wädenswil',
  'Anderswo'
];

const importCSV = async () => {
  try {
    console.log('🔄 Starting CSV import...');
    
    // Clear existing artworks
    await Artwork.destroy({ where: {} });
    console.log('🗑️ Cleared existing artworks');
    
    const artworks = [];
    const csvPath = 'C:\\Users\\pterv\\Desktop\\Projects\\art in motion 2\\tichyoceanserverartworks csv\\artworks.exel.6.csv';
    
    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found at:', csvPath);
      return;
    }
    
    console.log('📁 Found CSV file, reading...');
    
    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv({ headers: false }))
        .on('data', (row) => {
          const values = Object.values(row);
          if (values.length > 0 && values[0] && values[0].trim() !== '') {
            const id = `ART-${values[0]}`;
            const title = values[2] ? `Artwork ${values[2]}` : `Untitled ${id}`;
            const artist = values[19] || 'Unknown Artist';
            const value = values[1] ? parseFloat(values[1]) || 0 : Math.floor(Math.random() * 50000) + 1000;
            const dimensions = values[3] && values[4] ? `${values[3]} x ${values[4]}` : 'Unknown';
            const year = values[20] ? new Date(values[20]).getFullYear() : 2020 + Math.floor(Math.random() * 4);
            
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

importCSV();
