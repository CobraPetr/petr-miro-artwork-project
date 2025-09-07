import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allArtworksData, setAllArtworksData] = useState(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  
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

  // Function to map locations to warehouse names
  const mapLocationToWarehouse = (artwork) => {
    let warehouse = 'Anderswo'; // default
    
    const location = artwork.warehouse.toLowerCase();
    
    // Map to specific warehouse locations
    if (location.includes('prag') || location.includes('praha') || location.includes('czech') || location.includes('czech republic')) {
      warehouse = 'Prag to depo';
    } else if (location.includes('hodonin') && location.includes('bank')) {
      warehouse = 'Hodonin Bank';
    } else if (location.includes('hodonin') && location.includes('hala')) {
      warehouse = 'Hodonin Hala';
    } else if (location.includes('zürich') && location.includes('lessing')) {
      warehouse = 'Zürich Lessing';
    } else if (location.includes('zürich') && location.includes('wädenswil')) {
      warehouse = 'Zürich Wädenswil';
    } else if (location.includes('zürich') || location.includes('switzerland') || location.includes('ch-')) {
      warehouse = 'Zürich Lessing'; // Default Zürich location
    } else if (location.includes('berlin') || location.includes('germany') || location.includes('de-')) {
      warehouse = 'Hodonin Hala'; // Default German location
    } else if (location.includes('amsterdam') || location.includes('netherlands') || location.includes('nl-')) {
      warehouse = 'Zürich Wädenswil'; // Default Dutch location
    } else if (location.trim() === '' || location === ',' || location === 'nan') {
      warehouse = 'Anderswo';
    } else if (location.length > 50) {
      // Very long addresses go to Anderswo
      warehouse = 'Anderswo';
    } else {
      // Keep original location for shorter, meaningful addresses
      warehouse = artwork.warehouse;
    }
    
    return {
      ...artwork,
      warehouse: warehouse
    };
  };

  // Function to update analytics
  const updateAnalytics = (artworksList) => {
    setAnalytics({
      totalArtworks: artworksList.length,
      byCategory: {
        "Imported": artworksList.length
      },
      byStatus: {
        "Available": artworksList.length
      },
      byLocation: artworksList.reduce((acc, artwork) => {
        const location = artwork.warehouse;
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {})
    });
  };

  // Load more artworks function
  const loadMoreArtworks = async () => {
    if (!allArtworksData || !hasMoreData) return;
    
    setLoading(true);
    try {
      const batchSize = 1000;
      const startIndex = loadedCount;
      const endIndex = Math.min(startIndex + batchSize, allArtworksData.length);
      
      const newBatch = allArtworksData.slice(startIndex, endIndex);
      const mappedBatch = newBatch.map(mapLocationToWarehouse);
      
      setArtworks(prev => [...prev, ...mappedBatch]);
      setLoadedCount(endIndex);
      setHasMoreData(endIndex < allArtworksData.length);
      
      updateAnalytics([...artworks, ...mappedBatch]);
      
      console.log(`✅ Loaded batch: ${startIndex + 1}-${endIndex} of ${allArtworksData.length} artworks`);
    } catch (error) {
      console.error('Error loading more artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load all artworks at once with performance optimizations
  useEffect(() => {
    const loadAllArtworks = async () => {
      setLoading(true);
      try {
        // Check localStorage first for saved changes
        const savedData = localStorage.getItem('artworks_data');
        if (savedData) {
          console.log('🔄 Loading saved artwork data from localStorage...');
          const savedArtworks = JSON.parse(savedData);
          setArtworks(savedArtworks);
          setLoadedCount(savedArtworks.length);
          setHasMoreData(false);
          updateAnalytics(savedArtworks);
          console.log(`✅ Loaded ${savedArtworks.length} artworks from localStorage`);
          setLoading(false);
          return;
        }

        // If no saved data, load from JSON file
        console.log('🔄 No saved data found, loading from JSON file...');
        const artworksData = await import('../data/artworks.json');
        const csvArtworks = artworksData.default || artworksData;
        
        console.log(`🔄 Processing ${csvArtworks.length} artworks...`);
        
        // Process all artworks in batches to prevent UI blocking
        const batchSize = 5000;
        const allMappedArtworks = [];
        
        for (let i = 0; i < csvArtworks.length; i += batchSize) {
          const batch = csvArtworks.slice(i, i + batchSize);
          const mappedBatch = batch.map(mapLocationToWarehouse);
          allMappedArtworks.push(...mappedBatch);
          
          // Update progress every batch
          if (i % batchSize === 0) {
            console.log(`Processed ${Math.min(i + batchSize, csvArtworks.length)} of ${csvArtworks.length} artworks`);
          }
        }
        
        setArtworks(allMappedArtworks);
        setLoadedCount(allMappedArtworks.length);
        setHasMoreData(false);
        
        updateAnalytics(allMappedArtworks);
        console.log(`✅ Loaded all ${allMappedArtworks.length} artworks successfully`);
      } catch (error) {
        console.error('Error loading artworks:', error);
        setArtworks([]);
        setAnalytics({
          totalArtworks: 0,
          byCategory: {},
          byStatus: {},
          byLocation: {}
        });
      } finally {
        setLoading(false);
      }
    };

    loadAllArtworks();
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

  // Move artwork function with custom location support
  const moveArtwork = async (artworkId, newLocation, notes = '') => {
    setArtworks(prev => {
      const updatedArtworks = prev.map(artwork => {
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
              folder: artwork.folder,
              originalLocation: artwork.originalLocation
            },
            toLocation: newLocation,
            timestamp: new Date().toISOString(),
            notes
          };
          setMoveHistory(prev => [movement, ...prev]);
          
          // Update artwork with new location
          const updatedArtwork = {
            ...artwork,
            ...newLocation,
            lastMoved: new Date().toISOString()
          };

          // If moving to Anderswo and custom location is provided, update originalLocation
          if (newLocation.warehouse === 'Anderswo' && newLocation.originalLocation) {
            updatedArtwork.originalLocation = newLocation.originalLocation;
          }

          return updatedArtwork;
        }
        return artwork;
      });

      // Save to localStorage for persistence
      try {
        localStorage.setItem('artworks_data', JSON.stringify(updatedArtworks));
        console.log('Artwork changes saved to localStorage');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }

      return updatedArtworks;
    });

    // Update analytics after move
    updateAnalytics(artworks);
  };

  // Function to reset data to original (clear localStorage)
  const resetToOriginal = () => {
    localStorage.removeItem('artworks_data');
    window.location.reload();
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
    
    // Batch loading
    loadedCount,
    hasMoreData,
    loadMoreArtworks,
    
    // Actions
    moveArtwork,
    resetToOriginal,
  };

  return (
    <ArtworkContext.Provider value={value}>
      {children}
    </ArtworkContext.Provider>
  );
};