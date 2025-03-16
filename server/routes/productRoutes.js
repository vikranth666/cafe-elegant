import express from 'express';
import { addProduct, getProducts, deleteProduct, updateProduct } from '../controllers/productController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

router.post('/', verifyToken, upload.single('image'), addProduct); //  Supports file upload
router.get('/', getProducts);
router.delete('/:id', verifyToken, deleteProduct);
router.put('/:id', verifyToken, upload.single('image'), updateProduct); // ✅Supports file update

export default router;
