import Reservation from '../models/Reservation.js';
import mongoose from 'mongoose';


//  Get all reservations
export const getReservations = async (req, res) => {
  try {
    // If there's no authenticated user, return an empty array (or a message)
    if (!req.user) {
      return res.status(200).json([]);
    }
    // Otherwise, return only the reservations for that user
    const reservations = await Reservation.find({ userId: req.user.id });
    console.log("Reservations found:", reservations); // Add logging
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error); // Add logging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//  Create a new reservation
export const createReservation = async (req, res) => {
  try {
    const { name, date, time, guests } = req.body;
    const newReservation = new Reservation({
      userId: req.user.id, 
      name,
      date,
      time,
      guests,
    });

    await newReservation.save();

    // Fetch updated reservations list
    const updatedReservations = await Reservation.find({ userId: req.user.id });

    res.status(201).json(updatedReservations); // Return the updated list
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation", error: error.message });
  }
};


//  Update an existing reservation
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, date, time, guests } = req.body;

    console.log("Updating Reservation - ID:", id);
    console.log("User ID:", userId);

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid reservation ID" });
    }

    // Check if reservation exists
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check if the reservation belongs to the user
    if (reservation.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this reservation" });
    }

    // Update reservation
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { name, date, time, guests },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation update failed" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Error updating reservation", error: error.message });
  }
};

//  Delete a reservation

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log("Deleting Reservation - ID:", id);
    console.log("User ID:", userId);

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid reservation ID" });
    }

    // Check if reservation exists
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check if the reservation belongs to the user
    if (reservation.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this reservation" });
    }

    await Reservation.deleteOne({ _id: id });

    res.status(200).json({ message: "Reservation deleted successfully", id });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Error deleting reservation", error: error.message });
  }
};