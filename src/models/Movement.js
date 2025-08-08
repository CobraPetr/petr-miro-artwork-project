const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Movement = sequelize.define('Movement', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  artwork_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'artworks',
      key: 'id',
    },
  },
  artwork_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  from_warehouse: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  from_floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  from_shelf: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  from_box: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  from_folder: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  to_warehouse: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  to_floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  to_shelf: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  to_box: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  to_folder: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  moved_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'movements',
  indexes: [
    {
      fields: ['artwork_id'],
    },
    {
      fields: ['timestamp'],
    },
    {
      fields: ['moved_by'],
    },
  ],
});

module.exports = Movement;