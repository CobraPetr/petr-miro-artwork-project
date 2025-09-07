const QRCode = require('qrcode');

// Create a simple QR code that points to the main app
const appUrl = 'https://petr-miro-artwork-project-ir2dtib7k-petr-nikolaevs-projects.vercel.app';

QRCode.toString(appUrl, {
  type: 'terminal',
  small: true
}, (err, qrString) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('\n🎨 ARTWORK QR CODE:');
  console.log('Scan this QR code to open the artwork app:');
  console.log(qrString);
  console.log('\n📱 URL:', appUrl);
  console.log('\n✨ The QR code will take you to the main app where you can browse all artworks!');
});
