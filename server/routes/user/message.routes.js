import express from 'express';
import { getChatHistory, markMessagesRead } from '../../controllers/user/messageController.js';
import { authorizeRoles } from '../../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Get chat history with a friend
router.get('/:friendId', authorizeRoles('user'), getChatHistory);

// Mark all messages from friend as read
router.patch('/:friendId/read', authorizeRoles('user'), markMessagesRead);

export default router; 