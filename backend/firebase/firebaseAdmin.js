// backend/firebase/firebaseAdmin.js

const admin = require('firebase-admin');

// 🔹 Define the correct path to your service account key
const serviceAccount = require('./serviceAccountKey.json'); // ✅ Correct: relative to this file

// 🔹 Only initialize if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://zambian-farmers-marketplace-default-rtdb.firebaseio.com",
      storageBucket: "zambian-farmers-marketplace.appspot.com"
    });
    console.log("✅ Firebase Admin SDK initialized");
  } catch (error) {
    console.error("❌ Error initializing Firebase:", error);
  }
} else {
  // Reuse existing app (important for nodemon/dev)
  console.log("🔁 Using existing Firebase Admin app");
}

// 🔹 Export auth and Firestore db
const auth = admin.auth();
const db = admin.firestore();

module.exports = { admin, auth, db };