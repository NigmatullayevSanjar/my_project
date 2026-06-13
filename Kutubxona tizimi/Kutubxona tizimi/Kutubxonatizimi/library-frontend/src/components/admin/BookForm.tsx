import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Book, useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface BookFormProps {
  book?: Book | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({ book, onClose, onSuccess }) => {
  const { addBook, updateBook } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: 1,
    availableCopies: 1,
    description: "",
    imageUrl: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || "",
        category: book.category,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        description: book.description || "",
        imageUrl: book.imageUrl || "",
      });
    }
  }, [book]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.title || !formData.author) {
      setError("Kitob nomi va muallif kiritilishi shart!");
      setLoading(false);
      return;
    }

    if (formData.availableCopies > formData.totalCopies) {
      setError("Mavjud nusxalar soni umumiy nusxadan ko'p bo'lishi mumkin emas.");
      setLoading(false);
      return;
    }

    try {
      if (book) {
        await updateBook(book.id, formData);
      } else {
        await addBook(formData);
      }
      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{book ? "Kitobni tahrirlash" : "Yangi kitob qo‘shish"}</CardTitle>
        <CardDescription>Kitob ma'lumotlarini to‘ldiring</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom va Muallif */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Kitob nomi *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Muallif *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                required
              />
            </div>
          </div>

          {/* ISBN va Kategoriya */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="isbn">ISBN *</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleChange("isbn", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Kategoriya *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Nusxalar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalCopies">Umumiy nusxalar *</Label>
              <Input
                id="totalCopies"
                type="number"
                min="1"
                value={formData.totalCopies}
                onChange={(e) =>
                  handleChange("totalCopies", parseInt(e.target.value) || 1)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="availableCopies">Mavjud nusxalar *</Label>
              <Input
                id="availableCopies"
                type="number"
                min="0"
                //max={formData.totalCopies}
                value={formData.availableCopies}
                onChange={(e) =>
                  handleChange("availableCopies", parseInt(e.target.value) || 0)
                }
                required
              />
            </div>
          </div>

          {/* Tavsif */}
          <div>
            <Label htmlFor="description">Tavsif</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Kitob haqida qisqacha..."
              rows={3}
            />
          </div>

          {/* Rasm URL */}
          <div>
            <Label htmlFor="imageUrl">Rasm URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Tugmalar */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Kuting..." : book ? "Saqlash" : "Qo'shish"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
