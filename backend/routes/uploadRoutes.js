const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authenticate = require('../middleware/authMiddleware');

// POST /api/upload
router.post(
  '/',
  authenticate(),
  uploadController.uploadSingle,
  uploadController.uploadToFirebase
);

module.exports = router;
