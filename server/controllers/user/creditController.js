import User from '../../models/user.model.js';
import Transaction from '../../models/transaction.model.js';

// Send credits to a friend
export const sendCredits = async (req, res, next) => {
  try {
    const { toUserId, amount } = req.body;
    const fromUser = await User.findById(req.user._id);
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }
    if (fromUser.credits < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient credits' });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be positive' });
    }
    fromUser.credits -= amount;
    toUser.credits += amount;
    await fromUser.save();
    await toUser.save();
    await Transaction.create({
      fromUser: fromUser._id,
      toUser: toUser._id,
      amount,
      type: 'send'
    });
    res.json({ success: true, message: 'Credits sent successfully' });
  } catch (err) {
    next(err);
  }
};

// View transaction history
export const getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({
      $or: [
        { fromUser: userId },
        { toUser: userId }
      ]
    }).sort({ createdAt: -1 }).populate('fromUser toUser', 'name email');
    res.json({ success: true, transactions });
  } catch (err) {
    next(err);
  }
}; 