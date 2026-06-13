import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, BookOpen, Users, TrendingUp, History, BarChart3, Plus } from "lucide-react";

import { useAuth, Book } from "@/context/AuthContext";
import { BookList } from "@/components/books/BookList";
import { BookForm } from "@/components/admin/BookForm";
import { UserList } from "@/components/admin/UserList";
import BorrowHistory from "@/components/user/BorrowHistory";
import { Reports } from "@/components/admin/Reports";

export default function Dashboard() {
  const { user, books = [], borrowRecords = [], addBook, updateBook, deleteBook, logout, pickupBorrow } = useAuth();
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null);

  if (!user) return null;

  const isAdmin = user.role === "admin";

  // 📊 Statistics
  const totalBooks = books?.length || 0;
  const totalCopies = books?.reduce((sum, book) => sum + (book.totalCopies || 0), 0) || 0;
  const borrowedBooks = borrowRecords?.filter(r => r.status === "borrowed").length || 0;
  const availableCopies = books?.reduce((sum, book) => sum + (book.availableCopies || 0), 0) || 0;
  const userBorrowedBooks = borrowRecords?.filter(
    r => r.userId === user.id && r.status === "borrowed"
  ) || [];

  // 🔧 Handlers
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleConfirmDelete = async () => {
    if (showDeleteDialog) {
      try {
        await deleteBook?.(showDeleteDialog);
        setShowDeleteDialog(null);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowBookForm(false);
    setEditingBook(undefined);
  };

  const handleFormSuccess = () => {
    setShowBookForm(false);
    setEditingBook(undefined);
  };

  // 📘 BookForm sahifasi
  if (showBookForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={handleCloseForm} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
          </div>
          <BookForm
            book={editingBook}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        </div>
      </div>
    );
  }

  // 📋 Dashboard UI
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-effect border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              📚 Kutubxona Tizimi
            </h1>
            <p className="text-muted-foreground mt-1">
              Xush kelibsiz, <span className="font-medium text-foreground">{user.firstName}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isAdmin ? "default" : "secondary"} className="px-3 py-1">
              {isAdmin ? "👑 Administrator" : "👤 Foydalanuvchi"}
            </Badge>
            <Button variant="outline" onClick={logout} className="gap-2">
              🚪 Chiqish
            </Button>
          </div>
        </div>
      </header>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="modern-card border-0 bg-gradient-to-br from-white to-primary/5">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jami kitoblar</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalBooks}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalCopies} ta nusxa</p>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mavjud kitoblar</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{availableCopies}</div>
            <p className="text-xs text-muted-foreground mt-1">Olish mumkin</p>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isAdmin ? "Olingan kitoblar" : "Mening kitoblarim"}
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{isAdmin ? borrowedBooks : userBorrowedBooks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Hozirda foydalanishda</p>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Faollik</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{borrowRecords?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Jami operatsiyalar</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="books" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="books" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
              <BookOpen className="h-4 w-4" /> Kitoblar
            </TabsTrigger>

            {isAdmin && (
              <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <Users className="h-4 w-4" /> Foydalanuvchilar
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="borrows" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <History className="h-4 w-4" /> Ijaralar
              </TabsTrigger>
            )}

            {!isAdmin && (
              <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <History className="h-4 w-4" /> Tarix
              </TabsTrigger>
            )}

            {isAdmin && (
              <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
                <BarChart3 className="h-4 w-4" /> Hisobotlar
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="books" className="space-y-6">
            {isAdmin && (
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Kitoblar boshqaruvi</h2>
                  <p className="text-muted-foreground">Barcha kitoblarni boshqaring</p>
                </div>
                <Button
                  onClick={() => setShowBookForm(true)}
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                >
                  <Plus className="h-4 w-4" /> Yangi kitob qo'shish
                </Button>
              </div>
            )}

            <Card className="modern-card border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="text-xl">📚 Kitoblar ro'yxati</CardTitle>
                <CardDescription>
                  {isAdmin ? "Barcha kitoblarni boshqaring va yangi kitoblar qo'shing" : "Kitoblarni qidiring va oling"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <BookList 
                  onEditBook={isAdmin ? handleEditBook : undefined} 
                  onDeleteBook={isAdmin ? (id: number) => setShowDeleteDialog(id) : undefined} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && <TabsContent value="users"><UserList /></TabsContent>}
          {isAdmin && (
            <TabsContent value="borrows">
              <Card>
                <CardHeader>
                  <CardTitle>Ijaralar boshqaruvi</CardTitle>
                  <CardDescription>So‘rovlar va olib ketilganlarni kuzating</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {borrowRecords.length === 0 && (
                    <div className="text-sm text-muted-foreground">Hali ijaralar yo‘q</div>
                  )}
                  {borrowRecords
                    .slice()
                    .sort((a, b) => (a.status === 'requested' ? -1 : 1))
                    .map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">#{r.id} — {r.Book?.title || 'Kitob'} ({r.Book?.author || ''})</span>
                          <span className="text-xs text-muted-foreground">Foydalanuvchi: {r.User?.firstName || r.userId} | Holat: {r.status}</span>
                          {r.status === 'borrowed' && (
                            <span className="text-xs text-muted-foreground">Olingan: {r.borrowedAt ? new Date(r.borrowedAt).toLocaleString() : '-'} | Topshirish: {r.dueAt ? new Date(r.dueAt).toLocaleString() : '-'}</span>
                          )}
                        </div>
                        {r.status === 'requested' ? (
                          <Button size="sm" onClick={() => pickupBorrow?.(r.id)}>Tasdiqlash</Button>
                        ) : (
                          <Badge variant="secondary">{r.status}</Badge>
                        )}
                      </div>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>
          )}
          {!isAdmin && <TabsContent value="history"><BorrowHistory /></TabsContent>}
          {isAdmin && <TabsContent value="reports"><Reports /></TabsContent>}
        </Tabs>
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kitobni o'chirish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Bu kitobni o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>Bekor qilish</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>O'chirish</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
