// backend/middleware/authMiddleware.js
const { verifyToken } = require("../controllers/jwtUtils");

/**
 * Middleware to authenticate users and optionally enforce role
 * @param {String} [requiredRole] - optional role ('admin', 'farmer', 'buyer')
 */
const authenticate = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  const decoded = verifyToken(token);

  if (!decoded) return res.status(403).json({ error: "Invalid or expired token." });

  if (requiredRole && decoded.role !== requiredRole) {
    return res.status(403).json({ error: "Access denied. Insufficient permissions." });
  }

  req.user = decoded; // { userId, role }
  next();
};

module.exports = authenticate;
