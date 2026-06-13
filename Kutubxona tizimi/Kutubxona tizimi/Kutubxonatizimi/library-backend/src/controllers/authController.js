import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

// 🔑 Token generatsiya qilish
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '1d' }
  );
  return { accessToken };
};

// 📝 Ro‘yxatdan o‘tish
export const register = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'Barcha maydonlarni to‘ldiring!' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Bu email allaqachon mavjud!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧩 Foydalanuvchini yaratish (modeldagi `firstName` bilan)
    const newUser = await User.create({
      firstName,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const { accessToken } = generateTokens(newUser);

    res.status(201).json({
      message: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// 🔐 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Parol noto‘g‘ri' });

    const { accessToken } = generateTokens(user);

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// 👤 Hozirgi foydalanuvchini olish
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Token yaroqsiz' });

    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'email', 'role', 'createdAt'],
    });

    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

    res.json({
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};
