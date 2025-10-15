// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/authMiddleware');

// 🔒 Buyer-only: Create Stripe checkout session
router.post('/create-session', authenticate('buyer'), paymentController.createCheckoutSession);

// 🔒 Authenticated: Verify payment session
router.get('/verify-session/:sessionId', authenticate(), paymentController.verifySession);

// ⚡ Public: Stripe webhook (validated by Stripe signature)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook
);

module.exports = router;
