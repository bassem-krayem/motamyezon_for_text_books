import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import Books from '../models/Books.js';
import fs from 'fs';

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fetch and display all books, optionally filtered by category
const listBooks = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  const { categoryId } = req.query;

  try {
    const books = await Books.getAllBooks(categoryId);
    const categories = await Books.getAllCategories();
    res.render('books.ejs', { books, categories, user: req.user, selectedCategory: categoryId, title: 'المكتبة'});
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Error fetching books.");
  }
};

const downloadBook = async (req, res) => {
  const { bookId, format } = req.params;

  try {
    const book = await Books.getBookById(bookId);

    if (!book) {
      return res.status(404).send('Book not found.');
    }

    let file;
    if (format === 'epub') {
      file = book.book_epub_url;
    } else if (format === 'azw3') {
      file = book.book_azw3_url;
    } else if (format === 'kfx') {
      file = book.book_kfx_url;
    } else {
      return res.status(400).send('Invalid format.');
    }

    const downloadFilename = `${book.book_title}-${book.book_author}.${format}`;
    const filePath = path.join(__dirname, '../public/uploads', file);
    res.download(filePath, downloadFilename, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error downloading file.");
      }
    });
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).send("Error fetching book.");
  }
};

const deleteBook = async (req, res) => {
  const bookId = parseInt(req.params.bookId, 10);

  try {
    const book = await Books.getBookById(bookId);

    if (!book) {
      return res.status(404).send('Book not found.');
    }

    const files = [book.book_epub_url, book.book_azw3_url, book.book_kfx_url];

    files.forEach((file) => {
      const filePath = path.join(__dirname, '../public/uploads', file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Books.deleteBookById(bookId);
    res.redirect('/books');
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).send("Error deleting book.");
  }
};

export {
  listBooks,
  downloadBook,
  deleteBook,
};
