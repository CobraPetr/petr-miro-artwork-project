import React from 'react';
import { motion } from 'framer-motion';
import { useArtwork } from '../context/ArtworkContextDB';

const Analytics = () => {
  const { analytics = {}, artworks = [], loading, error } = useArtwork();

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
        <div className="text-gray-600">Unable to load analytics data</div>
      </div>
    );
  }

  const ChartContainer = ({ title, children, className = "" }) => (
    <motion.div
      className={`bg-white rounded-xl border border-secondary-200 shadow-soft p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">{title}</h3>
      {children}
    </motion.div>
  );

  const StatCard = ({ label, value, change, color = 'primary' }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg p-4`}>
      <div className="text-2xl font-bold text-secondary-900">{value}</div>
      <div className="text-sm text-secondary-600">{label}</div>
      {change && (
        <div className={`text-xs mt-1 ${change.startsWith('+') ? 'text-success-600' : 'text-accent-600'}`}>
          {change}
        </div>
      )}
    </div>
  );

  const valueDistribution = artworks.reduce((acc, artwork) => {
    const range = artwork.value < 10000 ? '<$10K' :
                 artwork.value < 25000 ? '$10K-$25K' :
                 artwork.value < 50000 ? '$25K-$50K' : '$50K+';
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const warehouseDistribution = artworks.reduce((acc, artwork) => {
    const warehouse = `Warehouse ${artwork.warehouse}`;
    acc[warehouse] = (acc[warehouse] || 0) + 1;
    return acc;
  }, {});

  const conditionDistribution = artworks.reduce((acc, artwork) => {
    acc[artwork.condition] = (acc[artwork.condition] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Analytics & Reports</h1>
        <p className="text-primary-100">Comprehensive insights into your artwork collection</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Collection Value"
          value={`$${(analytics.totalValue / 1000000).toFixed(1)}M`}
          change="+12.5% this quarter"
          color="success"
        />
        <StatCard
          label="Average Artwork Value"
          value={`$${Math.round(analytics.averageValue).toLocaleString()}`}
          change="+8.2% vs last month"
          color="primary"
        />
        <StatCard
          label="Storage Utilization"
          value={`${analytics.occupancyRate.toFixed(1)}%`}
          change="+2.1% this month"
          color="yellow"
        />
        <StatCard
          label="Total Artworks"
          value={analytics.totalArtworks}
          change="+15 new pieces"
          color="accent"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Distribution */}
        <ChartContainer title="Collection by Category">
          <div className="space-y-3">
            {Object.entries(analytics.categoryDistribution).map(([category, count], index) => {
              const percentage = (count / analytics.totalArtworks) * 100;
              const colors = ['primary', 'success', 'yellow', 'accent', 'purple', 'pink'];
              const color = colors[index % colors.length];
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 bg-${color}-500 rounded`}></div>
                    <span className="text-sm font-medium text-secondary-700 capitalize">
                      {category.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-2 bg-secondary-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-${color}-500 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-secondary-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartContainer>

        {/* Value Distribution */}
        <ChartContainer title="Value Distribution">
          <div className="space-y-3">
            {Object.entries(valueDistribution).map(([range, count], index) => {
              const percentage = (count / analytics.totalArtworks) * 100;
              const colors = ['green', 'blue', 'yellow', 'red'];
              const color = colors[index % colors.length];
              
              return (
                <div key={range} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 bg-${color}-500 rounded`}></div>
                    <span className="text-sm font-medium text-secondary-700">{range}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-2 bg-secondary-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-${color}-500 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-secondary-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Warehouse Distribution */}
        <ChartContainer title="Storage by Warehouse">
          <div className="space-y-3">
            {Object.entries(warehouseDistribution).map(([warehouse, count], index) => {
              const percentage = (count / analytics.totalArtworks) * 100;
              
              return (
                <div key={warehouse} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-700">{warehouse}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-secondary-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-secondary-600 w-6 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartContainer>

        {/* Condition Assessment */}
        <ChartContainer title="Condition Assessment">
          <div className="space-y-3">
            {Object.entries(conditionDistribution).map(([condition, count], index) => {
              const percentage = (count / analytics.totalArtworks) * 100;
              const color = condition === 'excellent' ? 'success' :
                           condition === 'good' ? 'yellow' :
                           condition === 'fair' ? 'orange' : 'primary';
              
              return (
                <div key={condition} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
                    <span className="text-sm font-medium text-secondary-700 capitalize">{condition}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-secondary-600">{percentage.toFixed(1)}%</span>
                    <span className="text-sm text-secondary-400">({count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartContainer>

        {/* Quick Stats */}
        <ChartContainer title="Quick Statistics">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Most Valuable Piece</span>
              <span className="font-semibold text-secondary-900">
                ${Math.max(...artworks.map(a => a.value)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Oldest Piece</span>
              <span className="font-semibold text-secondary-900">
                {Math.min(...artworks.map(a => a.year))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Newest Addition</span>
              <span className="font-semibold text-secondary-900">
                {new Date(Math.max(...artworks.map(a => new Date(a.dateAdded)))).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Artists Represented</span>
              <span className="font-semibold text-secondary-900">
                {new Set(artworks.map(a => a.artist)).size}
              </span>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Detailed Reports */}
      <ChartContainer title="Detailed Reports" className="lg:col-span-2">
        <div className="grid md:grid-cols-3 gap-4">
          <motion.button
            className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h4 className="font-semibold text-secondary-900">Valuation Report</h4>
            </div>
            <p className="text-sm text-secondary-600">
              Comprehensive valuation analysis with market trends
            </p>
          </motion.button>

          <motion.button
            className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h4 className="font-semibold text-secondary-900">Storage Optimization</h4>
            </div>
            <p className="text-sm text-secondary-600">
              Warehouse utilization and optimization recommendations
            </p>
          </motion.button>

          <motion.button
            className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-semibold text-secondary-900">Movement Analysis</h4>
            </div>
            <p className="text-sm text-secondary-600">
              Track artwork movements and identify patterns
            </p>
          </motion.button>
        </div>
      </ChartContainer>
    </div>
  );
};

export default Analytics;