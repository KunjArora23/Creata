import express from 'express';
import { getProfile, updateProfile, setStatus } from '../../controllers/user/profile.controller.js';
import { authorizeRoles } from '../../middlewares/verifyToken.middleware.js';
import upload from '../../config/multer.config.js';


const router = express.Router();

// Profile management routes (protected)
router.get('/me', authorizeRoles('user'), getProfile);
router.put('/update', authorizeRoles('user'), upload.single('avatar'), updateProfile);
router.patch('/update-status', authorizeRoles('user'), setStatus);

export default router; 