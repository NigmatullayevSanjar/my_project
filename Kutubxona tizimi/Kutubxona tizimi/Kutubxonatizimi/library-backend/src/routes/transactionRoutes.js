import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { borrowBook, returnBook, getBorrowedBooks } from '../controllers/borrowController.js';

const router = express.Router();

router.post('/', authenticateToken, borrowBook);
router.post('/return/:id', authenticateToken, returnBook);
router.get('/', authenticateToken, getBorrowedBooks);

export default router;
