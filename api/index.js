const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ecommerce-bidding-platform.vercel.app', 'https://ecommerce-bidding-platform-*.vercel.app']
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI environment variable is not set');
      return; // Don't throw error, allow API to work without DB for testing
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      bufferCommands: false,
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    isConnected = false;
    // Don't throw error to allow API to work in degraded mode
  }
};

// Health check route (no DB required)
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'Bid & Barter API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    mongodb: !!process.env.MONGODB_URI,
    jwt: !!process.env.JWT_SECRET,
    dbConnected: isConnected
  });
});

// Test route (no DB required)
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'API test successful',
    timestamp: new Date().toISOString(),
    status: 'working'
  });
});

// Import and use routes only if environment variables are set
if (process.env.MONGODB_URI) {
  try {
    const authRoutes = require('./routes/auth');
    const productRoutes = require('./routes/products');
    const newsletterRoutes = require('./routes/newsletter');
    const uploadRoutes = require('./routes/uploads');

    // Routes with error handling
    app.use('/api/auth', async (req, res, next) => {
      try {
        await connectDB();
        next();
      } catch (error) {
        res.status(500).json({ error: 'Database connection failed', details: error.message });
      }
    }, authRoutes);

    app.use('/api/products', async (req, res, next) => {
      try {
        await connectDB();
        next();
      } catch (error) {
        res.status(500).json({ error: 'Database connection failed', details: error.message });
      }
    }, productRoutes);

    app.use('/api/newsletter', async (req, res, next) => {
      try {
        await connectDB();
        next();
      } catch (error) {
        res.status(500).json({ error: 'Database connection failed', details: error.message });
      }
    }, newsletterRoutes);

    app.use('/api/uploads', async (req, res, next) => {
      try {
        await connectDB();
        next();
      } catch (error) {
        res.status(500).json({ error: 'Database connection failed', details: error.message });
      }
    }, uploadRoutes);
    
  } catch (error) {
    console.error('Error loading routes:', error);
  }
} else {
  // Fallback routes when DB is not configured
  app.use('/api/products', (req, res) => {
    res.status(503).json({ 
      error: 'Database not configured', 
      message: 'Please set MONGODB_URI environment variable' 
    });
  });
  
  app.use('/api/auth', (req, res) => {
    res.status(503).json({ 
      error: 'Database not configured', 
      message: 'Please set MONGODB_URI environment variable' 
    });
  });
}

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

module.exports = app;
