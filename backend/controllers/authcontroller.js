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

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Check if user already exists
    const existingSnapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      verification_status: "unverified",
      created_at: new Date(),
    };
    if (phone) userData.phone = phone;

    // Save user to Firestore
    const userRef = await db.collection("users").add(userData);
    const userId = userRef.id;

    // Generate OTP
    const otp = generateOTP();

    console.log("💡 Generated OTP for:", email, "OTP:", otp);

    // Save OTP to Firestore
    await saveOTP(userId, email, otp);

    // Attempt to send OTP via email
    let emailSent = false;
    let emailError = null;

    try {
      await sendOTP(email, otp);
      console.log(`✅ OTP sent to ${email}: ${otp}`);
      emailSent = true;
    } catch (emailErr) {
      console.warn(`⚠️ Failed to send OTP email to ${email}:`, emailErr.message);
      emailError = emailErr.message;
      
      // In development, log OTP to console as fallback
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 [DEV MODE] OTP for ${email}: ${otp}`);
      }
    }

    // Return response with appropriate message
    res.status(201).json({
      message: emailSent 
        ? "Registration successful. Check your email for OTP."
        : "Registration successful. OTP generation failed - check server logs.",
      userId,
      ...(process.env.NODE_ENV === 'development' && !emailSent && { devOTP: otp }), // Only in dev mode
      ...(emailError && { emailError: "Email delivery failed. Contact support if needed." })
    });

  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ 
      error: "Internal server error", 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  // Validate OTP format (6 digits)
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: "OTP must be a 6-digit number" });
  }

  try {
    console.log("💡 Verifying OTP for:", email, "OTP entered:", otp);

    const userId = await verifyOTP(email, otp);
    
    if (!userId) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Update user verification status
    const userSnapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    await userSnapshot.docs[0].ref.update({ 
      verification_status: "verified",
      verified_at: new Date()
    });

    console.log(`✅ User verified successfully: ${email}`);

    res.json({ message: "Email verified successfully! You can now log in." });

  } catch (err) {
    console.error("❌ OTP verification error:", err);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userSnapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Check password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check verification status
    if (userData.verification_status !== "verified") {
      return res.status(403).json({ 
        error: "Please verify your email first",
        needsVerification: true
      });
    }

    // Generate JWT token
    const token = createToken({ id: userDoc.id, role: userData.role });

    console.log(`✅ User logged in: ${email}`);

    res.json({
      token,
      role: userData.role,
      name: userData.name,
      userId: userDoc.id,
      message: "Login successful"
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// POST /api/auth/resend-otp (NEW ENDPOINT)
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Check if user exists
    const userSnapshot = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    // Check if already verified
    if (userData.verification_status === "verified") {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    console.log("💡 Resending OTP for:", email, "New OTP:", otp);

    // Save new OTP
    await saveOTP(userId, email, otp);

    // Send OTP
    try {
      await sendOTP(email, otp);
      console.log(`✅ OTP resent to ${email}`);
      
      res.json({ message: "OTP has been resent to your email" });
    } catch (emailErr) {
      console.warn(`⚠️ Failed to resend OTP email:`, emailErr.message);
      
      res.status(500).json({ 
        error: "Failed to send OTP email",
        details: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }

  } catch (err) {
    console.error("❌ Resend OTP error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};