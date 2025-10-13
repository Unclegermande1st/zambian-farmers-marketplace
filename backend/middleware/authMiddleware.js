// backend/middleware/authMiddleware.js
const { verifyToken } = require("../controllers/jwtUtils");

/**
 * Middleware to authenticate users via JWT and optionally restrict by role
 * 
 * Usage:
 * - authenticate()               → any logged-in user
 * - authenticate('farmer')       → only farmers
 * - authenticate(['farmer','admin']) → farmers or admins
 * 
 * @param {String|Array} allowedRoles - Optional role(s) to restrict access
 */
const authenticate = (allowedRoles = null) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }

  // Role check if roles are specified
  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required role: ${roles.join(" or ")}` 
      });
    }
  }

  req.user = decoded; // { userId, role }
  next();
};

module.exports = authenticate;
