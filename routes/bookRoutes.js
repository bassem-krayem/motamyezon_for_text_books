import Router from 'express';
import * as bookController from '../controllers/bookController.js';

const bookRouter = Router();

// Route to list all books (delegates to controller)
bookRouter.get('/', bookController.listBooks);

// Route to download book
bookRouter.get('/download/:bookId/:format', bookController.downloadBook);

// Route for deleting a book
bookRouter.post('/delete/:bookId', bookController.deleteBook);

bookRouter.get('/update/:id', bookController.getBookById);
bookRouter.post('/update/:id', bookController.updateBook);

export default bookRouter;
