import express from 'express';
import upload from '../middlewares/multerConfig.js';
import * as bookController from '../controllers/bookController.js';

const bookRouter = express.Router();

// Route to display the upload form (delegates to controller)
bookRouter.get('/upload', bookController.uploadPage);

// Route for uploading books (uses multer's fields() for multiple file uploads)
bookRouter.post('/upload', upload.fields([
  { name: 'epub', maxCount: 1 },
  { name: 'azw3', maxCount: 1 },
  { name: 'kfx', maxCount: 1 }
]), bookController.uploadBook);

// Route to list all books (delegates to controller)
bookRouter.get('/books', bookController.listBooks);

// Route to download book
bookRouter.get('/download/:bookId/:format', bookController.downloadBook);

export default bookRouter;
