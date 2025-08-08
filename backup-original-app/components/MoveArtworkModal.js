import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';

const MoveArtworkModal = ({ artwork, onClose }) => {
  const { moveArtwork } = useArtwork();
  const [newLocation, setNewLocation] = useState({
    warehouse: null,
    floor: null,
    shelf: null,
    box: null,
    folder: null
  });

  const updateNewLocation = (key, value) => {
    const updatedLocation = { ...newLocation };
    
    // Reset subsequent selections when a parent level changes
    const levelOrder = ['warehouse', 'floor', 'shelf', 'box', 'folder'];
    const currentIndex = levelOrder.indexOf(key);
    
    for (let i = currentIndex + 1; i < levelOrder.length; i++) {
      updatedLocation[levelOrder[i]] = null;
    }
    
    updatedLocation[key] = value;
    setNewLocation(updatedLocation);
  };

  const handleConfirmMove = () => {
    if (newLocation.warehouse && newLocation.floor && newLocation.shelf && newLocation.box && newLocation.folder) {
      moveArtwork(artwork.id, newLocation);
      onClose();
    }
  };

  const isLocationComplete = newLocation.warehouse && newLocation.floor && newLocation.shelf && newLocation.box && newLocation.folder;
  const isSameLocation = isLocationComplete && 
    newLocation.warehouse === artwork.warehouse &&
    newLocation.floor === artwork.floor &&
    newLocation.shelf === artwork.shelf &&
    newLocation.box === artwork.box &&
    newLocation.folder === artwork.folder;

  const renderSelector = (title, key, max, isVisible = true) => {
    if (!isVisible) return null;

    const options = Array.from({ length: max }, (_, i) => i + 1);
    
    return (
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h4 className="text-md font-semibold text-gray-900 mb-3">{title}</h4>
        <div className={`grid gap-2 ${max <= 10 ? 'grid-cols-5' : 'grid-cols-10'} ${max > 10 ? 'max-h-32 overflow-y-auto' : ''}`}>
          {options.map(option => (
            <motion.button
              key={option}
              onClick={() => updateNewLocation(key, option)}
              className={`p-2 rounded border-2 text-sm font-medium transition-all duration-200 ${
                newLocation[key] === option
                  ? 'bg-sky-blue text-white border-sky-blue-dark'
                  : 'bg-light-grey text-gray-700 border-dark-grey hover:bg-sky-blue hover:text-white hover:border-sky-blue-dark'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg border-2 border-dark-grey shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Move Artwork
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-16 h-12 object-cover rounded border border-dark-grey"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64x48/cccccc/666666?text=No+Image';
                  }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{artwork.title}</p>
                  <p className="text-sm text-dark-grey">
                    Currently: W{artwork.warehouse} → F{artwork.floor} → S{artwork.shelf} → B{artwork.box} → F{artwork.folder}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-dark-grey hover:text-gray-900 text-2xl font-bold p-1"
            >
              ×
            </button>
          </div>

          {/* Location Selectors */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Select New Location</h4>
            
            {renderSelector('Warehouse', 'warehouse', 5, true)}
            {renderSelector('Floor', 'floor', 3, newLocation.warehouse !== null)}
            {renderSelector('Shelf', 'shelf', 30, newLocation.floor !== null)}
            {renderSelector('Box', 'box', 10, newLocation.shelf !== null)}
            {renderSelector('Folder', 'folder', 5, newLocation.box !== null)}

            {/* New Location Summary */}
            {newLocation.warehouse && (
              <motion.div
                className="p-4 bg-light-grey rounded-lg border border-dark-grey"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h5 className="font-semibold text-gray-900 mb-2">New Location:</h5>
                <p className="text-dark-grey">
                  Warehouse {newLocation.warehouse}
                  {newLocation.floor && ` → Floor ${newLocation.floor}`}
                  {newLocation.shelf && ` → Shelf ${newLocation.shelf}`}
                  {newLocation.box && ` → Box ${newLocation.box}`}
                  {newLocation.folder && ` → Folder ${newLocation.folder}`}
                </p>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-dark-grey">
            <motion.button
              onClick={onClose}
              className="px-6 py-2 bg-light-grey text-dark-grey rounded-lg border-2 border-dark-grey hover:bg-gray-200 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            
            <motion.button
              onClick={handleConfirmMove}
              disabled={!isLocationComplete || isSameLocation}
              className={`px-6 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                isLocationComplete && !isSameLocation
                  ? 'bg-sky-blue hover:bg-sky-blue-dark text-white border-sky-blue-dark'
                  : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
              }`}
              whileHover={isLocationComplete && !isSameLocation ? { scale: 1.02 } : {}}
              whileTap={isLocationComplete && !isSameLocation ? { scale: 0.98 } : {}}
            >
              {isSameLocation ? 'Same Location' : 'Confirm Move'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MoveArtworkModal;