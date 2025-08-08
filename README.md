# ArtVault Professional - Enhanced Artwork Management System

A sophisticated, enterprise-grade web application for comprehensive artwork inventory management across multiple warehouse locations.

## 🎨 Advanced Features

### **Dashboard & Analytics**
- **Real-time Analytics**: Comprehensive insights into collection value, distribution, and trends
- **Interactive Dashboard**: Visual overview with key metrics and recent activity
- **Smart Reporting**: Automated valuation reports and storage optimization recommendations

### **Enhanced Navigation & Search**
- **Hierarchical Navigation**: Navigate through 5 warehouses, each with 3 floors, 30 shelves per floor, 10 boxes per shelf, and 5 folders per box (22,500 total locations)
- **Advanced Search**: Multi-criteria filtering by category, status, artist, value range, and more
- **Smart Filters**: Dynamic filtering with real-time results
- **Multiple View Modes**: Grid and list views with customizable sorting

### **Professional Artwork Management**
- **Detailed Metadata**: Complete artwork information including artist, medium, dimensions, provenance, condition, and value
- **Movement Tracking**: Comprehensive history of all artwork relocations with timestamps and notes
- **Favorites System**: Mark and organize preferred pieces
- **Bulk Operations**: Move multiple artworks simultaneously

### **Modern UI/UX Design**
- **Premium Design System**: Professional color palette with primary blues, secondary grays, and accent colors
- **Smooth Animations**: Framer Motion powered micro-interactions and transitions
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility First**: WCAG compliant with proper focus management and screen reader support

### **Data Management & Export**
- **Enhanced CSV Export**: Complete artwork data with all metadata for FileMaker integration
- **Movement History Export**: Detailed tracking reports for audit and compliance
- **Real-time Synchronization**: Immediate updates across all views and components

## 🎯 Design Philosophy

- **Colors**: Sophisticated gradient backgrounds, clean whites, professional blues (#0ea5e9), and subtle grays
- **Typography**: Inter font family for optimal readability and modern appearance
- **Animations**: Purposeful motion design that enhances user experience without distraction
- **Layout**: Card-based design with consistent spacing, clear hierarchy, and intuitive navigation

## 🛠 Technology Stack

- **Frontend**: React 18 with Hooks and Context API (Port 3001)
- **Backend**: Express.js API server (Port 5000)
- **Database**: PostgreSQL with Sequelize ORM
- **Styling**: TailwindCSS with custom design system
- **Animations**: Framer Motion for smooth interactions
- **Data Management**: Full CRUD operations with real-time synchronization

## Getting Started

### Prerequisites
- PostgreSQL installed and running
- Node.js 16+ and npm

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database:**
   ```bash
   npm run setup-db
   ```

3. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```
   This starts:
   - API server on http://localhost:5000
   - React frontend on http://localhost:3001

4. **Alternative - Start individually:**
   ```bash
   # Backend only
   npm run server

   # Frontend only  
   npm start
   ```

## Usage

1. **Navigate**: Use the location selectors to choose Warehouse → Floor → Shelf → Box → Folder
2. **View Artworks**: See all artworks stored in the selected location
3. **Move Artworks**: Click "Move Artwork" to relocate items to different locations
4. **Export Data**: Use the "Export to FileMaker" button to download a CSV file

## Database Schema

### Artworks Table
Complete artwork records with rich metadata:
- **Basic Info**: ID, title, artist, year, medium, dimensions
- **Financial**: Value, condition, status (available/on-loan/reserved/in-storage/sold)
- **Location**: Warehouse (1-5), Floor (1-3), Shelf (1-30), Box (1-10), Folder (1-5)
- **Metadata**: Tags, description, provenance, notes, dates
- **Categories**: Painting, sculpture, photography, digital-art, mixed-media, street-art, abstract, illustration, installation, graphic-design

### Movement History
- Complete audit trail of all artwork relocations
- Timestamps, notes, and movement tracking
- Historical location data for compliance

## FileMaker Integration

The system exports data in CSV format compatible with FileMaker 21:
- Headers: ID, Title, ImageURL, Warehouse, Floor, Shelf, Box, Folder
- UTF-8 encoding for proper character support
- Manual import process into FileMaker

## Project Structure

```
src/
├── api/
│   └── server.js              # Express API server with PostgreSQL
├── components/
│   ├── Analytics.js           # Real-time analytics dashboard
│   ├── ArtworkDisplay.js      # Artwork grid display with animations
│   ├── Dashboard.js           # Main dashboard interface
│   ├── DashboardLayout.js     # Layout wrapper component
│   ├── Header.js              # Header with export functionality
│   ├── MoveArtworkModal.js    # Modal for moving artworks
│   ├── MoveHistory.js         # Movement history display
│   ├── Navigation.js          # Location navigation interface
│   ├── SearchAndFilters.js    # Advanced search and filtering
│   ├── Sidebar.js             # Navigation sidebar
│   └── TopBar.js              # Top navigation bar
├── config/
│   ├── database.js            # PostgreSQL connection config
│   └── env.js                 # Environment configuration
├── context/
│   └── ArtworkContextDB.js    # Database-connected React context
├── models/
│   ├── Artwork.js             # Sequelize artwork model
│   ├── Movement.js            # Sequelize movement tracking model
│   └── index.js               # Model exports
├── scripts/
│   └── setupDatabase.js       # Database initialization script
├── services/
│   ├── ApiService.js          # Frontend API service layer
│   └── DatabaseService.js     # Database service utilities
├── App.js                     # Main application component
├── index.js                   # Application entry point
└── index.css                  # Global styles and Tailwind imports
```

## Current Status

✅ **Fully Implemented:**
- PostgreSQL database with 15+ artworks
- Complete movement tracking system
- Real-time analytics dashboard
- Advanced search and filtering
- CSV export for FileMaker integration
- Bulk move operations
- Professional UI with animations
- Multi-warehouse location management

## Future Enhancements

- User authentication and role-based access
- Barcode scanning integration
- Advanced reporting and insights
- Image upload and management
- Artwork condition monitoring
- Insurance and valuation tracking
