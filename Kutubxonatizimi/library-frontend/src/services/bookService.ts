import api from '@/api/axios';

export const getBooks = async () => {
  const res = await api.get('/books');
  return res.data;
};

export const getBook = async (id: number) => {
  const res = await api.get(`/books/${id}`);
  return res.data;
};

export const addBook = async (bookData: { title: string; author: string; price: number; }) => {
  const res = await api.post('/books', bookData);
  return res.data;
};

export const deleteBook = async (id: number) => {
  const res = await api.delete(`/books/${id}`);
  return res.data;
};
