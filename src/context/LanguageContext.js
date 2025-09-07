import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    'nav.warehouses': 'Warehouses',
    'nav.artworks': 'All Artworks',
    'nav.settings': 'Settings',
    
    // Header
    'header.title': 'Artwork Organizer',
    'header.subtitle': 'Manage your art collection',
    'header.qr_scanner': '📱 QR Scanner',
    'header.generate_qr': '🔗 Generate QR',
    
    // Artworks List
    'artworks.title': 'ARTWORK COLLECTION',
    'artworks.subtitle': 'Browse and manage your complete art inventory',
    'artworks.search_placeholder': 'Search by title, artist or category...',
    'artworks.results_count': 'of artworks',
    'artworks.no_results': 'No artworks found matching your search criteria.',
    'artworks.no_artworks': 'No artworks found in database.',
    'artworks.loading': 'Loading artworks...',
    'artworks.medium': 'Medium:',
    'artworks.size': 'Size:',
    'artworks.condition': 'Condition:',
    'artworks.location': 'Location:',
    'artworks.not_specified': 'Not specified',
    
    // Warehouse View
    'warehouse.title': 'STORAGE LOCATIONS',
    'warehouse.select_warehouse': 'Select Warehouse',
    'warehouse.floor': 'Floor',
    'warehouse.shelf': 'Shelf',
    'warehouse.box': 'Box',
    'warehouse.folder': 'Folder',
    'warehouse.artworks_at_location': 'Artworks at this location',
    'warehouse.no_artworks': 'No artworks at this location',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.data_source': 'Data Source',
    'settings.csv_import': 'CSV Import',
    'settings.import_csv': 'Import CSV File',
    'settings.csv_file_selected': 'CSV file selected',
    'settings.import_success': 'CSV imported successfully',
    'settings.import_error': 'Error importing CSV',
    'settings.clear_csv': 'Clear CSV Data',
    'settings.use_database': 'Use Database',
    'settings.use_csv': 'Use CSV File',
    
    // Common
    'common.search': 'Search',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  
  de: {
    // Navigation
    'nav.warehouses': 'Lagerhäuser',
    'nav.artworks': 'Alle Kunstwerke',
    'nav.settings': 'Einstellungen',
    
    // Header
    'header.title': 'Kunstwerk-Organizer',
    'header.subtitle': 'Verwalten Sie Ihre Kunstsammlung',
    'header.qr_scanner': '📱 QR Scanner',
    'header.generate_qr': '🔗 QR generieren',
    
    // Artworks List
    'artworks.title': 'KUNSTWERK-SAMMLUNG',
    'artworks.subtitle': 'Durchsuchen und verwalten Sie Ihr komplettes Kunstinventar',
    'artworks.search_placeholder': 'Nach Titel, Künstler oder Kategorie suchen...',
    'artworks.results_count': 'von Kunstwerken',
    'artworks.no_results': 'Keine Kunstwerke gefunden, die Ihren Suchkriterien entsprechen.',
    'artworks.no_artworks': 'Keine Kunstwerke in der Datenbank gefunden.',
    'artworks.loading': 'Kunstwerke werden geladen...',
    'artworks.medium': 'Medium:',
    'artworks.size': 'Größe:',
    'artworks.condition': 'Zustand:',
    'artworks.location': 'Standort:',
    'artworks.not_specified': 'Nicht angegeben',
    
    // Warehouse View
    'warehouse.title': 'LAGERSTANDORTE',
    'warehouse.select_warehouse': 'Lagerhaus auswählen',
    'warehouse.floor': 'Etage',
    'warehouse.shelf': 'Regal',
    'warehouse.box': 'Kiste',
    'warehouse.folder': 'Ordner',
    'warehouse.artworks_at_location': 'Kunstwerke an diesem Standort',
    'warehouse.no_artworks': 'Keine Kunstwerke an diesem Standort',
    
    // Settings
    'settings.title': 'Einstellungen',
    'settings.language': 'Sprache',
    'settings.data_source': 'Datenquelle',
    'settings.csv_import': 'CSV-Import',
    'settings.import_csv': 'CSV-Datei importieren',
    'settings.csv_file_selected': 'CSV-Datei ausgewählt',
    'settings.import_success': 'CSV erfolgreich importiert',
    'settings.import_error': 'Fehler beim CSV-Import',
    'settings.clear_csv': 'CSV-Daten löschen',
    'settings.use_database': 'Datenbank verwenden',
    'settings.use_csv': 'CSV-Datei verwenden',
    
    // Common
    'common.search': 'Suchen',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.close': 'Schließen',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolgreich',
    'common.confirm': 'Bestätigen',
    'common.yes': 'Ja',
    'common.no': 'Nein',
  },
  
  cs: {
    // Navigation
    'nav.warehouses': 'Sklady',
    'nav.artworks': 'Všechna umělecká díla',
    'nav.settings': 'Nastavení',
    
    // Header
    'header.title': 'Organizátor uměleckých děl',
    'header.subtitle': 'Spravujte svou uměleckou sbírku',
    'header.qr_scanner': '📱 QR Scanner',
    'header.generate_qr': '🔗 Generovat QR',
    
    // Artworks List
    'artworks.title': 'SBÍRKA UMĚLECKÝCH DĚL',
    'artworks.subtitle': 'Procházejte a spravujte svůj kompletní umělecký inventář',
    'artworks.search_placeholder': 'Hledat podle názvu, umělce nebo kategorie...',
    'artworks.results_count': 'z uměleckých děl',
    'artworks.no_results': 'Nebyla nalezena žádná umělecká díla odpovídající vašim kritériím vyhledávání.',
    'artworks.no_artworks': 'V databázi nebyla nalezena žádná umělecká díla.',
    'artworks.loading': 'Načítání uměleckých děl...',
    'artworks.medium': 'Médium:',
    'artworks.size': 'Velikost:',
    'artworks.condition': 'Stav:',
    'artworks.location': 'Umístění:',
    'artworks.not_specified': 'Nespecifikováno',
    
    // Warehouse View
    'warehouse.title': 'UMÍSTĚNÍ SKLADŮ',
    'warehouse.select_warehouse': 'Vybrat sklad',
    'warehouse.floor': 'Patro',
    'warehouse.shelf': 'Police',
    'warehouse.box': 'Krabice',
    'warehouse.folder': 'Složka',
    'warehouse.artworks_at_location': 'Umělecká díla na tomto místě',
    'warehouse.no_artworks': 'Na tomto místě nejsou žádná umělecká díla',
    
    // Settings
    'settings.title': 'Nastavení',
    'settings.language': 'Jazyk',
    'settings.data_source': 'Zdroj dat',
    'settings.csv_import': 'Import CSV',
    'settings.import_csv': 'Importovat CSV soubor',
    'settings.csv_file_selected': 'CSV soubor vybrán',
    'settings.import_success': 'CSV úspěšně importován',
    'settings.import_error': 'Chyba při importu CSV',
    'settings.clear_csv': 'Vymazat CSV data',
    'settings.use_database': 'Použít databázi',
    'settings.use_csv': 'Použít CSV soubor',
    
    // Common
    'common.search': 'Hledat',
    'common.cancel': 'Zrušit',
    'common.save': 'Uložit',
    'common.close': 'Zavřít',
    'common.loading': 'Načítání...',
    'common.error': 'Chyba',
    'common.success': 'Úspěch',
    'common.confirm': 'Potvrdit',
    'common.yes': 'Ano',
    'common.no': 'Ne',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('artwork-app-language') || 'en';
  });
  
  const [csvData, setCsvData] = useState(() => {
    const saved = localStorage.getItem('artwork-app-csv-data');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [useCsvMode, setUseCsvMode] = useState(() => {
    return localStorage.getItem('artwork-app-use-csv') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('artwork-app-language', language);
  }, [language]);

  useEffect(() => {
    if (csvData) {
      localStorage.setItem('artwork-app-csv-data', JSON.stringify(csvData));
    } else {
      localStorage.removeItem('artwork-app-csv-data');
    }
  }, [csvData]);

  useEffect(() => {
    localStorage.setItem('artwork-app-use-csv', useCsvMode.toString());
  }, [useCsvMode]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const importCsvData = (csvContent) => {
    try {
      const lines = csvContent.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      console.log('CSV Headers:', headers);
      
      // Find the required columns - exact match first, then partial
      let locationIndex = headers.findIndex(h => h === 'Artwork_Location');
      let artistIndex = headers.findIndex(h => h === 'Artist_Name');
      let artworkIndex = headers.findIndex(h => h === 'Artwork_Name');
      
      // Fallback to partial matching
      if (locationIndex === -1) {
        locationIndex = headers.findIndex(h => h.toLowerCase().includes('location'));
      }
      if (artistIndex === -1) {
        artistIndex = headers.findIndex(h => h.toLowerCase().includes('artist'));
      }
      if (artworkIndex === -1) {
        artworkIndex = headers.findIndex(h => h.toLowerCase().includes('artwork') || h.toLowerCase().includes('title') || h.toLowerCase().includes('name'));
      }
      
      console.log('Column indices:', { locationIndex, artistIndex, artworkIndex });
      
      if (locationIndex === -1 || artistIndex === -1 || artworkIndex === -1) {
        throw new Error('Required columns not found. Please ensure your CSV has columns: Artwork_Location, Artist_Name, Artwork_Name');
      }
      
      const artworks = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Handle CSV parsing more carefully - split by comma but respect quotes
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        
        const location = (values[locationIndex] || '').replace(/"/g, '');
        const artist = (values[artistIndex] || '').replace(/"/g, '');
        const artworkName = (values[artworkIndex] || '').replace(/"/g, '');
        
        // Skip empty rows or rows with missing essential data
        if (!artist && !artworkName) continue;
        
        // Skip rows where both artist and artwork name are just "X" or "Nan"
        if ((artist === 'X' || artist === 'Nan') && (artworkName === 'X' || artworkName === 'Nan')) continue;
        
        artworks.push({
          id: `csv-${i}`,
          title: artworkName || 'Untitled',
          artist: artist || 'Unknown Artist',
          warehouse: location || 'Not specified',
          floor: null,
          shelf: null,
          box: null,
          folder: null,
          category: 'Imported',
          status: 'Available',
          year: null,
          medium: null,
          dimensions: null,
          condition: null,
          description: null,
          image_url: null,
          tags: ['csv-import'],
          isCsvImport: true
        });
      }
      
      setCsvData(artworks);
      return { success: true, count: artworks.length };
    } catch (error) {
      console.error('CSV import error:', error);
      return { success: false, error: error.message };
    }
  };

  const clearCsvData = () => {
    setCsvData(null);
    setUseCsvMode(false);
  };

  const value = {
    language,
    setLanguage,
    t,
    csvData,
    setCsvData,
    useCsvMode,
    setUseCsvMode,
    importCsvData,
    clearCsvData,
    availableLanguages: [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'Deutsch' },
      { code: 'cs', name: 'Čeština' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
