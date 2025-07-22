import express from 'express';
import { register, login, refreshAccessToken, logout, verifyOtp, resendOtp } from '../../controllers/user/auth.controller.js';

const router = express.Router();

// Authentication routes
router.post('/signup', register);
router.post('/signin', login);
router.get('/refresh-access-token', refreshAccessToken);
router.get('/signout', logout);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

export default router; 