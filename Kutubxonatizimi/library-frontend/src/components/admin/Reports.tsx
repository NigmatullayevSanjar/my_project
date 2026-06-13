import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

export const Reports: React.FC = () => {
  const { books = [], borrowRecords = [], allUsers = [] } = useAuth(); // ✅ undefined bo‘lsa ham bo‘sh massiv bo‘ladi

  // 📊 Eng ko‘p o‘qilgan kitoblar
  const bookBorrowCounts = Array.isArray(books)
    ? books
        .map(book => {
          const borrowCount = borrowRecords.filter(record => record.bookId === book.id).length;
          return { ...book, borrowCount };
        })
        .sort((a, b) => b.borrowCount - a.borrowCount)
    : [];

  // 👤 Eng faol foydalanuvchilar
  const activeUsers = Array.isArray(allUsers)
    ? allUsers
        .map(user => {
          const borrowCount = borrowRecords.filter(record => record.userId === user.id).length;
          return { ...user, borrowCount };
        })
        .sort((a, b) => b.borrowCount - a.borrowCount)
    : [];

  // 🏷️ Kategoriya statistikasi
  const categoryStats = Array.isArray(books)
    ? books.reduce((acc, book) => {
        const category = book.category || 'Noma’lum';
        if (!acc[category]) {
          acc[category] = { totalBooks: 0, totalBorrows: 0 };
        }
        acc[category].totalBooks++;
        acc[category].totalBorrows += borrowRecords.filter(record => record.bookId === book.id).length;
        return acc;
      }, {} as Record<string, { totalBooks: number; totalBorrows: number }>)
    : {};

  const categoryStatsArray = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      ...stats,
    }))
    .sort((a, b) => b.totalBorrows - a.totalBorrows);

  return (
    <div className="space-y-6">
      {/* Eng ko‘p o‘qilgan kitoblar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Eng ko‘p o‘qilgan kitoblar
          </CardTitle>
          <CardDescription>Foydalanuvchilar tomonidan eng ko‘p olingan kitoblar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reyting</TableHead>
                  <TableHead>Kitob nomi</TableHead>
                  <TableHead>Muallif</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead>Olingan soni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookBorrowCounts.length > 0 ? (
                  bookBorrowCounts.slice(0, 5).map((book, index) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                          #{index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{book.category}</Badge>
                      </TableCell>
                      <TableCell>{book.borrowCount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                      Ma'lumot yo‘q
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Faol foydalanuvchilar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Faol foydalanuvchilar
          </CardTitle>
          <CardDescription>Eng ko‘p kitob olgan foydalanuvchilar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reyting</TableHead>
                  <TableHead>Foydalanuvchi</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Olingan kitoblar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeUsers.length > 0 ? (
                  activeUsers.slice(0, 5).map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                          #{index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.borrowCount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                      Ma'lumot yo‘q
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Kategoriya statistikasi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Kategoriya statistikasi
          </CardTitle>
          <CardDescription>Har bir kategoriya bo‘yicha kitoblar va faollik</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead>Kitoblar soni</TableHead>
                  <TableHead>Jami olingan</TableHead>
                  <TableHead>O‘rtacha faollik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryStatsArray.length > 0 ? (
                  categoryStatsArray.map(stat => (
                    <TableRow key={stat.category}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{stat.category}</Badge>
                      </TableCell>
                      <TableCell>{stat.totalBooks}</TableCell>
                      <TableCell>{stat.totalBorrows}</TableCell>
                      <TableCell>
                        {stat.totalBooks > 0 ? (stat.totalBorrows / stat.totalBooks).toFixed(1) : '0'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                      Ma'lumot yo‘q
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
