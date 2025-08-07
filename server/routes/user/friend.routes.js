import express from 'express';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, getConnections, searchUsers, getFriendRequests, getSentRequests } from '../../controllers/user/friendController.js';
import { authorizeRoles } from '../../middlewares/verifyToken.middleware.js';

const router = express.Router();


// Send friend request
router.post('/requests/:userId/send', authorizeRoles('user'), sendFriendRequest);
// Accept friend request
router.post('/requests/:userId/accept', authorizeRoles('user'), acceptFriendRequest);
// Reject friend request
router.post('/requests/:userId/reject', authorizeRoles('user'), rejectFriendRequest);
// get pending requests
router.get('/requests/pending', authorizeRoles('user'), getFriendRequests);
// get sent requests
router.get('/requests/sent', authorizeRoles('user'), getSentRequests);
// Remove friend
router.delete('/connections/:userId/remove', authorizeRoles('user'), removeFriend);
// View all connections
router.get('/connections', authorizeRoles('user'), getConnections);
// Search users
router.get('/search', authorizeRoles('user'), searchUsers);

export default router; 