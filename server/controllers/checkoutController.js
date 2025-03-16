import Checkout from '../models/checkout.js';

//  Initiate Checkout
export const initiateCheckout = async (req, res) => {
  try {
    const { orderType, items, subtotal, total } = req.body;

    if (!orderType || !subtotal || !total || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields or invalid items' });
    }

    const checkout = new Checkout(req.body);
    await checkout.save();
    res.status(201).json({ message: 'Checkout initiated', checkoutId: checkout._id });
  } catch (error) {
    console.error('Error in initiateCheckout:', error);
    res.status(500).json({ message: 'Failed to initiate checkout', error: error.message });
  }
};

//  Update Shipping Address
export const updateShippingAddress = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Invalid shipping address' });
    }

    const checkout = await Checkout.findByIdAndUpdate(
      checkoutId, 
      { shippingAddress: req.body }, 
      { new: true, runValidators: true }
    );
    
    if (!checkout) return res.status(404).json({ message: 'Checkout not found' });

    res.json({ message: 'Shipping address updated', address: checkout.shippingAddress });
  } catch (error) {
    console.error('Error in updateShippingAddress:', error);
    res.status(500).json({ message: 'Failed to update shipping address', error: error.message });
  }
};

//  Update Billing Address
export const updateBillingAddress = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Invalid billing address' });
    }

    const checkout = await Checkout.findByIdAndUpdate(
      checkoutId, 
      { billingAddress: req.body }, 
      { new: true, runValidators: true }
    );

    if (!checkout) return res.status(404).json({ message: 'Checkout not found' });

    res.json({ message: 'Billing address updated', address: checkout.billingAddress });
  } catch (error) {
    console.error('Error in updateBillingAddress:', error);
    res.status(500).json({ message: 'Failed to update billing address', error: error.message });
  }
};

//  Calculate Taxes
export const calculateTaxes = async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) return res.status(404).json({ message: 'Checkout not found' });

    const taxRate = 0.1; // 10% tax
    const subtotal = checkout.subtotal || 0;
    const taxes = subtotal * taxRate;

    const discountAmount = (Array.isArray(checkout.discounts) ? checkout.discounts : []).reduce((sum, d) => sum + d.amount, 0);

    checkout.taxes = taxes;
    checkout.total = subtotal + taxes - discountAmount;

    await checkout.save();
    res.json({ message: 'Taxes calculated', taxes, total: checkout.total });
  } catch (error) {
    console.error('Error in calculateTaxes:', error);
    res.status(500).json({ message: 'Failed to calculate taxes', error: error.message });
  }
};
