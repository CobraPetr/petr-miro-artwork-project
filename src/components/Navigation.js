import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';

const Navigation = () => {
  const { selectedLocation, setSelectedLocation } = useArtwork();

  const updateLocation = (key, value) => {
    const newLocation = { ...selectedLocation };
    
    // Reset subsequent selections when a parent level changes
    const levelOrder = ['warehouse', 'floor', 'shelf', 'box', 'folder'];
    const currentIndex = levelOrder.indexOf(key);
    
    for (let i = currentIndex + 1; i < levelOrder.length; i++) {
      newLocation[levelOrder[i]] = null;
    }
    
    newLocation[key] = value;
    setSelectedLocation(newLocation);
  };

  const renderSelector = (title, key, max, isVisible = true) => {
    if (!isVisible) return null;

    const options = Array.from({ length: max }, (_, i) => i + 1);
    
    return (
      <motion.div
        className="bg-white p-6 rounded-lg border-2 border-dark-grey shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-5 gap-3">
          {options.map(option => (
            <motion.button
              key={option}
              onClick={() => updateLocation(key, option)}
              className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedLocation[key] === option
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

  const renderSelectorLarge = (title, key, max, isVisible = true) => {
    if (!isVisible) return null;

    const options = Array.from({ length: max }, (_, i) => i + 1);
    
    return (
      <motion.div
        className="bg-white p-6 rounded-lg border-2 border-dark-grey shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-10 gap-2 max-h-64 overflow-y-auto">
          {options.map(option => (
            <motion.button
              key={option}
              onClick={() => updateLocation(key, option)}
              className={`p-2 rounded border-2 text-sm font-medium transition-all duration-200 ${
                selectedLocation[key] === option
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
    <div className="space-y-6">
      <motion.div
        className="bg-white rounded-xl border border-secondary-200 shadow-soft p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Navigate to Location</h2>
        
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {renderSelector('Select Warehouse', 'warehouse', 5, true)}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {renderSelector('Select Floor', 'floor', 3, selectedLocation.warehouse !== null)}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {renderSelectorLarge('Select Shelf', 'shelf', 30, selectedLocation.floor !== null)}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {renderSelector('Select Box', 'box', 10, selectedLocation.shelf !== null)}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {renderSelector('Select Folder', 'folder', 5, selectedLocation.box !== null)}
          </AnimatePresence>
        </div>

        {/* Location Summary */}
        {selectedLocation.warehouse && (
          <motion.div
            className="mt-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-secondary-900 mb-2">Current Selection:</h4>
            <p className="text-secondary-600">
              Warehouse {selectedLocation.warehouse}
              {selectedLocation.floor && ` → Floor ${selectedLocation.floor}`}
              {selectedLocation.shelf && ` → Shelf ${selectedLocation.shelf}`}
              {selectedLocation.box && ` → Box ${selectedLocation.box}`}
              {selectedLocation.folder && ` → Folder ${selectedLocation.folder}`}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Navigation;