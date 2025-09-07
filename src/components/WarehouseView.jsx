import React, { useState, useEffect } from "react";
import { useArtwork } from "../context/ArtworkContextDB";
import { useLanguage } from "../context/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import ArtworkDetailModal from "./ArtworkDetailModal";

export const WarehouseView = () => {
  const { artworks, loadedCount, hasMoreData, loadMoreArtworks, moveArtwork } = useArtwork();
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationArtworks, setLocationArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const itemsPerPage = 2000; // Number of items per page - increased for fewer pages

  // Reset state when component mounts or when artworks change
  useEffect(() => {
    setSelectedLocation(null);
    setLocationArtworks([]);
    setCurrentPage(1);
    setSelectedArtwork(null);
  }, [artworks]);

  // The 6 locations from your image
  const locations = [
    'Prag to depo',
    'Hodonin Bank',
    'Hodonin Hala', 
    'Zürich Lessing',
    'Zürich Wädenswil',
    'Anderswo'
  ];

  // Get artwork count for each location
  const getArtworkCountForLocation = (location) => {
    return artworks.filter(artwork => 
      artwork.warehouse === location || 
      (artwork.warehouse && artwork.warehouse.toLowerCase().includes(location.toLowerCase()))
    ).length;
  };

  const loadArtworksForLocation = (location) => {
    setLoading(true);
    try {
      const filteredArtworks = artworks.filter(artwork => 
        artwork.warehouse === location || 
        (artwork.warehouse && artwork.warehouse.toLowerCase().includes(location.toLowerCase()))
      );
      setLocationArtworks(filteredArtworks);
    } catch (error) {
      console.error('Error loading artworks:', error);
      setLocationArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setCurrentPage(1); // Reset to first page
    loadArtworksForLocation(location);
  };

  const handleBack = () => {
    setSelectedLocation(null);
    setLocationArtworks([]);
    setCurrentPage(1);
  };

  const handleMoveArtwork = async (artworkId, newLocation) => {
    try {
      await moveArtwork(artworkId, newLocation);
      // Update the local locationArtworks state to reflect the change
      setLocationArtworks(prev => prev.map(artwork => 
        artwork.id === artworkId 
          ? { ...artwork, ...newLocation, lastMoved: new Date().toISOString() }
          : artwork
      ));
      console.log('Artwork moved successfully');
    } catch (error) {
      console.error('Error moving artwork:', error);
    }
  };

  // Pagination for location artworks
  const totalPages = Math.ceil(locationArtworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLocationArtworks = locationArtworks.slice(startIndex, endIndex);

  if (selectedLocation) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center mb-6 sm:mb-8">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            className="h-10 sm:h-12 mb-3 sm:mb-4 bg-white/60 backdrop-blur-sm border-gray-200/50 text-gray-700 hover:bg-white/80 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="mr-1" size={14} /> {t('common.cancel')}
          </Button>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-wide">
            {selectedLocation}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('artworks.loading')}</p>
          </div>
        ) : locationArtworks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('warehouse.no_artworks')}</p>
          </div>
        ) : (
          <>
            {/* Pagination Info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm sm:text-base text-gray-600 font-normal">
                Showing {startIndex + 1}-{Math.min(endIndex, locationArtworks.length)} of {locationArtworks.length} artworks
                {loadedCount > 0 && (
                  <span className="ml-1 sm:ml-2 text-xs text-gray-500">
                    (Loaded: {loadedCount} total)
                  </span>
                )}
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 text-sm font-medium bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-md text-gray-700 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-2 text-sm font-medium bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-md text-gray-700 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
              {paginatedLocationArtworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  console.log('Artwork clicked:', artwork);
                  setSelectedArtwork(artwork);
                }}
              >
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-200 bg-white/60 backdrop-blur-sm border-gray-200/50 hover:bg-white/80"
            >
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight tracking-wide">
                  {artwork.title}
                </CardTitle>
                <p className="text-sm font-normal text-gray-600 line-clamp-1 tracking-wide">{artwork.artist}</p>
                {artwork.year && (
                  <p className="text-xs text-gray-500 font-normal">{artwork.year}</p>
                )}
                {artwork.value && (
                  <Badge className="bg-gray-100/80 text-gray-700 border-gray-200/50 w-fit text-xs backdrop-blur-sm font-medium">
                    €{artwork.value.toLocaleString()}
                  </Badge>
                )}
              </CardHeader>
            </Card>
              </motion.div>
            ))}
            </div>
            
            {/* Artwork Detail Modal */}
            {selectedArtwork && (
              <ArtworkDetailModal
                artwork={selectedArtwork}
                onClose={() => setSelectedArtwork(null)}
                onMove={handleMoveArtwork}
              />
            )}
            
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 tracking-wide">
          {t('warehouse.title')}
        </h2>
        <p className="text-gray-500 text-sm font-normal tracking-wide">
          6 locations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location, index) => (
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer transition-all duration-200 border-gray-200/50 hover:border-gray-300/50 hover:shadow-xl active:scale-[0.98] bg-white/60 backdrop-blur-sm"
              onClick={() => handleLocationClick(location)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-gray-100/80 backdrop-blur-sm">
                      <span className="text-gray-700 text-lg">🏢</span>
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
                        {location}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge className="bg-gray-100/80 text-gray-700 border-gray-200/50 font-medium backdrop-blur-sm text-sm">
                    {getArtworkCountForLocation(location)}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};