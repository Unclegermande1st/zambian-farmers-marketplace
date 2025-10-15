// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

// Rate limiter for OTP requests (prevent spam)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests per window per IP
  message: "Too many OTP requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post("/register", otpLimiter, authController.register);
router.post("/verify-otp", otpLimiter, authController.verifyOTP);
router.post("/resend-otp", otpLimiter, authController.resendOTP); // NEW
router.post("/login", authController.login);

module.exports = router;