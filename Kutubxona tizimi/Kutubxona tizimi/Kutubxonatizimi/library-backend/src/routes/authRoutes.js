import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ro‘yxatdan o‘tish
router.post('/register', register);

// Login
router.post('/login', login);

// Joriy foydalanuvchini olish
router.get('/me', authenticateToken, getCurrentUser);

export default router;
