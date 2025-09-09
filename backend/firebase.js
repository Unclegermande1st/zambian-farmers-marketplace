// backend/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebase/serviceAccountkey.json");

// Initialize Firebase app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "zambian-farmers-marketplace.appspot.com", // Firebase Storage bucket
});

// Get Firestore and Storage references
const db = admin.firestore();
const storage = admin.storage().bucket();

// Log success
console.log(" Firebase connected successfully!");

// Export both
module.exports = { db, storage };