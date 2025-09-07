const { Artwork } = require('../models');

const artworks = [
  { id: 'ART-001', title: 'Wo ist das Werk App', artist: 'Unknown', warehouse: 'Prag to depo', value: 10000 },
  { id: 'ART-002', title: 'Missing? Ja/nein', artist: 'Unknown', warehouse: 'Hodonin Bank', value: 15000 },
  { id: 'ART-003', title: 'Seit: automatische Datierung', artist: 'Unknown', warehouse: 'Hodonin Hala', value: 12000 },
  { id: 'ART-004', title: 'Prag to depo', artist: 'Unknown', warehouse: 'Prag to depo', value: 8000 },
  { id: 'ART-005', title: 'Hodonin Bank', artist: 'Unknown', warehouse: 'Hodonin Bank', value: 20000 },
  { id: 'ART-006', title: 'Hodonin Hala', artist: 'Unknown', warehouse: 'Hodonin Hala', value: 18000 },
  { id: 'ART-007', title: 'Zürich Lessing', artist: 'Unknown', warehouse: 'Zürich Lessing', value: 25000 },
  { id: 'ART-008', title: 'Zürich Wädenswil', artist: 'Unknown', warehouse: 'Zürich Wädenswil', value: 22000 },
  { id: 'ART-009', title: 'Anderswo', artist: 'Unknown', warehouse: 'Anderswo', value: 5000 },
  { id: 'ART-010', title: 'Raum Nr.', artist: 'Unknown', warehouse: 'Prag to depo', value: 3000 },
  { id: 'ART-011', title: 'Schrank nr.', artist: 'Unknown', warehouse: 'Hodonin Bank', value: 4000 },
  { id: 'ART-012', title: 'Regal nr.', artist: 'Unknown', warehouse: 'Hodonin Hala', value: 6000 },
  { id: 'ART-013', title: 'Kiste nr.', artist: 'Unknown', warehouse: 'Zürich Lessing', value: 7000 }
];

const addArtworks = async () => {
  try {
    console.log('🔄 Adding artworks...');
    
    // Clear existing artworks
    await Artwork.destroy({ where: {} });
    console.log('🗑️ Cleared existing artworks');
    
    // Add new artworks
    for (const artworkData of artworks) {
      await Artwork.create({
        ...artworkData,
        floor: 1,
        shelf: 1,
        box: 1,
        folder: 1,
        date_added: new Date(),
        last_moved: new Date(),
        category: 'Painting',
        medium: 'Oil on Canvas',
        condition: 'Excellent',
        status: 'In Storage'
      });
      console.log(`✅ Added: ${artworkData.title}`);
    }
    
    console.log(`🎉 Successfully added ${artworks.length} artworks`);
    
  } catch (error) {
    console.error('❌ Error adding artworks:', error);
  } finally {
    process.exit(0);
  }
};

addArtworks();
