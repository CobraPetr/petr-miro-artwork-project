import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Save, Check } from 'lucide-react';

  const locations = [
    'Prague Depot0',
    'Hodonin Bank0',
    'Hodonin Hall0',
    'Zürich Lessing',
    'Zürich Wädenswil0',
    'Other Location0'
  ];

const MoveArtworkModal = ({ artwork, onClose, onMove }) => {
  const [selectedLocation, setSelectedLocation] = useState(artwork?.warehouse || '');
  const [isMoving, setIsMoving] = useState(false);
  const [moved, setMoved] = useState(false);

  const handleMove = async () => {
    if (!selectedLocation || selectedLocation === artwork?.warehouse) {
      return;
    }

    setIsMoving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the move function
      if (onMove) {
        await onMove(artwork.id, selectedLocation);
      }
      
      setMoved(true);
      // Show success message
      alert(`✅ Artwork "${artwork.title}" has been successfully moved to ${selectedLocation}!`);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error moving artwork:', error);
    } finally {
      setIsMoving(false);
    }
  };

  if (!artwork) return null;

  if (moved) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Artwork Moved!</h2>
          <p className="text-gray-600">
            <strong>{artwork.title}</strong> has been moved to <strong>{selectedLocation}</strong>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Move Artwork</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Artwork Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">{artwork.title}</h3>
            <p className="text-gray-600">by {artwork.artist}</p>
            <p className="text-sm text-gray-500">
              <strong>Current location:</strong> {artwork.warehouse || 'Not specified'}
            </p>
          </div>

          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select new location:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedLocation === location
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-gray-500" size={20} />
                    <span className="font-medium">{location}</span>
                    {selectedLocation === location && (
                      <Check className="text-blue-500 ml-auto" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleMove}
              disabled={!selectedLocation || selectedLocation === artwork.warehouse || isMoving}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {isMoving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Moving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Confirm Move
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MoveArtworkModal;
