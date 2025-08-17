// backend/middleware/verifyUser.js

const { auth, admin } = require('../firebase/firebaseAdmin'); // Import Firebase Admin SDK
const db = admin.firestore(); // Initialize Firestore

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1]; // Get the Bearer token
    const decodedToken = await auth.verifyIdToken(token); // Verify the ID token

    // Fetch user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Attach user data to the request object
    req.user = { uid: decodedToken.uid, ...userDoc.data() };

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
