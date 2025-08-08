import React from 'react';
import { motion } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';

const Dashboard = () => {
  const { artworks = [], moveHistory = [], loading, error } = useArtwork();

  const recentArtworks = artworks.slice(0, 6);
  const recentMoves = moveHistory.slice(-5);

  // Always show something, even when loading
  console.log('Dashboard render:', { artworks: artworks.length, loading, error });

  // Simple fallback for immediate display
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎨 Petr Miro Artwork Manager</h1>
          <div className="text-xl text-gray-600">Loading your collection...</div>
          <div className="mt-8 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-red-800 mb-4">⚠️ Connection Error</h1>
          <div className="text-xl text-red-600">{error}</div>
          <div className="mt-4 text-gray-600">Please check your database connection</div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon, color = 'primary', trend }) => (
    <motion.div
      className="bg-white p-6 rounded-xl border border-secondary-200 shadow-soft hover:shadow-medium transition-all duration-300"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-secondary-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.direction === 'up' ? 'text-success-600' : 'text-accent-600'
            }`}>
              <svg className={`w-4 h-4 mr-1 ${trend.direction === 'down' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5 5 5-5" />
              </svg>
              {trend.value}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br from-${color}-100 to-${color}-200 rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const CategoryChart = () => {
    const categories = [
      ['painting', 5], 
      ['photography', 4], 
      ['sculpture', 3],
      ['digital-art', 2],
      ['mixed-media', 1]
    ];
    const total = categories.reduce((sum, [_, count]) => sum + count, 0);

    return (
      <motion.div
        className="bg-white p-6 rounded-xl border border-secondary-200 shadow-soft"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Collection by Category</h3>
        <div className="space-y-3">
          {categories.map(([category, count], index) => {
            const percentage = (count / total) * 100;
            const colors = ['primary', 'accent', 'success', 'yellow', 'purple'];
            const color = colors[index % colors.length];
            
            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
                  <span className="text-sm font-medium text-secondary-700 capitalize">
                    {category.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-${color}-500 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                  <span className="text-sm text-secondary-600 w-8 text-right">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const RecentActivity = () => (
    <motion.div
      className="bg-white p-6 rounded-xl border border-secondary-200 shadow-soft"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentMoves.length > 0 ? (
          recentMoves.map((move, index) => (
            <div key={move.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">{move.artwork_title}</p>
                <p className="text-xs text-secondary-500">
                  Moved to W{move.to_warehouse}-F{move.to_floor}-S{move.to_shelf}
                </p>
              </div>
              <div className="text-xs text-secondary-400">
                {new Date(move.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-secondary-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const QuickActions = () => (
    <motion.div
      className="bg-white p-6 rounded-xl border border-secondary-200 shadow-soft"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center space-x-2 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-sm font-medium text-primary-700">Add Artwork</span>
        </button>
        <button className="flex items-center space-x-2 p-3 bg-success-50 rounded-lg hover:bg-success-100 transition-colors">
          <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-sm font-medium text-success-700">Generate Report</span>
        </button>
        <button className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm font-medium text-yellow-700">Advanced Search</span>
        </button>
        <button className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span className="text-sm font-medium text-purple-700">Bulk Move</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Petr!</h1>
            <p className="text-primary-100 text-lg">
              Your collection has {artworks.length} pieces and is valued at ${((380000) / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Artworks"
          value={artworks.length}
          subtitle="In collection"
          icon={
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          trend={{ direction: 'up', value: '+12% this month' }}
        />
        
        <StatCard
          title="Collection Value"
          value={`$${(380000 / 1000).toFixed(0)}K`}
          subtitle="Total estimated value"
          icon={
            <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          color="success"
          trend={{ direction: 'up', value: '+8.2% this quarter' }}
        />
        
        <StatCard
          title="Storage Utilization"
          value={`75.5%`}
          subtitle="Of total capacity"
          icon={
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          color="yellow"
        />
        
        <StatCard
          title="Recent Moves"
          value={moveHistory.length}
          subtitle="This month"
          icon={
            <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
          color="accent"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Recent Artworks */}
      <motion.div
        className="bg-white rounded-xl border border-secondary-200 shadow-soft p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recently Added Artworks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden rounded-lg bg-secondary-100 aspect-[4/3]">
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-semibold text-sm truncate">{artwork.title}</h4>
                  <p className="text-xs opacity-90">{artwork.artist}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;