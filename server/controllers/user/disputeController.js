import Dispute from '../../models/dispute.model.js';
import Task from '../../models/task.model.js';

// Raise a dispute
export const raiseDispute = async (req, res, next) => {
  try {
    const { taskId, againstUser, reason } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    // Only participants can raise dispute
    if (!task.createdBy.equals(req.user._id) && !task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to raise dispute for this task' });
    }
    const dispute = await Dispute.create({
      taskId,
      raisedBy: req.user._id,
      againstUser,
      reason
    });
    res.status(201).json({ success: true, dispute });
  } catch (err) {
    next(err);
  }
};

// View own disputes
export const getMyDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find({ raisedBy: req.user._id }).populate('taskId againstUser', 'title name email');
    res.json({ success: true, disputes });
  } catch (err) {
    next(err);
  }
}; 