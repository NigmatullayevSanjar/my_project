import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { sequelize } from './config/db.js';
import { User } from './models/user.js';
import { Book } from './models/book.js';
import { Borrow } from './models/borrow.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import userRoutes from './routes/userRoutes.js'; // admin uchun

dotenv.config();

const app = express();

// 🧩 Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// 🧩 Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/users', userRoutes);

// 🧠 Default admin yaratish funksiyasi
const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@library.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    // 1) Agar umuman admin bo'lmasa, birontasini yaratamiz/yuksaltiramiz
    const totalAdmins = await User.count({ where: { role: 'admin' } });
    if (totalAdmins === 0) {
      const existingByEmail = await User.findOne({ where: { email: adminEmail } });
      if (existingByEmail) {
        if (existingByEmail.role !== 'admin') {
          existingByEmail.role = 'admin';
          await existingByEmail.save();
          console.log(`✅ ${adminEmail} admin qilib yuksaltirildi`);
        }
      } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
          firstName: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
        });
        console.log(`✅ Default admin yaratildi: ${adminEmail}`);
      }
      return;
    }

    // 2) Admin bor, lekin sozlangan adminEmail foydalanuvchisi mavjud va admin emas — tuzatamiz
    const configured = await User.findOne({ where: { email: adminEmail } });
    if (configured && configured.role !== 'admin') {
      configured.role = 'admin';
      await configured.save();
      console.log(`✅ ${adminEmail} roli admin qilib tiklandi`);
    } else {
      console.log('ℹ️ Admin mavjud');
    }
  } catch (error) {
    console.error('❌ Admin yaratishda xato:', error);
  }
};

// 🚀 Serverni ishga tushirish
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log('✅ Database ulandi');
    await createDefaultAdmin();
    app.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishga tushdi`));
  })
  .catch((err) => {
    console.error('❌ Database ulanishida xato:', err);
  });
