import express from 'express';
const router = express.Router();

import { loginUser, registerUser, getUserProfile,logoutUser} from '../controller/userControllers.js';

import { getProductList,addToCart,fetchCartDetails,retrieveCartDetails} from '../controller/userControllers.js';

import { protect } from '../middleware/authMiddleware.js';


router.post('/',registerUser)
router.post('/login', loginUser)
router.get('/profile',protect, getUserProfile);
router.post('/logout',logoutUser)

router.get('/listed-products',getProductList);
router.post('/add-to-cart',protect,addToCart);
router.get('/cart-details',protect,fetchCartDetails)
router.get('/cart-details',protect,retrieveCartDetails)


export default router;