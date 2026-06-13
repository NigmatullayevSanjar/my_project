import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, useAuth } from "@/context/AuthContext";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: number) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const { user, borrowBook } = useAuth();
  const isAdmin = user?.role === 'admin';
  const canBorrow = !isAdmin && (book.availableCopies ?? 0) > 0;

  const handleBorrow = async () => {
    try {
      await borrowBook(book.id);
    } catch (e) {
      // noop; errors are logged in context
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
      {book.imageUrl ? (
        <div className="w-full h-40 overflow-hidden rounded-t-md bg-gray-50">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : null}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{book.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{book.author}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">ISBN:</span>
          <span className="text-sm font-medium">{book.isbn || "Noma'lum"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Kategoriya:</span>
          <span className="text-sm font-medium">{book.category || "Noma'lum"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Umumiy nusxalar:</span>
          <span className="text-sm font-medium">{book.totalCopies}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Mavjud nusxalar:</span>
          <span className="text-sm font-medium">{book.availableCopies}</span>
        </div>
        <div className="flex gap-2 pt-4">
          {onEdit || onDelete ? (
            <div className="flex justify-end gap-2 w-full">
              {onEdit && (
                <Button size="sm" variant="outline" onClick={() => onEdit(book)} className="flex-1 gap-1">
                  <Edit className="h-4 w-4" /> Tahrirlash
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(book.id)}
                  className="flex-1 gap-1"
                >
                  <Trash2 className="h-4 w-4" /> O'chirish
                </Button>
              )}
            </div>
          ) : null}

          {!isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" className="ml-auto" disabled={!canBorrow}>
                  {canBorrow ? "Olish" : "Mavjud emas"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Kitobni olishni tasdiqlaysizmi?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="space-y-2 text-left">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-muted-foreground">Muallif: {book.author}</div>
                      <div className="text-sm text-muted-foreground">Kategoriya: {book.category || "Noma'lum"}</div>
                      <div className="text-sm text-muted-foreground">ISBN: {book.isbn || "Noma'lum"}</div>
                      {book.description ? (
                        <div className="text-sm text-muted-foreground line-clamp-3">{book.description}</div>
                      ) : null}
                      <div className="pt-2 text-xs">Tasdiqlasangiz, so'rov admin tomonidan ko'rib chiqiladi. Tasdiqlangandan so'ng kitobni olib ketishingiz mumkin.</div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBorrow}>Tasdiqlash</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
