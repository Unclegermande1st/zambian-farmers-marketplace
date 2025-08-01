const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes'); //  Import userRoutes.js

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // Mount protected routes

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Zambian Farmers Marketplace API',
    status: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

module.exports = app;
