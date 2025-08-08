import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          🎨 Kunstwerk-Organizer
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Demo-Modus</h2>
          <p className="text-gray-600 mb-4">
            Die App läuft im Demo-Modus, da keine Datenbankverbindung verfügbar ist.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Lagerhaus 1</h3>
              <p className="text-sm text-blue-600">Etage 1, Regal 5, Box 2, Ordner 3</p>
              <p className="text-sm font-medium mt-2">Abstrakte Komposition</p>
              <p className="text-xs text-gray-500">Max Mustermann, 2023</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Lagerhaus 2</h3>
              <p className="text-sm text-green-600">Etage 1, Regal 8, Box 1, Ordner 1</p>
              <p className="text-sm font-medium mt-2">Bronzeskulptur</p>
              <p className="text-xs text-gray-500">Anna Schmidt, 2022</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Lagerhaus 1</h3>
              <p className="text-sm text-purple-600">Etage 2, Regal 12, Box 4, Ordner 2</p>
              <p className="text-sm font-medium mt-2">Landschaftsaquarell</p>
              <p className="text-xs text-gray-500">Peter Wagner, 2024</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700">App erfolgreich geladen</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-700">Demo-Daten aktiv</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-700">Datenbank nicht verbunden</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;