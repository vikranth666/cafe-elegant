import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentIntentId: { type: String, required: true },
  transactionId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: { type: String, enum: ['pending', 'processing', 'succeeded', 'failed'], default: 'pending' },
  paymentMethod: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
