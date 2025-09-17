// backend/middleware/verifyUser.js

const { auth, admin } = require('../firebase/firebaseAdmin'); // Import Firebase Admin SDK
const db = admin.firestore(); // Initialize Firestore

// Middleware to verify the user via Firebase token
const verifyUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1]; // Extract Bearer token
    const decodedToken = await auth.verifyIdToken(token); // Verify Firebase token

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

// Middleware to authorize user role(s)
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'User role not found' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }

    next();
  };
};

module.exports = { verifyUser, authorizeRole };
