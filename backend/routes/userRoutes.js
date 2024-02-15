import express from 'express';
const router = express.Router();

import { authUser, registerUser, logoutUser, getUserProfile, getListedProducts, addingToCart, getCartDetails, changingQuantity, deleteProductFromCart } from '../controller/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/',registerUser)
router.post('/auth', authUser)
router.post('/logout',logoutUser)
router.get('/profile',protect, getUserProfile);
router.get('/listed-products',getListedProducts);
router.post('/add-to-cart',protect,addingToCart)
router.get('/cart-details',protect,getCartDetails)
router.post('/change-quantity',protect,changingQuantity)
router.delete('/delete-product',protect,deleteProductFromCart)



export default router;