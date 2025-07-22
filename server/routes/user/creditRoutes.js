import express from 'express';
import { sendCredits, getTransactionHistory } from '../../controllers/user/creditController.js';
import { authorizeRoles } from '../../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Send credits to a friend
router.post('/send', authorizeRoles('user'), sendCredits);
// View transaction history
router.get('/history', authorizeRoles('user'), getTransactionHistory);

export default router; 