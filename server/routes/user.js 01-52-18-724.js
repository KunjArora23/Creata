import express from 'express';
import { getUser } from '../controllers/user/userController.js';

const router = express.Router();

// Basic user route - placeholder
router.get('/', getUser);

export default router; 