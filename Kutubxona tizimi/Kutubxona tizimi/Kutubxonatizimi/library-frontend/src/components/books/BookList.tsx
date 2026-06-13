import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCard } from "./BookCard";
import { useAuth, Book } from "@/context/AuthContext";
import { Search } from "lucide-react";

interface BookListProps {
  onEditBook?: (book: Book) => void;
  onDeleteBook?: (bookId: number) => void;
}

export const BookList: React.FC<BookListProps> = ({ onEditBook, onDeleteBook }) => {
  const { books } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const safeBooks = books || [];

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(safeBooks.map((b) => b.category)));
    return uniqueCategories.sort();
  }, [safeBooks]);

  const filteredBooks = useMemo(() => {
    return safeBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [safeBooks, searchTerm, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* 🔍 Qidiruv va filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Kitob nomi, muallif yoki ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Kategoriya tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha kategoriyalar</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredBooks.length} ta kitob topildi
      </div>

      {/* 📗 Kitoblar grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={onEditBook || undefined}
              onDelete={onDeleteBook ? (bookId: number) => onDeleteBook(bookId) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Hech qanday kitob topilmadi</p>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              “{searchTerm}” bo‘yicha hech narsa topilmadi.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
