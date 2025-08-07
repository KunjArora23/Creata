import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  reward: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10000
  },
  status: { 
    type: String, 
    enum: ['open', 'requested', 'assigned', 'in_progress', 'completed', 'cancelled'], 
    default: 'open',
    index: true
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  },
  requests: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  }],
  deadline: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  completionConfirmations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  maxRequests: {
    type: Number,
    default: 10,
    min: 1,
    max: 50
  }
}, { 
  timestamps: true 
});

// Indexes for better performance
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ status: 1, deadline: 1 });

export default mongoose.model('Task', taskSchema);