import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //  Added userId
    name: String,
    email: String,
    phone: String,
    date: String,
    time: String,
    guests: Number
});

export default mongoose.model('Reservation', ReservationSchema);

