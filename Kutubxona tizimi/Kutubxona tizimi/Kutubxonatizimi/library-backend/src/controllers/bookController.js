import { Book } from '../models/book.js';

// 📗 Yangi kitob qo'shish (faqat admin)
export const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, availableCopies, description, imageUrl } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Kitob nomi va muallif kiritilishi kerak' });
    }

    // Validate that availableCopies doesn't exceed totalCopies
    const total = totalCopies || 1;
    const available = availableCopies ?? total;
    
    if (available > total) {
      return res.status(400).json({ message: 'Mavjud nusxalar soni umumiy nusxadan ko\'p bo\'lishi mumkin emas' });
    }

    const newBook = await Book.create({
      title,
      author,
      isbn,
      category: category || 'Noma\'lum',
      totalCopies: total,
      availableCopies: available,
      description,
      imageUrl,
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error('❌ Kitob yaratishda xato:', error);
    res.status(500).json({
      message: 'Server xatosi',
      error: error.message,
      stack: error.stack,
    });
  }
};

// 📘 Barcha kitoblarni olish
export const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({ order: [['createdAt', 'DESC']] });
    res.json(books);
  } catch (error) {
    console.error('❌ Kitoblarni olishda xato:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// 📖 Bitta kitobni olish
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });
    res.json(book);
  } catch (error) {
    console.error('❌ Kitobni olishda xato:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// ✏️ Kitobni tahrirlash
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, category, totalCopies, availableCopies, description, imageUrl } = req.body;

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });

    // Validate that availableCopies doesn't exceed totalCopies
    const total = totalCopies ?? book.totalCopies;
    const available = availableCopies ?? book.availableCopies;
    
    if (available > total) {
      return res.status(400).json({ message: 'Mavjud nusxalar soni umumiy nusxadan ko\'p bo\'lishi mumkin emas' });
    }

    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.isbn = isbn ?? book.isbn;
    book.category = category ?? book.category;
    book.totalCopies = total;
    book.availableCopies = available;
    book.description = description ?? book.description;
    book.imageUrl = imageUrl ?? book.imageUrl;

    await book.save();
    res.json(book);
  } catch (error) {
    console.error('❌ Kitobni yangilashda xato:', error);
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};

// 🗑 Kitobni o‘chirish
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });

    await book.destroy();
    res.json({ message: 'Kitob o‘chirildi' });
  } catch (error) {
    console.error('❌ Kitobni o‘chirishda xato:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};
