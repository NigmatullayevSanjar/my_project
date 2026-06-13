import express from 'express';
import { listUsers, getUser, userStats, updateUserRole } from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔒 Faqat adminlar uchun kirish huquqi
router.use(authenticateToken, requireAdmin);

// 👥 Barcha foydalanuvchilar ro‘yxati
router.get('/', listUsers);

// 🧍 Bitta foydalanuvchini olish
router.get('/:id', getUser);

// 📊 Foydalanuvchi statistikasi
router.get('/:id/stats', userStats);

// 🔧 Rolni yangilash
router.put('/:id/role', updateUserRole);

export default router;
