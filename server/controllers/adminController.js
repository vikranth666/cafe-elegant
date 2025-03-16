import Order from "../models/Order.js";
import User from "../models/User.js";

// Get all orders for admin
export const getAllOrders = async (req, res) => {
    try {
        console.log("Admin fetching all orders...");
        const orders = await Order.find().populate("user", "name email");
        console.log("Orders found:", orders);
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};


// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = status;
        await order.save();
        res.json({ message: "Order updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order" });
    }
};


// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};
