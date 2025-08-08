import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';

const SearchAndFilters = () => {
  const { 
    filteredArtworks = [], 
    searchTerm = '', 
    setSearchTerm, 
    filters = {}, 
    setFilters,
    viewMode = 'grid',
    setViewMode,
    toggleFavorite,
    favorites = new Set()
  } = useArtwork();

  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const categories = ['all', 'painting', 'sculpture', 'photography', 'digital-art', 'mixed-media', 'street-art', 'abstract', 'illustration', 'installation', 'graphic-design'];
  const statuses = ['all', 'available', 'on-loan', 'reserved', 'in-storage'];
  const conditions = ['all', 'excellent', 'good', 'fair', 'mint'];

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'artist', label: 'Artist' },
    { value: 'year', label: 'Year' },
    { value: 'value', label: 'Value' },
    { value: 'dateAdded', label: 'Date Added' },
    { value: 'lastMoved', label: 'Last Moved' }
  ];

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'value') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }
    
    if (sortBy === 'year') {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const ArtworkCard = ({ artwork, index }) => (
    <motion.div
      className="bg-white rounded-xl border border-secondary-200 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={() => setSelectedArtwork(artwork)}
      layout
    >
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=No+Image';
            }}
          />
        </div>
        
        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(artwork.id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                favorites.has(artwork.id)
                  ? 'bg-accent-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <svg className="w-4 h-4" fill={favorites.has(artwork.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
              View Details
            </button>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            artwork.status === 'available' ? 'bg-success-100 text-success-700' :
            artwork.status === 'on-loan' ? 'bg-yellow-100 text-yellow-700' :
            artwork.status === 'reserved' ? 'bg-primary-100 text-primary-700' :
            'bg-secondary-100 text-secondary-700'
          }`}>
            {artwork.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-secondary-900 mb-1 truncate">{artwork.title}</h3>
        <p className="text-sm text-secondary-600 mb-2">{artwork.artist}</p>
        
        <div className="flex items-center justify-between text-xs text-secondary-500 mb-3">
          <span>{artwork.year}</span>
          <span className="capitalize">{artwork.category?.replace('-', ' ')}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-secondary-900">
            ${artwork.value?.toLocaleString()}
          </span>
          <span className="text-xs text-secondary-500">
            W{artwork.warehouse}-F{artwork.floor}-S{artwork.shelf}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const ArtworkModal = ({ artwork, onClose }) => (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-64 md:h-80 object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400/e2e8f0/64748b?text=No+Image';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">{artwork.title}</h2>
              <p className="text-lg text-secondary-600 mb-4">{artwork.artist}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-500">Year:</span>
                  <span className="font-medium">{artwork.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Medium:</span>
                  <span className="font-medium">{artwork.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Dimensions:</span>
                  <span className="font-medium">{artwork.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Value:</span>
                  <span className="font-medium">${artwork.value?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Condition:</span>
                  <span className="font-medium capitalize">{artwork.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Status:</span>
                  <span className={`font-medium capitalize ${
                    artwork.status === 'available' ? 'text-success-600' :
                    artwork.status === 'on-loan' ? 'text-yellow-600' :
                    'text-primary-600'
                  }`}>
                    {artwork.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-secondary-900 mb-3">Location</h3>
              <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                <div className="text-sm space-y-1">
                  <div>Warehouse: <span className="font-medium">{artwork.warehouse}</span></div>
                  <div>Floor: <span className="font-medium">{artwork.floor}</span></div>
                  <div>Shelf: <span className="font-medium">{artwork.shelf}</span></div>
                  <div>Box: <span className="font-medium">{artwork.box}</span></div>
                  <div>Folder: <span className="font-medium">{artwork.folder}</span></div>
                </div>
              </div>

              <h3 className="font-semibold text-secondary-900 mb-3">Description</h3>
              <p className="text-secondary-600 mb-4">{artwork.description}</p>

              <h3 className="font-semibold text-secondary-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Advanced Search Header */}
      <div className="bg-white rounded-xl border border-secondary-200 shadow-soft p-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Advanced Search & Filters</h2>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by title, artist, ID, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* View Mode and Results Info */}
        <div className="flex items-center justify-between">
          <div className="text-secondary-600">
            Showing {sortedArtworks.length} of {filteredArtworks.length} artworks
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-secondary-600">View:</span>
            <div className="flex border border-secondary-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'list' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        <AnimatePresence>
          {sortedArtworks.map((artwork, index) => (
            <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sortedArtworks.length === 0 && (
        <motion.div
          className="text-center py-12 bg-white rounded-xl border border-secondary-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-16 h-16 mx-auto mb-4 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No artworks found</h3>
          <p className="text-secondary-600">Try adjusting your search terms or filters</p>
        </motion.div>
      )}

      {/* Artwork Detail Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <ArtworkModal 
            artwork={selectedArtwork} 
            onClose={() => setSelectedArtwork(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAndFilters;