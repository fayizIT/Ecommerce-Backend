import express from 'express';
const router = express.Router();

import { loginUser, registerUser} from '../controller/userController.js';


router.post('/',registerUser)
router.post('/auth', loginUser)



export default router;