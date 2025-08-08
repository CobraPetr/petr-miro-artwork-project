const express = require('express');
const cors = require('cors');
const { Artwork, Movement } = require('../models');
const { Op } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 5000;

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

// Bulk move artworks
app.put('/api/artworks/bulk-move', async (req, res) => {
  try {
    const { artworkIds, newLocation, notes = '', movedBy = 'User' } = req.body;
    
    if (!artworkIds || !Array.isArray(artworkIds) || artworkIds.length === 0) {
      return res.status(400).json({ error: 'artworkIds array is required' });
    }
    
    if (!newLocation || !newLocation.warehouse || !newLocation.floor || 
        !newLocation.shelf || !newLocation.box || !newLocation.folder) {
      return res.status(400).json({ error: 'Complete location (warehouse, floor, shelf, box, folder) is required' });
    }
    
    const results = [];
    
    // Process all moves in a transaction for consistency
    await Artwork.sequelize.transaction(async (transaction) => {
      for (const artworkId of artworkIds) {
        const artwork = await Artwork.findByPk(artworkId, { transaction });
        
        if (!artwork) {
          results.push({ artworkId, success: false, error: 'Artwork not found' });
          continue;
        }
        
        // Create movement record
        const movementId = `MOV-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        await Movement.create({
          id: movementId,
          artwork_id: artworkId,
          from_warehouse: artwork.warehouse,
          from_floor: artwork.floor,
          from_shelf: artwork.shelf,
          from_box: artwork.box,
          from_folder: artwork.folder,
          to_warehouse: newLocation.warehouse,
          to_floor: newLocation.floor,
          to_shelf: newLocation.shelf,
          to_box: newLocation.box,
          to_folder: newLocation.folder,
          timestamp: new Date(),
          notes,
          moved_by: movedBy,
        }, { transaction });
        
        // Update artwork location
        await artwork.update({
          warehouse: newLocation.warehouse,
          floor: newLocation.floor,
          shelf: newLocation.shelf,
          box: newLocation.box,
          folder: newLocation.folder,
          last_moved: new Date(),
        }, { transaction });
        
        results.push({ artworkId, success: true });
      }
    });
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    res.json({ 
      message: `Bulk move completed: ${successCount} successful, ${failureCount} failed`,
      results,
      summary: { successCount, failureCount }
    });
  } catch (error) {
    console.error('Error in bulk move:', error);
    res.status(500).json({ error: 'Failed to bulk move artworks' });
  }
});

// Delete artwork
app.delete('/api/artworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const artwork = await Artwork.findByPk(id);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    
    // Also delete associated movement history
    await Movement.destroy({ where: { artwork_id: id } });
    await artwork.destroy();
    
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ error: 'Failed to delete artwork' });
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

// Advanced reporting endpoints

// Get valuation report
app.get('/api/reports/valuation', async (req, res) => {
  try {
    const { minValue, maxValue, category, status } = req.query;
    
    const whereClause = {};
    if (minValue) whereClause.value = { [Op.gte]: parseInt(minValue) };
    if (maxValue) {
      whereClause.value = whereClause.value 
        ? { ...whereClause.value, [Op.lte]: parseInt(maxValue) }
        : { [Op.lte]: parseInt(maxValue) };
    }
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;

    const artworks = await Artwork.findAll({
      where: whereClause,
      order: [['value', 'DESC']],
      attributes: ['id', 'title', 'artist', 'category', 'value', 'condition', 'status', 'warehouse', 'floor', 'shelf', 'box', 'folder']
    });

    const totalValue = artworks.reduce((sum, artwork) => sum + (parseFloat(artwork.value) || 0), 0);
    const averageValue = artworks.length > 0 ? totalValue / artworks.length : 0;

    res.json({
      report: 'valuation',
      filters: { minValue, maxValue, category, status },
      summary: {
        totalArtworks: artworks.length,
        totalValue,
        averageValue: Math.round(averageValue),
        highestValue: artworks[0]?.value || 0,
        lowestValue: artworks[artworks.length - 1]?.value || 0,
      },
      artworks,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating valuation report:', error);
    res.status(500).json({ error: 'Failed to generate valuation report' });
  }
});

// Get movement activity report
app.get('/api/reports/movements', async (req, res) => {
  try {
    const { startDate, endDate, artworkId, warehouseId } = req.query;
    
    const whereClause = {};
    if (startDate) whereClause.timestamp = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      whereClause.timestamp = whereClause.timestamp 
        ? { ...whereClause.timestamp, [Op.lte]: new Date(endDate) }
        : { [Op.lte]: new Date(endDate) };
    }
    if (artworkId) whereClause.artwork_id = artworkId;

    const movements = await Movement.findAll({
      where: whereClause,
      order: [['timestamp', 'DESC']],
      limit: 500
    });

    // Filter by warehouse if specified
    let filteredMovements = movements;
    if (warehouseId) {
      filteredMovements = movements.filter(movement => 
        movement.to_warehouse == warehouseId || movement.from_warehouse == warehouseId
      );
    }

    // Activity analysis
    const dailyActivity = {};
    filteredMovements.forEach(movement => {
      const date = movement.timestamp.toISOString().split('T')[0];
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });

    const mostActiveDay = Object.entries(dailyActivity)
      .sort(([,a], [,b]) => b - a)[0];

    res.json({
      report: 'movements',
      filters: { startDate, endDate, artworkId, warehouseId },
      summary: {
        totalMovements: filteredMovements.length,
        dateRange: {
          start: startDate || filteredMovements[filteredMovements.length - 1]?.timestamp,
          end: endDate || filteredMovements[0]?.timestamp
        },
        mostActiveDay: mostActiveDay ? {
          date: mostActiveDay[0],
          movements: mostActiveDay[1]
        } : null,
      },
      movements: filteredMovements,
      dailyActivity,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating movements report:', error);
    res.status(500).json({ error: 'Failed to generate movements report' });
  }
});

// Get storage optimization report
app.get('/api/reports/storage', async (req, res) => {
  try {
    // Warehouse utilization analysis
    const warehouseUtilization = await Artwork.findAll({
      attributes: [
        'warehouse',
        'floor',
        'shelf',
        [Artwork.sequelize.fn('COUNT', '*'), 'artworks_count'],
        [Artwork.sequelize.fn('SUM', Artwork.sequelize.col('value')), 'total_value'],
      ],
      group: ['warehouse', 'floor', 'shelf'],
      order: [['warehouse', 'ASC'], ['floor', 'ASC'], ['shelf', 'ASC']],
      raw: true,
    });

    // Calculate utilization percentages (assuming max 50 artworks per shelf)
    const maxArtworksPerShelf = 50;
    const utilizationWithPercentages = warehouseUtilization.map(shelf => ({
      ...shelf,
      utilization_percentage: Math.round((shelf.artworks_count / maxArtworksPerShelf) * 100),
      value_density: Math.round((shelf.total_value || 0) / shelf.artworks_count),
    }));

    // Find empty locations and overcrowded areas
    const emptyLocations = utilizationWithPercentages.filter(shelf => shelf.artworks_count === 0);
    const overcrowdedLocations = utilizationWithPercentages.filter(shelf => shelf.utilization_percentage > 80);
    const underutilizedLocations = utilizationWithPercentages.filter(shelf => 
      shelf.utilization_percentage > 0 && shelf.utilization_percentage < 30
    );

    // High-value concentration analysis
    const highValueShelves = utilizationWithPercentages
      .filter(shelf => shelf.value_density > 50000)
      .sort((a, b) => b.value_density - a.value_density);

    res.json({
      report: 'storage_optimization',
      summary: {
        totalShelves: utilizationWithPercentages.length,
        emptyShelvesCount: emptyLocations.length,
        overcrowdedShelvesCount: overcrowdedLocations.length,
        underutilizedShelvesCount: underutilizedLocations.length,
        averageUtilization: Math.round(
          utilizationWithPercentages.reduce((sum, shelf) => sum + shelf.utilization_percentage, 0) / 
          utilizationWithPercentages.length
        ),
      },
      utilization: utilizationWithPercentages,
      recommendations: {
        emptyLocations: emptyLocations.slice(0, 10),
        overcrowdedLocations,
        underutilizedLocations: underutilizedLocations.slice(0, 10),
        highValueConcentration: highValueShelves.slice(0, 10),
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating storage report:', error);
    res.status(500).json({ error: 'Failed to generate storage report' });
  }
});

// Get collection insights report
app.get('/api/reports/insights', async (req, res) => {
  try {
    // Acquisition patterns (by year)
    const acquisitionsByYear = await Artwork.findAll({
      attributes: [
        'year',
        [Artwork.sequelize.fn('COUNT', '*'), 'acquisitions'],
        [Artwork.sequelize.fn('SUM', Artwork.sequelize.col('value')), 'total_investment'],
      ],
      where: {
        year: { [Op.not]: null }
      },
      group: ['year'],
      order: [['year', 'DESC']],
      limit: 20,
      raw: true,
    });

    // Medium analysis
    const mediumStats = await Artwork.findAll({
      attributes: [
        'medium',
        [Artwork.sequelize.fn('COUNT', '*'), 'count'],
        [Artwork.sequelize.fn('AVG', Artwork.sequelize.col('value')), 'average_value'],
      ],
      group: ['medium'],
      order: [[Artwork.sequelize.fn('COUNT', '*'), 'DESC']],
      limit: 15,
      raw: true,
    });

    // Condition trends
    const conditionByCategory = await Artwork.findAll({
      attributes: [
        'category',
        'condition',
        [Artwork.sequelize.fn('COUNT', '*'), 'count'],
      ],
      group: ['category', 'condition'],
      order: [['category', 'ASC'], ['condition', 'ASC']],
      raw: true,
    });

    // Recent activity analysis
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentActivity = {
      newArtworks: await Artwork.count({
        where: { date_added: { [Op.gte]: thirtyDaysAgo } }
      }),
      recentMovements: await Movement.count({
        where: { timestamp: { [Op.gte]: thirtyDaysAgo } }
      }),
      mostMovedArtworks: await Movement.findAll({
        attributes: [
          'artwork_id',
          [Artwork.sequelize.fn('COUNT', '*'), 'move_count'],
        ],
        where: { timestamp: { [Op.gte]: thirtyDaysAgo } },
        group: ['artwork_id'],
        order: [[Artwork.sequelize.fn('COUNT', '*'), 'DESC']],
        limit: 5,
        raw: true,
      }),
    };

    res.json({
      report: 'collection_insights',
      acquisitionTrends: acquisitionsByYear,
      mediumAnalysis: mediumStats,
      conditionTrends: conditionByCategory,
      recentActivity,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating insights report:', error);
    res.status(500).json({ error: 'Failed to generate insights report' });
  }
});

// FileMaker Export Endpoints
const FileMakerExporter = require('../scripts/exportToFileMaker');

app.post('/api/export/filemaker', async (req, res) => {
  try {
    const { type = 'all', hours = 24 } = req.body;
    const exporter = new FileMakerExporter();
    
    let result;
    if (type === 'changes') {
      result = await exporter.exportRecentChanges(hours);
    } else {
      result = await exporter.exportAllArtworks();
    }
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Export completed successfully',
        stats: result.stats
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Export failed'
      });
    }
  } catch (error) {
    console.error('Export API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/export/status', async (req, res) => {
  try {
    const exporter = new FileMakerExporter();
    const report = await exporter.generateSyncReport();
    res.json(report);
  } catch (error) {
    console.error('Status API error:', error);
    res.status(500).json({
      error: 'Failed to generate status report'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;