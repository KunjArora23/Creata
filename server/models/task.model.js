import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reward: { type: Number, required: true },
  status: { type: String, enum: ['open', 'requested', 'assigned', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deadline: { type: Date, required: true },
  completionConfirmations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Task', taskSchema); 