import express from 'express';
import multer from "multer";
import path from "path";
import { registerAdmin, loginAdmin, logoutAdmin, } from '../controller/adminController.js';


import { adminProtect } from '../middleware/adminAuthMiddleware.js';



//Multer setup
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
      cb(null, 'backend/public')
    },
    filename:(req,file,cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
  })
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



router.post('/',registerAdmin)
router.post('/auth', loginAdmin)
router.post('/logout',logoutAdmin)

router.post('/add-product', adminProtect, upload.single('file'), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }
    next();
  }, addProduct);



export default router;