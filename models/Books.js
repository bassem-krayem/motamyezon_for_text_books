import db from '../config/db.js';

class Books {
  // Function to insert a new book into the database
  static async addBook({ title, author, description, epub, azw3, kfx, user_id, category_id }) {
    try {
      const query = `
        INSERT INTO books (book_title, book_author, book_description, book_epub_url, book_azw3_url, book_kfx_url, user_id, category_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING book_id;
      `;
      const result = await db.query(query, [title, author, description, epub, azw3, kfx, user_id, category_id]);
      return result.rows[0];
    } catch (err) {
      console.error("Database error:", err);
      throw err;
    }
  }

  // Function to fetch all books, optionally filtered by category
  static async getAllBooks(categoryId = null) {
    try {
      let query = 'SELECT * FROM books';
      const params = [];

      if (categoryId) {
        query += ' WHERE category_id = $1';
        params.push(categoryId);
      }

      const result = await db.query(query, params);
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

  // Method to delete a book by its ID
  static async deleteBookById(bookId) {
    const query = 'DELETE FROM books WHERE book_id = $1';
    return db.query(query, [bookId]);
  }

  // Function to fetch all categories
  static async getAllCategories() {
    try {
      const query = 'SELECT * FROM categories';
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      console.error("Error fetching categories:", err);
      throw err;
    }
  }

  // Function to add a new category
  static async addCategory(category_name) {
    try {
      const query = `INSERT INTO categories (category_name) VALUES ($1) RETURNING category_id`;
      const result = await db.query(query, [category_name]);
      return result.rows[0];
    } catch (err) {
      console.error("Error adding category:", err);
      throw err;
    }
  }

  // Function to check if a category exists
  static async getCategoryByName(category_name) {
    try {
      const query = `SELECT * FROM categories WHERE category_name = $1`;
      const result = await db.query(query, [category_name]);
      return result.rows[0];
    } catch (err) {
      console.error("Error fetching category:", err);
      throw err;
    }
  }

  static async updateBookById(bookId, updatedData) {
    const { book_title, book_author, book_description } = updatedData;
    try {
      const query = `
        UPDATE books
        SET book_title = $1, book_author = $2, book_description = $3
        WHERE book_id = $4
        RETURNING *;
      `;
      const values = [book_title, book_author, book_description, bookId];
      const result = await db.query(query, values);
      return result.rows[0];  // Return updated book details
    } catch (err) {
      console.error("Database error updating book:", err);
      throw err;
    }
  }
  }

export default Books;
