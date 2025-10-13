// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Middleware
// Correct import
const { verifyUser, authorizeRole } = require('../middleware/verifyUser');


// Import Firebase Admin SDK
const { admin } = require('../firebase/firebaseAdmin');
const db = admin.firestore();

// GET /api/users/profile
router.get('/profile', verifyUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to your profile!',
    user: req.user
  });
});

// GET /api/users/farmer/dashboard
router.get('/farmer/dashboard', verifyUser, authorizeRole(['farmer']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome, Farmer!',
    user: req.user
  });
});

// GET /api/users/admin/panel
router.get('/admin/panel', verifyUser, authorizeRole(['admin']), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the admin panel',
    user: req.user
  });
});

// POST /api/users/verify - Submit NRC & photo for verification
router.post('/verify', verifyUser, authorizeRole(['farmer']), async (req, res) => {
  const { nrcNumber, nrcPhotoUrl } = req.body;
  const { userId } = req.user;

  if (!nrcNumber || !nrcPhotoUrl) {
    return res.status(400).json({
      error: "NRC number and photo are required"
    });
  }

  try {
    await db.collection('users').doc(userId).update({
      nrc_number: nrcNumber,
      nrc_photo_url: nrcPhotoUrl,
      verification_status: "pending",
      updated_at: new Date()
    });

    res.status(200).json({
      message: "Verification submitted successfully! Awaiting admin review."
    });
  } catch (err) {
    console.error("Error submitting verification:", err);
    res.status(500).json({ error: "Failed to submit verification" });
  }
});

module.exports = router;
