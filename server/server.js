import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet'; // Fixed import for ES Module


// Import Routes
import authRoutes from './routes/authRoutes.js';
import reservationRoutes from "./routes/reservationRoutes.js";
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors({
  origin: ["https://cafe-elegant-new.vercel.app/", "http://localhost:1234", "https://js.stripe.com"],
  methods: ["GET", "POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });
export { upload };

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
       connectSrc: [
          "'self'",
          "http://localhost:1234",
          "https://api.stripe.com",
          "https://r.stripe.com",
          "https://cafe-elegant.onrender.com", 
          "https://cafe-elegant.vercel.app" 
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "https://cdn.honey.io"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.honey.io"
        ],
        imgSrc: [
          "'self'",
          "https://cdn.honey.io",
          "https://q.stripe.com"
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "**https://www.google.com/maps/embed?**",
          "**https://www.google.com/maps/**",
          "**https://maps.google.com/**"
        ]
      },
    },
  })
);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/checkouts', checkoutRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/summaries', summaryRoutes);



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(' MongoDB Connected'))
  .catch((err) => {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1); // Exit process if database connection fails
  });

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
