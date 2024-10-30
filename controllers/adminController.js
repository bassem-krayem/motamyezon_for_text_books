    import passport from 'passport';
    import { fileURLToPath } from 'url';
    import { dirname } from 'path';
    import path from 'path';
    import Books from '../models/Books.js';
    import fs from 'fs';


    // Manually define __dirname
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // the admin page
    const adminPage = (req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.user_type === 'admin') {
              res.render('admin.ejs', {title: 'لوحة التحكم', user: req.user});
            } else {
              res.send('this page accessible only for admins');
            }
          } else {
            res.redirect('/login');
          }
    };

    const uploadPage = async (req, res) => {
      if (req.isAuthenticated()) {
        if (req.user.user_type === 'admin') {
          try {
            const categories = await Books.getAllCategories();
            res.render('upload.ejs', { categories, error: null, title: "رفع كتاب", user: req.user });
          } catch (err) {
            console.error("Error fetching categories:", err);
            res.status(500).send("Error fetching categories.");
          }
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
    
      const { title, author, description, category_id} = req.body;
    
      // Extract file details but don't store the files yet
      const epubFile = req.files['epub'] ? req.files['epub'][0] : null;
      const azw3File = req.files['azw3'] ? req.files['azw3'][0] : null;
      const kfxFile = req.files['kfx'] ? req.files['kfx'][0] : null;
    
      try {
        // First, attempt to insert the book data into the database
        const book = await Books.addBook({
          title,
          author,
          description,
          epub: epubFile ? epubFile.filename : null,
          azw3: azw3File ? azw3File.filename : null,
          kfx: kfxFile ? kfxFile.filename : null,
          user_id: req.user.user_id,
          category_id,
        });
    
        // If successful, the files can now be moved or saved
        if (epubFile) {
          const epubFilePath = path.join(__dirname, '../public/uploads', epubFile.filename);
          fs.renameSync(epubFile.path, epubFilePath);  // Move file
        }
        if (azw3File) {
          const azw3FilePath = path.join(__dirname, '../public/uploads', azw3File.filename);
          fs.renameSync(azw3File.path, azw3FilePath);  // Move file
        }
        if (kfxFile) {
          const kfxFilePath = path.join(__dirname, '../public/uploads', kfxFile.filename);
          fs.renameSync(kfxFile.path, kfxFilePath);  // Move file
        }
    
        // Redirect to the books page after successful upload
        res.redirect('/books');
      } catch (err) {
        console.error("Error uploading book:", err);
    
        // Remove the files if there was an error
        if (epubFile && fs.existsSync(epubFile.path)) {
          fs.unlinkSync(epubFile.path);  // Delete temporary epub file
        }
        if (azw3File && fs.existsSync(azw3File.path)) {
          fs.unlinkSync(azw3File.path);  // Delete temporary azw3 file
        }
        if (kfxFile && fs.existsSync(kfxFile.path)) {
          fs.unlinkSync(kfxFile.path);  // Delete temporary kfx file
        }
    
        // Render the upload page again with an error message
        res.render('upload.ejs', { error: 'خطأ: الكتاب موجود بالفعل.', categories: await Books.getAllCategories() });
      }
    };


    // Add a new category
    const addCategory = async (req, res) => {
      // Check if the user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user.user_type !== 'admin') {
        return res.redirect('/login');
      }
    
      const { category_name } = req.body;
    
      try {
        // Check if the category already exists
        const existingCategory = await Books.getCategoryByName(category_name);
        if (existingCategory) {
          // If the category exists, render the addCategory.ejs page with an error message
          return res.render('addCategory.ejs', {
            error: 'خطأ: هذا التصنيف موجود بالفعل',
            user: req.user,
          });
        }
    
        // Add the new category
        await Books.addCategory(category_name);
    
        // Redirect to /books if the category was successfully added
        res.redirect('/books');
      } catch (err) {
        console.error("Error adding category:", err);
        // Handle unexpected errors by rendering the addCategory.ejs page with a generic error message
        res.status(500).render('addCategory.ejs', {
          error: 'حدث خطأ أثناء إضافة التصنيف، يرجى المحاولة مرة أخرى',
          user: req.user,
        });
      }
    };
    
    // List all categories
    const listCategories = async (req, res) => {
      if (!req.isAuthenticated() || req.user.user_type !== 'admin') {
        return res.redirect('/login');
      }
    
      try {
        const categories = await Books.getAllCategories();
        res.render('categories.ejs', { categories, user: req.user });
      } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).send("Error fetching categories.");
      }
    };
    
    const addCategoryPage = (req, res) => {
      if (req.isAuthenticated()) {
        if (req.user.user_type === 'admin') {
          res.render('addCategory.ejs', {title: "إضافة قسم", user: req.user});
        } else {
          res.send('هذه الصفحة متاحة فقط للمسؤولين');
        }
      } else {
        res.redirect('/login');
      }
    }
    
    export {
      adminPage,
      uploadBook,
      uploadPage,
      addCategory,
      listCategories,
      addCategoryPage,
    };
    