// backend/controllers/jwtUtils.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // Default token valid for 7 days

/**
 * Generate a JWT token for a user
 * @param {Object} user - { id, role }
 * @returns {String} JWT token
 */
function createToken(user) {
  const payload = { userId: user.id, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT token
 * @param {String} token 
 * @returns {Object|null} decoded payload or null if invalid/expired
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return null;
  }
}

module.exports = { createToken, verifyToken };
