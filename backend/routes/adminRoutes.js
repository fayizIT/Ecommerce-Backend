import express from 'express';
import { registerAdmin, loginAdmin, logoutAdmin, } from '../controller/adminController.js';



router.post('/',registerAdmin)
router.post('/auth', loginAdmin)
router.post('/logout',logoutAdmin)



export default router;