import Task from '../../models/task.model.js';
import Review from '../../models/review.model.js';
import Escrow from '../../models/escrow.model.js';
import User from '../../models/user.model.js';
import mongoose from 'mongoose';
import Transaction from '../../models/transaction.model.js';

// Post new task
export const createTask = async (req, res) => {
  try {
    const { title, description, reward, deadline } = req.body;
    if (!title || !description || !reward || !deadline) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const task = await Task.create({
      title,
      description,
      reward,
      deadline,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// View all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('createdBy assignedTo requests', 'name email');
    res.json({ success: true, tasks });
  } catch (err) {
    next(err);
  }
};

// Request to perform a task
export const requestTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (task.requests.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already requested' });
    }
    if (task.status === 'assigned' || task.status === 'in_progress' || task.status === 'completed' || task.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Task is not accepting requests now' });
    }

    task.requests.push(req.user._id);
    task.status = 'requested';
    await task.save();
    res.json({ success: true, message: 'Request sent' });
  } catch (err) {
    next(err);
  }
};

// Accept task request
export const acceptTaskRequest = async (req, res) => {
  try {
    const { taskId, userId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (!task.createdBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized task not created by you' });
    }
    if (!task.requests.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User did not request this task' });
    }
    task.assignedTo = userId;
    task.status = 'assigned';
    task.requests = [];
    await task.save();
    res.json({ success: true, message: 'Task assigned' });
  } catch (err) {
    next(err);
  }
};

// Reject task request
export const rejectTaskRequest = async (req, res) => {
  try {
    const { taskId, userId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (!task.createdBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized as task not created by you' });
    }
    task.requests = task.requests.filter(id => id.toString() !== userId);
    if (task.requests.length === 0 && !task.assignedTo) {
      task.status = 'open';
    }
    await task.save();
    res.json({ success: true, message: 'Request rejected' });
  } catch (err) {
    next(err);
  }
};

// Start task (move credits to escrow)
export const startTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (!task.createdBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized as task not created by you' });
    }
    if (!task.assignedTo) {
      return res.status(400).json({ success: false, message: 'No user assigned' });
    }
    if (task.status !== 'assigned') {
      return res.status(400).json({ success: false, message: 'Task not ready to start' });
    }
    // Deduct credits from creator and hold in escrow
    const creator = await User.findById(task.createdBy);
    if (creator.credits < task.reward) {
      return res.status(400).json({ success: false, message: 'Insufficient credits to start task' });
    }
    creator.credits -= task.reward;
    await creator.save();
    const escrow = await Escrow.create({
      taskId: task._id,
      heldAmount: task.reward,
      fromUser: task.createdBy,
      toUser: task.assignedTo,
      status: 'holding'
    });
    task.status = 'in_progress';
    await task.save();
    res.json({ success: true, message: 'Task started, credits held in escrow', escrowId: escrow._id });
  } catch (err) {
    next(err);
  }
};

// Extend deadline
export const extendDeadline = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newDeadline } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (!task.createdBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized as task not created by you' });
    }
    task.deadline = newDeadline;
    await task.save();
    res.json({ success: true, message: 'Deadline extended' });
  } catch (err) {
    next(err);
  }
};

// Mark task as completed (dual confirmation)
export const completeTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { confirmation } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (task.status !== 'in_progress') {
      return res.status(400).json({ success: false, message: 'Task not in progress' });
    }
    if (!task.completionConfirmations) {
      task.completionConfirmations = [];
    }
    if (!task.completionConfirmations.includes(req.user._id.toString())) {
      task.completionConfirmations = [...(task.completionConfirmations || []), req.user._id.toString()];
    }
    if (task.completionConfirmations.includes(task.createdBy.toString()) && task.completionConfirmations.includes(task.assignedTo.toString())) {
      task.status = 'completed';
      const escrow = await Escrow.findOne({ taskId: task._id, status: 'holding' });
      if (escrow) {
        escrow.status = 'released';
        await escrow.save();
        // Transfer credits to assignee
        const assignee = await User.findById(task.assignedTo);
        assignee.credits += escrow.heldAmount;
        await assignee.save();
        // Record transaction
        await Transaction.create({
          fromUser: task.createdBy,
          toUser: task.assignedTo,
          amount: escrow.heldAmount,
          type: 'escrow_release'
        });
      }
    }
    await task.save();
    res.json({ success: true, message: 'Completion confirmation recorded', status: task.status });
  } catch (err) {
    next(err);
  }
};

// Cancel task
export const cancelTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (!task.createdBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized as task not created by you' });
    }
    if (task.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed task' });
    }
    task.status = 'cancelled';
    const escrow = await Escrow.findOne({ taskId: task._id, status: 'holding' });
    if (escrow) {
      escrow.status = 'refunded';
      await escrow.save();
      // Refund credits to creator
      const creator = await User.findById(task.createdBy);
      creator.credits += escrow.heldAmount;
      await creator.save();
      // Record transaction
      await Transaction.create({
        fromUser: task.assignedTo,
        toUser: task.createdBy,
        amount: escrow.heldAmount,
        type: 'refund'
      });
    }
    await task.save();
    res.json({ success: true, message: 'Task cancelled' });
  } catch (err) {
    next(err);
  }
};

// Withdraw from an assigned task
export const withdrawFromTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (!task.assignedTo || !task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You are not the assigned user for this task' });
    }
    if (task.status !== 'assigned' && task.status !== 'in_progress') {
      return res.status(400).json({ success: false, message: 'Cannot withdraw from task at this stage' });
    }
    // If task already started, refund the escrowed reward
    if (task.status === 'in_progress') {
      const escrow = await Escrow.findOne({ taskId: task._id, status: 'holding' });
      if (escrow) {
        escrow.status = 'refunded';
        await escrow.save();
        // Refund credits to creator
        const creator = await User.findById(task.createdBy);
        creator.credits += escrow.heldAmount;
        await creator.save();
        // Record transaction
        await Transaction.create({
          fromUser: task.assignedTo,
          toUser: task.createdBy,
          amount: escrow.heldAmount,
          type: 'refund'
        });
      }
    }
    // Reset assignment and change status
    task.assignedTo = undefined;
    task.status = task.requests.length > 0 ? 'requested' : 'open';
    await task.save();
    res.json({ success: true, message: 'You have withdrawn from the task and credits were refunded (if any).' });
  } catch (err) {
    next(err);
  }
};

// Add rating and review
export const addReview = async (req, res,next) => {
  try {
    const { taskId } = req.params;
    const { toUser, rating, comment } = req.body;
    console.log(toUser)
    console.log(comment)
    console.log(rating)
    const review = await Review.create({
      taskId,
      fromUser: req.user._id,
      toUser,
      rating,
      comment
    });
    res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

// Get reviews for a user
export const getUserReviews = async (req, res,next) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ toUser: userId }).populate('fromUser', 'name email');
    res.json({ success: true, reviews,message:"Reviews fetched successfully" });
  } catch (err) {
    next(err);
  }
};