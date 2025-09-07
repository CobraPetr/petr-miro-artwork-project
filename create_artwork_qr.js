const QRCode = require('qrcode');
const { Artwork } = require('./src/models');

const createArtworkQR = async () => {
  try {
    // Get the first artwork
    const firstArtwork = await Artwork.findOne({
      order: [['created_at', 'ASC']]
    });

    if (!firstArtwork) {
      console.log('❌ No artworks found in database');
      return;
    }

    console.log('🎨 Found first artwork:', firstArtwork.title);
    console.log('📝 Artist:', firstArtwork.artist);
    console.log('🏢 Location:', firstArtwork.warehouse);

    // Create URL that will open the artwork details
    const artworkUrl = `https://petr-miro-artwork-project-ir2dtib7k-petr-nikolaevs-projects.vercel.app/artwork/${firstArtwork.id}`;
    
    console.log('🔗 Artwork URL:', artworkUrl);

    // Generate QR code
    const qrString = await QRCode.toString(artworkUrl, {
      type: 'terminal',
      small: true
    });

    console.log('\n🎨 ARTWORK QR CODE:');
    console.log('Scan this QR code to view artwork details:');
    console.log(qrString);
    console.log('\n📱 URL:', artworkUrl);
    console.log('\n✨ When scanned, this will open the artwork details for:', firstArtwork.title);

    // Also save as PNG
    const qrDataURL = await QRCode.toDataURL(artworkUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const fs = require('fs');
    const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync('first_artwork_qr.png', base64Data, 'base64');
    console.log('\n💾 QR code saved as: first_artwork_qr.png');

  } catch (error) {
    console.error('❌ Error creating artwork QR:', error);
  } finally {
    process.exit(0);
  }
};

createArtworkQR();
