import mongoose from 'mongoose';

const escrowSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  heldAmount: { type: Number, required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['holding', 'released', 'refunded'], default: 'holding' }
}, { timestamps: true });

export default mongoose.model('Escrow', escrowSchema); 