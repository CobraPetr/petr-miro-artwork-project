const { Artwork } = require('../../src/models');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const artworks = await Artwork.findAll({
        order: [['created_at', 'DESC']],
      });
      res.json(artworks);
    } else if (req.method === 'POST') {
      const artworkData = req.body;
      
      // Generate unique ID if not provided
      if (!artworkData.id) {
        artworkData.id = `ART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      
      // Set default values for required fields
      const artwork = await Artwork.create({
        ...artworkData,
        date_added: new Date(),
        last_moved: new Date(),
      });
      
      res.status(201).json({ message: 'Artwork created successfully', artwork });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in artworks API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
