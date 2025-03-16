import mongoose from 'mongoose';

const checkoutSchema = new mongoose.Schema({
  orderType: { type: String, enum: ['store', 'online'], required: true },
  items: [{ name: String, price: Number, quantity: Number }],
  subtotal: { type: Number, required: true },
  taxes: { type: Number, default: 0 },
  total: { type: Number, required: true },
  discounts: [{ code: String, amount: Number }],
  shippingAddress: { type: Object },
  billingAddress: { type: Object },
  pickupTime: { type: String },
  deliveryOption: { type: String },
  checkoutCompleted: { type: Boolean, default: false },
}, { timestamps: true });

const Checkout = mongoose.model('Checkout', checkoutSchema);
export default Checkout;
