import multer from 'multer';
import path from 'path';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Use a timestamp to ensure a unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${timestamp}${ext}`);
  }
});

// File type filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.epub', '.azw3', '.kfx'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);  // Accept file
  } else {
    cb(new Error('Only .epub, .azw3, and .kfx files are allowed'), false); // Reject invalid files
  }
};

// Create multer instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
