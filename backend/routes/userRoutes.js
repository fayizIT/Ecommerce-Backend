import express from 'express';
const router = express.Router();

import { loginUser, registerUser, getUserProfile,logoutUser} from '../controller/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';


router.post('/',registerUser)
router.post('/login', loginUser)
router.get('/profile',protect, getUserProfile);
router.post('/logout',logoutUser)



export default router;