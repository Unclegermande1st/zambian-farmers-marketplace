// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const { db } = require("../firebase");
const { saveOTP, verifyOTP } = require("./otpService");
const { sendOTP } = require("./emailService");
const { createToken } = require("./jwtUtils");
require("dotenv").config();

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Name, email, password, and role are required" });
  }

  try {
    const existingSnapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      verification_status: "unverified",
      created_at: new Date(),
    };
    if (phone) userData.phone = phone;

    const userRef = await db.collection("users").add(userData);
    const userId = userRef.id;

    const otp = generateOTP();
    await saveOTP(userId, email, otp);

    try {
      await sendOTP(email, otp);
      console.log(` OTP sent to ${email}: ${otp}`);
    } catch (emailError) {
      console.warn(` Failed to send OTP to ${email}:`, emailError.message);
      console.log(`🔐 [DEV MODE] OTP for ${email}: ${otp}`);
    }

    res.status(201).json({ message: "Registration successful. Check email for OTP.", userId });

  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Internal server error. " + err.message });
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

  try {
    const userId = await verifyOTP(email, otp);
    if (!userId) return res.status(400).json({ error: "Invalid or expired OTP" });

    const userSnapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) return res.status(404).json({ error: "User not found" });

    await userSnapshot.docs[0].ref.update({ verification_status: "verified" });

    res.json({ message: "Email verified successfully!" });

  } catch (err) {
    console.error(" OTP verification error:", err);
    res.status(500).json({ error: "Internal server error. " + err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const userSnapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) return res.status(404).json({ error: "User not found" });

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    if (userData.verification_status !== "verified") {
      return res.status(403).json({ error: "Please verify your email first" });
    }

    const token = createToken({ userId: userDoc.id, role: userData.role });

    res.json({
      token,
      role: userData.role,
      name: userData.name,
      userId: userDoc.id,
      message: "Login successful"
    });

  } catch (err) {
    console.error(" Login error:", err);
    res.status(500).json({ error: "Internal server error. " + err.message });
  }
};
