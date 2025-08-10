// routes/userRoute.js
const express = require('express');
const router = express.Router();
const { verifyUser, authorizeRole } = require('../middleware/verifyUser');

// General user profile (any authenticated user)
router.get('/profile', verifyUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to your profile!',
    user: req.user
  });
});

// Example route for farmers only
router.get('/farmer/dashboard', verifyUser, authorizeRole(['farmer']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome, Farmer!',
    user: req.user
  });
});

// Example route for admins only
router.get('/admin/panel', verifyUser, authorizeRole(['admin']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the admin panel',
    user: req.user
  });
});

module.exports = router;
