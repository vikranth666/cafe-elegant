import express from 'express';
import { placeOrder, getOrders, payOrder, createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/place', placeOrder);
router.get('/user-orders', getOrders);
router.post('/pay', payOrder);
router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);
;


export default router;

