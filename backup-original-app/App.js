import React, { useState } from 'react';
import { ArtworkProvider } from './context/ArtworkContextDB';
import DashboardLayout from './components/DashboardLayout';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <ArtworkProvider>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100">
        <DashboardLayout currentView={currentView} setCurrentView={setCurrentView} />
      </div>
    </ArtworkProvider>
  );
}

export default App;