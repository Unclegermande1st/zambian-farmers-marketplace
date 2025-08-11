// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { admin } = require("../firebase/firebaseAdmin"); // Correct path
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Store user data in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      role,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user in Firebase Auth
    const user = await getAuth().getUserByEmail(email);

    // Get role from Firestore
    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User data not found" });
    }

    return res.json({
      uid: user.uid,
      email: user.email,
      role: doc.data().role,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
