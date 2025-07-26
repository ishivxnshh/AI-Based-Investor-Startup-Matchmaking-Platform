import express from 'express';
import { registerUser, loginUser, googleAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-auth', googleAuth); // Add this new route

export default router;