const multer = require('multer');
const { storage } = require('../firebase');
const path = require('path');

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Upload single image
exports.uploadSingle = upload.single('image');

// Upload image to Firebase Storage
exports.uploadToFirebase = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId } = req.user;
    const fileName = `${userId}/${Date.now()}_${req.file.originalname}`;
    const file = storage.file(fileName);

    // Create a write stream
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Handle errors
    stream.on('error', (err) => {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to upload file' });
    });

    // Handle success
    stream.on('finish', async () => {
      // Make the file public
      await file.makePublic();

      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${storage.name}/${fileName}`;

      res.json({
        message: 'File uploaded successfully',
        imageUrl: publicUrl,
        fileName,
      });
    });

    // Pipe the file buffer to Firebase Storage
    stream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};