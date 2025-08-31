const { auth } = require('../firebase/firebaseAdmin');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// Register - Just creates Firestore user profile
exports.register = async (req, res) => {
  try {
    const { uid, name, email, role } = req.body;

    await db.collection('users').doc(uid).set({
      uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login - Verifies Firebase ID token
exports.login = async (req, res) => {
  const { idToken } = req.body;
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({
      user: userDoc.data()
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { register, login };