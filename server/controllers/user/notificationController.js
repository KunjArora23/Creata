import Notification from '../../models/notification.model.js';

// Get all notifications for logged-in user
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

// Mark a notification as read
export const markNotificationRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
}; 