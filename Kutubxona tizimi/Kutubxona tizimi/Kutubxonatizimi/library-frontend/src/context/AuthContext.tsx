import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  firstName: string;
  email: string;
  role: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BorrowRecord {
  id: number;
  userId: number;
  bookId: number;
  status: string;
  borrowedAt?: string;
  approvedAt?: string;
  dueAt?: string;
  returnedAt?: string;
  Book?: Book;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
  allUsers: User[];
  books: Book[];
  borrowRecords: BorrowRecord[];

  // 🔹 Qo‘shimcha funksiya (Dashboard uchun)
  addBook: (bookData: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (id: number, bookData: Omit<Book, 'id'>) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;

  // 📘 Borrow APIs
  borrowBook: (bookId: number) => Promise<void>;
  returnBook: (borrowId: number) => Promise<void>;
  pickupBorrow?: (borrowId: number) => Promise<void>; // admin
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);

  // 🔹 Foydalanuvchi ma’lumotini olish
  const fetchUserData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Foydalanuvchilar ro‘yxatini olish
  const fetchAllUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  // 🔹 Kitoblarni olish
  const fetchBooks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error('Fetch books error:', err);
    }
  };

  // 🔹 Ijaralarni olish
  const fetchBorrowRecords = async () => {
    if (!token) return;
    try {
      const endpoint = user?.role === 'admin' ? `${API_URL}/borrows` : `${API_URL}/borrows/my`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBorrowRecords(data);
      }
    } catch (err) {
      console.error('Fetch borrow records error:', err);
    }
  };

  // 📘 Borrow a book
  const borrowBook = async (bookId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/borrows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ijaraga olishda xato');
      // Refresh borrows to include requested
      await fetchBorrowRecords();
    } catch (error) {
      console.error('borrowBook error:', error);
      throw error;
    }
  };

  // 🔁 Return a book
  const returnBook = async (borrowId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/borrows/return/${borrowId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Qaytarishda xato');

      // Increase availableCopies for returned book if present
      const returnedBookId = data?.borrow?.bookId;
      if (returnedBookId) {
        setBooks((prev) => prev.map((b) =>
          b.id === returnedBookId ? { ...b, availableCopies: b.availableCopies + 1 } : b
        ));
      }

      await fetchBorrowRecords();
    } catch (error) {
      console.error('returnBook error:', error);
      throw error;
    }
  };

  // 🔹 Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return false;

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('role', data.user.role);
      setUser(data.user);
      setToken(data.accessToken);

      window.location.href = data.user.role === 'admin' ? '/admin' : '/dashboard';
      return true;
    } catch {
      return false;
    }
  };

  // 🔹 Register
  const register = async (firstName: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return false;

      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
      setToken(data.accessToken);
      return true;
    } catch (error) {
      console.error('Register fetch error:', error);
      return false;
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    setUser(null);
    setToken(null);
    setAllUsers([]);
    setBooks([]);
    setBorrowRecords([]);
  };

  // =======================
  // 📚 Book CRUD funksiyalar
  // =======================
  const addBook = async (bookData: Omit<Book, 'id'>) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      if (res.ok) {
        const newBook = await res.json();
        setBooks((prev) => [newBook, ...prev]);
      } else {
        const error = await res.json();
        throw new Error(error.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      console.error('Add book error:', err);
      throw err;
    }
  };

  const updateBook = async (id: number, bookData: Omit<Book, 'id'>) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      if (res.ok) {
        const updatedBook = await res.json();
        setBooks((prev) => prev.map((b) => (b.id === id ? updatedBook : b)));
      } else {
        const error = await res.json();
        throw new Error(error.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      console.error('Update book error:', err);
      throw err;
    }
  };

  const deleteBook = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
      } else {
        const error = await res.json();
        throw new Error(error.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      console.error('Delete book error:', err);
      throw err;
    }
  };

  // 🔹 Ma’lumotlarni yuklash
  // Token o'zgarsa yuklaymiz; foydalanuvchi roli (admin/user) o'zgarsa ijaralarni qayta yuklaymiz
  useEffect(() => {
    if (!token) return;
    fetchUserData();
    fetchBooks();
    fetchAllUsers();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    // admin bo'lsa barcha ijaralar, aks holda faqat /my
    fetchBorrowRecords();
  }, [token, user?.role]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        token,
        allUsers,
        books,
        borrowRecords,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
        pickupBorrow: async (borrowId: number) => {
          if (!token) return;
          try {
            const res = await fetch(`${API_URL}/borrows/approve/${borrowId}`, {
              method: 'PUT',
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Tasdiqlashda xato');

            const returnedBookId = data?.borrow?.bookId;
            if (returnedBookId) {
              setBooks((prev) => prev.map((b) =>
                b.id === returnedBookId && b.availableCopies > 0 ? { ...b, availableCopies: b.availableCopies - 1 } : b
              ));
            }

            await fetchBorrowRecords();
          } catch (error) {
            console.error('pickupBorrow error:', error);
            throw error;
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
