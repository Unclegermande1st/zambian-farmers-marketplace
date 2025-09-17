const { db } = require("../firebase");
const authenticate = require("../middleware/authMiddleware");

exports.submitVerification = async (req, res) => {
  const { nrcNumber, nrcPhotoUrl } = req.body;
  const { userId } = req.user;

  try {
    await db.collection("users").doc(userId).update({
      nrc_number: nrcNumber,
      nrc_photo_url: nrcPhotoUrl,
      verification_status: "pending",
      updated_at: new Date(),
    });

    res.json({ message: "Verification submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit verification" });
  }
};