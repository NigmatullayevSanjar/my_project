import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  borrowDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  returnDate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('borrowed', 'returned'),
    defaultValue: 'borrowed',
  },
}, {
  tableName: 'transactions',
  timestamps: true,
});
