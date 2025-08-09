import express from 'express';
import { registerUser, loginUser, googleAuth, updateUserRole } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-auth', googleAuth); // Add this new route
router.post('/update-role', updateUserRole);

export default router;