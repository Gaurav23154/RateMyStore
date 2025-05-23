const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 