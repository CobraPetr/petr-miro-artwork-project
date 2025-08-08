class ApiService {
  constructor() {
    // In production, don't try to connect to localhost
    const isProduction = process.env.NODE_ENV === 'production';
    this.baseURL = process.env.REACT_APP_API_URL || (isProduction ? null : 'http://localhost:5000/api');
  }

  async request(endpoint, options = {}) {
    // If no baseURL in production, immediately throw error to trigger demo mode
    if (!this.baseURL) {
      throw new Error('No API URL configured for production - using demo mode');
    }
    
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Artwork operations
  async getAllArtworks() {
    return this.request('/artworks');
  }

  async getArtworksByLocation(warehouse, floor, shelf, box, folder) {
    const params = new URLSearchParams();
    if (warehouse) params.append('warehouse', warehouse);
    if (floor) params.append('floor', floor);
    if (shelf) params.append('shelf', shelf);
    if (box) params.append('box', box);
    if (folder) params.append('folder', folder);
    
    return this.request(`/artworks/location?${params}`);
  }

  async searchArtworks(searchParams) {
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    return this.request(`/artworks/search?${params}`);
  }

  async getArtwork(id) {
    return this.request(`/artworks/${id}`);
  }

  async createArtwork(artworkData) {
    return this.request('/artworks', {
      method: 'POST',
      body: JSON.stringify(artworkData),
    });
  }

  async updateArtwork(id, updateData) {
    return this.request(`/artworks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteArtwork(id) {
    return this.request(`/artworks/${id}`, {
      method: 'DELETE',
    });
  }

  async moveArtwork(id, newLocation, notes = '', movedBy = 'User') {
    return this.request(`/artworks/${id}/move`, {
      method: 'PUT',
      body: JSON.stringify({
        ...newLocation,
        notes,
        movedBy,
      }),
    });
  }

  async bulkMoveArtworks(artworkIds, newLocation, notes = '', movedBy = 'User') {
    return this.request('/artworks/bulk-move', {
      method: 'PUT',
      body: JSON.stringify({
        artworkIds,
        newLocation,
        notes,
        movedBy,
      }),
    });
  }

  // Movement operations
  async getMovements(artworkId = null) {
    const params = artworkId ? `?artworkId=${artworkId}` : '';
    return this.request(`/movements${params}`);
  }

  // Analytics
  async getAnalytics() {
    return this.request('/analytics');
  }

  // Advanced reporting
  async getValuationReport(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    return this.request(`/reports/valuation?${params}`);
  }

  async getMovementReport(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    return this.request(`/reports/movements?${params}`);
  }

  async getStorageReport() {
    return this.request('/reports/storage');
  }

  async getInsightsReport() {
    return this.request('/reports/insights');
  }

  // Utility methods
  formatLocation(artwork) {
    return `W${artwork.warehouse}-F${artwork.floor}-S${artwork.shelf}-B${artwork.box}-F${artwork.folder}`;
  }

  generateLocationOptions() {
    return {
      warehouses: Array.from({ length: 5 }, (_, i) => i + 1),
      floors: Array.from({ length: 3 }, (_, i) => i + 1),
      shelves: Array.from({ length: 30 }, (_, i) => i + 1),
      boxes: Array.from({ length: 10 }, (_, i) => i + 1),
      folders: Array.from({ length: 5 }, (_, i) => i + 1),
    };
  }

  // Export to CSV (for FileMaker compatibility)
  async exportArtworksToCSV() {
    try {
      const artworks = await this.getAllArtworks();
      const movements = await this.getMovements();
      
      return {
        artworks: this.convertToCSV(artworks, 'artworks'),
        movements: this.convertToCSV(movements, 'movements'),
      };
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  convertToCSV(data, type) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let value = row[header];
          if (Array.isArray(value)) {
            value = value.join(';');
          }
          if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }

  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // FileMaker sync methods
  async exportToFileMaker(type = 'all', hours = 24) {
    return this.request('/export/filemaker', {
      method: 'POST',
      body: JSON.stringify({ type, hours })
    });
  }

  async getExportStatus() {
    return this.request('/export/status');
  }
}

const apiService = new ApiService();
export default apiService;