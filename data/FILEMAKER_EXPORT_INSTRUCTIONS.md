# FileMaker 21 Export Instructions

## Step 1: Export Your Data from FileMaker

1. **Open your FileMaker artwork database**
2. **Go to File → Export Records...**
3. **Choose CSV format** (.csv)
4. **Save as**: `filemaker_artworks_export.csv` in the `data` folder of this project
5. **Field Order**: Make sure to export fields in this order (or adjust the import script):

### Required Fields (adjust names to match your FileMaker fields):
```
ID                 - Unique artwork identifier
Title              - Artwork title/name
Artist             - Artist name
Category           - Type/medium (painting, sculpture, etc.)
Year               - Creation year
Medium             - Materials/technique
Dimensions         - Size (e.g., "24x36 inches")
Value              - Monetary value (numbers only, no currency symbols)
Condition          - Physical condition (excellent, good, fair, poor)
Status             - Current status (on-display, in-storage, on-loan, etc.)
```

### Location Fields:
```
Warehouse          - Warehouse number (1, 2, 3, etc.)
Floor              - Floor level
Shelf              - Shelf number
Box                - Box/container number
Folder             - Folder number
```

### Optional Fields:
```
Description        - Detailed description
Provenance         - History/origin information
Tags               - Keywords (comma-separated)
Image              - Image file path/name
Date_Added         - When added to collection
Last_Moved         - Last movement date
Internal_Notes     - Private notes
```

## Step 2: Prepare Images (if you have them)

1. **Export/Copy all artwork images** to: `public/images/artworks/`
2. **Supported formats**: JPG, PNG, GIF, WebP
3. **Naming**: Use consistent naming (e.g., artwork_id.jpg)
4. **Size**: Optimize for web (recommended max 1920px wide)

### Image Export Options:
- **Option A**: Copy images manually to `public/images/artworks/`
- **Option B**: Update the CSV Image column with just filenames (e.g., "artwork_001.jpg")
- **Option C**: Use full paths in CSV, we'll copy them during import

## Step 3: Run the Import

Once you have your CSV file in the `data` folder:

```bash
# Test with a small sample first (edit your CSV to include only ~10 records)
node src/scripts/importArtworks.js data/filemaker_artworks_export.csv

# If successful, run the full import
node src/scripts/importArtworks.js data/filemaker_artworks_export.csv
```

## Common FileMaker Field Name Variations

The import script tries to handle different field names automatically:

| Our Field | Common FileMaker Names |
|-----------|------------------------|
| ID | ID, Artwork_ID, Record_ID |
| Title | Title, Artwork_Title, Name |
| Artist | Artist, Artist_Name, Creator |
| Category | Category, Type, Medium_Type |
| Year | Year, Date_Created, Creation_Year |
| Value | Value, Price, Estimated_Value |
| Warehouse | Warehouse, Building, Location_Warehouse |
| Image | Image, Photo, Image_Path |

## Troubleshooting

### If import fails:
1. **Check CSV format**: Ensure proper comma separation and quotes around text with commas
2. **Check required fields**: ID, Title, and Artist are required
3. **Check data types**: Year should be numbers, Value should be numbers
4. **Check file path**: Make sure CSV is in the `data` folder

### Field Mapping Issues:
Edit `src/scripts/importArtworks.js` in the `mapFileMakerFields()` function to match your exact field names.

### Memory Issues (for large datasets):
The script processes in batches of 100. For very large datasets (10,000+), you might need to:
1. Split your CSV into smaller files
2. Import in chunks
3. Monitor database performance

## Example Export Settings in FileMaker:

1. **Records**: All records or Found Set
2. **Format**: Comma-Separated Text (CSV)
3. **Character Set**: UTF-8
4. **Include field names**: YES (first row)
5. **Don't format dates**: Use ISO format (YYYY-MM-DD)

## After Import:

1. **Verify data**: Check a few records in the web app
2. **Check analytics**: Visit the analytics page to see import statistics
3. **Test search**: Try searching for specific artworks
4. **Backup**: Consider backing up your PostgreSQL database after successful import

## Need Help?

If you encounter issues:
1. Check the console output for specific error messages
2. Look at the first few rows of your CSV to ensure proper formatting
3. Test with a small sample (10-20 records) first
4. The script shows detailed progress and error information