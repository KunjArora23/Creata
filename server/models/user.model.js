import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  cloudinaryId: {
    type: String,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Busy', 'Away', 'Offline'],
    default: 'Active'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  pendingRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  sentRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  credits: { type: Number, default: 100 },
  warnings: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
  refreshTokens: [{
    type: String
    // Store hashed refresh tokens for security (optional, can be plain if using JWT blacklist)
  }],
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema); 