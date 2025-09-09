// backend/controllers/otpService.js
const { db } = require("../firebase");

// Save OTP to Firestore
const saveOTP = async (userId, email, otp) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  await db.collection("otps").add({
    userId,
    email,
    otp,
    expiresAt,
    used: false,
  });
};

// Verify OTP is valid and unused
const verifyOTP = async (email, otp) => {
  const otpSnapshot = await db.collection("otps")
    .where("email", "==", email)
    .where("otp", "==", otp)
    .where("used", "==", false)
    .where("expiresAt", ">", new Date())
    .limit(1)
    .get();

  if (otpSnapshot.empty) return null;

  const otpDoc = otpSnapshot.docs[0];
  await db.collection("otps").doc(otpDoc.id).update({ used: true });
  return otpDoc.data().userId;
};

module.exports = { saveOTP, verifyOTP };