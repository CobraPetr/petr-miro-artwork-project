import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';
import MoveArtworkModal from './MoveArtworkModal';

const ArtworkDisplay = () => {
  const { selectedLocation, getArtworksAtLocation, loading, filteredArtworks = [] } = useArtwork();
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [locationArtworks, setLocationArtworks] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { warehouse, floor, shelf, box, folder } = selectedLocation || {};
  
  // Only show artworks if all location levels are selected
  const isLocationComplete = warehouse && floor && shelf && box && folder;
  
  // Load artworks for the selected location
  React.useEffect(() => {
    if (isLocationComplete && getArtworksAtLocation) {
      setLoadingLocation(true);
      getArtworksAtLocation(warehouse, floor, shelf, box, folder)
        .then(artworks => {
          setLocationArtworks(artworks || []);
          setLoadingLocation(false);
        })
        .catch(error => {
          console.error('Error loading location artworks:', error);
          setLocationArtworks([]);
          setLoadingLocation(false);
        });
    } else {
      setLocationArtworks([]);
    }
  }, [warehouse, floor, shelf, box, folder, getArtworksAtLocation, isLocationComplete]);

  const artworks = isLocationComplete ? locationArtworks : [];

  const handleMoveArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setShowMoveModal(true);
  };

  const handleCloseMoveModal = () => {
    setShowMoveModal(false);
    setSelectedArtwork(null);
  };

  if (loading || loadingLocation) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="w-8 h-8 border-4 border-sky-blue border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!isLocationComplete) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-dark-grey text-lg">
          Please complete your location selection to view artworks
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-secondary-900">
            Artworks in Warehouse {warehouse} → Floor {floor} → Shelf {shelf} → Box {box} → Folder {folder}
          </h3>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            {artworks.length} pieces
          </span>
        </div>

        {artworks.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-dark-grey text-lg">
              No artworks found in this location
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence>
              {artworks.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  className="bg-light-grey p-4 rounded-lg border-2 border-dark-grey hover:border-sky-blue transition-all duration-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="aspect-w-4 aspect-h-3 mb-4">
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full h-48 object-cover rounded-lg border border-dark-grey"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/cccccc/666666?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {artwork.title}
                  </h4>
                  
                  <p className="text-sm text-dark-grey mb-4">
                    ID: {artwork.id}
                  </p>

                  <motion.button
                    onClick={() => handleMoveArtwork(artwork)}
                    className="w-full bg-sky-blue hover:bg-sky-blue-dark text-white py-2 px-4 rounded-lg font-medium border-2 border-sky-blue-dark transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Move Artwork
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Move Artwork Modal */}
      <AnimatePresence>
        {showMoveModal && selectedArtwork && (
          <MoveArtworkModal
            artwork={selectedArtwork}
            onClose={handleCloseMoveModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ArtworkDisplay;