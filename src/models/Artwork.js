const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Artwork = sequelize.define('Artwork', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM([
      'painting', 'sculpture', 'photography', 'digital-art', 
      'mixed-media', 'street-art', 'abstract', 'illustration', 
      'installation', 'graphic-design'
    ]),
    allowNull: false,
    defaultValue: 'painting',
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  medium: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dimensions: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  condition: {
    type: DataTypes.ENUM(['excellent', 'good', 'fair', 'poor', 'mint']),
    defaultValue: 'good',
  },
  status: {
    type: DataTypes.ENUM(['available', 'on-loan', 'reserved', 'in-storage', 'sold']),
    defaultValue: 'available',
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  warehouse: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 3,
    },
  },
  shelf: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 30,
    },
  },
  box: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
    },
  },
  folder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  date_added: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_moved: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  provenance: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'artworks',
  indexes: [
    {
      fields: ['warehouse', 'floor', 'shelf', 'box', 'folder'],
    },
    {
      fields: ['artist'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['value'],
    },
  ],
});

module.exports = Artwork;