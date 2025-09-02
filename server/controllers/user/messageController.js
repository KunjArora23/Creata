import mongoose from 'mongoose';
import Message from '../../models/message.model.js';
import User from '../../models/user.model.js';
import { uploadMedia } from '../../config/cloudinary.config.js';
import { io, onlineUsers } from '../../socket/socket.js';

// Get chat history between logged-in user and another user
export const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    // Only allow if they are friends
    const user = await User.findById(userId);
    const friendIdObj = new mongoose.Types.ObjectId(friendId);
    
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

// Upload image for chat
export const uploadImage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { receiverId } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required' });
    }

    // Check if they are friends
    const user = await User.findById(userId);
    if (!user.friends.includes(receiverId)) {
      return res.status(403).json({ success: false, message: 'Can only send images to friends.' });
    }

    // Upload to Cloudinary
    const uploadResponse = await uploadMedia(req.file.path, 'chat-images');
    if (!uploadResponse) {
      return res.status(500).json({ success: false, message: 'Failed to upload image' });
    }

    // Create message with image
    const message = await Message.create({
      senderId: userId,
      receiverId,
      imageUrl: uploadResponse.secure_url,
      messageType: 'image'
    });

    // Return the message data for immediate display
    const messageData = {
      _id: message._id,
      senderId: userId,
      receiverId,
      imageUrl: uploadResponse.secure_url,
      messageType: 'image',
      timestamp: message.timestamp,
      isRead: false
    };

    // Emit the message through socket if available
    if (io) {
      // Emit to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('chat:receive', messageData);
      }

      // Emit to sender for immediate display
      const senderSocketId = onlineUsers.get(userId.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit('chat:receive', messageData);
      }
    }

    res.json({ 
      success: true, 
      message: 'Image sent successfully',
      data: messageData
    });
  } catch (err) {
    next(err);
  }
}; 