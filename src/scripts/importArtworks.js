const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { Artwork, Movement, sequelize } = require('../models/index');

class ArtworkImporter {
  constructor(csvFilePath) {
    this.csvFilePath = csvFilePath;
    this.results = [];
    this.errors = [];
    this.batchSize = 100; // Process in batches to avoid memory issues
  }

  // Field mapping - adjust these based on your FileMaker field names
  mapFileMakerFields(row) {
    return {
      // Required fields
      id: row['ID'] || row['Artwork_ID'] || `ART-FM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: row['Title'] || row['Artwork_Title'] || 'Untitled',
      artist: row['Artist'] || row['Artist_Name'] || 'Unknown Artist',
      
      // Optional fields - adjust field names to match your FileMaker database
      category: this.cleanCategory(row['Category'] || row['Type'] || row['Medium_Type']),
      year: this.parseYear(row['Year'] || row['Date_Created'] || row['Creation_Year']),
      medium: row['Medium'] || row['Materials'] || row['Technique'] || '',
      dimensions: row['Dimensions'] || row['Size'] || '',
      value: this.parseValue(row['Value'] || row['Price'] || row['Estimated_Value']),
      condition: this.cleanCondition(row['Condition'] || row['State']),
      status: this.cleanStatus(row['Status'] || row['Location_Status']),
      
      // Location fields
      warehouse: this.parseNumber(row['Warehouse'] || row['Building'] || row['Location_Warehouse']) || 1,
      floor: this.parseNumber(row['Floor'] || row['Level']) || 1,
      shelf: this.parseNumber(row['Shelf'] || row['Section'] || row['Shelf_Number']) || 1,
      box: this.parseNumber(row['Box'] || row['Container']) || 1,
      folder: this.parseNumber(row['Folder'] || row['File']) || 1,
      
      // Additional fields
      description: row['Description'] || row['Notes'] || '',
      provenance: row['Provenance'] || row['History'] || '',
      tags: this.parseTags(row['Tags'] || row['Keywords'] || row['Categories']),
      notes: row['Internal_Notes'] || row['Comments'] || '',
      
      // Image handling
      image_url: this.processImagePath(row['Image'] || row['Photo'] || row['Image_Path']),
      
      // Dates
      date_added: this.parseDate(row['Date_Added'] || row['Entry_Date']) || new Date(),
      last_moved: this.parseDate(row['Last_Moved'] || row['Last_Update']) || new Date(),
    };
  }

  // Helper functions for data cleaning
  cleanCategory(category) {
    if (!category) return 'other';
    const cat = category.toLowerCase().trim();
    const categoryMap = {
      'painting': 'painting',
      'photograph': 'photography',
      'photo': 'photography',
      'sculpture': 'sculpture',
      'digital': 'digital-art',
      'mixed': 'mixed-media',
      'print': 'photography',
      'drawing': 'painting'
    };
    
    for (const [key, value] of Object.entries(categoryMap)) {
      if (cat.includes(key)) return value;
    }
    return 'other';
  }

  cleanCondition(condition) {
    if (!condition) return 'good';
    const cond = condition.toLowerCase().trim();
    if (cond.includes('excellent') || cond.includes('perfect')) return 'excellent';
    if (cond.includes('mint')) return 'mint';
    if (cond.includes('good')) return 'good';
    if (cond.includes('fair') || cond.includes('average')) return 'fair';
    if (cond.includes('poor') || cond.includes('bad') || cond.includes('damaged')) return 'poor';
    return 'good';
  }

  cleanStatus(status) {
    if (!status) return 'available';
    const stat = status.toLowerCase().trim();
    if (stat.includes('storage') || stat.includes('stored')) return 'in-storage';
    if (stat.includes('loan') || stat.includes('lent')) return 'on-loan';
    if (stat.includes('display') || stat.includes('exhibit')) return 'available';
    if (stat.includes('reserved')) return 'reserved';
    if (stat.includes('sold')) return 'sold';
    return 'available';
  }

  parseYear(yearStr) {
    if (!yearStr) return null;
    const year = parseInt(yearStr.toString().replace(/\D/g, ''));
    return (year >= 1000 && year <= new Date().getFullYear()) ? year : null;
  }

  parseValue(valueStr) {
    if (!valueStr) return 0;
    const value = parseFloat(valueStr.toString().replace(/[,$]/g, ''));
    return isNaN(value) ? 0 : value;
  }

  parseNumber(numStr) {
    if (!numStr) return null;
    const num = parseInt(numStr.toString().replace(/\D/g, ''));
    return isNaN(num) ? null : num;
  }

  parseDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  parseTags(tagsStr) {
    if (!tagsStr) return [];
    return tagsStr.toString()
      .split(/[,;|]/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  processImagePath(imagePath) {
    if (!imagePath) return null;
    // If it's a local file path, we'll need to copy images to public folder
    if (imagePath.includes('\\') || imagePath.includes('/')) {
      const filename = path.basename(imagePath);
      return `/images/artworks/${filename}`;
    }
    return imagePath;
  }

  async validateData(artworkData) {
    const errors = [];
    
    if (!artworkData.title || artworkData.title.trim().length === 0) {
      errors.push('Title is required');
    }
    
    if (!artworkData.artist || artworkData.artist.trim().length === 0) {
      errors.push('Artist is required');
    }
    
    if (artworkData.value < 0) {
      errors.push('Value cannot be negative');
    }
    
    return errors;
  }

  async processBatch(batch) {
    const transaction = await sequelize.transaction();
    const processed = [];
    
    try {
      for (const row of batch) {
        try {
          const artworkData = this.mapFileMakerFields(row);
          const validationErrors = await this.validateData(artworkData);
          
          if (validationErrors.length > 0) {
            this.errors.push({
              row: row,
              errors: validationErrors
            });
            continue;
          }
          
          // Check if artwork already exists
          const existingArtwork = await Artwork.findByPk(artworkData.id, { transaction });
          
          if (existingArtwork) {
            // Update existing artwork
            await existingArtwork.update(artworkData, { transaction });
            processed.push({ action: 'updated', id: artworkData.id });
          } else {
                      // Create new artwork
          await Artwork.create(artworkData, { transaction });
          processed.push({ action: 'created', id: artworkData.id });
          }
          
        } catch (error) {
          this.errors.push({
            row: row,
            errors: [error.message]
          });
        }
      }
      
      await transaction.commit();
      return processed;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async import() {
    console.log(`🚀 Starting import from: ${this.csvFilePath}`);
    console.log(`📊 Processing in batches of ${this.batchSize}`);
    
    return new Promise((resolve, reject) => {
      const batch = [];
      let totalProcessed = 0;
      let totalCreated = 0;
      let totalUpdated = 0;
      
      fs.createReadStream(this.csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          batch.push(row);
          
          if (batch.length >= this.batchSize) {
            this.processBatch([...batch])
              .then((results) => {
                totalProcessed += results.length;
                totalCreated += results.filter(r => r.action === 'created').length;
                totalUpdated += results.filter(r => r.action === 'updated').length;
                console.log(`✅ Processed batch: ${totalProcessed} total (${totalCreated} created, ${totalUpdated} updated)`);
              })
              .catch((error) => {
                console.error(`❌ Batch processing error:`, error);
              });
            
            batch.length = 0; // Clear batch
          }
        })
        .on('end', async () => {
          // Process remaining items
          if (batch.length > 0) {
            try {
              const results = await this.processBatch(batch);
              totalProcessed += results.length;
              totalCreated += results.filter(r => r.action === 'created').length;
              totalUpdated += results.filter(r => r.action === 'updated').length;
            } catch (error) {
              console.error(`❌ Final batch processing error:`, error);
            }
          }
          
          const summary = {
            totalProcessed,
            totalCreated,
            totalUpdated,
            totalErrors: this.errors.length,
            errors: this.errors.slice(0, 10) // Show first 10 errors
          };
          
          console.log(`\n🎉 Import completed!`);
          console.log(`📊 Summary: ${totalCreated} created, ${totalUpdated} updated, ${this.errors.length} errors`);
          
          if (this.errors.length > 0) {
            console.log(`⚠️ First 10 errors:`, this.errors.slice(0, 10));
          }
          
          resolve(summary);
        })
        .on('error', (error) => {
          console.error(`❌ CSV reading error:`, error);
          reject(error);
        });
    });
  }
}

// CLI usage
async function runImport() {
  const csvPath = process.argv[2];
  
  if (!csvPath) {
    console.log(`
🎨 Artwork Import Tool

Usage: node src/scripts/importArtworks.js <csv-file-path>

Example: node src/scripts/importArtworks.js ./data/filemaker_export.csv

Make sure your CSV has these column headers (adjust field mapping in the script if needed):
- ID, Title, Artist, Category, Year, Medium, Dimensions, Value
- Condition, Status, Warehouse, Floor, Shelf, Box, Folder
- Description, Provenance, Tags, Image, Date_Added
    `);
    process.exit(1);
  }
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    process.exit(1);
  }
  
  try {
    const importer = new ArtworkImporter(csvPath);
    const summary = await importer.import();
    
    console.log(`\n✅ Import completed successfully!`);
    console.log(JSON.stringify(summary, null, 2));
    
  } catch (error) {
    console.error(`❌ Import failed:`, error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runImport();
}

module.exports = ArtworkImporter;