import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

// Debug: Check if env variables are loaded
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);

// Now import routes (which import controllers that need env vars)
import authRoutes from './routes/auth.js';
import forumRoutes from './routes/forum.js';
import gameRoutes from './routes/game.js';
import resourceRoutes from './routes/resources.js';

const app = express();

// Middleware
// CORS configuration for development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL, // Add your frontend Vercel URL in env vars
    ].filter(Boolean); // Remove undefined values

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/game', gameRoutes);
app.use('/api', resourceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Start server (only for local development)
const PORT = process.env.PORT || 5000;

// Only start server if not running in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default app;
