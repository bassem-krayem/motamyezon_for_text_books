import passport from 'passport';import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import Books from '../models/Books.js';

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadPage = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.user_type === 'admin') {
      res.render('upload.ejs');
    } else {
      res.send('this page accesible only for admins to upload books');
    }
  } else {
    res.redirect('/login');
  }
}

// Handle the book upload
const uploadBook = async (req, res) => {
  // Check if the user is authenticated
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  const { title, author, description } = req.body;
  
  // Extract the file paths from the request
  const epub = req.files['epub'][0].filename;
  const azw3 = req.files['azw3'][0].filename;
  const kfx = req.files['kfx'][0].filename;

  try {
    // Insert the book data using the Books module
    await Books.addBook({
      title,
      author,
      description,
      epub,
      azw3,
      kfx,
      user_id: req.user.user_id,
    });

    res.redirect('/books');
  } catch (err) {
    console.error("Error uploading book:", err);
    res.status(500).send("Error uploading book.");
  }
};

// Fetch and display all books
const listBooks = async (req, res) => {
  // Check if the user is authenticated
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  try {
    const books = await Books.getAllBooks();
    res.render('books.ejs', { books });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Error fetching books.");
  }
};

const downloadBook = async (req, res) => {
  const { bookId, format } = req.params;

  try {
    // Fetch the book details using the bookId
    const book = await Books.getBookById(bookId);

    if (!book) {
      return res.status(404).send('Book not found.');
    }

    // Get the correct file based on the format
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

    // Set the download filename to include the title, author, and format
    const downloadFilename = `${book.book_title}-${book.book_author}.${format}`;

    // Send the file as a download with a custom filename
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

export { uploadBook, listBooks, uploadPage, downloadBook, };
