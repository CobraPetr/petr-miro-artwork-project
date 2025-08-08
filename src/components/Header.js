import React from 'react';
import { motion } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';

const Header = () => {
  const { exportToCSV, artworks } = useArtwork();

  return (
    <motion.header 
      className="bg-white border-b-2 border-dark-grey shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Artwork Warehouse Management
            </h1>
            <p className="text-dark-grey">
              Managing {artworks.length} artworks across 5 warehouses
            </p>
          </div>
          
          <motion.button
            onClick={exportToCSV}
            className="bg-sky-blue hover:bg-sky-blue-dark text-white px-6 py-3 rounded-lg font-medium border-2 border-dark-grey transition-all duration-200 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Export to FileMaker
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;