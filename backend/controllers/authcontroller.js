const { auth } = require('../firebase/firebaseAdmin');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    try {
      const userRecord = await auth.getUserByEmail(email);
      if (userRecord) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
    } catch (error) {
      if (error.code !== 'auth/user-not-found') throw error;
    }

    // Create user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Save user role in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    });

    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: customToken,
      userId: userRecord.uid,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate Firebase custom token
    const customToken = await auth.createCustomToken(userRecord.uid);

    // Fetch user profile from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    const profile = userDoc.data();

    res.json({
      success: true,
      message: 'Login successful', 
      token: customToken,
      user: {
        uid: userRecord.uid,
        name: userRecord.displayName,
        email: userRecord.email,
        role: profile?.role || 'user',
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};
