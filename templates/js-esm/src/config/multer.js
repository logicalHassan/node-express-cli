import path from 'node:path';
import multer from 'multer';

const ALLOWED_FILE_SIZE = 2000000; // 2MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
});

const upload = multer({
  storage,
  limits: { fileSize: ALLOWED_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports CSV files!'));
  },
});

export default upload;
