import { Artwork, Movement } from '../models';
import { Op } from 'sequelize';

class DatabaseService {
  // Artwork operations
  static async getAllArtworks() {
    try {
      const artworks = await Artwork.findAll({
        order: [['created_at', 'DESC']],
      });
      return artworks.map(artwork => artwork.toJSON());
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
  }

  static async getArtworkById(id) {
    try {
      const artwork = await Artwork.findByPk(id, {
        include: [{
          model: Movement,
          as: 'movements',
          order: [['timestamp', 'DESC']],
          limit: 10,
        }],
      });
      return artwork ? artwork.toJSON() : null;
    } catch (error) {
      console.error('Error fetching artwork:', error);
      throw error;
    }
  }

  static async getArtworksByLocation(warehouse, floor, shelf, box, folder) {
    try {
      const artworks = await Artwork.findAll({
        where: {
          warehouse,
          floor,
          shelf,
          box,
          folder,
        },
        order: [['title', 'ASC']],
      });
      return artworks.map(artwork => artwork.toJSON());
    } catch (error) {
      console.error('Error fetching artworks by location:', error);
      throw error;
    }
  }

  static async searchArtworks(searchTerm, filters = {}) {
    try {
      const whereClause = {};

      // Apply search term
      if (searchTerm) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${searchTerm}%` } },
          { artist: { [Op.iLike]: `%${searchTerm}%` } },
          { id: { [Op.iLike]: `%${searchTerm}%` } },
          { tags: { [Op.contains]: [searchTerm.toLowerCase()] } },
        ];
      }

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        whereClause.category = filters.category;
      }
      if (filters.status && filters.status !== 'all') {
        whereClause.status = filters.status;
      }
      if (filters.condition && filters.condition !== 'all') {
        whereClause.condition = filters.condition;
      }

      const artworks = await Artwork.findAll({
        where: whereClause,
        order: [['title', 'ASC']],
      });
      
      return artworks.map(artwork => artwork.toJSON());
    } catch (error) {
      console.error('Error searching artworks:', error);
      throw error;
    }
  }

  static async createArtwork(artworkData) {
    try {
      const artwork = await Artwork.create(artworkData);
      return artwork.toJSON();
    } catch (error) {
      console.error('Error creating artwork:', error);
      throw error;
    }
  }

  static async updateArtwork(id, updateData) {
    try {
      const [updatedRowsCount] = await Artwork.update(updateData, {
        where: { id },
      });
      
      if (updatedRowsCount === 0) {
        throw new Error('Artwork not found');
      }

      const updatedArtwork = await Artwork.findByPk(id);
      return updatedArtwork.toJSON();
    } catch (error) {
      console.error('Error updating artwork:', error);
      throw error;
    }
  }

  static async moveArtwork(artworkId, newLocation, notes = '', movedBy = 'System') {
    try {
      // Get current artwork
      const artwork = await Artwork.findByPk(artworkId);
      if (!artwork) {
        throw new Error('Artwork not found');
      }

      const currentLocation = {
        warehouse: artwork.warehouse,
        floor: artwork.floor,
        shelf: artwork.shelf,
        box: artwork.box,
        folder: artwork.folder,
      };

      // Create movement record
      await Movement.create({
        artwork_id: artworkId,
        artwork_title: artwork.title,
        from_warehouse: currentLocation.warehouse,
        from_floor: currentLocation.floor,
        from_shelf: currentLocation.shelf,
        from_box: currentLocation.box,
        from_folder: currentLocation.folder,
        to_warehouse: newLocation.warehouse,
        to_floor: newLocation.floor,
        to_shelf: newLocation.shelf,
        to_box: newLocation.box,
        to_folder: newLocation.folder,
        moved_by: movedBy,
        notes,
      });

      // Update artwork location
      await artwork.update({
        ...newLocation,
        last_moved: new Date(),
      });

      return artwork.toJSON();
    } catch (error) {
      console.error('Error moving artwork:', error);
      throw error;
    }
  }

  // Movement operations
  static async getAllMovements() {
    try {
      const movements = await Movement.findAll({
        order: [['timestamp', 'DESC']],
      });
      return movements.map(movement => movement.toJSON());
    } catch (error) {
      console.error('Error fetching movements:', error);
      throw error;
    }
  }

  static async getMovementsByArtwork(artworkId) {
    try {
      const movements = await Movement.findAll({
        where: { artwork_id: artworkId },
        order: [['timestamp', 'DESC']],
      });
      return movements.map(movement => movement.toJSON());
    } catch (error) {
      console.error('Error fetching artwork movements:', error);
      throw error;
    }
  }

  // Analytics operations
  static async getAnalytics() {
    try {
      const totalArtworks = await Artwork.count();
      const totalValue = await Artwork.sum('value');
      
      const categoryDistribution = await Artwork.findAll({
        attributes: [
          'category',
          [Artwork.sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: ['category'],
        raw: true,
      });

      const statusDistribution = await Artwork.findAll({
        attributes: [
          'status',
          [Artwork.sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: ['status'],
        raw: true,
      });

      const warehouseDistribution = await Artwork.findAll({
        attributes: [
          'warehouse',
          [Artwork.sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: ['warehouse'],
        raw: true,
      });

      const recentMovements = await Movement.findAll({
        order: [['timestamp', 'DESC']],
        limit: 10,
      });

      return {
        totalArtworks,
        totalValue: totalValue || 0,
        averageValue: totalArtworks > 0 ? (totalValue || 0) / totalArtworks : 0,
        categoryDistribution: categoryDistribution.reduce((acc, item) => {
          acc[item.category] = parseInt(item.count);
          return acc;
        }, {}),
        statusDistribution: statusDistribution.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {}),
        warehouseDistribution: warehouseDistribution.reduce((acc, item) => {
          acc[`Warehouse ${item.warehouse}`] = parseInt(item.count);
          return acc;
        }, {}),
        recentMoves: recentMovements.map(movement => movement.toJSON()),
        occupancyRate: (totalArtworks / 22500) * 100,
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
}

export default DatabaseService;