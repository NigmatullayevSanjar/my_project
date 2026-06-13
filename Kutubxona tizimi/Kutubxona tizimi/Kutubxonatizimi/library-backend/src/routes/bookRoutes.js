import express from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin yangi kitob qo‘shishi mumkin
router.post('/', authenticateToken, requireAdmin, createBook);

// Hamma foydalanuvchi kitoblarni ko‘rishi mumkin
router.get('/', authenticateToken, getBooks);

// Bitta kitob
router.get('/:id', authenticateToken, getBookById);

// Tahrirlash va o‘chirish (faqat admin)
router.put('/:id', authenticateToken, requireAdmin, updateBook);
router.delete('/:id', authenticateToken, requireAdmin, deleteBook);

export default router;
