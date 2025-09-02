import Dispute from '../../models/dispute.model.js';
import User from '../../models/user.model.js';
import Task from '../../models/task.model.js';
import Transaction from '../../models/transaction.model.js';
import Escrow from '../../models/escrow.model.js';



// View all disputes
export const getAllDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find().populate('taskId raisedBy againstUser', 'title name email');
    res.json({ success: true, disputes });
  } catch (err) {
    next(err);
  }
};

// Resolve dispute (add remarks, release/refund credits)
export const resolveDispute = async (req, res, next) => {
  try {
    const { disputeId } = req.params;
    const { resolution, action } = req.body;  
    const dispute = await Dispute.findById(disputeId);


    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute not found' });
    }
    if (dispute.status === 'resolved') {
      return res.status(400).json({ success: false, message: 'Dispute already resolved' });
    }
    dispute.status = 'resolved';
    dispute.resolution = resolution;
    await dispute.save();

    const task = await Task.findById(dispute.taskId);
    const escrow = await Escrow.findOne({ taskId: task._id, status: 'holding' });

    if (escrow) {
      if (action === 'release') {
        const user = await User.findById(dispute.againstUser);
        user.credits += escrow.heldAmount;
        await user.save();
        escrow.status = 'released';
        await escrow.save();
        await Transaction.create({
          fromUser: task.createdBy,
          toUser: dispute.againstUser,
          amount: escrow.heldAmount,
          type: 'escrow_release'
        });
      } else if (action === 'refund') {
        const creator = await User.findById(task.createdBy);
        creator.credits += escrow.heldAmount;
        await creator.save();
        escrow.status = 'refunded';
        await escrow.save();
        await Transaction.create({
          fromUser: dispute.againstUser,
          toUser: task.createdBy,
          amount: escrow.heldAmount,
          type: 'refund'
        });
      }
    }

    res.json({ success: true, dispute });
  } catch (err) {
    next(err);
  }
};

// View flagged users (warnings > 0 or isBanned)
export const getFlaggedUsers = async (req, res, next) => {
  try {
    const users = await User.find({ $or: [{ warnings: { $gt: 0 } }, { isBanned: true }] }).select('name email warnings isBanned');
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

// Warn or ban user
export const warnOrBanUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'warn' or 'ban'
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (action === 'warn') {
      user.warnings += 1;
      if (user.warnings >= 3) {
        user.isBanned = true;
      }
    } else if (action === 'ban') {
      user.isBanned = true;
    }
    await user.save();
    res.json({ success: true, message: user.warnings >= 3 ? 'User has been banned because of warnings' : user.isBanned ? 'User has been banned' : 'User has been warned', user });
  } catch (err) {
    next(err);
  }
};

// View user list with stats
export const getUserListWithStats = async (req, res, next) => {
  try {
    const users = await User.find().select('name email credits warnings isBanned');
    // For each user, count completed tasks
    // promise all isliye use kr rhe  h as map ke andr async function h
    const stats = await Promise.all(users.map(async user => {
      const tasksDone = await Task.countDocuments({ assignedTo: user._id, status: 'completed' });
      return {
        ...user.toObject(),
        tasksDone
      };
    }));
    res.json({ success: true, users: stats });
  } catch (err) {
    next(err);
  }
};

// Unban a user
export const unbanUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.isBanned) {
      return res.status(400).json({ success: false, message: 'User is not banned' });
    }

    user.isBanned = false;
    await user.save();

    res.json({ success: true, message: 'User has been unbanned', user });
  } catch (err) {
    next(err);
  }
};