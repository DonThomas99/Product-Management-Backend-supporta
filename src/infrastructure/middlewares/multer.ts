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


// middlewares/multer/brandLogo.ts

const singlePicUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(null, false); // Reject non-image
    }
    cb(null, true);
  }
});

export const profilePhotoUpload = singlePicUpload.single('profilePhoto'); // 'logo' is the key used in form-data
export const logoUpload = singlePicUpload.single('brandLogo')
