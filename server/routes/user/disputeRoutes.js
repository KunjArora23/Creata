import express from 'express';
import { raiseDispute, getMyDisputes } from '../../controllers/user/disputeController.js';
import { authorizeRoles } from '../../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Raise dispute
router.post('/raise', authorizeRoles('user'), raiseDispute);
// View own disputes
router.get('/my', authorizeRoles('user'), getMyDisputes);

export default router; 