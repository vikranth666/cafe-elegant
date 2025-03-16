import express from 'express';
import { createPaymentIntent, confirmPayment, savePaymentMethod } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.post('/save-method', savePaymentMethod);

export default router;
