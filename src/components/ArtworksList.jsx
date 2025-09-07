import React, { useState } from "react";
import { useArtwork } from "../context/ArtworkContextDB";
import { useLanguage } from "../context/LanguageContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import ArtworkDetailModal from "./ArtworkDetailModal";
import { motion } from "framer-motion";

export const ArtworksList = () => {
  const { artworks, loading, moveArtwork, loadedCount, hasMoreData, loadMoreArtworks } = useArtwork();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2000; // Number of items per page - increased for fewer pages

  const handleMoveArtwork = async (artworkId, newLocation) => {
    try {
      await moveArtwork(artworkId, newLocation);
      // The moveArtwork function already updates the state, no need to reload
      console.log('Artwork moved successfully');
    } catch (error) {
      console.error('Error moving artwork:', error);
    }
  };

  const filteredArtworks = (artworks || []).filter(artwork => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      artwork.title?.toLowerCase().includes(query) ||
      artwork.artist?.toLowerCase().includes(query) ||
      artwork.category?.toLowerCase().includes(query)
    );
  });

  // Optimized pagination with smaller page size for better performance
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArtworks = filteredArtworks.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Memoize artwork cards to prevent unnecessary re-renders
  const ArtworkCard = React.memo(({ artwork, onMove }) => (
    <motion.div
      key={artwork.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
      }}
    >
      <Card 
        className="cursor-pointer transition-all duration-200 border-gray-200/50 hover:border-gray-300/50 hover:shadow-xl active:scale-[0.98] bg-white/60 backdrop-blur-sm h-full"
        onClick={() => setSelectedArtwork(artwork)}
      >
        <CardHeader className="p-2">
          <div className="flex items-start justify-between mb-1">
            <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight tracking-wide">
              {artwork.title}
            </CardTitle>
            {artwork.value && (
              <Badge className="bg-gray-100/80 text-gray-700 border-gray-200/50 text-sm ml-2 flex-shrink-0 backdrop-blur-sm font-medium">
                €{artwork.value.toLocaleString()}
              </Badge>
            )}
          </div>
          
          <div className="space-y-0.5">
            <p className="text-sm font-normal text-gray-600 line-clamp-1 tracking-wide">
              {artwork.artist}
            </p>
            {artwork.year && (
              <p className="text-xs text-gray-500 font-normal">
                {artwork.year}
              </p>
            )}
            {artwork.category && (
              <Badge variant="outline" className="text-xs w-fit bg-gray-100/80 text-gray-700 border-gray-200/50 backdrop-blur-sm font-medium">
                {artwork.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-2 pt-0">
          <div className="space-y-0.5">
            {artwork.medium && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                <span className="font-medium">{t('artworks.medium')}</span> {artwork.medium}
              </p>
            )}
            {artwork.dimensions && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                <span className="font-medium">{t('artworks.size')}</span> {artwork.dimensions}
              </p>
            )}
            
            {/* Location Info */}
            <div className="pt-1 border-t border-border/20">
              <p className="text-xs text-muted-foreground line-clamp-1">
                <span className="font-medium">{t('artworks.location')}</span> {artwork.warehouse || t('artworks.not_specified')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  ));

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">{t('artworks.loading')}</p>
          <p className="text-sm text-muted-foreground">
            Loading all 22k+ artworks and mapping to locations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Section Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 tracking-wide">
          {t('artworks.title')}
        </h2>
        <p className="text-gray-500 text-sm font-normal tracking-wide">
          {t('artworks.subtitle')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <Label htmlFor="search" className="sr-only">{t('common.search')}</Label>
        <Input
          id="search"
          type="text"
          placeholder={t('artworks.search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 sm:h-12 text-sm sm:text-base bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white/80 focus:border-gray-300/50 font-normal"
        />
      </div>

      {/* Results Count and Pagination Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm sm:text-base text-gray-600 font-normal">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredArtworks.length)} of {filteredArtworks.length} {t('artworks.results_count')} {artworks?.length || 0}
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
            <span className="text-sm text-gray-600 font-normal">
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

      {filteredArtworks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-base">
            {searchQuery 
              ? t('artworks.no_results')
              : t('artworks.no_artworks')
            }
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.02 // Reduced stagger for better performance
              }
            }
          }}
        >
          {paginatedArtworks.map((artwork) => (
            <ArtworkCard 
              key={artwork.id} 
              artwork={artwork} 
              onMove={handleMoveArtwork}
            />
          ))}
        </motion.div>
      )}


      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <ArtworkDetailModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onMove={handleMoveArtwork}
        />
      )}
    </motion.div>
  );
};