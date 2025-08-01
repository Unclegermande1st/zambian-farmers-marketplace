// backend/firebase/firebaseAdmin.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK once
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Optionally add databaseURL if needed
  // databaseURL: "https://your-project-id.firebaseio.com"
});

// Export both the full admin instance and the auth service if needed
const auth = admin.auth();

module.exports = { admin, auth };
