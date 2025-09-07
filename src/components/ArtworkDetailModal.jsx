import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Move, Check, X as CloseIcon } from 'lucide-react';

const ArtworkDetailModal = ({ artwork, onClose, onMove }) => {
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [isMoving, setIsMoving] = useState(false);

  const locations = [
    'Prag to depo',
    'Hodonin Bank', 
    'Hodonin Hala',
    'Zürich Lessing',
    'Zürich Wädenswil',
    'Anderswo'
  ];

  const handleMove = async () => {
    if (!selectedLocation) return;
    
    setIsMoving(true);
    try {
      const newLocation = {
        warehouse: selectedLocation,
        floor: null,
        shelf: null,
        box: null,
        folder: null
      };

      // If moving to Anderswo and custom location is provided, add it as originalLocation
      if (selectedLocation === 'Anderswo' && customLocation.trim()) {
        newLocation.originalLocation = customLocation.trim();
      }

      await onMove(artwork.id, newLocation);
      setShowMoveModal(false);
      setSelectedLocation('');
      setCustomLocation('');
    } catch (error) {
      console.error('Error moving artwork:', error);
    } finally {
      setIsMoving(false);
    }
  };

  if (!artwork) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Artwork Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <X size={24} />
          </button>
        </div>

        {/* The 3 Key Information */}
        <div className="space-y-6">
          {/* Artwork Name */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Artwork Name</h3>
            <p className="text-xl font-bold text-gray-900">{artwork.title}</p>
          </div>

          {/* Artist Name */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Artist Name</h3>
            <p className="text-xl font-bold text-gray-900">{artwork.artist}</p>
          </div>

          {/* Location */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Location</h3>
            <p className="text-xl font-bold text-gray-900">{artwork.warehouse || 'Not specified'}</p>
            {artwork.warehouse === 'Anderswo' && artwork.originalLocation && artwork.originalLocation.trim() !== '' && artwork.originalLocation !== ',' && (
              <p className="text-sm text-gray-600 mt-2 break-words">
                <span className="font-medium">Details:</span> {artwork.originalLocation}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowMoveModal(true)}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 font-medium flex items-center justify-center gap-2"
          >
            <Move size={16} />
            Move Artwork
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>

      {/* Move Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Move Artwork</h3>
              <button
                onClick={() => setShowMoveModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a location...</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLocation === 'Anderswo' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Location Details
                  </label>
                  <textarea
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter specific location details (address, room, etc.)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be stored as the detailed location for this artwork.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleMove}
                  disabled={!selectedLocation || isMoving}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMoving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Moving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Move Artwork
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowMoveModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetailModal;
