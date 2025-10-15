const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');

// 🔒 All admin routes require admin role
router.use(authenticate('admin'));

// Dashboard stats
router.get('/stats', adminController.getSystemStats); // <- fixed

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:userId', adminController.deleteUser);

// Verification management
router.get('/verifications', adminController.getVerificationRequests);
// Updated route for reviewing verification requests
router.patch('/verifications/:id', adminController.reviewVerification);

// Order oversight
router.get('/orders', adminController.getAllOrders);

// Product oversight
router.get('/products', adminController.getAllProducts);

module.exports = router;
