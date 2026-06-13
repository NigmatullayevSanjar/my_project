import { User } from '../models/user.js';

// 👥 Barcha foydalanuvchilarni olish (faqat admin)
export const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'email', 'role', 'createdAt'],
    });
    res.json(users);
  } catch (error) {
    console.error('listUsers error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// 🔍 Bitta foydalanuvchini olish
export const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'firstName', 'email', 'role', 'createdAt'],
    });

    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    res.json(user);
  } catch (error) {
    console.error('getUser error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// 📊 Statistik ma’lumot (misol uchun)
export const userStats = async (req, res) => {
  try {
    const count = await User.count();
    res.json({ totalUsers: count });
  } catch (error) {
    console.error('userStats error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// 🔧 Foydalanuvchi rolini yangilash (faqat admin)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

  // Faqat 'user' yoki 'admin' ga ruxsat
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Noto‘g‘ri rol qiymati' });
  }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

  // Admin o'z rolini o'zgartira olmaydi
    if (String(req.user?.id) === String(id)) {
      return res.status(403).json({ message: 'O‘zingizning rolni o‘zgartira olmaysiz' });
    }

  // Agar adminni foydalanuvchiga tushirish bo'lsa, oxirgi admin emasligini tekshiramiz
  if (user.role === 'admin' && role === 'user') {
    const totalAdmins = await User.count({ where: { role: 'admin' } });
    if (totalAdmins <= 1) {
      return res.status(403).json({ message: 'Oxirgi adminni foydalanuvchiga tushirib bo‘lmaydi' });
    }
  }

  // O'zgartirishni saqlaymiz
  user.role = role;
  await user.save();

    return res.json({ id: user.id, firstName: user.firstName, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (error) {
    console.error('updateUserRole error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};
