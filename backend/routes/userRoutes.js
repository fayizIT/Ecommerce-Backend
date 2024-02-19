import express from 'express';
const router = express.Router();
import { authUser, registerUser, logoutUser, getUserProfile } from '../controller/userControllers.js';
import { getListedProducts, addingToCart, getCartDetails, changingQuantity, deleteProductFromCart} from '../controller/userControllers.js';



import { userprotect } from '../middleware/authMiddleware.js';

router.post('/',registerUser)
router.post('/auth', authUser)
router.post('/logout',logoutUser)
router.get('/profile',userprotect, getUserProfile);
router.get('/listed-products',getListedProducts);
router.post('/add-to-cart',userprotect,addingToCart)
router.get('/cart-details',userprotect,getCartDetails)
router.post('/change-quantity',userprotect,changingQuantity)
router.delete('/delete-product',userprotect,deleteProductFromCart)



export default router;