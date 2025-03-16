import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  estimatedDeliveryTime: { type: Date },
  summaryNumber: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Summary', summarySchema);
