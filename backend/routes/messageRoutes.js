// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middleware/authMiddleware');

// 🔒 Protected Routes: Require authentication

// Any logged-in user can send a message
router.post('/send', authenticate(), messageController.sendMessage);

// Any logged-in user can view their inbox
router.get('/inbox', authenticate(), messageController.getInbox);

// Any logged-in user can view their sent messages
router.get('/sent', authenticate(), messageController.getSent);

// Get a single message by ID (must be sender or receiver)
router.get('/:id', authenticate(), messageController.getMessageById);

// Example: Admin-only route (if needed in future)
// router.get('/all', authenticate('admin'), messageController.getAllMessages);

module.exports = router;
