import express from 'express';
const router = express.Router();

import { loginUser, registerUser, getUserProfile,logoutUser,getProductList} from '../controller/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';


router.post('/',registerUser)
router.post('/login', loginUser)
router.get('/profile',protect, getUserProfile);
router.post('/logout',logoutUser)

router.get('/listed-products',getProductList);


export default router;