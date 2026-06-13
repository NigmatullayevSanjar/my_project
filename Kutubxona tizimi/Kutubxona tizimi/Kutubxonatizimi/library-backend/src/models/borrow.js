import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './user.js';
import { Book } from './book.js';

export const Borrow = sequelize.define('Borrow', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'requested', // requested -> borrowed -> returned
  },
  borrowedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dueAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  returnedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'borrows',
  timestamps: true,
});

// 🔗 Assotsiatsiyalar
Borrow.belongsTo(User, { foreignKey: 'userId' });
Borrow.belongsTo(Book, { foreignKey: 'bookId' });

User.hasMany(Borrow, { foreignKey: 'userId' });
Book.hasMany(Borrow, { foreignKey: 'bookId' });
