import multer from 'multer';
import path from 'path';

// Set up Multer storage (you can choose memoryStorage if you don't want disk storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads')); // Specify uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`); // Unique file name
    },
});

// Multer instance
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/json'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PNG and JSON are allowed.'));
        }
    },
});

export default upload;
