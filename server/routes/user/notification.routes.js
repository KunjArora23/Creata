import express from 'express';
import { getNotifications, markNotificationRead } from '../../controllers/user/notificationController.js';
import { authorizeRoles } from '../../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Get all notifications for logged-in user
router.get('/', authorizeRoles('user'), getNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', authorizeRoles('user'), markNotificationRead);

export default router; 