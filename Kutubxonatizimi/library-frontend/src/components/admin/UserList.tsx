import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { User, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LibraryUser {
  id: number;
  firstName: string;
  email: string;
  role: string;
  createdAt: string;
}

export const UserList: React.FC = () => {
  const [allUsers, setAllUsers] = useState<LibraryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, borrowRecords = [], user: currentUser } = useAuth();
  const API_URL = 'http://localhost:5000/api';

  // 🔹 Foydalanuvchilarni olish
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          console.error('Foydalanuvchilarni olishda xato');
          return;
        }
        const data = await res.json();
        setAllUsers(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleChangeRole = async (id: number, role: 'user' | 'admin') => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        console.error('Rolni yangilashda xato');
        return;
      }
      const updated = await res.json();
      setAllUsers(prev => prev.map(u => (u.id === id ? { ...u, role: updated.role } : u)));
    } catch (e) {
      console.error('Role update error:', e);
    }
  };

  // 🔹 Foydalanuvchi statistikasi
  const getUserStats = (userId: number) => {
    const userRecords = (borrowRecords as any[]).filter(
      (record) => record.userId === userId
    );
    const currentlyBorrowed = userRecords.filter(
      (record) => record.status === 'borrowed'
    ).length;
    const totalBorrowed = userRecords.length;
    return { currentlyBorrowed, totalBorrowed };
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Foydalanuvchilar ro'yxati
        </CardTitle>
        <CardDescription>
          Barcha ro'yxatdan o'tgan foydalanuvchilar va ularning faoliyati
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Qo‘shilgan sana</TableHead>
                <TableHead>Hozirgi kitoblar</TableHead>
                <TableHead>Jami olgan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                    Hech qanday foydalanuvchi topilmadi.
                  </TableCell>
                </TableRow>
              ) : (
                allUsers.map((user) => {
                  const stats = getUserStats(user.id);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                          >
                            {user.role === 'admin' ? 'Administrator' : 'Foydalanuvchi'}
                          </Badge>
                          {user.id !== currentUser?.id ? (
                            <Select
                              value={user.role}
                              onValueChange={(val) => handleChangeRole(user.id, val as 'user' | 'admin')}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Rolni tanlang" />
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem value="user">Foydalanuvchi</SelectItem>
                              <SelectItem value="admin">Administrator</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          {stats.currentlyBorrowed}
                        </div>
                      </TableCell>
                      <TableCell>{stats.totalBorrowed}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
