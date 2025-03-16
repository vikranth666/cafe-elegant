import express from 'express';
import {
  initiateCheckout,
  updateShippingAddress,
  updateBillingAddress,
  calculateTaxes
} from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/checkout/initiate', initiateCheckout);
router.post('/checkout/:checkoutId/shipping-address', updateShippingAddress);
router.post('/checkout/:checkoutId/billing-address', updateBillingAddress);
router.get('/checkout/:checkoutId/taxes', calculateTaxes);

export default router;
