// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
const db = require('./utils/database');

// Import routes
const productsRouter = require('./routes/products');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/products', productsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'POS Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to POS Ultimate API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      products: '/api/products (coming soon)',
      sales: '/api/sales (coming soon)',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong!',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 POS Backend running on http://localhost:${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
