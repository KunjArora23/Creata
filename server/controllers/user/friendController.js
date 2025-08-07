import mongoose from 'mongoose';
import User from '../../models/user.model.js';

// Send a friend request
export const sendFriendRequest = async (req, res,next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id;

    // ye check kr rha k user toh khud ko request nhi send kr skta
    if (userId === String(currentUser)) {
      return res.status(400).json({ success: false, message: 'You cannot send a friend request to yourself.' });
    }
    // jis user ko request send kr rha h usko find kr rha h
    const user = await User.findById(userId);
    const me = await User.findById(currentUser);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    // ye check kr rha k user toh already request send kr chuka h ya already friend h
    if (user.pendingRequests.includes(currentUser) || user.friends.includes(currentUser)) {
      return res.status(400).json({ success: false, message: 'Request already sent or already friends.' });
    }
    user.pendingRequests.push(currentUser);
    me.sentRequests.push(userId);
    await user.save();
    await me.save();
    return res.json({ success: true, message: 'Friend request sent.' });
  } catch (err) {
    next(err);
  }
};

// get all pending friend requests
export const getFriendRequests = async (req, res, next) => {
  try {
    const currentUser = req.user._id;
    const user = await User.findById(currentUser).populate('pendingRequests', 'name email avatarUrl skills bio status');
    const pendingRequests = user.pendingRequests;
    return res.json({ success: true, message: 'Pending requests fetched.', pendingRequests });

  } catch (err) {
    next(err);
  }
}

// get all sent friend requests
export const getSentRequests = async (req, res, next) => {
  try {
    const currentUser = req.user._id;
    const user = await User.findById(currentUser).populate('sentRequests', 'name email avatarUrl skills bio status');
    const sentRequests = user.sentRequests;
    return res.json({ success: true, message: 'Sent requests fetched.', sentRequests });

  } catch (err) {
    next(err);
  }
}

// Accept a friend request
export const acceptFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id;
    
    // Validate userId
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const user = await User.findById(userId);
    const me = await User.findById(currentUser);

    if (!user || !me) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!me.pendingRequests.includes(userId)) {
      return res.status(400).json({ success: false, message: 'No pending request from this user.' });
    }

    // Remove from pending/sent
    me.pendingRequests = me.pendingRequests.filter(id => String(id) !== String(userId));
    user.sentRequests = user.sentRequests.filter(id => String(id) !== String(currentUser));
    // Add to friends
    me.friends.push(userId);
    user.friends.push(currentUser);
    await me.save();
    await user.save();
    return res.json({ success: true, message: 'Friend request accepted.' });
  } catch (err) {
    next(err);
  }
};

// Reject a friend request
export const rejectFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id;
    
    // Validate userId
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const user = await User.findById(userId);
    const me = await User.findById(currentUser);
    
    if (!user || !me) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    if (!me.pendingRequests.includes(userId)) {
      return res.status(400).json({ success: false, message: 'No pending request from this user.' });
    }
    
    // Remove from pending/sent
    me.pendingRequests = me.pendingRequests.filter(id => String(id) !== String(userId));
    user.sentRequests = user.sentRequests.filter(id => String(id) !== String(currentUser));
    await me.save();
    await user.save();
    return res.json({ success: true, message: 'Friend request rejected.' });
  } catch (err) {
    next(err);
  }
};

// Remove a friend
export const removeFriend = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id;
    const user = await User.findById(userId);
    const me = await User.findById(currentUser);
    if (!user || !me) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (!me.friends.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Not friends with this user.' });
    }
    me.friends = me.friends.filter(id => String(id) !== String(userId));
    user.friends = user.friends.filter(id => String(id) !== String(currentUser));
    await me.save();
    await user.save();
    return res.json({ success: true, message: 'Friend removed.' });
  } catch (err) {
    next(err);
  }
};

// View connections (friends)
export const getConnections = async (req, res) => {
  try {

    const currentUser = req.user._id;
    
    const me = await User.findById(currentUser).populate('friends', 'name email avatarUrl skills bio status');

    return res.json({ success: true, message: 'Connections fetched.', friends: me.friends });
  } catch (err) {
    next(err);
  }
};

// Search users by name or skill
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query required.' });
    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [
        { name: regex },
        { skills: regex }
      ]
    }, 'name email avatarUrl skills bio status');
    return res.json({ success: true, message: 'Users found.', users });
  } catch (err) {
    next(err);
  }
}; 