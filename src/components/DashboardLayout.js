import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import Navigation from './Navigation';
import ArtworkDisplay from './ArtworkDisplay';
import SearchAndFilters from './SearchAndFilters';
import Analytics from './Analytics';
import MoveHistory from './MoveHistory';

const DashboardLayout = ({ currentView, setCurrentView }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { loading } = useArtwork();

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'browse':
        return (
          <div className="space-y-6">
            <Navigation />
            <ArtworkDisplay />
          </div>
        );
      case 'search':
        return <SearchAndFilters />;
      case 'analytics':
        return <Analytics />;
      case 'history':
        return <MoveHistory />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-semibold text-secondary-700 mb-2">
            Loading Artwork Collection
          </h2>
          <p className="text-secondary-500">
            Preparing your art management experience...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        
        {/* Top Bar */}
        <TopBar 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          currentView={currentView}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;