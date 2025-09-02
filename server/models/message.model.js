import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  messageType: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Custom validation to ensure either content or imageUrl is provided
messageSchema.pre('validate', function(next) {
  if (!this.content && !this.imageUrl) {
    this.invalidate('content', 'Either content or imageUrl must be provided');
  }
  if (this.content && this.imageUrl) {
    this.invalidate('content', 'Cannot have both content and imageUrl');
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);
export default Message; 