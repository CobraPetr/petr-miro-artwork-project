const QRCode = require('qrcode');

// Generate QR code for a random artwork
const artworkUrl = 'https://petr-miro-artwork-project-ir2dtib7k-petr-nikolaevs-projects.vercel.app/artwork/ART-92';
const artworkTitle = 'Artwork 92';

QRCode.toDataURL(artworkUrl, {
  width: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, (err, url) => {
  if (err) {
    console.error('Error generating QR code:', err);
    return;
  }
  
  console.log('QR Code generated successfully!');
  console.log('Artwork URL:', artworkUrl);
  console.log('Artwork Title:', artworkTitle);
  console.log('\nQR Code Data URL (you can use this in an image tag):');
  console.log(url);
  
  // Also save as file
  const fs = require('fs');
  const base64Data = url.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('artwork_qr.png', base64Data, 'base64');
  console.log('\nQR Code saved as: artwork_qr.png');
});
