import express from 'express';
import {
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation,
  } from "../controllers/reservationController.js";
  import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", getReservations);
router.post("/",verifyToken, createReservation);
router.put("/:id",verifyToken, updateReservation);
router.delete("/:id",verifyToken, deleteReservation);

export default router;
