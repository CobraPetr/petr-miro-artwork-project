import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import ApiService from '../services/ApiService';

const ArtworkContext = createContext();

export const useArtwork = () => {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error('useArtwork must be used within an ArtworkProvider');
  }
  return context;
};

export const ArtworkProvider = ({ children }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState({
    warehouse: null,
    floor: null,
    shelf: null,
    box: null,
    folder: null
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    dateRange: 'all'
  });
  
  const [viewMode, setViewMode] = useState('grid');
  const [moveHistory, setMoveHistory] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [analytics, setAnalytics] = useState({});

  // Check API connection and load data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check API health
        await ApiService.healthCheck();
        setApiConnected(true);
        console.log('✅ API connection established');
        
        // Load artworks from database
        const artworksData = await ApiService.getAllArtworks();
        setArtworks(artworksData);
        
        // Load movement history
        const movementsData = await ApiService.getMovements();
        setMoveHistory(movementsData);
        
        // Load analytics
        const analyticsData = await ApiService.getAnalytics();
        setAnalytics(analyticsData);
        
        console.log(`✅ Loaded ${artworksData.length} artworks from database`);
        
      } catch (err) {
        console.error('❌ Failed to connect to API, running in demo mode:', err);
        setApiConnected(false);
        console.log('🔧 Running in demo mode without database');
        
        // Use demo data when API is not available
        const demoArtworks = [
          {
            id: 1,
            title: "Abstrakte Komposition",
            artist: "Max Mustermann",
            category: "Malerei",
            status: "Verfügbar",
            warehouse: 1,
            floor: 1,
            shelf: 5,
            box: 2,
            folder: 3,
            tags: ["abstract", "modern"],
            year: 2023,
            condition: "Ausgezeichnet",
            description: "Eine wunderschöne abstrakte Komposition in lebendigen Farben",
            image_url: null
          },
          {
            id: 2,
            title: "Bronzeskulptur",
            artist: "Anna Schmidt",
            category: "Skulptur",
            status: "Verfügbar",
            warehouse: 2,
            floor: 1,
            shelf: 8,
            box: 1,
            folder: 1,
            tags: ["bronze", "skulptur"],
            year: 2022,
            condition: "Gut",
            description: "Eine elegante Bronzeskulptur",
            image_url: null
          },
          {
            id: 3,
            title: "Landschaftsaquarell",
            artist: "Peter Wagner",
            category: "Aquarell",
            status: "Verfügbar",
            warehouse: 1,
            floor: 2,
            shelf: 12,
            box: 4,
            folder: 2,
            tags: ["landschaft", "aquarell"],
            year: 2024,
            condition: "Sehr gut",
            description: "Ein ruhiges Landschaftsaquarell",
            image_url: null
          }
        ];
        
        setArtworks(demoArtworks);
        setAnalytics({
          totalArtworks: 3,
          byCategory: { "Malerei": 1, "Skulptur": 1, "Aquarell": 1 },
          byStatus: { "Verfügbar": 3 },
          byLocation: { "Lagerhaus 1": 2, "Lagerhaus 2": 1 }
        });
        console.log('✅ Demo data loaded successfully');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Filtered artworks based on search and filters
  const filteredArtworks = useMemo(() => {
    let filtered = [...artworks];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(artwork => 
        artwork.title?.toLowerCase().includes(term) ||
        artwork.artist?.toLowerCase().includes(term) ||
        artwork.description?.toLowerCase().includes(term) ||
        artwork.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(artwork => artwork.category === filters.category);
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(artwork => artwork.status === filters.status);
    }

    return filtered;
  }, [artworks, searchTerm, filters]);

  // Get artworks at specific location
  const getArtworksAtLocation = async (warehouse, floor, shelf, box, folder) => {
    if (!apiConnected) {
      // Fallback to local filtering
      return artworks.filter(artwork =>
        artwork.warehouse === parseInt(warehouse) &&
        artwork.floor === parseInt(floor) &&
        artwork.shelf === parseInt(shelf) &&
        artwork.box === parseInt(box) &&
        artwork.folder === parseInt(folder)
      );
    }

    try {
      const locationArtworks = await ApiService.getArtworksByLocation(
        warehouse, floor, shelf, box, folder
      );
      return locationArtworks;
    } catch (error) {
      console.error('Error fetching artworks at location:', error);
      return [];
    }
  };

  // Move artwork to new location
  const moveArtwork = async (artworkId, newLocation, notes = '') => {
    if (!apiConnected) {
      // Fallback to local state update
      setArtworks(prev => prev.map(artwork => {
        if (artwork.id === artworkId) {
          const movement = {
            id: `mov-${Date.now()}`,
            artworkId,
            artworkTitle: artwork.title,
            fromLocation: {
              warehouse: artwork.warehouse,
              floor: artwork.floor,
              shelf: artwork.shelf,
              box: artwork.box,
              folder: artwork.folder
            },
            toLocation: newLocation,
            timestamp: new Date().toISOString(),
            notes
          };
          setMoveHistory(prev => [movement, ...prev]);
          
          return {
            ...artwork,
            ...newLocation,
            lastMoved: new Date().toISOString()
          };
        }
        return artwork;
      }));
      return;
    }

    try {
      await ApiService.moveArtwork(artworkId, newLocation, notes);
      
      // Refresh artworks and move history
      const updatedArtworks = await ApiService.getAllArtworks();
      setArtworks(updatedArtworks);
      
      const updatedMovements = await ApiService.getMovements();
      setMoveHistory(updatedMovements);
      
      console.log('✅ Artwork moved successfully');
    } catch (error) {
      console.error('❌ Failed to move artwork:', error);
      setError('Failed to move artwork');
    }
  };

  // Search artworks with advanced filters
  const searchArtworks = async (searchParams) => {
    if (!apiConnected) {
      // Use local filtering
      return filteredArtworks;
    }

    try {
      const results = await ApiService.searchArtworks(searchParams);
      return results;
    } catch (error) {
      console.error('Error searching artworks:', error);
      return [];
    }
  };

  // Bulk move artworks
  const bulkMoveArtworks = async (artworkIds, newLocation, notes = '') => {
    if (!apiConnected) {
      // Fallback to individual moves for offline mode
      for (const id of artworkIds) {
        await moveArtwork(id, newLocation, notes);
      }
      return;
    }

    try {
      const result = await ApiService.bulkMoveArtworks(artworkIds, newLocation, notes);
      
      // Refresh artworks and move history after bulk operation
      const [updatedArtworks, updatedMovements] = await Promise.all([
        ApiService.getAllArtworks(),
        ApiService.getMovements()
      ]);
      
      setArtworks(updatedArtworks);
      setMoveHistory(updatedMovements);
      
      console.log(`✅ Bulk move completed: ${result.summary.successCount} successful, ${result.summary.failureCount} failed`);
      
      if (result.summary.failureCount > 0) {
        setError(`Bulk move partially failed: ${result.summary.failureCount} artworks could not be moved`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to bulk move artworks:', error);
      setError('Failed to bulk move artworks');
      throw error;
    }
  };

  // Toggle favorite
  const toggleFavorite = (artworkId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(artworkId)) {
        newFavorites.delete(artworkId);
      } else {
        newFavorites.add(artworkId);
      }
      return newFavorites;
    });
  };

  // Export functions
  const exportToCSV = async () => {
    try {
      if (apiConnected) {
        const exportData = await ApiService.exportArtworksToCSV();
        ApiService.downloadCSV(exportData.artworks, 'artworks.csv');
        return exportData;
      } else {
        // Fallback CSV export
        const csvContent = ApiService.convertToCSV(artworks, 'artworks');
        ApiService.downloadCSV(csvContent, 'artworks.csv');
        return { artworks: csvContent };
      }
    } catch (error) {
      console.error('Export failed:', error);
      setError('Export failed');
    }
  };

  const exportMoveHistory = async () => {
    try {
      if (apiConnected) {
        const movements = await ApiService.getMovements();
        const csvContent = ApiService.convertToCSV(movements, 'movements');
        ApiService.downloadCSV(csvContent, 'move-history.csv');
      } else {
        const csvContent = ApiService.convertToCSV(moveHistory, 'movements');
        ApiService.downloadCSV(csvContent, 'move-history.csv');
      }
    } catch (error) {
      console.error('Move history export failed:', error);
      setError('Move history export failed');
    }
  };

  // Refresh data
  const refreshData = async () => {
    if (!apiConnected) return;
    
    setLoading(true);
    try {
      const [artworksData, movementsData, analyticsData] = await Promise.all([
        ApiService.getAllArtworks(),
        ApiService.getMovements(),
        ApiService.getAnalytics()
      ]);
      
      setArtworks(artworksData);
      setMoveHistory(movementsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // Data
    artworks,
    filteredArtworks,
    moveHistory,
    analytics,
    favorites,
    
    // UI State
    selectedLocation,
    setSelectedLocation,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    loading,
    error,
    apiConnected,
    
    // Actions
    getArtworksAtLocation,
    moveArtwork,
    searchArtworks,
    bulkMoveArtworks,
    toggleFavorite,
    exportToCSV,
    exportMoveHistory,
    refreshData,
    
    // Utility
    locationOptions: ApiService.generateLocationOptions(),
  };

  return (
    <ArtworkContext.Provider value={value}>
      {children}
    </ArtworkContext.Provider>
  );
};