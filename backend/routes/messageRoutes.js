// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/send', messageController.sendMessage);
router.get('/inbox', messageController.getInbox);
router.get('/sent', messageController.getSent);
router.get('/:id', messageController.getMessageById); // Get single message

module.exports = router;