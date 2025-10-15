// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middleware/authMiddleware');

// 🔒 All routes require authentication

// Send a message
router.post('/send', authenticate(), messageController.sendMessage);

// Get inbox (received messages)
router.get('/inbox', authenticate(), messageController.getInbox);

// Get sent messages
router.get('/sent', authenticate(), messageController.getSent);

// Get unread message count
router.get('/unread/count', authenticate(), messageController.getUnreadCount);

// Get conversation with specific user
router.get('/conversation/:userId', authenticate(), messageController.getConversation);

// Get single message by ID (must be sender or receiver)
router.get('/:id', authenticate(), messageController.getMessageById);

// Mark message as read
router.patch('/:id/read', authenticate(), messageController.markAsRead);

// Delete message (only sender can delete)
router.delete('/:id', authenticate(), messageController.deleteMessage);

// Example: Admin-only route (for future use)
// router.get('/all', authenticate('admin'), messageController.getAllMessages);

module.exports = router;
