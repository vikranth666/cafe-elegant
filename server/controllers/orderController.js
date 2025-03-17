import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
import Order from '../models/Order.js';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//  Place Order
export const placeOrder = async (req, res) => {
  try {
      console.log("Incoming Order Data:", req.body);

      const { userId, products, totalAmount, guestCheckout } = req.body;

      // Validate required fields
      if (!products || !totalAmount) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate products array
      if (!Array.isArray(products)) {
          return res.status(400).json({ message: "Products must be an array" });
      }

      // Calculate total amount from products
      const calculatedTotal = products.reduce((total, product) => {
          return total + (product.price * product.quantity);
      }, 0);

      if (calculatedTotal !== totalAmount) {
          return res.status(400).json({ message: "Total amount does not match calculated total" });
      }

      // Create order object
      const order = new Order({
          userId: guestCheckout ? null : userId, // Set userId to null for guest orders
          products,
          totalAmount,
          isPaid: false,
          guestCheckout, // Add a flag to identify guest orders
      });

      await order.save();
      res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
      console.error(" Order Creation Error:", err);
      res.status(500).json({ message: "Order failed", error: err.message });
  }
};

//  Get Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.query.userId });
    console.log("Orders being sent:", orders);
    res.json(orders || []);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

//  Process Payment
export const payOrder = async (req, res) => {
  try {
      const { orderId, paymentMethodId, guestCheckout } = req.body;
      if (!orderId || !paymentMethodId) {
          return res.status(400).json({ message: "Order ID and Payment Method are required" });
      }

      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      // Skip user validation for guest orders
      if (!guestCheckout) {
          const token = req.headers.authorization?.split(" ")[1];
          if (!token) return res.status(401).json({ message: "Unauthorized. No token provided." });

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (!decoded) return res.status(401).json({ message: "Unauthorized. Invalid token." });

          if (order.userId && order.userId.toString() !== decoded.id) {
              return res.status(403).json({ message: "Forbidden. You can't pay for someone else's order!" });
          }
      }

      // Process payment with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
          amount: order.totalAmount * 100, // Convert to cents
          currency: 'usd',
          payment_method: paymentMethodId,
          confirm: true,
      });

      // Update order status
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentIntentId = paymentIntent.id;
      await order.save();

      res.status(200).json({ message: "Payment successful", order });
  } catch (err) {
      console.error(" Payment error:", err);
      res.status(500).json({ message: "Payment failed", error: err.message });
  }
};


// Create a new order
export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error });
  }
};

// orderController.js
export const fetchOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch orders for the user
    const orders = await Order.find({ userId });
    console.log("Orders being sent:", orders);
    res.status(200).json(orders || []);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};
