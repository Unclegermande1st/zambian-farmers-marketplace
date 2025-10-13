// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // 
const rateLimit = require("express-rate-limit");

// Optional: Rate limiter for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests per window
  message: "Too many OTP requests from this IP, please try again later"
});

// Public routes
router.post("/register", otpLimiter, authController.register);
router.post("/verify-otp", otpLimiter, authController.verifyOTP);
router.post("/login", authController.login);

// Export router
module.exports = router;
