import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  againstUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  resolution: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Dispute', disputeSchema); 