import db from '../config/db.js';

class Books {
  // Function to insert a new book into the database
  static async addBook({ title, author, description, epub, azw3, kfx, user_id }) {
    try {
      const query = `
        INSERT INTO books (book_title, book_author, book_description, book_epub_url, book_azw3_url, book_kfx_url, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING book_id;
      `;
      const result = await db.query(query, [title, author, description, epub, azw3, kfx, user_id]);
      return result.rows[0];  // Return the inserted book's ID or details
    } catch (err) {
      console.error("Database error:", err);
      throw err;  // Throw error to be handled by the controller
    }
  }

  // Function to fetch all books
  static async getAllBooks() {
    try {
      const query = `SELECT * FROM books`;
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      console.error("Error fetching books:", err);
      throw err;
    }
  }

  // Function to fetch a book by its ID
  static async getBookById(book_id) {
    try {
      const query = `SELECT * FROM books WHERE book_id = $1`;
      const result = await db.query(query, [book_id]);
      return result.rows[0];
    } catch (err) {
      console.error("Error fetching book:", err);
      throw err;
    }
  }
}

export default Books;
