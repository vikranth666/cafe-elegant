import Stripe from 'stripe';
import Payment from '../models/payment.js';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//  Create a Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card']
    });

    res.status(200).json({ 
      clientSecret: paymentIntent.client_secret, 
      paymentIntentId: paymentIntent.id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
  }
};

//  Confirm Payment
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const payment = new Payment({
        userId: req.user.id, // Assuming user is authenticated
        paymentIntentId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
        transactionId: paymentIntent.charges.data[0]?.id || null,
        paymentMethod: paymentIntent.payment_method
      });

      await payment.save();
      return res.status(200).json({ message: 'Payment successful', transactionId: payment.transactionId });
    } else {
      return res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment confirmation failed', error: error.message });
  }
};

//  Save Payment Method
export const savePaymentMethod = async (req, res) => {
  try {
    const { userId, paymentMethodId } = req.body;
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, { customer: userId });

    res.status(200).json({ message: 'Payment method saved successfully', paymentMethod });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save payment method', error: error.message });
  }
};
