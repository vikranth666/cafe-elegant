import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String }, // Image file path
    stock: { type: Number, default: 0 }, // Available stock quantity
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model (for admin or seller)
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
