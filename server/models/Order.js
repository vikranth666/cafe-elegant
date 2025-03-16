import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  shippingAddress: { type: Object, required: true },
  paymentDetails: { type: Object, required: true },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  totalAmount: { type: Number, required: true } // ✅ Ensure this is required
});


const Order = mongoose.model('Order', OrderSchema);
export default Order;