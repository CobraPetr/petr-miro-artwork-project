import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';

const MoveHistory = () => {
  const { moveHistory = [], artworks = [], exportMoveHistory, loading, error } = useArtwork();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">⚠️ {error}</div>
        <div className="text-gray-600">Unable to load movement history</div>
      </div>
    );
  }

  // Filter and sort moves
  const filteredMoves = moveHistory
    .filter(move => {
      if (filter !== 'all') {
        // Add custom filter logic if needed
      }
      if (searchTerm) {
        return (
          move.artworkTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          move.artworkId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatLocation = (location) => {
    return `W${location.warehouse}-F${location.floor}-S${location.shelf}-B${location.box}-F${location.folder}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const MoveCard = ({ move, index }) => {
    const { date, time } = formatTimestamp(move.timestamp);
    
    return (
      <motion.div
        className="bg-white border border-secondary-200 rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        layout
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">{move.artworkTitle}</h3>
              <p className="text-sm text-secondary-500">ID: {move.artworkId}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-secondary-900">{date}</div>
            <div className="text-xs text-secondary-500">{time}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs font-medium text-secondary-500 mb-1">FROM</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
              <span className="text-sm font-mono text-secondary-700">
                {formatLocation(move.fromLocation)}
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-secondary-500 mb-1">TO</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm font-mono text-secondary-700">
                {formatLocation(move.toLocation)}
              </span>
            </div>
          </div>
        </div>

        {move.notes && (
          <div className="bg-secondary-50 rounded-lg p-3">
            <div className="text-xs font-medium text-secondary-500 mb-1">NOTES</div>
            <p className="text-sm text-secondary-700">{move.notes}</p>
          </div>
        )}
      </motion.div>
    );
  };

  const EmptyState = () => (
    <motion.div
      className="text-center py-12 bg-white rounded-xl border border-secondary-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg className="w-16 h-16 mx-auto mb-4 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">No movement history</h3>
      <p className="text-secondary-600">Artwork movements will appear here once you start moving pieces</p>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Movement History</h1>
            <p className="text-accent-100">Track all artwork location changes and movements</p>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{moveHistory.length}</div>
              <div className="text-sm text-accent-100">Total Moves</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-secondary-200 shadow-soft p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">Search Movements</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by artwork title or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="timestamp">Date & Time</option>
              <option value="artworkTitle">Artwork Title</option>
              <option value="artworkId">Artwork ID</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-secondary-600">
            Showing {filteredMoves.length} of {moveHistory.length} movements
          </div>
          
          <motion.button
            onClick={exportMoveHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export History</span>
          </motion.button>
        </div>
      </div>

      {/* Movement List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredMoves.length > 0 ? (
            filteredMoves.map((move, index) => (
              <MoveCard key={move.id} move={move} index={index} />
            ))
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>
      </div>

      {/* Recent Activity Summary */}
      {moveHistory.length > 0 && (
        <motion.div
          className="bg-white rounded-xl border border-secondary-200 shadow-soft p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Activity Summary</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {moveHistory.filter(move => {
                  const moveDate = new Date(move.timestamp);
                  const today = new Date();
                  return moveDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <div className="text-sm text-secondary-600">Moves Today</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 mb-1">
                {moveHistory.filter(move => {
                  const moveDate = new Date(move.timestamp);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return moveDate >= weekAgo;
                }).length}
              </div>
              <div className="text-sm text-secondary-600">Moves This Week</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600 mb-1">
                {new Set(moveHistory.map(move => move.artworkId)).size}
              </div>
              <div className="text-sm text-secondary-600">Unique Artworks Moved</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MoveHistory;