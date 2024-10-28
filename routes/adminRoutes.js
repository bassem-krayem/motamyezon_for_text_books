import Router from 'express';
import upload from '../middlewares/multerConfig.js';
import * as adminController from '../controllers/adminController.js';

const adminRouter = Router();

// the route to the admin pannel
adminRouter.get('/', adminController.adminPage);

// Route to display the upload form (delegates to controller)
adminRouter.get('/upload', adminController   .uploadPage);

// Route for uploading books (uses multer's fields() for multiple file uploads)
adminRouter.post('/upload', upload.fields([
  { name: 'epub', maxCount: 1 },
  { name: 'azw3', maxCount: 1 },
  { name: 'kfx', maxCount: 1 }
]), adminController.uploadBook);

adminRouter.get('/addCategory', adminController.addCategoryPage);

adminRouter.post('/addCategory', adminController.addCategory);

export default adminRouter;
