const { Artwork } = require('../models');

const sampleArtworks = [
  {
    id: 'ART-2024-001',
    title: 'Sunset Over the Pacific',
    artist: 'Maria Gonzalez',
    category: 'painting',
    year: 2023,
    medium: 'Oil on canvas',
    dimensions: '36x48 inches',
    value: 25000.00,
    condition: 'excellent',
    status: 'available',
    warehouse: 'Zürich Lessing',
    floor: 1,
    shelf: 1,
    box: 1,
    folder: 1,
    description: 'A breathtaking portrayal of the Pacific coastline at sunset, featuring vibrant oranges and purples reflecting on the water.',
    provenance: 'Acquired from artist\'s studio, 2024',
    notes: 'Featured in Pacific Coast Art Exhibition 2023',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    tags: ['landscape', 'ocean', 'contemporary', 'oil'],
    date_added: new Date('2024-01-15T10:30:00.000Z'),
    last_moved: new Date('2024-01-15T10:30:00.000Z')
  },
  {
    id: 'ART-2024-002',
    title: 'Urban Fragments',
    artist: 'David Chen',
    category: 'mixed-media',
    year: 2022,
    medium: 'Acrylic and collage on canvas',
    dimensions: '24x30 inches',
    value: 18500.00,
    condition: 'excellent',
    status: 'available',
    warehouse: 'Zürich Lessing',
    floor: 2,
    shelf: 2,
    box: 2,
    folder: 2,
    description: 'An abstract representation of city life through layered textures and geometric forms.',
    provenance: 'Private collection, New York',
    notes: 'Part of the Urban Rhythms series',
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    tags: ['abstract', 'urban', 'contemporary', 'mixed-media'],
    date_added: new Date('2024-01-20T14:15:00.000Z'),
    last_moved: new Date('2024-01-20T14:15:00.000Z')
  },
  {
    id: 'ART-2024-003',
    title: 'Forest Whispers',
    artist: 'Elena Kozlova',
    category: 'photography',
    year: 2023,
    medium: 'Fine art photography on archival paper',
    dimensions: '20x30 inches',
    value: 8500.00,
    condition: 'mint',
    status: 'available',
    warehouse: 'Zürich Lessing',
    floor: 3,
    shelf: 3,
    box: 3,
    folder: 3,
    description: 'A hauntingly beautiful capture of morning light filtering through ancient forest canopy.',
    provenance: 'Artist\'s collection, limited edition 5/25',
    notes: 'Signed and numbered by artist',
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    tags: ['nature', 'photography', 'forest', 'limited-edition'],
    date_added: new Date('2024-02-01T09:45:00.000Z'),
    last_moved: new Date('2024-02-01T09:45:00.000Z')
  },
  {
    id: 'ART-2024-004',
    title: 'Architectural Dreams',
    artist: 'James Morrison',
    category: 'digital-art',
    year: 2024,
    medium: 'Digital print on metal',
    dimensions: '40x60 inches',
    value: 12000.00,
    condition: 'excellent',
    status: 'on-loan',
    warehouse: 'Zürich Lessing',
    floor: 4,
    shelf: 4,
    box: 4,
    folder: 4,
    description: 'A futuristic interpretation of modern architecture blending reality with digital imagination.',
    provenance: 'Gallery acquisition, 2024',
    notes: 'Currently on loan to Modern Art Museum',
    image_url: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400&h=300&fit=crop',
    tags: ['architecture', 'digital', 'contemporary', 'geometric'],
    date_added: new Date('2024-02-10T16:20:00.000Z'),
    last_moved: new Date('2024-02-15T11:30:00.000Z')
  },
  {
    id: 'ART-2024-005',
    title: 'Ocean\'s Memory',
    artist: 'Sofia Andersson',
    category: 'sculpture',
    year: 2023,
    medium: 'Bronze and glass',
    dimensions: '18x24x12 inches',
    value: 35000.00,
    condition: 'excellent',
    status: 'available',
    warehouse: 'Zürich Lessing',
    floor: 5,
    shelf: 5,
    box: 5,
    folder: 5,
    description: 'An abstract sculpture capturing the fluid movement and memory of ocean waves.',
    provenance: 'Commissioned work, 2023',
    notes: 'Requires climate-controlled environment',
    image_url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop',
    tags: ['sculpture', 'bronze', 'ocean', 'contemporary'],
    date_added: new Date('2024-02-20T13:00:00.000Z'),
    last_moved: new Date('2024-02-20T13:00:00.000Z')
  }
];

const importSampleArtworks = async () => {
  try {
    console.log('🔄 Importing sample artworks...');
    
    // Clear existing artworks
    await Artwork.destroy({ where: {} });
    console.log('🗑️ Cleared existing artworks');
    
    // Import sample artworks
    await Artwork.bulkCreate(sampleArtworks);
    console.log(`✅ Successfully imported ${sampleArtworks.length} sample artworks`);
    
    // Show distribution
    console.log('\n📊 Location Distribution:');
    for (let warehouse = 1; warehouse <= 3; warehouse++) {
      const count = await Artwork.count({ where: { warehouse } });
      console.log(`   Warehouse ${warehouse}: ${count} artworks`);
    }
    
  } catch (error) {
    console.error('❌ Error importing sample artworks:', error);
  } finally {
    process.exit(0);
  }
};

importSampleArtworks();
