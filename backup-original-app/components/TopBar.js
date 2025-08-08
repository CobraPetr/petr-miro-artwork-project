import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';

const TopBar = ({ sidebarCollapsed, setSidebarCollapsed, currentView }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { analytics, exportToCSV, exportMoveHistory, searchTerm, setSearchTerm } = useArtwork();

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'browse': return 'Browse Artworks';
      case 'search': return 'Search & Filter';
      case 'analytics': return 'Analytics & Reports';
      case 'history': return 'Move History';
      default: return 'ArtVault Professional';
    }
  };

  const getPageDescription = () => {
    switch (currentView) {
      case 'dashboard': return 'Get insights into your collection';
      case 'browse': return 'Navigate through warehouse locations';
      case 'search': return 'Find specific artworks quickly';
      case 'analytics': return 'Detailed reports and statistics';
      case 'history': return 'Track artwork movements';
      default: return 'Manage your artwork collection';
    }
  };

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Artwork moved successfully',
      message: 'Renaissance Echo moved to Warehouse 4',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Storage capacity alert',
      message: 'Warehouse 1 is 85% full',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'info',
      title: 'New artwork added',
      message: '3 pieces added to collection',
      time: '3 hours ago'
    }
  ];

  return (
    <header className="bg-white border-b border-secondary-200 shadow-sm z-20">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <motion.button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          {/* Page Title */}
          <div>
            <h1 className="text-xl font-semibold text-secondary-900">{getPageTitle()}</h1>
            <p className="text-sm text-secondary-500">{getPageDescription()}</p>
          </div>
        </div>

        {/* Center Section - Global Search */}
        {(currentView === 'dashboard' || currentView === 'search') && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artworks, artists, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          
          {/* Collection Stats */}
          <div className="hidden lg:flex items-center space-x-4 px-4 py-2 bg-secondary-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-secondary-900">{analytics.totalArtworks}</div>
              <div className="text-xs text-secondary-500">Artworks</div>
            </div>
            <div className="w-px h-8 bg-secondary-300"></div>
            <div className="text-center">
              <div className="text-lg font-semibold text-success-600">
                ${(analytics.totalValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-secondary-500">Total Value</div>
            </div>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </motion.button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg border border-secondary-200 shadow-lg z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        exportToCSV();
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <div className="font-medium">Complete Collection</div>
                        <div className="text-xs text-secondary-500">All artwork data</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        exportMoveHistory();
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="font-medium">Movement History</div>
                        <div className="text-xs text-secondary-500">Track changes</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L10.97 4.97z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></span>
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-secondary-200 shadow-lg z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-secondary-200">
                    <h3 className="font-semibold text-secondary-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-secondary-100 hover:bg-secondary-50">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-success-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            'bg-primary-500'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-secondary-900">{notification.title}</h4>
                            <p className="text-sm text-secondary-600">{notification.message}</p>
                            <p className="text-xs text-secondary-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-4 border-l border-secondary-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">PM</span>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-secondary-900">Petr Miro</div>
              <div className="text-xs text-secondary-500">Art Curator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handlers */}
      {(showExportMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowExportMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default TopBar;