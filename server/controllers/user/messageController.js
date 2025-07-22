import mongoose from 'mongoose';
import Message from '../../models/message.model.js';
import User from '../../models/user.model.js';

// Get chat history between logged-in user and another user
export const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;


    // Only allow if they are friends
  
    const user = await User.findById(userId);
    const friendIdObj=new mongoose.Types.ObjectId(friendId);
    
    if (!user.friends.includes(friendId)) {
      return res.status(403).json({ success: false, message: 'Not friends.' });
    }
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

// Mark all messages from friend as read
export const markMessagesRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;
    await Message.updateMany({ senderId: friendId, receiverId: userId, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'Messages marked as read.' });
  } catch (err) {
    next(err);
  }
}; 