// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/create-session', paymentController.createCheckoutSession);

module.exports = router;