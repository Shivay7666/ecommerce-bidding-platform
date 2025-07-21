const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const newsletterRoutes = require('./routes/newsletter');
const uploadRoutes = require('./routes/uploads');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-app-name.vercel.app' 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Routes
app.use('/api/auth', async (req, res, next) => {
  await connectDB();
  next();
}, authRoutes);

app.use('/api/products', async (req, res, next) => {
  await connectDB();
  next();
}, productRoutes);

app.use('/api/newsletter', async (req, res, next) => {
  await connectDB();
  next();
}, newsletterRoutes);

app.use('/api/uploads', async (req, res, next) => {
  await connectDB();
  next();
}, uploadRoutes);

// Base route for API health check
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'Bid & Barter API is running',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports = app;
