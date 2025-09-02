import { Server } from 'socket.io';
import Message from '../models/message.model.js';
import Notification from '../models/notification.model.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Map to keep track of online users and their socket IDs
export const onlineUsers = new Map();
export let io = null;

export default function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: 'https://creata-kappa.vercel.app'|| 'http://localhost:5173', 
      methods: ['GET', 'POST'],
      credentials: true // Allow cookies
    }
  });

  // Middleware for authenticating socket connections
  io.use(async (socket, next) => {
    try {
      // Get token from cookies
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error('Authentication required'));

      // Parse cookies to get accessToken
      const cookiePairs = cookies.split(';').map(pair => pair.trim().split('='));
      const cookieMap = Object.fromEntries(cookiePairs);
      const token = cookieMap.accessToken;

      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id;
    onlineUsers.set(userId, socket.id);

  
    // Send message
    socket.on('chat:send', async ({ receiverId, content, imageUrl, messageType = 'text' }, callback) => {
      if (!receiverId || (!content && !imageUrl)) {
        return callback({ success: false, message: 'Invalid data' });
      }

      try {
        // Only allow messaging between friends 
        const sender = await User.findById(userId);
        if (!sender.friends.includes(receiverId)) {
          return callback({ success: false, message: 'Can only message friends.' });
        }

        const messageData = {
          senderId: userId,
          receiverId,
          messageType
        };

        if (content) {
          messageData.content = content;
        }

        if (imageUrl) {
          messageData.imageUrl = imageUrl;
        }

        const message = await Message.create(messageData);

        // Emit to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('chat:receive', {
            _id: message._id,
            senderId: userId,
            receiverId,
            content: message.content,
            imageUrl: message.imageUrl,
            messageType: message.messageType,
            timestamp: message.timestamp,
            isRead: false
          });
        }

        // Also send it to sender (for immediate display if needed)
        socket.emit('chat:receive', {
          _id: message._id,
          senderId: userId,
          receiverId,
          content: message.content,
          imageUrl: message.imageUrl,
          messageType: message.messageType,
          timestamp: message.timestamp,
          isRead: false
        });

        callback({ success: true, message: 'Message sent', data: message });
      } catch (err) {
        console.error('Error in chat:send', err);
        callback({ success: false, message: 'Failed to send message' });
      }
    });

    // Mark messages as read
    socket.on('chat:markRead', async ({ senderId }) => {
      await Message.updateMany({ senderId, receiverId: userId, isRead: false }, { isRead: true });
    });

  
    // Send notification
    socket.on('notify:send', async ({ userId: targetUserId, type, content }) => {
      const notification = await Notification.create({ userId: targetUserId, type, content });
      const targetSocketId = onlineUsers.get(targetUserId.toString());
      if (targetSocketId) {
        io.to(targetSocketId).emit('notify:receive', {
          _id: notification._id,
          type,
          content,
          isRead: false,
          createdAt: notification.createdAt
        });
      }
    });

    // Mark notification as read
    socket.on('notify:markRead', async ({ notificationId }) => {
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    });

    // Disconnect
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
    });
  });
} 
