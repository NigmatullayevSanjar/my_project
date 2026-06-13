import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface BorrowRow {
  id: number;
  bookTitle: string;
  borrowDate?: string;
  dueDate?: string;
  returnDate?: string;
  status: string;
}

const API_URL = 'http://localhost:5000/api';

const BorrowHistory: React.FC = () => {
  const { user, token, borrowRecords, returnBook } = useAuth();
  const [borrows, setBorrows] = useState<BorrowRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;
    setLoading(true);
    try {
      // Map context borrowRecords to table rows
      const rows: BorrowRow[] = (borrowRecords || []).map((b: any) => ({
        id: b.id,
        bookTitle: b.Book?.title || b.book?.title || b.title || String(b.bookId),
        borrowDate: b.borrowedAt || b.borrowDate,
        dueDate: b.dueAt,
        returnDate: b.returnedAt || b.returnDate,
        status: b.status,
      }));
      setBorrows(rows);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, token, borrowRecords]);

  if (!user) return <p>🕒 Foydalanuvchi maʼlumotlari yuklanmoqda...</p>;
  if (loading) return <p>⏳ Tarix yuklanmoqda...</p>;
  if (error) return <p className="text-red-500">❌ Xatolik: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">📚 {user.firstName} ning kitob olish tarixi</h2>
      {borrows.length === 0 ? (
        <p>Hozircha hech qanday kitob olinmagan.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Kitob nomi</th>
              <th className="border p-2">Olingan vaqt</th>
              <th className="border p-2">Topshirish muddati</th>
              <th className="border p-2">Qaytarilgan sana</th>
              <th className="border p-2">Holati</th>
              <th className="border p-2">Amal</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((b) => (
              <tr key={b.id} className="text-center">
                <td className="border p-2">{b.bookTitle}</td>
                <td className="border p-2">{b.borrowDate ? new Date(b.borrowDate).toLocaleString() : '-'}</td>
                <td className="border p-2">{b.dueDate ? new Date(b.dueDate).toLocaleString() : '-'}</td>
                <td className="border p-2">
                  {b.returnDate ? new Date(b.returnDate).toLocaleString() : '-'}
                </td>
                <td className="border p-2">
                  {b.status === 'returned' ? '✅ Qaytarilgan' : b.status === 'requested' ? '⏳ Tasdiqlash kutilmoqda' : '📖 Olingan'}
                </td>
                <td className="border p-2">
                  {b.status === 'borrowed' ? (
                    <Button size="sm" onClick={() => returnBook(b.id)}>
                      Qaytarish
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BorrowHistory;
