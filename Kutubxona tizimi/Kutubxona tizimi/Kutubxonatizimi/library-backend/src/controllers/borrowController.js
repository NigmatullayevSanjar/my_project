import { Borrow } from '../models/borrow.js';
import { User } from '../models/user.js';
import { Book } from '../models/book.js';

// 📚 1. Kitobni ijaraga olish
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Kitob nusxalari tugagan' });
    }

    // Faqat so'rov yaratamiz (admin tasdiqlaydi)
    const borrow = await Borrow.create({
      userId,
      bookId,
      status: 'requested',
      borrowedAt: null,
      approvedAt: null,
      dueAt: null,
    });

    res.status(201).json({
      message: 'Ijara so\'rovi yuborildi. Admin tasdiqlashi kutilmoqda.',
      borrow,
    });
  } catch (error) {
    console.error('borrowBook error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// 🔁 2. Kitobni qaytarish
export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params;
    const borrow = await Borrow.findByPk(borrowId);

    if (!borrow) return res.status(404).json({ message: 'Ijara topilmadi' });
    if (borrow.status === 'returned') {
      return res.status(400).json({ message: 'Bu kitob allaqachon qaytarilgan' });
    }

    borrow.status = 'returned';
    borrow.returnedAt = new Date();
    await borrow.save();

    // Increment available copies
    const book = await Book.findByPk(borrow.bookId);
    if (book) {
      book.availableCopies = (book.availableCopies || 0) + 1;
      // Ensure it never exceeds totalCopies
      if (book.totalCopies != null && book.availableCopies > book.totalCopies) {
        book.availableCopies = book.totalCopies;
      }
      await book.save();
    }

    res.json({ message: 'Kitob qaytarildi', borrow });
  } catch (error) {
    console.error('returnBook error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// 👤 3. Foydalanuvchining o‘z ijaralarini olish
export const getUserBorrows = async (req, res) => {
  try {
    const userId = req.user.id;

    const borrows = await Borrow.findAll({
      where: { userId },
      include: [
        {
          model: Book,
          attributes: ['id', 'title', 'author', 'category'],
        },
      ],
      order: [['borrowedAt', 'DESC']],
    });

    res.json(borrows);
  } catch (error) {
    console.error('getUserBorrows error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// 🧾 4. Admin uchun barcha ijaralarni olish
export const listBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.findAll({
      include: [
      { model: User, attributes: ['id', 'firstName', 'email'] },
        { model: Book, attributes: ['id', 'title', 'author'] },
      ],
      order: [['borrowedAt', 'DESC']],
    });

    res.json(borrows);
  } catch (error) {
    console.error('listBorrows error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};


// ✅ 5. Admin tomonidan ijarani tasdiqlash
export const approveBorrow = async (req, res) => {
  try {
    const { borrowId } = req.params;
    const borrow = await Borrow.findByPk(borrowId);

    if (!borrow) {
      return res.status(404).json({ message: 'Ijara topilmadi' });
    }

    if (borrow.status !== 'requested') {
      return res.status(400).json({ message: 'Bu ijara tasdiqlash uchun mos emas' });
    }

    // Kitob nusxalarini tekshiramiz va kamaytiramiz
    const book = await Book.findByPk(borrow.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Kitob topilmadi' });
    }
    if ((book.availableCopies || 0) <= 0) {
      return res.status(400).json({ message: 'Kitob nusxalari tugagan' });
    }

    const now = new Date();
    const due = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 kun

    borrow.status = 'borrowed';
    borrow.approvedAt = now;
    borrow.borrowedAt = now;
    borrow.dueAt = due;
    await borrow.save();

    book.availableCopies = Math.max(0, (book.availableCopies || 0) - 1);
    await book.save();

    res.json({ message: 'Ijara tasdiqlandi', borrow });
  } catch (error) {
    console.error('approveBorrow error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

