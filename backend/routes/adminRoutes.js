// Import the necessary modules
import express from 'express';
import multer from "multer";
import path from "path";
import { registerAdmin, authAdmin, logoutAdmin } from '../controller/adminController.js';
import { addProduct, editProduct, getAllProduct, listProduct, unlistProduct } from '../controller/adminController.js';
import { getAllUsers,deleteUser } from '../controller/adminController.js';

import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/public');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Middleware to handle file upload and admin protection
const handleFileUploadAndProtection = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    adminProtect(req, res, next);
  });
};

// Routes
router.post('/', registerAdmin);
router.post('/auth', authAdmin);
router.post('/logout', logoutAdmin);
router.post('/add-product', handleFileUploadAndProtection, addProduct);
router.get('/unlist-product/:productId', adminProtect, unlistProduct);
router.get('/list-product/:productId', adminProtect, listProduct);
router.put('/edit-product', adminProtect, editProduct);
router.get('/getAll-products', adminProtect, getAllProduct);


// Additional routes
router.get('/getAll-users', adminProtect, getAllUsers);
router.delete('/delete-user/:userId', adminProtect, deleteUser);


export default router;
