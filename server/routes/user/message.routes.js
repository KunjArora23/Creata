import express from 'express';
import { getChatHistory, markMessagesRead, uploadImage } from '../../controllers/user/messageController.js';
import { authorizeRoles } from '../../middlewares/verifyToken.middleware.js';
import upload from '../../config/multer.config.js';

const router = express.Router();

// Get chat history with a friend
router.get('/:friendId', authorizeRoles('user'), getChatHistory);

// Mark messages as read
router.put('/:friendId/read', authorizeRoles('user'), markMessagesRead);

// Upload image for chat
router.post('/upload-image', authorizeRoles('user'), upload.single('image'), uploadImage);

export default router; 