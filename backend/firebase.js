// backend/firebase.js
const admin = require("firebase-admin");

// ✅ Correct relative path
const serviceAccount = require("./firebase/serviceAccountkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;

console.log("✅ Firebase connected successfully!");