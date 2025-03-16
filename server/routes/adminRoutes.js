import express from "express";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getAllOrders, updateOrderStatus, getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

// Admin routes (Only accessible by admin users)
router.get("/orders", verifyToken, isAdmin, getAllOrders);
router.put("/orders/:id", verifyToken, isAdmin, updateOrderStatus);
router.get("/users", verifyToken, isAdmin, getAllUsers);


export default router;
