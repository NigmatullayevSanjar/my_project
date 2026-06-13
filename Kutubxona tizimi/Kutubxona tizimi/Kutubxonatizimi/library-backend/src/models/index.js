import { Sequelize } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './user.js';
import { Book } from './book.js';
import { Transaction } from './transaction.js';
import { Borrow } from './borrow.js';

// 🔗 Aloqalar
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Transaction, { foreignKey: 'bookId' });
Transaction.belongsTo(Book, { foreignKey: 'bookId' });

// Ensure Borrow is registered in this index as well
User.hasMany(Borrow, { foreignKey: 'userId' });
Book.hasMany(Borrow, { foreignKey: 'bookId' });
Borrow.belongsTo(User, { foreignKey: 'userId' });
Borrow.belongsTo(Book, { foreignKey: 'bookId' });

export { sequelize, Sequelize, User, Book, Transaction, Borrow };
