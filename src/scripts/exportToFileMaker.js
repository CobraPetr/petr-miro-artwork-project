const fs = require('fs');
const path = require('path');
const { Artwork, Movement } = require('../models/index');

class FileMakerExporter {
  constructor(outputPath = 'data/export_to_filemaker.csv') {
    this.outputPath = outputPath;
    this.changes = [];
  }

  // Format data for FileMaker import
  formatForFileMaker(artwork) {
    return {
      // Core identification
      ID: artwork.id,
      Title: artwork.title || '',
      Artist: artwork.artist || '',
      
      // Categorization
      Category: artwork.category || '',
      Year: artwork.year || '',
      Medium: artwork.medium || '',
      Dimensions: artwork.dimensions || '',
      Value: artwork.value || 0,
      
      // Status and condition
      Condition: artwork.condition || 'good',
      Status: this.mapStatusToFileMaker(artwork.status),
      
      // Location
      Warehouse: artwork.warehouse || 1,
      Floor: artwork.floor || 1,
      Shelf: artwork.shelf || 1,
      Box: artwork.box || 1,
      Folder: artwork.folder || 1,
      
      // Descriptive fields
      Description: artwork.description || '',
      Provenance: artwork.provenance || '',
      Tags: Array.isArray(artwork.tags) ? artwork.tags.join(', ') : artwork.tags || '',
      Notes: artwork.notes || '',
      
      // Image
      Image: artwork.image_url ? path.basename(artwork.image_url) : '',
      
      // Dates (format for FileMaker)
      Date_Added: this.formatDateForFileMaker(artwork.date_added),
      Last_Moved: this.formatDateForFileMaker(artwork.last_moved),
      
      // Sync metadata
      Last_Synced: this.formatDateForFileMaker(new Date()),
      Sync_Source: 'WebApp'
    };
  }

  mapStatusToFileMaker(status) {
    const statusMap = {
      'available': 'Available',
      'on-loan': 'On Loan',
      'reserved': 'Reserved',
      'in-storage': 'In Storage',
      'sold': 'Sold'
    };
    return statusMap[status] || 'Available';
  }

  formatDateForFileMaker(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    // FileMaker standard date format: MM/DD/YYYY
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${month}/${day}/${year}`;
  }

  // Convert object to CSV row
  objectToCsvRow(obj) {
    const values = Object.values(obj).map(value => {
      if (value === null || value === undefined) return '';
      
      // Handle strings with commas, quotes, or newlines
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    });
    
    return values.join(',');
  }

  async exportAllArtworks() {
    console.log('🚀 Starting FileMaker export...');
    
    try {
      // Fetch all artworks
      const artworks = await Artwork.findAll({
        order: [['id', 'ASC']]
      });

      console.log(`📊 Found ${artworks.length} artworks to export`);

      if (artworks.length === 0) {
        console.log('⚠️ No artworks found to export');
        return { success: false, message: 'No artworks found' };
      }

      // Format data
      const formattedData = artworks.map(artwork => this.formatForFileMaker(artwork));
      
      // Create CSV content
      const headers = Object.keys(formattedData[0]);
      const csvContent = [
        headers.join(','), // Header row
        ...formattedData.map(row => this.objectToCsvRow(row))
      ].join('\n');

      // Ensure output directory exists
      const outputDir = path.dirname(this.outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write to file
      fs.writeFileSync(this.outputPath, csvContent, 'utf8');

      const stats = {
        totalExported: artworks.length,
        outputFile: this.outputPath,
        fileSize: fs.statSync(this.outputPath).size,
        exportedAt: new Date().toISOString()
      };

      console.log('✅ Export completed successfully!');
      console.log(`📁 File: ${this.outputPath}`);
      console.log(`📊 Records: ${stats.totalExported}`);
      console.log(`💾 Size: ${Math.round(stats.fileSize / 1024)}KB`);

      return { success: true, stats };

    } catch (error) {
      console.error('❌ Export failed:', error);
      return { success: false, error: error.message };
    }
  }

  async exportRecentChanges(hoursAgo = 24) {
    console.log(`🚀 Exporting changes from last ${hoursAgo} hours...`);
    
    try {
      const cutoffDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      
      // Find artworks modified recently
      const recentArtworks = await Artwork.findAll({
        where: {
          [require('sequelize').Op.or]: [
            { updatedAt: { [require('sequelize').Op.gte]: cutoffDate } },
            { last_moved: { [require('sequelize').Op.gte]: cutoffDate } }
          ]
        },
        order: [['updatedAt', 'DESC']]
      });

      console.log(`📊 Found ${recentArtworks.length} recent changes`);

      if (recentArtworks.length === 0) {
        console.log('✅ No recent changes to export');
        return { success: true, stats: { totalExported: 0 } };
      }

      // Format and export
      const formattedData = recentArtworks.map(artwork => this.formatForFileMaker(artwork));
      
      const headers = Object.keys(formattedData[0]);
      const csvContent = [
        headers.join(','),
        ...formattedData.map(row => this.objectToCsvRow(row))
      ].join('\n');

      // Create timestamped filename for changes
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const changesPath = `data/filemaker_changes_${timestamp}.csv`;
      
      fs.writeFileSync(changesPath, csvContent, 'utf8');

      const stats = {
        totalExported: recentArtworks.length,
        outputFile: changesPath,
        cutoffDate: cutoffDate.toISOString(),
        exportedAt: new Date().toISOString()
      };

      console.log(`✅ Changes exported to: ${changesPath}`);
      console.log(`📊 Records: ${stats.totalExported}`);

      return { success: true, stats };

    } catch (error) {
      console.error('❌ Changes export failed:', error);
      return { success: false, error: error.message };
    }
  }

  async generateSyncReport() {
    try {
      // Get database statistics
      const totalArtworks = await Artwork.count();
      const recentChanges = await Artwork.count({
        where: {
          updatedAt: {
            [require('sequelize').Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      });

      const recentMovements = await Movement.count({
        where: {
          timestamp: {
            [require('sequelize').Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      });

      const report = {
        generatedAt: new Date().toISOString(),
        database: {
          totalArtworks,
          recentChanges: recentChanges,
          recentMovements: recentMovements
        },
        sync: {
          status: 'ready',
          lastExport: 'pending',
          nextSync: 'manual'
        },
        instructions: {
          step1: 'Export completed - CSV file ready',
          step2: 'Import CSV into FileMaker 21',
          step3: 'Verify changes in FileMaker',
          step4: 'Confirm sync completion'
        }
      };

      console.log('\n📋 SYNC REPORT');
      console.log('═══════════════');
      console.log(`📊 Total Artworks: ${totalArtworks}`);
      console.log(`🔄 Recent Changes: ${recentChanges}`);
      console.log(`📦 Recent Movements: ${recentMovements}`);
      console.log(`⏰ Generated: ${new Date().toLocaleString()}`);

      return report;

    } catch (error) {
      console.error('❌ Report generation failed:', error);
      return { error: error.message };
    }
  }
}

// CLI usage
async function runExport() {
  const command = process.argv[2] || 'all';
  const exporter = new FileMakerExporter();

  try {
    let result;

    switch (command) {
      case 'all':
        result = await exporter.exportAllArtworks();
        break;
      
      case 'changes':
        const hours = parseInt(process.argv[3]) || 24;
        result = await exporter.exportRecentChanges(hours);
        break;
      
      case 'report':
        result = await exporter.generateSyncReport();
        break;
      
      default:
        console.log(`
🎨 FileMaker Export Tool

Usage: node src/scripts/exportToFileMaker.js <command> [options]

Commands:
  all                    Export all artworks to CSV
  changes [hours]        Export recent changes (default: 24 hours)
  report                 Generate sync status report

Examples:
  node src/scripts/exportToFileMaker.js all
  node src/scripts/exportToFileMaker.js changes 48
  node src/scripts/exportToFileMaker.js report
        `);
        return;
    }

    if (result && result.success !== false) {
      console.log('\n🎉 Export completed successfully!');
      if (result.stats) {
        console.log('📊 Stats:', JSON.stringify(result.stats, null, 2));
      }
    } else {
      console.error('\n❌ Export failed');
      if (result && result.error) {
        console.error('Error:', result.error);
      }
    }

  } catch (error) {
    console.error('❌ Export error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runExport();
}

module.exports = FileMakerExporter;