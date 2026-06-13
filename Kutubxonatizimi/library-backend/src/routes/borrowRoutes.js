import express from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';
import {
  borrowBook,
  returnBook,
  getUserBorrows,
  listBorrows,
  approveBorrow,
} from '../controllers/borrowController.js';

const router = express.Router();

// Foydalanuvchilar uchun
router.post('/', authenticateToken, borrowBook);
router.get('/my', authenticateToken, getUserBorrows);
router.put('/return/:borrowId', authenticateToken, returnBook);

// Admin uchun
router.get('/', authenticateToken, requireAdmin, listBorrows);
router.put('/approve/:borrowId', authenticateToken, requireAdmin, approveBorrow);

export default router;
