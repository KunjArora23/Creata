import express from 'express';
import { createTask, getAllTasks, requestTask, acceptTaskRequest, rejectTaskRequest, startTask, extendDeadline, completeTask, cancelTask, addReview, getUserReviews, withdrawFromTask } from '../../controllers/user/taskController.js';
import { authorizeRoles } from '../../middlewares/verifyToken.middleware.js';

const router = express.Router();

console.log("Task routes");

// Post new task
router.post('/create', authorizeRoles("user"), createTask);
// View all tasks
router.get('/all', authorizeRoles("user"), getAllTasks);
// Request to perform a task
router.post('/:taskId/request', authorizeRoles("user"), requestTask);
// Accept task request
router.post('/:taskId/accept/:userId', authorizeRoles("user"), acceptTaskRequest);
// Reject task request
router.post('/:taskId/reject/:userId', authorizeRoles("user"), rejectTaskRequest);
// Start task (move credits to escrow)
router.post('/:taskId/start', authorizeRoles("user"), startTask);
// Extend deadline
router.patch('/:taskId/extend', authorizeRoles("user"), extendDeadline);
// Mark task as completed (dual confirmation)
router.post('/:taskId/complete', authorizeRoles("user"), completeTask);
// Cancel task
router.post('/:taskId/cancel', authorizeRoles("user"), cancelTask);
// Withdraw from an assigned task
router.post('/:taskId/withdraw', authorizeRoles("user"), withdrawFromTask);

// Add rating and review
router.post('/:taskId/review', authorizeRoles("user"), addReview);
// Get reviews for a user
router.get('/reviews/:userId', authorizeRoles("user"), getUserReviews);

export default router; 