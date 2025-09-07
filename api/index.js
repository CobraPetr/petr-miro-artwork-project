const express = require('express');
const cors = require('cors');
const { Artwork, Movement } = require('../src/models');
const { Op } = require('sequelize');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API server is running' });
});

// Get all artworks
app.get('/api/artworks', async (req, res) => {
  try {
    const artworks = await Artwork.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

// Get artworks by location
app.get('/api/artworks/location', async (req, res) => {
  try {
    const { warehouse, floor, shelf, box, folder } = req.query;
    
    const whereClause = {};
    if (warehouse) whereClause.warehouse = warehouse;
    if (floor) whereClause.floor = floor;
    if (shelf) whereClause.shelf = shelf;
    if (box) whereClause.box = box;
    if (folder) whereClause.folder = folder;

    const artworks = await Artwork.findAll({
      where: whereClause,
      order: [['title', 'ASC']],
    });
    
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks by location:', error);
    res.status(500).json({ error: 'Failed to fetch artworks by location' });
  }
});

// Search artworks
app.get('/api/artworks/search', async (req, res) => {
  try {
    const { term, category, status, minValue, maxValue } = req.query;
    
    const whereClause = {};
    
    if (term) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${term}%` } },
        { artist: { [Op.iLike]: `%${term}%` } },
        { description: { [Op.iLike]: `%${term}%` } },
      ];
    }
    
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (minValue) whereClause.value = { [Op.gte]: parseInt(minValue) };
    if (maxValue) {
      whereClause.value = whereClause.value 
        ? { ...whereClause.value, [Op.lte]: parseInt(maxValue) }
        : { [Op.lte]: parseInt(maxValue) };
    }

    const artworks = await Artwork.findAll({
      where: whereClause,
      order: [['title', 'ASC']],
    });
    
    res.json(artworks);
  } catch (error) {
    console.error('Error searching artworks:', error);
    res.status(500).json({ error: 'Failed to search artworks' });
  }
});

// Get single artwork
app.get('/api/artworks/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    res.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    res.status(500).json({ error: 'Failed to fetch artwork' });
  }
});

// Update artwork location (move artwork)
app.put('/api/artworks/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { warehouse, floor, shelf, box, folder, notes, movedBy } = req.body;
    
    const artwork = await Artwork.findByPk(id);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    // Create movement record
    const movementId = `MOV-${Date.now()}`;
    await Movement.create({
      id: movementId,
      artwork_id: id,
      artwork_title: artwork.title,
      from_warehouse: artwork.warehouse,
      from_floor: artwork.floor,
      from_shelf: artwork.shelf,
      from_box: artwork.box,
      from_folder: artwork.folder,
      to_warehouse: warehouse,
      to_floor: floor,
      to_shelf: shelf,
      to_box: box,
      to_folder: folder,
      moved_by: movedBy || 'System',
      notes: notes || '',
      timestamp: new Date(),
    });

    // Update artwork location
    await artwork.update({
      warehouse,
      floor,
      shelf,
      box,
      folder,
      last_moved: new Date(),
    });

    res.json({ message: 'Artwork moved successfully', artwork });
  } catch (error) {
    console.error('Error moving artwork:', error);
    res.status(500).json({ error: 'Failed to move artwork' });
  }
});

// Create new artwork
app.post('/api/artworks', async (req, res) => {
  try {
    const artworkData = req.body;
    
    // Generate unique ID if not provided
    if (!artworkData.id) {
      artworkData.id = `ART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Set default values for required fields
    const artwork = await Artwork.create({
      ...artworkData,
      date_added: new Date(),
      last_moved: new Date(),
    });
    
    res.status(201).json({ message: 'Artwork created successfully', artwork });
  } catch (error) {
    console.error('Error creating artwork:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ error: 'Failed to create artwork' });
  }
});

// Update artwork details
app.put('/api/artworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const artwork = await Artwork.findByPk(id);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    
    // Don't allow updating the ID or creation date
    delete updateData.id;
    delete updateData.date_added;
    
    await artwork.update(updateData);
    
    res.json({ message: 'Artwork updated successfully', artwork });
  } catch (error) {
    console.error('Error updating artwork:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ error: 'Failed to update artwork' });
  }
});

// Get movement history
app.get('/api/movements', async (req, res) => {
  try {
    const { artworkId } = req.query;
    
    const whereClause = artworkId ? { artwork_id: artworkId } : {};
    
    const movements = await Movement.findAll({
      where: whereClause,
      order: [['timestamp', 'DESC']],
      limit: 100,
    });
    
    res.json(movements);
  } catch (error) {
    console.error('Error fetching movements:', error);
    res.status(500).json({ error: 'Failed to fetch movements' });
  }
});

// Get simple analytics data
app.get('/api/analytics', async (req, res) => {
  try {
    const totalArtworks = await Artwork.count();
    const totalValue = await Artwork.sum('value');

    res.json({
      summary: {
        totalArtworks,
        totalValue: totalValue || 0,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;

// Test database connection before starting server
const { testConnection } = require('../src/config/database');

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Database connection failed. Server will not start.');
      process.exit(1);
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🎨 Artworks endpoint: http://localhost:${PORT}/api/artworks`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
