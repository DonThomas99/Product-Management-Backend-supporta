import multer from 'multer';

// In-memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      // First argument must be null for no internal error
      return cb(null, false); // Reject file
    }
    cb(null, true); // Accept file
  }
});

// Export as middleware
export const Multer = upload.array('images', 4);
