const QRCode = require('qrcode');

const url = 'https://petr-miro-artwork-project-ir2dtib7k-petr-nikolaevs-projects.vercel.app';

QRCode.toString(url, {
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
  console.log('\n📱 URL:', url);
  console.log('\n✨ The QR code will take you to the main app where you can browse all artworks!');
});
