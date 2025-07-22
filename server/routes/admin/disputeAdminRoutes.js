import express from 'express';
import { getAllDisputes, resolveDispute, getFlaggedUsers, warnOrBanUser, getUserListWithStats, unbanUser } from '../../controllers/admin/disputeAdminController.js';
import { authorizeRoles } from '../../middlewares/verifyToken.middleware.js';

const router = express.Router();

// View all disputes
router.get('/disputes', authorizeRoles("admin"), getAllDisputes);
// Resolve dispute
router.post('/disputes/:disputeId/resolve', authorizeRoles("admin"), resolveDispute);
// View flagged users
router.get('/flagged-users', authorizeRoles("admin"), getFlaggedUsers);
// Warn or ban user
router.post('/user/:userId/action', authorizeRoles("admin"), warnOrBanUser);
// View user list with stats
router.get('/usersStats', authorizeRoles("admin"), getUserListWithStats);
// Unban a user
router.post('/user/:userId/unban', authorizeRoles("admin"), unbanUser);

export default router; 