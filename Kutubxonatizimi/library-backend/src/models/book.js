import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  availableCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'books',
  timestamps: true,
});
